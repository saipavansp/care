import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiCalendar, FiClock, FiX } from 'react-icons/fi';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import LoadingSpinner from '../common/LoadingSpinner';
import toast from 'react-hot-toast';
import { formatDate } from '../../utils/helpers';

const RescheduleModal = ({ booking, onClose, onReschedule }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Generate time slots (same as booking page)
  const generateTimeSlots = () => {
    const slots = [];
    const startHour = 9; // 9 AM
    const endHour = 17; // 5 PM

    for (let hour = startHour; hour < endHour; hour++) {
      slots.push(`${hour}:00 AM`);
      slots.push(`${hour}:30 AM`);
    }
    slots.push('5:00 PM');
    slots.push('5:30 PM');

    return slots.map(time => {
      const displayHour = parseInt(time.split(':')[0]);
      const period = time.includes('PM') ? 'PM' : 'AM';
      const hour12 = displayHour > 12 ? displayHour - 12 : displayHour;
      return `${hour12}:${time.split(':')[1].split(' ')[0]} ${period}`;
    });
  };

  const timeSlots = generateTimeSlots();

  const handleSubmit = async () => {
    if (!selectedDate || !selectedTime) {
      toast.error('Please select both date and time');
      return;
    }

    if (!reason.trim()) {
      toast.error('Please provide a reason for rescheduling');
      return;
    }

    setIsSubmitting(true);
    try {
      await onReschedule(booking._id, {
        appointmentDate: selectedDate,
        appointmentTime: selectedTime,
        rescheduleReason: reason
      });
      toast.success('Booking rescheduled successfully');
      onClose();
    } catch (error) {
      toast.error('Failed to reschedule booking');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Disable past dates and dates within 24 hours
  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Reschedule Appointment
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Current Appointment Info */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-600 mb-2">Current Appointment:</p>
          <div className="space-y-1">
            <p className="font-medium text-gray-900">{booking.hospital}</p>
            <p className="text-sm text-gray-700">
              Dr. {booking.doctor} • {booking.department}
            </p>
            <div className="flex items-center space-x-4 text-sm text-gray-600 mt-2">
              <span className="flex items-center">
                <FiCalendar className="w-4 h-4 mr-1" />
                {formatDate(booking.appointmentDate)}
              </span>
              <span className="flex items-center">
                <FiClock className="w-4 h-4 mr-1" />
                {booking.appointmentTime}
              </span>
            </div>
          </div>
        </div>

        {/* New Date Selection */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select New Date <span className="text-red-500">*</span>
            </label>
            <DatePicker
              selected={selectedDate}
              onChange={setSelectedDate}
              minDate={minDate}
              dateFormat="dd/MM/yyyy"
              placeholderText="Select date"
              className="input-field w-full"
              excludeDates={[new Date(booking.appointmentDate)]}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select New Time <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="input-field w-full"
            >
              <option value="">Select time</option>
              {timeSlots.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason for Rescheduling <span className="text-red-500">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Please provide a reason for rescheduling..."
              className="input-field w-full resize-none"
              rows={3}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onClose}
            className="btn-ghost"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !selectedDate || !selectedTime || !reason.trim()}
            className="btn-primary inline-flex items-center"
          >
            {isSubmitting ? (
              <LoadingSpinner size="small" color="white" />
            ) : (
              <>
                <FiCalendar className="mr-2" />
                Reschedule
              </>
            )}
          </button>
        </div>

        {/* Notice */}
        <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
          <p className="text-xs text-yellow-800">
            <strong>Note:</strong> Rescheduling is subject to availability. You will receive a confirmation once the new appointment is confirmed.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default RescheduleModal;