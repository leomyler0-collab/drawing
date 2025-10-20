# 🚀 Netlify Deployment Guide for SpookySketch

Complete step-by-step guide to deploy your SpookySketch application to Netlify.

---

## 📋 **Prerequisites**

Before you start, make sure you have:
- ✅ GitHub account with your code pushed
- ✅ Netlify account (free) - [Sign up here](https://app.netlify.com/signup)
- ✅ Your repository is public or Netlify has access

---

## 🎯 **Method 1: Deploy via Netlify Dashboard (Recommended)**

### **Step 1: Login to Netlify**
1. Go to [https://app.netlify.com](https://app.netlify.com)
2. Click "Sign up" or "Log in"
3. Connect with your GitHub account

### **Step 2: Import Your Project**
1. Click **"Add new site"** → **"Import an existing project"**
2. Choose **"Deploy with GitHub"**
3. Authorize Netlify to access your GitHub repositories
4. Select your repository: **`leomyler0-collab/drawing`**

### **Step 3: Configure Build Settings**

Netlify should auto-detect Next.js, but verify these settings:

```
Base directory:     SpookySketch/frontend
Build command:      npm run build
Publish directory:  SpookySketch/frontend/.next
```

**Important:** Since your project structure is:
```
drawing/
  └── SpookySketch/
      └── frontend/  (Next.js app is here)
```

Use these exact settings:
- **Base directory:** `SpookySketch/frontend`
- **Build command:** `npm install && npm run build`
- **Publish directory:** `.next`

### **Step 4: Deploy!**
1. Click **"Deploy site"**
2. Wait 2-3 minutes for the build to complete
3. Your site will be live at `https://random-name-123.netlify.app`

### **Step 5: Custom Domain (Optional)**
1. Go to **Site settings** → **Domain management**
2. Click **"Add custom domain"**
3. Enter your domain name
4. Follow DNS configuration instructions

---

## 🎯 **Method 2: Deploy via Netlify CLI**

### **Step 1: Install Netlify CLI**
```bash
npm install -g netlify-cli
```

### **Step 2: Login**
```bash
netlify login
```

### **Step 3: Initialize & Deploy**
```bash
cd SpookySketch
netlify init
```

Follow the prompts:
- **Create & configure a new site:** Yes
- **Team:** Select your team
- **Site name:** spookysketch (or your preferred name)
- **Build command:** `cd frontend && npm install && npm run build`
- **Directory to deploy:** `frontend/.next`

### **Step 4: Deploy**
```bash
netlify deploy --prod
```

---

## ⚙️ **Configuration File (Already Created)**

The `netlify.toml` file has been created in your project root with these settings:

```toml
[build]
  command = "cd frontend && npm install && npm run build"
  publish = "frontend/.next"
  base = ""

[build.environment]
  NODE_VERSION = "18"
  NEXT_TELEMETRY_DISABLED = "1"
```

This tells Netlify:
- Where to find your code
- How to build it
- Where the output files are

---

## 🔧 **Build Settings Explanation**

### **For Your Nested Structure:**

Since your Next.js app is at `drawing/SpookySketch/frontend/`, you need:

**Option A: Using Base Directory (Recommended)**
```
Base directory:     SpookySketch/frontend
Build command:      npm install && npm run build
Publish directory:  .next
```

**Option B: Using Full Paths**
```
Base directory:     (leave empty)
Build command:      cd SpookySketch/frontend && npm install && npm run build
Publish directory:  SpookySketch/frontend/.next
```

---

## 🎨 **Environment Variables (If Needed)**

If your app uses environment variables:

1. Go to **Site settings** → **Environment variables**
2. Add your variables:
   ```
   NEXT_PUBLIC_API_URL=https://your-api.com
   NEXT_PUBLIC_STRIPE_KEY=pk_test_xxxxx
   ```

---

## 🚨 **Common Issues & Solutions**

### **Issue 1: Build Fails - "Cannot find package.json"**
**Solution:** Set base directory to `SpookySketch/frontend`

### **Issue 2: 404 on Page Refresh**
**Solution:** Netlify.toml already includes redirects:
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### **Issue 3: Static Files Not Loading**
**Solution:** Check publish directory is set to `.next` or `SpookySketch/frontend/.next`

### **Issue 4: Build Timeout**
**Solution:** 
- Increase timeout in Site settings → Build & deploy
- Or optimize your build command

---

## 📊 **Deployment Status**

After deployment, you'll get:
```
✅ Deploy successful!
🌐 URL: https://your-site-name.netlify.app
📊 Build time: ~2-3 minutes
🔄 Auto-deploys: Enabled (on git push)
```

---

## 🔄 **Auto-Deployment**

Once connected, Netlify will automatically deploy when you:
1. Push to `main` branch
2. Merge a pull request
3. Make changes in GitHub

**Disable auto-deploy:**
- Site settings → Build & deploy → Continuous deployment → Stop builds

---

## 🎯 **Quick Deploy Steps (TL;DR)**

1. **Push your code to GitHub** ✅ (Already done)
2. **Go to Netlify:** [app.netlify.com](https://app.netlify.com)
3. **Import from GitHub:** Select `leomyler0-collab/drawing`
4. **Configure:**
   - Base: `SpookySketch/frontend`
   - Build: `npm install && npm run build`
   - Publish: `.next`
5. **Click Deploy** 🚀
6. **Wait 2-3 minutes** ⏱️
7. **Site is LIVE!** 🎉

---

## 📱 **Alternative: Deploy Button**

Add this to your README.md for one-click deploys:

```markdown
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/leomyler0-collab/drawing)
```

---

## 🔍 **Verify Deployment**

After deployment, test these pages:
- ✅ Home: `https://your-site.netlify.app/`
- ✅ Gallery: `https://your-site.netlify.app/gallery`
- ✅ Studio: `https://your-site.netlify.app/studio`
- ✅ Login: `https://your-site.netlify.app/login`
- ✅ Signup: `https://your-site.netlify.app/signup`

---

## 💰 **Netlify Pricing**

**Free Tier includes:**
- ✅ 100 GB bandwidth/month
- ✅ 300 build minutes/month
- ✅ Automatic HTTPS
- ✅ Continuous deployment
- ✅ Form handling
- ✅ Serverless functions

**Perfect for your SpookySketch app!** 🎃

---

## 🆚 **Netlify vs Vercel**

| Feature | Netlify | Vercel |
|---------|---------|--------|
| Next.js Support | ✅ Good | ✅ Excellent |
| Build Speed | Fast | Faster |
| Free Bandwidth | 100 GB | 100 GB |
| Custom Domains | ✅ Yes | ✅ Yes |
| Serverless Functions | ✅ Yes | ✅ Yes |
| Learning Curve | Easy | Easy |

**Both work great!** Choose based on preference.

---

## 🎯 **Next Steps After Deployment**

1. **Custom Domain:** Add your own domain
2. **SSL Certificate:** Auto-enabled with HTTPS
3. **Analytics:** Enable Netlify Analytics (paid)
4. **Forms:** Use Netlify Forms for contact forms
5. **Functions:** Add serverless functions if needed

---

## 📞 **Need Help?**

- **Netlify Docs:** [docs.netlify.com](https://docs.netlify.com)
- **Netlify Support:** [support.netlify.com](https://support.netlify.com)
- **Community Forum:** [answers.netlify.com](https://answers.netlify.com)

---

## ✅ **Checklist**

Before deploying, make sure:
- [ ] Code is pushed to GitHub
- [ ] `netlify.toml` is in project root
- [ ] `package.json` exists in `frontend/` directory
- [ ] Build works locally (`npm run build`)
- [ ] No hardcoded localhost URLs in code
- [ ] Environment variables are configured (if needed)

---

**You're ready to deploy! 🚀 Follow Method 1 (Dashboard) for the easiest experience!**

**Expected deployment time: 2-3 minutes** ⏱️

**Your SpookySketch app will be live at `https://your-site-name.netlify.app`!** 🎃👻🎨
