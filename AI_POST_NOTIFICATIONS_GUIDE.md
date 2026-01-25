# 📢 AI-Powered Post Notifications - Implementation Guide

## 🎯 Feature Overview

When an admin creates or publishes a post in the **Admin Dashboard**, the system automatically:
1. ✅ Generates an AI-powered notification message in both **Nepali** and **English**
2. ✅ Sends notifications to **all active users**
3. ✅ Users can view notifications in their **User Dashboard**
4. ✅ Notifications are personalized based on post category and content

---

## 🚀 How It Works

### **Admin Creates a Post**

1. Admin logs into **Admin Dashboard**
2. Clicks **"Post Notice"** → **"Create New Post"**
3. Fills in post details:
   - **Title** (required)
   - **Content** (required)
   - **Excerpt** (optional)
   - **Category**: news, health, tips, announcement, update
   - **Priority**: normal, high, urgent
   - **Published**: true/false

4. When admin clicks **"Create Post"**:
   - Post is saved to database
   - **IF post.published = true:**
     - AI generates notification content
     - Notifications sent to all users
     - Users see notification in their dashboard

---

## 🤖 AI Notification Generation

### **With OpenAI API Key**

The system uses **GPT-4** to create engaging, culturally appropriate notifications:

**Nepali Example:**
```
Title: 📢 नयाँ स्वास्थ्य सुझाव
Message: आमा शिशु सेवामा सुत्केरी आमाको स्वास्थ्य सम्बन्धी महत्वपूर्ण जानकारी प्रकाशित भएको छ। कृपया पढ्नुहोस्।
```

**English Example:**
```
Title: 📢 New Health Tips
Message: Important health information for postpartum mothers has been published on Aama Shishu Sewa. Please read.
```

### **Without OpenAI API Key (Template Mode)**

If OpenAI is not configured, the system uses **predefined templates** by category:

| Category | Nepali Title | English Title |
|----------|--------------|---------------|
| news | 📢 नयाँ समाचार | 📢 New Update |
| health | 💚 स्वास्थ्य सुझाव | 💚 Health Tips |
| tips | 💡 उपयोगी सुझाव | 💡 Useful Tips |
| announcement | 📣 महत्वपूर्ण घोषणा | 📣 Important Announcement |
| update | 🔔 नयाँ अपडेट | 🔔 New Update |

---

## 👥 User Experience

### **Notification Bell Icon**

Users see the notification bell in their dashboard header:

```
🔔 [3]  ← Bell icon with unread count badge
```

### **Notification Dropdown**

When clicked, shows:
- ✅ Recent notifications (up to 10)
- ✅ Mark as read button
- ✅ Delete button
- ✅ "View All" link

### **Notification Display**

```
┌──────────────────────────────────┐
│ 📢 नयाँ स्वास्थ्य सुझाव         │
│ आमा शिशु सेवामा महत्वपूर्ण...    │
│ 2 मिनेट अघि                     │
└──────────────────────────────────┘
```

### **Bilingual Support**

Each notification contains **both** Nepali and English:
- **Displayed**: Nepali (default)
- **Stored**: Both languages in `data` field
- **User can**: Switch language in settings

---

## 🛠️ Technical Implementation

### **Backend Files**

#### **1. Post Notification Service**
`server/src/services/postNotificationService.js`

**Key Functions:**
```javascript
// Generate AI notification
generatePostNotification(post, language)

// Notify all active users
notifyAllUsersAboutPost(post)

// Notify specific users (by role or IDs)
notifySpecificUsers(post, { userIds, role })
```

#### **2. Post Controller (Modified)**
`server/src/controllers/admin/postController.js`

