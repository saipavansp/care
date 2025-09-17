import React from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { FiUser, FiCalendar, FiHeart, FiArrowRight } from 'react-icons/fi';
import { GENDERS } from '../../utils/constants';

const PatientDetailsStep = ({ data, updateData, onNext }) => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      patientName: data.patientName,
      patientAge: data.patientAge,
      patientGender: data.patientGender,
      contactEmail: data.contactEmail
    }
  });

  const onSubmit = (formData) => {
    updateData(formData);
    onNext();
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <h2 className="text-2xl font-heading font-semibold text-gray-900 mb-6">
        Patient Details
      </h2>
      <p className="text-gray-600 mb-8">
        Please provide information about the patient who needs companion service
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Patient Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Patient Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiUser className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              {...register('patientName', {
                required: 'Patient name is required',
                minLength: {
                  value: 2,
                  message: 'Name must be at least 2 characters'
                }
              })}
              className="input-field pl-10"
              placeholder="Enter patient's full name"
            />
          </div>
          {errors.patientName && (
            <p className="error-text">{errors.patientName.message}</p>
          )}
        </div>

        {/* Age and Gender */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Age */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Age <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiCalendar className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="number"
                {...register('patientAge', {
                  required: 'Age is required',
                  min: {
                    value: 1,
                    message: 'Age must be at least 1'
                  },
                  max: {
                    value: 120,
                    message: 'Please enter a valid age'
                  }
                })}
                className="input-field pl-10"
                placeholder="Enter age"
              />
            </div>
            {errors.patientAge && (
              <p className="error-text">{errors.patientAge.message}</p>
            )}
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gender <span className="text-red-500">*</span>
            </label>
            <select
              {...register('patientGender', {
                required: 'Please select gender'
              })}
              className="input-field"
            >
              <option value="">Select gender</option>
              {GENDERS.map((gender) => (
                <option key={gender.value} value={gender.value}>
                  {gender.label}
                </option>
              ))}
            </select>
            {errors.patientGender && (
              <p className="error-text">{errors.patientGender.message}</p>
            )}
          </div>
        </div>

        {/* Contact Email for updates/confirmation (optional for guests) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contact Email (for booking updates)
          </label>
          <input
            type="email"
            {...register('contactEmail', {
              pattern: {
                value: /^(?:[a-zA-Z0-9_'^&\/+-])+(?:\.(?:[a-zA-Z0-9_'^&\/+-])+)*@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/,
                message: 'Please enter a valid email'
              }
            })}
            className="input-field"
            placeholder="you@example.com"
          />
          {errors.contactEmail && (
            <p className="error-text">{errors.contactEmail.message}</p>
          )}
        </div>

        {/* Medical Conditions removed as requested */}

        {/* Navigation */}
        <div className="flex justify-end pt-6">
          <button
            type="submit"
            className="btn-primary inline-flex items-center"
          >
            Continue
            <FiArrowRight className="ml-2" />
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default PatientDetailsStep;