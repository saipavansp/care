import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiCheckCircle } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import BookingProgress from '../components/booking/BookingProgress';
import PatientDetailsStep from '../components/booking/PatientDetailsStep';
import AppointmentDetailsStep from '../components/booking/AppointmentDetailsStep';
import PickupLocationStep from '../components/booking/PickupLocationStep';
import PackageSelectionStep from '../components/booking/PackageSelectionStep';
import ReviewStep from '../components/booking/ReviewStep';
import bookingService from '../services/booking';
import toast from 'react-hot-toast';

const BookingPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [bookingData, setBookingData] = useState({
    // Patient Details
    patientName: '',
    patientAge: '',
    patientGender: '',
    contactEmail: '',
    medicalConditions: '',
    
    // Appointment Details
    hospital: '',
    hospitalAddress: '',
    doctor: '',
    department: '',
    appointmentDate: '',
    appointmentTime: '',
    
    // Pickup Location
    addressLine1: '',
    addressLine2: '',
    landmark: '',
    city: '',
    state: '',
    pincode: '',
    pickupAddress: '',
    pickupCoordinates: null,
    
    // Preferences removed
    
    // Package Details
    packageId: 'single',
    packageName: 'Single Visit Package',
    visits: 1,
    validity: 'One-time use',
    description: 'One-time hospital visit assistance',
    
    // Pricing
    totalAmount: 799,
    originalPrice: 799,
    savings: 0
  });

  const steps = [
    { number: 1, title: 'Patient Details' },
    { number: 2, title: 'Appointment' },
    { number: 3, title: 'Pickup Location' },
    { number: 4, title: 'Select Package' },
    { number: 5, title: 'Review & Pay' }
  ];

  const updateBookingData = (data) => {
    setBookingData(prev => ({ ...prev, ...data }));
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
      try { window.scrollTo({ top: 0, behavior: 'smooth' }); } catch {}
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      try { window.scrollTo({ top: 0, behavior: 'smooth' }); } catch {}
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await bookingService.createBooking(bookingData);
      // Clear any stored booking data
      localStorage.removeItem('pendingBooking');
      localStorage.removeItem('bookingReturnUrl');
      
      toast.success('Booking created successfully!');
      navigate(`/booking/${response.booking._id}`);
    } catch (error) {
      toast.error('Failed to create booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Guest booking allowed: no redirect on not authenticated
  React.useEffect(() => {}, []);

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <PatientDetailsStep
            data={bookingData}
            updateData={updateBookingData}
            onNext={handleNext}
          />
        );
      case 2:
        return (
          <AppointmentDetailsStep
            data={bookingData}
            updateData={updateBookingData}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      case 3:
        return (
          <PickupLocationStep
            data={bookingData}
            updateData={updateBookingData}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      case 4:
        return (
          <PackageSelectionStep
            data={bookingData}
            updateData={updateBookingData}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      case 5:
        return (
          <ReviewStep
            data={bookingData}
            onPrevious={handlePrevious}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            isAuthenticated={isAuthenticated}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-width-container section-padding">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-4">
              Book Your Healthcare Companion
            </h1>
            <p className="text-lg text-gray-600">
              Complete the form below to schedule your companion visit
            </p>
            <p className="text-sm text-orange-600 mt-2">
              No login required — you can book without creating an account.
            </p>
          </div>

          {/* Progress Bar */}
          <BookingProgress steps={steps} currentStep={currentStep} />

          {/* Form Content */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mt-8">
            {renderStep()}
          </div>

          {/* Trust Badges */}
          <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <FiCheckCircle className="text-green-500" />
              <span>No Registration Fee</span>
            </div>
            <div className="flex items-center space-x-2">
              <FiCheckCircle className="text-green-500" />
              <span>Trained Companions</span>
            </div>
            <div className="flex items-center space-x-2">
              <FiCheckCircle className="text-green-500" />
              <span>100% Secure Payment</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BookingPage;