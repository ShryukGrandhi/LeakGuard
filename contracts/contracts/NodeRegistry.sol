// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title NodeRegistry
 * @dev Asset registration and ownership tracking for Pytheas Energy edge nodes
 * @notice Maps physical wells to blockchain addresses
 */
contract NodeRegistry {
    address public owner;
    uint256 public nodeCount;

    struct Node {
        uint256 id;
        string location;
        address nodeAddress;
        uint256 registeredAt;
        bool active;
        string metadata;
    }

    mapping(uint256 => Node) public nodes;
    mapping(address => uint256) public addressToNodeId;
    mapping(string => uint256) public locationToNodeId;

    event NodeRegistered(
        uint256 indexed nodeId,
        string location,
        address indexed nodeAddress,
        uint256 timestamp
    );

    event NodeDeactivated(
        uint256 indexed nodeId,
        uint256 timestamp
    );

    event NodeReactivated(
        uint256 indexed nodeId,
        uint256 timestamp
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "Only Pytheas HQ can manage nodes");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /**
     * @dev Register a new edge node (well/facility)
     * @param _location Physical location identifier (e.g., "Permian Basin - Well #34")
     * @param _nodeAddress Ethereum address for this node
     * @param _metadata Additional info (GPS coordinates, capacity, etc.)
     */
    function registerNode(
        string memory _location,
        address _nodeAddress,
        string memory _metadata
    ) external onlyOwner returns (uint256) {
        require(_nodeAddress != address(0), "Invalid node address");
        require(addressToNodeId[_nodeAddress] == 0, "Address already registered");
        require(locationToNodeId[_location] == 0, "Location already registered");

        nodeCount++;

        nodes[nodeCount] = Node({
            id: nodeCount,
            location: _location,
            nodeAddress: _nodeAddress,
            registeredAt: block.timestamp,
            active: true,
            metadata: _metadata
        });

        addressToNodeId[_nodeAddress] = nodeCount;
        locationToNodeId[_location] = nodeCount;

        emit NodeRegistered(nodeCount, _location, _nodeAddress, block.timestamp);
        return nodeCount;
    }

    /**
     * @dev Deactivate a node (well shutdown, maintenance, etc.)
     */
    function deactivateNode(uint256 _nodeId) external onlyOwner {
        require(_nodeId > 0 && _nodeId <= nodeCount, "Invalid node ID");
        require(nodes[_nodeId].active, "Node already inactive");

        nodes[_nodeId].active = false;
        emit NodeDeactivated(_nodeId, block.timestamp);
    }

    /**
     * @dev Reactivate a node
     */
    function reactivateNode(uint256 _nodeId) external onlyOwner {
        require(_nodeId > 0 && _nodeId <= nodeCount, "Invalid node ID");
        require(!nodes[_nodeId].active, "Node already active");

        nodes[_nodeId].active = true;
        emit NodeReactivated(_nodeId, block.timestamp);
    }

    /**
     * @dev Get node by ID
     */
    function getNode(uint256 _nodeId) external view returns (Node memory) {
        require(_nodeId > 0 && _nodeId <= nodeCount, "Invalid node ID");
        return nodes[_nodeId];
    }

    /**
     * @dev Get node ID by address
     */
    function getNodeByAddress(address _nodeAddress) external view returns (uint256) {
        return addressToNodeId[_nodeAddress];
    }

    /**
     * @dev Get node ID by location
     */
    function getNodeByLocation(string memory _location) external view returns (uint256) {
        return locationToNodeId[_location];
    }

    /**
     * @dev Get count of active nodes
     */
    function getActiveNodeCount() external view returns (uint256) {
        uint256 activeCount = 0;
        for (uint256 i = 1; i <= nodeCount; i++) {
            if (nodes[i].active) {
                activeCount++;
            }
        }
        return activeCount;
    }

    function transferOwnership(address _newOwner) external onlyOwner {
        require(_newOwner != address(0), "Invalid new owner");
        owner = _newOwner;
    }
}

