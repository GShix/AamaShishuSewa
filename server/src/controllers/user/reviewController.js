// server/src/controllers/user/reviewController.js
import { supabaseAdmin } from '../../config/supabase.js';

/**
 * Create a new review for a completed booking
 */
export const createReview = async (req, res) => {
  try {
    const userId = req.userId;
    const {
      booking_id,
      rating,
      review_text,
      images
    } = req.body;

    // Validate required fields
    if (!booking_id || !rating) {
      return res.status(400).json({ 
        error: 'Booking ID and rating are required' 
      });
    }

    // Validate rating range
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ 
        error: 'Rating must be between 1 and 5' 
      });
    }

    // Verify booking exists and belongs to user
    const { data: booking, error: bookingError } = await supabaseAdmin
      .from('bookings')
      .select('id, user_id, service_id, employee_id, status')
      .eq('id', booking_id)
      .eq('user_id', userId)
      .single();

    if (bookingError || !booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Check if booking is completed
    if (booking.status !== 'completed') {
      return res.status(400).json({ 
        error: 'You can only review completed bookings' 
      });
    }

    // Check if review already exists
    const { data: existingReview } = await supabaseAdmin
      .from('reviews')
      .select('id')
      .eq('booking_id', booking_id)
      .single();

    if (existingReview) {
      return res.status(409).json({ 
        error: 'You have already reviewed this booking' 
      });
    }

    // Create review
    const { data: review, error: reviewError } = await supabaseAdmin
      .from('reviews')
      .insert({
        user_id: userId,
        booking_id,
        service_id: booking.service_id,
        employee_id: booking.employee_id,
        rating,
        review_text: review_text || null,
        images: images || [],
        is_verified: true, // Auto-verify since booking is completed
        status: 'pending' // Admin will approve
      })
      .select(`
        *,
        users:user_id (full_name, profile_image),
        services:service_id (name),
        employees:employee_id (full_name)
      `)
      .single();

    if (reviewError) {
      console.error('Review creation error:', reviewError);
      throw reviewError;
    }

    // Update employee average rating (if employee_id exists)
    if (booking.employee_id) {
      await updateEmployeeRating(booking.employee_id);
    }

    // Update service average rating
    if (booking.service_id) {
      await updateServiceRating(booking.service_id);
    }

    res.status(201).json({
      message: 'Review submitted successfully',
      review
    });

  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({ error: error.message || 'Failed to create review' });
  }
};

/**
 * Get all reviews (with filtering)
 */
export const getReviews = async (req, res) => {
  try {
    const { service_id, employee_id, status, rating, page = 1, limit = 10 } = req.query;

    let query = supabaseAdmin
      .from('reviews')
      .select(`
        *,
        users:user_id (full_name, profile_image),
        services:service_id (name),
        employees:employee_id (full_name)
      `, { count: 'exact' });

    // Filters
    if (service_id) {
      query = query.eq('service_id', service_id);
    }
    if (employee_id) {
      query = query.eq('employee_id', employee_id);
    }
    if (status) {
      query = query.eq('status', status);
    } else {
      // Default: only show approved reviews
      query = query.eq('status', 'approved');
    }
    if (rating) {
      query = query.eq('rating', parseFloat(rating));
    }

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
    console.error('Get reviews error:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
};

/**
 * Get my reviews (user's own reviews)
 */
export const getMyReviews = async (req, res) => {
  try {
    const userId = req.userId;

    const { data: reviews, error } = await supabaseAdmin
      .from('reviews')
      .select(`
        *,
        services:service_id (name),
        employees:employee_id (full_name, phone),
        bookings:booking_id (booking_date, duration_days)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.status(200).json({ reviews });

  } catch (error) {
    console.error('Get my reviews error:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
};

/**
 * Update a review (user can edit pending reviews)
 */
export const updateReview = async (req, res) => {
  try {
    const userId = req.userId;
    const { reviewId } = req.params;
    const { rating, review_text, images } = req.body;

    // Verify review exists and belongs to user
    const { data: review, error: fetchError } = await supabaseAdmin
      .from('reviews')
      .select('id, user_id, status')
      .eq('id', reviewId)
      .eq('user_id', userId)
      .single();

    if (fetchError || !review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    // Only allow editing pending reviews
    if (review.status !== 'pending') {
      return res.status(400).json({ 
        error: 'You can only edit pending reviews' 
      });
    }

    // Build update object
    const updateData = { updated_at: new Date().toISOString() };
    if (rating !== undefined) {
      if (rating < 1 || rating > 5) {
        return res.status(400).json({ error: 'Rating must be between 1 and 5' });
      }
      updateData.rating = rating;
    }
    if (review_text !== undefined) updateData.review_text = review_text;
    if (images !== undefined) updateData.images = images;

    // Update review
    const { data: updatedReview, error: updateError } = await supabaseAdmin
      .from('reviews')
      .update(updateData)
      .eq('id', reviewId)
      .select()
      .single();

    if (updateError) throw updateError;

    res.status(200).json({
      message: 'Review updated successfully',
      review: updatedReview
    });

  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({ error: 'Failed to update review' });
  }
};

/**
 * Delete a review (user can delete pending reviews)
 */
export const deleteReview = async (req, res) => {
  try {
    const userId = req.userId;
    const { reviewId } = req.params;

    // Verify review exists and belongs to user
    const { data: review, error: fetchError } = await supabaseAdmin
      .from('reviews')
      .select('id, user_id, status')
      .eq('id', reviewId)
      .eq('user_id', userId)
      .single();

    if (fetchError || !review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    // Only allow deleting pending reviews
    if (review.status !== 'pending') {
      return res.status(400).json({ 
        error: 'You can only delete pending reviews' 
      });
    }

    // Delete review
    const { error: deleteError } = await supabaseAdmin
      .from('reviews')
      .delete()
      .eq('id', reviewId);

    if (deleteError) throw deleteError;

    res.status(200).json({ message: 'Review deleted successfully' });

  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({ error: 'Failed to delete review' });
  }
};

/**
 * Check if user can review a booking
 */
export const canReviewBooking = async (req, res) => {
  try {
    const userId = req.userId;
    const { bookingId } = req.params;

    // Check if booking exists and belongs to user
    const { data: booking, error: bookingError } = await supabaseAdmin
      .from('bookings')
      .select('id, status')
      .eq('id', bookingId)
      .eq('user_id', userId)
      .single();

    if (bookingError || !booking) {
      return res.status(404).json({ 
        canReview: false, 
        reason: 'Booking not found' 
      });
    }

    // Check if booking is completed
    if (booking.status !== 'completed') {
      return res.status(200).json({ 
        canReview: false, 
        reason: 'Booking not completed yet' 
      });
    }

    // Check if review already exists
    const { data: existingReview } = await supabaseAdmin
      .from('reviews')
      .select('id')
      .eq('booking_id', bookingId)
      .single();

    if (existingReview) {
      return res.status(200).json({ 
        canReview: false, 
        reason: 'Already reviewed' 
      });
    }

    res.status(200).json({ 
      canReview: true 
    });

  } catch (error) {
    console.error('Can review booking error:', error);
    res.status(500).json({ error: 'Failed to check review eligibility' });
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
