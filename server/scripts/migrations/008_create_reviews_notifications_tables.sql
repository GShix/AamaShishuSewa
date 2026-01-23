-- Migration: Create reviews table
-- Description: Table for users to review services and employees after booking completion

CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  service_id UUID REFERENCES services(id) ON DELETE SET NULL,
  employee_id UUID REFERENCES employees(id) ON DELETE SET NULL,
  
  -- Review content
  rating DECIMAL(2,1) NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  images TEXT[],  -- Array of image URLs
  
  -- Review metadata
  is_verified BOOLEAN DEFAULT FALSE,  -- Only verified if booking completed
  is_featured BOOLEAN DEFAULT FALSE,  -- Admin can feature best reviews
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'hidden')),
  
  -- Admin/Employee response
  response_text TEXT,
  response_by UUID REFERENCES admins(id) ON DELETE SET NULL,
  response_at TIMESTAMP WITH TIME ZONE,
  
  -- Helpful votes
  helpful_count INTEGER DEFAULT 0,
  unhelpful_count INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE INDEX idx_reviews_booking_id ON reviews(booking_id);
CREATE INDEX idx_reviews_service_id ON reviews(service_id);
CREATE INDEX idx_reviews_employee_id ON reviews(employee_id);
CREATE INDEX idx_reviews_status ON reviews(status);
CREATE INDEX idx_reviews_rating ON reviews(rating);
CREATE INDEX idx_reviews_created_at ON reviews(created_at DESC);

-- Enable Row Level Security
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view approved reviews
CREATE POLICY "Anyone can view approved reviews"
  ON reviews FOR SELECT
  USING (status = 'approved');

-- Policy: Users can create reviews for their completed bookings
CREATE POLICY "Users can create reviews for own bookings"
  ON reviews FOR INSERT
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM bookings 
      WHERE id = reviews.booking_id 
      AND user_id = auth.uid() 
      AND status = 'completed'
    )
  );

-- Policy: Users can update their own pending reviews
CREATE POLICY "Users can update own pending reviews"
  ON reviews FOR UPDATE
  USING (auth.uid() = user_id AND status = 'pending');

-- Create notifications table
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  admin_id UUID REFERENCES admins(id) ON DELETE CASCADE,
  
  -- Notification content
  type VARCHAR(50) NOT NULL,  -- 'booking_created', 'booking_confirmed', 'payment_received', etc.
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  
  -- Notification data
  data JSONB,  -- Additional data (booking_id, service_id, etc.)
  
  -- Notification status
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP WITH TIME ZONE,
  
  -- Delivery channels
  sent_email BOOLEAN DEFAULT FALSE,
  sent_sms BOOLEAN DEFAULT FALSE,
  sent_push BOOLEAN DEFAULT FALSE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for notifications
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_admin_id ON notifications(admin_id);
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);

-- Enable Row Level Security for notifications
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own notifications
CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can update their own notifications (mark as read)
CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id);

-- Add comments for documentation
COMMENT ON TABLE reviews IS 'User reviews for services and employees after booking completion';
COMMENT ON COLUMN reviews.rating IS 'Rating from 1.0 to 5.0';
COMMENT ON COLUMN reviews.is_verified IS 'True if the user actually completed the booking';
COMMENT ON COLUMN reviews.status IS 'Review moderation status: pending, approved, rejected, hidden';

COMMENT ON TABLE notifications IS 'In-app and multi-channel notifications for users and admins';
COMMENT ON COLUMN notifications.type IS 'Notification type for categorization and handling';
COMMENT ON COLUMN notifications.data IS 'Additional JSON data specific to notification type';
