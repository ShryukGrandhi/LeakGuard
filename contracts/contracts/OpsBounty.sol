// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title OpsBounty
 * @dev Automated task dispatch and payment for Pytheas field operations
 * @notice Drone inspections, repair crews, emergency response
 */
contract OpsBounty {
    address public owner;
    uint256 public bountyCount;

    enum BountyType { DRONE_INSPECTION, REPAIR_CREW, EMERGENCY_RESPONSE }
    enum BountyStatus { CREATED, DISPATCHED, COMPLETED, PAID }

    struct Bounty {
        uint256 id;
        BountyType bountyType;
        string location;
        uint256 createdAt;
        uint256 dispatchedAt;
        uint256 completedAt;
        BountyStatus status;
        address contractor;
        uint256 payoutAmount;
    }

    mapping(uint256 => Bounty) public bounties;

    event DroneDispatched(
        uint256 indexed bountyId,
        string location,
        uint256 timestamp
    );

    event CrewTaskCreated(
        uint256 indexed bountyId,
        string location,
        uint256 timestamp
    );

    event BountyCompleted(
        uint256 indexed bountyId,
        address indexed contractor,
        uint256 timestamp
    );

    event BountyPaid(
        uint256 indexed bountyId,
        address indexed contractor,
        uint256 amount
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "Only Pytheas HQ can execute");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /**
     * @dev Create and dispatch a new operations bounty
     * @param _bountyType Type of task (0=DRONE, 1=REPAIR, 2=EMERGENCY)
     * @param _location Well or facility location
     */
    function createBounty(
        BountyType _bountyType,
        string memory _location
    ) external onlyOwner returns (uint256) {
        bountyCount++;

        bounties[bountyCount] = Bounty({
            id: bountyCount,
            bountyType: _bountyType,
            location: _location,
            createdAt: block.timestamp,
            dispatchedAt: block.timestamp,
            completedAt: 0,
            status: BountyStatus.DISPATCHED,
            contractor: address(0),
            payoutAmount: 0
        });

        if (_bountyType == BountyType.DRONE_INSPECTION) {
            emit DroneDispatched(bountyCount, _location, block.timestamp);
        } else {
            emit CrewTaskCreated(bountyCount, _location, block.timestamp);
        }

        return bountyCount;
    }

    /**
     * @dev Mark bounty as completed by contractor
     * @param _bountyId Bounty ID
     * @param _contractor Address of completing contractor
     */
    function completeBounty(
        uint256 _bountyId,
        address _contractor
    ) external onlyOwner {
        require(_bountyId > 0 && _bountyId <= bountyCount, "Invalid bounty ID");
        require(bounties[_bountyId].status == BountyStatus.DISPATCHED, "Bounty not active");

        bounties[_bountyId].status = BountyStatus.COMPLETED;
        bounties[_bountyId].completedAt = block.timestamp;
        bounties[_bountyId].contractor = _contractor;

        emit BountyCompleted(_bountyId, _contractor, block.timestamp);
    }

    /**
     * @dev Release payment to contractor
     * @param _bountyId Bounty ID
     * @param _amount Payment amount
     */
    function payOutBounty(
        uint256 _bountyId,
        uint256 _amount
    ) external onlyOwner {
        require(_bountyId > 0 && _bountyId <= bountyCount, "Invalid bounty ID");
        require(bounties[_bountyId].status == BountyStatus.COMPLETED, "Bounty not completed");
        require(bounties[_bountyId].contractor != address(0), "No contractor assigned");

        bounties[_bountyId].status = BountyStatus.PAID;
        bounties[_bountyId].payoutAmount = _amount;

        emit BountyPaid(_bountyId, bounties[_bountyId].contractor, _amount);
    }

    /**
     * @dev Get bounty details
     */
    function getBounty(uint256 _bountyId) external view returns (Bounty memory) {
        require(_bountyId > 0 && _bountyId <= bountyCount, "Invalid bounty ID");
        return bounties[_bountyId];
    }

    function transferOwnership(address _newOwner) external onlyOwner {
        require(_newOwner != address(0), "Invalid new owner");
        owner = _newOwner;
    }
}

