# MERN Authentication System - Pre-Deployment Checklist

This checklist ensures your application is ready for production deployment.

## Backend Setup Checklist

### Code Quality
- [ ] All dependencies installed (`npm install` runs successfully)
- [ ] No console errors in development mode
- [ ] All environment variables configured in `.env`
- [ ] `.env` file is in `.gitignore` (never commit secrets)
- [ ] Error handling implemented for all routes
- [ ] Input validation on all endpoints
- [ ] Sensitive logs don't expose passwords or tokens

### Security
- [ ] JWT_SECRET is at least 32 characters long
- [ ] Password hashing with bcryptjs (10 salt rounds)
- [ ] CORS configured with specific frontend URL
- [ ] Helmet security headers configured
- [ ] Rate limiting enabled on authentication routes (10 req/15 min)
- [ ] HTTPS enforced in production
- [ ] No hardcoded secrets in code
- [ ] Database user has limited permissions (not admin in production)
- [ ] Input validation prevents SQL injection and XSS

### Database
- [ ] MongoDB Atlas cluster created and configured
- [ ] Database user created with strong password
- [ ] Connection string uses correct credentials
- [ ] Network access properly configured
- [ ] Backup enabled in MongoDB Atlas
- [ ] Database indexes created for frequent queries
- [ ] Test data cleaned before production

### Testing
- [ ] Postman/Insomnia collection for API testing
- [ ] Health check endpoint responds: `GET /api/health`
- [ ] Registration endpoint works: `POST /api/auth/register`
- [ ] Login endpoint returns token: `POST /api/auth/login`
- [ ] Protected routes require valid JWT
- [ ] Invalid tokens return 401 status
- [ ] Rate limiting returns 429 when exceeded
- [ ] Error responses have appropriate status codes

### Deployment
- [ ] Code pushed to GitHub
- [ ] `.gitignore` excludes `node_modules/` and `.env`
- [ ] `package.json` has correct scripts: `start` and `dev`
- [ ] `server.js` has no debug/console.log statements
- [ ] `npm start` command works locally
- [ ] Dependencies are up to date (no major vulnerabilities)

---

## Frontend Setup Checklist

### Code Quality
- [ ] All dependencies installed (`npm install` runs successfully)
- [ ] No console errors in development mode
- [ ] All environment variables configured (`.env.production`)
- [ ] No hardcoded API URLs (use environment variables)
- [ ] Code follows React best practices
- [ ] Components properly organized in `/src` folder
- [ ] Unused imports and code removed
- [ ] CSS is organized and not duplicated

### Authentication
- [ ] JWT token stored in localStorage
- [ ] Token sent in Authorization header with "Bearer" prefix
- [ ] Token cleared on logout
- [ ] Session restored on page refresh (from localStorage)
- [ ] Redirect to login on 401/token expired
- [ ] User info restored from AuthContext on app load
- [ ] Authentication state persists across page refreshes

### UI/UX
- [ ] All pages load without errors
- [ ] Forms have proper validation messages
- [ ] Password strength indicator displays correctly
- [ ] Loading states visible during async operations
- [ ] Error messages display correctly
- [ ] Navigation works on all pages
- [ ] Mobile responsive design tested
- [ ] No console warnings

### Forms
- [ ] Registration form validates all fields
- [ ] Confirm password matches password field
- [ ] Email format validation working
- [ ] Password minimum length enforced (6 characters)
- [ ] Password strength indicator shows (weak/medium/strong)
- [ ] Login form validates email and password
- [ ] Form submission disabled while loading
- [ ] Success message shows after submission

### Routes
- [ ] Public routes accessible without login
- [ ] Protected routes redirect to login when not authenticated
- [ ] Admin routes show error for non-admin users
- [ ] 404 page displays for invalid routes
- [ ] Navigation links work correctly
- [ ] Browser back/forward buttons work properly

