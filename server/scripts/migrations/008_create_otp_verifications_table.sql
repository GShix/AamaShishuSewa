-- Migration: Create OTP verifications table
-- Description: Store OTP codes for email verification (registration, forgot password)

CREATE TABLE IF NOT EXISTS otp_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier VARCHAR(255) NOT NULL,
  otp VARCHAR(6) NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('registration', 'forgot_password', 'email_change')),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  attempts INTEGER DEFAULT 0,
  verified BOOLEAN DEFAULT false,
  verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_otp_identifier ON otp_verifications(identifier);
CREATE INDEX IF NOT EXISTS idx_otp_type ON otp_verifications(type);
CREATE INDEX IF NOT EXISTS idx_otp_expires_at ON otp_verifications(expires_at);
CREATE INDEX IF NOT EXISTS idx_otp_verified ON otp_verifications(verified);
CREATE INDEX IF NOT EXISTS idx_otp_created_at ON otp_verifications(created_at DESC);

-- Composite index for common queries
CREATE INDEX IF NOT EXISTS idx_otp_identifier_type_verified ON otp_verifications(identifier, type, verified);

-- Comments for documentation
COMMENT ON TABLE otp_verifications IS 'Stores OTP codes for email verification during registration and password reset';
COMMENT ON COLUMN otp_verifications.identifier IS 'Email address or phone number for OTP verification';
COMMENT ON COLUMN otp_verifications.type IS 'Type of verification: registration, forgot_password, or email_change';
COMMENT ON COLUMN otp_verifications.attempts IS 'Number of failed verification attempts (max 5)';
COMMENT ON COLUMN otp_verifications.verified IS 'Whether the OTP has been successfully verified';
COMMENT ON COLUMN otp_verifications.expires_at IS 'OTP expiration time (typically 10 minutes from creation)';
