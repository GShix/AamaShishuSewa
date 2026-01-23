// server/src/controllers/user/bookingController.js
import { supabaseAdmin } from '../../config/supabase.js';
import { notifyBookingCreated } from '../../services/enhancedNotificationService.js';

/**
 * Create a new booking for a service
 */
export const createBooking = async (req, res) => {
  try {
    const userId = req.userId;
    const {
      service_id,
      service_type,
      booking_date,
      duration_days,
      client_address,
      client_phone,
      special_requirements
    } = req.body;

    // Validate required fields
    if (!service_type || !booking_date || !client_address || !client_phone) {
      return res.status(400).json({ 
        error: 'Service type, booking date, address, and phone are required' 
      });
    }

    // Validate booking date is not in the past
    const bookingDate = new Date(booking_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (bookingDate < today) {
      return res.status(400).json({ 
        error: 'Booking date cannot be in the past' 
      });
    }

    // If service_id is provided, verify the service exists and is active
    if (service_id) {
      const { data: service, error: serviceError } = await supabaseAdmin
        .from('services')
        .select('id, name, base_price, status, is_active')
        .eq('id', service_id)
        .single();

      if (serviceError || !service) {
        return res.status(404).json({ error: 'Service not found' });
      }

      if (service.status !== 'active' && !service.is_active) {
        return res.status(400).json({ error: 'Service is not available for booking' });
      }
    }

    // Create booking
    const { data: booking, error: bookingError } = await supabaseAdmin
      .from('bookings')
      .insert({
        user_id: userId,
        service_id: service_id || null,
        service_type,
        booking_date,
        duration_days: duration_days || 1,
        client_address,
        client_phone,
        special_requirements: special_requirements || null,
        status: 'pending',
        payment_status: 'pending'
      })
      .select()
      .single();

    if (bookingError) {
      console.error('Booking creation error:', bookingError);
      throw bookingError;
    }

    // Get user details for notification
    const { data: user } = await supabaseAdmin
      .from('users')
      .select('id, email, phone, full_name')
      .eq('id', userId)
      .single();

    // Get service details for notification (if service_id provided)
    let serviceDetails = null;
    if (service_id) {
      const { data: serviceData } = await supabaseAdmin
        .from('services')
        .select('id, name, description')
        .eq('id', service_id)
        .single();
      serviceDetails = serviceData;
    }

    // Send booking created notification (async, don't wait)
    if (user) {
      notifyBookingCreated(booking, user, serviceDetails).catch(err => {
        console.error('Failed to send booking notification:', err);
      });
    }

    res.status(201).json({
      message: 'Booking created successfully',
      booking
    });

  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ error: error.message || 'Failed to create booking' });
  }
};

/**
 * Get all bookings for the logged-in user
 */
export const getMyBookings = async (req, res) => {
  try {
    const userId = req.userId;

    const { data: bookings, error } = await supabaseAdmin
      .from('bookings')
      .select(`
        *,
        services:service_id (
          id, name, name_ne, description, description_ne, base_price, category
        ),
        employees:employee_id (
          id, full_name, phone, rating, specialization
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Get bookings error:', error);
      throw error;
    }

    res.json({ bookings: bookings || [] });

  } catch (error) {
    console.error('Get my bookings error:', error);
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
        services:service_id (
          id, name, name_ne, description, description_ne, base_price
        ),
        employees:employee_id (
          id, full_name, phone, email, rating, specialization
        )
      `)
      .eq('id', bookingId)
      .single();

    if (error) throw error;

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Check authorization
    if (booking.user_id !== userId) {
      return res.status(403).json({ error: 'Unauthorized access' });
    }

    res.json({ booking });

  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({ error: 'Failed to fetch booking' });
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

    if (booking.user_id !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    if (booking.status === 'completed') {
      return res.status(400).json({ error: 'Cannot cancel completed booking' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ error: 'Booking is already cancelled' });
    }

    const { data: cancelledBooking, error } = await supabaseAdmin
      .from('bookings')
      .update({ 
        status: 'cancelled',
        updated_at: new Date().toISOString()
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
  getMyBookings,
  getBookingById,
  cancelBooking
};
