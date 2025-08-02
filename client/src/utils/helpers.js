import { format, parseISO } from 'date-fns';

// Format date
export const formatDate = (date) => {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'dd MMM yyyy');
};

// Format date and time
export const formatDateTime = (date, time) => {
  if (!date) return '';
  const dateStr = formatDate(date);
  return `${dateStr} at ${time}`;
};

// Format currency
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

// Format phone number
export const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  return phone.replace(/(\d{5})(\d{5})/, '$1 $2');
};

// Validate email
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate phone
export const isValidPhone = (phone) => {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone);
};

// Get initials
export const getInitials = (name) => {
  if (!name) return '';
  const parts = name.split(' ');
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
};

// Truncate text
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

// Get status badge class
export const getStatusBadgeClass = (status) => {
  const classes = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    assigned: 'bg-purple-100 text-purple-800',
    'in-progress': 'bg-indigo-100 text-indigo-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
  };
  return classes[status] || 'bg-gray-100 text-gray-800';
};

// Calculate age
export const calculateAge = (birthDate) => {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
};

// Get greeting based on time
export const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
};

// Generate WhatsApp URL
export const generateWhatsAppUrl = (phone, message) => {
  const cleanPhone = phone.replace(/\D/g, '');
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
};

// Check if booking can be cancelled
export const canCancelBooking = (appointmentDate, status) => {
  if (status === 'cancelled' || status === 'completed') return false;
  
  const now = new Date();
  const appointment = new Date(appointmentDate);
  const hoursUntilAppointment = (appointment - now) / (1000 * 60 * 60);
  
  return hoursUntilAppointment > 2; // Can cancel if more than 2 hours before appointment
};

// Check if booking appointment time has passed
export const isBookingPastAppointment = (appointmentDate, appointmentTime) => {
  const [time, period] = appointmentTime.split(' ');
  const [hours, minutes] = time.split(':').map(Number);
  
  const appointment = new Date(appointmentDate);
  let appointmentHours = hours;
  
  if (period === 'PM' && hours !== 12) {
    appointmentHours += 12;
  } else if (period === 'AM' && hours === 12) {
    appointmentHours = 0;
  }
  
  appointment.setHours(appointmentHours, minutes, 0, 0);
  
  return new Date() > appointment;
};

// Debounce function
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};