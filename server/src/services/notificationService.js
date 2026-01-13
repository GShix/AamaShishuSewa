// server/src/services/notificationService.js
import nodemailer from 'nodemailer';
import axios from 'axios';

/**
 * EMAIL TRANSPORTER CONFIGURATION
 * Initialized once to enable connection pooling
 */
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail', // e.g., 'gmail' or use host/port for SendGrid/SMTP
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

/**
 * Email Template for OTP
 */
const getEmailTemplate = (otp, userName) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #E67E7E 0%, #F4A261 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #eee; }
    .otp-box { background: white; border: 3px dashed #E67E7E; padding: 20px; text-align: center; margin: 20px 0; border-radius: 10px; }
    .otp-code { font-size: 32px; font-weight: bold; color: #E67E7E; letter-spacing: 8px; }
    .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 12px; margin: 20px 0; font-size: 14px; }
    .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0; color: white;">❤️ आमा शिशु सेवा</h1>
      <p style="margin: 5px 0 0 0;">Aama Sisu Seva</p>
    </div>
    <div class="content">
      <h2 style="color: #E67E7E;">नमस्ते ${userName},</h2>
      <p>तपाईंले आमा शिशु सेवा खातामा पासवर्ड रिसेट अनुरोध गर्नुभएको छ।</p>
      <div class="otp-box">
        <p style="margin: 0 0 10px 0; color: #666;">तपाईंको OTP कोड:</p>
        <div class="otp-code">${otp}</div>
      </div>
      <p><strong>महत्वपूर्ण:</strong> यो कोड <strong>५ मिनेट</strong>मा समाप्त हुनेछ।</p>
      <div class="warning">
        <p style="margin: 0;"><strong>⚠️ सुरक्षा सूचना:</strong> यदि यो तपाईंले अनुरोध गर्नुभएको होइन भने, कृपया यो इमेललाई बेवास्ता गर्नुहोस्।</p>
      </div>
      <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
      <p>Hello ${userName}, your OTP code for password reset is: <strong style="color: #E67E7E;">${otp}</strong></p>
      <div class="footer">
        <p>आमा शिशु सेवा टोली | Aama Sisu Seva Team</p>
        <p>📞 9764651355 | 📧 support@aamasisu.com</p>
      </div>
    </div>
  </div>
</body>
</html>`;
};

/**
 * Send OTP via Email
 */
export const sendEmailOTP = async (email, otp, userName = 'User') => {
  try {
    const mailOptions = {
      from: `"आमा शिशु सेवा" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'पासवर्ड रिसेट कोड - Password Reset Code',
      html: getEmailTemplate(otp, userName)
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ OTP email sent to ${email}`);
    return { success: true };
  } catch (error) {
    console.error('❌ Email sending error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Send OTP via Sparrow SMS (Nepal)
 */
export const sendSMSOTP = async (phone, otp) => {
  try {
    const sparrowToken = process.env.SPARROW_SMS_TOKEN;
    const sparrowFrom = process.env.SPARROW_SMS_FROM || 'AamaSisu';
    
    if (!sparrowToken) {
      console.warn('⚠️ Sparrow SMS token missing. OTP:', otp);
      return { success: false, error: 'SMS service not configured' };
    }

    const message = `आमा शिशु सेवा: तपाईंको पासवर्ड रिसेट कोड ${otp} हो। यो कोड ५ मिनेटमा समाप्त हुनेछ। - Aama Sisu Seva`;

    const response = await axios.post('https://sms.sparrowsms.com/v2/sms/', {
      token: sparrowToken,
      from: sparrowFrom,
      to: phone,
      text: message
    });

    if (response.data.response_code === 200) {
      console.log(`✅ SMS sent to ${phone}`);
      return { success: true };
    }
    throw new Error(response.data.message || 'SMS provider error');
  } catch (error) {
    console.error('❌ SMS sending error:', error.response?.data || error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Smart OTP sender - auto-detects Email or Phone
 */
export const sendOTP = async (identifier, otp, userName) => {
  // Simple regex to check if identifier is an email
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);
  
  if (isEmail) {
    return await sendEmailOTP(identifier, otp, userName);
  } else {
    // Basic phone normalization: remove spaces/dashes
    const cleanPhone = identifier.replace(/[\s-]/g, '');
    return await sendSMSOTP(cleanPhone, otp);
  }
};

export default {
  sendEmailOTP,
  sendSMSOTP,
  sendOTP
};