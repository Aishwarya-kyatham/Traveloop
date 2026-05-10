import api from './api';

const tripService = {
  getTrips: async () => {
    const response = await api.get('/trips/');
    return response.data;
  },
  getTrip: async (id) => {
    const response = await api.get(`/trips/${id}/`);
    return response.data;
  },
  createTrip: async (tripData) => {
    const response = await api.post('/trips/', tripData);
    return response.data;
  },
  updateTrip: async (id, tripData) => {
    const response = await api.patch(`/trips/${id}/`, tripData);
    return response.data;
  },
  deleteTrip: async (id) => {
    await api.delete(`/trips/${id}/`);
  },
};

export default tripService;

