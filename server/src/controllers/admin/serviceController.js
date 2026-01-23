// server/src/controllers/admin/serviceController.js
import { supabaseAdmin } from '../../config/supabase.js';

export const getAllServices = async (req, res) => {
  try {
    const { category, status } = req.query;

    let query = supabaseAdmin
      .from('services')
      .select('*');

    if (category) query = query.eq('category', category);
    if (status) query = query.eq('status', status);

    query = query.order('created_at', { ascending: false });

    const { data: services, error } = await query;

    if (error) throw error;

    res.status(200).json({ services });
  } catch (error) {
    console.error('Get all services error:', error);
    res.status(500).json({ error: 'Failed to fetch services' });
  }
};

export const createService = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      price,
      duration,
      features
    } = req.body;

    if (!name || !category) {
      return res.status(400).json({ error: 'Name and category are required' });
    }

    const { data: service, error } = await supabaseAdmin
      .from('services')
      .insert({
        name,
        description: description || '',
        category,
        price: price || 0,
        duration: duration || 60,
        features: features || [],
        status: 'active'
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      message: 'Service created successfully',
      service
    });
  } catch (error) {
    console.error('Create service error:', error);
    res.status(500).json({ error: 'Failed to create service' });
  }
};

export const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    delete updateData.id;
    delete updateData.created_at;

    const { data: service, error } = await supabaseAdmin
      .from('services')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.status(200).json({
      message: 'Service updated successfully',
      service
    });
  } catch (error) {
    console.error('Update service error:', error);
    res.status(500).json({ error: 'Failed to update service' });
  }
};

export const deleteService = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabaseAdmin
      .from('services')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.status(200).json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Delete service error:', error);
    res.status(500).json({ error: 'Failed to delete service' });
  }
};
