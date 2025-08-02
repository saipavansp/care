export const APP_NAME = 'Care Companion';

export const LANGUAGES = [
  'Hindi',
  'English',
  'Bengali',
  'Telugu',
  'Marathi',
  'Tamil',
  'Gujarati',
  'Kannada'
];

export const GENDERS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' }
];

export const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  ASSIGNED: 'assigned',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

export const BOOKING_STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  assigned: 'bg-purple-100 text-purple-800',
  'in-progress': 'bg-indigo-100 text-indigo-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800'
};

export const TESTIMONIALS = [
  {
    id: 1,
    name: 'Priya Sharma',
    role: 'Daughter',
    content: 'Care Companion has been a lifesaver for my elderly mother. The companions are professional, caring, and provide detailed updates after each visit.',
    rating: 5,
    image: 'https://i.pravatar.cc/100?img=1'
  },
  {
    id: 2,
    name: 'Rajesh Kumar',
    role: 'Son',
    content: 'Excellent service! The companion helped my father navigate the hospital, took detailed notes, and even helped with the pharmacy. Highly recommended!',
    rating: 5,
    image: 'https://i.pravatar.cc/100?img=2'
  },
  {
    id: 3,
    name: 'Anita Patel',
    role: 'Patient',
    content: 'As someone living alone, having a companion for my hospital visits gives me confidence. They handle everything professionally and with care.',
    rating: 5,
    image: 'https://i.pravatar.cc/100?img=3'
  }
];

export const BENEFITS = [
  {
    title: 'Door-to-Door Service',
    description: 'Pick up from home and safe return after the appointment',
    icon: '🚗'
  },
  {
    title: 'In-Clinic Support',
    description: 'Navigate hospital processes and advocate for patient needs',
    icon: '🏥'
  },
  {
    title: 'Detailed Documentation',
    description: 'Digital summary of visit, prescriptions, and follow-up instructions',
    icon: '📋'
  },
  {
    title: 'Family Updates',
    description: 'Real-time WhatsApp updates to keep family members informed',
    icon: '💬'
  }
];

export const HOW_IT_WORKS_STEPS = [
  {
    step: 1,
    title: 'Book a Companion',
    description: 'Fill a simple form with patient and appointment details',
    icon: '📝'
  },
  {
    step: 2,
    title: 'Get Picked Up',
    description: 'Our companion arrives at your doorstep on time',
    icon: '🚗'
  },
  {
    step: 3,
    title: 'Hospital Support',
    description: 'Complete assistance during the hospital visit',
    icon: '🏥'
  },
  {
    step: 4,
    title: 'Digital Summary',
    description: 'Receive detailed visit report and prescriptions',
    icon: '📱'
  }
];

export const WHATSAPP_NUMBER = '+919876543210';
export const WHATSAPP_MESSAGE = 'Hi, I would like to know more about Care Companion services.';

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PHONE_REGEX = /^[6-9]\d{9}$/;