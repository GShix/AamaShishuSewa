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
      .select('id, title, content, excerpt, category, priority, tags, image_type, image_url, published, author_id, views, created_at, updated_at, published_at')
      .eq('published', true);

    if (category) {
      query = query.eq('category', category);
    }

    query = query
      .order('published_at', { ascending: false })
      .limit(parseInt(limit));

    const { data: posts, error } = await query;

    if (error) throw error;

    // Add image URL for posts with image_data
    const postsWithImageUrls = posts.map(post => ({
      ...post,
      has_image: !!post.image_type,
      image_preview_url: post.image_type ? `/api/posts/${post.id}/image` : post.image_url
    }));

    res.status(200).json({ posts: postsWithImageUrls });
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

// Get post image (public)
router.get('/:id/image', async (req, res) => {
  try {
    const { id } = req.params;

    const { data: post, error } = await supabaseAdmin
      .from('posts')
      .select('image_data, image_type')
      .eq('id', id)
      .single();

    if (error) throw error;

    if (!post || !post.image_data) {
      return res.status(404).json({ error: 'Image not found' });
    }

    // Convert base64 string back to binary buffer
    const imageBuffer = Buffer.from(post.image_data, 'base64');

    // Set content type and send binary data
    res.set('Content-Type', post.image_type || 'image/jpeg');
    res.set('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year
    res.send(imageBuffer);
  } catch (error) {
    console.error('Get post image error:', error);
    res.status(500).json({ error: 'Failed to retrieve image' });
  }
});

export default router;
