# Admin Authentication System - आमा शिशु सेवा

## Overview
Complete admin authentication system with role-based access control for **Admin** and **Super Admin** roles.

---

## 🎯 Features

### Backend (Server)
- ✅ Separate admin authentication endpoints
- ✅ Role-based middleware (`admin`, `superAdmin`)
- ✅ JWT token-based authentication
- ✅ Secure password hashing with bcrypt
- ✅ Secret key validation for admin registration
- ✅ Admin profile management
- ✅ Password change functionality

### Frontend (Client)
- ✅ Beautiful admin login page
- ✅ Admin registration with role selection
- ✅ Role-based route protection
- ✅ Separate token storage for admin sessions
- ✅ Modern UI with gradient designs
- ✅ Form validation and error handling

---

## 📁 File Structure

### Backend Files Created/Modified:
```
server/
├── src/
│   ├── controllers/
│   │   └── admin/
│   │       └── adminAuthController.js    ✨ NEW - Admin authentication logic
│   ├── routes/
│   │   └── admin/
│   │       └── adminAuth.js              ✨ NEW - Admin routes
│   ├── middleware/
│   │   └── auth.js                       ✏️ UPDATED - Added requireSuperAdmin
│   └── server.js                         ✏️ UPDATED - Added admin routes
```

### Frontend Files Created/Modified:
```
client/
├── src/
│   ├── components/
│   │   └── admin/
│   │       ├── Login.jsx                 ✨ NEW - Admin login page
│   │       └── Register.jsx              ✨ NEW - Admin registration page
│   ├── utils/
│   │   └── api.js                        ✏️ UPDATED - Added adminAuthAPI
│   └── App.jsx                           ✏️ UPDATED - Added admin routes
```

---

## 🔐 Authentication Flow

### Admin Registration:
1. User fills registration form with:
   - Full Name
   - Email
   - Phone (10 digits)
   - Password (min. 8 characters)
   - Role selection (Admin/Super Admin)
   - **Secret Key** (required for security)

2. Backend validates:
   - All required fields
   - Email format
   - Phone format (10 digits)
   - Password strength
   - Secret key matches environment variable
   - No duplicate email/phone

3. On success:
   - Password hashed with bcrypt
   - Admin user created in database
   - JWT token generated
   - Redirected to admin dashboard

### Admin Login:
1. User enters email and password
2. Backend validates:
   - Credentials exist
   - User has admin/superAdmin role
   - Password is correct
   - Account is active

3. On success:
   - JWT token generated
   - Last login timestamp updated
   - Token stored in `adminToken` localStorage
   - User data stored in `adminUser` localStorage
   - Redirected to admin dashboard

---

## 🛡️ API Endpoints

### Public Endpoints:
```
POST /api/admin/auth/login
POST /api/admin/auth/register
```

### Protected Endpoints (Require Admin Token):
```
GET    /api/admin/auth/profile
PUT    /api/admin/auth/profile
PUT    /api/admin/auth/change-password
```

---

## 🔑 Environment Variables

Add to your `.env` file:

```env
# Admin Registration Secret Key
ADMIN_REGISTRATION_SECRET=admin-secret-key-2026

# JWT Configuration (if not already set)
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d
```

---

## 🎨 Frontend Routes

```javascript
/admin/login          → Admin Login Page
/admin/register       → Admin Registration Page
/admin/dashboard      → Protected Admin Dashboard
```

---

## 💾 Database Schema

The admin authentication uses the existing `users` table with these columns:

```sql
users:
  - id (UUID, primary key)
  - email (text, unique)
  - phone (text, unique)
  - password_hash (text)
  - full_name (text)
  - role (text) → 'admin' or 'superAdmin'
  - status (text) → 'active', 'inactive', etc.
  - created_at (timestamp)
  - last_login (timestamp)
```

---

## 🚀 Usage Examples

### 1. Register a New Admin:

**Frontend:**
```javascript
// Navigate to http://localhost:5173/admin/register
// Fill in the form:
{
  fullName: "John Doe",
  email: "admin@example.com",
  phone: "9800000000",
  role: "admin", // or "superAdmin"
  password: "SecurePass123",
  secretKey: "admin-secret-key-2026"
}
```

**Backend Request:**
```bash
POST http://localhost:8000/api/admin/auth/register
Content-Type: application/json

{
  "fullName": "John Doe",
  "email": "admin@example.com",
  "phone": "9800000000",
  "role": "admin",
  "password": "SecurePass123",
  "secretKey": "admin-secret-key-2026"
}
```

**Response:**
```json
{
  "message": "Admin registered successfully",
  "user": {
    "id": "uuid-here",
    "email": "admin@example.com",
    "phone": "9800000000",
    "fullName": "John Doe",
    "role": "admin",
    "status": "active"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

### 2. Admin Login:

**Frontend:**
```javascript
// Navigate to http://localhost:5173/admin/login
{
  email: "admin@example.com",
  password: "SecurePass123"
}
```

**Backend Request:**
```bash
POST http://localhost:8000/api/admin/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "SecurePass123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": {
    "id": "uuid-here",
    "email": "admin@example.com",
    "fullName": "John Doe",
    "role": "admin",
    "phone": "9800000000",
    "status": "active"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

---

## 🔒 Middleware Usage

### Protect Routes for Admins:

```javascript
import { authenticate, requireAdmin } from './middleware/auth.js';

// Only admin or superAdmin can access
router.get('/admin-only-route', authenticate, requireAdmin, controller);
```

