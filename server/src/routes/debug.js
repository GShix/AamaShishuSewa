// server/src/routes/debug.js
import express from 'express';
import { supabaseAdmin } from '../config/supabase.js';

const router = express.Router();

// Get all services (without filter) for debugging
router.get('/all-services', async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('services')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({
      count: data?.length || 0,
      services: data || [],
      note: 'This shows ALL services regardless of is_active status'
    });
  } catch (error) {
    console.error('Error fetching all services:', error);
    res.status(500).json({ error: 'Failed to fetch services', details: error.message });
  }
});

// Get all jobs (without filter) for debugging
router.get('/all-jobs', async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('jobs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({
      count: data?.length || 0,
      jobs: data || [],
      note: 'This shows ALL jobs regardless of status'
    });
  } catch (error) {
    console.error('Error fetching all jobs:', error);
    res.status(500).json({ error: 'Failed to fetch jobs', details: error.message });
  }
});

export default router;
