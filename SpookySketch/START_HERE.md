# 🎃 SpookySketch - Quick Start Guide

## 🚀 Get Started in 3 Steps

### Step 1: Install Dependencies

```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies (optional)
cd ../backend
npm install
```

### Step 2: Start the Application

**Option A: Frontend Only (Recommended for Testing)**
```bash
cd frontend
npm run dev
```
The app will run at `http://localhost:3000`

**Option B: Full Stack (Frontend + Backend)**

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

### Step 3: Login as Admin

Open `http://localhost:3000` and login with:
- **Email**: `leomyler0@gmail.com`
- **Password**: `SuperBoy2020`

You'll have ADMIN access with full control!

---

## ✨ What You Can Do

### 1. Drawing Studio
- Navigate to **Studio** from the navbar
- Use professional drawing tools:
  - 🎨 Brush, Eraser, Shapes
  - 👻 Ghost trail, Pumpkin stamps
  - 🎨 Color picker with palette
  - ↩️ Undo/Redo
  - 💾 Save drawings
  - 📥 Export as PNG

### 2. Dashboard
- View all your saved drawings
- See statistics (views, likes)
- Toggle drawing visibility (public/private)
- Delete drawings
- Edit and re-open drawings

### 3. Gallery
- Browse public drawings from all users
- Like community artwork
- Discover creative designs

### 4. Admin Panel (Admin Only)
- **User Management**: View, edit, delete users
- **Analytics**: System statistics and insights
- **Settings**: Configure app behavior
- **Drawing Moderation**: Manage all drawings

---

## 📝 Create New User Account

1. Click **Sign Up** in the navbar
2. Choose a username (min 3 characters)
3. Enter your email
4. Create a password (min 6 characters)
5. Click **Sign Up Free**

New accounts start as **FREE** tier with 1 drawing limit.

---

## 🎯 Tier System

| Tier | Drawings | Features |
|------|----------|----------|
| **FREE** | 1 | Basic tools, PNG export |
| **PRO** | 50 | Advanced tools, layers |
| **VIP** | Unlimited | Special effects, priority |
| **ADMIN** | Unlimited | Full control panel |

As admin, you can upgrade any user's tier!

---

## 🔧 Configuration (Optional)

### Frontend Environment Variables
Create `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_STRIPE_KEY=your_stripe_key
```

### Backend Environment Variables
Create `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/spookysketch
JWT_SECRET=your_secret_key_here
STRIPE_SECRET_KEY=your_stripe_secret
CORS_ORIGIN=http://localhost:3000
```

**Note**: The app works perfectly WITHOUT these! It uses localStorage for everything.

---

## 💡 Pro Tips

1. **Works Offline**: The entire app runs in your browser!
2. **No Database Needed**: Uses localStorage for data persistence
3. **Admin Auto-Created**: Admin account is created automatically
4. **Mobile Friendly**: Fully responsive design
5. **Auto-Save**: Your drawings are auto-saved every 30 seconds

---

## 🐛 Troubleshooting

### Issue: Port 3000 already in use
```bash
# Use different port
npm run dev -- -p 3001
```

### Issue: Forgot admin password
The admin credentials are hardcoded:
- Email: `leomyler0@gmail.com`
- Password: `SuperBoy2020`

### Issue: Drawings not saving
Check browser console (F12) for errors. localStorage must be enabled.

### Issue: Can't create more drawings
Check your tier limit:
- Free: 1 drawing
- Pro: 50 drawings
- VIP: Unlimited

Admin can upgrade your tier from the Admin Panel.

---

## 📁 Project Structure

```
SpookySketch/
├── frontend/          # Next.js 14 + TypeScript
│   ├── src/
│   │   ├── app/       # Pages (Next.js App Router)
│   │   ├── components/ # React components
│   │   ├── contexts/   # Auth context
│   │   ├── utils/      # Client-side auth, localStorage
│   │   ├── lib/        # API client
│   │   └── types/      # TypeScript definitions
│   └── package.json
│
├── backend/           # Express.js + TypeScript (Optional)
│   ├── src/
│   │   ├── routes/    # API endpoints
│   │   ├── models/    # MongoDB models
│   │   └── middleware/ # Auth middleware
│   └── package.json
│
└── README.md
```

---

## 🎨 Key Features

✅ Professional drawing canvas
✅ Real-time preview
✅ Multiple brush types
✅ Undo/Redo system
✅ Color picker & palettes
✅ Layer system (Pro+)
✅ Export to PNG
✅ Auto-save drafts
✅ User authentication
✅ Multi-tier system
✅ Admin dashboard
✅ Community gallery
✅ Like & view tracking
✅ Responsive mobile UI
✅ Halloween theme 🎃

---

## 🚀 Deployment

### Deploy Frontend (Vercel)
```bash
cd frontend
vercel --prod
```

### Deploy Backend (Render/Railway)
```bash
cd backend
# Follow platform-specific instructions
```

### Database (Optional)
- Use MongoDB Atlas for cloud database
- Or keep using localStorage (works great!)

---

## 🔐 Security Notes

1. Admin credentials are for development only
2. Change passwords before production
3. localStorage auth is client-side only
4. For production, use proper backend auth

---

## 📞 Support

- Check `FIXES_APPLIED.md` for technical details
- Review `README.md` for full documentation
- All TypeScript types are in `frontend/src/types/index.ts`

---

**Ready to Draw?** Open `http://localhost:3000` and start creating! 🎨👻🎃
