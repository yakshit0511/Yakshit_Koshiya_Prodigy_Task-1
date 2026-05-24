# MERN Authentication System - Quick Reference

## 🚀 Quick Start

### Development (Local)
```bash
# Install dependencies for all
npm run setup

# Start both frontend and backend concurrently
npm run dev

# Access points:
# Frontend: http://localhost:5173
# Backend: http://localhost:5000/api
# API Health: http://localhost:5000/api/health
```

### Backend Only
```bash
npm run server          # Start server with nodemon (auto-reload)
npm run start           # Start server for production
```

### Frontend Only
```bash
npm run client          # Start Vite dev server
npm run build          # Build for production
npm run preview        # Preview production build locally
```

---

## 📊 API Endpoints

### Authentication Routes

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | `/api/auth/register` | ❌ | Register new user |
| POST | `/api/auth/login` | ❌ | Login user |
| GET | `/api/auth/me` | ✅ | Get current user |
| GET | `/api/auth/logout` | ✅ | Logout user |

### Protected Routes

| Method | Endpoint | Auth | Role | Purpose |
|--------|----------|------|------|---------|
| GET | `/api/user` | ✅ | Any | Test user endpoint |
| GET | `/api/admin` | ✅ | Admin | Test admin endpoint |

### Utility

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/health` | Server health check |

---

## 🔑 Environment Variables

### Backend (.env)
```env
MONGO_URI=mongodb+srv://...
JWT_SECRET=secure-string-32-chars
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env.production)
```env
VITE_API_URL=https://your-backend.com/api
```

---

## 🗂️ Key Files

### Backend
- `server/server.js` - Main Express app, middleware setup
- `server/models/User.js` - User schema with password hashing
- `server/middleware/authMiddleware.js` - JWT verification
- `server/controllers/authController.js` - Auth business logic
- `server/routes/authRoutes.js` - Route definitions

### Frontend
- `client/src/api/axios.js` - HTTP client with interceptors
- `client/src/context/AuthContext.jsx` - Global auth state
- `client/src/pages/LoginPage.jsx` - Login form
- `client/src/pages/RegisterPage.jsx` - Registration with strength meter
- `client/src/App.jsx` - Main app with routing

---

## 🔐 Default Test Accounts

No default accounts - create via `/register` page

### Test Data (For Development)
```
Name: John Doe
Email: john@example.com
Password: TestPass123!
Role: user
```

---

## 📱 Frontend Routes

| Route | Auth Required | Role | Purpose |
|-------|---------------|------|---------|
| `/` | ❌ | Any | Home page |
| `/login` | ❌ | Any | Login page |
| `/register` | ❌ | Any | Registration page |
| `/dashboard` | ✅ | Any | User dashboard |
| `/admin` | ✅ | Admin | Admin dashboard |
| `/*` | ❌ | Any | 404 page |

---

## 🛡️ Security Features

### Password Protection
- ✅ Hashed with bcryptjs (10 salt rounds)
- ✅ Never stored or logged in plaintext
- ✅ Strength indicator on registration
- ✅ Minimum 6 characters required

### Token Security
- ✅ JWT with 7-day expiration
- ✅ Stored in localStorage
- ✅ Sent in Authorization header
- ✅ Cleared on logout

### Rate Limiting
- ✅ Auth routes: 10 requests/15 minutes
- ✅ General API: 100 requests/15 minutes
- ✅ Returns 429 status when exceeded

### HTTP Security
- ✅ Helmet security headers
- ✅ CORS restricted to allowed domains
- ✅ Input validation on all endpoints

---

## 🧪 Testing Endpoints

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "TestPass123!",
    "role": "user"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "TestPass123!"
  }'

# Response includes:
# {
#   "success": true,
#   "token": "eyJhbGc...",
#   "user": { "id": "...", "name": "...", "email": "..." }
# }
```

### Get User Info (Requires Token)
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Health Check
```bash
curl http://localhost:5000/api/health

# Response:
# {
#   "success": true,
#   "message": "API is running successfully!",
#   "timestamp": "2024-01-15T10:30:00.000Z",
#   "environment": "development"
# }
```

---

## 🚨 Common Error Codes

| Code | Meaning | Solution |
|------|---------|----------|
| 200 | OK | Request successful |
| 201 | Created | Resource created (e.g., user registered) |
| 400 | Bad Request | Check input validation |
| 401 | Unauthorized | Invalid/expired token, login required |
| 403 | Forbidden | Insufficient permissions (e.g., not admin) |
| 404 | Not Found | Endpoint doesn't exist |
| 409 | Conflict | Email already exists |
| 429 | Too Many Requests | Rate limit exceeded, wait 15 minutes |
| 500 | Server Error | Check backend logs |

---

## 📝 Deployment Commands

### Build for Production
```bash
# Full build
npm run build:full

# Frontend only
cd client && npm run build

# Backend doesn't need build (pure Node.js)
```

### Production Start
```bash
# Backend production mode
npm start                # or NODE_ENV=production npm start

