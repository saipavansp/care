import React from 'react';
import { FiCalendar, FiClock, FiUser, FiMapPin, FiAlertCircle } from 'react-icons/fi';
import { formatDate } from '../../utils/helpers';

const BookingSummary = ({ bookingData, existingBookings = [] }) => {
  // Find other bookings on the same day
  const sameDayBookings = existingBookings.filter(booking => {
    const bookingDate = new Date(booking.appointmentDate);
    const currentDate = new Date(bookingData.appointmentDate);
    return bookingDate.toDateString() === currentDate.toDateString() &&
           booking.status !== 'cancelled' && 
           booking.status !== 'completed';
  });

  return (
    <div className="space-y-4">
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Booking Summary
        </h3>
        
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <FiUser className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-700">Patient Details</p>
              <p className="text-sm text-gray-600">
                {bookingData.patientName} • {bookingData.patientAge} years • {bookingData.patientGender}
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <FiCalendar className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-700">Appointment</p>
              <p className="text-sm text-gray-600">
                {formatDate(bookingData.appointmentDate)} at {bookingData.appointmentTime}
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <FiMapPin className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-700">Hospital</p>
              <p className="text-sm text-gray-600">
                {bookingData.hospital} • Dr. {bookingData.doctor}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Show other appointments on the same day */}
      {sameDayBookings.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <FiAlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-900">
                You have {sameDayBookings.length} other appointment{sameDayBookings.length > 1 ? 's' : ''} on this day
              </p>
              <div className="mt-2 space-y-1">
                {sameDayBookings.map((booking, index) => (
                  <p key={index} className="text-xs text-blue-700">
                    • {booking.patientName} at {booking.appointmentTime} - {booking.hospital}
                  </p>
                ))}
              </div>
              <p className="text-xs text-blue-600 mt-2">
                Please ensure you have enough time between appointments for travel.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Booking tips */}
      <div className="bg-yellow-50 rounded-lg p-4">
        <h4 className="text-sm font-medium text-yellow-900 mb-2">
          Booking Tips
        </h4>
        <ul className="text-xs text-yellow-700 space-y-1">
          <li>• You can book multiple appointments on the same day for different patients</li>
          <li>• Ensure appointments are at different times to avoid conflicts</li>
          <li>• Consider travel time between hospitals when booking multiple appointments</li>
          <li>• You can reschedule appointments up to 24 hours before the scheduled time</li>
        </ul>
      </div>
    </div>
  );
};

export default BookingSummary;