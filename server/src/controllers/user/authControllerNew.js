// server/src/controllers/user/authController.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { supabaseAdmin } from '../../config/supabase.js';
import { sendOTPEmail, sendWelcomeEmail, sendPasswordResetConfirmation } from '../../services/emailService.js';
import { generateOTP, storeOTP, verifyOTP, deleteOTP, canResendOTP } from '../../utils/otpHelper.js';

// Generate JWT token
const generateToken = (userId, role) => {
  return jwt.sign(
    { userId, role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// ============================================================================
// REGISTRATION WITH EMAIL VERIFICATION
// ============================================================================

/**
 * Step 1: Send OTP to email for registration
 */
export const sendRegistrationOTP = async (req, res) => {
  try {
    const { email, phone, password, fullName, address } = req.body;

    // Validate required fields
    if (!email || !phone || !password || !fullName) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Validate phone format (10 digits)
    if (!/^[0-9]{10}$/.test(phone)) {
      return res.status(400).json({ error: 'Phone number must be 10 digits' });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Check if user already exists
    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('id, email')
      .or(`email.eq.${email},phone.eq.${phone}`)
      .single();

    if (existingUser) {
      return res.status(409).json({ error: 'User already exists with this email or phone' });
    }

    // Check rate limiting
    const resendCheck = await canResendOTP(email, 'registration');
    if (!resendCheck.canResend) {
      return res.status(429).json({ error: resendCheck.error });
    }

    // Generate and store OTP
    const otp = generateOTP();
    await storeOTP(email, otp, 'registration');

    // Send OTP email
    await sendOTPEmail(email, otp, 'registration');

    // Store registration data temporarily (you might want to encrypt this)
    // For now, we'll store it in session or have the client send it again
    res.status(200).json({
      message: 'OTP sent to your email. Please verify to complete registration.',
      email: email,
      expiresIn: 600 // 10 minutes in seconds
    });
  } catch (error) {
    console.error('Send registration OTP error:', error);
    res.status(500).json({ error: 'Failed to send OTP. Please try again.' });
  }
};

/**
 * Step 2: Verify OTP and complete registration
 */
export const verifyRegistrationOTP = async (req, res) => {
  try {
    const { email, otp, phone, password, fullName, address } = req.body;

    // Validate required fields
    if (!email || !otp || !phone || !password || !fullName) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Verify OTP
    const otpVerification = await verifyOTP(email, otp, 'registration');
    if (!otpVerification.success) {
      return res.status(400).json({ error: otpVerification.error });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user
    const { data: newUser, error } = await supabaseAdmin
      .from('users')
      .insert({
        email,
        phone,
        password_hash: passwordHash,
        full_name: fullName,
        address,
        role: 'user',
        status: 'active',
        email_verified: true,
        email_verified_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;

    // Delete OTP after successful registration
    await deleteOTP(email, 'registration');

    // Send welcome email (non-blocking)
    sendWelcomeEmail(email, fullName).catch(err => 
      console.error('Welcome email error:', err)
    );

    // Generate token
    const token = generateToken(newUser.id, newUser.role);

    res.status(201).json({
      message: 'Registration successful! Welcome to Aama Shishu Sewa.',
      user: {
        id: newUser.id,
        email: newUser.email,
        phone: newUser.phone,
        fullName: newUser.full_name,
        role: newUser.role,
        address: newUser.address
      },
      token
    });
  } catch (error) {
    console.error('Verify registration OTP error:', error);
    res.status(500).json({ error: 'Registration failed. Please try again.' });
  }
};

/**
 * Resend registration OTP
 */
export const resendRegistrationOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Check rate limiting
    const resendCheck = await canResendOTP(email, 'registration');
    if (!resendCheck.canResend) {
      return res.status(429).json({ error: resendCheck.error });
    }

    // Generate and store new OTP
    const otp = generateOTP();
    await storeOTP(email, otp, 'registration');

    // Send OTP email
    await sendOTPEmail(email, otp, 'registration');

    res.status(200).json({
      message: 'OTP resent successfully',
      expiresIn: 600
    });
  } catch (error) {
    console.error('Resend registration OTP error:', error);
    res.status(500).json({ error: 'Failed to resend OTP. Please try again.' });
  }
};

// ============================================================================
// FORGOT PASSWORD WITH EMAIL VERIFICATION
// ============================================================================

/**
 * Step 1: Send OTP to email for password reset
 */
export const sendForgotPasswordOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Check if user exists
    const { data: user } = await supabaseAdmin
      .from('users')
      .select('id, email, full_name')
      .eq('email', email)
      .single();

    if (!user) {
      // Don't reveal if user exists or not for security
      return res.status(200).json({
        message: 'If an account exists with this email, an OTP has been sent.'
      });
    }

    // Check rate limiting
    const resendCheck = await canResendOTP(email, 'forgot_password');
    if (!resendCheck.canResend) {
      return res.status(429).json({ error: resendCheck.error });
    }

    // Generate and store OTP
    const otp = generateOTP();
    await storeOTP(email, otp, 'forgot_password');

    // Send OTP email
    await sendOTPEmail(email, otp, 'forgot_password');

    res.status(200).json({
      message: 'OTP sent to your email. Please verify to reset your password.',
      expiresIn: 600
    });
  } catch (error) {
    console.error('Send forgot password OTP error:', error);
    res.status(500).json({ error: 'Failed to send OTP. Please try again.' });
  }
};

/**
 * Step 2: Verify OTP for password reset
 */
export const verifyForgotPasswordOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ error: 'Email and OTP are required' });
    }

    // Verify OTP
    const otpVerification = await verifyOTP(email, otp, 'forgot_password');
    if (!otpVerification.success) {
      return res.status(400).json({ error: otpVerification.error });
    }

    // Generate a temporary token for password reset (valid for 15 minutes)
    const resetToken = jwt.sign(
      { email, purpose: 'password_reset' },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    res.status(200).json({
      message: 'OTP verified successfully. You can now reset your password.',
      resetToken
    });
  } catch (error) {
    console.error('Verify forgot password OTP error:', error);
    res.status(500).json({ error: 'Failed to verify OTP. Please try again.' });
  }
};

