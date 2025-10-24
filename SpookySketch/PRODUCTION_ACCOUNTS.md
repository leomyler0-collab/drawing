# 🔐 Production Accounts Configuration

## Overview

SpookySketch has **3 pre-configured accounts** for production use. All are auto-created when the backend starts.

---

## 👑 Account 1: Admin (leomyler0@gmail.com)

### Credentials
```
Email:    leomyler0@gmail.com
Password: SuperBoy2020
Username: Admin
Tier:     admin
Avatar:   👑
isAdmin:  true ✅
```

### Permissions
- ✅ Full system access
- ✅ User management (view, edit, delete all users)
- ✅ Analytics dashboard
- ✅ System settings
- ✅ Drawing management (all users)
- ✅ Create new accounts
- ✅ See ALL users across all networks/browsers
- ✅ Real-time MongoDB access

### Dashboard
- **AdminDashboard** - Red/Purple theme
- Full control panel
- User management interface
- System analytics
- Drawing moderation tools

---

## 👑 Account 2: Janet (VIP - No Admin Powers)

### Credentials
```
Email:    ronet@gmail.com
Password: janet
Username: Janet
Tier:     vip
Avatar:   👑
isAdmin:  false ❌ (NO ADMIN ACCESS)
```

### Permissions
- ❌ Cannot access user management
- ❌ Cannot see other users
- ❌ Cannot access admin dashboard
- ❌ Cannot modify system settings
- ✅ Unlimited personal drawings
- ✅ All premium VIP features
- ✅ Custom elite dashboard
- ✅ Upload to public gallery
- ✅ Like and view other art

### Dashboard
- **JanetVIPDashboard** - Royal Purple/Pink/Orange theme
- "Janet's Royal Studio" branding
- Animated crown with sparkles
- 5 elite power cards
- Personal drawings only
- No admin tools

---

## 💎 Account 3: Nicky23 (VIP - No Admin Powers)

### Credentials
```
Email:    nicky23@gmail.com
Password: maina
Username: Nicky23
Tier:     vip
Avatar:   💎
isAdmin:  false ❌ (NO ADMIN ACCESS)
```

### Permissions
- ❌ Cannot access user management
- ❌ Cannot see other users
- ❌ Cannot access admin dashboard
- ❌ Cannot modify system settings
- ✅ Unlimited personal drawings
- ✅ All premium VIP features
- ✅ Custom elite dashboard
- ✅ Upload to public gallery
- ✅ Like and view other art

### Dashboard
- **Nicky23VIPDashboard** - Diamond Cyan/Purple/Pink theme
- "Nicky23's Diamond Studio" branding
- Animated diamond with gem
- 5 elite power cards
- Personal drawings only
- No admin tools

---

## 🔒 Permission Comparison

| Feature | Admin | Janet (VIP) | Nicky23 (VIP) |
|---------|-------|-------------|---------------|
| **isAdmin Flag** | ✅ true | ❌ false | ❌ false |
| **User Management** | ✅ | ❌ | ❌ |
| **See All Users** | ✅ | ❌ | ❌ |
| **System Settings** | ✅ | ❌ | ❌ |
| **Analytics** | ✅ | ❌ | ❌ |
| **Create Accounts** | ✅ | ❌ | ❌ |
| **Delete Any User** | ✅ | ❌ | ❌ |
| **Moderate Drawings** | ✅ | ❌ | ❌ |
| **Unlimited Drawings** | ✅ | ✅ | ✅ |
| **Premium Features** | ✅ | ✅ | ✅ |
| **Custom Dashboard** | ✅ | ✅ | ✅ |
| **Public Gallery** | ✅ | ✅ | ✅ |

---

## 🛡️ Backend Security Implementation

### Admin Check Middleware
```typescript
// backend/src/middleware/auth.ts
export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user?.isAdmin) {
    return res.status(403).json({ 
      error: 'Admin access required' 
    });
  }
  next();
};
```

### VIP Account Creation (No Admin Powers)
```typescript
// backend/src/server.ts
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
  const vipUser = new User({
    ...account,
    isAdmin: false  // ❌ NO ADMIN POWERS
  });
  await vipUser.save();
}
```

---

## 📊 Complete MongoDB Backend Integration

### All Backend Endpoints Connected

#### Authentication Endpoints
- ✅ `POST /api/auth/signup` - Create new account
- ✅ `POST /api/auth/login` - User login (all accounts)
- ✅ `GET /api/auth/me` - Get current user
- ✅ `POST /api/auth/logout` - User logout

#### User Endpoints
- ✅ `GET /api/user/profile` - Get own profile
- ✅ `PUT /api/user/profile` - Update own profile
- ✅ `GET /api/user/stats` - Get own stats

