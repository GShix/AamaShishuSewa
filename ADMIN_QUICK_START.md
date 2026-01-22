# Quick Start Guide - Admin Dashboard

## 🚀 Get Started in 3 Steps

### Step 1: Ensure Server is Running
```bash
cd server
npm run dev
```
Server should be running on `http://localhost:6000`

### Step 2: Ensure Client is Running
```bash
cd client
npm run dev
```
Client should be running on `http://localhost:5173`

### Step 3: Access Admin Dashboard

#### **Login as Admin**
1. Navigate to: http://localhost:5173/admin/login
2. Use your admin credentials (created earlier)
3. You'll be redirected to the dashboard

#### **Or Register New Admin** (if first time)
1. Navigate to: http://localhost:5173/admin/register
2. Use secret key: `admin-secret-key-2026`
3. Create your admin account

---

## 📋 Dashboard Features Overview

### **Dashboard Tab**
- View real-time statistics
- See recent bookings
- Quick access buttons

### **Users Tab**
- View all users (pagination)
- Search by name, email, phone
- Filter by role (client, professional, admin)
- Filter by status (active, inactive, suspended)
- Update user status
- Delete users

### **Appointments Tab**
- View all bookings
- Filter by status (pending, confirmed, in progress, completed, cancelled)
- Search bookings
- Update booking status
- View client & professional details

### **Employees Tab**
- View all professionals
- Create new employees:
  - Name, email, phone
  - Specialization
  - Experience & qualifications
  - License number
  - Hourly rate
- Edit existing employees
- Delete employees

### **Services Tab**
- View all services
- Create new services:
  - Name & description
  - Category
  - Price & duration
  - Features
- Edit services
- Delete services

### **Notices Tab**
- View all notices
- Create announcements:
  - Title & content
  - Type (general, announcement, alert, update)
  - Priority (low, medium, high)
  - Target audience (all, clients, professionals)
- Edit notices
- Delete notices

### **Account Settings Tab**
- Update profile (name, email, phone)
- Change password
- View role & status

---

## 🎯 Common Tasks

### **Add a New Employee**
1. Click "Employees" in sidebar
2. Click "Add Employee" button
3. Fill in the form:
   - Full Name (required)
   - Email (required)
   - Phone (required, 10 digits)
   - Specialization (required)
   - Experience, Qualification, License Number
   - Hourly Rate
   - Address & Bio
4. Click "Create"

### **Manage Bookings**
1. Click "Appointments" in sidebar
2. Use filters to find specific bookings
3. Click status dropdown to update
4. Confirm changes

### **Post an Announcement**
1. Click "Notices" in sidebar
2. Click "Add Notice" button
3. Fill in:
   - Title (required)
   - Content (required)
   - Type, Priority, Target Audience
4. Click "Create"

### **Create a Service**
1. Click "Services" in sidebar
2. Click "Add Service" button
3. Fill in:
   - Name (required)
   - Category (required)
   - Description
   - Price & Duration
   - Features (comma-separated)
4. Click "Create"

---

## 💡 Tips

### **Search Features**
- All search fields update in real-time
- Search is case-insensitive
- Can search by multiple fields

### **Pagination**
- Shows 10 items per page by default
- Use Previous/Next buttons
- Total count displayed

### **Status Updates**
- Most status changes are instant
- Confirmation alerts will appear
- Page auto-refreshes after changes

### **Keyboard Shortcuts**
- `Esc` - Close modals
- `Enter` - Submit forms

---

## 🔧 Troubleshooting

### **Can't Login**
- Check credentials are correct
- Ensure you're using admin credentials (not regular user)
- Clear browser cache and try again

### **Dashboard Not Loading**
- Check server is running (port 6000)
- Check client is running (port 5173)
- Open browser console for errors

### **Changes Not Saving**
- Check all required fields are filled
- Verify you have admin permissions
- Check browser network tab for failed requests

### **Stats Showing Zero**
- Database might be empty
- Create some test data
- Refresh the page

---

## 📞 Database Setup

Make sure your Supabase database has these tables:
- `users` - For all users
- `bookings` - For appointments
- `professionals` - For employees
- `services` - For service offerings
- `notices` - For announcements

---

## 🎨 Interface Tips

### **Sidebar**
- Click hamburger icon to collapse/expand
- Active tab highlighted in white
- Hover for smooth transitions

### **Forms**
- Red border = required field
- * = required field
- Validation on submit

### **Tables**
- Click column headers to sort (if implemented)
- Hover rows for highlighting
- Action buttons on right

---

## ✅ First Time Setup Checklist

1. [ ] Server running on port 6000
2. [ ] Client running on port 5173
3. [ ] Admin account created
4. [ ] Successfully logged in
5. [ ] Dashboard displays stats
6. [ ] Created first employee
7. [ ] Created first service
8. [ ] Posted first notice
9. [ ] Tested user management
10. [ ] Tested booking management

---

## 🎉 You're Ready!

Your admin dashboard is fully set up and ready to manage आमा शिशु सेवा!

**Dashboard URL**: http://localhost:5173/admin/dashboard

For detailed documentation, see: [ADMIN_DASHBOARD_GUIDE.md](./ADMIN_DASHBOARD_GUIDE.md)

---

**Happy Managing! 🚀**
