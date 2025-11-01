// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title ESGCredit
 * @dev Tokenized emission credits for Pytheas Energy sustainability metrics
 * @notice Each credit = 1 tCO2e avoided through leak prevention
 */
contract ESGCredit {
    address public owner;
    uint256 public totalCreditsMinted;

    struct CreditRecord {
        uint256 assetId;
        uint256 amount;
        uint256 timestamp;
        string metadata;
    }

    mapping(uint256 => CreditRecord) public credits;
    mapping(uint256 => uint256) public assetCredits; // assetId => total credits
    uint256 public recordCount;

    event ESGCreditsMinted(
        uint256 indexed recordId,
        uint256 indexed assetId,
        uint256 amount,
        uint256 timestamp
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "Only Pytheas HQ can mint");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /**
     * @dev Mint ESG credits for avoided emissions
     * @param _assetId Well or facility ID
     * @param _amount Credits to mint (in whole units, 1 = 1 tCO2e)
     * @param _metadata Additional context (e.g., "Leak prevented at Well #34")
     */
    function mintCredits(
        uint256 _assetId,
        uint256 _amount,
        string memory _metadata
    ) external onlyOwner returns (uint256) {
        require(_amount > 0, "Amount must be positive");

        recordCount++;
        totalCreditsMinted += _amount;
        assetCredits[_assetId] += _amount;

        credits[recordCount] = CreditRecord({
            assetId: _assetId,
            amount: _amount,
            timestamp: block.timestamp,
            metadata: _metadata
        });

        emit ESGCreditsMinted(recordCount, _assetId, _amount, block.timestamp);
        return recordCount;
    }

    /**
     * @dev Get total credits for a specific asset
     */
    function getAssetCredits(uint256 _assetId) external view returns (uint256) {
        return assetCredits[_assetId];
    }

    /**
     * @dev Get credit record details
     */
    function getCreditRecord(uint256 _recordId) external view returns (CreditRecord memory) {
        require(_recordId > 0 && _recordId <= recordCount, "Invalid record ID");
        return credits[_recordId];
    }

    /**
     * @dev Calculate market value (demo: $50/credit)
     */
    function calculateMarketValue(uint256 _credits) external pure returns (uint256) {
        return _credits * 50; // USD value simulation
    }

    function transferOwnership(address _newOwner) external onlyOwner {
        require(_newOwner != address(0), "Invalid new owner");
        owner = _newOwner;
    }
}

