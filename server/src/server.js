// server/src/server.js
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import authRoutes from './routes/user/userAuth.js';
import aiRoutes from './routes/ai.js';
import adminAuthRoutes from './routes/admin/adminAuth.js';
import adminRoutes from './routes/admin/admin.js';
import adminJobRoutes from './routes/admin/jobs.js';
import adminJobApplicationRoutes from './routes/admin/jobApplications.js';
import adminReviewRoutes from './routes/admin/reviews.js';
import userJobRoutes from './routes/user/jobs.js';
import userBookingRoutes from './routes/user/bookings.js';
import userServiceRoutes from './routes/user/services.js';
import userPostRoutes from './routes/user/posts.js';
import userReviewRoutes from './routes/user/reviews.js';
import userNotificationRoutes from './routes/user/notifications.js';
import debugRoutes from './routes/debug.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8000;

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
app.use(express.json({ limit: '10mb' })); // Increased limit for base64 image uploads
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
app.use('/api/debug', debugRoutes); // Temporary debug routes

// admin routes
app.use('/api/admin/auth', adminAuthRoutes);
app.use('/api/admin/jobs', adminJobRoutes);
app.use('/api/admin/job-applications', adminJobApplicationRoutes);
app.use('/api/admin/reviews', adminReviewRoutes);
app.use('/api/admin', adminRoutes);

// 404 handler - must come BEFORE error handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handling - must come LAST
app.use(errorHandler);

// Only start server if not in serverless environment
if (process.env.VERCEL !== '1') {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV}`);
  }).on('error', (err) => {
    console.error('❌ Server error:', err);
    process.exit(1);
  });

  process.on('uncaughtException', (err) => {
    console.error('❌ Uncaught Exception:', err);
    process.exit(1);
  });

  process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
  });
}

export default app;
