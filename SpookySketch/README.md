# 🎃 SpookySketch - Halloween Drawing App

<div align="center">

![SpookySketch](https://img.shields.io/badge/SpookySketch-Halloween%20Drawing%20App-orange?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-14.0-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?style=for-the-badge&logo=typescript)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?style=for-the-badge&logo=mongodb)

**A production-grade, full-stack Halloween-themed drawing application with real-time collaboration, user authentication, and subscription tiers.**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Installation](#-installation) • [Usage](#-usage) • [API Docs](#-api-documentation)

</div>

---

## 🕸️ Overview

SpookySketch is a premium SaaS drawing application with a Halloween aesthetic. It features:
- 🎨 Advanced HTML5 canvas drawing tools
- 👻 Halloween-themed brushes and effects
- 🔐 JWT-based authentication
- 💳 Stripe subscription integration (Free, Pro, VIP)
- 🌐 Real-time collaboration with Socket.io
- ☁️ Cloud storage for drawings
- 📱 Fully responsive design

---

## ✨ Features

### 🎨 Drawing Studio
- **Professional Tools**: Brush, eraser, shapes, ghost trails, pumpkin stamps
- **Customization**: Adjustable brush size, opacity, color picker
- **Halloween Palette**: Pre-selected spooky colors
- **Undo/Redo**: Full history management
- **Export**: Download as PNG
- **Cloud Save**: Save drawings to MongoDB
- **Zoom Controls**: Scale canvas for detail work

### 🧑‍💻 Authentication System
- Sign up with email/password
- JWT-based secure login
- Password hashing with bcrypt
- Session persistence
- Protected routes

### 💰 Pricing Tiers
| Tier | Price | Features |
|------|-------|----------|
| **Free** | $0 | 1 drawing, basic brushes, PNG export |
| **Pro** | $4.99/mo | 50 drawings, advanced tools, layers, SVG export |
| **VIP** | $9.99/mo | Unlimited drawings, special brushes, priority access |

### 📊 Dashboard
- View all saved drawings
- Drawing statistics (views, likes)
- Account management
- Tier status and upgrade options

### 🖼️ Community Gallery
- Browse public drawings
- Like and view artworks
- Discover community creations

### 🌐 Real-Time Collaboration *(Optional)*
- Shared drawing sessions with Socket.io
- Live brush sync
- Multi-user canvas

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **State Management**: React Context API
- **Notifications**: React Hot Toast

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JWT + bcrypt
- **Payments**: Stripe
- **Real-time**: Socket.io
- **Security**: Helmet, CORS, Rate Limiting

### DevOps & Tools
- **Version Control**: Git
- **Package Manager**: npm
- **Deployment**: Vercel (frontend), Render (backend)
- **Database Hosting**: MongoDB Atlas

---

## 🚀 Installation

### Prerequisites
- Node.js 18+ and npm
- MongoDB (local or Atlas)
- Stripe account (for payments)

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/spookysketch.git
cd SpookySketch
```

### 2. Install Dependencies
```bash
# Install root dependencies
npm run install:all

# Or manually:
npm install
cd frontend && npm install
cd ../backend && npm install
```

### 3. Configure Environment Variables

**Backend** (`backend/.env`):
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/spookysketch
JWT_SECRET=your_super_secret_jwt_key_change_in_production
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
CORS_ORIGIN=http://localhost:3000
CLIENT_URL=http://localhost:3000
```

**Frontend** (`frontend/.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_STRIPE_KEY=pk_test_your_stripe_publishable_key
```

### 4. Start MongoDB
```bash
# If using local MongoDB
mongod

# Or use MongoDB Atlas (update MONGODB_URI in .env)
```

### 5. Run Development Servers

**Option A - Run both concurrently**:
```bash
npm run dev
```

**Option B - Run separately**:
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### 6. Access Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/api/health

---

## 📖 Usage

### Creating an Account
1. Navigate to http://localhost:3000
2. Click **Sign Up**
3. Enter username, email, and password
4. Start drawing!

### Drawing Studio
1. Go to **Studio** from navbar
2. Select tools from left toolbar
3. Adjust settings in right panel
4. Draw on canvas
5. Click **Save** to store your drawing

### Upgrading to Pro/VIP
1. Go to **Pricing** page
2. Select Pro or VIP tier
3. Complete Stripe checkout
4. Enjoy premium features!

### Testing Stripe (Development)
Use Stripe test cards:
- **Success**: 4242 4242 4242 4242
- Any future expiry date and CVC

---

## 🎨 Halloween Theme

### Color Palette
- **Background**: `#0C0C0F` (Deep black)
- **Orange Accent**: `#FF6B00` (Pumpkin)
- **Purple Accent**: `#B660FF` (Mystic)
- **Text**: `#F5F5F5` (Ghost white)

### Animations
- Floating pumpkins
- Ghost cursor trails
- Glowing borders
- Fog effects
- Flickering candles

---

## 📡 API Documentation

### Authentication Endpoints

#### POST `/api/auth/signup`
Register new user
```json
{
  "username": "spooky_artist",
  "email": "user@example.com",
  "password": "secure123"
}
```

#### POST `/api/auth/login`
Login user
```json
{
  "email": "user@example.com",
  "password": "secure123"
}
```

#### GET `/api/auth/me`
Get current user (requires JWT)

### Drawing Endpoints

#### POST `/api/drawings/create`
Save new drawing (requires JWT)
```json
{
  "title": "Spooky Pumpkin",
  "canvasData": "data:image/png;base64,...",
  "width": 800,
  "height": 600
}
```

#### GET `/api/drawings/list`
Get user's drawings (requires JWT)

#### DELETE `/api/drawings/:id`
Delete drawing (requires JWT)

### Subscription Endpoints

#### POST `/api/subscription/create-checkout-session`
Create Stripe checkout (requires JWT)
```json
{
  "tier": "pro"
}
```

#### GET `/api/subscription/status`
Get subscription status (requires JWT)

---

## 🏗️ Project Structure

```
SpookySketch/
├── frontend/                 # Next.js frontend
│   ├── src/
│   │   ├── app/             # App router pages
│   │   │   ├── page.tsx     # Home page
│   │   │   ├── login/       # Login page
│   │   │   ├── signup/      # Signup page
│   │   │   ├── studio/      # Drawing studio
│   │   │   ├── dashboard/   # User dashboard
│   │   │   ├── pricing/     # Pricing page
│   │   │   └── gallery/     # Public gallery
│   │   ├── components/      # React components
│   │   │   ├── Navbar.tsx
│   │   │   └── DrawingCanvas.tsx
│   │   └── contexts/        # React contexts
│   │       └── AuthContext.tsx
│   ├── package.json
│   └── tailwind.config.js
│
├── backend/                  # Express backend
│   ├── src/
│   │   ├── server.ts        # Main server file
│   │   ├── models/          # Mongoose models
│   │   │   ├── User.ts
│   │   │   └── Drawing.ts
│   │   ├── routes/          # API routes
│   │   │   ├── auth.ts
│   │   │   ├── drawings.ts
│   │   │   ├── user.ts
│   │   │   └── subscription.ts
│   │   ├── middleware/      # Express middleware
│   │   │   └── auth.ts
│   │   └── socket/          # Socket.io handlers
│   │       └── socketHandler.ts
│   ├── package.json
│   └── tsconfig.json
│
└── package.json             # Root package.json
```

---

## 🔒 Security Features

- JWT token authentication
- Password hashing with bcrypt (10 rounds)
- CORS protection
- Helmet.js security headers
- Rate limiting (100 requests per 15 minutes)
- Input validation with express-validator
- MongoDB injection protection

---

## 🚢 Deployment

### Frontend (Vercel)
```bash
cd frontend
vercel deploy --prod
```

### Backend (Render/Railway)
1. Connect GitHub repository
2. Set environment variables
3. Deploy Node.js service

### Database (MongoDB Atlas)
1. Create cluster
2. Update `MONGODB_URI` in backend `.env`

---

## 🧪 Testing

```bash
# Frontend
cd frontend
npm run lint

# Backend
cd backend
npm run build
```

---

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📝 License

MIT License - feel free to use this project for learning or commercial purposes.

---

## 🎃 Support

For issues or questions:
- Open an issue on GitHub
- Email: support@spookysketch.com

---

## 🌟 Acknowledgments

- Halloween emoji artwork
- Stripe payment integration
- MongoDB Atlas
- Next.js team
- Open source community

---

<div align="center">

**Made with 🎃 and 💜 by SpookySketch Team**

⭐ Star this repo if you found it helpful!

</div>
