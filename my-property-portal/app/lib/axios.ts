// lib/axios.ts
import axios from 'axios';
import { API_URL } from '../apiUrl';
import { store } from '../store';  // Import your Redux store

const axiosInstance = axios.create({
  baseURL: `${API_URL}/api`,  // Your API base URL
});

// Add a request interceptor to include the access token in headers
axiosInstance.interceptors.request.use(
  (config) => {
    // Get the token from Redux store (or localStorage/cookies)
    const token = store.getState().auth.token || localStorage.getItem('token');  // Check both Redux and localStorage

    // If token exists, add it to the Authorization header
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
