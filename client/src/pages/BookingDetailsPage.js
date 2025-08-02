import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiCalendar, FiClock, FiMapPin, FiUser, FiPhone, FiDownload, FiStar } from 'react-icons/fi';
import { FaHospital, FaUserMd } from 'react-icons/fa';
import bookingService from '../services/booking';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { formatDateTime, getStatusBadgeClass, formatCurrency } from '../utils/helpers';
import toast from 'react-hot-toast';

const BookingDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    fetchBookingDetails();
  }, [id]);

  const fetchBookingDetails = async () => {
    setIsLoading(true);
    try {
      const response = await bookingService.getBooking(id);
      setBooking(response.booking);
    } catch (error) {
      console.error('Error fetching booking details:', error);
      toast.error('Failed to load booking details');
      navigate('/dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRatingSubmit = async () => {
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    try {
      await bookingService.addRating(booking._id, { score: rating, feedback });
      toast.success('Thank you for your feedback!');
      setShowRatingModal(false);
      fetchBookingDetails();
    } catch (error) {
      toast.error('Failed to submit rating');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!booking) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-width-container section-padding">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link
            to="/dashboard"
            className="inline-flex items-center text-gray-600 hover:text-primary mb-4"
          >
            <FiArrowLeft className="mr-2" />
            Back to Dashboard
          </Link>
          
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-heading font-bold text-gray-900">
              Booking Details
            </h1>
            <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusBadgeClass(booking.status)}`}>
              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </span>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Patient Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Patient Information</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Patient Name</p>
                  <p className="font-medium text-gray-900">{booking.patientName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Age & Gender</p>
                  <p className="font-medium text-gray-900">
                    {booking.patientAge} years • {booking.patientGender}
                  </p>
                </div>
                {booking.medicalConditions && (
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-600">Medical Conditions</p>
                    <p className="font-medium text-gray-900">{booking.medicalConditions}</p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Appointment Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Appointment Details</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <FaHospital className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Hospital</p>
                    <p className="font-medium text-gray-900">{booking.hospital}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <FaUserMd className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Doctor</p>
                    <p className="font-medium text-gray-900">
                      Dr. {booking.doctor}
                      {booking.department && ` • ${booking.department}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <FiCalendar className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Date & Time</p>
                    <p className="font-medium text-gray-900">
                      {formatDateTime(booking.appointmentDate, booking.appointmentTime)}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Pickup Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Pickup Information</h2>
              <div className="flex items-start space-x-3">
                <FiMapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Pickup Address</p>
                  <p className="font-medium text-gray-900">{booking.pickupAddress}</p>
                </div>
              </div>
            </motion.div>

            {/* Visit Summary (if completed) */}
            {booking.status === 'completed' && booking.visitSummary && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-xl shadow-sm p-6"
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Visit Summary</h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Visit Notes</p>
                    <p className="text-gray-900 whitespace-pre-wrap">{booking.visitSummary.notes}</p>
                  </div>
                  
                  {booking.visitSummary.prescriptions?.length > 0 && (
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Prescriptions</p>
                      <ul className="space-y-2">
                        {booking.visitSummary.prescriptions.map((prescription, index) => (
                          <li key={index} className="bg-gray-50 p-3 rounded-lg">
                            <p className="font-medium">{prescription.medicine}</p>
                            <p className="text-sm text-gray-600">
                              {prescription.dosage} • {prescription.duration}
                            </p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <button className="btn-secondary inline-flex items-center">
                    <FiDownload className="mr-2" />
                    Download Full Report
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Companion Information */}
            {booking.companion?.name && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl shadow-sm p-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Companion Details</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <FiUser className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Name</p>
                      <p className="font-medium text-gray-900">{booking.companion.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FiPhone className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Contact</p>
                      <p className="font-medium text-gray-900">{booking.companion.phone}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Pricing Details */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Service Fee</span>
                  <span className="font-medium">{formatCurrency(booking.totalAmount)}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-900">Total Paid</span>
                    <span className="text-lg font-bold text-primary">
                      {formatCurrency(booking.totalAmount)}
                    </span>
                  </div>
                </div>
                <div className="text-center pt-2">
                  <span className={`text-sm ${booking.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>
                    Payment {booking.paymentStatus}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
              <div className="space-y-3">
                {booking.status === 'completed' && !booking.rating && (
                  <button
                    onClick={() => setShowRatingModal(true)}
                    className="w-full btn-primary inline-flex items-center justify-center"
                  >
                    <FiStar className="mr-2" />
                    Rate Your Experience
                  </button>
                )}
                <Link
                  to="/book"
                  className="w-full btn-secondary inline-flex items-center justify-center"
                >
                  Book Another Visit
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Rating Modal */}
      {showRatingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 max-w-md w-full"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Rate Your Experience
            </h3>
            <div className="flex justify-center mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className="p-1"
                >
                  <FiStar
                    className={`w-8 h-8 ${
                      star <= rating
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Share your experience (optional)..."
              className="input-field w-full mb-4 resize-none"
              rows={3}
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowRatingModal(false)}
                className="btn-ghost"
              >
                Cancel
              </button>
              <button
                onClick={handleRatingSubmit}
                className="btn-primary"
              >
                Submit Rating
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default BookingDetailsPage;