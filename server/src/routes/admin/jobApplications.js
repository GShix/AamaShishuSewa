// server/src/routes/admin/jobApplications.js
import express from 'express';
import * as jobApplicationController from '../../controllers/admin/jobApplicationController.js';
import { authenticateAdmin } from '../../middleware/auth.js';

const router = express.Router();

// Apply admin authentication to all routes
router.use(authenticateAdmin);

// Job application management routes
router.get('/', jobApplicationController.getAllApplications);
router.get('/stats', jobApplicationController.getApplicationStats);
router.get('/:id', jobApplicationController.getApplicationById);
router.patch('/:id/status', jobApplicationController.updateApplicationStatus);
router.delete('/:id', jobApplicationController.deleteApplication);

export default router;
