# ✅ Admin System Setup Checklist

Use this checklist to ensure proper setup of the admin system.

## 📋 Pre-Setup

- [ ] Supabase project is created and accessible
- [ ] Environment variables are configured in `.env`
  - [ ] `SUPABASE_URL`
  - [ ] `SUPABASE_SERVICE_ROLE_KEY`
  - [ ] `SUPABASE_ANON_KEY`
  - [ ] `JWT_SECRET`
  - [ ] `JWT_EXPIRES_IN`
  - [ ] `ADMIN_REGISTRATION_SECRET`
  - [ ] `PORT`
- [ ] Node.js is installed (v16+ recommended)
- [ ] Dependencies are installed (`npm install`)

## 🗄️ Database Setup

- [ ] Open Supabase SQL Editor
- [ ] Copy contents of `scripts/migrations/001_create_admins_table.sql`
- [ ] Execute SQL migration in Supabase
- [ ] Verify `admins` table exists
  ```sql
  SELECT * FROM public.admins;
  ```
- [ ] Check RLS policies are created
  ```sql
  SELECT * FROM pg_policies WHERE tablename = 'admins';
  ```
- [ ] Verify triggers are created
  ```sql
  SELECT tgname FROM pg_trigger WHERE tgrelid = 'public.admins'::regclass;
  ```

## 👥 Initial Admin Creation

- [ ] Run insert script: `npm run admin:insert`
- [ ] Verify SuperAdmin created (Dambar Gharti)
- [ ] Verify Admin created (Dilip Bhattarai)
- [ ] Note down credentials (check console output)
- [ ] Verify in database:
  ```sql
  SELECT id, email, full_name, role, status FROM public.admins;
  ```

## 🧪 Testing Authentication

### Test SuperAdmin Login
- [ ] Start server: `npm run dev`
- [ ] Test login endpoint:
  ```bash
  curl -X POST http://localhost:8000/api/admin/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email": "dambarsinggharti@gmail.com", "password": "SuperAdmin@123456"}'
  ```
- [ ] Verify response contains:
  - [ ] `token`
  - [ ] `user.role` = "superAdmin"
  - [ ] `user.email`
  - [ ] `user.fullName`
- [ ] Copy token for next tests

### Test Admin Login
- [ ] Test login endpoint:
  ```bash
  curl -X POST http://localhost:8000/api/admin/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email": "aamasisiusewa@gmail.com", "password": "Admin@123456"}'
  ```
- [ ] Verify response contains:
  - [ ] `token`
  - [ ] `user.role` = "admin"

## 🔐 Testing Authorization

### Test SuperAdmin Endpoints
- [ ] Get all admins:
  ```bash
  curl -X GET http://localhost:8000/api/admin/admins \
    -H "Authorization: Bearer YOUR_SUPERADMIN_TOKEN"
  ```
- [ ] Verify can see all admins
- [ ] Get admin stats:
  ```bash
  curl -X GET http://localhost:8000/api/admin/admins/stats \
    -H "Authorization: Bearer YOUR_SUPERADMIN_TOKEN"
  ```
- [ ] Verify statistics are returned

### Test Admin Restrictions
- [ ] Try to access admin management with regular admin token:
  ```bash
  curl -X GET http://localhost:8000/api/admin/admins \
    -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
  ```
- [ ] Verify returns 403 Forbidden

### Test Profile Endpoints
- [ ] Get own profile:
  ```bash
  curl -X GET http://localhost:8000/api/admin/auth/profile \
    -H "Authorization: Bearer YOUR_TOKEN"
  ```
- [ ] Verify profile data returned
- [ ] Update profile:
  ```bash
  curl -X PUT http://localhost:8000/api/admin/auth/profile \
    -H "Authorization: Bearer YOUR_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"fullName": "Updated Name"}'
  ```
- [ ] Verify update successful

## 🎨 CRUD Operations (SuperAdmin)

### Create Admin
- [ ] Create new admin:
  ```bash
  curl -X POST http://localhost:8000/api/admin/admins \
    -H "Authorization: Bearer YOUR_SUPERADMIN_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
      "email": "testadmin@example.com",
      "password": "TestPass123",
      "fullName": "Test Admin",
      "phone": "9999999999",
      "role": "admin"
    }'
  ```
- [ ] Verify admin created successfully
- [ ] Check in database:
  ```sql
  SELECT * FROM admins WHERE email = 'testadmin@example.com';
  ```

