import api from './api';

const userService = {
  getMe: async () => {
    const response = await api.get('/auth/me/');
    return response.data;
  },
  updateMe: async (data) => {
    const response = await api.patch('/auth/me/', data);
    return response.data;
  },
};

export default userService;
