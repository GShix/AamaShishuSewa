// server/src/routes/admin/reviews.js
import express from 'express';
import { authenticateAdmin } from '../../middleware/auth.js';
import {
  getAllReviews,
  updateReviewStatus,
  respondToReview,
  toggleFeaturedReview,
  deleteReview,
  getReviewStats
} from '../../controllers/admin/reviewController.js';

const router = express.Router();

// All routes require admin authentication
router.get('/', authenticateAdmin, getAllReviews);  // Get all reviews
router.get('/stats', authenticateAdmin, getReviewStats);  // Get statistics
router.patch('/:reviewId/status', authenticateAdmin, updateReviewStatus);  // Approve/Reject/Hide
router.post('/:reviewId/respond', authenticateAdmin, respondToReview);  // Add response
router.patch('/:reviewId/featured', authenticateAdmin, toggleFeaturedReview);  // Feature/Unfeature
router.delete('/:reviewId', authenticateAdmin, deleteReview);  // Delete review

export default router;
