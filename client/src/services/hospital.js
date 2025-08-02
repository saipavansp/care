import api from './api';

const hospitalService = {
  // Search hospitals
  searchHospitals: async (searchParams = {}) => {
    const queryString = new URLSearchParams(searchParams).toString();
    const response = await api.get(`/hospitals/search?${queryString}`);
    return response.data;
  },

  // Get all hospitals
  getAllHospitals: async () => {
    const response = await api.get('/hospitals');
    return response.data;
  },

  // Get cities
  getCities: async () => {
    const response = await api.get('/hospitals/cities');
    return response.data;
  },

  // Get specialties
  getSpecialties: async () => {
    const response = await api.get('/hospitals/specialties');
    return response.data;
  }
};

export default hospitalService;