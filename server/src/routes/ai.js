import express from 'express';
const router = express.Router();

// Simple route for now
router.post('/care-plan', async (req, res) => {
  res.json({ message: 'AI route' });
});

export default router;