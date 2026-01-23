// server/src/routes/user/notifications.js
import express from 'express';
import { authenticate } from '../../middleware/auth.js';
import {
  getMyNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getUnreadCount
} from '../../controllers/user/notificationController.js';

const router = express.Router();

// All routes require authentication
router.get('/', authenticate, getMyNotifications);  // Get user's notifications
router.get('/unread-count', authenticate, getUnreadCount);  // Get unread count
router.patch('/:notificationId/read', authenticate, markAsRead);  // Mark as read
router.patch('/mark-all-read', authenticate, markAllAsRead);  // Mark all as read
router.delete('/:notificationId', authenticate, deleteNotification);  // Delete notification

export default router;
