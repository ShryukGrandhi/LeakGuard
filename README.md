# LeakGuard-AI

**Multi-agent safety + finance automation platform for oil & gas operations**

Built for the **Assets on Chain Hackathon** (Track 4: Digital Infrastructure & AI Monitoring)  
**Sponsor:** Pytheas Energy Inc.

---

## 🌍 Overview

LeakGuard-AI is a production-ready multi-agent system that combines real-time methane leak detection with blockchain-verified ESG compliance and automated response workflows.

### Architecture
- **Edge Agents** → Monitor each well for methane anomalies
- **Master Agent** → Validates incidents and triggers smart contract actions
- **Blockchain Layer** → Immutable incident logging, ESG credit tokenization, automated bounties

### Narrative
**"Detect locally → Act globally → Prove instantly → Profit sustainably."**

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Git

### Installation

```bash
# Install dependencies
npm install

# Install frontend dependencies
cd frontend && npm install

# Install contract dependencies
cd ../contracts && npm install
cd ..
```

### Run Development Server

```bash
# Start frontend (runs on http://localhost:3000)
npm run dev
```

### Compile Smart Contracts

```bash
# Compile contracts
npm run contracts:compile

# Deploy to local Hardhat network (optional)
cd contracts
npx hardhat node  # Run in separate terminal
npx hardhat run scripts/deploy.js --network localhost
```

---

## 🎨 Features

### Operations View
- **Interactive Google Maps-Style UI** with Pytheas HQ and well locations
  - Multiple map styles: Streets, Satellite, Dark, Light
  - Custom zoom controls and navigation
  - Scale indicator and fullscreen mode
  - Google Maps-style location pins
  - Smooth animations and transitions
- **Real-time Agent Communications** feed
- **Leak Simulation** with full automated response workflow
- **Risk Forecasting** using AI predictive models
- **Blockchain Event Logging** for all incidents

### Investor View
- **ESG Credits Earned** with market valuation
- **Carbon Avoided** metrics (tCO₂e)
- **Insurance Savings** visualization
- **Risk Score Improvement** gauges
- **PDF Export** for ESG reporting

---

## 🧠 Multi-Agent System

### Edge Agent (One per well)
- Continuous methane monitoring
- Anomaly detection: 3 consecutive readings > 2.0 PPM = leak
- Local risk trend analysis (rising/stable/falling)
- Integrity score calculation
- 30-minute predictive forecasting

### Master Agent (Pytheas HQ)
- Aggregates alerts from all edge agents
- Validates incidents
- Triggers smart contract actions:
  - Records incident on-chain
  - Dispatches autonomous drone
  - Creates repair crew bounty
  - Mints ESG credits upon resolution
- Updates investor metrics

---

## 🧱 Smart Contracts

All contracts deployable to Pytheas production infrastructure.

### LeakGuard.sol
- `recordIncident(level, location, timestamp)` - Immutable incident logging
- `releaseInsurancePayment(to, amount)` - Automated insurance claims
- Events: `IncidentRecorded`, `InsuranceReleased`

### ESGCredit.sol
- `mintCredits(assetId, amount)` - Tokenize avoided emissions
- Market value calculation ($50/credit)
- Events: `ESGCreditsMinted`

### OpsBounty.sol
- `createBounty(type, location)` - Automated task dispatch
- `payOutBounty(recipient)` - Contractor payment
- Events: `DroneDispatched`, `CrewTaskCreated`, `BountyPaid`

### NodeRegistry.sol
- `registerNode(location, nodeAddress)` - Asset ownership mapping
- Active node tracking
- Events: `NodeRegistered`, `NodeDeactivated`

---

## 🧪 Live Demo Flow

1. **Select Well #34** → Detail panel opens
2. **Click "START LEAK SIMULATION"** → Marker turns red
3. **Master Agent Triggers:**
   - ✅ On-chain incident log
   - 🚁 Autonomous drone dispatch
   - 👷 Repair crew bounty ($5,000)
4. **Leak Resolved** → ESG credits minted
5. **Toggle Investor View** → See financial impact

