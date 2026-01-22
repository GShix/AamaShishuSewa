// server/src/modal/jobModel.js
import { supabaseAdmin } from '../config/supabase.js';

const jobModel = {
  // Get all jobs with optional filters
  async getAll(filters = {}) {
    try {
      let query = supabaseAdmin
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false });

      if (filters.status) {
        query = query.eq('status', filters.status);
      }

      if (filters.department) {
        query = query.eq('department', filters.department);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data;
    } catch (error) {
      throw error;
    }
  },

  // Get job by ID
  async getById(id) {
    try {
      const { data, error } = await supabaseAdmin
        .from('jobs')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw error;
    }
  },

  // Create new job
  async create(jobData) {
    try {
      const { data, error } = await supabaseAdmin
        .from('jobs')
        .insert([jobData])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw error;
    }
  },

  // Update job
  async update(id, jobData) {
    try {
      const { data, error } = await supabaseAdmin
        .from('jobs')
        .update(jobData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw error;
    }
  },

  // Delete job
  async delete(id) {
    try {
      const { error } = await supabaseAdmin
        .from('jobs')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { message: 'Job deleted successfully' };
    } catch (error) {
      throw error;
    }
  },

  // Get job applications for a specific job
  async getApplications(jobId) {
    try {
      const { data, error } = await supabaseAdmin
        .from('job_applications')
        .select('*')
        .eq('job_id', jobId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      throw error;
    }
  }
};

export default jobModel;
