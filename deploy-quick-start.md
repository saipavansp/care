# 🚀 Quick Deployment Guide - Care Companion

## 15-Minute Deployment Process

### 1️⃣ Database (2 minutes)
1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Create free M0 cluster
3. Add IP: `0.0.0.0/0` (Network Access)
4. Create user & get connection string

### 2️⃣ Backend on Render (5 minutes)
1. Push code to GitHub
2. Go to [Render.com](https://render.com)
3. New > Web Service > Connect repo
4. **Settings:**
   - Root Directory: `server`
   - Build: `npm install`
   - Start: `node index.js`
5. **Add Environment Variables:**
   ```
   MONGODB_URI=mongodb+srv://...
   JWT_SECRET=any-random-string
   CLIENT_URL=https://localhost:3000
   ```
6. Click "Create Web Service"
7. Copy your backend URL: `https://your-app.onrender.com`

### 3️⃣ Frontend on Vercel (5 minutes)
1. Create file `client/.env.production`:
   ```
   REACT_APP_API_URL=https://your-app.onrender.com/api
   ```
2. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```
3. Deploy:
   ```bash
   cd client
   vercel --prod
   ```
4. Follow prompts (just press Enter for defaults)
5. Copy your frontend URL: `https://your-app.vercel.app`

### 4️⃣ Final Setup (3 minutes)
1. Go back to Render dashboard
2. Update `CLIENT_URL` to your Vercel URL
3. Redeploy backend (Manual Deploy button)

## ✅ Done! Your app is live!

### 🧪 Test Your Deployment
1. Visit your Vercel URL
2. Create account
3. Make a test booking

### 🆓 Free Tier Limits
- **MongoDB**: 512MB storage
- **Render**: Spins down after 15 min inactivity
- **Vercel**: 100GB bandwidth/month

### 🔧 Troubleshooting

**CORS Error?**
- Check CLIENT_URL in Render matches Vercel URL
- Wait 2 min for Render redeploy

**Can't connect to database?**
- Check MongoDB IP whitelist (0.0.0.0/0)
- Verify connection string format

**Backend not responding?**
- Render free tier sleeps after 15 min
- First request takes ~30 seconds to wake up

### 📱 Share Your App
```
Frontend: https://your-app.vercel.app
Backend API: https://your-app.onrender.com/api
```

### 💡 Pro Tips
- Use different names for better URLs
- Set up custom domain later ($20/year)
- Monitor with UptimeRobot (free)