### API Integration
- [ ] Axios instance configured with base URL
- [ ] Request interceptor adds token to headers
- [ ] Response interceptor handles errors
- [ ] Network errors handled gracefully
- [ ] API timeouts set appropriately
- [ ] CORS errors resolved

### Testing
- [ ] Registration flow works end-to-end
- [ ] Login flow works end-to-end
- [ ] Logout clears token and redirects
- [ ] Admin page only accessible to admins
- [ ] Protected routes require authentication
- [ ] Token refresh works if implemented
- [ ] Network errors show user-friendly messages
- [ ] Long requests show loading spinner

### Deployment
- [ ] Code pushed to GitHub
- [ ] `.gitignore` excludes `node_modules/` and `.env`
- [ ] `package.json` has correct build script
- [ ] `vite.config.js` properly configured
- [ ] `.env.production` has correct API URL
- [ ] `npm run build` completes without errors
- [ ] `npm run preview` shows built app correctly
- [ ] Environment variable `VITE_API_URL` is used in axios config

---

## Backend & Database Checklist

### MongoDB Atlas
- [ ] Cluster created and running
- [ ] Database user created with strong password
- [ ] Network access configured (IP whitelist or 0.0.0.0/0)
- [ ] Connection string tested locally
- [ ] Collections created with proper indexes
- [ ] Backup enabled (automated snapshots)
- [ ] MongoDB URI doesn't expose password in repo

### Environment Variables (.env)
- [ ] `MONGO_URI` points to MongoDB Atlas
- [ ] `JWT_SECRET` is strong and unique
- [ ] `PORT` set to 5000 (or appropriate port)
- [ ] `NODE_ENV` set to "development" locally
- [ ] `CLIENT_URL` set to frontend domain
- [ ] No hardcoded secrets in code

### API Testing (Postman/Insomnia)
- [ ] Health check: `GET /api/health` returns 200
- [ ] Register: `POST /api/auth/register` creates user
- [ ] Login: `POST /api/auth/login` returns token
- [ ] Get Me: `GET /api/auth/me` with token returns user
- [ ] Admin Route: `GET /api/admin` requires admin role
- [ ] User Route: `GET /api/user` requires authentication
- [ ] Invalid token returns 401
- [ ] Rate limiting blocks after 10 auth requests

---

## Security Checklist

- [ ] No plaintext passwords in database (bcryptjs hashed)
- [ ] JWT tokens have 7-day expiration
- [ ] Passwords never logged or exposed in errors
- [ ] CORS restricts requests to frontend domain
- [ ] Helmet sets security headers
- [ ] Rate limiting prevents brute force
- [ ] Input validation prevents injection attacks
- [ ] Error messages don't expose system details
- [ ] Admin routes properly protected
- [ ] Sensitive routes require authentication
- [ ] HTTPS enforced in production
- [ ] Database credentials not in Git
- [ ] API key/JWT secret not in Git
- [ ] Secrets managed via environment variables

---

## Performance Checklist

- [ ] Frontend bundle size reasonable (<500KB gzipped)
- [ ] API responses complete in <1 second
- [ ] Database queries use proper indexes
- [ ] No N+1 query problems
- [ ] Images optimized for web
- [ ] CSS minified in production
- [ ] JavaScript minified in production
- [ ] Caching strategies implemented
- [ ] No unnecessary re-renders in React
- [ ] LocalStorage used efficiently

---

## Deployment Readiness

### Before Deploying to Render (Backend)
- [ ] All local tests passing
- [ ] No console errors or warnings
- [ ] Environment variables documented
- [ ] Render account created
- [ ] MongoDB Atlas connection string ready
- [ ] JWT_SECRET generated and ready
- [ ] GitHub repository is up to date
- [ ] Build command: `npm install`
- [ ] Start command: `npm start`