### Update Admin
- [ ] Update admin details:
  ```bash
  curl -X PUT http://localhost:8000/api/admin/admins/ADMIN_ID \
    -H "Authorization: Bearer YOUR_SUPERADMIN_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"fullName": "Updated Admin Name"}'
  ```
- [ ] Verify update successful

### Delete Admin (Soft Delete)
- [ ] Soft delete admin:
  ```bash
  curl -X DELETE http://localhost:8000/api/admin/admins/ADMIN_ID \
    -H "Authorization: Bearer YOUR_SUPERADMIN_TOKEN"
  ```
- [ ] Verify status changed to 'inactive'
- [ ] Check in database:
  ```sql
  SELECT status FROM admins WHERE id = 'ADMIN_ID';
  ```

## 🔒 Security Verification

- [ ] Verify passwords are hashed (check database)
  ```sql
  SELECT password_hash FROM admins LIMIT 1;
  ```
- [ ] Passwords should start with `$2a$12$` (bcrypt hash)
- [ ] Verify RLS policies prevent unauthorized access
- [ ] Test that regular admin cannot access admin management endpoints
- [ ] Test that expired/invalid tokens are rejected
- [ ] Verify email uniqueness constraint
- [ ] Verify phone uniqueness constraint

## 📊 Data Validation

- [ ] Test invalid email format
  ```bash
  # Should return 400 error
  curl -X POST http://localhost:8000/api/admin/admins \
    -H "Authorization: Bearer YOUR_SUPERADMIN_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"email": "invalid-email", "password": "Test123", "fullName": "Test", "phone": "1234567890", "role": "admin"}'
  ```
- [ ] Test invalid phone format
- [ ] Test short password (< 8 chars)
- [ ] Test invalid role
- [ ] Test duplicate email
- [ ] Test duplicate phone

## 🔄 Password Management

- [ ] Change SuperAdmin password:
  ```bash
  curl -X PUT http://localhost:8000/api/admin/auth/change-password \
    -H "Authorization: Bearer YOUR_SUPERADMIN_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"currentPassword": "SuperAdmin@123456", "newPassword": "NewSecurePass@2026"}'
  ```
- [ ] Verify old password no longer works
- [ ] Verify new password works
- [ ] Test SuperAdmin resetting another admin's password:
  ```bash
  curl -X PUT http://localhost:8000/api/admin/admins/ADMIN_ID/password \
    -H "Authorization: Bearer YOUR_SUPERADMIN_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"newPassword": "ResetPass@123"}'
  ```

## 🎯 Final Checks

- [ ] All endpoints respond correctly
- [ ] No console errors in server
- [ ] No errors in Supabase logs
- [ ] Documentation files are accessible:
  - [ ] ADMIN_SETUP_README.md
  - [ ] QUICKSTART.md
  - [ ] IMPLEMENTATION_SUMMARY.md
  - [ ] This checklist
- [ ] Default passwords have been changed
- [ ] Backup of admin credentials is secure
- [ ] Team members have been notified of new system

## 🚀 Production Readiness

- [ ] Environment variables are set for production
- [ ] ADMIN_REGISTRATION_SECRET is strong and unique
- [ ] JWT_SECRET is strong and unique
- [ ] RLS policies are enabled
- [ ] Database backups are configured
- [ ] Monitoring is set up
- [ ] Error logging is configured
- [ ] Rate limiting is considered (if needed)
- [ ] CORS settings are properly configured
- [ ] HTTPS is enabled in production

## 📝 Documentation Review

- [ ] Read ADMIN_SETUP_README.md
- [ ] Read QUICKSTART.md
- [ ] Read IMPLEMENTATION_SUMMARY.md
- [ ] Understand MVC structure
- [ ] Know how to create admins
- [ ] Know how to manage permissions
- [ ] Know where to find API documentation

## ✅ Completion

When all items are checked:
- [ ] System is fully operational
- [ ] Documentation is complete
- [ ] Team is trained
- [ ] Credentials are secured
- [ ] Ready for production use

---

**Setup Date:** __________________
**Completed By:** __________________
**Notes:** 
_______________________________________
_______________________________________
_______________________________________

**Status:** 
- [ ] ✅ Complete
- [ ] ⚠️ Partial (note issues above)
- [ ] ❌ Issues found (document below)

**Issues to Resolve:**
_______________________________________
_______________________________________
_______________________________________
