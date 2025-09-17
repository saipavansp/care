import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiArrowRight, FiCalendar, FiClock, FiMapPin, FiSearch } from 'react-icons/fi';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import hospitalService from '../../services/hospital';
import { trackEvent } from '../../utils/attribution';

const AppointmentDetailsStep = ({ data, updateData, onNext, onPrevious }) => {
  const [hospitals, setHospitals] = useState([]);
  const [allHospitals, setAllHospitals] = useState([]);
  const [showHospitalSearch, setShowHospitalSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState(
    data.appointmentDate ? new Date(data.appointmentDate) : null
  );
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm({
    defaultValues: {
      hospital: data.hospital || '',
      hospitalAddress: data.hospitalAddress || '',
      doctor: data.doctor || '',
      department: data.department || '',
      appointmentDate: data.appointmentDate || '',
      appointmentTime: data.appointmentTime || ''
    }
  });

  const departments = [
    'General Medicine',
    'Cardiology',
    'Orthopedics',
    'Neurology',
    'Gastroenterology',
    'Oncology',
    'Pediatrics',
    'Gynecology',
    'Dermatology',
    'ENT',
    'Ophthalmology',
    'Psychiatry',
    'Urology',
    'Nephrology',
    'Pulmonology',
    'Other'
  ];

  // Fallback list (Hyderabad-focused) used if API call fails
  const fallbackHospitals = [
    { name: 'Apollo Hospitals Jubilee Hills', address: 'Rd No 72, Jubilee Hills', city: 'Hyderabad' },
    { name: 'Continental Hospitals', address: 'Financial District, Gachibowli', city: 'Hyderabad' },
    { name: 'KIMS Hospitals, Kondapur', address: 'Kondapur', city: 'Hyderabad' },
    { name: 'CARE Hospitals, Banjara Hills', address: 'Rd No 1, Banjara Hills', city: 'Hyderabad' },
    { name: 'Gleneagles Hospital, Lakdi‑ka‑Pul', address: 'Lakdi‑ka‑Pul', city: 'Hyderabad' },
    { name: 'Omega Hospitals, Gachibowli', address: 'Gachibowli', city: 'Hyderabad' },
    { name: 'Motherhood Hospitals', address: 'Moula Ali Rd, MIGH Colony', city: 'Hyderabad' }
  ];

  // Load hospitals from API
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await hospitalService.getAllHospitals();
        const list = (res?.hospitals || []).map(h => ({ name: h.name, address: h.address, city: h.city }));
        if (!mounted) return;
        setAllHospitals(list);
        setHospitals(list);
      } catch (e) {
        // Fallback to local list
        if (!mounted) return;
        setAllHospitals(fallbackHospitals);
        setHospitals(fallbackHospitals);
      }
    })();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    // Filter hospitals based on search query
    const source = allHospitals.length ? allHospitals : fallbackHospitals;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const filtered = source.filter(hospital =>
        hospital.name.toLowerCase().includes(q) ||
        hospital.city.toLowerCase().includes(q) ||
        (hospital.address || '').toLowerCase().includes(q)
      );
      setHospitals(filtered);
    } else {
      setHospitals(source);
    }
  }, [searchQuery, allHospitals]);

  const selectHospital = (hospital) => {
    setValue('hospital', hospital.name);
    setValue('hospitalAddress', hospital.address);
    setShowHospitalSearch(false);
    setSearchQuery('');
  };

  // Get minimum date/time (2 hours from now)
  const getMinDateTime = () => {
    const now = new Date();
    now.setHours(now.getHours() + 2);
    return now;
  };

  // Generate time slots
  const generateTimeSlots = () => {
    const slots = [];
    const startHour = 8; // 8 AM
    const endHour = 20; // 8 PM
    
    for (let hour = startHour; hour < endHour; hour++) {
      slots.push(`${hour}:00 ${hour < 12 ? 'AM' : 'PM'}`);
      slots.push(`${hour}:30 ${hour < 12 ? 'AM' : 'PM'}`);
    }
    
    return slots;
  };

  // Check if time slot is valid (at least 2 hours from now)
  const isTimeSlotValid = (date, timeSlot) => {
    if (!date) return true;
    
    const [time, period] = timeSlot.split(' ');
    const [hours, minutes] = time.split(':');
    let hour = parseInt(hours);
    
    if (period === 'PM' && hour !== 12) hour += 12;
    if (period === 'AM' && hour === 12) hour = 0;
    
    const selectedDateTime = new Date(date);
    selectedDateTime.setHours(hour, parseInt(minutes), 0, 0);
    
    return selectedDateTime >= getMinDateTime();
  };

  const onSubmit = (formData) => {
    updateData({
      ...formData,
      appointmentDate: selectedDate
    });
    trackEvent('booking_step_continue', { step: 'appointment_details' });
    onNext();
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <h2 className="text-2xl font-heading font-semibold text-gray-900 mb-6">
        Appointment Details
      </h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Hospital Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Hospital Name *
          </label>
          <div className="relative">
            <div className="flex gap-2">
              <input
                type="text"
                {...register('hospital', { required: 'Hospital name is required' })}
                className="input-field flex-1"
                placeholder="Enter hospital name or search"
              />
              <button
                type="button"
                onClick={() => setShowHospitalSearch(!showHospitalSearch)}
                className="btn-secondary inline-flex items-center"
              >
                <FiSearch className="mr-2" />
                Search
              </button>
            </div>
            
            {showHospitalSearch && (
              <div className="absolute z-10 w-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 max-h-80 overflow-y-auto">
                <div className="p-3 border-b">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search hospitals by name or city..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div className="p-2">
                  {hospitals.length > 0 ? (
                    hospitals.map((hospital, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => selectHospital(hospital)}
                        className="w-full text-left p-3 hover:bg-gray-50 rounded-md transition-colors"
                      >
                        <div className="font-medium text-gray-900">{hospital.name}</div>
                        <div className="text-sm text-gray-600 flex items-center mt-1">
                          <FiMapPin className="w-3 h-3 mr-1" />
                          {hospital.address}
                        </div>
                      </button>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">No hospitals found</p>
                  )}
                </div>
              </div>
            )}
          </div>
          {errors.hospital && (
            <p className="error-text" onLoad={() => trackEvent('booking_validation_error', { step: 'appointment_details', field: 'hospital' })}>{errors.hospital.message}</p>
          )}
        </div>

        {/* Hospital Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Hospital Address *
          </label>
          <textarea
            {...register('hospitalAddress', { required: 'Hospital address is required' })}
            className="input-field"
            rows="3"
            placeholder="Enter complete hospital address"
          />
          {errors.hospitalAddress && (
            <p className="error-text" onLoad={() => trackEvent('booking_validation_error', { step: 'appointment_details', field: 'hospitalAddress' })}>{errors.hospitalAddress.message}</p>
          )}
        </div>

        {/* Doctor Name (optional) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Doctor Name (optional)
          </label>
          <input
            type="text"
            {...register('doctor')}
            className="input-field"
            placeholder="Dr. "
          />
        </div>

        {/* Department (optional) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Department (optional)
          </label>
          <select
            {...register('department')}
            className="input-field"
          >
            <option value="">Select Department</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>

        {/* Appointment Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Appointment Date *
          </label>
          <div className="relative">
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              minDate={new Date()}
              dateFormat="dd/MM/yyyy"
              className="input-field w-full pl-10"
              placeholderText="Select appointment date"
              required
            />
            <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
        </div>

        {/* Appointment Time */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Appointment Time *
          </label>
          <div className="relative">
            <select
              {...register('appointmentTime', { required: 'Please select appointment time' })}
              className="input-field pl-10"
            >
              <option value="">Select Time</option>
              {generateTimeSlots().map((slot) => (
                <option 
                  key={slot} 
                  value={slot}
                  disabled={!isTimeSlotValid(selectedDate, slot)}
                >
                  {slot} {!isTimeSlotValid(selectedDate, slot) && '(Not available)'}
                </option>
              ))}
            </select>
            <FiClock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
          {errors.appointmentTime && (
            <p className="error-text" onLoad={() => trackEvent('booking_validation_error', { step: 'appointment_details', field: 'appointmentTime' })}>{errors.appointmentTime.message}</p>
          )}
          {selectedDate && new Date(selectedDate).toDateString() === new Date().toDateString() && (
            <p className="text-sm text-orange-600 mt-1">
              Same-day appointments must be at least 2 hours from now
            </p>
          )}
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

export default AppointmentDetailsStep;