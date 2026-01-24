// Vercel serverless function entry point
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import authRoutes from '../src/routes/user/userAuth.js';
import aiRoutes from '../src/routes/ai.js';
import adminAuthRoutes from '../src/routes/admin/adminAuth.js';
import adminRoutes from '../src/routes/admin/admin.js';
import adminJobRoutes from '../src/routes/admin/jobs.js';
import adminJobApplicationRoutes from '../src/routes/admin/jobApplications.js';
import adminReviewRoutes from '../src/routes/admin/reviews.js';
import userJobRoutes from '../src/routes/user/jobs.js';
import userBookingRoutes from '../src/routes/user/bookings.js';
import userServiceRoutes from '../src/routes/user/services.js';
import userPostRoutes from '../src/routes/user/posts.js';
import userReviewRoutes from '../src/routes/user/reviews.js';
import userNotificationRoutes from '../src/routes/user/notifications.js';
import debugRoutes from '../src/routes/debug.js';
import { errorHandler } from '../src/middleware/errorHandler.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: false,
  crossOriginOpenerPolicy: false,
  crossOriginEmbedderPolicy: false,
}));
app.use(cors({
  origin: [
    process.env.CLIENT_URL || 'http://localhost:5173',
    'https://aama-shishu-sewa.vercel.app'
  ],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve uploaded files as static content
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Handle preflight requests
app.options('*', cors());

// Health check
app.get('/', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'आमा शिशु सेवा API Running',
    version: '1.0.1',
    timestamp: new Date().toISOString(),
    routes: {
      auth: '/api/auth',
      bookings: '/api/bookings',
      services: '/api/services',
      jobs: '/api/jobs',
      posts: '/api/posts',
      admin: '/api/admin'
    }
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/jobs', userJobRoutes);
app.use('/api/bookings', userBookingRoutes);
app.use('/api/services', userServiceRoutes);
app.use('/api/posts', userPostRoutes);
app.use('/api/reviews', userReviewRoutes);
app.use('/api/notifications', userNotificationRoutes);
app.use('/api/debug', debugRoutes);

// admin routes
app.use('/api/admin/auth', adminAuthRoutes);
app.use('/api/admin/jobs', adminJobRoutes);
app.use('/api/admin/job-applications', adminJobApplicationRoutes);
app.use('/api/admin/reviews', adminReviewRoutes);
app.use('/api/admin', adminRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handling - must come LAST
app.use(errorHandler);

// Export the Express app as a serverless function
export default app;
