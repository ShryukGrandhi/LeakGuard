# LeakGuard-AI Smart Contracts

## 📜 Contract Architecture

All contracts are designed for **direct deployment to Pytheas Energy production infrastructure**.

---

## 1. LeakGuard.sol

**Purpose:** Incident recording and insurance automation

### Key Functions

#### `recordIncident(level, location, timestamp)`
Records a methane leak incident on-chain with immutable timestamp.

```solidity
function recordIncident(
    IncidentLevel _level,      // 0=NORMAL, 1=WARNING, 2=CRITICAL
    string memory _location,   // Well identifier
    uint256 _timestamp         // Unix timestamp
) external onlyOwner returns (uint256)
```

**Returns:** Incident ID  
**Emits:** `IncidentRecorded(incidentId, level, location, timestamp)`

#### `releaseInsurancePayment(incidentId, to, amount)`
Releases insurance payment for validated incident.

```solidity
function releaseInsurancePayment(
    uint256 _incidentId,
    address _to,               // Recipient (repair crew)
    uint256 _amount            // Payment in wei
) external onlyOwner
```

**Emits:** `InsuranceReleased(incidentId, recipient, amount)`

### Access Control
- Owner: Pytheas HQ wallet
- Only owner can record incidents and release payments
- Ownership transferrable for operational flexibility

---

## 2. ESGCredit.sol

**Purpose:** Tokenized emission credits for sustainability metrics

### Key Functions

#### `mintCredits(assetId, amount, metadata)`
Mints ESG credits for avoided emissions.

```solidity
function mintCredits(
    uint256 _assetId,          // Well/facility ID
    uint256 _amount,           // Credits (1 = 1 tCO2e)
    string memory _metadata    // Context string
) external onlyOwner returns (uint256)
```

**Returns:** Record ID  
**Emits:** `ESGCreditsMinted(recordId, assetId, amount, timestamp)`

#### `calculateMarketValue(credits)`
Calculates market value of credits at $50/credit.

```solidity
function calculateMarketValue(uint256 _credits) 
    external pure returns (uint256)
```

**Returns:** USD value (simplified for demo)

### Credit Accounting
- Each credit = 1 tCO₂e avoided
- Total credits tracked globally
- Per-asset credits tracked separately
- Immutable audit trail

---

## 3. OpsBounty.sol

**Purpose:** Automated task dispatch and contractor payment

### Key Functions

#### `createBounty(bountyType, location)`
Creates and dispatches operational bounty.

```solidity
function createBounty(
    BountyType _bountyType,    // 0=DRONE, 1=REPAIR, 2=EMERGENCY
    string memory _location
) external onlyOwner returns (uint256)
```

**Returns:** Bounty ID  
**Emits:** `DroneDispatched(bountyId, location, timestamp)` OR  
           `CrewTaskCreated(bountyId, location, timestamp)`

#### `completeBounty(bountyId, contractor)`
Marks bounty as completed by contractor.

```solidity
function completeBounty(
    uint256 _bountyId,
    address _contractor
) external onlyOwner
```

**Emits:** `BountyCompleted(bountyId, contractor, timestamp)`

#### `payOutBounty(bountyId, amount)`
Releases payment to contractor.

```solidity
function payOutBounty(
    uint256 _bountyId,
    uint256 _amount
) external onlyOwner
```

**Emits:** `BountyPaid(bountyId, contractor, amount)`

### Workflow
1. Leak detected → `createBounty(DRONE, "Well #34")`
2. Drone completes → `completeBounty(1, droneOperatorAddress)`
3. Payment release → `payOutBounty(1, 5000 USD)`

---

## 4. NodeRegistry.sol

**Purpose:** Asset ownership and edge node management

### Key Functions

#### `registerNode(location, nodeAddress, metadata)`
Registers a new well/facility on-chain.

```solidity
function registerNode(
    string memory _location,      // Physical identifier
    address _nodeAddress,         // ETH address for this node
    string memory _metadata       // GPS, capacity, etc.
) external onlyOwner returns (uint256)
```

**Returns:** Node ID  
**Emits:** `NodeRegistered(nodeId, location, nodeAddress, timestamp)`

#### `deactivateNode(nodeId)`
Marks node as inactive (maintenance, shutdown).

