// server/src/services/emailService.js
import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Resend only if API key is available
let resend = null;
if (process.env.RESEND_API_KEY) {
  resend = new Resend(process.env.RESEND_API_KEY);
} else {
  console.warn('⚠️  RESEND_API_KEY not found. Email functionality will be disabled.');
}

/**
 * Send OTP verification email
 */
export const sendOTPEmail = async (to, otp, type = 'registration') => {
  try {
    // If Resend is not configured, log the OTP instead
    if (!resend) {
      console.log('📧 [EMAIL DISABLED] Would send OTP email to:', to);
      console.log('📧 OTP:', otp);
      console.log('📧 Type:', type);
      return { success: true, message: 'Email service not configured. Check console for OTP.' };
    }

    const subject = type === 'registration' 
      ? '🔐 Verify Your Email - Aama Shishu Sewa'
      : '🔑 Reset Your Password - Aama Shishu Sewa';

    const html = type === 'registration'
      ? getRegistrationOTPTemplate(otp)
      : getForgotPasswordOTPTemplate(otp);

    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'Aama Shishu Sewa <noreply@yourdomain.com>',
      to: [to],
      subject: subject,
      html: html,
    });

    if (error) {
      console.error('Resend error:', error);
      throw new Error(error.message || 'Failed to send email');
    }

    console.log('✅ Email sent successfully:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Send OTP email error:', error);
    throw error;
  }
};

/**
 * Send welcome email after successful registration
 */
export const sendWelcomeEmail = async (to, name) => {
  try {
    if (!resend) {
      console.log('📧 [EMAIL DISABLED] Would send welcome email to:', to);
      return { success: true, message: 'Email service not configured.' };
    }

    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'Aama Shishu Sewa <noreply@yourdomain.com>',
      to: [to],
      subject: '🎉 Welcome to Aama Shishu Sewa!',
      html: getWelcomeTemplate(name),
    });

    if (error) {
      console.error('Resend error:', error);
      throw new Error(error.message || 'Failed to send welcome email');
    }

    return { success: true, data };
  } catch (error) {
    console.error('Send welcome email error:', error);
    // Don't throw - welcome email is not critical
    return { success: false, error: error.message };
  }
};

/**
 * Send password reset confirmation email
 */
export const sendPasswordResetConfirmation = async (to, name) => {
  try {
    if (!resend) {
      console.log('📧 [EMAIL DISABLED] Would send password reset confirmation to:', to);
      return { success: true, message: 'Email service not configured.' };
    }

    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'Aama Shishu Sewa <noreply@yourdomain.com>',
      to: [to],
      subject: '✅ Password Reset Successful',
      html: getPasswordResetConfirmationTemplate(name),
    });

    if (error) {
      console.error('Resend error:', error);
      throw new Error(error.message || 'Failed to send confirmation email');
    }

    return { success: true, data };
  } catch (error) {
    console.error('Send password reset confirmation error:', error);
    return { success: false, error: error.message };
  }
};

// ============================================================================
// EMAIL TEMPLATES
// ============================================================================

/**
 * Registration OTP template
 */
