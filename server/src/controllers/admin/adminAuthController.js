// server/src/controllers/admin/adminAuthController.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { supabaseAdmin } from '../../config/supabase.js';

// Generate JWT token for admin
const generateToken = (userId, role) => {
  return jwt.sign(
    { userId, role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// Admin Login
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Find admin user by email from admins table
    const { data: admin, error: fetchError } = await supabaseAdmin
      .from('admins')
      .select('*')
      .eq('email', email)
      .single();

    if (fetchError || !admin) {
      return res.status(401).json({ error: 'Invalid credentials or insufficient permissions' });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, admin.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check if account is active
    if (admin.status && admin.status !== 'active') {
      return res.status(403).json({ error: 'Account is not active. Please contact support.' });
    }

    // Update last login
    await supabaseAdmin
      .from('admins')
      .update({ last_login: new Date().toISOString() })
      .eq('id', admin.id);

    // Generate token
    const token = generateToken(admin.id, admin.role);

    res.status(200).json({
      message: 'Login successful',
      user: {
        id: admin.id,
        email: admin.email,
        fullName: admin.full_name,
        role: admin.role,
        phone: admin.phone,
        status: admin.status,
        profileImage: admin.profile_image
      },
      token
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ error: 'Login failed. Please try again.' });
  }
};

// Admin Register
export const adminRegister = async (req, res) => {
  try {
    const { email, password, fullName, phone, role, secretKey } = req.body;

    // Validate required fields
    if (!email || !password || !fullName || !phone || !role) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Verify secret key for admin registration (security measure)
    const expectedSecretKey = process.env.ADMIN_REGISTRATION_SECRET || 'admin-secret-key-2026';
    if (secretKey !== expectedSecretKey) {
      return res.status(403).json({ error: 'Invalid secret key. Unauthorized admin registration.' });
    }

    // Validate role
    if (!['admin', 'superAdmin'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role. Must be admin or superAdmin' });
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Validate phone format (10 digits)
    if (!/^[0-9]{10}$/.test(phone)) {
      return res.status(400).json({ error: 'Phone number must be 10 digits' });
    }

    // Validate password length
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    // Check if admin already exists
    const { data: existingAdmin } = await supabaseAdmin
      .from('admins')
      .select('id')
      .or(`email.eq.${email},phone.eq.${phone}`)
      .single();

    if (existingAdmin) {
      return res.status(409).json({ error: 'Admin already exists with this email or phone' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create admin user in admins table
    const { data: newAdmin, error } = await supabaseAdmin
      .from('admins')
      .insert({
        email,
        phone,
        password_hash: passwordHash,
        full_name: fullName,
        role: role,
        status: 'active',
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;

    // Generate token
    const token = generateToken(newAdmin.id, newAdmin.role);

    res.status(201).json({
      message: 'Admin registered successfully',
      user: {
        id: newAdmin.id,
        email: newAdmin.email,
        phone: newAdmin.phone,
        fullName: newAdmin.full_name,
        role: newAdmin.role,
        status: newAdmin.status,
        profileImage: newAdmin.profile_image
      },
      token
    });
  } catch (error) {
    console.error('Admin register error:', error);
    res.status(500).json({ error: 'Registration failed. Please try again.' });
  }
};

// Get Admin Profile
export const getAdminProfile = async (req, res) => {
  try {
    const adminId = req.userId;

    const { data: admin, error } = await supabaseAdmin
      .from('admins')
      .select('id, email, full_name, phone, role, status, profile_image, created_at, last_login, updated_at')
      .eq('id', adminId)
      .single();

    if (error || !admin) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    res.status(200).json({
      user: {
        id: admin.id,
        email: admin.email,
        fullName: admin.full_name,
        phone: admin.phone,
        role: admin.role,
        status: admin.status,
        profileImage: admin.profile_image,
        createdAt: admin.created_at,
        lastLogin: admin.last_login,
        updatedAt: admin.updated_at
      }
    });
  } catch (error) {
    console.error('Get admin profile error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};

// Update Admin Profile
export const updateAdminProfile = async (req, res) => {
  try {
    const adminId = req.userId;
    const { fullName, phone, email, profileImage } = req.body;

    const updateData = {};
    if (fullName) updateData.full_name = fullName;
    if (phone) {
      if (!/^[0-9]{10,15}$/.test(phone)) {
        return res.status(400).json({ error: 'Phone number must be 10-15 digits' });
      }
      updateData.phone = phone;
    }
    if (email) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
      }
      updateData.email = email;
    }
    if (profileImage !== undefined) updateData.profile_image = profileImage;

    const { data: updatedAdmin, error } = await supabaseAdmin
      .from('admins')
      .update(updateData)
      .eq('id', adminId)
      .select()
      .single();

    if (error) throw error;

    res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        id: updatedAdmin.id,
        email: updatedAdmin.email,
        fullName: updatedAdmin.full_name,
        phone: updatedAdmin.phone,
        role: updatedAdmin.role,
        profileImage: updatedAdmin.profile_image
      }
    });
  } catch (error) {
    console.error('Update admin profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

// Change Admin Password
export const changeAdminPassword = async (req, res) => {
  try {
    const adminId = req.userId;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current password and new password are required' });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'New password must be at least 8 characters' });
    }

    // Get current admin
    const { data: admin, error: fetchError } = await supabaseAdmin
      .from('admins')
      .select('password_hash')
      .eq('id', adminId)
      .single();

    if (fetchError || !admin) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, admin.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    // Hash new password
    const newPasswordHash = await bcrypt.hash(newPassword, 12);

    // Update password
    const { error: updateError } = await supabaseAdmin
      .from('admins')
      .update({ password_hash: newPasswordHash })
      .eq('id', adminId);

    if (updateError) throw updateError;

    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change admin password error:', error);
    res.status(500).json({ error: 'Failed to change password' });
  }
};
