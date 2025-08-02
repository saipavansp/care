import React from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { FiGlobe, FiFileText, FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import { LANGUAGES } from '../../utils/constants';

const PreferencesStep = ({ data, updateData, onNext, onPrevious }) => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      preferredLanguage: data.preferredLanguage || 'Hindi',
      specialRequirements: data.specialRequirements
    }
  });

  const onSubmit = (formData) => {
    updateData(formData);
    onNext();
  };

  const additionalServices = [
    {
      id: 'wheelchair',
      label: 'Wheelchair assistance',
      description: 'Companion will arrange wheelchair at hospital'
    },
    {
      id: 'reports',
      label: 'Previous reports management',
      description: 'Help organizing and presenting medical reports'
    },
    {
      id: 'pharmacy',
      label: 'Pharmacy assistance',
      description: 'Help with medicine purchase after consultation'
    },
    {
      id: 'translation',
      label: 'Medical translation',
      description: 'Explain medical terms in simple language'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <h2 className="text-2xl font-heading font-semibold text-gray-900 mb-6">
        Preferences
      </h2>
      <p className="text-gray-600 mb-8">
        Help us personalize the service for you
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Preferred Language */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Preferred Language <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiGlobe className="h-5 w-5 text-gray-400" />
            </div>
            <select
              {...register('preferredLanguage', {
                required: 'Please select a language'
              })}
              className="input-field pl-10"
            >
              {LANGUAGES.map((language) => (
                <option key={language} value={language}>
                  {language}
                </option>
              ))}
            </select>
          </div>
          {errors.preferredLanguage && (
            <p className="error-text">{errors.preferredLanguage.message}</p>
          )}
        </div>

        {/* Additional Services */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Additional Services Required
          </label>
          <div className="space-y-3">
            {additionalServices.map((service) => (
              <label
                key={service.id}
                className="flex items-start space-x-3 cursor-pointer hover:bg-gray-50 p-3 rounded-lg transition-colors"
              >
                <input
                  type="checkbox"
                  {...register(`services.${service.id}`)}
                  className="mt-1 h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <div>
                  <p className="font-medium text-gray-900">{service.label}</p>
                  <p className="text-sm text-gray-600">{service.description}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Special Requirements */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Any Special Requirements?
          </label>
          <div className="relative">
            <div className="absolute top-3 left-3 pointer-events-none">
              <FiFileText className="h-5 w-5 text-gray-400" />
            </div>
            <textarea
              {...register('specialRequirements')}
              rows={4}
              className="input-field pl-10 resize-none"
              placeholder="Please mention any specific requirements, dietary restrictions for the patient, or special instructions for our companion..."
            />
          </div>
          <p className="text-sm text-gray-500 mt-1">
            This helps us provide better personalized service
          </p>
        </div>

        {/* Family Updates */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">Family Updates</h4>
          <p className="text-sm text-blue-800">
            We'll send real-time WhatsApp updates to your registered number during the visit, 
            including arrival confirmation, consultation updates, and departure notification.
          </p>
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-6">
          <button
            type="button"
            onClick={onPrevious}
            className="btn-ghost inline-flex items-center"
          >
            <FiArrowLeft className="mr-2" />
            Previous
          </button>
          <button
            type="submit"
            className="btn-primary inline-flex items-center"
          >
            Review Booking
            <FiArrowRight className="ml-2" />
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default PreferencesStep;