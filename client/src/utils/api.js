// src/utils/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:6000/api',
});

// Add a request interceptor to include the JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
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
  // Add this to match your context call
  updateProfile: (data) => api.put('/auth/profile', data), 
};

export const bookingAPI = {
  createBooking: (data) => api.post('/bookings', data),
  getMyBookings: () => api.get('/bookings/my-bookings'),
};

export default api;