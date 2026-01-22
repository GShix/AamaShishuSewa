# 🚀 Quick Start Guide - Admin System

## Prerequisites
- ✅ Node.js installed
- ✅ Supabase project created
- ✅ Environment variables configured

## Step-by-Step Setup (5 minutes)

### 1️⃣ Run Database Migration

Open your Supabase SQL Editor and execute:

```bash
# Copy the contents of:
scripts/migrations/001_create_admins_table.sql
```

Paste and run in Supabase SQL Editor.

### 2️⃣ Insert Initial Admins

From your terminal:

```bash
cd server
node scripts/insertAdmins.js
```

You should see:
```
✅ Successfully created: Dambar Gharti
✅ Successfully created: Dilip Bhattarai
```

### 3️⃣ Test Login

```bash
curl -X POST http://localhost:6000/api/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "dambarsinggharti@gmail.com",
    "password": "SuperAdmin@123456"
  }'
```

### 4️⃣ Copy Your Token

From the response, copy the `token` value.

### 5️⃣ Test SuperAdmin Access

```bash
curl -X GET http://localhost:6000/api/admin/admins \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 🎉 Success!

You should now see a list of admins. Your admin system is ready!

## 📚 Next Steps

1. **Change default passwords** - Important for security!
2. **Create additional admins** - Use the SuperAdmin account
3. **Review API documentation** - See ADMIN_SETUP_README.md
4. **Configure RLS policies** - Customize access as needed

## Default Login Credentials

```
👑 SuperAdmin
Email: dambarsinggharti@gmail.com
Password: SuperAdmin@123456

👤 Admin
Email: aamasisiusewa@gmail.com  
Password: Admin@123456
```

⚠️ **CHANGE THESE PASSWORDS IMMEDIATELY!**

## Common Issues

**Issue:** "Table admins does not exist"
**Fix:** Run the migration SQL in Supabase

**Issue:** "Admin already exists"
**Fix:** Admins are already created, you can login directly

**Issue:** "Invalid token"
**Fix:** Make sure to include "Bearer " before your token

## Need Help?

Check the full documentation: [ADMIN_SETUP_README.md](./ADMIN_SETUP_README.md)
