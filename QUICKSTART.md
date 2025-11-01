# ⚡ LeakGuard-AI Quick Start

## 🎯 Goal: Run the demo in 3 minutes

---

## Step 1: Install Dependencies (1 min)

Open terminal in project root:

```bash
cd frontend
npm install
```

Wait for installation to complete.

---

## Step 2: Start the App (30 sec)

```bash
npm run dev
```

You'll see:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

Open **http://localhost:3000** in your browser.

---

## Step 3: Run the Demo (90 sec)

### What You'll See
- **Google Maps-style interactive map** with Pytheas HQ (blue) in Houston
- **5 Google Maps-style location pins** (wells) across Texas
- **Map style switcher** (Streets, Satellite, Dark, Light views)
- **Zoom controls** and navigation (just like Google Maps)
- **Left panel:** Agent communication feed
- **Top bar:** Status metrics and wallet button

### Demo the Key Feature
1. **Click "Well #34"** (Permian Basin marker)
2. Right panel opens with well details
3. **Click the red button:** "🚨 START LEAK SIMULATION"
4. Watch the magic:
   - ⚠️ Edge Agent detects rising methane
   - 🚨 Leak confirmed (marker turns red)
   - 🔍 Master Agent validates
   - 🚁 Drone dispatched (on-chain event)
   - 👷 Repair crew assigned
   - ✅ Leak resolved
   - 💚 ESG credits minted
   - ✨ Well returns to green

**Total time:** 10-15 seconds

### View Investor Metrics
1. Click **"Investor"** button in top bar
2. See:
   - ESG Credits Earned
   - Carbon Avoided (tCO₂e)
   - Insurance Savings chart
   - Risk Score Improvement
   - Market value calculations

---

## ✅ Success Checklist

You know it's working when:
- ✅ Map loads with 5 wells + HQ
- ✅ Left panel shows "System Online" message
- ✅ Clicking a well opens right panel
- ✅ Simulation button triggers workflow
- ✅ Messages appear in real-time
- ✅ No page scrolling (everything on one screen)

---

## 🐛 Troubleshooting

### "Cannot find module" errors
```bash
# Delete and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Port 3000 already in use
```bash
# Kill the process
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:3000 | xargs kill -9
```

### Map shows grey tiles
- Check internet connection (Mapbox loads from CDN)
- Open browser console (F12) and check for errors
- Demo token should work, but you can get your own at [mapbox.com](https://account.mapbox.com/)

---

## 🎬 Presentation Tips

### 40-Second Pitch
1. **Setup (5s):** "LeakGuard-AI monitors Pytheas wells in real-time using multi-agent AI."
2. **Demo (20s):** "Watch this: I click Well #34, simulate a leak... and within seconds, we've detected it, dispatched a drone, assigned a repair crew, and minted ESG credits—all automated and blockchain-verified."
3. **Business Value (10s):** "Toggle to Investor View: every avoided leak generates tokenized carbon credits worth $50 each, reduces insurance costs, and improves financing terms."
4. **Close (5s):** "Deployable to Pytheas infrastructure today."

### What to Highlight
- ✨ **Multi-agent coordination** (Edge + Master)
- ✨ **Real-time detection** (methane threshold)
- ✨ **Automated response** (no human intervention)
- ✨ **Blockchain verification** (immutable logs)
- ✨ **ESG monetization** (tokenized credits)
- ✨ **Investor transparency** (financial dashboard)

---

## 📁 Project Structure at a Glance

```
LeakGuard_Cursor/
│
├── frontend/              ← React app
│   ├── src/
│   │   ├── agents/       ← EdgeAgent + MasterAgent
│   │   ├── components/   ← UI components
│   │   └── contexts/     ← App state
│   └── package.json
│
├── contracts/            ← Solidity contracts
│   ├── contracts/        ← LeakGuard, ESGCredit, etc.
│   └── scripts/          ← Deployment
│
├── README.md            ← Full documentation
├── SETUP.md             ← Detailed setup guide
├── CONTRACTS.md         ← Smart contract docs
└── QUICKSTART.md        ← This file
```

---

## 🔥 Advanced: Run Smart Contracts

Only if you want to see contract deployment:

```bash
# Terminal 1
cd contracts
npm install
npx hardhat node

# Terminal 2 (new terminal)
cd contracts
npx hardhat run scripts/deploy.js --network localhost
```

You'll see contract addresses. **Not required for demo.**

---

## 🎯 Next Steps

1. ✅ Run the app
2. ✅ Try the leak simulation
3. ✅ Toggle investor view
4. ✅ Read README.md for architecture details
5. ✅ Review CONTRACTS.md for blockchain logic
6. ✅ Check agent code in `frontend/src/agents/`

---

## 💡 Key Features Demo Checklist

Use this during presentation:

- [ ] Show map with HQ + 5 wells
- [ ] Point out real-time agent messages
- [ ] Click Well #34
- [ ] Show risk forecast chart
- [ ] Click "START LEAK SIMULATION"
- [ ] Narrate the workflow as it happens
- [ ] Point out on-chain events
- [ ] Toggle to Investor View
- [ ] Show ESG credits and savings
- [ ] Read the quote: "Every avoided leak = Verified ESG credits + lower risk financing"

---

## 🏆 Hackathon Judging Points

**What makes this special:**

1. **Multi-Agent AI** - Not just monitoring, but coordinated intelligence
2. **Real Predictive Models** - 30-min forecast with trend analysis
3. **Full Blockchain Integration** - 4 production-ready contracts
4. **Zero-Scroll UX** - True command center experience
5. **Dual Audience** - Operations + Investors in one platform
6. **Direct Deployability** - Built for Pytheas from day 1
7. **ESG Monetization** - Sustainability becomes revenue

---

## 📞 Need Help?

1. Check browser console (F12) for errors
2. Read README.md for details
3. Review SETUP.md for troubleshooting
4. Inspect left panel messages for system status

---

**You're ready to present! 🚀**

*Built for Assets on Chain Hackathon 2025*  
*Sponsor: Pytheas Energy Inc.*

