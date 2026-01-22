// server/src/config/supabase.js
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn('⚠️  Warning: Missing Supabase environment variables. Please check your .env file.');
  console.warn(`SUPABASE_URL: ${supabaseUrl ? 'Set' : 'Missing'}`);
  console.warn(`SUPABASE_SERVICE_ROLE_KEY: ${supabaseServiceKey ? 'Set' : 'Missing'}`);
}

// Admin client with service role (full access - bypass RLS)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

export const supabaseHelpers = {
  /**
   * Fetch a single row by a specific column value
   */
  async findOne(table, column, value) {
    const { data, error } = await supabaseAdmin
      .from(table)
      .select('*')
      .eq(column, value)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "no rows found"
    return data;
  },

  /**
   * Insert a record and return the created data
   */
  async create(table, payload) {
    const { data, error } = await supabaseAdmin
      .from(table)
      .insert([payload])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  /**
   * Update records by ID
   */
  async updateById(table, id, payload) {
    const { data, error } = await supabaseAdmin
      .from(table)
      .update(payload)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return data;
  }
};

// Public client with anon key (RLS enforced)
export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get user by ID
 */
export const getUserById = async (userId) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Get user error:', error);
    return null;
  }
};

/**
 * Get user by email or phone
 */
export const getUserByIdentifier = async (identifier) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .or(`email.eq.${identifier},phone.eq.${identifier}`)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Get user by identifier error:', error);
    return null;
  }
};

/**
 * Get employee by ID
 */
export const getEmployeeById = async (empId) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('employees')
      .select('*')
      .eq('id', empId)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Get employee error:', error);
    return null;
  }
};

/**
 * Get booking by ID with all relations
 */
export const getBookingById = async (bookingId) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('bookings')
      .select(`
        *,
        users:user_id (
          id, full_name, email, phone, address
        ),
        employees:employee_id (
          id, full_name, phone, email, rating, 
          specialization, experience_years, bio
        ),
        nwaran_details (*),
        care_plans (*)
      `)
      .eq('id', bookingId)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Get booking error:', error);
    return null;
  }
};

export const getAvailableEmployees = async (serviceType, latitude, longitude, radius = 15) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('employees')
      .select('*')
      .contains('specialization', [serviceType])
      .eq('verification_status', 'verified')
      .eq('availability_status', 'available');
    
    if (error) throw error;
    
    // Filter by distance (Haversine formula)
    const filtered = data.filter(emp => {
      const distance = calculateDistance(
        latitude, 
        longitude,
        emp.latitude, 
        emp.longitude
      );
      return distance <= radius;
    });
    
    return filtered;
  } catch (error) {
    console.error('Get available employees error:', error);
    return [];
  }
};

/**
 * Get all employees (for admin)
 */
export const getAllEmployees = async () => {
  try {
    const { data, error } = await supabaseAdmin
      .from('employees')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Get all employees error:', error);
    return [];
  }
};

/**
 * Get user bookings
 */
