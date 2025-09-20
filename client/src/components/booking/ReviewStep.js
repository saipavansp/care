import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiCheck, FiEdit2, FiAlertCircle } from 'react-icons/fi';
import { formatDate, formatCurrency } from '../../utils/helpers';
import LoadingSpinner from '../common/LoadingSpinner';
import toast from 'react-hot-toast';
import { trackEvent } from '../../utils/attribution';

const ReviewStep = ({ data, updateData, onPrevious, onSubmit, isSubmitting, isAuthenticated }) => {
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showTermsError, setShowTermsError] = useState(false);
  const [scrolledToEnd, setScrolledToEnd] = useState(true);
  const termsRef = useRef(null);
  const [promoInput, setPromoInput] = useState((data.promoCode || '').toString());
  const normalizedCode = (promoInput || '').trim().toUpperCase();
  const promoValid = normalizedCode === 'NCKLPRD' || normalizedCode === 'GLDPM';
  const payableAfterPromo = Math.max(0, Number(data.totalAmount || 0) - (promoValid ? 200 : 0));
  
  const handleSubmit = () => {
    if (!termsAccepted) {
      setShowTermsError(true);
      toast.error('Please accept the terms and conditions');
      return;
    }
    trackEvent('booking_submit_click', { totalAmount: data.totalAmount });
    onSubmit();
  };
  const sections = [
    {
      title: 'Patient Information',
      items: [
        { label: 'Name', value: data.patientName },
        { label: 'Age', value: `${data.patientAge} years` },
        { label: 'Gender', value: data.patientGender },
      ]
    },
    {
      title: 'Appointment Details',
      items: [
        { label: 'Hospital', value: data.hospital },
        { label: 'Hospital Address', value: data.hospitalAddress },
        { label: 'Doctor', value: data.doctor || '—' },
        { label: 'Department', value: data.department || '—' },
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
              <div>
                <span className="text-gray-700">{data.packageName} ({data.visits} {data.visits > 1 ? 'visits' : 'visit'})</span>
                <div className="text-xs text-gray-500 mt-1">Validity: {data.validity}</div>
                {data.description && <div className="text-xs text-gray-500">{data.description}</div>}
              </div>
              <span className="font-medium">{formatCurrency(data.totalAmount)}</span>
            </div>
            
            {data.originalPrice && data.originalPrice > data.totalAmount && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-green-700">Package Savings</span>
                <span className="font-medium text-green-700">-{formatCurrency(data.originalPrice - data.totalAmount)}</span>
              </div>
            )}
            
            {/* Promo Code (optional) */}
            <div className="bg-white/70 rounded-md p-3 border border-primary/20">
              <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                <input
                  type="text"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  placeholder="Enter promo (e.g., NCKLPRD or GLDPM) — optional"
                  className="input-field flex-1"
                />
                <button
                  type="button"
                  onClick={() => {
                    trackEvent('promo_apply_click', { code: promoInput });
                    updateData && updateData({ promoCode: promoInput.trim() });
                  }}
                  className={`px-4 py-2 rounded-lg font-medium ${promoValid ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-800'}`}
                >
                  {promoValid ? 'Applied' : 'Apply'}
                </button>
              </div>
              <p className="text-xs mt-1 ${promoValid ? 'text-green-700' : 'text-gray-600'}">Apply promo NCKLPRD or GLDPM to get ₹200 off on first booking. Exclusive for gated communities (shared internally).</p>
            </div>

            <div className="border-t pt-3">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-900">Total Amount</span>
                <div className="text-right">
                  {data.originalPrice && data.originalPrice > data.totalAmount && (
                    <div className="text-sm text-gray-500 line-through">
                      {formatCurrency(data.originalPrice)}
                    </div>
                  )}
                  {promoValid ? (
                    <div className="flex flex-col items-end">
                      <div className="text-sm text-gray-500 line-through">{formatCurrency(data.totalAmount)}</div>
                      <span className="text-xl font-bold text-primary">{formatCurrency(payableAfterPromo)}</span>
                    </div>
                  ) : (
                    <span className="text-xl font-bold text-primary">{formatCurrency(data.totalAmount)}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Terms */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="font-medium text-yellow-900 mb-2">Please read and confirm these booking terms</h4>
          <div
            ref={termsRef}
            className="max-h-48 overflow-y-auto pr-2 text-sm text-yellow-800 space-y-2"
          >
            <p>• No Emergency Cases – KinPin is not an emergency service. For urgent/critical care, call 108 or visit the nearest emergency.</p>
            <p>• Doctor Interaction Preference – Attenders will only interact with doctors if you (or the patient) permit them; otherwise they will remain outside the consultation room.</p>
            <p>• Non‑Medical Support – Attenders are not doctors/nurses and do not provide medical advice, diagnosis, or treatment.</p>
            <p>• Patient Responsibility – You confirm the patient is medically stable and fit for non‑emergency attendant assistance.</p>
            <p>• Travel Charges Excluded – Package price does not include travel/transport costs (cab/auto, tolls, parking). These are extra and borne by the customer.</p>
            <p>• Liability Limitation – KinPin is not responsible for medical outcomes, delays, or hospital/doctor actions.</p>
            <p>• Respectful Conduct – You agree to maintain respectful behavior towards the attender. Any harassment, abuse, or unsafe conduct may result in immediate cancellation without refund.</p>
          </div>
        </div>

        {/* Acceptance Section (shown for both guests and logged-in users) */}
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="terms"
              checked={termsAccepted}
              onChange={(e) => {
                setTermsAccepted(e.target.checked);
                if (e.target.checked) setShowTermsError(false);
              }}
              className={`mt-1 h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded ${
                showTermsError ? 'border-red-500 ring-1 ring-red-500' : ''
              }`}
              disabled={false}
            />
            <label htmlFor="terms" className="text-sm text-gray-700">
              I have read and agree to the booking terms and conditions above, and I confirm all information provided is accurate.
            </label>
          </div>

          {showTermsError && (
            <div className="flex items-center text-red-500 text-sm">
              <FiAlertCircle className="mr-1" />
              <span>You must accept the terms and conditions to proceed</span>
            </div>
          )}
        </div>
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
        
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="btn-primary inline-flex items-center min-w-[150px] justify-center"
        >
          {isSubmitting ? (
            <LoadingSpinner size="small" color="white" />
          ) : (
            <>
              <FiCheck className="mr-2" />
              Confirm Booking
            </>
          )}
        </button>
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