# Care Companion - Deployment Guide

## Free Hosting Setup

### Prerequisites
- GitHub account
- MongoDB Atlas account
- Node.js installed locally

### Step 1: Database Setup (MongoDB Atlas)

1. **Create MongoDB Atlas Account**
   - Go to [MongoDB Atlas](https://cloud.mongodb.com)
   - Sign up for free account
   - Create a free M0 cluster

2. **Configure Database**
   - Click "Connect" on your cluster
   - Add IP address: 0.0.0.0/0 (allows all IPs)
   - Create database user
   - Get connection string

3. **Update Connection String**
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/care-companion?retryWrites=true&w=majority
   ```

### Step 2: Backend Deployment (Render.com)

1. **Prepare Backend**
   - Ensure all environment variables are in Render dashboard
   - Update CORS origins in `server/index.js`

2. **Deploy to Render**
   - Go to [Render](https://render.com)
   - New > Web Service
   - Connect GitHub repository
   - Select `server` directory as root
   - Build Command: `npm install`
   - Start Command: `node index.js`

3. **Environment Variables on Render**
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   CLIENT_URL=https://your-frontend.vercel.app
   NODE_ENV=production
   ```

### Step 3: Frontend Deployment (Vercel)

1. **Update Frontend Configuration**
   - Create `.env.production` in client folder:
   ```
   REACT_APP_API_URL=https://your-backend.render.com/api
   ```

2. **Deploy to Vercel**
   ```bash
   cd client
   npm run build
   npm i -g vercel
   vercel --prod
   ```

3. **Configure Vercel**
   - Framework Preset: Create React App
   - Build Command: `npm run build`
   - Output Directory: `build`

### Step 4: Post-Deployment Setup

1. **Update CORS**
   - Add your Vercel URL to allowed origins in backend
   - Redeploy backend

2. **Test Application**
   - Create test account
   - Make test booking
   - Verify all features work

### Alternative Free Hosting Options

#### Backend Alternatives:
- **Railway.app**: Easy deployment, good for Node.js
- **Cyclic.sh**: Simple Node.js hosting
- **Fly.io**: More control, includes database

#### Frontend Alternatives:
- **Netlify**: Great for static sites
- **GitHub Pages**: Simple but limited
- **Surge.sh**: Quick deployment

#### Database Alternatives:
- **Supabase**: PostgreSQL with auth
- **PlanetScale**: MySQL compatible
- **CockroachDB**: Distributed SQL

### Deployment Checklist

- [ ] MongoDB Atlas cluster created
- [ ] Environment variables set
- [ ] Backend deployed and running
- [ ] Frontend deployed
- [ ] CORS configured correctly
- [ ] API endpoints tested
- [ ] Authentication working
- [ ] Booking system functional

### Common Issues & Solutions

1. **CORS Errors**
   - Ensure CLIENT_URL matches your frontend URL
   - Check allowed origins in server/index.js

2. **MongoDB Connection**
   - Whitelist all IPs (0.0.0.0/0)
   - Check username/password
   - Verify database name

3. **Build Failures**
   - Check Node version compatibility
   - Verify all dependencies installed
   - Check for missing environment variables

### Monitoring & Maintenance

1. **Free Monitoring Tools**
   - UptimeRobot: Monitor uptime
   - LogDNA: Free log management
   - Sentry: Error tracking

2. **Performance Tips**
   - Use CDN for static assets
   - Implement caching
   - Optimize images

### Cost Optimization

**Estimated Monthly Cost: $0**
- MongoDB Atlas M0: Free (512MB)
- Render.com: Free (with limitations)
- Vercel: Free (100GB bandwidth)

**When to Upgrade:**
- >500MB database storage
- >100GB bandwidth/month
- Need custom domain SSL
- Require better performance

### Security Considerations

1. **Environment Variables**
   - Never commit .env files
   - Use strong JWT secrets
   - Rotate keys regularly

2. **API Security**
   - Rate limiting enabled
   - Input validation
   - HTTPS enforced

3. **Database Security**
   - Use connection string with SSL
   - Enable authentication
   - Regular backups

### Support & Resources

- [Render Docs](https://render.com/docs)
- [Vercel Docs](https://vercel.com/docs)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com)

### Quick Start Commands

```bash
# Backend deployment
cd server
git push origin main
# Render auto-deploys from GitHub

# Frontend deployment
cd client
npm run build
vercel --prod

# Database setup
# Use MongoDB Atlas UI
```

### Next Steps

1. Set up custom domain (optional)
2. Configure email service
3. Add monitoring
4. Set up CI/CD pipeline
5. Implement backup strategy