**Total Demo Time:** <60 seconds  
**Page Scrolling:** None (single-screen experience)

---

## 💰 Business Value

### For Pytheas Operations
- **Faster Response** - Autonomous detection and dispatch
- **Regulatory Compliance** - Blockchain-verified incident logs
- **Lower Insurance Costs** - Proactive risk reduction

### For Pytheas Finance
- **ESG Revenue** - Tokenized carbon credits ($50/tCO₂e)
- **Risk Financing** - Improved credit terms
- **Investor Reporting** - Automated ESG audit trail

### Pitch
**"Pytheas AI restores production. LeakGuard-AI protects it."**

---

## 📊 Technology Stack

### Frontend
- React 18 + TypeScript
- Vite (fast dev server)
- Tailwind CSS (industrial design system)
- Mapbox GL JS (interactive maps)
- Recharts (financial visualizations)
- Ethers.js (Web3 integration)

### Smart Contracts
- Solidity ^0.8.24
- Hardhat development environment
- OpenZeppelin standards (upgradeable)

### Multi-Agent System
- Custom Edge Agent class (TypeScript)
- Master Agent orchestration
- Real-time event streaming
- AI-based predictive modeling

---

## 🔧 Configuration

### Mapbox Token
Replace the token in `frontend/src/components/MapView.tsx`:
```typescript
const MAPBOX_TOKEN = 'your_token_here';
```
Get a free token at [mapbox.com](https://account.mapbox.com/)

### Wallet Integration
The app runs in **demo mode** by default (no real blockchain transactions).  
To enable live transactions:
1. Connect MetaMask or similar wallet
2. Contracts will execute on connected network
3. All functionality remains stable without wallet

---

## 🏆 Hackathon Compliance

### Track 4: Digital Infrastructure & AI Monitoring
✅ AI-powered anomaly detection  
✅ Multi-agent coordination  
✅ Real-time infrastructure monitoring  
✅ Predictive risk modeling  

### Sponsor Requirements (Pytheas Energy)
✅ Direct deployability messaging throughout UI  
✅ Pytheas branding in header and footer  
✅ Oil & gas industry-specific workflows  
✅ Production-quality code and documentation  

### Acceptance Criteria
✅ Multi-agent alerting system  
✅ Interactive map with HQ + wells  
✅ Real-time data + predictive charts  
✅ Blockchain event logging  
✅ Automated drone/crew workflows  
✅ Tokenized emission credits  
✅ Investor dashboard  
✅ Single-screen experience (no scrolling)  
✅ Stable demo without wallet connection  

---

## 📄 License

MIT License - Built for Assets on Chain Hackathon 2025

---

## 🤝 Contributing

This is a hackathon submission. For questions or collaboration:
- Review smart contracts in `contracts/contracts/`
- Explore multi-agent logic in `frontend/src/agents/`
- Check UI components in `frontend/src/components/`

---

## ⚡ Performance Notes

- Map renders 5 wells + HQ with real-time updates
- Agent messages capped at 50 (rolling window)
- Blockchain events capped at 20 (rolling window)
- Well readings stored for last 30 data points
- All animations GPU-accelerated (CSS transforms)

---

## 🎯 Deployment Checklist

For Pytheas production deployment:

1. **Smart Contracts**
   - [ ] Deploy to target network (Polygon, Ethereum, etc.)
   - [ ] Verify contracts on block explorer
   - [ ] Transfer ownership to Pytheas HQ wallet
   - [ ] Register initial wells in NodeRegistry

2. **Frontend**
   - [ ] Set production Mapbox token
   - [ ] Configure Web3 provider endpoints
   - [ ] Update contract addresses in app
   - [ ] Deploy to CDN/hosting (Vercel, AWS, etc.)

3. **Monitoring**
   - [ ] Connect real well sensor data feeds
   - [ ] Set up alert notification channels
   - [ ] Configure logging and analytics
   - [ ] Test emergency response workflows

---

**Built with 💙 for Pytheas Energy Inc.**

