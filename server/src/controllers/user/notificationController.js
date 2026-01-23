// server/src/controllers/user/notificationController.js
import { supabaseAdmin } from '../../config/supabase.js';

/**
 * Get user notifications
 */
export const getMyNotifications = async (req, res) => {
  try {
    const userId = req.userId;
    const { page = 1, limit = 20, is_read } = req.query;

    let query = supabaseAdmin
      .from('notifications')
      .select('*', { count: 'exact' })
      .eq('user_id', userId);

    // Filter by read status if provided
    if (is_read !== undefined) {
      query = query.eq('is_read', is_read === 'true');
    }

    // Pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to).order('created_at', { ascending: false });

    const { data: notifications, error, count } = await query;

    if (error) throw error;

    // Get unread count
    const { count: unreadCount } = await supabaseAdmin
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('is_read', false);

    res.status(200).json({
      notifications,
      unreadCount: unreadCount || 0,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        totalPages: Math.ceil(count / limit)
      }
    });

  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
};

/**
 * Mark notification as read
 */
export const markAsRead = async (req, res) => {
  try {
    const userId = req.userId;
    const { notificationId } = req.params;

    const { data, error } = await supabaseAdmin
      .from('notifications')
      .update({ 
        is_read: true,
        read_at: new Date().toISOString()
      })
      .eq('id', notificationId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;

    res.status(200).json({
      message: 'Notification marked as read',
      notification: data
    });

  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({ error: 'Failed to mark notification as read' });
  }
};

/**
 * Mark all notifications as read
 */
export const markAllAsRead = async (req, res) => {
  try {
    const userId = req.userId;

    const { error } = await supabaseAdmin
      .from('notifications')
      .update({ 
        is_read: true,
        read_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .eq('is_read', false);

    if (error) throw error;

    res.status(200).json({
      message: 'All notifications marked as read'
    });

  } catch (error) {
    console.error('Mark all as read error:', error);
    res.status(500).json({ error: 'Failed to mark all notifications as read' });
  }
};

/**
 * Delete notification
 */
export const deleteNotification = async (req, res) => {
  try {
    const userId = req.userId;
    const { notificationId } = req.params;

    const { error } = await supabaseAdmin
      .from('notifications')
      .delete()
      .eq('id', notificationId)
      .eq('user_id', userId);

    if (error) throw error;

    res.status(200).json({
      message: 'Notification deleted successfully'
    });

  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({ error: 'Failed to delete notification' });
  }
};

/**
 * Get unread count
 */
export const getUnreadCount = async (req, res) => {
  try {
    const userId = req.userId;

    const { count } = await supabaseAdmin
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('is_read', false);

    res.status(200).json({
      unreadCount: count || 0
    });

  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({ error: 'Failed to get unread count' });
  }
};
