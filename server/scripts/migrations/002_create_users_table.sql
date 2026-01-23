
DROP TABLE IF EXISTS public.users CASCADE;

-- Create users table
CREATE TABLE public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(15) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'user',
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    profile_image TEXT,
    date_of_birth DATE,
    gender VARCHAR(20),
    address TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_login TIMESTAMPTZ,
    
    -- Constraints
    CONSTRAINT users_role_check CHECK (role IN ('user', 'employee')),
    CONSTRAINT users_status_check CHECK (status IN ('active', 'inactive', 'suspended')),
    CONSTRAINT users_gender_check CHECK (gender IN ('male', 'female', 'other')),
    CONSTRAINT users_email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT users_phone_format CHECK (phone ~ '^[0-9]{10,15}$')
);

-- Create indexes for better query performance
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_phone ON public.users(phone);
CREATE INDEX idx_users_role ON public.users(role);
CREATE INDEX idx_users_status ON public.users(status);
CREATE INDEX idx_users_created_at ON public.users(created_at DESC);

-- Create updated_at trigger
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Policy: Allow service role full access (for backend operations)
CREATE POLICY "Service role has full access to users"
    ON public.users
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Policy: Users can read their own profile
CREATE POLICY "Users can read their own profile"
    ON public.users
    FOR SELECT
    TO authenticated
    USING (auth.uid()::text = id::text);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update own profile"
    ON public.users
    FOR UPDATE
    TO authenticated
    USING (auth.uid()::text = id::text)
    WITH CHECK (
        auth.uid()::text = id::text
        AND role = (SELECT role FROM public.users WHERE id::text = auth.uid()::text)
    );

-- =====================================================
-- Comments for documentation
-- =====================================================

COMMENT ON TABLE public.users IS 'Stores user accounts';
COMMENT ON COLUMN public.users.id IS 'Unique identifier for user';
COMMENT ON COLUMN public.users.email IS 'User email address for authentication';
COMMENT ON COLUMN public.users.phone IS 'Contact phone number';
COMMENT ON COLUMN public.users.password_hash IS 'Bcrypt hashed password';
COMMENT ON COLUMN public.users.full_name IS 'Full name of the user';
COMMENT ON COLUMN public.users.role IS 'User role: user or employee';
COMMENT ON COLUMN public.users.status IS 'Account status: active, inactive, or suspended';
COMMENT ON COLUMN public.users.profile_image IS 'URL to profile image';
COMMENT ON COLUMN public.users.date_of_birth IS 'Date of birth';
COMMENT ON COLUMN public.users.gender IS 'Gender: male, female, or other';
COMMENT ON COLUMN public.users.address IS 'Physical address';
COMMENT ON COLUMN public.users.created_at IS 'Account creation timestamp';
COMMENT ON COLUMN public.users.updated_at IS 'Last update timestamp';
COMMENT ON COLUMN public.users.last_login IS 'Last successful login timestamp';

-- Grant permissions
GRANT ALL ON public.users TO service_role;
GRANT SELECT, INSERT, UPDATE ON public.users TO authenticated;
