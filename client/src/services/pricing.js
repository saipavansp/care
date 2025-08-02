import api from './api';

const pricingService = {
  // Get all pricing plans
  getPricingPlans: async () => {
    const response = await api.get('/pricing');
    return response.data;
  },

  // Get single pricing plan
  getPricingPlan: async (planId) => {
    const response = await api.get(`/pricing/${planId}`);
    return response.data;
  },

  // Calculate custom pricing
  calculatePricing: async (params) => {
    const response = await api.post('/pricing/calculate', params);
    return response.data;
  }
};

export default pricingService;