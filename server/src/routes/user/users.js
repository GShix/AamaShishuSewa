// server/src/routes/admin/users.js
import express from 'express';
import {
  getAllUsers,
  getUserById,
  updateUserStatus,
  deleteUser
} from '../../controllers/admin/userController.js';
import { authenticate, requireAdmin } from '../../middleware/auth.js';

const router = express.Router();

// All routes require authentication and admin role
router.use(authenticate);
router.use(requireAdmin);

/**
 * @route   GET /api/admin/users
 * @desc    Get all users
 * @access  Admin, SuperAdmin
 */
router.get('/', getAllUsers);

/**
 * @route   GET /api/admin/users/:id
 * @desc    Get a single user by ID
 * @access  Admin, SuperAdmin
 */
router.get('/:id', getUserById);

/**
 * @route   PATCH /api/admin/users/:id/status
 * @desc    Update user status
 * @access  Admin, SuperAdmin
 */
router.patch('/:id/status', updateUserStatus);

/**
 * @route   DELETE /api/admin/users/:id
 * @desc    Delete a user
 * @access  Admin, SuperAdmin
 */
router.delete('/:id', deleteUser);

export default router;
