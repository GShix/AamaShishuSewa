# 🔔 Notification & ⭐ Review System - API Documentation

## Overview

This document describes the newly implemented Notification and Review/Rating systems for Aama Shishu Sewa platform.

---

## 📊 Database Schema

### **Reviews Table**
```sql
reviews (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  booking_id UUID REFERENCES bookings(id),
  service_id UUID REFERENCES services(id),
  employee_id UUID REFERENCES employees(id),
  rating DECIMAL(2,1) CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  images TEXT[],
  is_verified BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  status VARCHAR(20) DEFAULT 'pending',
  response_text TEXT,
  response_by UUID REFERENCES admins(id),
  response_at TIMESTAMP,
  helpful_count INTEGER DEFAULT 0,
  unhelpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
)
```

### **Notifications Table**
```sql
notifications (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  admin_id UUID REFERENCES admins(id),
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  data JSONB,
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP,
  sent_email BOOLEAN DEFAULT FALSE,
  sent_sms BOOLEAN DEFAULT FALSE,
  sent_push BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP
)
```

---

## 🔔 NOTIFICATION SYSTEM

### **Notification Types**
- `booking_created` - When user creates a booking
- `booking_confirmed` - When admin confirms booking
- `booking_status_changed` - When booking status updates
- `employee_assigned` - When employee is assigned to booking
- `payment_received` - When payment is successful
- `service_reminder` - 1 day before service date
- `review_requested` - After service completion

### **Notification Channels**
1. **Email** - Detailed HTML emails
2. **SMS** - Brief Nepali/English messages via Sparrow SMS
3. **In-App** - Real-time dashboard notifications

---

## 📡 API ENDPOINTS

### **User Notification Endpoints**

#### **1. Get My Notifications**
```http
GET /api/notifications
Authorization: Bearer {user_token}
Query Parameters:
  - page: number (default: 1)
  - limit: number (default: 20)
  - is_read: boolean (filter by read status)
```

**Response:**
```json
{
  "notifications": [
    {
      "id": "uuid",
      "type": "booking_confirmed",
      "title": "बुकिङ पुष्टि भयो",
      "message": "तपाईंको बुकिङ पुष्टि भयो...",
      "data": {
        "booking_id": "uuid",
        "employee_id": "uuid"
      },
      "is_read": false,
      "created_at": "2026-01-23T10:00:00Z"
    }
  ],
  "unreadCount": 5,
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "totalPages": 3
  }
}
```

#### **2. Get Unread Count**
```http
GET /api/notifications/unread-count
Authorization: Bearer {user_token}
```

**Response:**
```json
{
  "unreadCount": 5
}
```

#### **3. Mark as Read**
```http
PATCH /api/notifications/:notificationId/read
Authorization: Bearer {user_token}
```

**Response:**
```json
{
  "message": "Notification marked as read",
  "notification": {...}
}
```

#### **4. Mark All as Read**
```http
PATCH /api/notifications/mark-all-read
Authorization: Bearer {user_token}
```

#### **5. Delete Notification**
```http
DELETE /api/notifications/:notificationId
Authorization: Bearer {user_token}
```

---

### **Review Endpoints**

#### **User Review Endpoints**

#### **1. Create Review**
```http
POST /api/reviews
Authorization: Bearer {user_token}
Content-Type: application/json

{
  "booking_id": "uuid",
  "rating": 4.5,
  "review_text": "Excellent service! Very professional and caring.",
  "images": ["https://example.com/photo1.jpg", "https://example.com/photo2.jpg"]
}
```

**Response:**
```json
{
  "message": "Review submitted successfully",
  "review": {
    "id": "uuid",
    "user_id": "uuid",
    "booking_id": "uuid",
    "service_id": "uuid",
    "employee_id": "uuid",
    "rating": 4.5,
    "review_text": "Excellent service!...",
    "is_verified": true,
    "status": "pending",
    "created_at": "2026-01-23T10:00:00Z"
  }
}
```

#### **2. Get All Reviews (Public)**
```http
GET /api/reviews
Query Parameters:
  - service_id: uuid (filter by service)
  - employee_id: uuid (filter by employee)
  - rating: number (filter by rating)
  - page: number
  - limit: number
```

