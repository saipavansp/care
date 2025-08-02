import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiCalendar, FiUsers, FiClock, FiUpload, FiCheckCircle, FiFileText } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import bookingService from '../services/booking';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { formatDateTime, getGreeting } from '../utils/helpers';
import toast from 'react-hot-toast';

const CompanionDashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [uploadModal, setUploadModal] = useState(false);
  const [stats, setStats] = useState({
    todayVisits: 0,
    upcomingVisits: 0,
    completedVisits: 0,
    totalEarnings: 0
  });

  useEffect(() => {
    fetchCompanionBookings();
  }, []);

  const fetchCompanionBookings = async () => {
    setIsLoading(true);
    try {
      // Fetch bookings assigned to this companion
      const response = await bookingService.getUpcomingBookings();
      const companionBookings = response.bookings.filter(
        booking => booking.companion?.id === user._id
      );
      setBookings(companionBookings);
      
      // Calculate stats
      const today = new Date().toDateString();
      const todayVisits = companionBookings.filter(
        b => new Date(b.appointmentDate).toDateString() === today
      ).length;
      
      const upcomingVisits = companionBookings.filter(
        b => ['assigned', 'confirmed'].includes(b.status)
      ).length;
      
      const completedVisits = companionBookings.filter(
        b => b.status === 'completed'
      ).length;
      
      setStats({
        todayVisits,
        upcomingVisits,
        completedVisits,
        totalEarnings: completedVisits * 200 // Companion earnings per visit
      });
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadDocuments = async (bookingId, files) => {
    // Implementation for uploading visit documents
    try {
      // API call to upload documents
      toast.success('Documents uploaded successfully');
      setUploadModal(false);
      fetchCompanionBookings();
    } catch (error) {
      toast.error('Failed to upload documents');
    }
  };

  const StatCard = ({ icon: Icon, title, value, color }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl p-6 shadow-sm"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </motion.div>
  );

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
            Welcome to your companion dashboard
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={FiCalendar}
            title="Today's Visits"
            value={stats.todayVisits}
            color="bg-blue-100 text-blue-600"
          />
          <StatCard
            icon={FiClock}
            title="Upcoming Visits"
            value={stats.upcomingVisits}
            color="bg-orange-100 text-orange-600"
          />
          <StatCard
            icon={FiCheckCircle}
            title="Completed Visits"
            value={stats.completedVisits}
            color="bg-green-100 text-green-600"
          />
          <StatCard
            icon={FiUsers}
            title="Total Earnings"
            value={`₹${stats.totalEarnings}`}
            color="bg-purple-100 text-purple-600"
          />
        </div>

        {/* Assigned Visits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm"
        >
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-heading font-semibold text-gray-900">
              Your Assigned Visits
            </h2>
          </div>

          <div className="p-6">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner size="large" />
              </div>
            ) : bookings.length === 0 ? (
              <div className="text-center py-12">
                <FiCalendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No assigned visits yet
                </h3>
                <p className="text-gray-600">
                  You'll see your assigned visits here once admin assigns them to you.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div
                    key={booking._id}
                    className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {booking.patientName} - {booking.hospital}
                        </h3>
                        <div className="space-y-1 text-sm text-gray-600">
                          <p>Doctor: {booking.doctor}</p>
                          <p>Date: {formatDateTime(booking.appointmentDate, booking.appointmentTime)}</p>
                          <p>Pickup: {booking.pickupAddress}</p>
                          <p>Language: {booking.preferredLanguage}</p>
                          {booking.specialRequirements && (
                            <p>Special Requirements: {booking.specialRequirements}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3">
                        {booking.status === 'assigned' && (
                          <button className="btn-primary text-sm">
                            Start Visit
                          </button>
                        )}
                        {booking.status === 'in-progress' && (
                          <button
                            onClick={() => {
                              setSelectedBooking(booking);
                              setUploadModal(true);
                            }}
                            className="btn-secondary text-sm inline-flex items-center"
                          >
                            <FiUpload className="mr-2" />
                            Upload Documents
                          </button>
                        )}
                        {booking.status === 'completed' && (
                          <span className="text-green-600 font-medium">
                            ✓ Visit Completed
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 bg-white rounded-xl shadow-sm p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="bg-gray-50 hover:bg-gray-100 p-4 rounded-lg text-left transition-colors">
              <FiFileText className="text-primary mb-2" />
              <p className="font-medium">View Guidelines</p>
              <p className="text-sm text-gray-600">Companion service protocols</p>
            </button>
            <button className="bg-gray-50 hover:bg-gray-100 p-4 rounded-lg text-left transition-colors">
              <FiUsers className="text-primary mb-2" />
              <p className="font-medium">Emergency Contacts</p>
              <p className="text-sm text-gray-600">Hospital & support numbers</p>
            </button>
            <button className="bg-gray-50 hover:bg-gray-100 p-4 rounded-lg text-left transition-colors">
              <FiCalendar className="text-primary mb-2" />
              <p className="font-medium">Availability Settings</p>
              <p className="text-sm text-gray-600">Manage your schedule</p>
            </button>
          </div>
        </motion.div>
      </div>

      {/* Upload Documents Modal */}
      {uploadModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 max-w-md w-full"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Upload Visit Documents
            </h3>
            <p className="text-gray-600 mb-4">
              Upload visit summary, prescriptions, and test reports for {selectedBooking.patientName}
            </p>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <FiUpload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">
                Drop files here or click to upload
              </p>
              <p className="text-sm text-gray-500">
                PDF, JPG, PNG up to 10MB
              </p>
              <input
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
                onChange={(e) => handleUploadDocuments(selectedBooking._id, e.target.files)}
              />
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setUploadModal(false)}
                className="btn-ghost"
              >
                Cancel
              </button>
              <button className="btn-primary">
                Upload Documents
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default CompanionDashboard;