/**
 * Step 3: Reset password with verified token
 */
export const resetPassword = async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;

    if (!resetToken || !newPassword) {
      return res.status(400).json({ error: 'Reset token and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Verify reset token
    let decoded;
    try {
      decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
      if (decoded.purpose !== 'password_reset') {
        throw new Error('Invalid token purpose');
      }
    } catch (error) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    const email = decoded.email;

    // Get user
    const { data: user } = await supabaseAdmin
      .from('users')
      .select('id, full_name')
      .eq('email', email)
      .single();

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(newPassword, 12);

    // Update password
    const { error } = await supabaseAdmin
      .from('users')
      .update({ 
        password_hash: passwordHash,
        updated_at: new Date().toISOString()
      })
      .eq('email', email);

    if (error) throw error;

    // Delete OTP
    await deleteOTP(email, 'forgot_password');

    // Send confirmation email (non-blocking)
    sendPasswordResetConfirmation(email, user.full_name).catch(err =>
      console.error('Password reset confirmation email error:', err)
    );

    res.status(200).json({
      message: 'Password reset successful. You can now login with your new password.'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Failed to reset password. Please try again.' });
  }
};

/**
 * Resend forgot password OTP
 */
export const resendForgotPasswordOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Check rate limiting
    const resendCheck = await canResendOTP(email, 'forgot_password');
    if (!resendCheck.canResend) {
      return res.status(429).json({ error: resendCheck.error });
    }

    // Generate and store new OTP
    const otp = generateOTP();
    await storeOTP(email, otp, 'forgot_password');

    // Send OTP email
    await sendOTPEmail(email, otp, 'forgot_password');

    res.status(200).json({
      message: 'OTP resent successfully',
      expiresIn: 600
    });
  } catch (error) {
    console.error('Resend forgot password OTP error:', error);
    res.status(500).json({ error: 'Failed to resend OTP. Please try again.' });
  }
};

// ============================================================================
// LOGIN
// ============================================================================

export const login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ error: 'Email/phone and password are required' });
    }

    // Find user by email or phone
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .or(`email.eq.${identifier},phone.eq.${identifier}`)
      .single();

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check if account is active
    if (user.status !== 'active') {
      return res.status(403).json({ error: 'Account is inactive. Please contact support.' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user.id, user.role);

    // Update last login
    await supabaseAdmin
      .from('users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', user.id);

    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        fullName: user.full_name,
        role: user.role,
        address: user.address,
        profileImage: user.profile_image
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed. Please try again.' });
  }
};

export default {
  // Registration with OTP
  sendRegistrationOTP,
  verifyRegistrationOTP,
  resendRegistrationOTP,
  
  // Forgot password with OTP
  sendForgotPasswordOTP,
  verifyForgotPasswordOTP,
  resetPassword,
  resendForgotPasswordOTP,
  
  // Login
  login
};
