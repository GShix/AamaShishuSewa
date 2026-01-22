
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
  getAllNotices,
  createNotice,
  updateNotice,
  deleteNotice
} from '../../controllers/admin/noticeController.js';

import { authenticate, requireAdmin, requireSuperAdmin } from '../../middleware/auth.js';

const router = express.Router();

// All routes require authentication and admin role
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

// Backward compatibility: professionals -> employees
router.get('/professionals', getAllEmployees);
router.post('/professionals', createEmployee);
router.put('/professionals/:id', updateEmployee);
router.delete('/professionals/:id', deleteEmployee);

// SERVICES MANAGEMENT

router.get('/services', getAllServices);
router.post('/services', createService);
router.put('/services/:id', updateService);
router.delete('/services/:id', deleteService);

// NOTICES MANAGEMENT
router.get('/notices', getAllNotices);
router.post('/notices', createNotice);
router.put('/notices/:id', updateNotice);
router.delete('/notices/:id', deleteNotice);

export default router;

