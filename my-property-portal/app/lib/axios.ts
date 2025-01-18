import axios from 'axios';
import { API_URL } from '../apiUrl';

const axiosInstance = axios.create({
  baseURL:   `${API_URL}/api`,  // Change this to your NestJS backend API URL
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
