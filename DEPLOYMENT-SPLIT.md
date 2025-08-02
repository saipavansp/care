# 🚀 Split Deployment Guide - Care Companion

## Why Split Deployment?
- **Better Performance**: Backend runs continuously, no cold starts
- **Cost Effective**: Both services offer generous free tiers
- **Scalable**: Easy to scale frontend and backend independently
- **Best Practices**: Industry standard approach

## Step 1: Deploy Backend on Render (5 minutes)

### 1.1 Prepare Backend
```bash
cd server
git init
git add .
git commit -m "Backend for Care Companion"
```

### 1.2 Push to GitHub
Create a new repository: `care-companion-backend`
```bash
git remote add origin https://github.com/saipavansp/care-companion-backend.git
git push -u origin main
```

### 1.3 Deploy on Render
1. Go to [render.com](https://render.com)
2. New > Web Service
3. Connect GitHub repo
4. Settings:
   - Name: `care-companion-api`
   - Build Command: `npm install`
   - Start Command: `node index.js`

### 1.4 Environment Variables on Render
```
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
CLIENT_URL=https://care-companion.vercel.app
NODE_ENV=production
```

### 1.5 Get Your Backend URL
```
https://care-companion-api.onrender.com
```

## Step 2: Deploy Frontend on Vercel (5 minutes)

### 2.1 Update Frontend Configuration
Create `client/.env.production`:
```
REACT_APP_API_URL=https://care-companion-api.onrender.com/api
```

### 2.2 Deploy to Vercel
```bash
cd client
npx vercel --prod
```

### 2.3 Configure on Vercel Dashboard
1. Go to your project settings
2. Environment Variables:
   - `REACT_APP_API_URL`: Your Render backend URL

## Step 3: Update CORS (Important!)

### 3.1 Update Backend
Go back to Render dashboard and update:
```
CLIENT_URL=https://your-app.vercel.app
```

### 3.2 Redeploy Backend
Click "Manual Deploy" > "Deploy"

## Step 4: Test Everything

### Test Checklist:
- [ ] Frontend loads at Vercel URL
- [ ] Can create account
- [ ] Can login
- [ ] Can create booking
- [ ] No CORS errors

## 🎯 Final URLs

- **Frontend**: `https://care-companion.vercel.app`
- **Backend API**: `https://care-companion-api.onrender.com/api`
- **Database**: MongoDB Atlas

## 🔧 Troubleshooting

### CORS Error?
1. Check CLIENT_URL in Render matches Vercel URL
2. Restart backend on Render

### API Not Responding?
1. Render free tier sleeps after 15 min
2. First request takes ~30 seconds
3. Consider upgrading to paid tier ($7/month)

### Build Failed?
1. Check Node version compatibility
2. Ensure all dependencies are in package.json
3. Check build logs in dashboard

## 📈 Performance Tips

1. **Frontend (Vercel)**
   - Use next/image for optimization
   - Enable caching headers
   - Use CDN for assets

2. **Backend (Render)**
   - Implement request caching
   - Use connection pooling
   - Add health check endpoint

## 🚀 Next Steps

1. **Custom Domain**
   - Add custom domain in both platforms
   - Update CORS accordingly

2. **Monitoring**
   - Set up UptimeRobot
   - Use Vercel Analytics
   - Add Sentry for errors

3. **Scaling**
   - Upgrade Render when needed
   - Use Vercel Pro for more features
   - Consider database scaling

## 💰 Cost Breakdown

**Free Tier:**
- Vercel: 100GB bandwidth/month
- Render: 750 hours/month
- MongoDB Atlas: 512MB storage
- **Total: $0/month**

**When to Upgrade:**
- >10,000 monthly users
- Need always-on backend
- Require custom domains with SSL