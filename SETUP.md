# LeakGuard-AI Setup Guide

## 🚀 Quick Start (5 Minutes)

### Step 1: Install Dependencies

```bash
# From project root
cd frontend
npm install
```

### Step 2: Start Development Server

```bash
# From frontend directory
npm run dev
```

The application will open at **http://localhost:3000**

---

## 🎮 How to Use the Demo

### 1️⃣ Explore the Map
- **Blue HQ marker** = Pytheas HQ in Houston
- **Green well markers** = Active wells across Texas
- Click any well to see details

### 2️⃣ Run Leak Simulation
1. Click **Well #34** (Permian Basin)
2. Right panel opens with well details
3. Click **"🚨 START LEAK SIMULATION"** (red button)
4. Watch the automated workflow:
   - Edge Agent detects anomaly
   - Marker turns red
   - Master Agent validates
   - Drone dispatched
   - Repair crew assigned
   - ESG credits minted
   - Well returns to normal

**Duration:** ~10-15 seconds

### 3️⃣ Toggle Investor View
1. Click **"Investor"** button in header
2. See financial analytics:
   - ESG credits earned
   - Carbon avoided
   - Insurance savings
   - Risk improvement metrics

### 4️⃣ Monitor Agent Communications
- **Left panel** shows real-time messages
- Edge Agents report readings
- Master Agent coordinates responses
- System logs blockchain events

---

## 🧪 Testing Smart Contracts (Optional)

### Install Contract Dependencies
```bash
cd contracts
npm install
```

### Compile Contracts
```bash
npx hardhat compile
```

### Deploy to Local Network
```bash
# Terminal 1: Start local blockchain
npx hardhat node

# Terminal 2: Deploy contracts
npx hardhat run scripts/deploy.js --network localhost
```

---

## 🗺️ Mapbox Configuration (Optional)

The app uses a demo Mapbox token. For production:

1. Get free token at [mapbox.com/signup](https://account.mapbox.com/signup/)
2. Update token in `frontend/src/components/MapView.tsx`:
   ```typescript
   const MAPBOX_TOKEN = 'your_token_here';
   ```

---

## 🔧 Troubleshooting

### Port Already in Use
```bash
# Change port in frontend/vite.config.ts
server: {
  port: 3001  // Change from 3000
}
```

### Dependencies Won't Install
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Map Not Loading
- Check browser console for errors
- Verify Mapbox token is valid
- Ensure internet connection (Mapbox tiles load from CDN)

### Wallet Connection Issues
- Demo mode works without wallet
- MetaMask not required for demo
- Real transactions require Web3 wallet

---

## 📱 Browser Compatibility

**Recommended:** Chrome, Edge, Firefox (latest)  
**Minimum:** Chrome 90+, Firefox 88+, Safari 14+

---

## 🎯 Production Deployment

### Build for Production
```bash
cd frontend
npm run build
```

Output in `frontend/dist/` directory.

### Deploy Options
- **Vercel:** `vercel deploy`
- **Netlify:** Drag & drop `dist` folder
- **AWS S3:** Upload `dist` to S3 bucket
- **GitHub Pages:** Enable in repo settings

---

## 🔐 Environment Variables (Optional)

Create `frontend/.env` for custom config:

```env
VITE_MAPBOX_TOKEN=your_token
VITE_CONTRACT_ADDRESS_LEAKGUARD=0x...
VITE_CONTRACT_ADDRESS_ESGCREDIT=0x...
VITE_CONTRACT_ADDRESS_OPSBOUNTY=0x...
VITE_CONTRACT_ADDRESS_NODEREGISTRY=0x...
```

---

## 📊 Architecture Overview

```
LeakGuard-AI/
├── frontend/              # React + TypeScript UI
│   ├── src/
│   │   ├── agents/       # Multi-agent system
│   │   ├── components/   # UI components
│   │   ├── contexts/     # State management
│   │   └── types/        # TypeScript definitions
├── contracts/            # Solidity smart contracts
│   ├── contracts/        # .sol files
│   └── scripts/          # Deployment scripts
└── README.md            # Documentation
```

---

## 🎬 Demo Script for Presentation

**Opening (5 sec)**
> "LeakGuard-AI is a multi-agent system for Pytheas Energy that detects leaks, triggers autonomous responses, and generates ESG credits."

**Show Map (5 sec)**
> "Pytheas HQ in Houston monitors wells across Texas in real-time."

**Run Simulation (15 sec)**
> "Watch: I click Well #34, hit START LEAK SIMULATION..."
> [Wait for workflow to complete]
> "...and in 15 seconds, we've detected, responded, and minted ESG credits."

**Show Investor View (10 sec)**
> "Investors see carbon avoided, insurance savings, and revenue from tokenized credits."

**Closing (5 sec)**
> "Every avoided leak = verified ESG credits + lower risk financing. Deployable to Pytheas infrastructure today."

**Total Time:** 40 seconds

---

## 💡 Key Features to Highlight

✅ **Multi-Agent AI** - Edge + Master agent coordination  
✅ **Real-Time Monitoring** - Live methane readings  
✅ **Predictive Analytics** - 30-minute risk forecast  
✅ **Blockchain Verified** - Immutable incident logs  
✅ **Automated Response** - Drone + crew dispatch  
✅ **ESG Tokenization** - Monetized sustainability  
✅ **Investor Dashboard** - Financial impact metrics  
✅ **Zero-Scroll UI** - Single-screen command center  

---

## 📞 Support

For questions or issues:
1. Check browser console for errors
2. Review README.md for detailed docs
3. Inspect agent messages in left panel
4. Verify all dependencies installed

---

**Built for Assets on Chain Hackathon 2025**  
**Sponsor: Pytheas Energy Inc.**

