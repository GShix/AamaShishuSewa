
DROP TABLE IF EXISTS notifications CASCADE;

-- Create notifications table
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL DEFAULT 'general',
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  data JSONB DEFAULT '{}',
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX idx_notifications_type ON notifications(type);

-- Create composite index for common query pattern
CREATE INDEX idx_notifications_user_unread ON notifications(user_id, is_read, created_at DESC);

-- Add RLS (Row Level Security) policies
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own notifications
CREATE POLICY "Users can view own notifications"
  ON notifications
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can update their own notifications (mark as read)
CREATE POLICY "Users can update own notifications"
  ON notifications
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy: Users can delete their own notifications
CREATE POLICY "Users can delete own notifications"
  ON notifications
  FOR DELETE
  USING (auth.uid() = user_id);

-- Policy: System/Admin can insert notifications for any user
CREATE POLICY "Service role can insert notifications"
  ON notifications
  FOR INSERT
  WITH CHECK (true);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_notifications_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_notifications_updated_at
  BEFORE UPDATE ON notifications
  FOR EACH ROW
  EXECUTE FUNCTION update_notifications_updated_at();

-- Add comments for documentation
COMMENT ON TABLE notifications IS 'Stores user notifications for in-app notifications system';
COMMENT ON COLUMN notifications.user_id IS 'User who will receive this notification';
COMMENT ON COLUMN notifications.type IS 'Type of notification: new_post, booking_created, booking_confirmed, etc.';
COMMENT ON COLUMN notifications.title IS 'Notification title (usually in Nepali)';
COMMENT ON COLUMN notifications.message IS 'Notification message content (usually in Nepali)';
COMMENT ON COLUMN notifications.data IS 'Additional data in JSON format (can include English translations, post_id, etc.)';
COMMENT ON COLUMN notifications.is_read IS 'Whether user has read this notification';
COMMENT ON COLUMN notifications.read_at IS 'Timestamp when notification was marked as read';

-- Insert sample notification for testing (optional)
-- INSERT INTO notifications (user_id, type, title, message, data)
-- SELECT 
--   id as user_id,
--   'welcome',
--   'स्वागत छ!',
--   'आमा शिशु सेवामा स्वागत छ। तपाईंको खाता सफलतापूर्वक सिर्जना भएको छ।',
--   '{"english_title": "Welcome!", "english_message": "Welcome to Aama Shishu Sewa. Your account has been successfully created."}'::jsonb
-- FROM users 
-- WHERE role = 'user' 
-- LIMIT 1;

-- Verification query
SELECT 'Notifications table created successfully!' as status,
       COUNT(*) as notification_count 
FROM notifications;
