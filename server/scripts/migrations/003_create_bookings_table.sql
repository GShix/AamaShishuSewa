-- Migration: Create bookings table
-- Description: Table for users to book services created by admin

-- Drop existing table if it exists (to apply new schema)
DROP TABLE IF EXISTS bookings CASCADE;

CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  service_id UUID REFERENCES services(id) ON DELETE SET NULL,
  service_type VARCHAR(100) NOT NULL,
  booking_date DATE NOT NULL,
  duration_days INTEGER DEFAULT 1,
  client_address TEXT NOT NULL,
  client_phone VARCHAR(20) NOT NULL,
  special_requirements TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  employee_id UUID REFERENCES employees(id) ON DELETE SET NULL,
  total_price DECIMAL(10, 2),
  payment_status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_service_id ON bookings(service_id);
CREATE INDEX idx_bookings_employee_id ON bookings(employee_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_booking_date ON bookings(booking_date);

-- Enable Row Level Security
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own bookings
CREATE POLICY "Users can view own bookings"
  ON bookings FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can create their own bookings
CREATE POLICY "Users can create own bookings"
  ON bookings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own pending bookings
CREATE POLICY "Users can update own pending bookings"
  ON bookings FOR UPDATE
  USING (auth.uid() = user_id AND status = 'pending');

-- Add comments for documentation
COMMENT ON TABLE bookings IS 'Stores service bookings made by users';
COMMENT ON COLUMN bookings.service_type IS 'Type of service being booked (e.g., postpartum, massage, nwaran)';
COMMENT ON COLUMN bookings.status IS 'Booking status: pending, confirmed, in_progress, completed, cancelled';
COMMENT ON COLUMN bookings.payment_status IS 'Payment status: pending, paid, refunded';
