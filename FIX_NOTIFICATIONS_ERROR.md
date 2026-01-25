# 🔧 Fix Notifications Table Error

## Error
```
column notifications.user_id does not exist
```

## Cause
The `notifications` table doesn't exist in your Supabase database yet.

---

## 🚀 Quick Fix (2 minutes)

### **Option 1: Supabase SQL Editor (Recommended)**

1. **Open Supabase SQL Editor:**
   - Go to: https://supabase.com/dashboard
   - Select your project
   - Click **"SQL Editor"** in the left sidebar

2. **Copy the SQL:**
   - Open file: `server/scripts/migrations/002_create_notifications_table.sql`
   - Copy ALL the content (Ctrl+A, Ctrl+C)

3. **Paste and Run:**
   - Paste in SQL Editor
   - Click **"Run"** button
   - Wait for success message

4. **Verify:**
   ```sql
   SELECT * FROM notifications LIMIT 5;
   ```
   Should return empty result (no error)

---

### **Option 2: Run Migration Script**

```bash
cd server
node scripts/createNotificationsTable.js
```

**Note:** This will show you instructions to run the SQL manually.

---

## ✅ After Running Migration

Restart your development server:

```bash
# Terminal 1 - Backend
cd server
npm start

# Terminal 2 - Frontend
cd client
npm run dev
```

Then test:
1. Go to http://localhost:5173/dashboard
2. Look for notification bell 🔔 in header
3. Should show no errors

---

## 📋 What the Migration Does

Creates:
- ✅ `notifications` table with proper columns
- ✅ Indexes for performance
- ✅ Row-Level Security (RLS) policies
- ✅ Triggers for auto-timestamps

---

## 🐛 Troubleshooting

### Still getting errors?

**Check 1: Table exists**
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_name = 'notifications';
```

**Check 2: Columns are correct**
```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'notifications';
```

**Expected columns:**
- `id` (uuid)
- `user_id` (uuid)
- `type` (varchar)
- `title` (varchar)
- `message` (text)
- `data` (jsonb)
- `is_read` (boolean)
- `read_at` (timestamp)
- `created_at` (timestamp)
- `updated_at` (timestamp)

---

## 🔒 Security Note

The migration automatically sets up Row-Level Security (RLS) so:
- ✅ Users can only see their own notifications
- ✅ Users can mark their own notifications as read
- ✅ Users can delete their own notifications
- ✅ Only admins/system can create notifications

---

## Need Help?

If you still have issues:
1. Check Supabase logs in dashboard
2. Verify environment variables are set
3. Ensure you're using the correct Supabase project
