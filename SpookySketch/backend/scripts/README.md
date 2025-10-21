# VIP Account Creation Script

## 📋 VIP Accounts

This script creates 2 VIP accounts with the following credentials:

### Account 1 👑
- **Email:** ronet@gmail.com
- **Username:** Janet
- **Password:** janet
- **Tier:** VIP
- **Avatar:** 👑

### Account 2 💎
- **Email:** nicky23@gmail.com
- **Username:** Nicky23
- **Password:** maina
- **Tier:** VIP
- **Avatar:** 💎

## 🚀 How to Run

### Method 1: Using npm script (Recommended)
```bash
cd SpookySketch/backend
npm run create:vip
```

### Method 2: Using batch file (Windows)
```bash
cd SpookySketch/backend
create-vip.bat
```

### Method 3: Direct node command
```bash
cd SpookySketch/backend
node scripts/create-vip-accounts.js
```

## ⚙️ Prerequisites

1. **MongoDB must be running**
   - Local: `mongod` running on `mongodb://localhost:27017`
   - Or: MongoDB URI in `.env` file

2. **Environment Setup**
   - Make sure `backend/.env` has `MONGODB_URI` configured
   - Example: `MONGODB_URI=mongodb://localhost:27017/spookysketch`

3. **Dependencies installed**
   ```bash
   cd backend
   npm install
   ```

## ✅ What the Script Does

1. Connects to your MongoDB database
2. Checks if accounts already exist (by email or username)
3. If account exists:
   - Updates tier to VIP if not already
   - Skips if already VIP
4. If account doesn't exist:
   - Creates new user with VIP tier
   - Hashes the password securely
   - Sets custom avatar

## 🔐 Security

- Passwords are hashed using bcrypt before storing
- Same security as the signup endpoint
- Safe to run multiple times (won't create duplicates)

## 📝 Testing the Accounts

After running the script, you can:

1. **Login via frontend:**
   - Go to `/login`
   - Use email and password from above
   - You'll have full VIP features

2. **Test VIP features:**
   - Unlimited drawing storage
   - All premium features unlocked
   - Priority support badge

3. **View in Admin Panel:**
   - Login as admin
   - Go to User Management
   - See the new VIP accounts listed

## 🛠️ Troubleshooting

### Error: "Cannot connect to MongoDB"
- **Solution:** Make sure MongoDB is running
- Check `.env` file has correct `MONGODB_URI`

### Error: "User already exists"
- **Solution:** This is normal! The script will update existing users to VIP tier

### Error: "Module not found"
- **Solution:** Run `npm install` in the backend folder

## 🎯 Next Steps

After creating the VIP accounts:
1. Test login with both accounts
2. Verify VIP features work
3. Check admin panel shows them as VIP users
4. Users can create unlimited drawings
5. Users have access to all premium features

---

**Created:** October 21, 2025
**Purpose:** Testing VIP tier features and functionality
