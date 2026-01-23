// server/src/controllers/admin/postController.js
import { supabaseAdmin } from '../../config/supabase.js';

export const getAllPosts = async (req, res) => {
  try {
    const { category, priority, published } = req.query;

    let query = supabaseAdmin
      .from('posts')
      .select('*');

    if (category) query = query.eq('category', category);
    if (priority) query = query.eq('priority', priority);
    if (published !== undefined) query = query.eq('published', published === 'true');

    query = query.order('created_at', { ascending: false });

    const { data: posts, error } = await query;

    if (error) throw error;

    res.status(200).json({ posts });
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
      published
    } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    const { data: post, error } = await supabaseAdmin
      .from('posts')
      .insert({
        title,
        content,
        excerpt,
        category: category || 'news',
        priority: priority || 'normal',
        tags: tags || [],
        image_url,
        published: published !== undefined ? published : true,
        author_id: req.userId,
        published_at: (published !== false) ? new Date().toISOString() : null
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      message: 'Post created successfully',
      post
    });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ error: 'Failed to create post' });
  }
};

export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    delete updateData.id;
    delete updateData.created_at;
    delete updateData.author_id;

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
