// server/src/controllers/authController.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sendOTP } from '../services/notificationService.js';
import { supabaseAdmin } from '../config/supabase.js';

// Generate JWT token
const generateToken = (userId, role) => {
  return jwt.sign(
    { userId, role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Hash OTP for secure storage
const hashOTP = async (otp) => {
  return await bcrypt.hash(otp, 10);
};

// Register new user (Mother/Client)
export const register = async (req, res) => {
  try {
    const { email, phone, password, fullName, address, latitude, longitude } = req.body;

    // Validate required fields
    if (!email || !phone || !password || !fullName) {
      return res.status(400).json({ error: 'All fields are required' });
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
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Check if user already exists
    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('id')
      .or(`email.eq.${email},phone.eq.${phone}`)
      .single();

    if (existingUser) {
      return res.status(409).json({ error: 'User already exists with this email or phone' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user
    const { data: newUser, error } = await supabaseAdmin
      .from('users')
      .insert({
        email,
        phone,
        password_hash: passwordHash,
        full_name: fullName,
        address,
        latitude: latitude || 27.7172,
        longitude: longitude || 85.3240,
        role: 'client'
      })
      .select()
      .single();

    if (error) throw error;

    // Generate token
    const token = generateToken(newUser.id, newUser.role);

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser.id,
        email: newUser.email,
        phone: newUser.phone,
        fullName: newUser.full_name,
        role: newUser.role,
        address: newUser.address
      },
      token
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Registration failed. Please try again.' });
  }
};

// Login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user by email or phone
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .or(`email.eq.${email},phone.eq.${email}`)
      .single();

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check if account is active
    if (!user.is_active) {
      return res.status(403).json({ error: 'Account is deactivated. Please contact support.' });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user.id, user.role);

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        fullName: user.full_name,
        role: user.role,
        address: user.address,
        profilePhoto: user.profile_photo_url
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed. Please try again.' });
  }
};

// Get current user profile
export const getProfile = async (req, res) => {
  try {
    const userId = req.userId;

    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('id, email, phone, full_name, address, latitude, longitude, role, profile_photo_url, created_at')
      .eq('id', userId)
      .single();

    if (error) throw error;

    res.json({ 
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        fullName: user.full_name,
        address: user.address,
        latitude: user.latitude,
        longitude: user.longitude,
        role: user.role,
        profilePhoto: user.profile_photo_url,
        createdAt: user.created_at
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};

// Update user profile
export const updateProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { fullName, address, latitude, longitude, profilePhoto } = req.body;

    const updateData = {
      updated_at: new Date()
    };

    if (fullName) updateData.full_name = fullName;
    if (address) updateData.address = address;
    if (latitude) updateData.latitude = latitude;
    if (longitude) updateData.longitude = longitude;
    if (profilePhoto) updateData.profile_photo_url = profilePhoto;

    const { data: updatedUser, error } = await supabaseAdmin
      .from('users')
      .update(updateData)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        phone: updatedUser.phone,
        fullName: updatedUser.full_name,
        address: updatedUser.address,
        latitude: updatedUser.latitude,
        longitude: updatedUser.longitude,
        profilePhoto: updatedUser.profile_photo_url
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

// Forgot Password - Send OTP
export const forgotPassword = async (req, res) => {
// Replace this section:
if (isEmail) {
  console.log(`Email OTP to ${email}: ${otp}`);
  // await sendEmailOTP(email, otp, user.full_name);
} else {
  console.log(`SMS OTP to ${email}: ${otp}`);
  // await sendSMSOTP(email, otp);
}

// With this:

// Then in forgotPassword:
if (isEmail) {
  await sendOTP(email, otp, user.full_name);
} else {
  await sendOTP(email, otp);
}
};

// Verify OTP
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ error: 'email and OTP are required' });
    }

    // Validate OTP format
    if (!/^[0-9]{6}$/.test(otp)) {
      return res.status(400).json({ error: 'Invalid OTP format' });
    }

    // Find user
    const { data: user } = await supabaseAdmin
      .from('users')
      .select('id')
      .or(`email.eq.${email},phone.eq.${email}`)
      .single();

    if (!user) {
      return res.status(404).json({ error: 'Account not found' });
    }

    // Get stored OTP
    const { data: otpData } = await supabaseAdmin
      .from('password_reset_otps')
      .select('otp_hash, expires_at')
      .eq('user_id', user.id)
      .single();

    if (!otpData) {
      return res.status(400).json({ error: 'No OTP request found. Please request a new OTP.' });
    }

    // Check if OTP expired
    if (new Date() > new Date(otpData.expires_at)) {
      // Delete expired OTP
      await supabaseAdmin
        .from('password_reset_otps')
        .delete()
        .eq('user_id', user.id);
      
      return res.status(400).json({ error: 'OTP has expired. Please request a new one.' });
    }

    // Verify OTP
    const isValid = await bcrypt.compare(otp, otpData.otp_hash);
    
    if (!isValid) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    res.json({ message: 'OTP verified successfully' });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ error: 'Failed to verify OTP. Please try again.' });
  }
};

// Reset Password
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Validate password
    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Find user
    const { data: user } = await supabaseAdmin
      .from('users')
      .select('id')
      .or(`email.eq.${email},phone.eq.${email}`)
      .single();

    if (!user) {
      return res.status(404).json({ error: 'Account not found' });
    }

    // Get stored OTP
    const { data: otpData } = await supabaseAdmin
      .from('password_reset_otps')
      .select('otp_hash, expires_at')
      .eq('user_id', user.id)
      .single();

    if (!otpData) {
      return res.status(400).json({ error: 'No OTP request found. Please request a new OTP.' });
    }

    // Check if OTP expired
    if (new Date() > new Date(otpData.expires_at)) {
      await supabaseAdmin
        .from('password_reset_otps')
        .delete()
        .eq('user_id', user.id);
      
      return res.status(400).json({ error: 'OTP has expired. Please request a new one.' });
    }

    // Verify OTP
    const isValid = await bcrypt.compare(otp, otpData.otp_hash);
    
    if (!isValid) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(newPassword, 12);

    // Update password
    const { error: updateError } = await supabaseAdmin
      .from('users')
      .update({ 
        password_hash: passwordHash,
        updated_at: new Date()
      })
      .eq('id', user.id);

    if (updateError) throw updateError;

    // Delete used OTP
    await supabaseAdmin
      .from('password_reset_otps')
      .delete()
      .eq('user_id', user.id);

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Failed to reset password. Please try again.' });
  }
};

// Change Password (for logged-in users)
export const changePassword = async (req, res) => {
  try {
    const userId = req.userId;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters' });
    }

    // Get user
    const { data: user } = await supabaseAdmin
      .from('users')
      .select('password_hash')
      .eq('id', userId)
      .single();

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify current password
    const isValid = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isValid) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(newPassword, 12);

    // Update password
    const { error } = await supabaseAdmin
      .from('users')
      .update({ 
        password_hash: passwordHash,
        updated_at: new Date()
      })
      .eq('id', userId);

    if (error) throw error;

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Failed to change password. Please try again.' });
  }
};

export default { 
  register, 
  login, 
  getProfile, 
  updateProfile, 
  forgotPassword, 
  verifyOTP, 
  resetPassword,
  changePassword
};