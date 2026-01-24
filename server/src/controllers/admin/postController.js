// server/src/controllers/admin/postController.js
import { supabaseAdmin } from '../../config/supabase.js';

export const getAllPosts = async (req, res) => {
  try {
    const { category, priority, published } = req.query;

    let query = supabaseAdmin
      .from('posts')
      .select('id, title, content, excerpt, category, priority, tags, image_type, image_url, published, author_id, views, created_at, updated_at, published_at');

    if (category) query = query.eq('category', category);
    if (priority) query = query.eq('priority', priority);
    if (published !== undefined) query = query.eq('published', published === 'true');

    query = query.order('created_at', { ascending: false });

    const { data: posts, error } = await query;

    if (error) throw error;

    // Add image URL for posts with image_data
    const postsWithImageUrls = posts.map(post => ({
      ...post,
      has_image: !!post.image_type,
      image_preview_url: post.image_type ? `/api/admin/posts/${post.id}/image` : post.image_url
    }));

    res.status(200).json({ posts: postsWithImageUrls });
  } catch (error) {
    console.error('Get all posts error:', error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
};

export const createPost = async (req, res) => {
  try {
    const {
      title,
      content,
      excerpt,
      category,
      priority,
      tags,
      image_url,
      image_data,
      image_type,
      published
    } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    const postData = {
      title,
      content,
      excerpt,
      category: category || 'news',
      priority: priority || 'normal',
      tags: tags || [],
      published: published !== undefined ? published : true,
      author_id: req.userId,
      published_at: (published !== false) ? new Date().toISOString() : null
    };

    // Handle image data (base64 or buffer)
    if (image_data && image_type) {
      // Supabase expects base64 string for BYTEA, not Buffer
      // Remove data URL prefix if present
      const base64String = typeof image_data === 'string' 
        ? image_data.replace(/^data:image\/\w+;base64,/, '')
        : image_data;
      
      postData.image_data = base64String;
      postData.image_type = image_type;
    } else if (image_url) {
      postData.image_url = image_url;
    }

    const { data: post, error } = await supabaseAdmin
      .from('posts')
      .insert(postData)
      .select('id, title, content, excerpt, category, priority, tags, image_type, image_url, published, author_id, views, created_at, updated_at, published_at')
      .single();

    if (error) throw error;

    res.status(201).json({
      message: 'Post created successfully',
      post: {
        ...post,
        has_image: !!post.image_type,
        image_preview_url: post.image_type ? `/api/posts/${post.id}/image` : post.image_url
      }
    });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ error: 'Failed to create post' });
  }
};

export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    delete updateData.id;
    delete updateData.created_at;
    delete updateData.author_id;

    // Handle image data update (base64 string for BYTEA)
    if (updateData.image_data && updateData.image_type) {
      const base64String = typeof updateData.image_data === 'string' 
        ? updateData.image_data.replace(/^data:image\/\w+;base64,/, '')
        : updateData.image_data;
      
      updateData.image_data = base64String;
    }

    const { data: post, error } = await supabaseAdmin
      .from('posts')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.status(200).json({
      message: 'Post updated successfully',
      post
    });
  } catch (error) {
    console.error('Update post error:', error);
    res.status(500).json({ error: 'Failed to update post' });
  }
};

export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: post, error } = await supabaseAdmin
      .from('posts')
      .delete()
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.status(200).json({
      message: 'Post deleted successfully',
      post
    });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ error: 'Failed to delete post' });
  }
};

export const getPostImage = async (req, res) => {
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
};
