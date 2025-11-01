# 🚀 GET STARTED NOW!

## Step-by-Step First Run

### 1️⃣ Open Terminal
- Press `Ctrl + ~` in Cursor (or open any terminal)
- Make sure you're in the project root: `LeakGuard_Cursor`

### 2️⃣ Navigate to Frontend
```bash
cd frontend
```

### 3️⃣ Install Dependencies
```bash
npm install
```

This will take 1-2 minutes. You'll see packages being downloaded.

### 4️⃣ Start the App
```bash
npm run dev
```

You should see:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:3000/
```

### 5️⃣ Open Your Browser
- Go to: **http://localhost:3000**
- You should see the dark map with Pytheas HQ and 5 wells

---

## 🎮 Try the Demo

### First Look
- **Center:** Dark map with Houston (blue HQ marker) and 5 green wells
- **Left Panel:** Real-time agent messages
- **Top Bar:** Status metrics and controls

### Run the Main Demo
1. **Click on the green "Well #34" marker** (Permian Basin)
2. Right panel opens with well details
3. **Click the red button: "🚨 START LEAK SIMULATION"**
4. Watch for 10-15 seconds:
   - Marker turns red
   - Messages appear in left panel
   - Drone gets dispatched
   - Repair crew assigned
   - ESG credits minted
   - Well goes back to normal

### Try Investor View
1. Click **"Investor"** in the top bar (mode toggle)
2. See financial metrics:
   - ESG Credits Earned
   - Carbon Avoided
   - Insurance Savings chart
   - Risk improvements

### Toggle Back
- Click **"Operations"** to return to map view

---

## ✅ Everything Working?

You should see:
- ✅ Dark map with markers
- ✅ "System Online" message in left panel
- ✅ Clicking wells opens right panel
- ✅ Simulation runs smoothly
- ✅ No console errors (press F12 to check)

---

## 📚 Next: Read the Docs

Now that it's working, explore:

1. **QUICKSTART.md** - 3-minute overview
2. **PRESENTATION.md** - How to pitch this
3. **README.md** - Full documentation
4. **ARCHITECTURE.md** - How it all works
5. **CONTRACTS.md** - Smart contract details

---

## 🎤 Preparing for Hackathon?

1. Practice the demo 3-5 times
2. Read PRESENTATION.md for the pitch script
3. Make sure you can answer: "How does it work?"
4. Have this open during presentation: http://localhost:3000

---

## 🐛 Something Not Working?

### Can't install packages?
```bash
# Clear cache
rm -rf node_modules package-lock.json
npm install
```

### Port 3000 already in use?
Edit `frontend/vite.config.ts`:
```typescript
server: {
  port: 3001  // Change to any free port
}
```

### Map not loading?
- Check internet connection
- Open browser console (F12) for errors
- The demo Mapbox token should work fine

---

## 💡 Quick Tips

- **Don't scroll the page** - Everything is on one screen
- **Let simulation finish** - Takes 10-15 seconds
- **Toggle between views** - Operations vs Investor
- **Watch the left panel** - Real-time agent messages
- **Click different wells** - Each has its own data

---

## 🎯 You're All Set!

The app is now running. Try the demo, explore the features, and read the documentation to understand how everything works.

**Good luck with the hackathon! 🏆**

