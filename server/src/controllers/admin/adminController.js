// server/src/controllers/admin/adminController.js
import { supabaseAdmin } from '../../config/supabase.js';
import bcrypt from 'bcryptjs';

export const getAllAdmins = async (req, res) => {
  try {
    const { role, status, search, page = 1, limit = 10 } = req.query;

    let query = supabaseAdmin
      .from('admins')
      .select('id, email, phone, full_name, role, status, profile_image, created_at, last_login, updated_at', { count: 'exact' });

    // Filters
    if (role && ['admin', 'superAdmin'].includes(role)) {
      query = query.eq('role', role);
    }
    if (status && ['active', 'inactive', 'suspended'].includes(status)) {
      query = query.eq('status', status);
    }
    if (search) {
      query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`);
    }

    // Pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to).order('created_at', { ascending: false });

    const { data: admins, error, count } = await query;

    if (error) throw error;

    res.status(200).json({
      message: 'Admins retrieved successfully',
      admins,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Get all admins error:', error);
    res.status(500).json({ error: 'Failed to fetch admins' });
  }
};

export const getAdminById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: admin, error } = await supabaseAdmin
      .from('admins')
      .select('id, email, phone, full_name, role, status, profile_image, created_at, last_login, updated_at')
      .eq('id', id)
      .single();

    if (error || !admin) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    res.status(200).json({
      message: 'Admin retrieved successfully',
      admin
    });
  } catch (error) {
    console.error('Get admin by ID error:', error);
    res.status(500).json({ error: 'Failed to fetch admin' });
  }
};

export const createAdmin = async (req, res) => {
  try {
    const { email, password, fullName, phone, role, status = 'active' } = req.body;

    // Validation
    if (!email || !password || !fullName || !phone || !role) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    if (!/^[0-9]{10,15}$/.test(phone)) {
      return res.status(400).json({ error: 'Phone number must be 10-15 digits' });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    if (!['admin', 'superAdmin'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role. Must be admin or superAdmin' });
    }

    // Check if admin already exists
    const { data: existing } = await supabaseAdmin
      .from('admins')
      .select('id')
      .or(`email.eq.${email},phone.eq.${phone}`)
      .single();

    if (existing) {
      return res.status(409).json({ error: 'Admin with this email or phone already exists' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create admin
    const { data: newAdmin, error } = await supabaseAdmin
      .from('admins')
      .insert({
        email,
        password_hash: passwordHash,
        full_name: fullName,
        phone,
        role,
        status,
        created_at: new Date().toISOString()
      })
      .select('id, email, full_name, phone, role, status, created_at')
      .single();

    if (error) throw error;

    res.status(201).json({
      message: 'Admin created successfully',
      admin: newAdmin
    });
  } catch (error) {
    console.error('Create admin error:', error);
    res.status(500).json({ error: 'Failed to create admin' });
  }
};

export const updateAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, phone, email, role, status, profileImage } = req.body;

    // Build update object
    const updateData = {};
    if (fullName !== undefined) updateData.full_name = fullName;
    if (phone !== undefined) {
      if (!/^[0-9]{10,15}$/.test(phone)) {
        return res.status(400).json({ error: 'Phone number must be 10-15 digits' });
      }
      updateData.phone = phone;
    }
    if (email !== undefined) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
      }
      updateData.email = email;
    }
    if (role !== undefined) {
      if (!['admin', 'superAdmin'].includes(role)) {
        return res.status(400).json({ error: 'Invalid role' });
      }
      updateData.role = role;
    }
    if (status !== undefined) {
      if (!['active', 'inactive', 'suspended'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
      }
      updateData.status = status;
    }
    if (profileImage !== undefined) updateData.profile_image = profileImage;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    const { data: updatedAdmin, error } = await supabaseAdmin
      .from('admins')
      .update(updateData)
      .eq('id', id)
      .select('id, email, full_name, phone, role, status, profile_image, updated_at')
      .single();

    if (error) throw error;

    res.status(200).json({
      message: 'Admin updated successfully',
      admin: updatedAdmin
    });
  } catch (error) {
    console.error('Update admin error:', error);
    res.status(500).json({ error: 'Failed to update admin' });
  }
};

export const updateAdminPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({ error: 'New password is required' });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(newPassword, 12);

    const { error } = await supabaseAdmin
      .from('admins')
      .update({ password_hash: passwordHash })
      .eq('id', id);

    if (error) throw error;

    res.status(200).json({ message: 'Admin password updated successfully' });
  } catch (error) {
    console.error('Update admin password error:', error);
    res.status(500).json({ error: 'Failed to update password' });
  }
};

export const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { hardDelete = false } = req.query;

    // Prevent deleting self
    if (id === req.userId) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }

    if (hardDelete === 'true') {
      // Hard delete
      const { error } = await supabaseAdmin
        .from('admins')
        .delete()
        .eq('id', id);

      if (error) throw error;

      res.status(200).json({ message: 'Admin permanently deleted' });
    } else {
      // Soft delete (set status to inactive)
      const { error } = await supabaseAdmin
        .from('admins')
        .update({ status: 'inactive' })
        .eq('id', id);

      if (error) throw error;

      res.status(200).json({ message: 'Admin deactivated successfully' });
    }
  } catch (error) {
    console.error('Delete admin error:', error);
    res.status(500).json({ error: 'Failed to delete admin' });
  }
};

export const getAdminStats = async (req, res) => {
  try {
    const { data: admins, error } = await supabaseAdmin
      .from('admins')
      .select('role, status');

    if (error) throw error;

    const stats = {
      total: admins.length,
      superAdmins: admins.filter(a => a.role === 'superAdmin').length,
      admins: admins.filter(a => a.role === 'admin').length,
      active: admins.filter(a => a.status === 'active').length,
      inactive: admins.filter(a => a.status === 'inactive').length,
      suspended: admins.filter(a => a.status === 'suspended').length
    };

    res.status(200).json({
      message: 'Admin statistics retrieved successfully',
      stats
    });
  } catch (error) {
    console.error('Get admin stats error:', error);
    res.status(500).json({ error: 'Failed to fetch admin statistics' });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    // Get total users
    const { count: totalUsers, error: usersError } = await supabaseAdmin
      .from('users')
      .select('*', { count: 'exact', head: true });

    // Get total bookings
    const { count: totalBookings, error: bookingsError } = await supabaseAdmin
      .from('bookings')
      .select('*', { count: 'exact', head: true });

    // Get total employees (renamed from professionals)
    const { count: totalEmployees, error: employeesError } = await supabaseAdmin
      .from('employees')
      .select('*', { count: 'exact', head: true });

    // Get pending bookings
    const { count: pendingBookings, error: pendingError } = await supabaseAdmin
      .from('bookings')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    // Get recent bookings with proper column references
    const { data: recentBookings, error: recentError } = await supabaseAdmin
      .from('bookings')
      .select(`
        *,
        users!user_id (
          id,
          full_name,
          email
        ),
        employees!employee_id (
          id,
          full_name,
          phone
        )
      `)
      .order('created_at', { ascending: false })
      .limit(5);

    // Log any errors but don't fail the request
    if (usersError) console.error('Users count error:', usersError);
    if (bookingsError) console.error('Bookings count error:', bookingsError);
    if (employeesError) console.error('Employees count error:', employeesError);
    if (pendingError) console.error('Pending bookings error:', pendingError);
    if (recentError) console.error('Recent bookings error:', recentError);

    res.status(200).json({
      stats: {
        totalUsers: totalUsers || 0,
        totalBookings: totalBookings || 0,
        totalEmployees: totalEmployees || 0,
        pendingBookings: pendingBookings || 0
      },
      recentBookings: recentBookings || []
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch dashboard stats',
      stats: {
        totalUsers: 0,
        totalBookings: 0,
        totalEmployees: 0,
        pendingBookings: 0
      },
      recentBookings: []
    });
  }
};
