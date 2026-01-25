
import express from 'express';
import {
  // Admin Management (SuperAdmin only)
  getAllAdmins,
  getAdminById,
  createAdmin,
  updateAdmin,
  updateAdminPassword,
  deleteAdmin,
  getAdminStats,
  
  getDashboardStats
} from '../../controllers/admin/adminController.js';

import {
  getAllUsers,
  getUserById,
  updateUserStatus,
  deleteUser
} from '../../controllers/admin/userController.js';

import {
  getAllBookings,
  updateBookingStatus,
  deleteBooking
} from '../../controllers/admin/bookingController.js';

import {
  getAllEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee
} from '../../controllers/admin/employeeController.js';

import {
  getAllServices,
  createService,
  updateService,
  deleteService
} from '../../controllers/admin/serviceController.js';

import {
  getAllPosts,
  createPost,
  updatePost,
  deletePost,
  getPostImage
} from '../../controllers/admin/postController.js';

import { authenticate, requireAdmin, requireSuperAdmin } from '../../middleware/auth.js';
import { uploadPostImage, handleUploadError } from '../../middleware/upload.js';

const router = express.Router();

// PUBLIC ROUTES (no auth required)
// Post images are public content
router.get('/posts/:id/image', getPostImage);

// All routes below require authentication and admin role
router.use(authenticate);
router.use(requireAdmin);

// DASHBOARD STATS
router.get('/dashboard/stats', getDashboardStats);

// ADMIN MANAGEMENT (SuperAdmin only)
router.get('/admins/stats', requireSuperAdmin, getAdminStats);
router.get('/admins', requireSuperAdmin, getAllAdmins);
router.get('/admins/:id', requireSuperAdmin, getAdminById);
router.post('/admins', requireSuperAdmin, createAdmin);
router.put('/admins/:id', requireSuperAdmin, updateAdmin);
router.put('/admins/:id/password', requireSuperAdmin, updateAdminPassword);
router.delete('/admins/:id', requireSuperAdmin, deleteAdmin);

// USER MANAGEMENT

router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.patch('/users/:id/status', updateUserStatus);
router.delete('/users/:id', deleteUser);

// BOOKING MANAGEMENT

router.get('/bookings', getAllBookings);
router.put('/bookings/:id/status', updateBookingStatus);
router.delete('/bookings/:id', deleteBooking);

// EMPLOYEE MANAGEMENT

router.get('/employees', getAllEmployees);
router.post('/employees', createEmployee);
router.put('/employees/:id', updateEmployee);
router.delete('/employees/:id', deleteEmployee);

// SERVICES MANAGEMENT

router.get('/services', getAllServices);
router.post('/services', createService);
router.put('/services/:id', updateService);
router.delete('/services/:id', deleteService);

// POSTS MANAGEMENT (includes notices as category)
router.get('/posts', getAllPosts);
router.post('/posts', createPost);
router.put('/posts/:id', updatePost);
router.delete('/posts/:id', deletePost);

// FILE UPLOAD for posts
router.post('/upload/post-image', uploadPostImage.single('image'), handleUploadError, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Read the file and convert to base64
    const fs = await import('fs');
    const imageBuffer = fs.readFileSync(req.file.path);
    const base64Image = imageBuffer.toString('base64');
    const dataUrl = `data:${req.file.mimetype};base64,${base64Image}`;
    
    // Delete the temporary file
    fs.unlinkSync(req.file.path);
    
    res.status(200).json({
      message: 'Image uploaded successfully',
      imageData: base64Image,
      imageType: req.file.mimetype,
      dataUrl: dataUrl
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

export default router;

