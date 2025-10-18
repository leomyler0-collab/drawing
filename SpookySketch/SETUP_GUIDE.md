# 🎃 SpookySketch Setup Guide

## Quick Start (5 Minutes)

### Step 1: Install Dependencies
```bash
# Navigate to SpookySketch folder
cd SpookySketch

# Install all dependencies (frontend + backend)
npm run install:all
```

### Step 2: Setup Environment Variables

**Backend Environment** (Create `backend/.env`):
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/spookysketch
JWT_SECRET=mysecretkey123changethis
STRIPE_SECRET_KEY=sk_test_51xxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxx
CORS_ORIGIN=http://localhost:3000
CLIENT_URL=http://localhost:3000
```

**Frontend Environment** (Create `frontend/.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_STRIPE_KEY=pk_test_51xxxxxxxxx
```

### Step 3: Start MongoDB

**Option A - Local MongoDB:**
```bash
# Install MongoDB: https://www.mongodb.com/try/download/community
# Start MongoDB service
mongod
```

**Option B - MongoDB Atlas (Recommended):**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free cluster
3. Get connection string
4. Update `MONGODB_URI` in `backend/.env`

### Step 4: Setup Stripe (Optional for testing)

1. Go to https://stripe.com
2. Create account
3. Get API keys from Dashboard → Developers → API keys
4. Use test mode keys
5. Update `.env` files with your keys

**For quick testing, payments can be skipped - the app works without Stripe!**

### Step 5: Run the App
```bash
# From root SpookySketch folder
npm run dev
```

This will start:
- Frontend on http://localhost:3000
- Backend on http://localhost:5000

### Step 6: Create Account & Start Drawing!
1. Open http://localhost:3000
2. Click "Sign Up"
3. Create account (username, email, password)
4. Go to "Studio" and start drawing! 🎨

---

## Detailed Setup

### System Requirements
- **Node.js**: v18 or higher
- **npm**: v9 or higher
- **MongoDB**: v6 or higher (or Atlas account)
- **RAM**: 4GB minimum
- **OS**: Windows, macOS, or Linux

### Troubleshooting

#### Port Already in Use
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:3000 | xargs kill
```

#### MongoDB Connection Failed
- Ensure MongoDB is running: `mongod`
- Check connection string in `backend/.env`
- For Atlas: Whitelist your IP address

#### Module Not Found
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm run install:all
```

#### TypeScript Errors
```bash
# Rebuild TypeScript
cd backend
npm run build

cd ../frontend
npm run build
```

---

## Development Workflow

### Running Servers Separately
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### Building for Production
```bash
# Frontend
cd frontend
npm run build
npm start

# Backend
cd backend
npm run build
npm start
```

### Database Reset
```bash
# Connect to MongoDB
mongosh

# Drop database
use spookysketch
db.dropDatabase()
```

---

## Stripe Test Cards

Use these for testing payments:

| Card Number | Result |
|-------------|--------|
| 4242 4242 4242 4242 | Success |
| 4000 0025 0000 3155 | 3D Secure required |
| 4000 0000 0000 9995 | Declined |

- **Expiry**: Any future date (e.g., 12/25)
- **CVC**: Any 3 digits (e.g., 123)
- **ZIP**: Any 5 digits (e.g., 12345)

---

## Features by Tier

### Free Tier (No Payment Required)
✅ 1 saved drawing
✅ Basic brushes
✅ PNG export
✅ Gallery access

### Pro Tier ($4.99/month)
✅ 50 saved drawings
✅ Advanced brushes
✅ Layer system
✅ Cloud storage
✅ SVG export

### VIP Tier ($9.99/month)
✅ Unlimited drawings
✅ All Pro features
✅ Special Halloween brushes
✅ Real-time collaboration
✅ Priority support

---

## Common Issues

### 1. "Cannot connect to server"
- Check if backend is running on port 5000
- Verify `NEXT_PUBLIC_API_URL` in frontend `.env.local`

### 2. "Unauthorized" errors
- Clear browser cookies
- Re-login to get new JWT token

### 3. "Drawing limit reached"
- Upgrade to Pro/VIP tier
- Or delete existing drawing (Free tier = 1 drawing)

### 4. Stripe checkout not working
- Verify Stripe keys are correct
- Use test mode keys for development
- Check browser console for errors

---

## Next Steps

1. ✅ Create account
2. ✅ Draw your first spooky sketch
3. ✅ Save to cloud
4. ✅ Browse gallery
5. ✅ (Optional) Upgrade to Pro/VIP

---

## Support

Need help? 
- Check README.md for detailed docs
- Open issue on GitHub
- Email: support@spookysketch.com

---

**Happy Drawing! 🎃👻🎨**