**Response:**
```json
{
  "reviews": [
    {
      "id": "uuid",
      "rating": 5.0,
      "review_text": "Amazing service!",
      "users": {
        "full_name": "John Doe",
        "profile_image": "url"
      },
      "services": {
        "name": "Postpartum Care"
      },
      "employees": {
        "full_name": "Jane Smith"
      },
      "created_at": "2026-01-20T10:00:00Z"
    }
  ],
  "pagination": {...}
}
```

#### **3. Get My Reviews**
```http
GET /api/reviews/my-reviews
Authorization: Bearer {user_token}
```

#### **4. Update Review**
```http
PUT /api/reviews/:reviewId
Authorization: Bearer {user_token}
Content-Type: application/json

{
  "rating": 5.0,
  "review_text": "Updated review text"
}
```

#### **5. Delete Review**
```http
DELETE /api/reviews/:reviewId
Authorization: Bearer {user_token}
```

#### **6. Check if Can Review Booking**
```http
GET /api/reviews/can-review/:bookingId
Authorization: Bearer {user_token}
```

**Response:**
```json
{
  "canReview": true
}
```
OR
```json
{
  "canReview": false,
  "reason": "Booking not completed yet"
}
```

---

#### **Admin Review Endpoints**

#### **1. Get All Reviews (Admin)**
```http
GET /api/admin/reviews
Authorization: Bearer {admin_token}
Query Parameters:
  - service_id: uuid
  - employee_id: uuid
  - status: string (pending, approved, rejected, hidden)
  - rating: number
  - page: number
  - limit: number
```

#### **2. Update Review Status**
```http
PATCH /api/admin/reviews/:reviewId/status
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "status": "approved"  // or "rejected", "hidden", "pending"
}
```

#### **3. Respond to Review**
```http
POST /api/admin/reviews/:reviewId/respond
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "response_text": "Thank you for your feedback! We're glad you enjoyed our service."
}
```

#### **4. Feature/Unfeature Review**
```http
PATCH /api/admin/reviews/:reviewId/featured
Authorization: Bearer {admin_token}
```

#### **5. Delete Review (Admin)**
```http
DELETE /api/admin/reviews/:reviewId
Authorization: Bearer {admin_token}
```

#### **6. Get Review Statistics**
```http
GET /api/admin/reviews/stats
Authorization: Bearer {admin_token}
```

**Response:**
```json
{
  "stats": {
    "totalReviews": 150,
    "pendingReviews": 12,
    "approvedReviews": 135,
    "avgRating": 4.6,
    "ratingDistribution": {
      "1": 2,
      "2": 5,
      "3": 18,
      "4": 45,
      "5": 80
    }
  }
}
```

---

## 🔔 Notification Service Functions

### **Backend Usage**

```javascript
import {
  notifyBookingCreated,
  notifyBookingConfirmed,
  notifyBookingStatusChange,
  createNotification,
  sendEmail,
  sendSMS
} from '../services/enhancedNotificationService.js';

// Example: Send booking created notification
await notifyBookingCreated(booking, user, service);

// Example: Send booking confirmed notification
await notifyBookingConfirmed(booking, user, employee);

// Example: Send status change notification
await notifyBookingStatusChange(booking, user, 'pending', 'confirmed');

// Example: Create custom notification
await createNotification({
  userId: 'user-uuid',
  type: 'custom_notification',
  title: 'Custom Title',
  message: 'Custom message',
  data: { custom_key: 'value' },
  sendEmail: true,
  sendSMS: false
});

// Example: Send custom email
await sendEmail(
  'user@example.com',
  'Email Subject',
  '<h1>HTML Content</h1>'
);

// Example: Send custom SMS
await sendSMS(
  '9876543210',
  'SMS message in Nepali or English'
);
```

---

## 📧 Email Templates

### **1. Booking Created Email**
- **Subject:** ✅ बुकिङ प्राप्त भयो - Booking Received
- **Content:** Booking details, next steps, contact info
- **Trigger:** When user creates a booking

