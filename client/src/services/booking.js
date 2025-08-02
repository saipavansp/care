import api from './api';

const bookingService = {
  // Create new booking
  createBooking: async (bookingData) => {
    const response = await api.post('/bookings/create', bookingData);
    return response.data;
  },

  // Get user's bookings
  getUserBookings: async (userId, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await api.get(`/bookings/user/${userId}?${queryString}`);
    return response.data;
  },

  // Get single booking
  getBooking: async (bookingId) => {
    const response = await api.get(`/bookings/${bookingId}`);
    return response.data;
  },

  // Cancel booking
  cancelBooking: async (bookingId, reason) => {
    const response = await api.put(`/bookings/${bookingId}/cancel`, { reason });
    return response.data;
  },

  // Add rating
  addRating: async (bookingId, ratingData) => {
    const response = await api.post(`/bookings/${bookingId}/rating`, ratingData);
    return response.data;
  },

  // Get upcoming bookings
  getUpcomingBookings: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await api.get(`/bookings/upcoming/all?${queryString}`);
    return response.data;
  },

  // Update booking completion status
  updateCompletionStatus: async (bookingId, status, feedback) => {
    const response = await api.put(`/bookings/${bookingId}/complete`, { 
      status, 
      feedback 
    });
    return response.data;
  },

  // Reschedule booking
  rescheduleBooking: async (bookingId, rescheduleData) => {
    const response = await api.put(`/bookings/${bookingId}/reschedule`, rescheduleData);
    return response.data;
  }
};

export default bookingService;