# Frontend production preview
npm run preview
```

---

## 🔧 Troubleshooting

### "Cannot connect to backend"
- Check backend is running: `npm run server`
- Verify MONGO_URI in `.env`
- Check MongoDB Atlas connection

### "401 Unauthorized"
- Token expired (7 days) - login again
- Token not stored in localStorage
- Backend JWT_SECRET doesn't match

### "CORS error"
- Frontend URL must match `CLIENT_URL` in backend `.env`
- For Vite: Use `http://localhost:5173` not `http://localhost:3000`
- Restart backend after changing CORS config

### "Cannot connect to MongoDB"
- Check MONGO_URI format is correct
- Verify database user password
- Check MongoDB Atlas network access (IP whitelist)
- Ensure database exists with correct name

### "Rate limit exceeded (429)"
- Wait 15 minutes for the limit to reset
- Or request from different IP
- In production, upgrade plan if needed

---

## 💡 Password Strength Levels

### Weak (Red) 🔴
- Less than 6 characters
- Limited character variety
- Easy to guess

### Medium (Amber) 🟡
- 6-11 characters
- Some character variety (2-3 types)
- Moderate security

### Strong (Green) 🟢
- 12+ characters
- Multiple character types (4 types)
- Good security level

**Types**: Lowercase, Uppercase, Numbers, Special characters

---

## 🎯 User Roles

### User Role
- [ ] Create account
- [ ] Update profile
- [ ] View own dashboard
- [ ] Cannot access admin routes

### Admin Role
- [x] All user permissions
- [x] Access admin dashboard
- [x] View system stats (can be extended)
- [x] Manage other users (can be extended)

---

## 📊 Database Schema

### User Model
```javascript
{
  name: String (required, min 2),
  email: String (required, unique),
  password: String (required, hashed),
  role: String (user|admin, default: user),
  isActive: Boolean (default: true),
  createdAt: DateTime (auto),
  updatedAt: DateTime (auto)
}
```

---

## 🔄 Authentication Flow

1. **Register** → Create account → Auto-login → Token generated
2. **Login** → Verify credentials → Token generated → Stored in localStorage
3. **Authenticated Request** → Token added to header → Verified by backend
4. **Invalid/Expired Token** → 401 response → Redirect to login → Clear token
5. **Logout** → Token cleared → Redirect to login → Session ends

---

## 📦 Dependencies Overview

### Backend
- **express**: Web framework
- **mongoose**: MongoDB ODM
- **bcryptjs**: Password hashing
- **jsonwebtoken**: JWT tokens
- **cors**: Cross-origin support
- **helmet**: Security headers
- **express-rate-limit**: Rate limiting
- **express-validator**: Input validation
- **dotenv**: Environment variables

### Frontend
- **react**: UI library
- **react-router-dom**: Client routing
- **axios**: HTTP client
- **react-hot-toast**: Notifications
- **vite**: Build tool

---

## 🚀 Deployment Platforms

### Backend
- **Render**: Easy deployment with free tier
- Alternative: Heroku, Railway, DigitalOcean

### Frontend
- **Vercel**: Optimized for Next.js/Vite
- Alternative: Netlify, GitHub Pages, Firebase

### Database
- **MongoDB Atlas**: Cloud MongoDB (free tier available)
- Alternative: AWS DocumentDB, Azure Cosmos

---

## 📚 Documentation

- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Complete deployment guide
- **[CHECKLIST.md](./CHECKLIST.md)** - Pre-deployment checklist
- **[FINALIZATION_SUMMARY.md](./FINALIZATION_SUMMARY.md)** - What's included
- **[README.md](./README.md)** - Project overview

---

## 🎓 Learning Resources

- JWT Authentication: https://jwt.io/introduction
- Express Security: https://expressjs.com/en/advanced/best-practice-security.html
- React Hooks: https://react.dev/reference/react/hooks
- MongoDB Aggregation: https://docs.mongodb.com/manual/aggregation/
- REST API Design: https://restfulapi.net/

---

## 📞 Helpful Commands

```bash
# Generate JWT secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Clear MongoDB connection issues
npm run server

# Check what's running on ports
lsof -i :5000
lsof -i :5173

# Kill process on specific port (Unix)
kill -9 $(lsof -t -i:5000)

# Kill process on specific port (Windows)
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# View environment variables
echo $MONGO_URI
```

---

## ✅ Production Checklist (Quick)

- [ ] Environment variables configured
- [ ] MongoDB Atlas cluster created
- [ ] Backend deployed to Render
- [ ] Frontend deployed to Vercel
- [ ] CORS updated to production URLs
- [ ] SSL/HTTPS working
- [ ] All features tested
- [ ] Backups enabled
- [ ] Monitoring configured
- [ ] Team trained

---

## 🎉 You're All Set!

Your MERN authentication system is now:
- ✅ **Secure** - With helmet, rate limiting, and JWT
- ✅ **Validated** - All inputs checked
- ✅ **Tested** - All features working
- ✅ **Documented** - Complete guides provided
- ✅ **Ready** - For production deployment

**Start developing and deploying!** 🚀

---

**Last Updated**: 2024
**Status**: Production Ready ✅