### Before Deploying to Vercel (Frontend)
- [ ] All local tests passing
- [ ] No console errors or warnings
- [ ] Backend URL updated in environment variables
- [ ] Vercel account created
- [ ] GitHub repository is up to date
- [ ] Build command: `npm run build`
- [ ] Output directory: `dist`
- [ ] Environment variables configured in Vercel
- [ ] `.env.production` not committed to Git

### After Deployment
- [ ] Backend health check responds: https://mern-auth-api.onrender.com/api/health
- [ ] Frontend loads without errors: https://your-app.vercel.app
- [ ] Registration works end-to-end
- [ ] Login works with valid credentials
- [ ] Protected routes require authentication
- [ ] Admin routes work for admin users
- [ ] CORS errors resolved
- [ ] No 502/503 errors in backend
- [ ] Token persistence works after refresh
- [ ] Logout works correctly

---

## Maintenance Checklist

### Regular Tasks
- [ ] Monitor application logs weekly
- [ ] Check MongoDB usage (storage, connections)
- [ ] Update dependencies monthly
- [ ] Review user accounts and permissions
- [ ] Check for failed authentication attempts
- [ ] Verify backups are running
- [ ] Test backup restoration process
- [ ] Review security headers with observatory
- [ ] Check SSL/HTTPS certificate expiration
- [ ] Monitor error rates and response times

### Before Major Updates
- [ ] Backup database
- [ ] Test changes in staging environment
- [ ] Verify all tests pass
- [ ] Check compatibility with existing users
- [ ] Plan rollback strategy
- [ ] Notify users of changes

---

## Post-Deployment Verification

### Test All Workflows
1. **New User Registration**
   - [ ] Visit /register
   - [ ] Fill form with new data
   - [ ] Submit registration
   - [ ] Verify user in database
   - [ ] Auto-login or redirect to login

2. **User Login**
   - [ ] Visit /login
   - [ ] Enter credentials
   - [ ] Verify token received
   - [ ] Check localStorage has token
   - [ ] Redirect to dashboard

3. **Authenticated User**
   - [ ] Access /dashboard
   - [ ] View user profile
   - [ ] Verify user info displays
   - [ ] Admin badge shows for admins

4. **Admin Access**
   - [ ] Login as admin user
   - [ ] Access /admin page
   - [ ] View admin dashboard
   - [ ] Try /admin as regular user → verify error

5. **Logout**
   - [ ] Click logout button
   - [ ] Verify token cleared
   - [ ] Verify redirected to login
   - [ ] Cannot access protected routes

6. **Protected Routes**
   - [ ] Try accessing /dashboard without login → redirect
   - [ ] Try accessing /admin without login → redirect
   - [ ] After login, can access both routes

---

## Troubleshooting During Deployment

### If Backend Won't Start
1. Check environment variables in Render
2. Verify MongoDB connection string
3. Check logs for specific errors
4. Test locally with same env vars
5. Ensure all dependencies are installed

### If Frontend Won't Load
1. Check build logs in Vercel
2. Verify `.env.production` has correct API URL
3. Check browser DevTools for errors
4. Verify CORS configuration on backend
5. Test locally with production env vars

### If API Calls Fail
1. Check browser Network tab
2. Verify token in Authorization header
3. Check backend logs for errors
4. Verify CORS whitelist includes frontend domain
5. Test endpoints with Postman/Insomnia

---

## When Everything is Ready ✅

- [ ] All checklist items completed
- [ ] Testing verified all features work
- [ ] Performance acceptable
- [ ] Security measures in place
- [ ] Monitoring and alerts configured
- [ ] Team trained on system
- [ ] Documentation complete
- [ ] Ready for production traffic

**Deployment Status:** Ready for Production 🚀

---

## Sign-Off

- [ ] Developer: _____________ Date: _______
- [ ] Code Reviewer: _________ Date: _______
- [ ] QA Tester: _____________ Date: _______
- [ ] DevOps/Admin: _________ Date: _______

---

For issues or updates, refer to [DEPLOYMENT.md](./DEPLOYMENT.md) and [README.md](./README.md)
