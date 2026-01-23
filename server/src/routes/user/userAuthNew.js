// server/src/routes/user/userAuth.js
import express from 'express';
import {
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
} from '../../controllers/user/authControllerNew.js';

const router = express.Router();

// ============================================================================
// REGISTRATION ROUTES (with Email OTP Verification)
// ============================================================================

/**
 * @route   POST /api/user/auth/register/send-otp
 * @desc    Send OTP to email for registration
 * @access  Public
 */
router.post('/register/send-otp', sendRegistrationOTP);

/**
 * @route   POST /api/user/auth/register/verify-otp
 * @desc    Verify OTP and complete registration
 * @access  Public
 */
router.post('/register/verify-otp', verifyRegistrationOTP);

/**
 * @route   POST /api/user/auth/register/resend-otp
 * @desc    Resend registration OTP
 * @access  Public
 */
router.post('/register/resend-otp', resendRegistrationOTP);

// ============================================================================
// FORGOT PASSWORD ROUTES (with Email OTP Verification)
// ============================================================================

/**
 * @route   POST /api/user/auth/forgot-password/send-otp
 * @desc    Send OTP to email for password reset
 * @access  Public
 */
router.post('/forgot-password/send-otp', sendForgotPasswordOTP);

/**
 * @route   POST /api/user/auth/forgot-password/verify-otp
 * @desc    Verify OTP and get reset token
 * @access  Public
 */
router.post('/forgot-password/verify-otp', verifyForgotPasswordOTP);

/**
 * @route   POST /api/user/auth/forgot-password/reset
 * @desc    Reset password with verified token
 * @access  Public
 */
router.post('/forgot-password/reset', resetPassword);

/**
 * @route   POST /api/user/auth/forgot-password/resend-otp
 * @desc    Resend forgot password OTP
 * @access  Public
 */
router.post('/forgot-password/resend-otp', resendForgotPasswordOTP);

// ============================================================================
// LOGIN ROUTE
// ============================================================================

/**
 * @route   POST /api/user/auth/login
 * @desc    User login
 * @access  Public
 */
router.post('/login', login);

export default router;
