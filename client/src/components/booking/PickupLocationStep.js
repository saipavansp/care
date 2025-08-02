import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiArrowRight, FiMapPin, FiHome, FiMap } from 'react-icons/fi';

const PickupLocationStep = ({ data, updateData, onNext, onPrevious }) => {
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm({
    defaultValues: {
      addressLine1: data.addressLine1 || '',
      addressLine2: data.addressLine2 || '',
      landmark: data.landmark || '',
      city: data.city || '',
      state: data.state || '',
      pincode: data.pincode || '',
      pickupAddress: data.pickupAddress || ''
    }
  });

  const states = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry',
    'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu'
  ];

  // Get user's current location
  const getCurrentLocation = () => {
    setIsGettingLocation(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            
            // Here you would typically call a reverse geocoding API
            // For demo purposes, we'll set a sample address
            // In production, integrate with Google Maps Geocoding API
            
            setValue('addressLine1', 'Current Location');
            setValue('city', 'Delhi');
            setValue('state', 'Delhi');
            setValue('pincode', '110001');
            
            // Store coordinates for later use
            updateData({
              pickupCoordinates: { latitude, longitude }
            });
            
            setUseCurrentLocation(true);
            setIsGettingLocation(false);
          } catch (error) {
            console.error('Error getting address:', error);
            setIsGettingLocation(false);
          }
        },
        (error) => {
          console.error('Error getting location:', error);
          setIsGettingLocation(false);
          alert('Unable to get your location. Please enter address manually.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser');
      setIsGettingLocation(false);
    }
  };

  const onSubmit = (formData) => {
    // Combine all address fields into complete address
    const completeAddress = [
      formData.addressLine1,
      formData.addressLine2,
      formData.landmark && `Near ${formData.landmark}`,
      formData.city,
      formData.state,
      formData.pincode
    ].filter(Boolean).join(', ');
    
    updateData({
      ...formData,
      pickupAddress: completeAddress
    });
    onNext();
  };

  // Sample saved addresses (in production, fetch from user profile)
  const savedAddresses = [
    {
      id: 1,
      type: 'Home',
      address: 'B-42, Vasant Kunj, New Delhi - 110070'
    },
    {
      id: 2,
      type: 'Office',
      address: 'Tower A, Cyber City, Gurugram - 122002'
    }
  ];

  const fillSavedAddress = (savedAddress) => {
    // Parse the saved address (in production, store structured data)
    setValue('addressLine1', savedAddress.address.split(',')[0]);
    setValue('city', 'Delhi');
    setValue('state', 'Delhi');
    setValue('pincode', savedAddress.address.match(/\d{6}/)?.[0] || '');
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <h2 className="text-2xl font-heading font-semibold text-gray-900 mb-6">
        Pickup Location
      </h2>
      <p className="text-gray-600 mb-8">
        Enter the complete address where our companion should pick up the patient
      </p>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <button
          type="button"
          onClick={getCurrentLocation}
          disabled={isGettingLocation}
          className="flex items-center justify-center p-4 border-2 border-gray-300 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors"
        >
          <FiMapPin className="w-5 h-5 mr-2 text-primary" />
          <span className="font-medium">
            {isGettingLocation ? 'Getting location...' : 'Use Current Location'}
          </span>
        </button>
        
        {savedAddresses.map((saved) => (
          <button
            key={saved.id}
            type="button"
            onClick={() => fillSavedAddress(saved)}
            className="flex items-center justify-center p-4 border-2 border-gray-300 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors"
          >
            <FiHome className="w-5 h-5 mr-2 text-primary" />
            <span className="font-medium">Use {saved.type}</span>
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Address Line 1 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Flat/House No. & Building Name *
          </label>
          <input
            type="text"
            {...register('addressLine1', { required: 'Address line 1 is required' })}
            className="input-field"
            placeholder="e.g., Flat 301, Sunshine Apartments"
          />
          {errors.addressLine1 && (
            <p className="error-text">{errors.addressLine1.message}</p>
          )}
        </div>

        {/* Address Line 2 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Street/Colony Name
          </label>
          <input
            type="text"
            {...register('addressLine2')}
            className="input-field"
            placeholder="e.g., MG Road, Sector 5"
          />
        </div>

        {/* Landmark */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Landmark
          </label>
          <input
            type="text"
            {...register('landmark')}
            className="input-field"
            placeholder="e.g., Near Metro Station, Opposite Mall"
          />
        </div>

        {/* City and State */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              City *
            </label>
            <input
              type="text"
              {...register('city', { required: 'City is required' })}
              className="input-field"
              placeholder="e.g., New Delhi"
            />
            {errors.city && (
              <p className="error-text">{errors.city.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              State *
            </label>
            <select
              {...register('state', { required: 'State is required' })}
              className="input-field"
            >
              <option value="">Select State</option>
              {states.map((state) => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
            {errors.state && (
              <p className="error-text">{errors.state.message}</p>
            )}
          </div>
        </div>

        {/* Pincode */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            PIN Code *
          </label>
          <input
            type="text"
            {...register('pincode', {
              required: 'PIN code is required',
              pattern: {
                value: /^[1-9][0-9]{5}$/,
                message: 'Please enter a valid 6-digit PIN code'
              }
            })}
            className="input-field"
            placeholder="e.g., 110001"
            maxLength="6"
          />
          {errors.pincode && (
            <p className="error-text">{errors.pincode.message}</p>
          )}
        </div>

        {/* Map Preview (placeholder) */}
        <div className="bg-gray-100 rounded-lg p-8 text-center">
          <FiMap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">
            Map preview will appear here
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Google Maps integration coming soon
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
            Next
            <FiArrowRight className="ml-2" />
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default PickupLocationStep;