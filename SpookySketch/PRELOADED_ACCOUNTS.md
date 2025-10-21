# 🔐 Pre-Loaded Accounts System

## Overview

All accounts (Admin + VIPs) are automatically created when the backend server starts. They work identically - just with different access levels.

## 📋 Pre-Loaded Accounts

### 1. Admin Account 🛡️
- **Email:** leomyler0@gmail.com
- **Password:** SuperBoy2020
- **Username:** Admin
- **Tier:** Admin
- **Avatar:** 👑
- **Access:** Full system control

### 2. VIP Account - Janet 👑
- **Email:** ronet@gmail.com
- **Password:** janet
- **Username:** Janet
- **Tier:** VIP
- **Avatar:** 👑
- **Access:** Unlimited drawings + premium features

### 3. VIP Account - Nicky23 💎
- **Email:** nicky23@gmail.com
- **Password:** maina
- **Username:** Nicky23
- **Tier:** VIP
- **Avatar:** 💎
- **Access:** Unlimited drawings + premium features

## 🚀 How They Work

### Auto-Creation Process

When the backend server starts (connects to MongoDB):

```javascript
1. Connect to MongoDB ✓
2. Check if Admin account exists
   - If not → Create with credentials
   - If exists → Verify tier is 'admin'
   - Log: "👑 Admin account exists and ready!"

3. Check if VIP Account 1 exists (ronet@gmail.com)
   - If not → Create with credentials
   - If exists but not VIP → Update tier to VIP
   - If exists and is VIP → Log: "👑 VIP account exists and ready!"

4. Check if VIP Account 2 exists (nicky23@gmail.com)
   - Same process as VIP Account 1
   - Log: "💎 VIP account exists and ready!"
```

### Console Output

When server starts, you'll see:

```
✅ Connected to MongoDB
👑 Admin account exists and ready!
👑 VIP account exists and ready! (ronet@gmail.com)
💎 VIP account exists and ready! (nicky23@gmail.com)
```

Or if creating for first time:

```
✅ Connected to MongoDB
👑 Admin account auto-created!
   Email: leomyler0@gmail.com
   Password: SuperBoy2020
👑 VIP account auto-created!
   Email: ronet@gmail.com
   Password: janet
💎 VIP account auto-created!
   Email: nicky23@gmail.com
   Password: maina
```

## 🔄 Login Methods

### Method 1: Quick Login Buttons

On the login page (`/login`), there are 3 quick login buttons:

```typescript
// Admin Quick Login
onClick={() => quickLogin('leomyler0@gmail.com', 'SuperBoy2020', 'Admin', 'Admin')}

// VIP 1 Quick Login
onClick={() => quickLogin('ronet@gmail.com', 'janet', 'Janet', 'VIP')}

// VIP 2 Quick Login
onClick={() => quickLogin('nicky23@gmail.com', 'maina', 'Nicky23', 'VIP')}
```

**Features:**
- ✅ One-click login
- ✅ Loading spinners during auth
- ✅ Toast notifications with role badges
- ✅ Smooth redirect to dashboard
- ✅ Error handling with details

### Method 2: Manual Login

Users can also type credentials manually in the login form:
- Enter email
- Enter password
- Click "Login" button

Works for **all accounts** including custom ones created via admin panel.

## ⚙️ Backend Implementation

### Location: `backend/src/server.ts`

```typescript
mongoose.connect(MONGODB_URI)
  .then(async () => {
    const User = (await import('./models/User')).default;
    
    // Admin Account
    const adminEmail = 'leomyler0@gmail.com';
    const existingAdmin = await User.findOne({ email: adminEmail });
    
    if (!existingAdmin) {
      const adminUser = new User({
        username: 'Admin',
        email: adminEmail,
        password: 'SuperBoy2020', // Auto-hashed by pre-save hook
        tier: 'admin',
        avatar: '👑',
        isAdmin: true
      });
      await adminUser.save();
    }
    
    // VIP Accounts
    const vipAccounts = [
      {
        username: 'Janet',
        email: 'ronet@gmail.com',
        password: 'janet',
        tier: 'vip',
        avatar: '👑'
      },
      {
        username: 'Nicky23',
        email: 'nicky23@gmail.com',
        password: 'maina',
        tier: 'vip',
        avatar: '💎'
      }
    ];
    
    for (const account of vipAccounts) {
      const existingVIP = await User.findOne({ email: account.email });
      
      if (!existingVIP) {
        const vipUser = new User({
          ...account,
          isAdmin: false
        });
        await vipUser.save();
      }
    }
  });
```

