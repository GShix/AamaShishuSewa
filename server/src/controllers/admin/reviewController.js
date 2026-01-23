// server/src/controllers/admin/reviewController.js
import { supabaseAdmin } from '../../config/supabase.js';

/**
 * Get all reviews (admin can see all statuses)
 */
export const getAllReviews = async (req, res) => {
  try {
    const { service_id, employee_id, status, rating, page = 1, limit = 20 } = req.query;

    let query = supabaseAdmin
      .from('reviews')
      .select(`
        *,
        users:user_id (full_name, email, phone, profile_image),
        services:service_id (name),
        employees:employee_id (full_name),
        bookings:booking_id (booking_date, service_type)
      `, { count: 'exact' });

    // Filters
    if (service_id) query = query.eq('service_id', service_id);
    if (employee_id) query = query.eq('employee_id', employee_id);
    if (status) query = query.eq('status', status);
    if (rating) query = query.eq('rating', parseFloat(rating));

    // Pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to).order('created_at', { ascending: false });

    const { data: reviews, error, count } = await query;

    if (error) throw error;

    res.status(200).json({
      reviews,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        totalPages: Math.ceil(count / limit)
      }
    });

  } catch (error) {
    console.error('Get all reviews error:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
};

/**
 * Approve/Reject/Hide review
 */
export const updateReviewStatus = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { status } = req.body;

    if (!['approved', 'rejected', 'hidden', 'pending'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const { data: review, error } = await supabaseAdmin
      .from('reviews')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', reviewId)
      .select()
      .single();

    if (error) throw error;

    // If approved, update employee/service ratings
    if (status === 'approved') {
      if (review.employee_id) {
        await updateEmployeeRating(review.employee_id);
      }
      if (review.service_id) {
        await updateServiceRating(review.service_id);
      }
    }

    res.status(200).json({
      message: 'Review status updated successfully',
      review
    });

  } catch (error) {
    console.error('Update review status error:', error);
    res.status(500).json({ error: 'Failed to update review status' });
  }
};

/**
 * Add admin/employee response to review
 */
export const respondToReview = async (req, res) => {
  try {
    const adminId = req.adminId;
    const { reviewId } = req.params;
    const { response_text } = req.body;

    if (!response_text) {
      return res.status(400).json({ error: 'Response text is required' });
    }

    const { data: review, error } = await supabaseAdmin
      .from('reviews')
      .update({ 
        response_text,
        response_by: adminId,
        response_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', reviewId)
      .select()
      .single();

    if (error) throw error;

    res.status(200).json({
      message: 'Response added successfully',
      review
    });

  } catch (error) {
    console.error('Respond to review error:', error);
    res.status(500).json({ error: 'Failed to add response' });
  }
};

/**
 * Feature/Unfeature review
 */
export const toggleFeaturedReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    // Get current featured status
    const { data: current } = await supabaseAdmin
      .from('reviews')
      .select('is_featured')
      .eq('id', reviewId)
      .single();

    const { data: review, error } = await supabaseAdmin
      .from('reviews')
      .update({ 
        is_featured: !current.is_featured,
        updated_at: new Date().toISOString()
      })
      .eq('id', reviewId)
      .select()
      .single();

    if (error) throw error;

    res.status(200).json({
      message: review.is_featured ? 'Review featured' : 'Review unfeatured',
      review
    });

  } catch (error) {
    console.error('Toggle featured review error:', error);
    res.status(500).json({ error: 'Failed to toggle featured status' });
  }
};

/**
 * Delete review (admin)
 */
export const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const { error } = await supabaseAdmin
      .from('reviews')
      .delete()
      .eq('id', reviewId);

    if (error) throw error;

    res.status(200).json({ message: 'Review deleted successfully' });

  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({ error: 'Failed to delete review' });
  }
};

/**
 * Get review statistics
 */
export const getReviewStats = async (req, res) => {
  try {
    // Total reviews
    const { count: totalReviews } = await supabaseAdmin
      .from('reviews')
      .select('*', { count: 'exact', head: true });

    // Pending reviews
    const { count: pendingReviews } = await supabaseAdmin
      .from('reviews')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    // Approved reviews
    const { count: approvedReviews } = await supabaseAdmin
      .from('reviews')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'approved');

    // Average rating
    const { data: ratings } = await supabaseAdmin
      .from('reviews')
      .select('rating')
      .eq('status', 'approved');

    const avgRating = ratings && ratings.length > 0
      ? (ratings.reduce((sum, r) => sum + parseFloat(r.rating), 0) / ratings.length).toFixed(1)
      : 0;

    // Rating distribution
    const { data: distribution } = await supabaseAdmin
      .from('reviews')
      .select('rating')
      .eq('status', 'approved');

    const ratingCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    if (distribution) {
      distribution.forEach(r => {
        const rating = Math.floor(parseFloat(r.rating));
        ratingCounts[rating] = (ratingCounts[rating] || 0) + 1;
      });
    }

    res.status(200).json({
      stats: {
        totalReviews: totalReviews || 0,
        pendingReviews: pendingReviews || 0,
        approvedReviews: approvedReviews || 0,
        avgRating: parseFloat(avgRating),
        ratingDistribution: ratingCounts
      }
    });

  } catch (error) {
    console.error('Get review stats error:', error);
    res.status(500).json({ error: 'Failed to fetch review statistics' });
  }
};

/**
 * Helper: Update employee average rating
 */
const updateEmployeeRating = async (employeeId) => {
  try {
    const { data: reviews } = await supabaseAdmin
      .from('reviews')
      .select('rating')
      .eq('employee_id', employeeId)
      .eq('status', 'approved');

    if (reviews && reviews.length > 0) {
      const avgRating = reviews.reduce((sum, r) => sum + parseFloat(r.rating), 0) / reviews.length;
      
      await supabaseAdmin
        .from('employees')
        .update({ 
          rating: parseFloat(avgRating.toFixed(1)),
          total_reviews: reviews.length
        })
        .eq('id', employeeId);
    }
  } catch (error) {
    console.error('Update employee rating error:', error);
  }
};

/**
 * Helper: Update service average rating
 */
const updateServiceRating = async (serviceId) => {
  try {
    const { data: reviews } = await supabaseAdmin
      .from('reviews')
      .select('rating')
      .eq('service_id', serviceId)
      .eq('status', 'approved');

    if (reviews && reviews.length > 0) {
      const avgRating = reviews.reduce((sum, r) => sum + parseFloat(r.rating), 0) / reviews.length;
      
      await supabaseAdmin
        .from('services')
        .update({ 
          rating: parseFloat(avgRating.toFixed(1)),
          total_reviews: reviews.length
        })
        .eq('id', serviceId);
    }
  } catch (error) {
    console.error('Update service rating error:', error);
  }
};
