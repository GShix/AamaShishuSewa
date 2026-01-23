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

router.get('/', getAllUsers);

router.get('/:id', getUserById);

router.patch('/:id/status', updateUserStatus);

router.delete('/:id', deleteUser);

export default router;
