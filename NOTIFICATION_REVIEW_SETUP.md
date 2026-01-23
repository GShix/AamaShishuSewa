# 🚀 Quick Setup Guide - Notifications & Reviews

## Step 1: Run Database Migration

1. Open Supabase Dashboard (https://supabase.com)
2. Go to **SQL Editor**
3. Click **New query**
4. Copy the entire contents of `server/scripts/migrations/008_create_reviews_notifications_tables.sql`
5. Paste and click **Run** (or Ctrl/Cmd + Enter)
6. Verify tables created: `reviews` and `notifications`

## Step 2: Configure Environment Variables

Add to your `.env` file in the `server` directory:

```bash
# Email Configuration (For Gmail)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-gmail-app-password  # Get from Google Account settings

# SMS Configuration (Sparrow SMS - Nepal)
SPARROW_SMS_TOKEN=your-sparrow-api-token
SPARROW_SMS_FROM=AamaSisu

# Client URL
CLIENT_URL=http://localhost:5173
```

### Getting Gmail App Password:
1. Go to Google Account → Security
2. Enable 2-Step Verification
3. Search for "App passwords"
4. Generate new app password for "Mail"
5. Copy the 16-character password
6. Use it as `EMAIL_PASSWORD`

### Getting Sparrow SMS Token:
1. Visit https://sparrowsms.com
2. Create account
3. Go to API Settings
4. Copy your API Token
5. Use it as `SPARROW_SMS_TOKEN`

## Step 3: Restart Server

```powershell
cd server
npm run dev
```

Check terminal output for:
```
✅ Email service configured
✅ SMS service configured (or warning if not configured)
🚀 Server running on port 6000
```

## Step 4: Test Notifications

### Test Booking Notification:

1. Create a test booking from user dashboard
2. Check:
   - Email inbox for booking confirmation
   - SMS (if configured)
   - Supabase → `notifications` table for in-app notification

### Expected Email:
- **Subject:** ✅ बुकिङ प्राप्त भयो - Booking Received
- **Content:** Booking details, service info, next steps

### Expected SMS:
```
आमा शिशु सेवा: तपाईंको {service} बुकिङ प्राप्त भयो। मिति: {date}। हामी चाँडै पुष्टि गर्नेछौं। धन्यवाद!
```

## Step 5: Test Reviews

### Prerequisites:
- Must have a completed booking (status = 'completed')

### Test Flow:

1. **Complete a Booking:**
   - Go to Admin Dashboard → Bookings
   - Find a booking and update status to "completed"

2. **Submit Review:**
   ```http
   POST http://localhost:5173/api/reviews
   Authorization: Bearer {user_token}
   
   {
     "booking_id": "uuid-of-completed-booking",
     "rating": 4.5,
     "review_text": "Excellent service! Very professional."
   }
   ```

3. **Verify in Supabase:**
   - Check `reviews` table
   - Status should be "pending"

4. **Approve as Admin:**
   ```http
   PATCH http://localhost:5173/api/admin/reviews/{review_id}/status
   Authorization: Bearer {admin_token}
   
   {
     "status": "approved"
   }
   ```

5. **View Public Reviews:**
   ```http
   GET http://localhost:5173/api/reviews?service_id={service_id}
   ```

## Step 6: Frontend Integration (Next Phase)

The backend is ready. Now you can:

1. **Add Notification Bell:**
   - Show unread count badge
   - Dropdown with recent notifications
   - Mark as read functionality

2. **Add Review Form:**
   - Show on completed bookings
   - Star rating component
   - Text input for review
   - Photo upload (optional)

3. **Display Reviews:**
   - On service detail pages
   - With star ratings
   - User names and dates
   - Admin responses

## Testing Checklist

- [ ] Database migration ran successfully
- [ ] Email notifications working
- [ ] SMS notifications working (optional)
- [ ] In-app notifications created in database
- [ ] Can create review for completed booking
- [ ] Cannot review incomplete booking
- [ ] Cannot review same booking twice
- [ ] Admin can approve/reject reviews
- [ ] Admin can respond to reviews
- [ ] Public API shows only approved reviews
- [ ] Average ratings update correctly

## API Testing with Postman/Thunder Client

### Import Collection:
Use the endpoints from `NOTIFICATION_REVIEW_API_DOCS.md`

### Key Endpoints to Test:

**User:**
- POST `/api/reviews` - Create review
- GET `/api/reviews/my-reviews` - Get my reviews
- GET `/api/notifications` - Get notifications
- PATCH `/api/notifications/:id/read` - Mark as read

**Admin:**
- GET `/api/admin/reviews` - Get all reviews
- PATCH `/api/admin/reviews/:id/status` - Approve/Reject
- GET `/api/admin/reviews/stats` - Get statistics
- POST `/api/admin/reviews/:id/respond` - Add response

## Troubleshooting

### Email not sending?
- Check `EMAIL_USER` and `EMAIL_PASSWORD` in `.env`
- Verify Gmail app password is correct
- Check terminal logs for error messages
- Test with console.log output (notifications still saved to DB)

### SMS not sending?
- Check `SPARROW_SMS_TOKEN` in `.env`
- Verify Sparrow SMS account has credits
- Check terminal logs
- SMS is optional - app works without it

### Notifications not appearing?
- Check Supabase `notifications` table
- Verify user_id is correct
- Check RLS policies are enabled
- Use correct authentication token

### Review creation fails?
- Verify booking is completed
- Check if review already exists for this booking
- Ensure user owns the booking
- Validate rating is between 1-5

## Next Steps

1. ✅ Backend complete
2. 🔄 Create frontend components
3. 🔄 Test end-to-end flow
4. 🔄 Deploy to production

## Support

Need help?
- Check `NOTIFICATION_REVIEW_API_DOCS.md` for detailed API docs
- Review `BUSINESS_STRATEGY_RECOMMENDATIONS.md` for feature roadmap
- Contact: support@aamashishusewa.com

---

**Last Updated:** January 23, 2026
