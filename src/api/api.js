import axios from 'axios';
import { API_BASE_URL, TOKEN_KEY } from '../constants';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Attach JWT (if present) to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Normalize error messages so callers can just read err.message
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'Something went wrong. Please try again.';
    return Promise.reject(new Error(message));
  }
);

export default api;
