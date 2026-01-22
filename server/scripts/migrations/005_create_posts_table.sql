-- Migration: Create posts table
-- Description: Store posts, news, updates, notices, and announcements

CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(500) NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  category VARCHAR(50) NOT NULL DEFAULT 'news' CHECK (category IN ('news', 'update', 'announcement', 'event', 'notice', 'alert')),
  priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('normal', 'high', 'urgent')),
  tags JSONB DEFAULT '[]'::jsonb,
  image_url TEXT,
  published BOOLEAN DEFAULT true,
  author_id UUID,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  published_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_posts_category ON posts(category);
CREATE INDEX IF NOT EXISTS idx_posts_priority ON posts(priority);
CREATE INDEX IF NOT EXISTS idx_posts_published ON posts(published);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_author_id ON posts(author_id);

-- GIN index for JSONB tags for faster tag searches
CREATE INDEX IF NOT EXISTS idx_posts_tags ON posts USING gin(tags);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_posts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  
  -- Set published_at when first published
  IF NEW.published = true AND OLD.published = false THEN
    NEW.published_at = CURRENT_TIMESTAMP;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER posts_updated_at_trigger
BEFORE UPDATE ON posts
FOR EACH ROW
EXECUTE FUNCTION update_posts_updated_at();

-- Set published_at on insert if published
CREATE OR REPLACE FUNCTION set_posts_published_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.published = true AND NEW.published_at IS NULL THEN
    NEW.published_at = CURRENT_TIMESTAMP;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER posts_published_at_trigger
BEFORE INSERT ON posts
FOR EACH ROW
EXECUTE FUNCTION set_posts_published_at();

-- Insert sample posts
INSERT INTO posts (title, content, excerpt, category, priority, tags, image_url, published) VALUES
  (
    'Welcome to Aama Shishu Sewa',
    'We are delighted to announce the launch of our comprehensive mother and child care services. Our team of experienced professionals is dedicated to providing the best care for you and your baby.',
    'Launching comprehensive mother and child care services',
    'announcement',
    'high',
    '["launch", "services", "care"]'::jsonb,
    'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=800',
    true
  ),
  (
    'New Service: Prenatal Yoga Classes',
    'We are excited to introduce prenatal yoga classes conducted by certified instructors. These classes help expecting mothers stay healthy and prepare for delivery.',
    'Prenatal yoga classes now available',
    'update',
    'normal',
    '["yoga", "prenatal", "health"]'::jsonb,
    'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800',
    true
  ),
  (
    'Important: Health Check-up Schedule',
    'All registered clients are advised to complete their monthly health check-ups as per schedule. Please contact our office to book your appointment.',
    'Complete your monthly health check-ups',
    'notice',
    'high',
    '["health", "checkup", "schedule"]'::jsonb,
    NULL,
    true
  ),
  (
    'Festival Greetings: Dashain 2083',
    'Wishing all our clients and their families a very happy Dashain! Our services will remain available during the festival season.',
    'Dashain greetings and service availability',
    'announcement',
    'normal',
    '["festival", "dashain", "greetings"]'::jsonb,
    'https://images.unsplash.com/photo-1604881991720-f91add269bed?w=800',
    true
  ),
  (
    'Workshop: New Parent Training',
    'Join us for a comprehensive new parent training workshop on Saturday. Learn essential baby care techniques from our experts. Limited seats available!',
    'New parent training workshop this Saturday',
    'event',
    'normal',
    '["workshop", "training", "parents"]'::jsonb,
    'https://images.unsplash.com/photo-1476703993599-0035a21b17a9?w=800',
    true
  );

COMMENT ON TABLE posts IS 'Posts, news, updates, notices, and announcements for users';
COMMENT ON COLUMN posts.category IS 'Type of post: news, update, announcement, event, notice, or alert';
COMMENT ON COLUMN posts.priority IS 'Priority level for notices and alerts';
COMMENT ON COLUMN posts.tags IS 'JSON array of tags for categorization and search';
COMMENT ON COLUMN posts.views IS 'Number of times the post has been viewed';
COMMENT ON COLUMN posts.published IS 'Whether the post is published or in draft';
