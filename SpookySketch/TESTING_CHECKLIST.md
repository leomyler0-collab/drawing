# 🧪 SpookySketch Testing Checklist

## ✅ Multi-Tier Dashboard System Testing

### 🛡️ Admin Account Testing

**Login Credentials:**
```
Email: leomyler0@gmail.com
Password: SuperBoy2020
```

**Expected Results:**
- [ ] Login successful
- [ ] Redirects to Admin Dashboard (red theme)
- [ ] Shows "ADMIN TIER" with Shield icon
- [ ] Displays "ADMIN + PRO + VIP" badges
- [ ] Has admin control panel button
- [ ] Stats show "Unlimited" for drawings
- [ ] Quick actions include admin-specific options
- [ ] Drawings have "ADMIN" badge
- [ ] No upgrade prompts shown

**Admin Features to Test:**
- [ ] Click "Admin Panel" button - should show/hide panel
- [ ] Admin panel shows system stats
- [ ] Can create unlimited drawings
- [ ] All Pro features accessible
- [ ] All VIP features accessible

---

### 🆓 Free Account Testing

**Steps:**
1. Logout from admin
2. Click "Sign Up"
3. Create new account (any email/password)

**Expected Results:**
- [ ] Signup successful
- [ ] Redirects to Free Dashboard (gray theme)
- [ ] Shows "FREE TIER" label
- [ ] Displays limitations banner (1 Drawing Max, Basic Brushes, etc.)
- [ ] Stats show "0 / 1" drawings
- [ ] Has prominent "Upgrade" buttons
- [ ] No VIP/Pro features visible

**Free Tier Limitations:**
- [ ] Can create only 1 drawing
- [ ] After 1 drawing, shows "Storage Limit Reached" prompt
- [ ] Upgrade buttons everywhere
- [ ] Only basic tools available

---

### ⚡ Pro Account Testing

**Note:** Currently requires manual tier change in localStorage or backend

**Expected Results:**
- [ ] Shows Pro Dashboard (orange theme)
- [ ] "PRO TIER" label with Zap icon
- [ ] "PRO Features Unlocked" banner
- [ ] Stats show "X / 50" drawings
- [ ] 4 quick action cards
- [ ] Drawings have "PRO" badge
- [ ] Can save up to 50 drawings
- [ ] Shows "Upgrade to VIP" option

---

### 👑 VIP Account Testing

**Note:** Currently requires manual tier change in localStorage or backend

**Expected Results:**
- [ ] Shows VIP Dashboard (purple/gradient theme)
- [ ] "VIP TIER" with Crown icon
- [ ] "VIP Exclusive Features" banner
- [ ] Stats show "X drawings" with "Unlimited" label
- [ ] 5 quick action cards with gradients
- [ ] Drawings have "VIP" badge with Crown
- [ ] No storage limits
- [ ] No upgrade prompts
- [ ] Thank you banner displayed

---

## 🔐 User Isolation Testing

### Test Data Separation

**Steps:**
1. Login as User A
2. Create 2-3 drawings (give them unique names)
3. Note the drawing count and names
4. Logout
5. Login as User B (different account)
6. Create 1-2 drawings (different names)
7. Check dashboard

**Expected Results:**
- [ ] User B only sees their own drawings (1-2 drawings)
- [ ] User B does NOT see User A's drawings
- [ ] User B's stats only count their drawings
- [ ] Logout and login back as User A
- [ ] User A still sees only their drawings (2-3 drawings)
- [ ] No data mixing between users

---

## 🎨 Drawing Canvas Testing

### Test User-Specific Saves

**Steps:**
1. Login as any user
2. Go to Studio
3. Draw something
4. Press Ctrl+S or click Save
5. Enter a title
6. Save drawing

**Expected Results:**
- [ ] Drawing saves successfully
- [ ] Toast shows "Drawing saved locally!"
- [ ] Drawing appears in user's dashboard
- [ ] Drawing has correct userId attached
- [ ] Other users cannot see this drawing

---

## 💰 Pricing Page Testing

### Admin Pricing View

**Steps:**
1. Login as admin
2. Navigate to /pricing

**Expected Results:**
- [ ] Pro card shows "Admin Has Full Access ✓"
- [ ] VIP card shows "Admin Has Full Access ✓"
- [ ] Both cards are disabled
- [ ] Clicking either shows toast: "You already have full access as an admin! 🛡️"

### Free User Pricing View

**Steps:**
1. Login as free user
2. Navigate to /pricing

**Expected Results:**
- [ ] Free card shows "Current Plan"
- [ ] Pro card shows "Upgrade to Pro"
- [ ] VIP card shows "Upgrade to VIP"
- [ ] All upgrade buttons clickable
- [ ] Shows pricing correctly

---

## 🎃 Feature Access Testing

### Free Tier Features
- [ ] Can create 1 drawing only
- [ ] Basic brushes only
- [ ] PNG export only
- [ ] No layers
- [ ] Sees upgrade prompts

### Pro Tier Features (Admin/Pro accounts)
- [ ] Can create up to 50 drawings (admin: unlimited)
- [ ] Advanced brushes available
- [ ] Layer system enabled
- [ ] Multi-format export (PNG, JPEG, SVG)
- [ ] Quick actions visible

### VIP Tier Features (Admin/VIP accounts)
- [ ] Unlimited drawings
- [ ] All Pro features
- [ ] Special brushes/templates
- [ ] VIP badge everywhere
- [ ] Premium UI elements

### Admin-Only Features
- [ ] Admin control panel access
- [ ] User management interface
- [ ] System statistics
- [ ] Database health monitoring
- [ ] Shield icon and red theme

---

## 🚨 Critical Tests

### Test 1: No Data Leakage
**Result:** ⬜ Pass / ⬜ Fail
- Users cannot see other users' drawings

### Test 2: Admin Full Access
**Result:** ⬜ Pass / ⬜ Fail
- Admin has all Pro features
- Admin has all VIP features
- Admin has admin features

### Test 3: Tier Enforcement
**Result:** ⬜ Pass / ⬜ Fail
- Free users limited to 1 drawing
- Pro users limited to 50 drawings
- VIP/Admin unlimited

### Test 4: Dashboard Routing
**Result:** ⬜ Pass / ⬜ Fail
- Free users see FreeDashboard
- Pro users see ProDashboard
- VIP users see VipDashboard
- Admin users see AdminDashboard

---

## 📊 Console Check

**Open browser console (F12) and verify:**
- [ ] No red errors
- [ ] Clean logs
- [ ] "Client-Side Auth System Loaded" message
- [ ] "Local Storage DB initialized" message
- [ ] No TypeScript errors
- [ ] No 404s or failed requests

---

## 🎯 Final Verification

**All Systems Operational:**
- [ ] Authentication works (login/signup/logout)
- [ ] Dashboards route correctly by tier
- [ ] User data is isolated
- [ ] Admin has full Pro + VIP access
- [ ] Drawing canvas saves with userId
- [ ] Pricing page respects admin tier
- [ ] All features work as expected
- [ ] UI themes are correct for each tier

---

## ✅ Success Criteria

**System passes when:**
- ✅ All user tiers work correctly
- ✅ No data leakage between users
- ✅ Admin has full access (Pro + VIP)
- ✅ Features properly enforced
- ✅ Dashboards visually distinct
- ✅ No console errors
- ✅ All saves include userId

---

**Test Date:** _________________

**Tested By:** _________________

**Result:** ⬜ PASS ⬜ FAIL

**Notes:**
_______________________________________
_______________________________________
_______________________________________