#### Drawing Endpoints
- ✅ `POST /api/drawings/create` - Create drawing
- ✅ `GET /api/drawings/list` - Get own drawings
- ✅ `GET /api/drawings/:id` - Get single drawing
- ✅ `PUT /api/drawings/:id` - Update own drawing
- ✅ `DELETE /api/drawings/:id` - Delete own drawing
- ✅ `GET /api/drawings/gallery/public` - Public gallery
- ✅ `POST /api/drawings/:id/like` - Like drawing
- ✅ `POST /api/drawings/:id/unlike` - Unlike drawing
- ✅ `PATCH /api/drawings/:id/visibility` - Toggle public/private

#### Admin-Only Endpoints (Requires isAdmin=true)
- ✅ `GET /api/admin/users` - Get ALL users
- ✅ `GET /api/admin/users/:id` - Get user details
- ✅ `PUT /api/admin/users/:id/tier` - Update user tier
- ✅ `DELETE /api/admin/users/:id` - Delete user
- ✅ `GET /api/admin/analytics` - System analytics
- ✅ `GET /api/admin/drawings` - All drawings
- ✅ `DELETE /api/admin/drawings/:id` - Delete any drawing
- ✅ `GET /api/admin/settings` - System settings
- ✅ `PUT /api/admin/settings` - Update settings
- ✅ `POST /api/admin/create-account` - Create account

---

## 🔐 Login Methods

### Manual Login (Production Method)
Users must enter credentials manually:

1. Go to `/login`
2. Enter email and password
3. Click "Login"
4. Auto-routes to appropriate dashboard

**No test buttons** - Professional production setup

---

## 🧪 Testing Account Access

### Test Admin Access
```bash
1. Login: leomyler0@gmail.com / SuperBoy2020
2. Verify: Admin Dashboard appears
3. Check: User Management accessible
4. Verify: Can see all 3 users
5. Confirm: isAdmin = true
```

### Test Janet (No Admin Powers)
```bash
1. Login: ronet@gmail.com / janet
2. Verify: Janet's Royal Dashboard appears
3. Check: NO user management option
4. Try: Access /admin → Should get 403 Forbidden
5. Verify: Only sees own drawings
6. Confirm: isAdmin = false
```

### Test Nicky23 (No Admin Powers)
```bash
1. Login: nicky23@gmail.com / maina
2. Verify: Nicky23's Diamond Dashboard appears
3. Check: NO user management option
4. Try: Access /admin → Should get 403 Forbidden
5. Verify: Only sees own drawings
6. Confirm: isAdmin = false
```

---

## 🎯 Dashboard Routing Logic

```typescript
// frontend/src/app/dashboard/page.tsx

// VIP routing (Janet & Nicky23)
if (user.tier === 'vip') {
  if (user.email === 'ronet@gmail.com' || user.username === 'Janet') {
    return <JanetVIPDashboard />;  // No admin access
  }
  if (user.email === 'nicky23@gmail.com' || user.username === 'Nicky23') {
    return <Nicky23VIPDashboard />;  // No admin access
  }
  return <VipDashboard />;  // Standard VIP
}

// Admin routing (Only leomyler0@gmail.com)
if (user.tier === 'admin') {
  return <AdminDashboard />;  // Full admin access
}
```

---

## 📦 Database Schema

### User Model
```typescript
{
  username: String,
  email: String (unique),
  password: String (bcrypt hashed),
  tier: 'free' | 'pro' | 'vip' | 'admin',
  avatar: String,
  isAdmin: Boolean,  // ❌ false for Janet & Nicky23
  createdAt: Date,
  updatedAt: Date
}
```

---

## ✅ Production Checklist

- [x] Admin account (leomyler0@gmail.com) - isAdmin: true
- [x] Janet VIP account (ronet@gmail.com) - isAdmin: false
- [x] Nicky23 VIP account (nicky23@gmail.com) - isAdmin: false
- [x] All accounts auto-created on server start
- [x] Passwords securely hashed with bcrypt
- [x] Admin middleware protects admin routes
- [x] VIPs cannot access admin endpoints
- [x] Custom dashboards for each VIP
- [x] Manual login required (no test buttons)
- [x] All MongoDB endpoints connected
- [x] JWT authentication working
- [x] CORS properly configured

---

## 🚀 Summary

### Admin (YOU)
- ✅ **Full control** over entire system
- ✅ **isAdmin: true**
- ✅ Can manage all users
- ✅ Access to all features

### Janet & Nicky23 (VIPs)
- ❌ **NO admin powers** (isAdmin: false)
- ❌ Cannot see user management
- ❌ Cannot access admin tools
- ✅ Unlimited VIP features
- ✅ Custom elite dashboards
- ✅ Premium drawing tools

**Security:** Only YOU (leomyler0@gmail.com) have admin access. Janet and Nicky23 are regular VIP users with premium features but NO administrative capabilities.

---

**Status:** ✅ Production ready with proper security
**Login:** Manual entry only (professional setup)
**Backend:** Fully connected to MongoDB
**Security:** Admin routes protected by isAdmin middleware
