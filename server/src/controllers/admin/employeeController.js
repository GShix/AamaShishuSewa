// server/src/controllers/admin/employeeController.js
import { supabaseAdmin } from '../../config/supabase.js';

/**
 * Get all employees with optional filters
 * @route GET /api/admin/employees
 * @access Admin, SuperAdmin
 */
export const getAllEmployees = async (req, res) => {
  try {
    const { specialization, status, search, page = 1, limit = 10 } = req.query;

    let query = supabaseAdmin
      .from('employees')
      .select('*', { count: 'exact' });

    // Filters
    if (specialization) query = query.eq('specialization', specialization);
    if (status) query = query.eq('status', status);
    if (search) {
      query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`);
    }

    // Pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to).order('created_at', { ascending: false });

    const { data: employees, error, count } = await query;

    if (error) {
      console.error('Database error fetching employees:', error);
      throw error;
    }

    res.status(200).json({
      employees: employees || [],
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    });
  } catch (error) {
    console.error('Get all employees error:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint
    });
    res.status(500).json({ 
      error: 'Failed to fetch employees',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Create a new employee
 * @route POST /api/admin/employees
 * @access Admin, SuperAdmin
 */
export const createEmployee = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      specialization,
      experience,
      qualification,
      license_number,
      address,
      bio,
      hourly_rate
    } = req.body;

    // Validate required fields
    if (!fullName || !email || !phone || !specialization) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if employee already exists
    const { data: existing } = await supabaseAdmin
      .from('employees')
      .select('id')
      .or(`email.eq.${email},phone.eq.${phone}`)
      .single();

    if (existing) {
      return res.status(409).json({ error: 'Employee already exists with this email or phone' });
    }

    // Create employee
    const { data: employee, error } = await supabaseAdmin
      .from('employees')
      .insert({
        full_name: fullName,
        email,
        phone,
        specialization,
        experience: experience || 0,
        qualification: qualification || '',
        license_number: license_number || '',
        address: address || '',
        bio: bio || '',
        hourly_rate: hourly_rate || 0,
        rating: 0,
        total_reviews: 0,
        status: 'active',
        availability_status: 'available'
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      message: 'Employee created successfully',
      employee
    });
  } catch (error) {
    console.error('Create employee error:', error);
    res.status(500).json({ error: 'Failed to create employee' });
  }
};

/**
 * Update an existing employee
 * @route PUT /api/admin/employees/:id
 * @access Admin, SuperAdmin
 */
export const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Remove fields that shouldn't be updated directly
    delete updateData.id;
    delete updateData.created_at;
    delete updateData.rating;
    delete updateData.total_reviews;

    const { data: employee, error } = await supabaseAdmin
      .from('employees')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.status(200).json({
      message: 'Employee updated successfully',
      employee
    });
  } catch (error) {
    console.error('Update employee error:', error);
    res.status(500).json({ error: 'Failed to update employee' });
  }
};

/**
 * Delete an employee
 * @route DELETE /api/admin/employees/:id
 * @access Admin, SuperAdmin
 */
export const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabaseAdmin
      .from('employees')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.status(200).json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.error('Delete employee error:', error);
    res.status(500).json({ error: 'Failed to delete employee' });
  }
};
