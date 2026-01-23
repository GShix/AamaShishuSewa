-- Migration: Create employees table
-- Description: Store employee/professional information for service providers

CREATE TABLE IF NOT EXISTS employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(15) UNIQUE NOT NULL,
  specialization VARCHAR(255) NOT NULL,
  experience INTEGER DEFAULT 0,
  qualification TEXT,
  license_number VARCHAR(100),
  address TEXT,
  bio TEXT,
  hourly_rate DECIMAL(10,2) DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  total_reviews INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  availability_status VARCHAR(20) DEFAULT 'available' CHECK (availability_status IN ('available', 'busy', 'unavailable')),
  profile_image TEXT,
  verification_status VARCHAR(20) DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  experience_years INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_employees_email ON employees(email);
CREATE INDEX IF NOT EXISTS idx_employees_phone ON employees(phone);
CREATE INDEX IF NOT EXISTS idx_employees_specialization ON employees(specialization);
CREATE INDEX IF NOT EXISTS idx_employees_status ON employees(status);
CREATE INDEX IF NOT EXISTS idx_employees_availability_status ON employees(availability_status);
CREATE INDEX IF NOT EXISTS idx_employees_verification_status ON employees(verification_status);
CREATE INDEX IF NOT EXISTS idx_employees_rating ON employees(rating DESC);
CREATE INDEX IF NOT EXISTS idx_employees_created_at ON employees(created_at DESC);

-- Spatial index for location-based searches
CREATE INDEX IF NOT EXISTS idx_employees_location ON employees(latitude, longitude);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_employees_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER employees_updated_at_trigger
BEFORE UPDATE ON employees
FOR EACH ROW
EXECUTE FUNCTION update_employees_updated_at();

-- Insert sample employees
INSERT INTO employees (
  full_name, email, phone, specialization, experience, qualification, 
  license_number, address, bio, hourly_rate, rating, total_reviews, 
  status, availability_status, verification_status, latitude, longitude
) VALUES
  (
    'Sita Sharma',
    'sita.sharma@example.com',
    '9841234567',
    'Midwife',
    5,
    'Bachelor in Nursing, Certified Midwife',
    'MW12345',
    'Kathmandu, Nepal',
    'Experienced midwife with 5 years of experience in postpartum care. Specialized in newborn care and maternal health.',
    800.00,
    4.8,
    42,
    'active',
    'available',
    'verified',
    27.7172,
    85.3240
  ),
  (
    'Rama Thapa',
    'rama.thapa@example.com',
    '9851234567',
    'Lactation Consultant',
    3,
    'Master in Public Health, IBCLC Certified',
    'LC67890',
    'Lalitpur, Nepal',
    'Certified lactation consultant helping mothers with breastfeeding challenges and newborn nutrition.',
    600.00,
    4.9,
    28,
    'active',
    'available',
    'verified',
    27.6767,
    85.3166
  ),
  (
    'Maya Gurung',
    'maya.gurung@example.com',
    '9861234567',
    'Postpartum Nurse',
    7,
    'Bachelor in Nursing, Postpartum Care Specialist',
    'PN54321',
    'Bhaktapur, Nepal',
    'Dedicated postpartum nurse providing comprehensive care for mothers and newborns during the critical recovery period.',
    750.00,
    4.7,
    35,
    'active',
    'busy',
    'verified',
    27.6710,
    85.4298
  ),
  (
    'Anita Rai',
    'anita.rai@example.com',
    '9871234567',
    'Nwaran Specialist',
    4,
    'Traditional Birth Attendant, Cultural Care Expert',
    'NS98765',
    'Patan, Nepal',
    'Expert in traditional Nwaran ceremonies and cultural practices for newborn care in Nepali families.',
    500.00,
    4.6,
    21,
    'active',
    'available',
    'verified',
    27.6644,
    85.3188
  ),
  (
    'Bindu Tamang',
    'bindu.tamang@example.com',
    '9881234567',
    'Infant Care Specialist',
    2,
    'Diploma in Childcare, Infant Care Certified',
    'IC11223',
    'Kathmandu, Nepal',
    'Young and enthusiastic infant care specialist focusing on early childhood development and newborn wellness.',
    450.00,
    4.5,
    15,
    'active',
    'available',
    'verified',
    27.7050,
    85.3350
  )
ON CONFLICT (email) DO NOTHING;

-- Comments for documentation
COMMENT ON TABLE employees IS 'Stores information about employees/professionals providing healthcare services';
COMMENT ON COLUMN employees.verification_status IS 'Verification status by admin: pending, verified, or rejected';
COMMENT ON COLUMN employees.availability_status IS 'Current availability: available, busy, or unavailable';
COMMENT ON COLUMN employees.rating IS 'Average rating from 0 to 5 based on user reviews';
COMMENT ON COLUMN employees.latitude IS 'Location latitude for distance-based matching';
COMMENT ON COLUMN employees.longitude IS 'Location longitude for distance-based matching';
