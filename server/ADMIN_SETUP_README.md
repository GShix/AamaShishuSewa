# Admin System Setup Guide

## 📋 Overview

This document provides complete instructions for setting up and managing the admin system for the Aama Shishu Sewa application. The admin system uses a separate `admins` table with role-based access control (RBAC) following the MVC pattern.

## 🏗️ Architecture

### MVC Pattern Implementation

```
├── src/
│   ├── modal/
│   │   └── adminModel.js          # Schema documentation
│   ├── controllers/
│   │   └── admin/
│   │       ├── adminAuthController.js   # Authentication logic
│   │       └── adminController.js       # CRUD operations
│   ├── routes/
│   │   └── admin/
│   │       ├── adminAuth.js        # Auth routes
│   │       └── admin.js            # Admin management routes
│   └── middleware/
│       └── auth.js                 # Authentication middleware
└── scripts/
    ├── insertAdmins.js             # Insert initial admins
    └── migrations/
        └── 001_create_admins_table.sql  # Database migration
```

## 🗄️ Database Schema

### Admins Table Structure

| Column         | Type          | Constraints                    | Description                    |
|---------------|---------------|--------------------------------|--------------------------------|
| id            | UUID          | PRIMARY KEY, DEFAULT uuid      | Unique identifier              |
| email         | VARCHAR(255)  | UNIQUE, NOT NULL               | Admin email for login          |
| password_hash | VARCHAR(255)  | NOT NULL                       | Bcrypt hashed password         |
| full_name     | VARCHAR(255)  | NOT NULL                       | Full name of admin             |
| phone         | VARCHAR(15)   | UNIQUE, NOT NULL               | Contact phone number           |
| role          | VARCHAR(50)   | NOT NULL, DEFAULT 'admin'      | admin or superAdmin            |
| status        | VARCHAR(20)   | NOT NULL, DEFAULT 'active'     | active, inactive, suspended    |
| profile_image | TEXT          | NULL                           | URL to profile image           |
| created_at    | TIMESTAMPTZ   | NOT NULL, DEFAULT NOW()        | Account creation timestamp     |
| updated_at    | TIMESTAMPTZ   | NOT NULL, DEFAULT NOW()        | Last update timestamp          |
| last_login    | TIMESTAMPTZ   | NULL                           | Last successful login          |

### Role Types

1. **superAdmin**
   - Full system access
   - Can manage other admins
   - Can create, update, delete admins
   - Can access all admin endpoints

2. **admin**
   - Limited access
   - Can manage content (users, bookings, professionals, etc.)
   - Cannot manage other admins
   - Can access most admin endpoints except admin management

## 🚀 Setup Instructions

### Step 1: Run Database Migration

1. Open Supabase SQL Editor
2. Run the migration script:

```bash
# The SQL script is located at:
scripts/migrations/001_create_admins_table.sql
```

Or copy and paste the SQL from that file into Supabase SQL Editor and execute.

### Step 2: Insert Initial Admins

Run the insert script to create default admin users:

```bash
node scripts/insertAdmins.js
```

**Default Credentials Created:**

```
👑 SUPER ADMIN: Dambar Gharti
Email: dambarsinggharti@gmail.com
Password: SuperAdmin@123456

👤 ADMIN: Dilip Bhattarai
Email: aamasisiusewa@gmail.com
Password: Admin@123456
```

⚠️ **IMPORTANT:** Change these passwords immediately after first login!

### Step 3: Verify Setup

1. Check that admins table exists:
```sql
SELECT * FROM public.admins;
```

2. Test login endpoint:
```bash
POST http://localhost:8000/api/admin/auth/login
Content-Type: application/json

{
  "email": "dambarsinggharti@gmail.com",
  "password": "SuperAdmin@123456"
}
```

## 📡 API Endpoints

### Authentication Endpoints

#### Login
```http
POST /api/admin/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": {
    "id": "uuid",
    "email": "admin@example.com",
    "fullName": "Admin Name",
    "role": "superAdmin",
    "phone": "1234567890",
    "status": "active"
  },
  "token": "jwt_token_here"
}
```

#### Register (Requires Secret Key)
```http
POST /api/admin/auth/register
Content-Type: application/json

{
  "email": "newadmin@example.com",
  "password": "SecurePass123",
  "fullName": "New Admin",
  "phone": "9876543210",
  "role": "admin",
  "secretKey": "admin-secret-key-2026"
}
```

#### Get Profile
```http
GET /api/admin/auth/profile
Authorization: Bearer {token}
```

#### Update Profile
```http
PUT /api/admin/auth/profile
Authorization: Bearer {token}
Content-Type: application/json

{
  "fullName": "Updated Name",
  "phone": "9999999999",
  "email": "updated@example.com"
}
```

#### Change Password
```http
PUT /api/admin/auth/change-password
Authorization: Bearer {token}
Content-Type: application/json

{
  "currentPassword": "oldpass",
  "newPassword": "newpass123"
}
```

