// server/src/routes/admin/adminAuth.js
import express from 'express';
import {
  adminLogin,
  adminRegister,
  getAdminProfile,
  updateAdminProfile,
  changeAdminPassword
} from '../../controllers/admin/adminAuthController.js';
import { authenticate, requireAdmin } from '../../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/login', adminLogin);
router.post('/register', adminRegister);

// Protected routes (require authentication)
router.get('/profile', authenticate, requireAdmin, getAdminProfile);
router.put('/profile', authenticate, requireAdmin, updateAdminProfile);
router.put('/change-password', authenticate, requireAdmin, changeAdminPassword);

export default router;