export const getUserBookings = async (userId) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('bookings')
      .select(`
        *,
        employees:employee_id (
          id, full_name, phone, rating, specialization
        ),
        nwaran_details (*),
        care_plans (*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Get user bookings error:', error);
    return [];
  }
};

/**
 * Get employee bookings
 */
export const getEmployeeBookings = async (employeeId) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('bookings')
      .select(`
        *,
        users:user_id (
          id, full_name, phone, address
        ),
        nwaran_details (*)
      `)
      .eq('employee_id', employeeId)
      .order('booking_date', { ascending: true });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Get employee bookings error:', error);
    return [];
  }
};

/**
 * Get conflicting bookings for an employee on a specific date
 */
export const getConflictingBookings = async (employeeId, bookingDate) => {
  try {
    const dateStr = new Date(bookingDate).toISOString().split('T')[0];
    
    const { data, error } = await supabaseAdmin
      .from('bookings')
      .select('id, booking_date, status')
      .eq('employee_id', employeeId)
      .eq('booking_date', dateStr)
      .in('status', ['confirmed', 'in_progress']);
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Get conflicting bookings error:', error);
    return [];
  }
};

/**
 * Update booking status
 */
export const updateBookingStatus = async (bookingId, status) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('bookings')
      .update({ 
        status,
        updated_at: new Date()
      })
      .eq('id', bookingId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Update booking status error:', error);
    return null;
  }
};

/**
 * Assign employee to booking
 */
export const assignEmployeeToBooking = async (bookingId, employeeId) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('bookings')
      .update({ 
        employee_id: employeeId,
        status: 'confirmed',
        updated_at: new Date()
      })
      .eq('id', bookingId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Assign employee error:', error);
    return null;
  }
};

/**
 * Create care plan
 */
export const createCarePlan = async (bookingId, planData) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('care_plans')
      .insert({
        booking_id: bookingId,
        plan_content: planData.planContent,
        diet_recommendations: planData.dietRecommendations,
        exercise_suggestions: planData.exerciseSuggestions,
        mental_health_tips: planData.mentalHealthTips,
        cultural_practices: planData.culturalPractices,
        massage_schedule: planData.massageSchedule,
        generated_by: planData.generatedBy || 'ai',
        language: planData.language || 'ne'
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Create care plan error:', error);
    return null;
  }
};

/**
 * Get care plan for booking
 */
export const getCarePlan = async (bookingId) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('care_plans')
      .select('*')
      .eq('booking_id', bookingId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows
    return data;
  } catch (error) {
    console.error('Get care plan error:', error);
    return null;
  }
};

// ============================================================================
// DISTANCE CALCULATION (Haversine Formula)
// 
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return distance;
};

/**
 * Convert degrees to radians
 */
const toRad = (degrees) => {
  return degrees * (Math.PI / 180);
};

// ============================================================================
// STATISTICS & ANALYTICS
// ============================================================================

/**
 * Get dashboard statistics
 */
export const getDashboardStats = async () => {
  try {
    // Total users
    const { count: totalUsers } = await supabaseAdmin
      .from('users')
      .select('*', { count: 'exact', head: true });
    
    // Total employees
    const { count: totalEmployees } = await supabaseAdmin
      .from('employees')
      .select('*', { count: 'exact', head: true })
      .eq('verification_status', 'verified');
    
    // Total bookings
    const { count: totalBookings } = await supabaseAdmin
      .from('bookings')
      .select('*', { count: 'exact', head: true });
    
    // Pending bookings
    const { count: pendingBookings } = await supabaseAdmin
      .from('bookings')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');
    
    // Completed bookings
    const { count: completedBookings } = await supabaseAdmin
      .from('bookings')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'completed');
    
    return {
      totalUsers: totalUsers || 0,
      totalEmployees: totalEmployees || 0,
      totalBookings: totalBookings || 0,
      pendingBookings: pendingBookings || 0,
      completedBookings: completedBookings || 0
    };
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    return {
      totalUsers: 0,
      totalEmployees: 0,
      totalBookings: 0,
      pendingBookings: 0,
      completedBookings: 0
    };
  }
};


// Backward compatibility aliases (deprecated - use employee versions)
export const getProfessionalById = getEmployeeById;
export const getAvailableProfessionals = getAvailableEmployees;
export const getAllProfessionals = getAllEmployees;
export const getProfessionalBookings = getEmployeeBookings;
export const assignProfessionalToBooking = assignEmployeeToBooking;

export default {
  supabaseAdmin,
  supabaseClient,
  getUserById,
  getUserByIdentifier,
  getEmployeeById,
  getBookingById,
  getAvailableEmployees,
  getAllEmployees,
  getUserBookings,
  getEmployeeBookings,
  getConflictingBookings,
  updateBookingStatus,
  assignEmployeeToBooking,
  createCarePlan,
  getCarePlan,
  calculateDistance,
  getDashboardStats,
  // Backward compatibility (deprecated)
  getProfessionalById,
  getAvailableProfessionals,
  getAllProfessionals,
  getProfessionalBookings,
  assignProfessionalToBooking
};