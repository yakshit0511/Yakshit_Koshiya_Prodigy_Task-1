# MERN Authentication System - Deployment Guide

This guide provides step-by-step instructions for deploying the MERN stack authentication system to production using Render (backend), Vercel (frontend), and MongoDB Atlas (database).

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [MongoDB Atlas Setup](#mongodb-atlas-setup)
3. [Backend Deployment (Render)](#backend-deployment-render)
4. [Frontend Deployment (Vercel)](#frontend-deployment-vercel)
5. [Environment Variables](#environment-variables)
6. [Testing Deployment](#testing-deployment)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

- MongoDB Atlas account (https://www.mongodb.com/cloud/atlas)
- Render account (https://render.com)
- Vercel account (https://vercel.com)
- GitHub repository with your code pushed
- Node.js 14+ and npm 6+ installed locally
- Git command line tools

---

## MongoDB Atlas Setup

MongoDB Atlas is a cloud database service where your user data will be stored.

### Step 1: Create a MongoDB Atlas Account

1. Go to https://www.mongodb.com/cloud/atlas
2. Click "Try Free"
3. Create an account or sign in with GitHub/Google
4. Verify your email address

### Step 2: Create a New Project

1. Click "Create a Project"
2. Name it: `MERN-Auth-Production`
3. Click "Next"
4. Click "Create Project"

### Step 3: Create a Cluster

1. Click "Create" next to "Build a Database"
2. Select "M0" tier (Free tier) - sufficient for development/testing
3. Choose your preferred cloud provider (AWS, Azure, or GCP)
4. Select a region closest to your users
5. Name the cluster: `mern-auth-cluster`
6. Click "Create Deployment"

### Step 4: Create Database User

1. In the left sidebar, click "Database Access"
2. Click "+ Create Database User"
3. Select "Scram" authentication method
4. Username: `mern_user`
5. Password: Generate a strong password (save it securely!)
6. Set permissions to "Built-in Role" → "Atlas admin"
7. Click "Create Database User"

### Step 5: Configure Network Access

1. In the left sidebar, click "Network Access"
2. Click "+ Add IP Address"
3. For development/testing: Click "Allow Access from Anywhere" (0.0.0.0/0)
4. For production: Add specific IPs of your deployed services (Render IP)
5. Click "Confirm"

### Step 6: Get Connection String

1. Go to "Databases" section
2. Click "Connect" on your cluster
3. Select "Drivers" → "Node.js"
4. Copy the connection string
5. Replace `<password>` with your database user password
6. Replace `myFirstDatabase` with `mern_auth_db`

**Example connection string:**
```
mongodb+srv://mern_user:YourPassword123@mern-auth-cluster.xxxxx.mongodb.net/mern_auth_db?retryWrites=true&w=majority
```

Save this connection string for backend deployment.

---

## Backend Deployment (Render)

Render hosts your Express.js backend API.

### Step 1: Prepare Your Repository

1. Make sure all code is committed to GitHub:
```bash
git add .
git commit -m "Prepare for production deployment"
git push origin main
```

2. Ensure your `.gitignore` includes:
```
node_modules/
.env
.env.local
.DS_Store
*.log
```

### Step 2: Create Render Account & Connect GitHub

1. Go to https://render.com
2. Sign up / Log in
3. Click "New" → "Web Service"
4. Click "Connect a repository" → "GitHub"
5. Authorize Render to access your GitHub account
6. Search for your repository and click "Connect"

### Step 3: Configure Web Service

1. **Name:** `mern-auth-api`
2. **Environment:** Node
3. **Region:** Choose closest to users
4. **Branch:** `main` (or your production branch)
5. **Build Command:** `npm install`
6. **Start Command:** `npm start`
7. **Plan:** Free (or Starter for better uptime)

### Step 4: Add Environment Variables

1. Scroll to "Environment Variables" section
2. Click "+ Add Environment Variable"
3. Add the following variables:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `PORT` | `5000` |
| `MONGO_URI` | `mongodb+srv://mern_user:password@cluster.mongodb.net/mern_auth_db?retryWrites=true&w=majority` |
| `JWT_SECRET` | `your-very-secure-random-string-at-least-32-chars` |
| `CLIENT_URL` | `https://your-frontend-domain.vercel.app` |
| `FRONTEND_URL` | `https://your-frontend-domain.vercel.app` |

**JWT_SECRET Generation:**
```bash
# Run this in terminal to generate a secure JWT secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

4. Click "Deploy"

### Step 5: Deploy & Test

1. Render will automatically start building
2. Monitor the build logs for any errors
3. Once deployed, your API URL will be: `https://mern-auth-api.onrender.com`
4. Test the API health endpoint:

```bash
curl https://mern-auth-api.onrender.com/api/health
```

You should see:
```json
{
  "success": true,
  "message": "API is running successfully!",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "environment": "production"
}
```

**Note:** On the free tier, services may "spin down" after 15 minutes of inactivity. When you make a request, there's a 30-second startup time. For production, upgrade to a paid plan.

---

## Frontend Deployment (Vercel)

Vercel hosts your React/Vite frontend.

### Step 1: Update Environment Variables

1. Create `client/.env.production` file:
```env
VITE_API_URL=https://mern-auth-api.onrender.com/api
```

2. Verify `vite.config.js` is correct:
```javascript
export default {
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
}
```

3. Commit changes:
```bash
git add .
git commit -m "Add production environment configuration"
git push origin main
```

### Step 2: Deploy to Vercel

1. Go to https://vercel.com
2. Sign up / Log in (recommended: Sign in with GitHub)
3. Click "Add New..." → "Project"
4. Search for your repository and click "Import"

### Step 3: Configure Build Settings

1. **Framework Preset:** Select "Vite"
2. **Root Directory:** Leave empty (or set to `client`)
3. **Build Command:** `npm run build` (should auto-detect from package.json)
4. **Output Directory:** `dist`
5. **Install Command:** `npm install`

### Step 4: Add Environment Variables

1. Go to "Environment Variables" section
2. Add variables for Production environment:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://mern-auth-api.onrender.com/api` |

3. Click "Deploy"

### Step 5: Configure Production Domain (Optional)

1. After deployment, go to "Settings" → "Domains"
2. To use a custom domain:
   - Click "Add" and enter your domain
   - Update DNS records as instructed by Vercel
3. Or use the default Vercel domain: `https://your-project.vercel.app`

### Step 6: Test Frontend

1. Visit your frontend URL
2. Test user registration:
   - Go to `/register`
   - Fill in form with test data
   - Submit and verify account creation
3. Test login:
   - Go to `/login`
   - Use credentials from registration
   - Verify dashboard access

---

## Environment Variables

### Backend (.env)

```env
# Database
MONGO_URI=mongodb+srv://mern_user:password@cluster.mongodb.net/mern_auth_db

# JWT
JWT_SECRET=your-very-secure-random-string-minimum-32-characters

# Server
PORT=5000
NODE_ENV=production

# Frontend
CLIENT_URL=https://your-frontend-domain.vercel.app
FRONTEND_URL=https://your-frontend-domain.vercel.app
```

### Frontend (.env.production)

```env
VITE_API_URL=https://mern-auth-api.onrender.com/api
```

### Generating Secure Secrets

```bash
# Generate JWT_SECRET
node -e "console.log('JWT_SECRET=' + require('crypto').randomBytes(32).toString('hex'))"

# Generate password for MongoDB (use online tool or password manager)
```

---

## Testing Deployment

### Test API Endpoints

```bash
# Health check
curl https://mern-auth-api.onrender.com/api/health

# Test registration
curl -X POST https://mern-auth-api.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "Test123!@",
    "role": "user"
  }'

# Test login
curl -X POST https://mern-auth-api.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!@"
  }'
```

### Test Frontend Features

1. **Public Access:**
   - Homepage loads without login ✓
   - Navigation shows Login/Register buttons ✓
   - Can navigate to /login and /register ✓

2. **Registration:**
   - Can fill form with valid data ✓
   - Password strength indicator works ✓
   - Gets redirected to dashboard on success ✓

3. **Login:**
   - Can login with correct credentials ✓
   - Gets redirected to dashboard ✓
   - Token stored in localStorage ✓

4. **Protected Routes:**
   - Cannot access /dashboard without login ✓
   - Redirected to /login when accessing protected route ✓

5. **Admin Routes:**
   - Admin users can access /admin ✓
   - Non-admin users see error when accessing /admin ✓

6. **Logout:**
   - Token cleared from localStorage ✓
   - Redirected to login page ✓

---

## Troubleshooting

### Backend Issues

**Issue: "Cannot connect to MongoDB"**
- Verify MONGO_URI is correct in Render environment variables
- Check MongoDB Atlas network access includes Render IP
- Verify database user password doesn't contain special characters that need encoding
- Retry the connection string in Render with proper escaping

**Issue: "CORS error in browser"**
- Update `CLIENT_URL` in Render environment variables to match your Vercel domain
- Restart backend service after updating env vars
- Check that `localhost:5173` is in CORS whitelist for local development

**Issue: "JWT_SECRET not set"**
- Generate JWT_SECRET using: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- Add to Render environment variables
- Restart service

**Issue: "502 Bad Gateway / Service Unavailable"**
- On free tier Render: Service might be spinning up (takes 30 seconds)
- Check Render logs for runtime errors
- Verify MongoDB connection string is working
- Ensure all dependencies installed: `npm install`

### Frontend Issues

**Issue: "Cannot connect to backend / CORS errors"**
- Update `VITE_API_URL` to match deployed backend URL
- Verify backend `CLIENT_URL` matches frontend domain
- Add frontend URL to backend CORS whitelist
- Check network tab for actual API URL being called

**Issue: "Authentication not working / Token not persisting"**
- Check localStorage in browser DevTools
- Verify token is being sent in Authorization header
- Check backend returns token in registration/login response
- Verify JWT_SECRET is same on backend as tokens were signed with

**Issue: "404 on routes after deployment"**
- Ensure Vercel output directory is `dist` (Vite output)
- Check that `vite.config.js` has `@vitejs/plugin-react`
- Verify routing is set up correctly for SPA (single page app)

### MongoDB Issues

**Issue: "Too many connection requests"**
- Free tier has connection pool limits
- Reduce concurrent connections or upgrade cluster
- Close idle connections

**Issue: "IP not whitelisted"**
- Go to MongoDB Atlas → Network Access
- Add Render deployment IP or 0.0.0.0/0 for testing
- Restart backend service

---

## Performance Optimization

### Backend Optimization
- Use Render's Standard plan for always-on services
- Enable connection pooling in MongoDB
- Add caching for frequently accessed data
- Monitor logs regularly in Render dashboard

### Frontend Optimization
- Vite automatically minifies and optimizes builds
- Vercel serves through CDN globally
- Monitor performance in Vercel Analytics
- Use Lighthouse for performance testing

---

## Security Checklist

- [ ] MongoDB user password is strong (>12 chars, mixed case, numbers, symbols)
- [ ] JWT_SECRET is secure and unique (>32 characters)
- [ ] Environment variables never committed to Git
- [ ] CORS only allows your actual frontend domain
- [ ] MongoDB network access restricted (or use IP whitelist)
- [ ] Admin accounts created with strong passwords
- [ ] SSL/HTTPS enforced on both frontend and backend
- [ ] Regular backups enabled in MongoDB Atlas
- [ ] Monitor logs for suspicious activity
- [ ] Keep dependencies updated

---

## Monitoring & Maintenance

### Render Dashboard
- Check service health: https://render.com/dashboard
- Monitor CPU and memory usage
- Review logs for errors
- Set up alerts for service failures

### Vercel Dashboard
- Monitor deployment history
- Check analytics for performance
- Review errors and logs
- Set up automatic deployments on git push

### MongoDB Atlas
- Monitor connection count
- Review query performance
- Check storage usage
- Enable automated backups

---

## Next Steps

1. Test all features in production
2. Set up monitoring and alerts
3. Create backup strategy
4. Plan scaling for growth
5. Document your deployment
6. Share access credentials securely with team

For support:
- Render: https://render.com/docs
- Vercel: https://vercel.com/docs
- MongoDB Atlas: https://docs.mongodb.com/atlas/
