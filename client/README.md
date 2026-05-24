# MERN Authentication Frontend - React + Vite

React frontend for the MERN authentication system with JWT and role-based access control.

## Features

- ✅ User authentication (login/register)
- ✅ Protected routes with private route components
- ✅ Admin-only routes
- ✅ Global auth state with Context API
- ✅ JWT token management
- ✅ Clean and modern UI
- ✅ Toast notifications for user feedback
- ✅ Form validation
- ✅ Responsive design

## Project Structure

```
/client
  ├── /src
  │   ├── /api
  │   │   └── axios.js              # Axios instance with interceptors
  │   ├── /context
  │   │   └── AuthContext.jsx       # Global auth state
  │   ├── /hooks
  │   │   └── useAuth.js            # Custom auth hook
  │   ├── /components
  │   │   ├── Navbar.jsx            # Navigation bar
  │   │   ├── PrivateRoute.jsx      # Protected route wrapper
  │   │   └── AdminRoute.jsx        # Admin route wrapper
  │   ├── /pages
  │   │   ├── HomePage.jsx          # Public home page
  │   │   ├── LoginPage.jsx         # Login form
  │   │   ├── RegisterPage.jsx      # Registration form
  │   │   ├── DashboardPage.jsx     # Protected dashboard
  │   │   ├── AdminPage.jsx         # Admin-only page
  │   │   └── NotFoundPage.jsx      # 404 page
  │   ├── /styles
  │   │   ├── index.css             # Global styles
  │   │   ├── Navbar.css
  │   │   ├── HomePage.css
  │   │   ├── AuthPages.css
  │   │   ├── DashboardPage.css
  │   │   ├── AdminPage.css
  │   │   └── NotFoundPage.css
  │   ├── App.jsx                   # Main app component with routes
  │   └── main.jsx                  # Entry point
  ├── index.html                    # HTML template
  ├── vite.config.js               # Vite configuration with API proxy
  ├── package.json                 # Dependencies
  ├── .gitignore                   # Git ignore rules
  └── README.md                    # This file
```

## Installation

### 1. Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Backend running on `http://localhost:5000`

### 2. Install Dependencies

```bash
cd client
npm install
```

This installs:
- **react** - UI library
- **react-dom** - React rendering
- **react-router-dom** - Client-side routing
- **axios** - HTTP client
- **react-hot-toast** - Notifications
- **vite** - Build tool
- **@vitejs/plugin-react** - React plugin for Vite

## Running the Application

### Development Mode

```bash
npm run dev
```

Frontend will open at: `http://localhost:3000`

### Build for Production

```bash
npm run build
```

Creates optimized build in `dist/` folder

### Preview Production Build

```bash
npm run preview
```

## Features Explained

### Authentication Flow

1. **Register**: Create new account → Saves token to localStorage → Redirect to dashboard
2. **Login**: Authenticate with credentials → Saves token → Redirect to dashboard
3. **Auto-login**: On page load, checks localStorage for token → Verifies with backend
4. **Logout**: Clears token from localStorage → Redirect to home

### Protected Routes

- **PrivateRoute**: Requires authentication. Redirects to login if not authenticated
- **AdminRoute**: Requires admin role. Redirects to dashboard with error if not admin

### Global State Management

Uses Context API with `AuthContext`:
- `user` - Current logged-in user data
- `token` - JWT token
- `loading` - Loading state
- `register(name, email, password)` - Register function
- `login(email, password)` - Login function
- `logout()` - Logout function

### API Integration

Uses Axios with interceptors:
- Automatically attaches JWT token to requests
- Handles 401 Unauthorized responses
- Clears token if expired

## Pages Overview

### Public Pages

#### HomePage
- Welcome message
- Feature highlights
- Call-to-action buttons
- Links to login/register

#### LoginPage
- Email and password fields
- Form validation
- Error messages
- Link to registration

#### RegisterPage
- Name, email, password fields
- Role selection (user/admin)
- Password confirmation
- Client-side validation

### Protected Pages

#### DashboardPage
- User profile information
- Account summary stats
- Admin panel link (if user is admin)
- Welcome greeting

