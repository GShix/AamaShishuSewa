
-- Clean up existing objects (if any)
-- Drop table first with CASCADE to remove dependent triggers automatically
DROP TABLE IF EXISTS posts CASCADE;

-- Drop functions separately (they might exist from previous migrations)
DROP FUNCTION IF EXISTS set_posts_published_at();
DROP FUNCTION IF EXISTS update_posts_updated_at();

-- ============================================================================
-- Create Posts Table
-- ============================================================================
CREATE TABLE posts (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Content Fields
  title VARCHAR(500) NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  
  -- Classification
  category VARCHAR(50) NOT NULL DEFAULT 'news' 
    CHECK (category IN ('news', 'update', 'announcement', 'event', 'notice', 'alert')),
  priority VARCHAR(20) DEFAULT 'normal' 
    CHECK (priority IN ('normal', 'high', 'urgent')),
  tags JSONB DEFAULT '[]'::jsonb,
  
  -- Image Storage (Binary Data in Database)
  image_data BYTEA,                    -- Binary image data
  image_type VARCHAR(50),              -- MIME type (image/jpeg, image/png, etc.)
  image_url TEXT,                      -- Optional external image URL
  
  -- Publication Status
  published BOOLEAN DEFAULT true,
  author_id UUID,
  views INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  published_at TIMESTAMP WITH TIME ZONE
);

-- ============================================================================
-- Create Indexes for Performance Optimization
-- ============================================================================
CREATE INDEX idx_posts_category ON posts(category);
CREATE INDEX idx_posts_priority ON posts(priority);
CREATE INDEX idx_posts_published ON posts(published);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX idx_posts_author_id ON posts(author_id);

-- GIN index for JSONB tags for faster tag-based searches
CREATE INDEX idx_posts_tags ON posts USING gin(tags);

-- ============================================================================
-- Create Triggers and Functions
-- ============================================================================

-- Function: Auto-update updated_at timestamp and published_at
CREATE OR REPLACE FUNCTION update_posts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  
  -- Set published_at when post is published for the first time
  IF NEW.published = true AND OLD.published = false THEN
    NEW.published_at = CURRENT_TIMESTAMP;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Execute on UPDATE
CREATE TRIGGER posts_updated_at_trigger
BEFORE UPDATE ON posts
FOR EACH ROW
EXECUTE FUNCTION update_posts_updated_at();

-- Function: Set published_at on INSERT if published
CREATE OR REPLACE FUNCTION set_posts_published_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.published = true AND NEW.published_at IS NULL THEN
    NEW.published_at = CURRENT_TIMESTAMP;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Execute on INSERT
CREATE TRIGGER posts_published_at_trigger
BEFORE INSERT ON posts
FOR EACH ROW
EXECUTE FUNCTION set_posts_published_at();

-- ============================================================================
-- Insert Sample Data
-- ============================================================================
INSERT INTO posts (title, content, excerpt, category, priority, tags, published) VALUES
  (
    'Welcome to Aama Shishu Sewa',
    'We are delighted to announce the launch of our comprehensive mother and child care services. Our team of experienced professionals is dedicated to providing the best care for you and your baby. We offer prenatal care, postnatal support, vaccination services, health consultations, and emergency care available 24/7.',
    'Launching comprehensive mother and child care services with 24/7 support',
    'announcement',
    'high',
    '["launch", "services", "care", "healthcare"]'::jsonb,
    true
  ),
  (
    'New Service: Prenatal Yoga Classes',
    'We are excited to introduce prenatal yoga classes conducted by certified instructors. These specialized classes help expecting mothers stay healthy, reduce stress, and prepare for delivery. Classes are held every Tuesday and Thursday from 6 PM to 7 PM. Limited seats available, book your slot today!',
    'Prenatal yoga classes now available - Every Tuesday & Thursday',
    'update',
    'normal',
    '["yoga", "prenatal", "health", "fitness"]'::jsonb,
    true
  ),
  (
    'Important: Health Check-up Schedule',
    'All registered clients are advised to complete their monthly health check-ups as per schedule. Regular check-ups are crucial for monitoring the health of both mother and baby. Please contact our office to book your appointment or reschedule if needed. Walk-ins are welcome subject to availability.',
    'Complete your monthly health check-ups - Book your appointment now',
    'notice',
    'high',
    '["health", "checkup", "schedule", "appointment"]'::jsonb,
    true
  ),
  (
    'Festival Greetings: Dashain 2083',
    'Wishing all our clients and their families a very happy Dashain! May this festival bring joy, prosperity, and good health to your family. Our services will remain available during the festival season with adjusted timings. Emergency services available 24/7 as always.',
    'Dashain greetings and festival season service availability',
    'announcement',
    'normal',
    '["festival", "dashain", "greetings", "celebration"]'::jsonb,
    true
  ),
  (
    'Workshop: New Parent Training',
    'Join us for a comprehensive new parent training workshop this Saturday from 10 AM to 3 PM. Learn essential baby care techniques, feeding guidance, sleep training, and emergency response from our expert healthcare professionals. Lunch will be provided. Limited seats - register now!',
    'New parent training workshop this Saturday - Essential baby care skills',
    'event',
    'normal',
    '["workshop", "training", "parents", "education"]'::jsonb,
    true
  );

-- ============================================================================
-- Add Table and Column Comments
-- ============================================================================
COMMENT ON TABLE posts IS 'Posts, news, updates, notices, and announcements for users and clients';
COMMENT ON COLUMN posts.id IS 'Unique identifier for the post';
COMMENT ON COLUMN posts.title IS 'Post title (max 500 characters)';
COMMENT ON COLUMN posts.content IS 'Full post content (supports markdown)';
COMMENT ON COLUMN posts.excerpt IS 'Short summary or preview of the post';
COMMENT ON COLUMN posts.category IS 'Type of post: news, update, announcement, event, notice, or alert';
COMMENT ON COLUMN posts.priority IS 'Priority level: normal, high, or urgent';
COMMENT ON COLUMN posts.tags IS 'JSON array of tags for categorization and search';
COMMENT ON COLUMN posts.image_data IS 'Binary image data stored directly in database (BYTEA)';
COMMENT ON COLUMN posts.image_type IS 'MIME type of stored image (e.g., image/jpeg, image/png)';
COMMENT ON COLUMN posts.image_url IS 'Optional external image URL (for backward compatibility)';
COMMENT ON COLUMN posts.published IS 'Whether the post is published (true) or in draft (false)';
COMMENT ON COLUMN posts.author_id IS 'UUID of admin who created the post';
COMMENT ON COLUMN posts.views IS 'Number of times the post has been viewed';
COMMENT ON COLUMN posts.created_at IS 'Timestamp when post was created';
COMMENT ON COLUMN posts.updated_at IS 'Timestamp when post was last updated (auto-updated)';
COMMENT ON COLUMN posts.published_at IS 'Timestamp when post was first published';

-- ============================================================================
-- Migration Complete
-- ============================================================================
-- Post table created successfully with:
-- ✓ Binary image storage (BYTEA)
-- ✓ Multiple post categories
-- ✓ Priority levels
-- ✓ Tag support (JSONB)
-- ✓ Auto-updating timestamps
-- ✓ Publication workflow
-- ✓ Performance indexes
-- ✓ Sample data
-- ============================================================================
