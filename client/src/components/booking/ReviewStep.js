import React from 'react';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiCheck, FiEdit2, FiUser } from 'react-icons/fi';
import { formatDate, formatCurrency } from '../../utils/helpers';
import LoadingSpinner from '../common/LoadingSpinner';
import { Link } from 'react-router-dom';

const ReviewStep = ({ data, onPrevious, onSubmit, isSubmitting, isAuthenticated }) => {
  const sections = [
    {
      title: 'Patient Information',
      items: [
        { label: 'Name', value: data.patientName },
        { label: 'Age', value: `${data.patientAge} years` },
        { label: 'Gender', value: data.patientGender },
        { label: 'Medical Conditions', value: data.medicalConditions || 'None specified' }
      ]
    },
    {
      title: 'Appointment Details',
      items: [
        { label: 'Hospital', value: data.hospital },
        { label: 'Hospital Address', value: data.hospitalAddress },
        { label: 'Doctor', value: data.doctor },
        { label: 'Department', value: data.department },
        { label: 'Date', value: formatDate(data.appointmentDate) },
        { label: 'Time', value: data.appointmentTime }
      ]
    },
    {
      title: 'Pickup Information',
      items: [
        { label: 'Address', value: data.pickupAddress },
        { label: 'City', value: `${data.city}, ${data.state}` },
        { label: 'PIN Code', value: data.pincode }
      ]
    },
    {
      title: 'Preferences',
      items: [
        { label: 'Language', value: data.preferredLanguage },
        { label: 'Special Requirements', value: data.specialRequirements || 'None' }
      ]
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <h2 className="text-2xl font-heading font-semibold text-gray-900 mb-6">
        Review Your Booking
      </h2>
      <p className="text-gray-600 mb-8">
        Please review all details before confirming your booking
      </p>

      {/* Booking Summary */}
      <div className="space-y-6">
        {sections.map((section, index) => (
          <div key={index} className="bg-gray-50 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-4">{section.title}</h3>
            <div className="space-y-3">
              {section.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-start">
                  <span className="text-sm text-gray-600">{item.label}:</span>
                  <span className="text-sm font-medium text-gray-900 text-right max-w-xs">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Pricing */}
        <div className="bg-primary/10 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Pricing Details</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">{data.packageName} ({data.visits} {data.visits > 1 ? 'visits' : 'visit'})</span>
              <span className="font-medium">{formatCurrency(data.totalAmount)}</span>
            </div>
            
            {data.originalPrice && data.originalPrice > data.totalAmount && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-green-700">Package Savings</span>
                <span className="font-medium text-green-700">-{formatCurrency(data.originalPrice - data.totalAmount)}</span>
              </div>
            )}
            
            <div className="border-t pt-3">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-900">Total Amount</span>
                <div className="text-right">
                  {data.originalPrice && data.originalPrice > data.totalAmount && (
                    <div className="text-sm text-gray-500 line-through">
                      {formatCurrency(data.originalPrice)}
                    </div>
                  )}
                  <span className="text-xl font-bold text-primary">{formatCurrency(data.totalAmount)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Terms & Conditions */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="font-medium text-yellow-900 mb-2">Important Information</h4>
          <ul className="text-sm text-yellow-800 space-y-1">
            <li>• Companion will arrive 30 minutes before appointment time</li>
            <li>• Service includes door-to-door pickup and drop</li>
            <li>• Digital visit summary will be shared within 2 hours</li>
            <li>• Cancellation allowed up to 2 hours before appointment</li>
          </ul>
        </div>

        {/* Login/Payment Section */}
        {!isAuthenticated ? (
          <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-6 text-center">
            <FiUser className="w-12 h-12 text-orange-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Login Required for Payment
            </h3>
            <p className="text-gray-600 mb-4">
              Please login or create an account to complete your booking and proceed to payment
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/login"
                state={{ 
                  from: { pathname: '/book' },
                  message: 'Please login to complete your booking'
                }}
                className="btn-primary inline-flex items-center justify-center"
              >
                Login to Continue
              </Link>
              <Link
                to="/register"
                state={{ 
                  from: { pathname: '/book' },
                  message: 'Create an account to complete your booking'
                }}
                className="btn-secondary inline-flex items-center justify-center"
              >
                Create Account
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="terms"
              required
              className="mt-1 h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <label htmlFor="terms" className="text-sm text-gray-700">
              I confirm that all the information provided is accurate and I agree to the 
              booking terms and conditions
            </label>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-8">
        <button
          type="button"
          onClick={onPrevious}
          disabled={isSubmitting}
          className="btn-ghost inline-flex items-center"
        >
          <FiArrowLeft className="mr-2" />
          Previous
        </button>
        
        {isAuthenticated && (
          <button
            onClick={onSubmit}
            disabled={isSubmitting}
            className="btn-primary inline-flex items-center min-w-[150px] justify-center"
          >
            {isSubmitting ? (
              <LoadingSpinner size="small" color="white" />
            ) : (
              <>
                <FiCheck className="mr-2" />
                Proceed to Payment
              </>
            )}
          </button>
        )}
      </div>

      {/* Edit Options */}
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-600">
          Need to make changes?{' '}
          <button
            type="button"
            onClick={onPrevious}
            className="text-primary hover:text-primary-dark inline-flex items-center"
          >
            <FiEdit2 className="w-3 h-3 mr-1" />
            Edit details
          </button>
        </p>
      </div>
    </motion.div>
  );
};

export default ReviewStep;