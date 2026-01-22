// server/src/controllers/admin/bookingController.js
import { supabaseAdmin } from '../../config/supabase.js';

/**
 * Get all bookings with optional filters
 * @route GET /api/admin/bookings
 * @access Admin, SuperAdmin
 */
export const getAllBookings = async (req, res) => {
  try {
    const { status, service, search, page = 1, limit = 10 } = req.query;

    let query = supabaseAdmin
      .from('bookings')
      .select(`
        *,
        users!bookings_user_id_fkey(id, full_name, email, phone),
        employees!bookings_employee_id_fkey(id, full_name, specialization)
      `, { count: 'exact' });

    // Filters
    if (status) query = query.eq('status', status);
    if (service) query = query.eq('service_type', service);
    if (search) {
      query = query.or(`booking_id.ilike.%${search}%`);
    }

    // Pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to).order('created_at', { ascending: false });

    const { data: bookings, error, count } = await query;

    if (error) throw error;

    res.status(200).json({
      bookings,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Get all bookings error:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
};

/**
 * Update booking status
 * @route PUT /api/admin/bookings/:id/status
 * @access Admin, SuperAdmin
 */
export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const validStatuses = ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const updateData = { status };
    if (notes) updateData.admin_notes = notes;

    const { data: booking, error } = await supabaseAdmin
      .from('bookings')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.status(200).json({ message: 'Booking status updated', booking });
  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({ error: 'Failed to update booking status' });
  }
};

/**
 * Delete a booking
 * @route DELETE /api/admin/bookings/:id
 * @access Admin, SuperAdmin
 */
export const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabaseAdmin
      .from('bookings')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.status(200).json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error('Delete booking error:', error);
    res.status(500).json({ error: 'Failed to delete booking' });
  }
};
