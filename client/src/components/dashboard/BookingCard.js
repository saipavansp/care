import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCalendar, FiMapPin, FiUser, FiMoreVertical, FiEye, FiX, FiDownload, FiStar, FiRefreshCw, FiInfo, FiAlertCircle } from 'react-icons/fi';
import { formatDateTime, getStatusBadgeClass, canCancelBooking, isBookingPastAppointment } from '../../utils/helpers';
import bookingService from '../../services/booking';
import toast from 'react-hot-toast';
import LoadingSpinner from '../common/LoadingSpinner';
import RescheduleModal from './RescheduleModal';
import CompletionModal from './CompletionModal';

const BookingCard = ({ booking, onUpdate }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [showStatusHistory, setShowStatusHistory] = useState(false);

  const handleCancel = async () => {
    if (!cancelReason.trim()) {
      toast.error('Please provide a reason for cancellation');
      return;
    }

    setIsCancelling(true);
    try {
      await bookingService.cancelBooking(booking._id, cancelReason);
      toast.success('Booking cancelled successfully');
      setShowCancelModal(false);
      onUpdate();
    } catch (error) {
      toast.error('Failed to cancel booking');
    } finally {
      setIsCancelling(false);
    }
  };

  const canCancel = canCancelBooking(booking.appointmentDate, booking.status);
  const canReschedule = booking.status !== 'cancelled' && 
                       booking.status !== 'completed' && 
                       !isBookingPastAppointment(booking.appointmentDate, booking.appointmentTime);
  const needsCompletion = isBookingPastAppointment(booking.appointmentDate, booking.appointmentTime) && 
                         booking.status === 'in-progress';

  const handleReschedule = async (bookingId, rescheduleData) => {
    try {
      await bookingService.rescheduleBooking(bookingId, rescheduleData);
      toast.success('Booking rescheduled successfully');
      onUpdate();
    } catch (error) {
      toast.error('Failed to reschedule booking');
      throw error;
    }
  };

  const handleComplete = async (bookingId, feedback) => {
    try {
      await bookingService.updateCompletionStatus(bookingId, 'completed', feedback);
      toast.success('Booking marked as completed');
      onUpdate();
    } catch (error) {
      toast.error('Failed to update booking status');
    }
  };

  const handleMarkCancelled = async (bookingId, feedback) => {
    try {
      await bookingService.updateCompletionStatus(bookingId, 'cancelled', feedback);
      toast.success('Booking marked as cancelled');
      onUpdate();
    } catch (error) {
      toast.error('Failed to update booking status');
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow relative ${
          needsCompletion ? 'ring-2 ring-yellow-400 ring-opacity-50' : ''
        }`}
      >
        {/* Status Badge */}
        <div className="absolute top-4 right-4 flex items-center space-x-2">
          {needsCompletion && (
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 flex items-center">
              <FiAlertCircle className="w-3 h-3 mr-1" />
              Update Required
            </span>
          )}
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(booking.status)}`}>
            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
          </span>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Left Section - Booking Details */}
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {booking.hospital}
            </h3>
            
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <FiUser className="w-4 h-4" />
                <span>{booking.patientName} • Dr. {booking.doctor}</span>
              </div>
              <div className="flex items-center space-x-2">
                <FiCalendar className="w-4 h-4" />
                <span>{formatDateTime(booking.appointmentDate, booking.appointmentTime)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <FiMapPin className="w-4 h-4" />
                <span className="truncate max-w-xs">{booking.pickupAddress}</span>
              </div>
            </div>

            {/* Companion Info */}
            {booking.companion?.name && (
              <div className="mt-3 text-sm bg-blue-50 text-blue-700 px-3 py-2 rounded-lg inline-block">
                Companion: {booking.companion.name} • {booking.companion.phone}
              </div>
            )}
          </div>

          {/* Right Section - Actions */}
          <div className="flex items-center space-x-3">
            {needsCompletion && (
              <button
                onClick={() => setShowCompletionModal(true)}
                className="btn-primary text-sm inline-flex items-center"
              >
                <FiAlertCircle className="mr-2" />
                Update Status
              </button>
            )}
            
            <Link
              to={`/booking/${booking._id}`}
              className="btn-ghost text-sm inline-flex items-center"
            >
              <FiEye className="mr-2" />
              View Details
            </Link>

            {/* More Options */}
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <FiMoreVertical className="w-5 h-5 text-gray-600" />
              </button>

              {showMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg z-10 overflow-hidden">
                  {/* Status Info */}
                  <button
                    onClick={() => {
                      setShowStatusHistory(true);
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                  >
                    <FiInfo className="w-4 h-4" />
                    <span>View Status History</span>
                  </button>

                  {/* Reschedule */}
                  {canReschedule && (
                    <button
                      onClick={() => {
                        setShowRescheduleModal(true);
                        setShowMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                    >
                      <FiRefreshCw className="w-4 h-4" />
                      <span>Reschedule Appointment</span>
                    </button>
                  )}

                  {/* Completed Actions */}
                  {booking.status === 'completed' && (
                    <>
                      <div className="border-t border-gray-100 my-1"></div>
                      <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                        <FiDownload className="w-4 h-4" />
                        <span>Download Summary</span>
                      </button>
                      {!booking.rating && (
                        <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                          <FiStar className="w-4 h-4" />
                          <span>Rate Visit</span>
                        </button>
                      )}
                    </>
                  )}

                  {/* Cancel */}
                  {canCancel && (
                    <>
                      <div className="border-t border-gray-100 my-1"></div>
                      <button
                        onClick={() => {
                          setShowCancelModal(true);
                          setShowMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                      >
                        <FiX className="w-4 h-4" />
                        <span>Cancel Booking</span>
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Rating Display */}
        {booking.rating && (
          <div className="mt-4 flex items-center space-x-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <FiStar
                  key={i}
                  className={`w-4 h-4 ${
                    i < booking.rating.score
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">
              {booking.rating.feedback || 'Rated'}
            </span>
          </div>
        )}
      </motion.div>

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 max-w-md w-full"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Cancel Booking
            </h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to cancel this booking? This action cannot be undone.
            </p>
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Please provide a reason for cancellation..."
              className="input-field w-full mb-4 resize-none"
              rows={3}
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="btn-ghost"
                disabled={isCancelling}
              >
                Keep Booking
              </button>
              <button
                onClick={handleCancel}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors inline-flex items-center"
                disabled={isCancelling}
              >
                {isCancelling ? (
                  <LoadingSpinner size="small" color="white" />
                ) : (
                  'Cancel Booking'
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Reschedule Modal */}
      {showRescheduleModal && (
        <RescheduleModal
          booking={booking}
          onClose={() => setShowRescheduleModal(false)}
          onReschedule={handleReschedule}
        />
      )}

      {/* Completion Modal */}
      {showCompletionModal && (
        <CompletionModal
          booking={booking}
          onClose={() => setShowCompletionModal(false)}
          onComplete={handleComplete}
          onCancel={handleMarkCancelled}
        />
      )}

      {/* Status History Modal */}
      {showStatusHistory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 max-w-md w-full max-h-[80vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Booking Status History
              </h3>
              <button
                onClick={() => setShowStatusHistory(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* Current Status */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Current Status</h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeClass(booking.status)}`}>
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </span>
                <p className="text-sm text-gray-600 mt-2">
                  {formatDateTime(booking.appointmentDate, booking.appointmentTime)}
                </p>
              </div>
            </div>

            {/* History */}
            {booking.history && booking.history.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">History</h4>
                <div className="space-y-3">
                  {booking.history.map((item, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4 text-sm">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-gray-900">
                          {item.action.charAt(0).toUpperCase() + item.action.slice(1).replace('_', ' ')}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(item.changedAt).toLocaleDateString()}
                        </span>
                      </div>
                      {item.reason && (
                        <p className="text-gray-600 mt-1">Reason: {item.reason}</p>
                      )}
                      {item.previousDate && item.newDate && (
                        <p className="text-gray-600 mt-1">
                          Changed from {formatDateTime(item.previousDate, item.previousTime)} to{' '}
                          {formatDateTime(item.newDate, item.newTime)}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(!booking.history || booking.history.length === 0) && (
              <p className="text-gray-500 text-sm">No status changes recorded.</p>
            )}
          </motion.div>
        </div>
      )}
    </>
  );
};

export default BookingCard;