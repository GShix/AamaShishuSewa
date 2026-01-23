// server/src/controllers/admin/jobApplicationController.js
import jobApplicationModel from '../../modal/jobApplicationModel.js';

// Get all job applications with filters
export const getAllApplications = async (req, res) => {
  try {
    const filters = {};
    if (req.query.job_id) filters.job_id = req.query.job_id;
    if (req.query.status) filters.status = req.query.status;

    const applications = await jobApplicationModel.getAll(filters);
    res.json({ success: true, applications });
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
};

// Get application by ID
export const getApplicationById = async (req, res) => {
  try {
    const { id } = req.params;
    const application = await jobApplicationModel.getById(id);

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    res.json({ success: true, application });
  } catch (error) {
    console.error('Error fetching application:', error);
    res.status(500).json({ error: 'Failed to fetch application' });
  }
};

// Update application status
export const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ['pending', 'reviewed', 'shortlisted', 'accepted', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const application = await jobApplicationModel.updateStatus(id, status, req.userId);
    res.json({ success: true, application, message: `Application ${status} successfully` });
  } catch (error) {
    console.error('Error updating application status:', error);
    res.status(500).json({ error: 'Failed to update application status' });
  }
};

// Delete application
export const deleteApplication = async (req, res) => {
  try {
    const { id } = req.params;
    await jobApplicationModel.delete(id);
    res.json({ success: true, message: 'Application deleted successfully' });
  } catch (error) {
    console.error('Error deleting application:', error);
    res.status(500).json({ error: 'Failed to delete application' });
  }
};

// Get application statistics
export const getApplicationStats = async (req, res) => {
  try {
    const applications = await jobApplicationModel.getAll();

    const stats = {
      total: applications.length,
      pending: applications.filter(a => a.status === 'pending').length,
      reviewed: applications.filter(a => a.status === 'reviewed').length,
      shortlisted: applications.filter(a => a.status === 'shortlisted').length,
      accepted: applications.filter(a => a.status === 'accepted').length,
      rejected: applications.filter(a => a.status === 'rejected').length
    };

    res.json({ success: true, stats });
  } catch (error) {
    console.error('Error fetching application stats:', error);
    res.status(500).json({ error: 'Failed to fetch application stats' });
  }
};
