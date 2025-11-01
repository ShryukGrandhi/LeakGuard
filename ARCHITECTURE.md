# LeakGuard-AI Architecture

## 🏗️ System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    LeakGuard-AI Platform                     │
└─────────────────────────────────────────────────────────────┘

┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│              │         │              │         │              │
│  Edge Agent  │────────▶│ Master Agent │────────▶│  Blockchain  │
│  (Per Well)  │  Alert  │  (HQ)        │  Log    │  (Immutable) │
│              │         │              │         │              │
└──────────────┘         └──────────────┘         └──────────────┘
      │                         │                         │
      │ Methane                 │ Response                │ Events
      │ Readings                │ Triggers                │
      ▼                         ▼                         ▼
┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│              │         │              │         │              │
│ Physical     │         │ • Drone      │         │ • ESG Credits│
│ Well         │         │ • Crew       │         │ • Insurance  │
│ Sensors      │         │ • Insurance  │         │ • Audit Log  │
│              │         │              │         │              │
└──────────────┘         └──────────────┘         └──────────────┘
```

---

## 🧠 Multi-Agent System

### Edge Agent (One Per Well)
**Location:** Deployed at each physical well  
**Language:** TypeScript  
**File:** `frontend/src/agents/EdgeAgent.ts`

**Responsibilities:**
- Monitor methane levels (PPM)
- Detect anomalies (threshold: 3 readings > 2.0 PPM)
- Calculate integrity score (0-100)
- Analyze risk trends (rising/stable/falling)
- Generate 30-minute predictions
- Report to Master Agent

**Decision Logic:**
```typescript
if (last 3 readings > 2.0 PPM) {
  status = "LEAK"
  sendAlert(masterAgent)
}
```

**AI Models:**
- Simple linear regression for trend analysis
- Moving average for smoothing
- Variance calculation for stability

---

### Master Agent (Central HQ)
**Location:** Pytheas HQ (Houston)  
**Language:** TypeScript  
**File:** `frontend/src/agents/MasterAgent.ts`

**Responsibilities:**
- Aggregate alerts from all Edge Agents
- Validate incidents (confirm not false positive)
- Trigger smart contract actions
- Coordinate response workflows
- Update ESG metrics
- Manage blockchain interactions

**Workflow on Leak Alert:**
```
1. Receive alert from Edge Agent
2. Validate anomaly (cross-reference historical data)
3. recordIncident() → Blockchain
4. createBounty(DRONE) → Dispatch drone
5. createBounty(REPAIR) → Assign crew
6. Monitor resolution
7. mintCredits() → ESG tokenization
8. Update investor metrics
```

**Communication Protocol:**
- Event-driven architecture
- Pub/sub pattern for messages
- WebSocket-ready (currently simulated)

---

## 🗺️ Frontend Architecture

### Technology Stack
- **Framework:** React 18 + TypeScript
- **Build Tool:** Vite (fast HMR)
- **Styling:** Tailwind CSS (utility-first)
- **Maps:** Mapbox GL JS
- **Charts:** Recharts
- **State:** React Context API

### Component Hierarchy
```
App
├── AppProvider (Context)
│   └── AppContent
│       ├── Header
│       │   ├── Logo & Location
│       │   ├── Mode Toggle (Operations/Investor)
│       │   ├── Status Chips
│       │   └── Wallet Button
│       ├── AlertFeed (Left Panel)
│       │   └── MessageItem[]
│       ├── MapView (Center)
│       │   ├── HQ Marker
│       │   ├── Well Markers[]
│       │   └── Routing Lines
│       └── Right Panel (Conditional)
│           ├── WellDetailPanel (if Operations + Well Selected)
│           │   ├── Metrics
│           │   ├── Risk Chart
│           │   └── Action Buttons
│           └── InvestorView (if Investor Mode)
│               ├── ESG Metrics
│               ├── Charts
│               └── Export Button
```

### State Management
**Global State (AppContext):**
- `wells[]` - All well data
- `selectedWell` - Currently selected well
- `messages[]` - Agent communications
- `blockchainEvents[]` - On-chain logs
- `esgMetrics` - Financial data
- `viewMode` - Operations/Investor
- `walletState` - Connection status
- `simulationState` - Demo workflow

**Update Patterns:**
- Real-time polling (2s interval for well readings)
- Event-driven updates (agent messages)
- Optimistic UI (instant feedback, blockchain confirms)

---

## ⛓️ Blockchain Architecture

### Smart Contracts

#### 1. LeakGuard.sol
**Purpose:** Incident logging + insurance automation

**Storage:**
```solidity
struct Incident {
  uint256 id;
  IncidentLevel level;
  string location;
  uint256 timestamp;
  bool insuranceReleased;
  uint256 insuranceAmount;
  address recipient;
}
mapping(uint256 => Incident) incidents;
```

**Key Operations:**
- `recordIncident()` - Immutable log
- `releaseInsurancePayment()` - Automated payout

---

#### 2. ESGCredit.sol
**Purpose:** Tokenized carbon credits

**Storage:**
```solidity
struct CreditRecord {
  uint256 assetId;
  uint256 amount;
  uint256 timestamp;
  string metadata;
}
mapping(uint256 => CreditRecord) credits;
```

**Key Operations:**
- `mintCredits()` - Create new credits
- `calculateMarketValue()` - Valuation at $50/credit

---

#### 3. OpsBounty.sol
**Purpose:** Automated task dispatch

**Storage:**
```solidity
struct Bounty {
  uint256 id;
  BountyType type;  // DRONE, REPAIR, EMERGENCY
  string location;
  BountyStatus status;
  address contractor;
  uint256 payoutAmount;
}
mapping(uint256 => Bounty) bounties;
```

**Key Operations:**
- `createBounty()` - Dispatch task
- `completeBounty()` - Mark done
- `payOutBounty()` - Release payment

---

#### 4. NodeRegistry.sol
**Purpose:** Asset ownership mapping

**Storage:**
```solidity
struct Node {
  uint256 id;
  string location;
  address nodeAddress;
  bool active;
  string metadata;
}
mapping(uint256 => Node) nodes;
```

**Key Operations:**
- `registerNode()` - Add new well
- `deactivateNode()` - Mark offline

---

### Blockchain Integration

**Current Mode:** Demo (simulated transactions)
```typescript
// No wallet required
// UI feedback without gas costs
// Perfect for presentation
```

**Production Mode:** Real transactions
```typescript
// MetaMask connection
// ethers.js integration
// Contract ABIs loaded
// Transaction confirmation
```

**Event Listening:**
```typescript
leakGuardContract.on("IncidentRecorded", (id, level, location) => {
  updateUI(id, level, location)
  logToAnalytics(id)
  notifyStakeholders(location)
})
```

---

## 🔄 Data Flow

### 1. Normal Operation
```
Physical Well
  └─> Methane Sensor
      └─> Edge Agent (reads every 2s)
          └─> Store in readings[]
          └─> Calculate integrity score
          └─> Update UI (green marker)
