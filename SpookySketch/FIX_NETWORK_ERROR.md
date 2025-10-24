# 🔧 Fix "Cannot Load Users - Network Error"

## What This Error Means
The admin dashboard can't connect to the backend server. This happens when:
1. Backend server is not running
2. MongoDB is not connected
3. Wrong API URL configured
4. CORS issues

---

## ⚡ Quick Fix (5 Steps)

### Step 1: Create Frontend Environment File

Create a file: `frontend/.env.local` with this content:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

**How to create it:**
```bash
# Go to frontend folder
cd frontend

# Copy from example (Windows)
copy .env.example .env.local

# OR manually create .env.local with the content above
```

### Step 2: Create Backend Environment File

Create a file: `backend/.env` with this content:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/spookysketch
JWT_SECRET=supersecretkey123
CORS_ORIGIN=http://localhost:3000
CLIENT_URL=http://localhost:3000
```

**How to create it:**
```bash
# Go to backend folder
cd backend

# Manually create .env with the content above
```

### Step 3: Start MongoDB

**Option A - Using MongoDB Atlas (Easiest - No Installation):**

1. Go to https://www.mongodb.com/cloud/atlas
2. Click "Try Free"
3. Create account and cluster (takes 5 minutes)
4. Click "Connect" → "Connect your application"
5. Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/`)
6. Update your `backend/.env` file:
   ```env
   MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/spookysketch
   ```

**Option B - Local MongoDB (If already installed):**

```bash
# Windows - Start MongoDB service
net start MongoDB

# OR run mongod directly
mongod

# Mac/Linux
brew services start mongodb-community
```

**If MongoDB is NOT installed:**
- Download from: https://www.mongodb.com/try/download/community
- OR use MongoDB Atlas (Option A above - recommended!)

### Step 4: Start Backend Server

```bash
# Go to backend folder
cd backend

# Install dependencies if not done
npm install

# Start the server
npm run dev
```

**You should see:**
```
✅ Connected to MongoDB
👑 Admin account exists and ready!
👑 VIP account exists and ready! (ronet@gmail.com)
💎 VIP account exists and ready! (nicky23@gmail.com)
🚀 Server running on port 5000
```

**If you see errors:**
- ❌ MongoDB connection failed → Check Step 3
- ❌ Port already in use → Change PORT in backend/.env to 5001

### Step 5: Start Frontend

**In a NEW terminal window:**

```bash
# Go to frontend folder
cd frontend

# Install dependencies if not done
npm install

# Start the development server
npm run dev
```

**You should see:**
```
✓ Ready on http://localhost:3000
```

---

## ✅ Test If It Works

1. Open browser: http://localhost:3000/login
2. Click "Login as Admin" quick button
3. Go to User Management
4. You should see all 3 users (Admin, Janet, Nicky23)

**If you still see the error:**
- Check both terminals are running (backend + frontend)
- Check backend says "Connected to MongoDB"
- Try refreshing the page (F5)

---

## 🎯 Complete Terminal Commands

**Terminal 1 (Backend):**
```bash
cd c:\Users\leomy\OneDrive\Desktop\Drawing\SpookySketch\backend
npm install
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd c:\Users\leomy\OneDrive\Desktop\Drawing\SpookySketch\frontend
npm install
npm run dev
```

---

## 🌐 Production/Deployment Fix

If you're deploying to Vercel/Netlify:

### Frontend (Vercel):
1. Go to your project settings
2. Add Environment Variable:
   - Name: `NEXT_PUBLIC_API_URL`
   - Value: `https://your-backend-url.com` (your actual backend URL)

### Backend (Railway/Render/Heroku):
1. Add MongoDB Atlas connection string to environment variables
2. Set `MONGODB_URI` to your Atlas connection string
3. Set `CORS_ORIGIN` to your frontend URL (e.g., `https://your-app.vercel.app`)

---

## 🔍 Troubleshooting

### Error: "Port 5000 is already in use"
**Solution:**
```bash
# Change backend port in backend/.env
PORT=5001

# Then update frontend/.env.local
NEXT_PUBLIC_API_URL=http://localhost:5001
```

### Error: "MongoDB connection failed"
**Solutions:**
1. **If using local MongoDB:** Make sure MongoDB service is running
2. **If using Atlas:** Check your connection string has the correct password
3. **Common issue:** Replace `<password>` in Atlas connection string with your actual password

### Error: "Cannot find module"
**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Frontend builds but admin shows error
**Check:**
1. Backend terminal - is it running?
2. Backend terminal - does it say "Connected to MongoDB"?
3. Browser console (F12) - what's the actual error?

---

## 📊 Checklist

Before asking for help, verify:

- [ ] Created `frontend/.env.local` with NEXT_PUBLIC_API_URL
- [ ] Created `backend/.env` with MONGODB_URI
- [ ] MongoDB is running (Atlas or local)
- [ ] Backend terminal shows "Connected to MongoDB"
- [ ] Backend terminal shows "Server running on port 5000"
- [ ] Frontend terminal shows "Ready on http://localhost:3000"
- [ ] Both terminals are still running (not crashed)
- [ ] Tried refreshing browser (F5)

---

## 🎉 Success!

Once everything is running, you should see:

**Admin Dashboard:**
- ✅ Can see all users (Admin, Janet, Nicky23)
- ✅ Users auto-refresh every 5 seconds
- ✅ Works across all browsers/networks
- ✅ Real MongoDB data

**VIP Dashboards:**
- ✅ Janet sees purple/pink royal dashboard 👑
- ✅ Nicky23 sees cyan/diamond dashboard 💎
- ✅ Both have unlimited everything

---

## 💡 Pro Tips

1. **Keep terminals open:** Don't close backend/frontend terminals while using the app
2. **MongoDB Atlas:** Easier than local MongoDB, works everywhere
3. **Check backend first:** If admin doesn't load users, backend is the issue
4. **Browser cache:** Try Ctrl+Shift+R (hard refresh) if changes don't show

---

## 📞 Still Having Issues?

1. Check backend terminal for error messages
2. Open browser console (F12) → Console tab
3. Share the error message from backend terminal
4. Share the error from browser console

Common backend errors and fixes:
- `EADDRINUSE` → Port already in use, change PORT in .env
- `MongoNetworkError` → MongoDB not running or wrong connection string
- `UnhandledPromiseRejection` → Check all environment variables are set

---

**Remember:** You need THREE things running:
1. 🔷 MongoDB (Atlas or local service)
2. 🟢 Backend server (Terminal 1)
3. 🔵 Frontend server (Terminal 2)

If ANY of these is not running, you'll see the "Network Error" message!