### **2. Booking Confirmed Email**
- **Subject:** 🎉 बुकिङ पुष्टि भयो - Booking Confirmed
- **Content:** Employee details, preparation instructions
- **Trigger:** When admin confirms booking and assigns employee

### **3. Status Update Email**
- **Subject:** 📋 बुकिङ अपडेट - Booking Update
- **Content:** Old status → New status, next actions
- **Trigger:** When booking status changes

---

## 📱 SMS Templates

### **Booking Created SMS**
```
आमा शिशु सेवा: तपाईंको {service_name} बुकिङ प्राप्त भयो। मिति: {date}। हामी चाँडै पुष्टि गर्नेछौं। धन्यवाद!
```

### **Booking Confirmed SMS**
```
आमा शिशु सेवा: तपाईंको बुकिङ पुष्टि भयो! पेशेवर: {employee_name} ({phone})। मिति: {date}
```

### **Status Change SMS**
```
आमा शिशु सेवा: तपाईंको बुकिङ स्थिति {status_nepali} भयो। विवरणको लागि ड्यासबोर्ड हेर्नुहोस्।
```

---

## 🔧 Environment Variables

Add these to your `.env` file:

```bash
# Email Configuration
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# SMS Configuration (Sparrow SMS - Nepal)
SPARROW_SMS_TOKEN=your-sparrow-token
SPARROW_SMS_FROM=AamaSisu

# Client URL
CLIENT_URL=http://localhost:5173
```

---

## 🎯 Implementation Checklist

### Backend ✅
- [x] Create reviews table migration
- [x] Create notifications table migration
- [x] Implement review controller (user)
- [x] Implement review controller (admin)
- [x] Implement notification controller
- [x] Enhanced notification service with email/SMS
- [x] Create review routes (user & admin)
- [x] Create notification routes
- [x] Integrate notifications into booking workflow
- [x] Register routes in server.js

### Frontend 🔄
- [ ] Review submission form in user dashboard
- [ ] Display reviews on service pages
- [ ] Review management in admin dashboard
- [ ] Notification bell icon in header
- [ ] Notification dropdown/panel
- [ ] Mark as read functionality
- [ ] Review approval/rejection UI for admin
- [ ] Review statistics dashboard

### Testing 🔄
- [ ] Test review creation
- [ ] Test review approval flow
- [ ] Test email notifications
- [ ] Test SMS notifications
- [ ] Test in-app notifications
- [ ] Test notification marking as read
- [ ] Test review filtering and pagination

---

## 📝 Usage Examples

### **For Users:**

1. **Submit a Review:**
   - Complete a booking
   - Go to dashboard → Bookings tab
   - Click "Write Review" on completed booking
   - Rate service (1-5 stars)
   - Write review text (optional)
   - Upload photos (optional)
   - Submit

2. **View Notifications:**
   - Click bell icon in header
   - See unread count badge
   - Click to open notification panel
   - Mark individual notifications as read
   - Or mark all as read

### **For Admins:**

1. **Manage Reviews:**
   - Go to Admin Dashboard → Reviews
   - See pending reviews
   - Click "Approve" or "Reject"
   - Add response to review
   - Feature best reviews

2. **Monitor Notifications:**
   - Automatic notifications sent when:
     * User creates booking
     * Admin confirms booking
     * Booking status changes
     * Payment received

---

## 🚀 Next Steps

1. **Run Migration:**
   ```sql
   -- Run in Supabase SQL Editor
   -- File: server/scripts/migrations/008_create_reviews_notifications_tables.sql
   ```

2. **Test Notifications:**
   - Create a test booking
   - Check email inbox
   - Check SMS if configured
   - Check notifications table in Supabase

3. **Test Reviews:**
   - Complete a test booking
   - Submit a review
   - Approve review as admin
   - View review on service page

4. **Configure Services:**
   - Set up Gmail app password for emails
   - Get Sparrow SMS API token for SMS
   - Update environment variables

---

## 📞 Support

For questions or issues:
- **Email:** support@aamashishusewa.com
- **Phone:** 9764651355

---

**Last Updated:** January 23, 2026
**Version:** 1.0.0
