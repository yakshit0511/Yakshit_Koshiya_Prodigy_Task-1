# MERN Authentication Backend

Complete backend implementation for a MERN stack authentication system with JWT and role-based access control.

## Features

- ✅ User Registration with email validation
- ✅ Secure Login with password hashing (bcryptjs)
- ✅ JWT Token-based Authentication
- ✅ Role-Based Access Control (Admin/User)
- ✅ Protected Routes with middleware
- ✅ MongoDB Atlas integration
- ✅ Input validation with express-validator
- ✅ Error handling and logging
- ✅ CORS support for frontend communication

## Project Structure

```
/server
  ├── /config
  │   └── db.js                    # MongoDB connection setup
  ├── /models
  │   └── User.js                  # Mongoose User schema
  ├── /middleware
  │   ├── authMiddleware.js        # JWT verification
  │   └── roleMiddleware.js        # Role-based access control
  ├── /controllers
  │   └── authController.js        # Auth logic (register, login, getMe)
  ├── /routes
  │   └── authRoutes.js            # Auth API routes
  ├── server.js                    # Express app setup
  ├── .env                         # Environment variables
  ├── .gitignore                   # Git ignore rules
  ├── package.json                 # Dependencies
  └── README.md                    # This file
```

## Installation

### 1. Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account

### 2. Install Dependencies

```bash
cd server
npm install
```

This installs:
- **express** - Web framework
- **mongoose** - MongoDB ODM
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **cors** - Cross-origin resource sharing
- **express-validator** - Input validation
- **dotenv** - Environment variable management
- **nodemon** - Development auto-reload (dev only)

### 3. MongoDB Atlas Setup

#### Create a Free MongoDB Atlas Cluster:

1. **Go to MongoDB Atlas**
   - Visit: https://www.mongodb.com/cloud/atlas
   - Click "Try Free" or Sign In

2. **Create an Account**
   - Enter your email and create a password
   - Verify your email

3. **Create a New Project**
   - Click "New Project"
   - Enter project name (e.g., "MERN Auth")
   - Click "Create Project"

4. **Create a Cluster**
   - Click "Create a Deployment"
   - Choose "M0 Free" (always free tier)
   - Select your preferred region (closest to your location)
   - Click "Create Deployment"
   - Wait 2-3 minutes for cluster creation

5. **Set Up Database Access**
   - Go to "Database Access" in left sidebar
   - Click "Add New Database User"
   - Create username and password (save these!)
   - Click "Add User"

6. **Whitelist IP Address**
   - Go to "Network Access" in left sidebar
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
   - Add IP: 0.0.0.0/0
   - Click "Confirm"
   - ⚠️ Note: In production, use specific IP addresses

7. **Get Connection String**
   - Go back to "Clusters"
   - Click "Connect" button
   - Select "Drivers"
   - Copy the connection string
   - Replace `<username>`, `<password>`, and `<database>` placeholders
   - Format: `mongodb+srv://username:password@cluster.mongodb.net/dbname`

8. **Update .env File**
   ```
   MONGO_URI=mongodb+srv://username:password@cluster0.mongodb.net/mern_auth
   ```

### 4. Environment Setup

Create/update `.env` file with your values:

```env
# MongoDB Atlas
MONGO_URI=mongodb+srv://username:password@cluster0.mongodb.net/mern_auth

# JWT Secret (use a strong random key)
JWT_SECRET=your_super_secret_jwt_key_12345

# Server
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

**Generate a secure JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Running the Server

### Development Mode (with auto-reload):
```bash
npm run dev
```

### Production Mode:
```bash
npm start
```

Server will start at: `http://localhost:5000`

### Check Health:
```bash
curl http://localhost:5000/api/health
```

## API Endpoints

### Public Routes

#### 1. Register New User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePassword123"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Account created successfully!",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "createdAt": "2024-01-01T10:00:00Z"
  }
}
```

#### 2. Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePassword123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful!",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "createdAt": "2024-01-01T10:00:00Z"
  }
}
```

### Protected Routes (Requires Authentication)

#### 3. Get Current User Profile
```http
GET /api/auth/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "User profile retrieved successfully",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "isActive": true,
    "createdAt": "2024-01-01T10:00:00Z",
    "updatedAt": "2024-01-01T10:00:00Z"
  }
}
```

#### 4. Logout
```http
GET /api/auth/logout
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Logout successful! Please remove the token from your client."
}
```

### Admin Routes (Requires Authentication + Admin Role)