**Changes:**
- Imports `notifyAllUsersAboutPost`
- Automatically calls it when post is published
- Handles errors gracefully (doesn't fail post creation if notifications fail)

**Create Post:**
```javascript
if (post.published) {
  const result = await notifyAllUsersAboutPost(post);
  console.log(`✅ Sent ${result.count} notifications`);
}
```

**Update Post:**
```javascript
if (wasPublished) {
  // Send notifications only if just published
  await notifyAllUsersAboutPost(post);
}
```

### **Frontend Files**

#### **1. Notification Bell Component**
`client/src/components/common/NotificationBell.jsx`

**Features:**
- Bell icon with unread count badge
- Dropdown notification panel
- Mark as read / Delete actions
- Auto-refresh every 30 seconds
- Responsive design

#### **2. User Dashboard (Modified)**
`client/src/pages/user/Dashboard.jsx`

**Changes:**
- Imports `NotificationBell` component
- Replaces static bell icon with dynamic component

---

## 📊 Database Schema

### **notifications Table**

```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,  -- 'new_post', 'booking_created', etc.
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  data JSONB,  -- { post_id, english_title, english_message, etc. }
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);
```

### **Notification Data Structure**

```json
{
  "user_id": "uuid",
  "type": "new_post",
  "title": "📢 नयाँ स्वास्थ्य सुझाव",
  "message": "आमा शिशु सेवामा स्वास्थ्य सम्बन्धी जानकारी...",
  "data": {
    "post_id": "uuid",
    "post_title": "Postpartum Care Tips",
    "post_category": "health",
    "english_title": "📢 New Health Tips",
    "english_message": "Important health information..."
  },
  "is_read": false,
  "created_at": "2026-01-25T10:30:00Z"
}
```

---

## 🔧 Configuration

### **Environment Variables**

#### **Required:**
```env
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
JWT_SECRET=your_jwt_secret
```

#### **Optional (for AI):**
```env
OPENAI_API_KEY=sk-proj-...
```

**Note**: If `OPENAI_API_KEY` is not set, the system automatically falls back to template notifications.

---

## 📝 Usage Examples

### **Admin Creates Urgent Health Tip**

```javascript
POST /api/admin/posts
{
  "title": "COVID-19 Precautions for New Mothers",
  "content": "सुत्केरी आमाहरूले कोभिड-१९ बाट बच्न यी सावधानीहरू पालना गर्नुहोस्...",
  "excerpt": "Essential COVID-19 safety measures",
  "category": "health",
  "priority": "urgent",
  "published": true
}
```

**Result:**
- ✅ Post created
- ✅ 150 notifications sent to users
- ✅ Each notification has AI-generated content
- ✅ Users see notification bell with badge

### **Admin Publishes Draft Post**

```javascript
PATCH /api/admin/posts/:id
{
  "published": true
}
```

**Result:**
- ✅ Post published
- ✅ Notifications sent to all users
- ✅ Users notified about new content

---

## 🎨 Notification Types by Category

### **News (समाचार)**
- 📢 Emoji
- General announcements
- Service updates

### **Health (स्वास्थ्य)**
- 💚 Emoji
- Health tips
- Medical advice
- Safety guidelines

### **Tips (सुझाव)**
- 💡 Emoji
- Helpful suggestions
- Best practices
- How-to guides

### **Announcement (घोषणा)**
- 📣 Emoji
- Important notices
- Policy changes
- Service interruptions

### **Update (अपडेट)**
- 🔔 Emoji
- Feature updates
- System changes
- New services

---

## 🧪 Testing

### **1. Test AI Notification Generation**

```bash
# Create a test post
curl -X POST http://localhost:8000/api/admin/posts \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Post",
    "content": "This is a test",
    "category": "news",
    "published": true
  }'
```

### **2. Check User Notifications**

```bash
# Get notifications
curl -X GET http://localhost:8000/api/notifications \
  -H "Authorization: Bearer YOUR_USER_TOKEN"
```

### **3. Verify Database**

```sql
SELECT 
  n.title, 
  n.message, 
  n.type, 
  u.full_name as user_name,
  n.created_at
FROM notifications n
JOIN users u ON n.user_id = u.id
WHERE n.type = 'new_post'
ORDER BY n.created_at DESC
LIMIT 10;
```

---

## 🐛 Troubleshooting

### **No Notifications Sent**

**Check:**
1. Is post `published = true`?
2. Are there active users in database?
   ```sql
   SELECT COUNT(*) FROM users WHERE status = 'active' AND role = 'user';
   ```
3. Check server logs for errors

### **AI Not Working**

**Check:**
1. Is `OPENAI_API_KEY` set in environment?
2. Check server logs:
   ```
   ⚠️ OpenAI not configured, using template
   ```
3. Verify API key is valid

### **Users Not Seeing Notifications**

**Check:**
1. Is user logged in?
2. Check browser console for errors
3. Verify notification bell component is rendered
4. Check API response:
   ```javascript
   GET /api/notifications
   GET /api/notifications/unread-count
   ```

---

## 📈 Performance Considerations

### **Batch Notifications**

- ✅ All notifications inserted in **single query**
- ✅ No loops or individual inserts
- ✅ Efficient for large user base

```javascript
// Efficient batch insert
const notifications = users.map(user => ({...}));
await supabaseAdmin.from('notifications').insert(notifications);
```

### **Auto-Refresh**

- Bell icon polls every **30 seconds**
- Only fetches **unread count** (lightweight)
- Full notifications loaded **on demand** (when clicked)

---

## 🔒 Security

### **Access Control**

- ✅ Only admins can create posts
- ✅ Users can only see **their own** notifications
- ✅ JWT authentication required
- ✅ Row-level security in Supabase

### **Data Validation**

- ✅ Input sanitization
- ✅ XSS protection
- ✅ SQL injection prevention (using Supabase client)

---

## 🎉 Success Metrics

After implementing this feature:

✅ **User Engagement**: Users stay informed about new content  
✅ **Retention**: Regular notifications keep users coming back  
✅ **Awareness**: Important announcements reach all users  
✅ **Automation**: No manual notification sending required  
✅ **Multilingual**: Both Nepali and English speakers supported  
✅ **AI-Powered**: Engaging, culturally appropriate messages  

---

## 📞 Support

For issues or questions:
- Check server logs: `/var/log/aamashishusewa/`
- Review database: Supabase Dashboard
- Contact: support@aamashishusewa.com.np

---

**Happy Notifying! 🎉**
