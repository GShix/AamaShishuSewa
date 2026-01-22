// server/src/controllers/user/jobController.js
import jobModel from '../../modal/jobModel.js';
import jobApplicationModel from '../../modal/jobApplicationModel.js';

// Get all open jobs
export const getOpenJobs = async (req, res) => {
  try {
    const jobs = await jobModel.getAll({ status: 'open' });
    res.json({ success: true, jobs });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
};

// Get job by ID
export const getJobById = async (req, res) => {
  try {
    const { id } = req.params;
    const job = await jobModel.getById(id);
    
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    res.json({ success: true, job });
  } catch (error) {
    console.error('Error fetching job:', error);
    res.status(500).json({ error: 'Failed to fetch job' });
  }
};

// Apply for a job
export const applyForJob = async (req, res) => {
  try {
    const { id: jobId } = req.params;
    const userId = req.userId;

    // Check if job exists and is open
    const job = await jobModel.getById(jobId);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    if (job.status !== 'open') {
      return res.status(400).json({ error: 'This job is no longer accepting applications' });
    }

    // Check if user already applied
    const hasApplied = await jobApplicationModel.hasApplied(userId, jobId);
    if (hasApplied) {
      return res.status(400).json({ error: 'You have already applied for this job' });
    }

    // Create application
    const applicationData = {
      job_id: jobId,
      user_id: userId,
      full_name: req.body.full_name || req.body.fullName,
      email: req.body.email,
      phone: req.body.phone,
      resume_url: req.body.resume_url,
      cover_letter: req.body.cover_letter,
      status: 'pending'
    };

    const application = await jobApplicationModel.create(applicationData);
    res.status(201).json({ success: true, application });
  } catch (error) {
    console.error('Error applying for job:', error);
    res.status(500).json({ error: 'Failed to submit application' });
  }
};

// Get user's applications
export const getMyApplications = async (req, res) => {
  try {
    const userId = req.userId;
    const applications = await jobApplicationModel.getAll({ user_id: userId });
    
    // Format response to include job title
    const formattedApplications = applications.map(app => ({
      ...app,
      job_title: app.jobs?.title || 'Unknown Position'
    }));

    res.json({ success: true, applications: formattedApplications });
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
};
