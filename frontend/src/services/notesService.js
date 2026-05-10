import api from './api';

export const getNotes = async (tripId) => {
  const response = await api.get(`/notes/?trip=${tripId}`);
  return response.data;
};

export const addNote = async (data) => {
  const response = await api.post('/notes/', data);
  return response.data;
};

export const deleteNote = async (id) => {
  await api.delete(`/notes/${id}/`);
};

export const getPublicTrip = async (token) => {
  const response = await api.get(`/share/${token}/`);
  return response.data;
};

export const togglePublic = async (tripId) => {
  const response = await api.post(`/trips/${tripId}/toggle-public/`);
  return response.data;
};