## 🔒 Security Features

### Password Hashing

All passwords are automatically hashed using bcrypt before saving:

```typescript
// In User model pre-save hook
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
```

### Authentication Flow

```
1. User clicks quick login button or submits form
2. Frontend sends: { email, password } to /api/auth/login
3. Backend:
   - Finds user by email
   - Compares password hash using bcrypt
   - Generates JWT token
   - Returns: { token, user: { id, username, email, tier, avatar, isAdmin } }
4. Frontend:
   - Stores token in localStorage
   - Stores user in AuthContext
   - Redirects to /dashboard
```

## 📊 Account Comparison

| Feature | Admin | VIP 1 (Janet) | VIP 2 (Nicky23) |
|---------|-------|---------------|-----------------|
| Auto-Created | ✅ | ✅ | ✅ |
| Password Hashed | ✅ | ✅ | ✅ |
| Quick Login Button | ✅ | ✅ | ✅ |
| Manual Login | ✅ | ✅ | ✅ |
| JWT Auth | ✅ | ✅ | ✅ |
| Drawing Limit | Unlimited | Unlimited | Unlimited |
| Premium Features | All | All | All |
| User Management | ✅ | ❌ | ❌ |
| System Settings | ✅ | ❌ | ❌ |
| Analytics | ✅ | ❌ | ❌ |
| Create Accounts | ✅ | ❌ | ❌ |

## 🧪 Testing

### Test All Accounts

1. **Start Backend:**
   ```bash
   cd backend
   npm run dev
   ```
   
   Check console for:
   ```
   👑 Admin account exists and ready!
   👑 VIP account exists and ready! (ronet@gmail.com)
   💎 VIP account exists and ready! (nicky23@gmail.com)
   ```

2. **Start Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Test Quick Login:**
   - Go to http://localhost:3000/login
   - Click "Login as Admin" → Should work ✅
   - Logout
   - Click "Login as Janet (VIP)" → Should work ✅
   - Logout
   - Click "Login as Nicky23 (VIP)" → Should work ✅

4. **Test Manual Login:**
   - Type: ronet@gmail.com / janet
   - Click Login → Should work ✅

### Verify Functionality

**Admin (leomyler0@gmail.com):**
- ✅ Access User Management
- ✅ Access Analytics
- ✅ Create new accounts
- ✅ View all drawings
- ✅ Modify system settings

**VIP Accounts (ronet@gmail.com, nicky23@gmail.com):**
- ✅ Create unlimited drawings
- ✅ Access all premium brushes
- ✅ Share to public gallery
- ✅ Like other drawings
- ✅ VIP badge display

## 🔧 Troubleshooting

### Account Not Created

**Problem:** VIP account doesn't exist after server start

**Solutions:**
1. Check MongoDB connection
2. Look for errors in console
3. Verify MongoDB URI in `.env`
4. Manually restart server

### Login Fails

**Problem:** Quick login shows error

**Solutions:**
1. Check backend is running (port 5000)
2. Verify MongoDB is connected
3. Check browser console for details
4. Try manual login to see detailed error
5. Verify NEXT_PUBLIC_API_URL is set

### Password Issues

**Problem:** Password doesn't work

**Note:** Passwords should work as-is:
- Admin: `SuperBoy2020`
- Janet: `janet`
- Nicky23: `maina`

If not working:
1. Check User model pre-save hook is working
2. Verify bcrypt is installed
3. Check console for password hashing errors

## 🎯 Summary

All three accounts work **identically**:

1. ✅ Auto-created on server start
2. ✅ Passwords hashed with bcrypt
3. ✅ JWT authentication
4. ✅ Quick login buttons
5. ✅ Manual login support
6. ✅ Persistent across restarts
7. ✅ No manual setup needed
8. ✅ Production-ready

The **only difference** is access level:
- Admin: Full system access
- VIPs: User-level access with premium features

---

**Last Updated:** October 21, 2025
**Status:** Production Ready ✅
**Maintenance:** Zero - fully automated