### Admin Management Endpoints (SuperAdmin Only)

#### Get All Admins
```http
GET /api/admin/admins?page=1&limit=10&role=admin&status=active&search=john
Authorization: Bearer {superadmin_token}
```

#### Get Admin by ID
```http
GET /api/admin/admins/{id}
Authorization: Bearer {superadmin_token}
```

#### Create Admin
```http
POST /api/admin/admins
Authorization: Bearer {superadmin_token}
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "SecurePass123",
  "fullName": "Admin Name",
  "phone": "1234567890",
  "role": "admin",
  "status": "active"
}
```

#### Update Admin
```http
PUT /api/admin/admins/{id}
Authorization: Bearer {superadmin_token}
Content-Type: application/json

{
  "fullName": "Updated Name",
  "phone": "9876543210",
  "role": "superAdmin",
  "status": "active"
}
```

#### Reset Admin Password
```http
PUT /api/admin/admins/{id}/password
Authorization: Bearer {superadmin_token}
Content-Type: application/json

{
  "newPassword": "NewSecurePass123"
}
```

#### Delete Admin
```http
DELETE /api/admin/admins/{id}?hardDelete=false
Authorization: Bearer {superadmin_token}
```
- `hardDelete=false`: Soft delete (set status to inactive)
- `hardDelete=true`: Permanently delete from database

#### Get Admin Statistics
```http
GET /api/admin/admins/stats
Authorization: Bearer {superadmin_token}
```

**Response:**
```json
{
  "message": "Admin statistics retrieved successfully",
  "stats": {
    "total": 10,
    "superAdmins": 2,
    "admins": 8,
    "active": 9,
    "inactive": 1,
    "suspended": 0
  }
}
```

## 🔐 Security Features

### Password Requirements
- Minimum 8 characters
- Bcrypt hashing with salt rounds of 12
- Passwords are never returned in API responses

### Email Validation
- Must match standard email format
- Case-insensitive unique constraint

### Phone Validation
- Must be 10-15 digits
- Unique across all admins

### JWT Tokens
- Expiration: 7 days (configurable)
- Contains userId and role
- Must be included in Authorization header

### Row Level Security (RLS)
- Service role has full access
- Admins can only read/update their own profile
- SuperAdmins can manage all admins
- Prevents privilege escalation

## 🔄 Migration from Users Table

If you have existing admins in the `users` table:

```sql
-- Migrate existing admins to admins table
INSERT INTO public.admins (
  email, password_hash, full_name, phone, role, status, created_at, last_login
)
SELECT 
  email, password_hash, full_name, phone, role, 
  COALESCE(status, 'active') as status, 
  created_at, last_login
FROM public.users
WHERE role IN ('admin', 'superAdmin')
ON CONFLICT (email) DO NOTHING;
```

## 📝 Environment Variables

Ensure these are set in your `.env` file:

```env
# Supabase Configuration
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SUPABASE_ANON_KEY=your_anon_key

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d

# Admin Registration
ADMIN_REGISTRATION_SECRET=admin-secret-key-2026

# Server Configuration
PORT=8000
NODE_ENV=development
```

## 🧪 Testing

### Test Admin Login
```bash
curl -X POST http://localhost:8000/api/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "dambarsinggharti@gmail.com",
    "password": "SuperAdmin@123456"
  }'
```

### Test Get All Admins (SuperAdmin)
```bash
curl -X GET "http://localhost:8000/api/admin/admins?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Test Create Admin (SuperAdmin)
```bash
curl -X POST http://localhost:8000/api/admin/admins \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_SUPERADMIN_TOKEN" \
  -d '{
    "email": "testadmin@example.com",
    "password": "TestPass123",
    "fullName": "Test Admin",
    "phone": "9999999999",
    "role": "admin"
  }'
```

## 🐛 Troubleshooting

### Issue: "Admin already exists"
**Solution:** Check if admin with same email/phone exists:
```sql
SELECT * FROM admins WHERE email = 'admin@example.com' OR phone = '1234567890';
```

### Issue: "Invalid token"
**Solution:** 
1. Check if JWT_SECRET is set correctly
2. Ensure token is included in Authorization header
3. Verify token hasn't expired

### Issue: "Super Admin access required"
**Solution:** 
1. Verify user role is 'superAdmin'
2. Check token payload contains correct role
3. Ensure requireSuperAdmin middleware is working

### Issue: RLS policy errors
**Solution:**
1. Verify RLS policies are created correctly
2. Check service role key is being used
3. Review Supabase logs for policy violations

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Express.js Documentation](https://expressjs.com/)
- [JWT Documentation](https://jwt.io/)
- [Bcrypt Documentation](https://www.npmjs.com/package/bcryptjs)

## 🤝 Support

For issues or questions:
1. Check the troubleshooting section
2. Review Supabase logs
3. Check server console for errors
4. Contact system administrator

## 📄 License

This admin system is part of the Aama Shishu Sewa application.

---

**Last Updated:** January 21, 2026
**Version:** 1.0.0
