// server/src/routes/user/jobs.js
import express from 'express';
import * as jobController from '../../controllers/user/jobController.js';
import { authenticate } from '../../middleware/auth.js';

const router = express.Router();

// Protected routes (require authentication) - MUST come before /:id
router.get('/my-applications', authenticate, jobController.getMyApplications);
router.post('/:id/apply', authenticate, jobController.applyForJob);

// Public routes
router.get('/', jobController.getOpenJobs);
router.get('/:id', jobController.getJobById);

export default router;
