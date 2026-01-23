// server/src/routes/user/posts.js
import express from 'express';
import { supabaseAdmin } from '../../config/supabase.js';

const router = express.Router();

// Get all published posts (public)
router.get('/', async (req, res) => {
  try {
    const { category, limit = 50 } = req.query;

    let query = supabaseAdmin
      .from('posts')
      .select('*')
      .eq('published', true);

    if (category) {
      query = query.eq('category', category);
    }

    query = query
      .order('published_at', { ascending: false })
      .limit(parseInt(limit));

    const { data: posts, error } = await query;

    if (error) throw error;

    res.status(200).json({ posts: posts || [] });
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// Get single post by ID (public)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data: post, error } = await supabaseAdmin
      .from('posts')
      .select('*')
      .eq('id', id)
      .eq('published', true)
      .single();

    if (error) throw error;

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Increment view count
    await supabaseAdmin
      .from('posts')
      .update({ views: (post.views || 0) + 1 })
      .eq('id', id);

    res.status(200).json({ post });
  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({ error: 'Failed to fetch post' });
  }
});

export default router;
