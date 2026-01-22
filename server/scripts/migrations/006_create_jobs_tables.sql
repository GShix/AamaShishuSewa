-- Migration: Create jobs and job_applications tables
-- Description: Store job openings and track applications from users

-- Jobs Table
CREATE TABLE IF NOT EXISTS jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  department VARCHAR(100) NOT NULL,
  location VARCHAR(100) NOT NULL,
  employment_type VARCHAR(50) DEFAULT 'full-time' CHECK (employment_type IN ('full-time', 'part-time', 'contract', 'internship')),
  experience_level VARCHAR(50) DEFAULT 'entry' CHECK (experience_level IN ('entry', 'intermediate', 'senior', 'expert')),
  salary_range VARCHAR(100),
  description TEXT NOT NULL,
  requirements JSONB DEFAULT '[]'::jsonb,
  responsibilities JSONB DEFAULT '[]'::jsonb,
  benefits JSONB DEFAULT '[]'::jsonb,
  vacancies INTEGER DEFAULT 1,
  deadline TIMESTAMP WITH TIME ZONE,
  status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'closed', 'on_hold')),
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Job Applications Table
CREATE TABLE IF NOT EXISTS job_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  resume_url TEXT NOT NULL,
  cover_letter TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'shortlisted', 'rejected', 'hired')),
  notes TEXT,
  reviewed_by UUID,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(job_id, user_id) -- Prevent duplicate applications
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_department ON jobs(department);
CREATE INDEX IF NOT EXISTS idx_jobs_employment_type ON jobs(employment_type);
CREATE INDEX IF NOT EXISTS idx_jobs_deadline ON jobs(deadline);
CREATE INDEX IF NOT EXISTS idx_jobs_created_at ON jobs(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_job_applications_job_id ON job_applications(job_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_user_id ON job_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_status ON job_applications(status);
CREATE INDEX IF NOT EXISTS idx_job_applications_created_at ON job_applications(created_at DESC);

-- GIN indexes for JSONB columns
CREATE INDEX IF NOT EXISTS idx_jobs_requirements ON jobs USING gin(requirements);
CREATE INDEX IF NOT EXISTS idx_jobs_responsibilities ON jobs USING gin(responsibilities);
CREATE INDEX IF NOT EXISTS idx_jobs_benefits ON jobs USING gin(benefits);

-- Add triggers to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_jobs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER jobs_updated_at_trigger
BEFORE UPDATE ON jobs
FOR EACH ROW
EXECUTE FUNCTION update_jobs_updated_at();

CREATE OR REPLACE FUNCTION update_job_applications_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  
  -- Set reviewed_at when status changes
  IF NEW.status != OLD.status AND NEW.status IN ('reviewed', 'shortlisted', 'rejected', 'hired') THEN
    NEW.reviewed_at = CURRENT_TIMESTAMP;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER job_applications_updated_at_trigger
BEFORE UPDATE ON job_applications
FOR EACH ROW
EXECUTE FUNCTION update_job_applications_updated_at();

-- Insert sample jobs
INSERT INTO jobs (title, department, location, employment_type, experience_level, salary_range, description, requirements, responsibilities, benefits, vacancies, deadline, status) VALUES
  (
    'Senior Care Nurse',
    'Healthcare',
    'Kathmandu',
    'full-time',
    'intermediate',
    'Rs 40,000 - 60,000',
    'We are looking for an experienced and compassionate Senior Care Nurse to join our team. The ideal candidate will provide high-quality care to mothers and newborns, ensuring their health and well-being during the postpartum period.',
    '["Bachelor''s degree in Nursing", "Valid nursing license", "Minimum 3 years of experience in maternal care", "Excellent communication skills", "Compassionate and patient"]'::jsonb,
    '["Provide postpartum care to mothers and newborns", "Monitor vital signs and health conditions", "Educate families on infant care and feeding", "Maintain accurate medical records", "Coordinate with doctors and other healthcare professionals"]'::jsonb,
    '["Competitive salary", "Health insurance", "Paid leave", "Professional development opportunities", "Friendly work environment"]'::jsonb,
    2,
    CURRENT_TIMESTAMP + INTERVAL '30 days',
    'open'
  ),
  (
    'Child Care Specialist',
    'Childcare Services',
    'Lalitpur',
    'full-time',
    'entry',
    'Rs 25,000 - 35,000',
    'Join our team as a Child Care Specialist where you will support families with infant and toddler care, providing guidance on development milestones, nutrition, and daily routines.',
    '["Diploma or degree in Early Childhood Education or related field", "Knowledge of child development", "Good communication skills", "Patience and caring nature", "Ability to work flexible hours"]'::jsonb,
    '["Provide childcare services in clients'' homes", "Guide parents on child development and nutrition", "Organize age-appropriate activities", "Maintain safety and hygiene standards", "Build trusting relationships with families"]'::jsonb,
    '["Health insurance", "Transportation allowance", "Training programs", "Performance bonuses", "Career growth opportunities"]'::jsonb,
    3,
    CURRENT_TIMESTAMP + INTERVAL '45 days',
    'open'
  ),
  (
    'Postpartum Care Assistant',
    'Maternal Care',
    'Bhaktapur',
    'part-time',
    'entry',
    'Rs 20,000 - 30,000',
    'Support new mothers during their recovery period by assisting with daily activities, baby care, and traditional postpartum practices. This is a part-time position with flexible scheduling.',
    '["High school diploma or equivalent", "Training in postpartum care (preferred)", "Knowledge of traditional care practices", "Good interpersonal skills", "Willingness to learn"]'::jsonb,
    '["Assist mothers with daily activities during recovery", "Help with baby feeding and care", "Perform traditional massage and care rituals", "Prepare nutritious meals as needed", "Provide emotional support to new mothers"]'::jsonb,
    '["Flexible working hours", "Training and certification support", "Health benefits", "Travel reimbursement", "Supportive team environment"]'::jsonb,
    5,
    CURRENT_TIMESTAMP + INTERVAL '20 days',
    'open'
  ),
  (
    'Health Consultant Intern',
    'Consulting',
    'Kathmandu',
    'internship',
    'entry',
    'Stipend: Rs 15,000',
    'Gain hands-on experience in maternal and child healthcare consulting. This 6-month internship program offers exposure to real-world scenarios, client interactions, and professional development.',
    '["Currently pursuing or recently completed degree in Healthcare, Nursing, or related field", "Strong communication and organizational skills", "Interest in maternal and child health", "Proficiency in Nepali and English", "Computer literacy"]'::jsonb,
    '["Assist senior consultants with client visits", "Help prepare care plans and reports", "Conduct follow-up calls with clients", "Maintain client records and databases", "Participate in training sessions and workshops"]'::jsonb,
    '["Practical work experience", "Certificate upon completion", "Mentorship from experienced professionals", "Potential for full-time employment", "Networking opportunities"]'::jsonb,
    2,
    CURRENT_TIMESTAMP + INTERVAL '15 days',
    'open'
  ),
  (
    'Traditional Birth Attendant',
    'Traditional Care',
    'Kathmandu Valley',
    'contract',
    'senior',
    'Negotiable based on experience',
    'We seek an experienced Traditional Birth Attendant to provide culturally appropriate care and support to families during pregnancy, childbirth, and postpartum periods. Contract-based position with flexible terms.',
    '["Extensive experience as a traditional birth attendant", "Deep knowledge of traditional practices and rituals", "Respected in the community", "Good health and physical stamina", "Ability to work independently"]'::jsonb,
    '["Provide prenatal and postnatal care using traditional methods", "Assist with childbirth when appropriate", "Perform traditional ceremonies and rituals", "Advise families on cultural practices", "Collaborate with medical professionals when needed"]'::jsonb,
    '["Competitive compensation", "Respect for traditional knowledge", "Flexible contract terms", "Transportation support", "Recognition and appreciation"]'::jsonb,
    1,
    CURRENT_TIMESTAMP + INTERVAL '60 days',
    'open'
  );

COMMENT ON TABLE jobs IS 'Job openings posted by admin for users to apply';
COMMENT ON TABLE job_applications IS 'Applications submitted by users for job openings';
COMMENT ON COLUMN jobs.requirements IS 'JSON array of job requirements';
COMMENT ON COLUMN jobs.responsibilities IS 'JSON array of job responsibilities';
COMMENT ON COLUMN jobs.benefits IS 'JSON array of benefits offered';
COMMENT ON COLUMN job_applications.status IS 'Application status: pending, reviewed, shortlisted, rejected, or hired';
