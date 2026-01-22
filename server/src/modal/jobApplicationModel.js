// server/src/modal/jobApplicationModel.js
import { supabaseAdmin } from '../config/supabase.js';

const jobApplicationModel = {
  // Get all applications with optional filters
  async getAll(filters = {}) {
    try {
      let query = supabaseAdmin
        .from('job_applications')
        .select(`
          *,
          jobs:job_id (
            title,
            department,
            location
          )
        `)
        .order('created_at', { ascending: false });

      if (filters.job_id) {
        query = query.eq('job_id', filters.job_id);
      }

      if (filters.user_id) {
        query = query.eq('user_id', filters.user_id);
      }

      if (filters.status) {
        query = query.eq('status', filters.status);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data;
    } catch (error) {
      throw error;
    }
  },

  // Get application by ID
  async getById(id) {
    try {
      const { data, error } = await supabaseAdmin
        .from('job_applications')
        .select(`
          *,
          jobs:job_id (
            title,
            department,
            location,
            employment_type
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw error;
    }
  },

  // Create new application
  async create(applicationData) {
    try {
      const { data, error } = await supabaseAdmin
        .from('job_applications')
        .insert([applicationData])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw error;
    }
  },

  // Update application status
  async updateStatus(id, status, reviewedBy = null) {
    try {
      const updateData = { status };
      if (reviewedBy) {
        updateData.reviewed_by = reviewedBy;
      }

      const { data, error } = await supabaseAdmin
        .from('job_applications')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw error;
    }
  },

  // Delete application
  async delete(id) {
    try {
      const { error } = await supabaseAdmin
        .from('job_applications')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { message: 'Application deleted successfully' };
    } catch (error) {
      throw error;
    }
  },

  // Check if user already applied for a job
  async hasApplied(userId, jobId) {
    try {
      const { data, error } = await supabaseAdmin
        .from('job_applications')
        .select('id')
        .eq('user_id', userId)
        .eq('job_id', jobId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return !!data;
    } catch (error) {
      throw error;
    }
  }
};

export default jobApplicationModel;
