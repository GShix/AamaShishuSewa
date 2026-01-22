// server/src/routes/user/jobs.js
import express from 'express';
import * as jobController from '../../controllers/user/jobController.js';
import { authenticate } from '../../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', jobController.getOpenJobs);
router.get('/:id', jobController.getJobById);

// Protected routes (require authentication)
router.post('/:id/apply', authenticate, jobController.applyForJob);
router.get('/my/applications', authenticate, jobController.getMyApplications);

export default router;
