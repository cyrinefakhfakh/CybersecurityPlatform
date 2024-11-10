import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Adjust to your backend base URL
});

// Set the Authorization header if a token is available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Store token in localStorage or cookies
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
