# Email OTP Verification Setup with Resend

## Overview
Email-based OTP verification system for user registration and password reset using Resend.

## ✅ Features Implemented

### Registration Flow
1. User submits registration details → GET OTP via email
2. User enters OTP → Account created & verified
3. Welcome email sent automatically

### Forgot Password Flow
1. User enters email → GET OTP via email
2. User enters OTP → Receives reset token
3. User sets new password → Confirmation email sent

### Security Features
- ✅ OTP expires after 10 minutes
- ✅ Maximum 5 verification attempts per OTP
- ✅ Rate limiting: Max 3 OTP requests per 30 minutes
- ✅ Secure OTP storage in database
- ✅ Email verification required for registration

## 📋 Setup Instructions

### 1. Environment Variables

Add the following to your `.env` file:

```env
# Resend Configuration
RESEND_API_KEY=re_your_api_key_here
EMAIL_FROM=Aama Shishu Sewa <noreply@yourdomain.com>

# JWT Configuration (if not already set)
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d
```

### 2. Get Resend API Key

1. Go to [resend.com](https://resend.com)
2. Sign up for a free account (3,000 emails/month)
3. Navigate to **API Keys** in dashboard
4. Create new API key
5. Copy and paste into `.env` as `RESEND_API_KEY`

### 3. Verify Domain (For Production)

For development, you can use:
```env
EMAIL_FROM=onboarding@resend.dev
```

For production:
1. Add your domain in Resend dashboard
2. Add DNS records provided by Resend
3. Verify domain
4. Update `EMAIL_FROM` to your domain

### 4. Run Database Migration

Execute the OTP verification table migration:

```bash
# Run in Supabase SQL Editor or via your migration tool
scripts/migrations/008_create_otp_verifications_table.sql
```

## 📁 Files Created

```
src/
├── services/
│   └── emailService.js          # Resend integration & email templates
├── utils/
│   └── otpHelper.js             # OTP generation, storage, verification
├── controllers/user/
│   └── authControllerNew.js     # Updated auth with OTP verification
└── routes/user/
    └── userAuthNew.js           # New auth routes

scripts/migrations/
└── 008_create_otp_verifications_table.sql
```

## 🔌 API Endpoints

### Registration

**1. Send Registration OTP**
```http
POST /api/user/auth/register/send-otp
Content-Type: application/json

{
  "email": "user@example.com",
  "phone": "9841234567",
  "password": "password123",
  "fullName": "John Doe",
  "address": "Kathmandu, Nepal"
}
```

**2. Verify OTP & Complete Registration**
```http
POST /api/user/auth/register/verify-otp
Content-Type: application/json

{
  "email": "user@example.com",
  "otp": "123456",
  "phone": "9841234567",
  "password": "password123",
  "fullName": "John Doe",
  "address": "Kathmandu, Nepal"
}
```

**3. Resend Registration OTP**
```http
POST /api/user/auth/register/resend-otp
Content-Type: application/json

{
  "email": "user@example.com"
}
```

### Forgot Password

**1. Send Forgot Password OTP**
```http
POST /api/user/auth/forgot-password/send-otp
Content-Type: application/json

{
  "email": "user@example.com"
}
```

**2. Verify OTP & Get Reset Token**
```http
POST /api/user/auth/forgot-password/verify-otp
Content-Type: application/json

{
  "email": "user@example.com",
  "otp": "123456"
}
```

**3. Reset Password**
```http
POST /api/user/auth/forgot-password/reset
Content-Type: application/json

{
  "resetToken": "jwt_token_from_step_2",
  "newPassword": "newpassword123"
}
```

**4. Resend Forgot Password OTP**
```http
POST /api/user/auth/forgot-password/resend-otp
Content-Type: application/json

{
  "email": "user@example.com"
}
```

### Login

```http
POST /api/user/auth/login
Content-Type: application/json

{
  "identifier": "user@example.com",  // or phone number
  "password": "password123"
}
```

## 🎨 Email Templates

Three beautiful HTML email templates included:
1. **Registration OTP** - Purple gradient theme
2. **Forgot Password OTP** - Orange/red gradient theme
3. **Welcome Email** - Green gradient theme
4. **Password Reset Confirmation** - Green gradient theme

## 🔒 Security Features

- OTP expires after 10 minutes
- Maximum 5 attempts per OTP
- Rate limiting: 3 OTP requests per 30 minutes per email
- OTPs stored with expiration timestamps
- Automatic cleanup of expired OTPs
- Email verification required before account creation
- Secure password hashing with bcrypt

## 🧪 Testing

Use these files to test:
- `authControllerNew.js` - New OTP-based auth
- `userAuthNew.js` - New routes

To integrate, rename/replace old files:
```bash
mv src/controllers/user/authControllerNew.js src/controllers/user/authController.js
mv src/routes/user/userAuthNew.js src/routes/user/userAuth.js
```

## 📊 Database Schema

**otp_verifications** table:
- `id` - UUID primary key
- `identifier` - Email address
- `otp` - 6-digit code
- `type` - registration | forgot_password | email_change
- `expires_at` - Expiration timestamp
- `attempts` - Failed verification attempts
- `verified` - Verification status
- `verified_at` - Verification timestamp
- `created_at` - Creation timestamp

## 🚀 Next Steps

1. Add `RESEND_API_KEY` to your `.env`
2. Run the migration file
3. Test with Postman/Thunder Client
4. Replace old auth files when ready
5. Update frontend to use new OTP flow

## 💡 Tips

- For development, use `onboarding@resend.dev` as sender
- Check Resend dashboard for email logs
- Monitor rate limits in production
- Consider implementing CAPTCHA for additional security

## 📞 Support

If emails aren't sending:
1. Check `RESEND_API_KEY` is correct
2. Verify API key has send permissions
3. Check Resend dashboard for errors
4. Ensure domain is verified (production)
5. Check server logs for detailed errors
