-- =====================================================
-- Migration: Rename professionals table to employees
-- Description: Renames the professionals table to employees and updates all references
-- Date: 2026-01-21
-- =====================================================

-- Rename the table
ALTER TABLE IF EXISTS public.professionals RENAME TO employees;

-- Update foreign key column name in bookings table (if exists)
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'bookings' 
        AND column_name = 'professional_id'
    ) THEN
        ALTER TABLE public.bookings RENAME COLUMN professional_id TO employee_id;
    END IF;
END $$;

-- Rename foreign key constraint in bookings table (if exists)
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'bookings_professional_id_fkey' 
        AND table_name = 'bookings'
    ) THEN
        ALTER TABLE public.bookings 
        DROP CONSTRAINT bookings_professional_id_fkey,
        ADD CONSTRAINT bookings_employee_id_fkey 
        FOREIGN KEY (employee_id) REFERENCES public.employees(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Rename indexes
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_professionals_email') THEN
        ALTER INDEX idx_professionals_email RENAME TO idx_employees_email;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_professionals_phone') THEN
        ALTER INDEX idx_professionals_phone RENAME TO idx_employees_phone;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_professionals_specialization') THEN
        ALTER INDEX idx_professionals_specialization RENAME TO idx_employees_specialization;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_professionals_status') THEN
        ALTER INDEX idx_professionals_status RENAME TO idx_employees_status;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_professionals_created_at') THEN
        ALTER INDEX idx_professionals_created_at RENAME TO idx_employees_created_at;
    END IF;
END $$;

-- Update table and column comments
COMMENT ON TABLE public.employees IS 'Stores employee/professional accounts';
COMMENT ON COLUMN public.employees.id IS 'Unique identifier for employee';
COMMENT ON COLUMN public.employees.full_name IS 'Full name of the employee';
COMMENT ON COLUMN public.employees.email IS 'Employee email address';
COMMENT ON COLUMN public.employees.phone IS 'Contact phone number';
COMMENT ON COLUMN public.employees.specialization IS 'Area of specialization (e.g., Midwife, Nurse, Lactation Consultant)';
COMMENT ON COLUMN public.employees.experience IS 'Years of experience';
COMMENT ON COLUMN public.employees.qualification IS 'Educational qualifications';
COMMENT ON COLUMN public.employees.license_number IS 'Employee license number';
COMMENT ON COLUMN public.employees.address IS 'Physical address';
COMMENT ON COLUMN public.employees.bio IS 'Employee biography';
COMMENT ON COLUMN public.employees.hourly_rate IS 'Hourly rate charge';
COMMENT ON COLUMN public.employees.rating IS 'Average rating (0-5)';
COMMENT ON COLUMN public.employees.total_reviews IS 'Total number of reviews';
COMMENT ON COLUMN public.employees.status IS 'Employee status: active, inactive, or suspended';
COMMENT ON COLUMN public.employees.availability_status IS 'Availability status: available, busy, or unavailable';
COMMENT ON COLUMN public.employees.profile_image IS 'URL to profile image';
COMMENT ON COLUMN public.employees.created_at IS 'Account creation timestamp';
COMMENT ON COLUMN public.employees.updated_at IS 'Last update timestamp';

-- Update RLS policies if they exist
DO $$ 
BEGIN
    -- Drop old policies if they exist
    DROP POLICY IF EXISTS "Service role has full access to professionals" ON public.employees;
    DROP POLICY IF EXISTS "Public can read active professionals" ON public.employees;
    DROP POLICY IF EXISTS "Professionals can update own profile" ON public.employees;
    
    -- Create new policies with updated names
    CREATE POLICY "Service role has full access to employees"
        ON public.employees
        FOR ALL
        TO service_role
        USING (true)
        WITH CHECK (true);
    
    CREATE POLICY "Public can read active employees"
        ON public.employees
        FOR SELECT
        TO anon, authenticated
        USING (status = 'active');
    
    CREATE POLICY "Employees can update own profile"
        ON public.employees
        FOR UPDATE
        TO authenticated
        USING (auth.uid()::text = id::text)
        WITH CHECK (auth.uid()::text = id::text);
END $$;

-- Success message
DO $$ 
BEGIN
    RAISE NOTICE 'Successfully renamed professionals table to employees';
END $$;
