-- =====================================================
-- Migration: Create Admins Table
-- Description: Creates the admins table with proper constraints and RLS
-- Date: 2026-01-21
-- =====================================================

-- Drop table if exists (be careful in production)
DROP TABLE IF EXISTS public.admins CASCADE;

-- Create admins table
CREATE TABLE public.admins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(15) UNIQUE NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'admin',
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    profile_image TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_login TIMESTAMPTZ,
    
    -- Constraints
    CONSTRAINT admins_role_check CHECK (role IN ('admin', 'superAdmin')),
    CONSTRAINT admins_status_check CHECK (status IN ('active', 'inactive', 'suspended')),
    CONSTRAINT admins_email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT admins_phone_format CHECK (phone ~ '^[0-9]{10,15}$')
);

-- Create indexes for better query performance
CREATE INDEX idx_admins_email ON public.admins(email);
CREATE INDEX idx_admins_phone ON public.admins(phone);
CREATE INDEX idx_admins_role ON public.admins(role);
CREATE INDEX idx_admins_status ON public.admins(status);
CREATE INDEX idx_admins_created_at ON public.admins(created_at DESC);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER update_admins_updated_at
    BEFORE UPDATE ON public.admins
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- Row Level Security (RLS) Policies
-- =====================================================

-- Enable RLS
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- Policy: Allow service role full access (for backend operations)
CREATE POLICY "Service role has full access to admins"
    ON public.admins
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Policy: Admins can read their own profile
CREATE POLICY "Admins can read their own profile"
    ON public.admins
    FOR SELECT
    TO authenticated
    USING (auth.uid()::text = id::text);

-- Policy: SuperAdmins can read all admin profiles
CREATE POLICY "SuperAdmins can read all admins"
    ON public.admins
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.admins
            WHERE id::text = auth.uid()::text
            AND role = 'superAdmin'
            AND status = 'active'
        )
    );

-- Policy: Admins can update their own profile (except role and status)
CREATE POLICY "Admins can update own profile"
    ON public.admins
    FOR UPDATE
    TO authenticated
    USING (auth.uid()::text = id::text)
    WITH CHECK (
        auth.uid()::text = id::text
        AND role = (SELECT role FROM public.admins WHERE id::text = auth.uid()::text)
        AND status = (SELECT status FROM public.admins WHERE id::text = auth.uid()::text)
    );

-- Policy: SuperAdmins can insert new admins
CREATE POLICY "SuperAdmins can insert admins"
    ON public.admins
    FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.admins
            WHERE id::text = auth.uid()::text
            AND role = 'superAdmin'
            AND status = 'active'
        )
    );

-- Policy: SuperAdmins can update any admin
CREATE POLICY "SuperAdmins can update any admin"
    ON public.admins
    FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.admins
            WHERE id::text = auth.uid()::text
            AND role = 'superAdmin'
            AND status = 'active'
        )
    );

-- Policy: SuperAdmins can delete admins (soft delete by changing status is recommended)
CREATE POLICY "SuperAdmins can delete admins"
    ON public.admins
    FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.admins
            WHERE id::text = auth.uid()::text
            AND role = 'superAdmin'
            AND status = 'active'
        )
    );

-- =====================================================
-- Comments for documentation
-- =====================================================

COMMENT ON TABLE public.admins IS 'Stores admin user accounts with role-based access';
COMMENT ON COLUMN public.admins.id IS 'Unique identifier for admin';
COMMENT ON COLUMN public.admins.email IS 'Admin email address for authentication';
COMMENT ON COLUMN public.admins.password_hash IS 'Bcrypt hashed password';
COMMENT ON COLUMN public.admins.full_name IS 'Full name of the admin';
COMMENT ON COLUMN public.admins.phone IS 'Contact phone number';
COMMENT ON COLUMN public.admins.role IS 'Admin role: admin or superAdmin';
COMMENT ON COLUMN public.admins.status IS 'Account status: active, inactive, or suspended';
COMMENT ON COLUMN public.admins.profile_image IS 'URL to profile image';
COMMENT ON COLUMN public.admins.created_at IS 'Timestamp when account was created';
COMMENT ON COLUMN public.admins.updated_at IS 'Timestamp of last update';
COMMENT ON COLUMN public.admins.last_login IS 'Timestamp of last successful login';

-- Grant permissions (adjust based on your Supabase setup)
GRANT ALL ON public.admins TO service_role;
GRANT SELECT, INSERT, UPDATE ON public.admins TO authenticated;

-- =====================================================
-- Verification Queries
-- =====================================================

-- Uncomment these to verify the table structure after migration
-- SELECT * FROM public.admins;
-- SELECT column_name, data_type, is_nullable, column_default
-- FROM information_schema.columns
-- WHERE table_schema = 'public' AND table_name = 'admins';
