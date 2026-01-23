// server/src/controllers/admin/noticeController.js
import { supabaseAdmin } from '../../config/supabase.js';

export const getAllNotices = async (req, res) => {
  try {
    const { status, type } = req.query;

    let query = supabaseAdmin
      .from('notices')
      .select('*');

    if (status) query = query.eq('status', status);
    if (type) query = query.eq('type', type);

    query = query.order('created_at', { ascending: false });

    const { data: notices, error } = await query;

    if (error) throw error;

    res.status(200).json({ notices });
  } catch (error) {
    console.error('Get all notices error:', error);
    res.status(500).json({ error: 'Failed to fetch notices' });
  }
};

export const createNotice = async (req, res) => {
  try {
    const {
      title,
      content,
      type,
      priority,
      target_audience
    } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    const { data: notice, error } = await supabaseAdmin
      .from('notices')
      .insert({
        title,
        content,
        type: type || 'general',
        priority: priority || 'medium',
        target_audience: target_audience || 'all',
        status: 'active',
        created_by: req.userId
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      message: 'Notice created successfully',
      notice
    });
  } catch (error) {
    console.error('Create notice error:', error);
    res.status(500).json({ error: 'Failed to create notice' });
  }
};

export const updateNotice = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    delete updateData.id;
    delete updateData.created_at;
    delete updateData.created_by;

    const { data: notice, error } = await supabaseAdmin
      .from('notices')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.status(200).json({
      message: 'Notice updated successfully',
      notice
    });
  } catch (error) {
    console.error('Update notice error:', error);
    res.status(500).json({ error: 'Failed to update notice' });
  }
};

export const deleteNotice = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabaseAdmin
      .from('notices')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.status(200).json({ message: 'Notice deleted successfully' });
  } catch (error) {
    console.error('Delete notice error:', error);
    res.status(500).json({ error: 'Failed to delete notice' });
  }
};
