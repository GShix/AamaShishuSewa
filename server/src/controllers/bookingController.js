// server/src/controllers/bookingController.js
import { supabaseAdmin, supabaseHelpers } from '../config/supabase.js';
import { autoAssignProfessional } from '../services/matchingService.js';
import { generateCarePlan, generateNotification } from '../services/carePlanService.js';

/**
 * Create a new booking with AI automation
 */
export const createBooking = async (req, res) => {
  try {
    const userId = req.userId;
    const {
      serviceType,
      bookingDate,
      bookingTime,
      durationDays,
      clientAddress,
      latitude,
      longitude,
      specialRequirements,
      nwaranDetails
    } = req.body;

    // Validate required fields
    if (!serviceType || !bookingDate || !clientAddress || !latitude || !longitude) {
      return res.status(400).json({ 
        error: 'Service type, date, address, and location are required' 
      });
    }

    // Create booking
    const { data: booking, error: bookingError } = await supabaseAdmin
      .from('bookings')
      .insert({
        user_id: userId,
        service_type: serviceType,
        booking_date: bookingDate,
        booking_time: bookingTime,
        duration_days: durationDays || 1,
        client_address: clientAddress,
        latitude,
        longitude,
        special_requirements: specialRequirements,
        status: 'pending'
      })
      .select()
      .single();

    if (bookingError) throw bookingError;

    // If Nwaran service, save additional details
    if (serviceType === 'nwaran' && nwaranDetails) {
      const { error: nwaranError } = await supabaseAdmin
        .from('nwaran_details')
        .insert({
          booking_id: booking.id,
          baby_birth_date: nwaranDetails.babyBirthDate,
          baby_birth_time: nwaranDetails.babyBirthTime,
          baby_gender: nwaranDetails.babyGender,
          parents_gotra: nwaranDetails.parentsGotra,
          preferred_name_suggestions: nwaranDetails.preferredNames,
          priest_required: nwaranDetails.priestRequired,
          ceremony_location: nwaranDetails.ceremonyLocation,
          number_of_guests: nwaranDetails.numberOfGuests,
          additional_rituals: nwaranDetails.additionalRituals
        });

      if (nwaranError) console.error('Nwaran details error:', nwaranError);
    }

    // AI AUTOMATION WORKFLOW
    try {
      // 1. Auto-assign best professional
      const assignmentResult = await autoAssignProfessional(booking.id);
      
      if (assignmentResult.success) {
        booking.professional_id = assignmentResult.professional.id;
        booking.status = 'confirmed';

        // 2. Generate care plan
        await generateCarePlan(booking.id);

        // 3. Send notifications
        await generateNotification(booking.id, 'new_booking');
        await generateNotification(booking.id, 'booking_confirmed');
      }
    } catch (aiError) {
      console.error('AI automation error:', aiError);
      // Continue even if AI features fail
    }

    res.status(201).json({
      message: 'Booking created successfully',
      booking,
      automated: true
    });

  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ error: 'Failed to create booking' });
  }
};

/**
 * Get all bookings for current user
 */
export const getUserBookings = async (req, res) => {
  try {
    const userId = req.userId;

    const { data: bookings, error } = await supabaseAdmin
      .from('bookings')
      .select(`
        *,
        professionals:professional_id (
          id, full_name, phone, rating, specialization
        ),
        nwaran_details (*),
        care_plans (*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({ bookings });

  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
};

/**
 * Get single booking by ID
 */
export const getBookingById = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const userId = req.userId;

    const { data: booking, error } = await supabaseAdmin
      .from('bookings')
      .select(`
        *,
        users:user_id (id, full_name, phone, email, address),
        professionals:professional_id (
          id, full_name, phone, email, rating, 
          specialization, experience_years
        ),
        nwaran_details (*),
        care_plans (*)
      `)
      .eq('id', bookingId)
      .single();

    if (error) throw error;

    // Check authorization
    if (booking.user_id !== userId && req.userRole !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized access' });
    }

    res.json({ booking });

  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({ error: 'Failed to fetch booking' });
  }
};

/**
 * Update booking status
 */
export const updateBookingStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;
    const userId = req.userId;

    const validStatuses = ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    // Get booking to check ownership
    const { data: booking } = await supabaseAdmin
      .from('bookings')
      .select('user_id')
      .eq('id', bookingId)
      .single();

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (booking.user_id !== userId && req.userRole !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Update status
    const { data: updatedBooking, error } = await supabaseAdmin
      .from('bookings')
      .update({ 
        status,
        updated_at: new Date()
      })
      .eq('id', bookingId)
      .select()
      .single();

    if (error) throw error;

    // Send notification on status change
    if (status === 'completed') {
      // Could trigger review request here
    }

    res.json({
      message: 'Booking status updated',
      booking: updatedBooking
    });

  } catch (error) {
    console.error('Update booking error:', error);
    res.status(500).json({ error: 'Failed to update booking' });
  }
};

/**
 * Cancel booking
 */
export const cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const userId = req.userId;
    const { reason } = req.body;

    const { data: booking } = await supabaseAdmin
      .from('bookings')
      .select('user_id, status')
      .eq('id', bookingId)
      .single();

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (booking.user_id !== userId && req.userRole !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    if (booking.status === 'completed') {
      return res.status(400).json({ error: 'Cannot cancel completed booking' });
    }

    const { data: cancelledBooking, error } = await supabaseAdmin
      .from('bookings')
      .update({ 
        status: 'cancelled',
        special_requirements: reason ? `Cancellation reason: ${reason}` : null,
        updated_at: new Date()
      })
      .eq('id', bookingId)
      .select()
      .single();

    if (error) throw error;

    res.json({
      message: 'Booking cancelled successfully',
      booking: cancelledBooking
    });

  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({ error: 'Failed to cancel booking' });
  }
};

export default {
  createBooking,
  getUserBookings,
  getBookingById,
  updateBookingStatus,
  cancelBooking
};