const getRegistrationOTPTemplate = (otp) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
    .otp-box { background: white; border: 2px dashed #667eea; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0; }
    .otp-code { font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 8px; }
    .warning { background: #fef3cd; border-left: 4px solid #f59e0b; padding: 12px; margin: 20px 0; border-radius: 4px; }
    .footer { text-align: center; color: #6b7280; font-size: 14px; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🔐 Email Verification</h1>
      <p>Aama Shishu Sewa</p>
    </div>
    <div class="content">
      <h2>Welcome! 👋</h2>
      <p>Thank you for registering with Aama Shishu Sewa. To complete your registration, please verify your email address using the OTP below:</p>
      
      <div class="otp-box">
        <p style="margin: 0; font-size: 14px; color: #6b7280;">Your OTP Code</p>
        <div class="otp-code">${otp}</div>
        <p style="margin: 10px 0 0 0; font-size: 12px; color: #9ca3af;">Valid for 10 minutes</p>
      </div>
      
      <div class="warning">
        <strong>⚠️ Security Notice:</strong> Never share this OTP with anyone. Our team will never ask for your OTP.
      </div>
      
      <p>If you didn't request this verification, please ignore this email.</p>
      
      <p>Best regards,<br>The Aama Shishu Sewa Team</p>
    </div>
    <div class="footer">
      <p>© 2026 Aama Shishu Sewa. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `;
};

/**
 * Forgot password OTP template
 */
const getForgotPasswordOTPTemplate = (otp) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
    .otp-box { background: white; border: 2px dashed #f59e0b; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0; }
    .otp-code { font-size: 32px; font-weight: bold; color: #f59e0b; letter-spacing: 8px; }
    .warning { background: #fee2e2; border-left: 4px solid #ef4444; padding: 12px; margin: 20px 0; border-radius: 4px; }
    .footer { text-align: center; color: #6b7280; font-size: 14px; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🔑 Password Reset Request</h1>
      <p>Aama Shishu Sewa</p>
    </div>
    <div class="content">
      <h2>Reset Your Password</h2>
      <p>We received a request to reset your password. Use the OTP below to proceed:</p>
      
      <div class="otp-box">
        <p style="margin: 0; font-size: 14px; color: #6b7280;">Your OTP Code</p>
        <div class="otp-code">${otp}</div>
        <p style="margin: 10px 0 0 0; font-size: 12px; color: #9ca3af;">Valid for 10 minutes</p>
      </div>
      
      <div class="warning">
        <strong>⚠️ Security Alert:</strong> If you didn't request a password reset, please ignore this email and ensure your account is secure.
      </div>
      
      <p>After verifying the OTP, you'll be able to set a new password.</p>
      
      <p>Best regards,<br>The Aama Shishu Sewa Team</p>
    </div>
    <div class="footer">
      <p>© 2026 Aama Shishu Sewa. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `;
};

/**
 * Welcome email template
 */
const getWelcomeTemplate = (name) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
    .feature { background: white; padding: 15px; margin: 10px 0; border-radius: 8px; border-left: 4px solid #10b981; }
    .footer { text-align: center; color: #6b7280; font-size: 14px; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 Welcome to Aama Shishu Sewa!</h1>
    </div>
    <div class="content">
      <h2>Hello ${name}! 👋</h2>
      <p>Your account has been successfully verified. We're excited to have you join our community!</p>
      
      <h3>What you can do now:</h3>
      <div class="feature">
        ✨ <strong>Browse Services</strong> - Explore our postpartum care services
      </div>
      <div class="feature">
        📅 <strong>Book Appointments</strong> - Schedule care with verified professionals
      </div>
      <div class="feature">
        💬 <strong>Get Support</strong> - Access personalized care plans and guidance
      </div>
      <div class="feature">
        💼 <strong>Apply for Jobs</strong> - Check out career opportunities
      </div>
      
      <p>If you have any questions, feel free to reach out to our support team.</p>
      
      <p>Thank you for choosing Aama Shishu Sewa!</p>
      
      <p>Best regards,<br>The Aama Shishu Sewa Team</p>
    </div>
    <div class="footer">
      <p>© 2026 Aama Shishu Sewa. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `;
};

/**
 * Password reset confirmation template
 */
const getPasswordResetConfirmationTemplate = (name) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
    .info-box { background: #d1fae5; border: 1px solid #10b981; border-radius: 8px; padding: 15px; margin: 20px 0; }
    .footer { text-align: center; color: #6b7280; font-size: 14px; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>✅ Password Reset Successful</h1>
    </div>
    <div class="content">
      <h2>Hello ${name}!</h2>
      <p>Your password has been successfully reset.</p>
      
      <div class="info-box">
        <strong>✅ Your account is now secure with your new password.</strong>
      </div>
      
      <p>If you didn't make this change, please contact our support team immediately.</p>
      
      <p>Best regards,<br>The Aama Shishu Sewa Team</p>
    </div>
    <div class="footer">
      <p>© 2026 Aama Shishu Sewa. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `;
};

export default {
  sendOTPEmail,
  sendWelcomeEmail,
  sendPasswordResetConfirmation
};
