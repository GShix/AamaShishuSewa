# Admin Login Credentials

## Successfully Created Admin Accounts

### Admin 1 - Dilip Bhattarai
- **Name:** Dilip Bhattarai
- **Email:** aamasisiusewa@gmail.com
- **Phone:** 9764651355
- **Role:** admin
- **Password:** Admin@123456
- **Status:** ✅ Active

### Admin 2 - Dambar Gharti  
- **Name:** Dambar Gharti
- **Email:** dambarsinggharti@gmail.com
- **Phone:** 9749778495
- **Role:** admin
- **Password:** SuperAdmin@123456
- **Status:** ✅ Active

---

## Login Instructions

1. Navigate to the admin login page:
   ```
   http://localhost:5173/admin/login
   ```

2. Use the credentials above to log in

3. **⚠️ IMPORTANT SECURITY NOTE:**
   - **Change these default passwords immediately after first login!**
   - Go to Admin Dashboard → Account Settings → Change Password
   - Use strong passwords with:
     - At least 8 characters
     - Mix of uppercase and lowercase letters
     - Numbers
     - Special characters

---

## Admin Dashboard Features

Both admins have full access to:
- ✅ User Management (view, edit, delete users)
- ✅ Booking Management (view, update booking status)
- ✅ Professional Management (add, edit, delete employees)
- ✅ Services Management (add, edit, delete services)
- ✅ Notices Management (create, edit, delete announcements)
- ✅ Dashboard Statistics (overview of system metrics)
- ✅ Account Settings (update profile, change password)

---

## Database Note

**Role Configuration:**
- The database schema currently only supports 'admin' and 'client' roles
- Both users are assigned the 'admin' role
- If you need to add 'superAdmin' role support:
  1. Update the database CHECK constraint on users.role column
  2. Add 'superAdmin' to the allowed values
  3. Update users via SQL: `UPDATE users SET role = 'superAdmin' WHERE email = 'dambarsinggharti@gmail.com'`

---

## Next Steps

1. ✅ Start the server: `cd server && npm run dev`
2. ✅ Start the client: `cd client && npm run dev`
3. ✅ Login at: http://localhost:5173/admin/login
4. ⚠️  Change default passwords
5. ✅ Begin managing the system

---

*Generated on: 2026-01-21*
*Script used: server/scripts/insertAdmins.js*