#### AdminPage
- Admin-only content
- System statistics
- Admin actions grid
- Recent activity table
- Admin profile card

#### NotFoundPage
- 404 error message
- Link back to home

## Styling

Uses CSS with CSS custom properties (variables) for consistency:

**Color Scheme:**
- Primary: `#4f46e5` (Indigo)
- Success: `#22c55e` (Green)
- Error: `#ef4444` (Red)
- Background: `#f8fafc` (Light)

**Features:**
- Responsive design
- CSS Grid for layouts
- Smooth transitions
- Professional shadows and borders
- Mobile-friendly

## Form Validation

All forms include:
- Required field validation
- Email format validation
- Password strength checks (min 6 chars)
- Real-time error messages
- Disabled submit during submission

## API Endpoints Used

```javascript
// Authentication
POST   /api/auth/register     // Create account
POST   /api/auth/login        // Authenticate user
GET    /api/auth/me           // Get user profile
GET    /api/auth/logout       // Logout (optional)

// Admin
GET    /api/admin             // Admin test endpoint
```

## Environment Setup

Create `.env` file (optional for development):

```env
# API base URL - Vite proxy handles this in dev
VITE_API_URL=http://localhost:5000/api
```

## Deployment

### Vercel/Netlify

1. Push to GitHub
2. Connect repository to Vercel/Netlify
3. Set build command: `npm run build`
4. Set output directory: `dist/`
5. Add environment variables:
   ```
   VITE_API_URL=https://your-backend-url.com/api
   ```

### Docker

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

## Development Tips

### Using Custom Hook

```javascript
import useAuth from "../hooks/useAuth";

function MyComponent() {
  const { user, login, logout } = useAuth();
  // ...
}
```

### Making API Calls

```javascript
import api from "../api/axios";

// In component
const response = await api.get("/endpoint");
const result = await api.post("/endpoint", data);
```

### Showing Toasts

```javascript
import toast from "react-hot-toast";

toast.success("Success message!");
toast.error("Error message!");
toast.loading("Loading...");
```

## Running Frontend and Backend Together

### Option 1: Two Terminal Windows

Terminal 1:
```bash
cd server
npm run dev
```

Terminal 2:
```bash
cd client
npm run dev
```

### Option 2: Using Concurrently (Root level)

Create root `package.json`:

```json
{
  "scripts": {
    "dev": "concurrently \"npm run server\" \"npm run client\"",
    "server": "cd server && npm run dev",
    "client": "cd client && npm run dev"
  }
}
```

Then run:
```bash
npm install concurrently
npm run dev
```

## Troubleshooting

### CORS Errors
- Ensure backend is running on port 5000
- Check `vite.config.js` proxy settings
- Verify `CORS` is enabled in backend

### 401 Unauthorized
- Token might be expired (7 days)
- Browser localStorage might be cleared
- Try logging in again

### Pages Not Loading
- Ensure all routes are defined in `App.jsx`
- Check component import paths
- Verify CSS imports

### Styling Issues
- Clear browser cache (Ctrl+Shift+Delete)
- Check CSS file imports
- Verify CSS custom properties in `index.css`

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile browsers: iOS Safari 12+, Chrome Android

## Security Notes

1. **Token Storage**: Stored in localStorage (consider httpOnly cookies for production)
2. **HTTPS**: Use HTTPS in production
3. **XSS Protection**: React automatically escapes content
4. **CSRF**: Backend should implement CSRF tokens if needed

## Next Steps

1. Integrate with backend
2. Add more features (change password, update profile)
3. Implement refresh tokens
4. Add error boundary components
5. Add unit tests
6. Implement analytics

## Resources

- [React Documentation](https://react.dev/)
- [React Router Documentation](https://reactrouter.com/)
- [Vite Documentation](https://vitejs.dev/)
- [Axios Documentation](https://axios-http.com/)
- [React Hot Toast](https://react-hot-toast.com/)

## License

MIT License - Feel free to use for learning and projects

## Support

For issues or questions:
1. Check the Troubleshooting section
2. Review browser console for errors
3. Check network requests in DevTools
4. Verify backend is running and responding
