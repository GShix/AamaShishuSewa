// src/utils/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // or your actual backend URL
});

// 1. Export authAPI
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  // ... other auth methods
};

// 2. Export bookingAPI
export const bookingAPI = {
  createBooking: (data) => api.post('/bookings', data),
  getMyBookings: () => api.get('/bookings/my-bookings'),
};

export default api;