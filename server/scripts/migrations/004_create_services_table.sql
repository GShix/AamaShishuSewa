-- Migration: Create services table
-- Description: Store service offerings with flexible pricing options

CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  name_ne VARCHAR(255),
  description TEXT,
  description_ne TEXT,
  category VARCHAR(100),
  base_price DECIMAL(10, 2),
  price_unit VARCHAR(50),
  pricing_type VARCHAR(20) DEFAULT 'fixed' CHECK (pricing_type IN ('fixed', 'custom')),
  duration INTEGER DEFAULT 60,
  features JSONB DEFAULT '[]'::jsonb,
  image_url TEXT,
  icon VARCHAR(100),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index on category for faster filtering
CREATE INDEX IF NOT EXISTS idx_services_category ON services(category);

-- Create index on status for filtering active services
CREATE INDEX IF NOT EXISTS idx_services_status ON services(status);

-- Create index on pricing_type
CREATE INDEX IF NOT EXISTS idx_services_pricing_type ON services(pricing_type);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_services_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER services_updated_at_trigger
BEFORE UPDATE ON services
FOR EACH ROW
EXECUTE FUNCTION update_services_updated_at();

-- Insert sample services
INSERT INTO services (name, description, category, price, pricing_type, duration, features) VALUES
  (
    'Postpartum Care Package',
    'Comprehensive care for new mothers including massage, diet planning, and baby care guidance',
    'postnatal',
    15000.00,
    'fixed',
    240,
    '["Traditional massage", "Diet consultation", "Baby care tips", "Emotional support"]'::jsonb
  ),
  (
    'Prenatal Consultation',
    'Expert prenatal care and consultation for expecting mothers',
    'prenatal',
    8000.00,
    'fixed',
    60,
    '["Health check-up", "Diet planning", "Exercise guidance", "Mental health support"]'::jsonb
  ),
  (
    'Nwaran Ceremony Arrangement',
    'Traditional naming ceremony arrangement with all rituals',
    'nwaran',
    NULL,
    'custom',
    180,
    '["Priest arrangement", "Ritual items", "Ceremony guidance", "Photography (optional)"]'::jsonb
  ),
  (
    'Baby Care Training',
    'Learn essential baby care techniques from experienced professionals',
    'childcare',
    8000.00,
    'fixed',
    120,
    '["Bathing techniques", "Feeding guidance", "Sleep training", "Health monitoring"]'::jsonb
  ),
  (
    'Custom Care Package',
    'Customized care package tailored to your specific needs',
    'consultation',
    NULL,
    'custom',
    60,
    '["Personalized care plan", "Flexible scheduling", "Expert consultation", "Follow-up support"]'::jsonb
  );

COMMENT ON TABLE services IS 'Service offerings with flexible pricing (fixed or custom)';
COMMENT ON COLUMN services.pricing_type IS 'Fixed pricing or custom pricing to be discussed with client';
COMMENT ON COLUMN services.price IS 'Price in Rs (NULL for custom pricing)';
COMMENT ON COLUMN services.features IS 'JSON array of service features';
