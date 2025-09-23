import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiArrowRight, FiMap } from 'react-icons/fi';
import { trackEvent } from '../../utils/attribution';

const PickupLocationStep = ({ data, updateData, onNext, onPrevious }) => {
  // Google Places Autocomplete
  const addressSearchRef = useRef(null);
  const [placesReady, setPlacesReady] = useState(false);
  const googleApiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '';

  const ensureGooglePlacesLoaded = () => {
    if (window.google && window.google.maps && window.google.maps.places) {
      return Promise.resolve();
    }
    if (!googleApiKey) {
      return Promise.resolve();
    }
    return new Promise((resolve, reject) => {
      const existing = document.querySelector('script[data-kp="gmaps"]');
      if (existing) {
        existing.addEventListener('load', resolve, { once: true });
        existing.addEventListener('error', reject, { once: true });
        return;
      }
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${googleApiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.dataset.kp = 'gmaps';
      script.onload = resolve;
      script.onerror = reject;
      document.body.appendChild(script);
    });
  };
  
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

  // Initialize Google Places Autocomplete if available
  useEffect(() => {
    let destroyed = false;
    (async () => {
      try {
        await ensureGooglePlacesLoaded();
        if (destroyed) return;
        if (window.google && window.google.maps && window.google.maps.places && addressSearchRef.current) {
          setPlacesReady(true);
          const autocomplete = new window.google.maps.places.Autocomplete(addressSearchRef.current, {
            fields: ['address_components', 'formatted_address', 'geometry']
          });

          autocomplete.addListener('place_changed', () => {
            const place = autocomplete.getPlace();
            if (!place || !place.address_components) return;

            const get = (type) => {
              const comp = place.address_components.find(c => c.types.includes(type));
              return comp ? comp.long_name : '';
            };

            const streetNumber = get('street_number');
            const route = get('route');
            const sublocality = get('sublocality') || get('sublocality_level_1');
            const locality = get('locality') || get('administrative_area_level_2');
            const stateVal = get('administrative_area_level_1');
            const postalCode = get('postal_code');

            const line1 = [streetNumber, route].filter(Boolean).join(' ');
            const line2 = sublocality || '';

            setValue('addressLine1', line1 || place.formatted_address || '');
            setValue('addressLine2', line2);
            setValue('city', locality);
            setValue('state', stateVal);
            setValue('pincode', postalCode);

            if (place.geometry?.location) {
              const lat = place.geometry.location.lat();
              const lng = place.geometry.location.lng();
              updateData({ pickupCoordinates: { lat, lng } });
            }
          });
        }
      } catch (e) {
        // Ignore script load errors; user can still type manually or use browser autofill
      }
    })();
    return () => { destroyed = true; };
  }, [setValue, updateData]);

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
    trackEvent('booking_step_continue', { step: 'pickup_location' });
    onNext();
  };

  // Removed preset Home/Office/Current Location buttons per requirement

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

      {/* Google / Browser Saved Address Search */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Search address (Google)
        </label>
        <input
          type="text"
          ref={addressSearchRef}
          className="input-field"
          placeholder="Start typing your address to pick from suggestions"
        />
        {!placesReady && (
          <p className="text-xs text-gray-500 mt-1">You can also use your browser's saved addresses via autofill.</p>
        )}
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
            <p className="error-text" onLoad={() => trackEvent('booking_validation_error', { step: 'pickup_location', field: 'addressLine1' })}>{errors.addressLine1.message}</p>
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
              <p className="error-text" onLoad={() => trackEvent('booking_validation_error', { step: 'pickup_location', field: 'city' })}>{errors.city.message}</p>
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
              <p className="error-text" onLoad={() => trackEvent('booking_validation_error', { step: 'pickup_location', field: 'state' })}>{errors.state.message}</p>
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
            <p className="error-text" onLoad={() => trackEvent('booking_validation_error', { step: 'pickup_location', field: 'pincode' })}>{errors.pincode.message}</p>
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