#### 5. Admin Test Endpoint
```http
GET /api/admin
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

**Response (200 OK - Admin only):**
```json
{
  "success": true,
  "message": "Welcome Admin!",
  "data": {
    "adminId": "507f1f77bcf86cd799439011",
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

### User Routes (Requires Authentication)

#### 6. User Test Endpoint
```http
GET /api/user
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Welcome User!",
  "data": {
    "userId": "507f1f77bcf86cd799439011",
    "email": "john@example.com",
    "name": "John Doe",
    "role": "user"
  }
}
```

## Authentication Flow

### Registration Flow:
1. User submits name, email, password
2. Server validates input
3. Check if email already exists
4. Hash password using bcryptjs (10 salt rounds)
5. Save user to MongoDB
6. Generate JWT token
7. Return token + user info

### Login Flow:
1. User submits email and password
2. Server validates input
3. Find user by email
4. Compare password with bcrypt
5. If match → generate JWT token
6. Return token + user info

### Protected Route Flow:
1. Client sends request with `Authorization: Bearer <token>`
2. authMiddleware extracts and verifies token
3. If valid → fetch user from DB and attach to request
4. If invalid/expired → return 401 Unauthorized
5. If user has wrong role → roleMiddleware returns 403 Forbidden

## Error Handling

Common error responses:

### 400 Bad Request - Validation Error
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email address"
    }
  ]
}
```

### 401 Unauthorized - Missing/Invalid Token
```json
{
  "success": false,
  "message": "No authentication token provided. Please log in."
}
```

### 403 Forbidden - Insufficient Permissions
```json
{
  "success": false,
  "message": "Access denied. This resource requires role: admin"
}
```

### 409 Conflict - Email Already Exists
```json
{
  "success": false,
  "message": "Email already registered. Please use a different email or log in."
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Server error message",
  "error": "Detailed error (only in development)"
}
```

## Security Best Practices

1. **Password Hashing**: Uses bcryptjs with 10 salt rounds
2. **JWT Expiration**: Tokens expire after 7 days
3. **Input Validation**: All inputs validated with express-validator
4. **CORS**: Configured to prevent unauthorized cross-origin access
5. **Environment Variables**: Sensitive data stored in .env (never committed)
6. **Password in Responses**: Never returned in API responses
7. **Role-Based Access Control**: Routes protected by user roles

## Development Tips

### Test with cURL:

**Register:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

**Get Profile (replace TOKEN):**
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Test with Postman:

1. Import the API endpoints
2. Set Authorization type to "Bearer Token"
3. Paste your JWT token from login response
4. Send requests

## Database Schema

### User Schema Fields:
- `name` - String (required, min 2, max 50)
- `email` - String (required, unique, valid email)
- `password` - String (required, min 6, hashed)
- `role` - String (enum: 'user', 'admin', default: 'user')
- `isActive` - Boolean (default: true)
- `createdAt` - Date (auto)
- `updatedAt` - Date (auto)

## Troubleshooting

### MongoDB Connection Error
- Check MONGO_URI in .env
- Verify username and password are correct
- Ensure IP whitelist includes 0.0.0.0/0 (development)
- Check internet connection

### JWT Verification Failed
- Token might be expired (7 day limit)
- JWT_SECRET might be changed
- Token might be corrupted or malformed

### CORS Errors
- Ensure CLIENT_URL matches your frontend URL
- Check browser console for specific error message
- Verify cors() is configured in server.js

### Port Already in Use
```bash
# Kill process using port 5000 (Windows)
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Or change PORT in .env
PORT=5001
```

## Production Deployment

Before deploying to production:

1. **Change JWT_SECRET** to a strong random value
2. **Update MONGO_URI** to production database
3. **Set NODE_ENV=production**
4. **Update CLIENT_URL** to production frontend URL
5. **Use specific IP whitelist** in MongoDB instead of 0.0.0.0/0
6. **Enable HTTPS** on your server
7. **Add rate limiting** to prevent brute force attacks
8. **Add request logging** and monitoring
9. **Use secure headers** (helmet.js)
10. **Implement refresh tokens** for better security

## Next Steps

1. Create the frontend in `/client` folder
2. Integrate these APIs with React components
3. Store JWT token in localStorage (or httpOnly cookie)
4. Create protected page components
5. Add refresh token logic
6. Implement logout functionality

## Resources

- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Express.js Documentation](https://expressjs.com/)
- [JWT Documentation](https://jwt.io/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [bcryptjs Documentation](https://github.com/dcodeIO/bcrypt.js)

## License

MIT License - Feel free to use for learning and projects

## Support

For issues or questions:
1. Check the Troubleshooting section
2. Review error messages carefully
3. Check MongoDB Atlas connection
4. Verify .env variables are correct
5. Review console logs for stack traces
