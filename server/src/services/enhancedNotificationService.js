// server/src/services/notificationService.js - Enhanced version
import nodemailer from 'nodemailer';
import axios from 'axios';
import { supabaseAdmin } from '../config/supabase.js';

/**
 * EMAIL TRANSPORTER CONFIGURATION
 */
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

/**
 * NOTIFICATION TEMPLATES
 */

// Booking Created Template
const getBookingCreatedTemplate = (userName, booking, service) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #E67E7E 0%, #F4A261 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #eee; }
    .booking-details { background: white; border-left: 4px solid #E67E7E; padding: 20px; margin: 20px 0; }
    .detail-row { margin: 10px 0; }
    .label { font-weight: bold; color: #E67E7E; }
    .success-box { background: #d4edda; border: 1px solid #c3e6cb; padding: 15px; border-radius: 5px; margin: 20px 0; }
    .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0;">✅ बुकिङ सफल भयो!</h1>
      <p style="margin: 5px 0 0 0;">Booking Confirmed</p>
    </div>
    <div class="content">
      <h2 style="color: #E67E7E;">नमस्ते ${userName},</h2>
      <div class="success-box">
        <p style="margin: 0;"><strong>तपाईंको बुकिङ सफलतापूर्वक प्राप्त भयो!</strong></p>
        <p style="margin: 5px 0 0 0;">Your booking has been received successfully!</p>
      </div>
      
      <div class="booking-details">
        <h3 style="margin-top: 0;">बुकिङ विवरण / Booking Details:</h3>
        <div class="detail-row">
          <span class="label">सेवा / Service:</span> ${service?.name || booking.service_type}
        </div>
        <div class="detail-row">
          <span class="label">मिति / Date:</span> ${new Date(booking.booking_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
        <div class="detail-row">
          <span class="label">अवधि / Duration:</span> ${booking.duration_days} दिन / days
        </div>
        <div class="detail-row">
          <span class="label">ठेगाना / Address:</span> ${booking.client_address}
        </div>
        <div class="detail-row">
          <span class="label">स्थिति / Status:</span> <strong style="color: #ffc107;">Pending Confirmation</strong>
        </div>
      </div>

      <p><strong>अर्को चरण / Next Steps:</strong></p>
      <ul>
        <li>हाम्रो टोलीले २४ घण्टा भित्र तपाईंको बुकिङ पुष्टि गर्नेछ</li>
        <li>Our team will confirm your booking within 24 hours</li>
        <li>तपाईंलाई पेशेवर नियुक्त गरिनेछ</li>
        <li>A professional will be assigned to you</li>
      </ul>

      <div class="footer">
        <p><strong>आमा शिशु सेवा टोली</strong> | Aama Shishu Sewa Team</p>
        <p>📞 9764651355 | 📧 support@aamashishusewa.com</p>
      </div>
    </div>
  </div>
</body>
</html>`;
};

// Booking Confirmed Template
const getBookingConfirmedTemplate = (userName, booking, employee) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #eee; }
    .employee-card { background: white; border: 2px solid #10b981; padding: 20px; margin: 20px 0; border-radius: 10px; }
    .success-badge { background: #10b981; color: white; padding: 10px 20px; border-radius: 20px; display: inline-block; margin: 10px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0;">🎉 बुकिङ पुष्टि भयो!</h1>
      <p style="margin: 5px 0 0 0;">Booking Confirmed</p>
    </div>
    <div class="content">
      <h2 style="color: #10b981;">नमस्ते ${userName},</h2>
      <div class="success-badge">✅ तपाईंको बुकिङ पुष्टि भयो!</div>
      
      ${employee ? `
      <div class="employee-card">
        <h3 style="margin-top: 0;">तपाईंको पेशेवर / Your Professional:</h3>
        <p><strong>नाम / Name:</strong> ${employee.full_name}</p>
        <p><strong>फोन / Phone:</strong> ${employee.phone}</p>
        ${employee.specialization ? `<p><strong>विशेषज्ञता / Specialization:</strong> ${employee.specialization}</p>` : ''}
        ${employee.rating ? `<p><strong>रेटिङ / Rating:</strong> ⭐ ${employee.rating}/5.0</p>` : ''}
      </div>
      ` : ''}

      <p>कृपया सेवा मितिको लागि तयार रहनुहोस्। पेशेवर तपाईंलाई चाँडै सम्पर्क गर्नेछन्।</p>
      <p>Please be prepared for the service date. The professional will contact you soon.</p>
      
      <div style="text-align: center; margin-top: 20px; color: #666; font-size: 12px;">
        <p><strong>आमा शिशु सेवा टोली</strong></p>
        <p>📞 9764651355 | 📧 support@aamashishusewa.com</p>
      </div>
    </div>
  </div>
</body>
</html>`;
};

// Booking Status Update Template
const getStatusUpdateTemplate = (userName, booking, oldStatus, newStatus) => {
  const statusColors = {
    pending: '#ffc107',
    confirmed: '#10b981',
    in_progress: '#3b82f6',
    completed: '#8b5cf6',
    cancelled: '#ef4444'
  };

  const statusLabels = {
    pending: 'पेन्डिङ / Pending',
    confirmed: 'पुष्टि भयो / Confirmed',
    in_progress: 'प्रगतिमा / In Progress',
    completed: 'पूरा भयो / Completed',
    cancelled: 'रद्द भयो / Cancelled'
  };

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: ${statusColors[newStatus]}; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #eee; }
    .status-update { background: white; border-left: 4px solid ${statusColors[newStatus]}; padding: 20px; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0;">📋 बुकिङ अपडेट</h1>
      <p style="margin: 5px 0 0 0;">Booking Update</p>
    </div>
    <div class="content">
      <h2>नमस्ते ${userName},</h2>
      <div class="status-update">
        <p><strong>तपाईंको बुकिङ स्थिति परिवर्तन भयो:</strong></p>
        <p>Your booking status has been updated:</p>
        <p style="font-size: 18px;">
          <span style="color: ${statusColors[oldStatus]};">${statusLabels[oldStatus]}</span>
          →
          <strong style="color: ${statusColors[newStatus]};">${statusLabels[newStatus]}</strong>
        </p>
      </div>
      <p>थप जानकारीको लागि आफ्नो ड्यासबोर्ड हेर्नुहोस्।</p>
      <p>Please check your dashboard for more details.</p>
    </div>
  </div>
</body>
</html>`;
};

// OTP Template
const getOTPTemplate = (otp, userName) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #E67E7E 0%, #F4A261 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #eee; }
    .otp-box { background: white; border: 3px dashed #E67E7E; padding: 20px; text-align: center; margin: 20px 0; border-radius: 10px; }
    .otp-code { font-size: 32px; font-weight: bold; color: #E67E7E; letter-spacing: 8px; }
    .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 12px; margin: 20px 0; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0;">❤️ आमा शिशु सेवा</h1>
      <p style="margin: 5px 0 0 0;">Aama Shishu Sewa</p>
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
    </div>
  </div>
</body>
</html>`;
};

/**
 * Send Email Notification
 */
export const sendEmail = async (to, subject, htmlContent) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.warn('⚠️ Email service not configured. Email not sent to:', to);
      console.log('📧 Email content:', subject);
      return { success: false, error: 'Email service not configured' };
    }

    const mailOptions = {
      from: `"आमा शिशु सेवा" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html: htmlContent
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${to}`);
    return { success: true };
  } catch (error) {
    console.error('❌ Email sending error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Send SMS via Sparrow SMS (Nepal)
 */
export const sendSMS = async (phone, message) => {
  try {
    const sparrowToken = process.env.SPARROW_SMS_TOKEN;
    const sparrowFrom = process.env.SPARROW_SMS_FROM || 'AamaSisu';
    
    if (!sparrowToken) {
      console.warn('⚠️ Sparrow SMS not configured. SMS not sent to:', phone);
      console.log('📱 SMS content:', message);
      return { success: false, error: 'SMS service not configured' };
    }

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
 * Create In-App Notification
 */
export const createNotification = async ({ userId, adminId, type, title, message, data, sendEmail: shouldSendEmail = true, sendSMS: shouldSendSMS = false }) => {
  try {
    // Insert notification into database
    const { data: notification, error } = await supabaseAdmin
      .from('notifications')
      .insert({
        user_id: userId || null,
        admin_id: adminId || null,
        type,
        title,
        message,
        data: data || {},
        sent_email: false,
        sent_sms: false,
        sent_push: false
      })
      .select()
      .single();

    if (error) throw error;

    // Send email if requested
    if (shouldSendEmail && userId) {
      const { data: user } = await supabaseAdmin
        .from('users')
        .select('email, full_name')
        .eq('id', userId)
        .single();

      if (user?.email) {
        await sendEmail(user.email, title, `<p>${message}</p>`);
        await supabaseAdmin
          .from('notifications')
          .update({ sent_email: true })
          .eq('id', notification.id);
      }
    }

    // Send SMS if requested
    if (shouldSendSMS && userId) {
      const { data: user } = await supabaseAdmin
        .from('users')
        .select('phone')
        .eq('id', userId)
        .single();

      if (user?.phone) {
        await sendSMS(user.phone, message);
        await supabaseAdmin
          .from('notifications')
          .update({ sent_sms: true })
          .eq('id', notification.id);
      }
    }

    return { success: true, notification };
  } catch (error) {
    console.error('❌ Create notification error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * BOOKING NOTIFICATIONS
 */

export const notifyBookingCreated = async (booking, user, service) => {
  try {
    const emailHtml = getBookingCreatedTemplate(user.full_name, booking, service);
    
    // Send email
    if (user.email) {
      await sendEmail(
        user.email,
        '✅ बुकिङ प्राप्त भयो - Booking Received',
        emailHtml
      );
    }

    // Send SMS
    if (user.phone) {
      const smsMessage = `आमा शिशु सेवा: तपाईंको ${service?.name || booking.service_type} बुकिङ प्राप्त भयो। मिति: ${new Date(booking.booking_date).toLocaleDateString()}। हामी चाँडै पुष्टि गर्नेछौं। धन्यवाद!`;
      await sendSMS(user.phone, smsMessage);
    }

    // Create in-app notification
    await createNotification({
      userId: user.id,
      type: 'booking_created',
      title: 'बुकिङ प्राप्त भयो',
      message: `तपाईंको ${service?.name || booking.service_type} बुकिङ सफलतापूर्वक प्राप्त भयो। हाम्रो टोलीले चाँडै पुष्टि गर्नेछ।`,
      data: { booking_id: booking.id, service_id: booking.service_id }
    });

    console.log('✅ Booking created notifications sent');
  } catch (error) {
    console.error('❌ Notify booking created error:', error);
  }
};

export const notifyBookingConfirmed = async (booking, user, employee) => {
  try {
    const emailHtml = getBookingConfirmedTemplate(user.full_name, booking, employee);
    
    // Send email
    if (user.email) {
      await sendEmail(
        user.email,
        '🎉 बुकिङ पुष्टि भयो - Booking Confirmed',
        emailHtml
      );
    }

    // Send SMS
    if (user.phone) {
      const smsMessage = `आमा शिशु सेवा: तपाईंको बुकिङ पुष्टि भयो! ${employee ? `पेशेवर: ${employee.full_name} (${employee.phone})` : ''} मिति: ${new Date(booking.booking_date).toLocaleDateString()}`;
      await sendSMS(user.phone, smsMessage);
    }

    // Create in-app notification
    await createNotification({
      userId: user.id,
      type: 'booking_confirmed',
      title: '🎉 बुकिङ पुष्टि भयो',
      message: `तपाईंको बुकिङ पुष्टि भयो। ${employee ? `पेशेवर ${employee.full_name} तपाईंलाई चाँडै सम्पर्क गर्नुहुनेछ।` : 'चाँडै पेशेवर नियुक्त गरिनेछ।'}`,
      data: { booking_id: booking.id, employee_id: booking.employee_id }
    });

    console.log('✅ Booking confirmed notifications sent');
  } catch (error) {
    console.error('❌ Notify booking confirmed error:', error);
  }
};

export const notifyBookingStatusChange = async (booking, user, oldStatus, newStatus) => {
  try {
    const emailHtml = getStatusUpdateTemplate(user.full_name, booking, oldStatus, newStatus);
    
    // Send email
    if (user.email) {
      await sendEmail(
        user.email,
        `📋 बुकिङ अपडेट - Booking ${newStatus}`,
        emailHtml
      );
    }

    // Send SMS for important status changes
    if (user.phone && ['confirmed', 'completed', 'cancelled'].includes(newStatus)) {
      const statusNepali = {
        confirmed: 'पुष्टि भयो',
        completed: 'पूरा भयो',
        cancelled: 'रद्द भयो'
      };
      const smsMessage = `आमा शिशु सेवा: तपाईंको बुकिङ स्थिति ${statusNepali[newStatus]} भयो। विवरणको लागि ड्यासबोर्ड हेर्नुहोस्।`;
      await sendSMS(user.phone, smsMessage);
    }

    // Create in-app notification
    await createNotification({
      userId: user.id,
      type: 'booking_status_changed',
      title: 'बुकिङ स्थिति परिवर्तन',
      message: `तपाईंको बुकिङ स्थिति ${oldStatus} बाट ${newStatus} मा परिवर्तन भयो।`,
      data: { booking_id: booking.id, old_status: oldStatus, new_status: newStatus }
    });

    console.log('✅ Booking status change notifications sent');
  } catch (error) {
    console.error('❌ Notify booking status change error:', error);
  }
};

/**
 * Legacy OTP functions (keeping for backward compatibility)
 */
export const sendEmailOTP = async (email, otp, userName = 'User') => {
  const html = getOTPTemplate(otp, userName);
  return await sendEmail(email, 'पासवर्ड रिसेट कोड - Password Reset Code', html);
};

export const sendSMSOTP = async (phone, otp) => {
  const message = `आमा शिशु सेवा: तपाईंको पासवर्ड रिसेट कोड ${otp} हो। यो कोड ५ मिनेटमा समाप्त हुनेछ।`;
  return await sendSMS(phone, message);
};

export const sendOTP = async (identifier, otp, userName) => {
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);
  if (isEmail) {
    return await sendEmailOTP(identifier, otp, userName);
  } else {
    const cleanPhone = identifier.replace(/[\s-]/g, '');
    return await sendSMSOTP(cleanPhone, otp);
  }
};

export default {
  sendEmail,
  sendSMS,
  createNotification,
  notifyBookingCreated,
  notifyBookingConfirmed,
  notifyBookingStatusChange,
  sendEmailOTP,
  sendSMSOTP,
  sendOTP
};
