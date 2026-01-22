// server/src/routes/user/bookings.js
import express from 'express';
import { authenticate } from '../../middleware/auth.js';
import { supabaseAdmin } from '../../config/supabase.js';

const router = express.Router();

// Get user's bookings
router.get('/my-bookings', authenticate, async (req, res) => {
  try {
    const userId = req.userId;

    const { data: bookings, error } = await supabaseAdmin
      .from('bookings')
      .select(`
        *,
        professionals:employee_id (
          id,
          full_name,
          phone,
          email,
          specialization
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching bookings:', error);
      return res.status(500).json({ error: 'Failed to fetch bookings' });
    }

    res.json({ success: true, bookings: bookings || [] });
  } catch (error) {
    console.error('Error in my-bookings:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create new booking
router.post('/', authenticate, async (req, res) => {
  try {
    const userId = req.userId;
    const {
      service_type,
      booking_date,
      duration_days,
      client_address,
      client_phone,
      special_requirements,
      employee_id
    } = req.body;

    // Validate required fields
    if (!service_type || !booking_date || !duration_days || !client_address || !client_phone) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const { data: booking, error } = await supabaseAdmin
      .from('bookings')
      .insert({
        user_id: userId,
        service_type,
        booking_date,
        duration_days,
        client_address,
        client_phone,
        special_requirements,
        employee_id: employee_id || null,
        status: 'pending',
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating booking:', error);
      return res.status(500).json({ error: 'Failed to create booking' });
    }

    res.status(201).json({ success: true, booking });
  } catch (error) {
    console.error('Error in create booking:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get booking by ID
router.get('/:id', authenticate, async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    const { data: booking, error } = await supabaseAdmin
      .from('bookings')
      .select(`
        *,
        professionals:employee_id (
          id,
          full_name,
          phone,
          email,
          specialization
        )
      `)
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Booking not found' });
      }
      console.error('Error fetching booking:', error);
      return res.status(500).json({ error: 'Failed to fetch booking' });
    }

    res.json({ success: true, booking });
  } catch (error) {
    console.error('Error in get booking:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update booking
router.put('/:id', authenticate, async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;
    const updates = req.body;

    // Check if booking belongs to user
    const { data: existingBooking } = await supabaseAdmin
      .from('bookings')
      .select('id, user_id')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (!existingBooking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const { data: booking, error } = await supabaseAdmin
      .from('bookings')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating booking:', error);
      return res.status(500).json({ error: 'Failed to update booking' });
    }

    res.json({ success: true, booking });
  } catch (error) {
    console.error('Error in update booking:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Cancel booking (soft delete - update status)
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    // Check if booking belongs to user
    const { data: existingBooking } = await supabaseAdmin
      .from('bookings')
      .select('id, user_id, status')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (!existingBooking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (existingBooking.status === 'completed') {
      return res.status(400).json({ error: 'Cannot cancel completed booking' });
    }

    const { data: booking, error } = await supabaseAdmin
      .from('bookings')
      .update({ status: 'cancelled' })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error cancelling booking:', error);
      return res.status(500).json({ error: 'Failed to cancel booking' });
    }

    res.json({ success: true, booking });
  } catch (error) {
    console.error('Error in cancel booking:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
