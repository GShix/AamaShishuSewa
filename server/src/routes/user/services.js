// server/src/routes/user/services.js
import express from 'express';
import { supabaseAdmin } from '../../config/supabase.js';

const router = express.Router();

// Get all active services (public route)
router.get('/', async (req, res) => {
  try {
    // Query for services where status='active' OR is_active=true
    let query = supabaseAdmin
      .from('services')
      .select('*')
      .order('created_at', { ascending: false });
    
    // Try both status and is_active columns for compatibility
    const { data: services, error } = await query.or('status.eq.active,is_active.eq.true');

    if (error) {
      console.error('Services query error:', error);
      throw error;
    }

    res.json({ services: services || [] });
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ error: 'Failed to fetch services' });
  }
});

// Get service by ID (public route)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabaseAdmin
      .from('services')
      .select('*')
      .eq('id', id)
      .eq('is_active', true)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Service not found' });
      }
      throw error;
    }

    res.json(data);
  } catch (error) {
    console.error('Error fetching service:', error);
    res.status(500).json({ error: 'Failed to fetch service' });
  }
});

export default router;
