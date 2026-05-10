import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

const clearAuthState = () => {
  localStorage.removeItem('access');
  localStorage.removeItem('refresh');
  window.dispatchEvent(new Event('traveloop:auth-cleared'));
};

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
    if (error.response?.status === 401) {
      clearAuthState();
      return Promise.reject(error);
    }
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
