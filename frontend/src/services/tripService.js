import api from './api';

const tripService = {
  createTrip: async (tripData) => {
    const response = await api.post('/trips/', tripData);
    return response.data;
  },
};

export default tripService;
