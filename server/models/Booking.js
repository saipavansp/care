const mongoose = require('mongoose');

// Function to generate a unique booking ID
const generateBookingId = () => {
  // Format: KP-YYYYMMDD-XXXX where XXXX is a random number
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const randomPart = Math.floor(1000 + Math.random() * 9000); // 4-digit random number
  
  return `KP-${year}${month}${day}-${randomPart}`;
};

const bookingSchema = new mongoose.Schema({
  bookingId: {
    type: String,
    unique: true,
    default: generateBookingId
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  patientName: {
    type: String,
    required: true,
    trim: true
  },
  patientAge: {
    type: Number,
    required: true,
    min: 1,
    max: 120
  },
  patientGender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: true
  },
  medicalConditions: {
    type: String,
    trim: true
  },
  hospital: {
    type: String,
    required: true,
    trim: true
  },
  hospitalAddress: {
    type: String,
    required: true,
    trim: true
  },
  doctor: {
    type: String,
    required: false,
    trim: true
  },
  department: {
    type: String,
    required: false,
    trim: true
  },
  appointmentDate: {
    type: Date,
    required: true
  },
  appointmentTime: {
    type: String,
    required: true
  },
  // Detailed pickup address fields
  addressLine1: {
    type: String,
    required: true,
    trim: true
  },
  addressLine2: {
    type: String,
    trim: true
  },
  landmark: {
    type: String,
    trim: true
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  state: {
    type: String,
    required: true,
    trim: true
  },
  pincode: {
    type: String,
    required: true,
    match: /^[1-9][0-9]{5}$/
  },
  pickupAddress: {
    type: String,
    required: true
  },
  pickupCoordinates: {
    lat: {
      type: Number
    },
    lng: {
      type: Number
    }
  },
  preferredLanguage: {
    type: String,
    default: 'Hindi',
    enum: ['Hindi', 'English', 'Bengali', 'Telugu', 'Marathi', 'Tamil', 'Gujarati', 'Kannada']
  },
  specialRequirements: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'assigned', 'in-progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['online', 'cash'],
    default: 'online'
  },
  companion: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    name: String,
    phone: String,
    assignedAt: Date
  },
  visitSummary: {
    notes: String,
    prescriptions: [{
      medicine: String,
      dosage: String,
      duration: String
    }],
    nextAppointment: Date,
    tests: [String],
    uploadedAt: Date,
    fileUrl: String
  },
  rating: {
    score: {
      type: Number,
      min: 1,
      max: 5
    },
    feedback: String,
    ratedAt: Date
  },
  cancellationReason: String,
  cancelledAt: Date,
  cancelledBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  // Booking history for tracking changes
  history: [{
    action: {
      type: String,
      enum: ['created', 'rescheduled', 'cancelled', 'status_changed']
    },
    previousDate: Date,
    previousTime: String,
    newDate: Date,
    newTime: String,
    previousStatus: String,
    newStatus: String,
    reason: String,
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    changedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Index for searching
bookingSchema.index({ userId: 1, status: 1 });
bookingSchema.index({ appointmentDate: 1 });
bookingSchema.index({ 'companion.id': 1 });

// Virtual for formatted appointment time
bookingSchema.virtual('formattedAppointmentTime').get(function() {
  const date = new Date(this.appointmentDate);
  return `${date.toDateString()} at ${this.appointmentTime}`;
});

// Method to check if booking can be cancelled
bookingSchema.methods.canBeCancelled = function() {
  const now = new Date();
  const appointmentDateTime = new Date(this.appointmentDate);
  const hoursUntilAppointment = (appointmentDateTime - now) / (1000 * 60 * 60);
  
  return this.status !== 'cancelled' && 
         this.status !== 'completed' && 
         hoursUntilAppointment > 2; // Can cancel if more than 2 hours before appointment
};

module.exports = mongoose.model('Booking', bookingSchema);