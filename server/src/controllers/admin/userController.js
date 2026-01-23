// server/src/controllers/admin/userController.js
import { supabaseAdmin } from '../../config/supabase.js';

export const getAllUsers = async (req, res) => {
  try {
    const { role, status, search, page = 1, limit = 10 } = req.query;
    
    let query = supabaseAdmin
      .from('users')
      .select('id, email, phone, full_name, role, status, created_at, last_login', { count: 'exact' });

    // Filters
    if (role) query = query.eq('role', role);
    if (status) query = query.eq('status', status);
    if (search) {
      query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`);
    }

    // Pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to).order('created_at', { ascending: false });

    const { data: users, error, count } = await query;

    if (error) throw error;

    res.status(200).json({
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};

export const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    if (!['active', 'inactive', 'suspended'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status. Must be: active, inactive, or suspended' });
    }

    // Validate user ID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return res.status(400).json({ error: 'Invalid user ID format' });
    }

    // Check if user exists first
    const { data: existingUser, error: fetchError } = await supabaseAdmin
      .from('users')
      .select('id, email, full_name, status')
      .eq('id', id)
      .single();

    if (fetchError) {
      console.error('Fetch user error:', fetchError);
      if (fetchError.code === 'PGRST116') {
        return res.status(404).json({ error: 'User not found' });
      }
      throw fetchError;
    }

    // Update the status
    const { data: user, error: updateError } = await supabaseAdmin
      .from('users')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('Update error details:', updateError);
      throw updateError;
    }

    res.status(200).json({ 
      message: 'User status updated successfully', 
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        status: user.status,
        updated_at: user.updated_at
      }
    });
  } catch (error) {
    console.error('Update user status error:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint
    });
    res.status(500).json({ 
      error: 'Failed to update user status',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabaseAdmin
      .from('users')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
};