```

### 2. Leak Detection
```
Sensor detects >2.0 PPM
  └─> Edge Agent (3 consecutive readings)
      └─> detectAnomaly() returns true
          └─> Master Agent receives alert
              ├─> recordIncident() [Blockchain]
              ├─> createBounty(DRONE) [Blockchain]
              ├─> createBounty(REPAIR) [Blockchain]
              └─> Update UI (red marker)
```

### 3. Leak Resolution
```
Repair Crew fixes leak
  └─> Master Agent marks resolved
      ├─> mintCredits(50) [Blockchain]
      ├─> Update ESG metrics
      └─> Update UI (green marker)
```

---

## 🎨 UI/UX Design Principles

### Industrial Aesthetic
- ❌ NO bright neon colors
- ❌ NO rounded bubble UI
- ❌ NO "fun AI assistant" vibe
- ✅ Dark command center theme
- ✅ Professional typography
- ✅ Purposeful animations only

### Color Palette
```css
Background:    #0f172a (slate-900)
Cards:         #1e293b (slate-800)
Borders:       #334155 (slate-700)
Text Primary:  #ffffff
Text Secondary:#94a3b8 (slate-400)

Status Colors:
  Normal:  #22c55e (green-500)
  Warning: #eab308 (yellow-500)
  Leak:    #ef4444 (red-500)
  HQ:      #1e40af (blue-700)
