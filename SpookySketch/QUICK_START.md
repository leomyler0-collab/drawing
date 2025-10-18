# 🎃 Quick Start Guide - SpookySketch

## Install & Run in 3 Steps

### Step 1: Install Dependencies

**Windows:**
```cmd
install.bat
```

**macOS/Linux:**
```bash
chmod +x install.sh
./install.sh
```

**Or manually:**
```bash
npm run install:all
```

### Step 2: Configure Environment

**Backend** - Edit `backend/.env`:
```env
MONGODB_URI=mongodb://localhost:27017/spookysketch
JWT_SECRET=your_secret_key_here
```

**Frontend** - Edit `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### Step 3: Run Application

```bash
npm run dev
```

**OR run separately:**

Terminal 1 (Backend):
```bash
cd backend
npm run dev
```

Terminal 2 (Frontend):
```bash
cd frontend
npm run dev
```

---

## Access Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api/health

---

## Troubleshooting

### "Cannot find module" errors
→ Run the install script again: `install.bat` or `./install.sh`

### "Port already in use"
→ Kill the process:
```bash
# Windows
taskkill /F /IM node.exe

# macOS/Linux
killall node
```

### MongoDB connection error
→ Make sure MongoDB is running:
```bash
mongod
```

Or use MongoDB Atlas (cloud) - update MONGODB_URI in backend/.env

---

## Test Without Stripe

The app works fully without Stripe! Just skip payment configuration for local testing.

---

## Need Help?

See `SETUP_GUIDE.md` for detailed instructions.
