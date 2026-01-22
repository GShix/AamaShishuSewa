// server/src/routes/admin/jobs.js
import express from 'express';
import * as jobController from '../../controllers/admin/jobController.js';
import { authenticate, requireAdmin } from '../../middleware/auth.js';

const router = express.Router();

// All routes require admin authentication
router.use(authenticate);
router.use(requireAdmin);

// Job management routes
router.get('/', jobController.getJobs);
router.post('/', jobController.createJob);
router.get('/:id', jobController.getJobById);
router.put('/:id', jobController.updateJob);
router.delete('/:id', jobController.deleteJob);
router.get('/:id/applications', jobController.getJobApplications);

export default router;
