// server/src/routes/auth.js
import express from 'express';
import { 
  register, 
  login, 
  getProfile, 
  updateProfile,
  forgotPassword,
  verifyOTP,
  resetPassword,
  changePassword
} from '../../controllers/user/authController.js';
import { authenticate } from '../../middleware/auth.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Validation middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      error: errors.array()[0].msg 
    });
  }
  next();
};

// ============================================================================
// PUBLIC ROUTES (No authentication required)
// ============================================================================

router.post('/register', [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
  body('phone')
    .matches(/^[0-9]{10}$/)
    .withMessage('Phone number must be 10 digits'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('fullName')
    .trim()
    .notEmpty()
    .withMessage('Full name is required'),
  validate
], register);

router.post('/login', [
  body('email')
    .notEmpty()
    .withMessage('Email is required'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  validate
], login);

// Debug endpoint to check user status (temporary - remove in production)
router.post('/debug-user-status', async (req, res) => {
  try {
    const { email } = req.body;
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
    
    const { data: user } = await supabase
      .from('users')
      .select('id, email, phone, full_name, status, role, created_at')
      .eq('email', email)
      .single();
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({
      user,
      statusCheck: {
        rawValue: user.status,
        type: typeof user.status,
        isNull: user.status === null,
        isUndefined: user.status === undefined,
        toLowerCase: user.status?.toLowerCase(),
        equals_active: user.status === 'active',
        equals_active_lowercase: user.status?.toLowerCase() === 'active'
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/forgot-password', [
  body('email')
    .notEmpty()
    .withMessage('Email is required'),
  validate
], forgotPassword);


router.post('/verify-otp', [
  body('email')
    .notEmpty()
    .withMessage('Email is required'),
  body('otp')
    .matches(/^[0-9]{6}$/)
    .withMessage('OTP must be 6 digits'),
  validate
], verifyOTP);

router.post('/reset-password', [
  body('email')
    .notEmpty()
    .withMessage('Email is required'),
  body('otp')
    .matches(/^[0-9]{6}$/)
    .withMessage('OTP must be 6 digits'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  validate
], resetPassword);

// ============================================================================
// PROTECTED ROUTES (Authentication required)
// ============================================================================

router.get('/profile', authenticate, getProfile);

router.put('/profile', [
  authenticate,
  body('fullName')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Full name cannot be empty'),
  body('address')
    .optional()
    .trim(),
  validate
], updateProfile);

router.post('/change-password', [
  authenticate,
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters'),
  validate
], changePassword);


router.post('/logout', authenticate, (req, res) => {
  // With JWT, logout is handled client-side by removing token
  // This endpoint is mainly for logging/analytics purposes
  res.json({ message: 'Logged out successfully' });
});

router.get('/verify-token', authenticate, (req, res) => {
  // If middleware passes, token is valid
  res.json({ 
    valid: true,
    userId: req.userId,
    role: req.userRole
  });
});

export default router;