### Protect Routes for Super Admins Only:

```javascript
import { authenticate, requireSuperAdmin } from './middleware/auth.js';

// Only superAdmin can access
router.get('/super-admin-route', authenticate, requireSuperAdmin, controller);
```

---

## 🎯 Role Permissions

### Admin Role:
- ✅ View bookings
- ✅ Manage professionals
- ✅ View analytics
- ✅ Handle customer support
- ✅ Update own profile
- ✅ Change own password

### Super Admin Role:
- ✅ All admin permissions
- ✅ Manage other admins
- ✅ System configuration
- ✅ Advanced settings
- ✅ Full database access

---

## 🧪 Testing

### Test Admin Registration:
```bash
curl -X POST http://localhost:8000/api/admin/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@admin.com",
    "password": "TestPass123",
    "fullName": "Test Admin",
    "phone": "9812345678",
    "role": "admin",
    "secretKey": "admin-secret-key-2026"
  }'
```

### Test Admin Login:
```bash
curl -X POST http://localhost:8000/api/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@admin.com",
    "password": "TestPass123"
  }'
```

### Test Protected Route:
```bash
curl -X GET http://localhost:8000/api/admin/auth/profile \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN_HERE"
```

---

## 🛠️ Frontend Components

### AdminLogin Component Features:
- Email and password inputs
- Show/hide password toggle
- Form validation
- Error handling
- Loading states
- Responsive design
- Beautiful gradient UI
- Role-based redirect

### AdminRegister Component Features:
- Full name, email, phone inputs
- Password and confirm password
- Role selection (Admin/Super Admin)
- Secret key input
- Visual role cards
- Comprehensive validation
- Beautiful gradient UI
- Informative role descriptions

---

## 🎨 UI/UX Features

### Design Elements:
- ✨ Gradient backgrounds (indigo → purple → pink)
- 🎯 Modern glassmorphism effects
- 📱 Fully responsive design
- 🔄 Smooth transitions and animations
- 🎭 Icon-based visual hierarchy
- 🌈 Role-specific color coding
- 📋 Clear form labels and placeholders
- ⚠️ Inline error messages
- 🔐 Password visibility toggles

### Color Scheme:
- **Admin Role**: Indigo (600-700)
- **Super Admin Role**: Purple (600-700)
- **Accents**: Pink (600-700)
- **Errors**: Red (50-800)
- **Success**: Green (50-800)

---

## 🔧 Customization

### Change Secret Key:
Update in `.env`:
```env
ADMIN_REGISTRATION_SECRET=your-new-secret-key-here
```

### Modify Password Requirements:
In `adminAuthController.js`:
```javascript
if (password.length < 8) {  // Change minimum length
  return res.status(400).json({ error: 'Password must be at least 8 characters' });
}
```

### Add Additional Roles:
1. Update validation in `adminAuthController.js`:
```javascript
if (!['admin', 'superAdmin', 'moderator'].includes(role)) {
  return res.status(400).json({ error: 'Invalid role' });
}
```

2. Update middleware in `auth.js`:
```javascript
export const requireModerator = (req, res, next) => {
  if (!['admin', 'superAdmin', 'moderator'].includes(req.userRole)) {
    return res.status(403).json({ error: 'Moderator access required' });
  }
  next();
};
```

---

## 📝 Security Best Practices

✅ **Implemented:**
- Passwords hashed with bcrypt (salt rounds: 12)
- JWT tokens for stateless authentication
- Secret key validation for admin registration
- Role-based access control
- Input validation on both client and server
- Separate token storage for admin sessions
- HTTPS recommended for production

🔒 **Recommendations:**
- Keep secret keys in environment variables
- Rotate JWT secrets regularly
- Implement rate limiting on auth endpoints
- Add 2FA for super admins (future enhancement)
- Log all admin actions for auditing
- Set up CORS properly in production
- Use HTTPS in production

---

## 🚦 Getting Started

### 1. Backend Setup:
```bash
cd server
npm install
# Add ADMIN_REGISTRATION_SECRET to .env
npm run dev
```

### 2. Frontend Setup:
```bash
cd client
npm install
npm run dev
```

### 3. Access Admin Pages:
- Login: http://localhost:5173/admin/login
- Register: http://localhost:5173/admin/register

### 4. Create First Admin:
1. Navigate to registration page
2. Fill in all required fields
3. Use the secret key from your `.env` file
4. Select role (Admin or Super Admin)
5. Submit and get redirected to dashboard

---

## 🐛 Troubleshooting

### Issue: "Invalid secret key"
**Solution:** Check that `ADMIN_REGISTRATION_SECRET` in `.env` matches the key you're using

### Issue: "Admin not found"
**Solution:** Ensure the user was created with role 'admin' or 'superAdmin'

### Issue: "Token expired"
**Solution:** Login again to get a new token

### Issue: Routes not working
**Solution:** Ensure server is running and admin routes are registered in `server.js`

---

## 📚 Additional Resources

- [JWT Documentation](https://jwt.io/)
- [Bcrypt Documentation](https://www.npmjs.com/package/bcryptjs)
- [React Router Documentation](https://reactrouter.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)

---

## 👥 Support

For issues or questions:
1. Check this documentation
2. Review error messages in browser console
3. Check server logs
4. Contact the development team

---

**Last Updated:** January 21, 2026  
**Version:** 1.0.0  
**Project:** आमा शिशु सेवा (Aama Shishu Sewa)
