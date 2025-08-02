import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCalendar, FiClock, FiMapPin, FiPlus, FiFilter, FiFileText } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import bookingService from '../services/booking';
import LoadingSpinner from '../components/common/LoadingSpinner';
import BookingCard from '../components/dashboard/BookingCard';
import MedicalRecords from '../components/dashboard/MedicalRecords';
import { getGreeting } from '../utils/helpers';

const DashboardPage = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('bookings'); // 'bookings' or 'records'
  const [stats, setStats] = useState({
    total: 0,
    upcoming: 0,
    completed: 0
  });

  useEffect(() => {
    if (activeTab === 'bookings') {
      fetchBookings();
    }
  }, [filter, activeTab]);

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const params = filter === 'all' ? {} : { status: filter };
      const response = await bookingService.getUserBookings(user._id, params);
      setBookings(response.bookings);
      
      // Calculate stats
      const total = response.bookings.length;
      const upcoming = response.bookings.filter(b => 
        ['pending', 'confirmed', 'assigned'].includes(b.status)
      ).length;
      const completed = response.bookings.filter(b => b.status === 'completed').length;
      
      setStats({ total, upcoming, completed });
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterOptions = [
    { value: 'all', label: 'All Bookings' },
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-width-container section-padding">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-heading font-bold text-gray-900 mb-2">
            {getGreeting()}, {user?.name?.split(' ')[0]}!
          </h1>
          <p className="text-gray-600">
            Manage your healthcare journey all in one place
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Bookings</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total}</p>
              </div>
              <div className="bg-primary/10 p-3 rounded-full">
                <FiCalendar className="w-6 h-6 text-primary" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Upcoming Visits</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.upcoming}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <FiClock className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Completed Visits</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.completed}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <FiMapPin className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-8">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
              activeTab === 'bookings'
                ? 'bg-white text-primary shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            My Bookings
          </button>
          <button
            onClick={() => setActiveTab('records')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-all flex items-center justify-center ${
              activeTab === 'records'
                ? 'bg-white text-primary shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <FiFileText className="mr-2" />
            Medical Records
          </button>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'bookings' ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-sm"
          >
            {/* Section Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h2 className="text-xl font-heading font-semibold text-gray-900">
                  Your Bookings
                </h2>
                <div className="flex items-center gap-4">
                  {/* Filter Dropdown */}
                  <div className="relative">
                    <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <select
                      value={filter}
                      onChange={(e) => setFilter(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      {filterOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {/* New Booking Button */}
                  <Link
                    to="/book"
                    className="btn-primary text-sm inline-flex items-center"
                  >
                    <FiPlus className="mr-2" />
                    New Booking
                  </Link>
                </div>
              </div>
            </div>

            {/* Bookings List */}
            <div className="p-6">
              {isLoading ? (
                <div className="flex justify-center py-12">
                  <LoadingSpinner size="large" />
                </div>
              ) : bookings.length === 0 ? (
                <div className="text-center py-12">
                  <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiCalendar className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No bookings found
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {filter === 'all' 
                      ? "You haven't made any bookings yet."
                      : `No ${filter} bookings found.`}
                  </p>
                  <Link to="/book" className="btn-primary inline-flex items-center">
                    <FiPlus className="mr-2" />
                    Book Your First Companion
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <BookingCard key={booking._id} booking={booking} onUpdate={fetchBookings} />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <MedicalRecords />
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;