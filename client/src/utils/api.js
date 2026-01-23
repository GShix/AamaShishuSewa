import axios from 'axios';

// Use environment variable for API URL, fallback to relative path for development
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add a request interceptor to include the JWT token
api.interceptors.request.use(
  (config) => {
    // Check if it's an admin route
    const isAdminRoute = config.url.includes('/admin/');
    const token = isAdminRoute 
      ? localStorage.getItem('adminToken')
      : localStorage.getItem('token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const userAPI = {
  // Authentication
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  
  // Profile Management
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.put('/auth/change-password', data),
  
  // Bookings
  createBooking: (data) => api.post('/bookings', data),
  getMyBookings: () => api.get('/bookings/my-bookings'),
  
  // Job Applications
  applyForJob: (jobId, data) => api.post(`/jobs/${jobId}/apply`, data),
  getMyApplications: () => api.get('/jobs/my-applications'),
  
  // Reviews
  createReview: (data) => api.post('/reviews', data),
  getReviews: (params) => api.get('/reviews', { params }),
  getMyReviews: () => api.get('/reviews/my-reviews'),
  updateReview: (reviewId, data) => api.put(`/reviews/${reviewId}`, data),
  deleteReview: (reviewId) => api.delete(`/reviews/${reviewId}`),
  canReviewBooking: (bookingId) => api.get(`/reviews/can-review/${bookingId}`),
  
  // Notifications
  getNotifications: (params) => api.get('/notifications', { params }),
  getUnreadCount: () => api.get('/notifications/unread-count'),
  markAsRead: (notificationId) => api.patch(`/notifications/${notificationId}/read`),
  markAllAsRead: () => api.patch('/notifications/mark-all-read'),
  deleteNotification: (notificationId) => api.delete(`/notifications/${notificationId}`),
};

export const adminAuthAPI = {
  login: (data) => api.post('/admin/auth/login', data),
  register: (data) => api.post('/admin/auth/register', data),
  getProfile: () => api.get('/admin/auth/profile'),
  updateProfile: (data) => api.put('/admin/auth/profile', data),
  changePassword: (data) => api.put('/admin/auth/change-password', data),
};

export const adminAPI = {
  // Dashboard
  getDashboardStats: () => api.get('/admin/dashboard/stats'),
  
  // Users Management
  getUsers: (params) => api.get('/admin/users', { params }),
  getUserById: (id) => api.get(`/admin/users/${id}`),
  updateUserStatus: (id, status) => api.patch(`/admin/users/${id}/status`, { status }),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  
  // Bookings Management
  getBookings: (params) => api.get('/admin/bookings', { params }),
  updateBookingStatus: (id, data) => api.patch(`/admin/bookings/${id}/status`, data),
  deleteBooking: (id) => api.delete(`/admin/bookings/${id}`),
  
  // Employees Management (formerly Professionals)
  getEmployees: (params) => api.get('/admin/employees', { params }),
  createEmployee: (data) => api.post('/admin/employees', data),
  updateEmployee: (id, data) => api.put(`/admin/employees/${id}`, data),
  deleteEmployee: (id) => api.delete(`/admin/employees/${id}`),
  // Backward compatibility aliases
  getProfessionals: (params) => api.get('/admin/employees', { params }),
  createProfessional: (data) => api.post('/admin/employees', data),
  updateProfessional: (id, data) => api.put(`/admin/employees/${id}`, data),
  deleteProfessional: (id) => api.delete(`/admin/employees/${id}`),
  
  // Services Management
  getServices: (params) => api.get('/admin/services', { params }),
  createService: (data) => api.post('/admin/services', data),
  updateService: (id, data) => api.put(`/admin/services/${id}`, data),
  deleteService: (id) => api.delete(`/admin/services/${id}`),
  
  // Posts Management (includes notices as category)
  getPosts: (params) => api.get('/admin/posts', { params }),
  createPost: (data) => api.post('/admin/posts', data),
  updatePost: (id, data) => api.put(`/admin/posts/${id}`, data),
  deletePost: (id) => api.delete(`/admin/posts/${id}`),
  
  // Jobs Management
  getJobs: (params) => api.get('/admin/jobs', { params }),
  createJob: (data) => api.post('/admin/jobs', data),
  updateJob: (id, data) => api.put(`/admin/jobs/${id}`, data),
  deleteJob: (id) => api.delete(`/admin/jobs/${id}`),
  getJobApplications: (jobId) => api.get(`/admin/jobs/${jobId}/applications`),
  
  // Job Applications Management
  getAllJobApplications: (params) => api.get('/admin/job-applications', { params }),
  getJobApplicationStats: () => api.get('/admin/job-applications/stats'),
  getJobApplicationById: (id) => api.get(`/admin/job-applications/${id}`),
  updateApplicationStatus: (id, status) => api.patch(`/admin/job-applications/${id}/status`, { status }),
  deleteJobApplication: (id) => api.delete(`/admin/job-applications/${id}`),
  
  // Admins Management (superAdmin only)
  getAdmins: (params) => api.get('/admin/admins', { params }),
  createAdmin: (data) => api.post('/admin/admins', data),
  updateAdminRole: (id, role) => api.patch(`/admin/admins/${id}/role`, { role }),
  deleteAdmin: (id) => api.delete(`/admin/admins/${id}`),
  
  // Reviews Management
  getReviews: (params) => api.get('/admin/reviews', { params }),
  getReviewStats: () => api.get('/admin/reviews/stats'),
  updateReviewStatus: (reviewId, status) => api.patch(`/admin/reviews/${reviewId}/status`, { status }),
  respondToReview: (reviewId, responseText) => api.post(`/admin/reviews/${reviewId}/respond`, { response_text: responseText }),
  toggleFeaturedReview: (reviewId) => api.patch(`/admin/reviews/${reviewId}/featured`),
  deleteReview: (reviewId) => api.delete(`/admin/reviews/${reviewId}`),
};

export const servicesAPI = {
  getAll: (params) => api.get('/services', { params }),
  getById: (id) => api.get(`/services/${id}`),
};

export const jobsAPI = {
  getOpenJobs: (params) => api.get('/jobs', { params }),
  getJobById: (id) => api.get(`/jobs/${id}`),
};

export const postsAPI = {
  getAllPosts: (params) => api.get('/posts', { params }),
  getPostById: (id) => api.get(`/posts/${id}`),
};

export default api;