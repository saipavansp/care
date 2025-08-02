import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiXCircle, FiAlertCircle } from 'react-icons/fi';
import LoadingSpinner from '../common/LoadingSpinner';

const CompletionModal = ({ booking, onClose, onComplete, onCancel }) => {
  const [selectedStatus, setSelectedStatus] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!selectedStatus) return;

    setIsSubmitting(true);
    try {
      if (selectedStatus === 'completed') {
        await onComplete(booking._id, feedback);
      } else {
        await onCancel(booking._id, feedback || 'Service not completed as scheduled');
      }
      onClose();
    } catch (error) {
      console.error('Error updating booking status:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg p-6 max-w-md w-full"
      >
        <div className="flex items-center mb-4">
          <FiAlertCircle className="w-6 h-6 text-yellow-500 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">
            Update Booking Status
          </h3>
        </div>

        <div className="mb-4">
          <p className="text-gray-600 mb-2">
            Your appointment at <strong>{booking.hospital}</strong> on{' '}
            <strong>{new Date(booking.appointmentDate).toLocaleDateString()}</strong> at{' '}
            <strong>{booking.appointmentTime}</strong> has passed.
          </p>
          <p className="text-gray-600">
            Please update the status to help us improve our service:
          </p>
        </div>

        <div className="space-y-3 mb-4">
          <button
            onClick={() => setSelectedStatus('completed')}
            className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
              selectedStatus === 'completed'
                ? 'border-green-500 bg-green-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center">
              <FiCheckCircle className={`w-5 h-5 mr-3 ${
                selectedStatus === 'completed' ? 'text-green-600' : 'text-gray-400'
              }`} />
              <div>
                <p className="font-medium text-gray-900">Appointment Completed</p>
                <p className="text-sm text-gray-600">
                  I attended the appointment successfully
                </p>
              </div>
            </div>
          </button>

          <button
            onClick={() => setSelectedStatus('cancelled')}
            className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
              selectedStatus === 'cancelled'
                ? 'border-red-500 bg-red-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center">
              <FiXCircle className={`w-5 h-5 mr-3 ${
                selectedStatus === 'cancelled' ? 'text-red-600' : 'text-gray-400'
              }`} />
              <div>
                <p className="font-medium text-gray-900">Appointment Not Completed</p>
                <p className="text-sm text-gray-600">
                  I could not attend or complete the appointment
                </p>
              </div>
            </div>
          </button>
        </div>

        {selectedStatus && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-4"
          >
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {selectedStatus === 'completed' 
                ? 'How was your experience? (Optional)'
                : 'What happened? (Optional)'}
            </label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder={
                selectedStatus === 'completed'
                  ? 'Share your experience with our companion service...'
                  : 'Let us know what went wrong so we can improve...'
              }
              className="input-field w-full resize-none"
              rows={3}
            />
          </motion.div>
        )}

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="btn-ghost"
            disabled={isSubmitting}
          >
            Ask Later
          </button>
          <button
            onClick={handleSubmit}
            disabled={!selectedStatus || isSubmitting}
            className={`px-4 py-2 rounded-lg font-medium transition-all inline-flex items-center ${
              selectedStatus
                ? selectedStatus === 'completed'
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? (
              <LoadingSpinner size="small" color="white" />
            ) : (
              'Update Status'
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default CompletionModal;