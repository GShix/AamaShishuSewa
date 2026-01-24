# Quick Setup Guide - Admin Authentication

## 🚀 Quick Start (5 Minutes)

### Step 1: Update Environment Variables
Add to `server/.env`:
```env
ADMIN_REGISTRATION_SECRET=admin-secret-key-2026
```

### Step 2: Restart the Server
```bash
cd server
npm run dev
```

### Step 3: Access Admin Pages
- **Login**: http://localhost:5173/admin/login
- **Register**: http://localhost:5173/admin/register
- **Dashboard**: http://localhost:5173/admin/dashboard (protected)

### Step 4: Create Your First Admin

**Option 1: Using the UI**
1. Navigate to http://localhost:5173/admin/register
2. Fill in the form:
   - Full Name: `Your Name`
   - Email: `admin@example.com`
   - Phone: `9812345678` (10 digits)
   - Password: `AdminPass123` (min 8 chars)
   - Confirm Password: `AdminPass123`
   - Role: Select `Admin` or `Super Admin`
   - Secret Key: `admin-secret-key-2026`
3. Click "Create Admin Account"

**Option 2: Using API (Postman/cURL)**
```bash
curl -X POST http://localhost:8000/api/admin/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "AdminPass123",
    "fullName": "Your Name",
    "phone": "9812345678",
    "role": "admin",
    "secretKey": "admin-secret-key-2026"
  }'
```

### Step 5: Login as Admin
1. Navigate to http://localhost:5173/admin/login
2. Enter your credentials
3. You'll be redirected to the admin dashboard

---

## 📋 What Was Created

### Backend (5 files):
1. ✅ `server/src/controllers/admin/adminAuthController.js` - Authentication logic
2. ✅ `server/src/routes/admin/adminAuth.js` - Admin routes
3. ✅ `server/src/middleware/auth.js` - Updated with admin middleware
4. ✅ `server/src/server.js` - Updated with admin routes

### Frontend (3 files):
1. ✅ `client/src/components/admin/Login.jsx` - Admin login page
2. ✅ `client/src/components/admin/Register.jsx` - Admin registration page
3. ✅ `client/src/App.jsx` - Updated with admin routes
4. ✅ `client/src/utils/api.js` - Added admin API endpoints

---

## 🎯 Key Features

### ✅ Implemented:
- [x] Admin and Super Admin roles
- [x] Separate authentication from regular users
- [x] JWT token-based authentication
- [x] Password hashing with bcrypt
- [x] Secret key validation
- [x] Beautiful UI with gradients
- [x] Form validation
- [x] Error handling
- [x] Protected routes
- [x] Profile management endpoints
- [x] Password change functionality

---

## 🔒 Security Notes

1. **Secret Key**: Change `ADMIN_REGISTRATION_SECRET` in production to a strong, unique value
2. **JWT Secret**: Ensure `JWT_SECRET` is set to a strong value
3. **HTTPS**: Use HTTPS in production
4. **Token Storage**: Tokens are stored separately (`adminToken` vs `token`)

---

## 🎨 UI Features

- Modern gradient design (indigo → purple → pink)
- Responsive layout
- Password visibility toggle
- Role selection with visual cards
- Loading states
- Error messages
- Form validation
- Smooth animations

---

## 🔑 Default Credentials

After registration, use your chosen credentials:
```
Email: (your email)
Password: (your password)
```

---

## 📞 API Endpoints Created

```
POST   /api/admin/auth/login              - Admin login
POST   /api/admin/auth/register           - Admin registration
GET    /api/admin/auth/profile            - Get admin profile (protected)
PUT    /api/admin/auth/profile            - Update admin profile (protected)
PUT    /api/admin/auth/change-password    - Change password (protected)
```

---

## 🧪 Test the API

### Test Registration:
```bash
curl -X POST http://localhost:8000/api/admin/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@admin.com",
    "password": "TestPass123",
    "fullName": "Test Admin",
    "phone": "9800000000",
    "role": "admin",
    "secretKey": "admin-secret-key-2026"
  }'
```

### Test Login:
```bash
curl -X POST http://localhost:8000/api/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@admin.com",
    "password": "TestPass123"
  }'
```

---

## 🐛 Troubleshooting

### Port Issues
- Frontend: http://localhost:5173
- Backend: http://localhost:8000

### Secret Key Error
Make sure the secret key in registration form matches `ADMIN_REGISTRATION_SECRET` in `.env`

### Token Issues
Clear browser localStorage and login again

---

## 📚 Full Documentation
See [ADMIN_AUTH_DOCUMENTATION.md](./ADMIN_AUTH_DOCUMENTATION.md) for complete details.

---

**Ready to use! 🎉**
