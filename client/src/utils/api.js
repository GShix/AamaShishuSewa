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

export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.put('/auth/change-password', data),
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
  
  // Notices Management
  getNotices: (params) => api.get('/admin/notices', { params }),
  createNotice: (data) => api.post('/admin/notices', data),
  updateNotice: (id, data) => api.put(`/admin/notices/${id}`, data),
  deleteNotice: (id) => api.delete(`/admin/notices/${id}`),
  
  // Posts Management
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
};

export const bookingAPI = {
  createBooking: (data) => api.post('/bookings', data),
  getMyBookings: () => api.get('/bookings/my-bookings'),
};

export const jobsAPI = {
  getOpenJobs: (params) => api.get('/jobs', { params }),
  getJobById: (id) => api.get(`/jobs/${id}`),
  applyForJob: (jobId, data) => api.post(`/jobs/${jobId}/apply`, data),
  getMyApplications: () => api.get('/jobs/my-applications'),
};

export default api;