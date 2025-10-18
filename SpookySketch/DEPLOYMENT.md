# 🚀 SpookySketch Deployment Guide

## Deployment Options

### Frontend: Vercel (Recommended)
### Backend: Render / Railway / Heroku
### Database: MongoDB Atlas

---

## 1. MongoDB Atlas Setup

1. Create account at https://mongodb.com/cloud/atlas
2. Create new cluster (Free tier available)
3. Setup database user & password
4. Whitelist IP: 0.0.0.0/0 (allow all)
5. Get connection string
6. Update backend `.env` with connection string

---

## 2. Backend Deployment (Render)

1. Push code to GitHub
2. Go to https://render.com
3. Click "New +" → "Web Service"
4. Connect GitHub repository
5. Configure:
   - Name: spookysketch-api
   - Environment: Node
   - Build: `cd backend && npm install && npm run build`
   - Start: `cd backend && npm start`
6. Add environment variables (from backend/.env)
7. Deploy!

Backend URL example: https://spookysketch-api.onrender.com

---

## 3. Frontend Deployment (Vercel)

1. Go to https://vercel.com
2. Import GitHub repository
3. Configure:
   - Framework: Next.js
   - Root: frontend
4. Add environment variables:
   - NEXT_PUBLIC_API_URL=https://your-backend-url.com
   - NEXT_PUBLIC_STRIPE_KEY=pk_live_xxx
5. Deploy!

---

## 4. Stripe Production Setup

1. Switch to Live mode in Stripe dashboard
2. Get live API keys
3. Update environment variables
4. Setup webhook endpoint: https://your-backend-url.com/api/subscription/webhook
5. Copy webhook secret

---

## Environment Variables Checklist

### Backend (.env)
- PORT
- MONGODB_URI (Atlas)
- JWT_SECRET (strong random string)
- STRIPE_SECRET_KEY (live key)
- STRIPE_WEBHOOK_SECRET
- CORS_ORIGIN (Vercel URL)
- CLIENT_URL (Vercel URL)

### Frontend (.env.local)
- NEXT_PUBLIC_API_URL (Render URL)
- NEXT_PUBLIC_STRIPE_KEY (live key)

---

**Deployment complete! 🎃**
