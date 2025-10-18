# 🎃 MongoDB Setup for SpookySketch

## Option 1: MongoDB Atlas (Recommended - Free & Easy)

### Step 1: Create MongoDB Atlas Account
1. Go to https://www.mongodb.com/cloud/atlas/register
2. Sign up for free (no credit card required)
3. Create a **Free Tier** (M0) cluster

### Step 2: Configure Database
1. **Create Database User**:
   - Go to Database Access → Add New Database User
   - Username: `spookysketch`
   - Password: Generate a secure password (save it!)
   - Built-in Role: Read and write to any database

2. **Whitelist IP Address**:
   - Go to Network Access → Add IP Address
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Confirm

### Step 3: Get Connection String
1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Copy the connection string (looks like):
   ```
   mongodb+srv://spookysketch:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
4. Replace `<password>` with your actual password
5. Add database name: `mongodb+srv://spookysketch:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/spookysketch?retryWrites=true&w=majority`

### Step 4: Update Backend .env
Edit `backend\.env`:
```env
MONGODB_URI=mongodb+srv://spookysketch:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/spookysketch?retryWrites=true&w=majority
```

### Step 5: Restart Backend Server
```bash
cd backend
npm run dev
```

**Done! Authentication will now work!** 🎉

---

## Option 2: Local MongoDB (Advanced)

### Download & Install
1. Download from: https://www.mongodb.com/try/download/community
2. Install MongoDB Community Server
3. Start MongoDB:
   ```bash
   mongod
   ```

### Update .env
```env
MONGODB_URI=mongodb://localhost:27017/spookysketch
```

---

## ⚡ Quick Test (No Setup Required)

For immediate testing, I've created an in-memory mock authentication system that works without MongoDB.

See: `backend/src/mockAuth.ts`

---

## Verification

Once MongoDB is connected, you'll see:
```
✅ Connected to MongoDB
🎃 SpookySketch Server running on port 5000
```

Instead of:
```
⚠️  MongoDB connection failed
```

---

**Recommended**: Use MongoDB Atlas - it's free, reliable, and takes 5 minutes to set up!
