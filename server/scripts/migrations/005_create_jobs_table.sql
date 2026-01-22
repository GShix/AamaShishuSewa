-- Create jobs table if not exists
CREATE TABLE IF NOT EXISTS jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  department VARCHAR(100),
  location VARCHAR(255),
  employment_type VARCHAR(50) DEFAULT 'full-time',
  experience_required VARCHAR(100),
  salary_range VARCHAR(100),
  description TEXT NOT NULL,
  responsibilities TEXT[],
  requirements TEXT[],
  benefits TEXT[],
  status VARCHAR(50) DEFAULT 'open',
  posted_by UUID REFERENCES admins(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deadline TIMESTAMP WITH TIME ZONE
);

-- Create job_applications table if not exists
CREATE TABLE IF NOT EXISTS job_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  resume_url TEXT,
  cover_letter TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID REFERENCES admins(id),
  notes TEXT,
  UNIQUE(job_id, user_id)
);

-- Update existing jobs to be open if they don't have a status
UPDATE jobs SET status = 'open' WHERE status IS NULL OR status = '';

-- Insert sample jobs if table is empty
INSERT INTO jobs (title, department, location, employment_type, experience_required, description, status)
SELECT 
  'Postpartum Care Specialist',
  'Healthcare',
  'Kathmandu, Nepal',
  'full-time',
  '2+ years',
  'We are seeking experienced postpartum care specialists to provide professional care for new mothers.',
  'open'
WHERE NOT EXISTS (SELECT 1 FROM jobs LIMIT 1)
UNION ALL
SELECT 
  'Baby Care Nurse',
  'Healthcare',
  'Lalitpur, Nepal',
  'full-time',
  '1+ years',
  'Join our team as a baby care nurse to help families with newborn care and support.',
  'open'
WHERE NOT EXISTS (SELECT 1 FROM jobs LIMIT 1);
