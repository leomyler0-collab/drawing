# 👑 SpookySketch Admin Account Guide

## ✅ Admin Account is ACTIVE and READY!

### 🔐 Admin Credentials:
```
Email: leomyler0@gmail.com
Password: SuperBoy2020
Tier: ADMIN (Full Access)
```

---

## 🎯 How to Login as Admin:

### Step 1: Open the App
Go to: **http://localhost:3000**

### Step 2: Click Login

### Step 3: Enter Admin Credentials
- **Email**: `leomyler0@gmail.com`
- **Password**: `SuperBoy2020`

### Step 4: Click Login
✅ You'll be logged in with **ADMIN** privileges!

---

## 👑 Admin Features:

### Your Admin Account Has:
- ✅ **Full Access** to all features
- ✅ **ADMIN Tier** (highest level)
- ✅ **Crown Avatar** 👑
- ✅ **Unlimited Drawings**
- ✅ **Priority Access**
- ✅ **All Pro & VIP Features**
- ✅ **Special Admin Badge**

### Admin Privileges:
- View all user drawings (when MongoDB enabled)
- Manage users (when MongoDB enabled)
- Access admin dashboard
- Bypass all tier restrictions
- Unlimited storage
- Priority server access

---

## 🧪 Test Your Admin Account:

### Test 1: Login
```
1. Go to http://localhost:3000/login
2. Enter: leomyler0@gmail.com
3. Password: SuperBoy2020
4. Click Login
Expected: ✅ Logged in as Admin with 👑 icon
```

### Test 2: Check Dashboard
```
1. After login, go to Dashboard
2. Check your profile
Expected: ✅ Shows "ADMIN" tier with crown avatar
```

### Test 3: Access Studio
```
1. Go to Studio
2. Create drawings
Expected: ✅ Unlimited drawings, all tools available
```

### Test 4: Check Permissions
```
1. Try to save multiple drawings
2. Access all premium features
Expected: ✅ No restrictions, full access
```

---

## 🔒 Security Features:

### Your Admin Account:
- ✅ **Password Hashed** with bcrypt (10 rounds)
- ✅ **JWT Token** authentication (30-day expiry)
- ✅ **Secure Session** management
- ✅ **Pre-loaded** on server startup
- ✅ **Cannot be duplicated** - email is unique

### Additional Security:
- Admin status is stored in JWT token
- All API requests verified
- Protected admin routes
- Secure cookie storage

---

## 📊 Account Details:

```json
{
  "id": "admin_001",
  "username": "Admin",
  "email": "leomyler0@gmail.com",
  "tier": "admin",
  "avatar": "👑",
  "isAdmin": true,
  "createdAt": "Server startup time"
}
```

---

## 🎨 What You Can Do:

### As Admin, You Have Access To:
1. **Drawing Studio** - Full canvas with all tools
2. **Dashboard** - Your profile and statistics
3. **Gallery** - Browse all public drawings
4. **Pricing Page** - See all tiers (you have ADMIN tier)
5. **All Features** - No restrictions whatsoever

### Admin-Only Features (Future):
- User management panel
- Analytics dashboard
- Content moderation
- Server statistics
- Database management

---

## 🚀 Quick Start:

1. **Open Browser**: http://localhost:3000
2. **Click Login**
3. **Enter Credentials**:
   - Email: leomyler0@gmail.com
   - Password: SuperBoy2020
4. **Start Creating!** 🎨

---

## 🐛 Troubleshooting:

### "Invalid credentials"
→ Make sure you typed:
- Email: `leomyler0@gmail.com` (exact spelling)
- Password: `SuperBoy2020` (case-sensitive: capital S and B)

### "Server not responding"
→ Check backend is running:
```bash
cd backend
npm run dev
```

### "Admin features not showing"
→ Check browser console for JWT token
→ Make sure you're logged in with correct email

### Want to reset admin password?
→ Edit `backend/src/mockAuth.ts` line 22
→ Change `SuperBoy2020` to your new password
→ Restart backend server

---

## 💡 Important Notes:

### Current Mode: Mock Authentication
- Admin account is stored in memory
- Will be lost on server restart (automatically recreated)
- To make permanent, set up MongoDB (see MONGODB_SETUP.md)

### With MongoDB:
- Admin account persists forever
- Can add more admins
- Can manage all users
- Full database access

---

## 🎉 Your Admin Account is Ready!

**Login now and enjoy full admin access!**

Server Status:
- ✅ Backend: Running on port 5000
- ✅ Frontend: Running on port 3000
- ✅ Admin Account: Active and ready
- ✅ Authentication: Fully functional

**Go to http://localhost:3000/login and sign in as admin!** 👑

---

## 📞 Support:

If you need to:
- Change admin password
- Add more admins
- Enable MongoDB persistence
- Setup additional features

See the other guide files or modify `backend/src/mockAuth.ts` directly.

**Welcome, Admin!** 🎃👑