```

### Layout Strategy
- **No vertical scroll** - Single screen experience
- **Three-column layout** - Alert feed / Map / Details
- **Internal scrolling** - Only within panels
- **Responsive** - But optimized for desktop (1920x1080+)

---

## 📊 Performance Optimizations

### Frontend
- React.memo for expensive components
- Virtual scrolling for message feed (50 item cap)
- Debounced map updates
- CSS transforms for animations (GPU-accelerated)
- Code splitting (lazy loading)

### Blockchain
- Batch read operations
- Event filters (not polling full chain)
- Local state cache
- Optimistic updates

### Data Storage
- Rolling windows (last 30 readings per well)
- Compression of historical data
- IndexedDB for offline capability (future)

---

## 🔐 Security Considerations

### Smart Contracts
- `onlyOwner` modifier on critical functions
- Input validation (zero address checks, bounds)
- Reentrancy guards (if handling ETH)
- Event emission for audit trail

### Frontend
- No sensitive data in localStorage
- HTTPS only in production
- CSP headers recommended
- Rate limiting on agent messages

### Future: Production Hardening
- Multi-sig wallet for contract ownership
- Time-lock on critical operations
- Bug bounty program
- Third-party audit (Certik, OpenZeppelin)

---

## 🚀 Deployment Strategy

### Development
```
Local Machine
  ├─> Vite Dev Server (port 3000)
  ├─> Hardhat Node (port 8545)
  └─> Hot Module Replacement
```

### Staging
```
Testnet (Goerli/Mumbai)
  ├─> Vercel Preview Deploy
  ├─> Contract Verification
  └─> QA Testing
```

### Production (Pytheas)
```
Mainnet (Ethereum/Polygon)
  ├─> CDN (Cloudflare/AWS)
  ├─> Load Balancer
  ├─> Monitoring (Datadog/New Relic)
  └─> Alerting (PagerDuty)
```

---

## 📈 Scalability

### Current Capacity
- 5 wells in demo
- 2s update interval
- 50 message history
- 20 blockchain events

### Production Scale
- **100+ wells:** Horizontal scaling, message queue (RabbitMQ)
- **1000+ wells:** Database (PostgreSQL), caching (Redis)
- **10,000+ wells:** Microservices, Kubernetes, event streaming (Kafka)

### Blockchain Scaling
- Layer 2 solutions (Polygon, Optimism)
- Batch transactions
- Off-chain computation + on-chain verification (Chainlink)

---

## 🧪 Testing Strategy

### Unit Tests
- Edge Agent detection logic
- Master Agent workflow
- Contract function behavior
- Utility functions

### Integration Tests
- Agent communication
- Contract event handling
- UI state updates

### E2E Tests
- Full leak simulation
- Investor view toggle
- Wallet connection flow

---

## 📦 Dependencies

### Frontend Core
- react: ^18.2.0
- typescript: ^5.3.3
- vite: ^5.0.8

### UI Libraries
- tailwindcss: ^3.4.0
- mapbox-gl: ^2.15.0
- recharts: ^2.10.3
- lucide-react: ^0.294.0

### Blockchain
- ethers: ^6.9.0
- hardhat: ^2.19.4

---

## 🎯 Future Enhancements

### Phase 2
- [ ] WebSocket real-time updates
- [ ] Multi-user collaboration
- [ ] Advanced AI models (LSTM for predictions)
- [ ] Mobile app (React Native)

### Phase 3
- [ ] Integration with real well sensors (IoT)
- [ ] Machine learning anomaly detection
- [ ] Automated trading of ESG credits
- [ ] Decentralized governance (DAO)

---

**Architecture designed for Pytheas Energy production deployment.**

