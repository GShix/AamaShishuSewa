import express from 'express';
const router = express.Router();

// Simple route for now
router.get('/', async (req, res) => {
  res.json({ message: 'Professionals route' });
});

export default router;