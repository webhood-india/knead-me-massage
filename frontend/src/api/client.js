import axios from 'axios';

// Customer-facing API client
export const api = axios.create({ baseURL: '/api' });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('km_customer_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Admin API client (separate token store)
export const adminApi = axios.create({ baseURL: '/api/admin' });

adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('km_admin_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const getErrorMessage = (err) =>
  err?.response?.data?.message || err?.message || 'Something went wrong. Please try again.';
