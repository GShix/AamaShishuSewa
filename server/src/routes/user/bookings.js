// server/src/routes/user/bookings.js
import express from 'express';
import { authenticate } from '../../middleware/auth.js';
import {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking
} from '../../controllers/user/bookingController.js';

const router = express.Router();

// Get user's bookings
router.get('/my-bookings', authenticate, getMyBookings);

// Create new booking
router.post('/', authenticate, createBooking);

// Get booking by ID
router.get('/:bookingId', authenticate, getBookingById);

// Cancel booking
router.patch('/:bookingId/cancel', authenticate, cancelBooking);

export default router;
