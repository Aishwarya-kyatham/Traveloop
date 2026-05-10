import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If it's a 400 error, format it nicely for the UI
    if (error.response && error.response.status >= 400 && error.response.status < 500) {
      const message = error.response.data.message || error.response.data.detail || 'An error occurred';
      const validationErrors = error.response.data.errors || error.response.data;
      
      const customError = new Error(message);
      customError.validationErrors = validationErrors;
      customError.status = error.response.status;
      throw customError;
    }
    throw error;
  }
);

export default api;
