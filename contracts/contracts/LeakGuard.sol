// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title LeakGuard
 * @dev Incident recording and insurance automation for Pytheas Energy operations
 * @notice Deployable to Pytheas production infrastructure
 */
contract LeakGuard {
    address public owner;
    uint256 public incidentCount;

    enum IncidentLevel { NORMAL, WARNING, CRITICAL }

    struct Incident {
        uint256 id;
        IncidentLevel level;
        string location;
        uint256 timestamp;
        bool insuranceReleased;
        uint256 insuranceAmount;
        address recipient;
    }

    mapping(uint256 => Incident) public incidents;

    event IncidentRecorded(
        uint256 indexed incidentId,
        IncidentLevel level,
        string location,
        uint256 timestamp
    );

    event InsuranceReleased(
        uint256 indexed incidentId,
        address indexed recipient,
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
     * @dev Record a leak incident on-chain
     * @param _level Severity level (0=NORMAL, 1=WARNING, 2=CRITICAL)
     * @param _location Well identifier (e.g., "Well #34")
     * @param _timestamp Unix timestamp of incident
     */
    function recordIncident(
        IncidentLevel _level,
        string memory _location,
        uint256 _timestamp
    ) external onlyOwner returns (uint256) {
        incidentCount++;
        
        incidents[incidentCount] = Incident({
            id: incidentCount,
            level: _level,
            location: _location,
            timestamp: _timestamp,
            insuranceReleased: false,
            insuranceAmount: 0,
            recipient: address(0)
        });

        emit IncidentRecorded(incidentCount, _level, _location, _timestamp);
        return incidentCount;
    }

    /**
     * @dev Release insurance payment for validated incident
     * @param _incidentId Incident ID to release payment for
     * @param _to Recipient address (repair crew or contractor)
     * @param _amount Payment amount in wei
     */
    function releaseInsurancePayment(
        uint256 _incidentId,
        address _to,
        uint256 _amount
    ) external onlyOwner {
        require(_incidentId > 0 && _incidentId <= incidentCount, "Invalid incident ID");
        require(!incidents[_incidentId].insuranceReleased, "Insurance already released");
        require(_to != address(0), "Invalid recipient");

        incidents[_incidentId].insuranceReleased = true;
        incidents[_incidentId].insuranceAmount = _amount;
        incidents[_incidentId].recipient = _to;

        emit InsuranceReleased(_incidentId, _to, _amount);
    }

    /**
     * @dev Get incident details
     */
    function getIncident(uint256 _incidentId) external view returns (Incident memory) {
        require(_incidentId > 0 && _incidentId <= incidentCount, "Invalid incident ID");
        return incidents[_incidentId];
    }

    /**
     * @dev Transfer ownership to new Pytheas HQ wallet
     */
    function transferOwnership(address _newOwner) external onlyOwner {
        require(_newOwner != address(0), "Invalid new owner");
        owner = _newOwner;
    }
}

