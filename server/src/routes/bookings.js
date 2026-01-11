import express from 'express';
import {
  createBooking,
  getUserBookings,
  getBookingById,
  updateBookingStatus,
  cancelBooking
} from '../controllers/bookingController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticate, createBooking);
router.get('/', authenticate, getUserBookings);
router.get('/:bookingId', authenticate, getBookingById);
router.patch('/:bookingId/status', authenticate, updateBookingStatus);
router.patch('/:bookingId/cancel', authenticate, cancelBooking);

export default router;