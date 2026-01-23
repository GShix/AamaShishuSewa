// server/src/routes/user/reviews.js
import express from 'express';
import { authenticate } from '../../middleware/auth.js';
import {
  createReview,
  getReviews,
  getMyReviews,
  updateReview,
  deleteReview,
  canReviewBooking
} from '../../controllers/user/reviewController.js';

const router = express.Router();

// Public routes
router.get('/', getReviews);  // Get all approved reviews (with filters)

// Protected routes
router.post('/', authenticate, createReview);  // Create review
router.get('/my-reviews', authenticate, getMyReviews);  // Get user's reviews
router.put('/:reviewId', authenticate, updateReview);  // Update review
router.delete('/:reviewId', authenticate, deleteReview);  // Delete review
router.get('/can-review/:bookingId', authenticate, canReviewBooking);  // Check if can review

export default router;
