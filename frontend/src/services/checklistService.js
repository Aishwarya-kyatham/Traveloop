import api from './api';

export const getChecklist = async (tripId) => {
  const response = await api.get(`/checklist/?trip=${tripId}`);
  return response.data;
};

export const addItem = async (data) => {
  const response = await api.post('/checklist/', data);
  return response.data;
};

export const toggleItem = async ({ id, is_checked }) => {
  const response = await api.patch(`/checklist/${id}/`, { is_checked });
  return response.data;
};

export const deleteItem = async (id) => {
  await api.delete(`/checklist/${id}/`);
};