```solidity
function deactivateNode(uint256 _nodeId) external onlyOwner
```

**Emits:** `NodeDeactivated(nodeId, timestamp)`

#### `getActiveNodeCount()`
Returns count of currently active nodes.

```solidity
function getActiveNodeCount() external view returns (uint256)
```

### Use Cases
- Track asset ownership on-chain
- Map physical wells to blockchain addresses
- Maintain operational status
- Generate fleet analytics

---

## 🔒 Security Features

### Access Control
- All critical functions are `onlyOwner`
- Owner = Pytheas HQ wallet address
- Ownership transferrable for operational continuity

### Input Validation
- Zero address checks
- Boundary validation on IDs
- State machine enforcement (e.g., can't pay incomplete bounty)

### Immutability
- Incident records cannot be altered
- Credit minting is append-only
- Audit trail preserved forever

---

## 📊 Event Logging

All contracts emit events for:
- Off-chain indexing
- Dashboard updates
- Audit compliance
- Third-party integrations

### Example: Listening for Incidents
```javascript
leakGuardContract.on("IncidentRecorded", (incidentId, level, location, timestamp) => {
  console.log(`New incident ${incidentId} at ${location}`);
  updateDashboard(incidentId);
});
```

---

## 🚀 Deployment

### Local Testing
```bash
cd contracts
npx hardhat compile
npx hardhat test
```

### Deploy to Network
```bash
# Edit hardhat.config.js with network details
npx hardhat run scripts/deploy.js --network <network>
```

### Supported Networks
- Hardhat (local development)
- Ethereum Mainnet
- Polygon
- Arbitrum
- Optimism
- Any EVM-compatible chain

---

## 💰 Gas Optimization

### Techniques Used
- Minimal storage usage
- Efficient data structures
- Batch operations where possible
- Event emission for off-chain data

### Estimated Gas Costs
- `recordIncident`: ~50k gas
- `mintCredits`: ~60k gas
- `createBounty`: ~55k gas
- `registerNode`: ~70k gas

*(Exact costs vary by network)*

---

## 🧪 Testing Contracts

```bash
cd contracts
npx hardhat test
```

### Test Coverage
- ✅ Incident recording
- ✅ Insurance payment flow
- ✅ ESG credit minting
- ✅ Bounty lifecycle
- ✅ Node registration
- ✅ Access control
- ✅ Event emissions

---

## 📄 Contract ABIs

After compilation, ABIs are in:
```
contracts/artifacts/contracts/[ContractName].sol/[ContractName].json
```

Use these ABIs in the frontend with ethers.js:
```javascript
import LeakGuardABI from './artifacts/contracts/LeakGuard.sol/LeakGuard.json';

const contract = new ethers.Contract(
  contractAddress,
  LeakGuardABI.abi,
  signer
);
```

---

## 🔧 Upgradeability

Current contracts are **non-upgradeable** for:
- Simplicity
- Trustlessness
- Audit clarity

For production, consider:
- OpenZeppelin proxy pattern
- TimelockController for governance
- Multi-sig wallet for ownership

---

## 📚 Standards Compliance

- **ERC-20 Compatible** (ESGCredit can be extended)
- **Ownable Pattern** (access control)
- **Event-Driven Architecture** (EIP standards)

---

## 🎯 Production Checklist

Before Pytheas production deployment:

- [ ] Audit contracts (Certik, OpenZeppelin, etc.)
- [ ] Deploy to testnet first (Goerli, Mumbai)
- [ ] Verify contracts on block explorer
- [ ] Set up multi-sig for owner role
- [ ] Configure event monitoring
- [ ] Document recovery procedures
- [ ] Establish upgrade governance
- [ ] Train Pytheas team on contract interaction

---

## 📞 Integration Points

### Frontend → Contracts
```javascript
// Record incident
await leakGuardContract.recordIncident(2, "Well #34", Date.now());

// Mint ESG credits
await esgCreditContract.mintCredits(34, 50, "Leak prevented");

// Dispatch drone
await opsBountyContract.createBounty(0, "Well #34");
```

### Backend → Contracts
- Use ethers.js or web3.py
- Monitor events with filters
- Batch read operations for efficiency

---

**Deployable to Pytheas Energy infrastructure today.**

