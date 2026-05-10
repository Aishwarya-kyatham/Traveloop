import api from './api';

export const getTrip = async (id) => {
  const { data } = await api.get(`/trips/${id}/`);
  return data;
};

export const addDestination = async (destinationData) => {
  const { data } = await api.post('/destinations/', destinationData);
  return data;
};

export const deleteDestination = async (id) => {
  const { data } = await api.delete(`/destinations/${id}/`);
  return data;
};

export const addActivity = async (activityData) => {
  const { data } = await api.post('/activities/', activityData);
  return data;
};

export const deleteActivity = async (id) => {
  const { data } = await api.delete(`/activities/${id}/`);
  return data;
};

export const updateActivity = async ({ id, ...updateData }) => {
  const { data } = await api.patch(`/activities/${id}/`, updateData);
  return data;
};
