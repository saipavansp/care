import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUser, FiPhone, FiMail, FiLock, FiEdit2, FiSave, FiX, FiPlus, FiTrash2 } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useForm } from 'react-hook-form';
import authService from '../services/auth';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { PHONE_REGEX, EMAIL_REGEX } from '../utils/constants';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddFamily, setShowAddFamily] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      whatsapp: user?.whatsapp || user?.phone || ''
    }
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
    reset: resetPassword,
    watch
  } = useForm();

  const {
    register: registerFamily,
    handleSubmit: handleFamilySubmit,
    formState: { errors: familyErrors },
    reset: resetFamily
  } = useForm();

  const newPassword = watch('newPassword');

  const handleProfileUpdate = async (data) => {
    setIsLoading(true);
    try {
      const response = await authService.updateProfile(data);
      updateUser(response.user);
      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async (data) => {
    setIsLoading(true);
    try {
      await authService.changePassword(data);
      toast.success('Password changed successfully');
      setIsChangingPassword(false);
      resetPassword();
    } catch (error) {
      toast.error('Failed to change password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddFamilyMember = async (data) => {
    setIsLoading(true);
    try {
      const response = await authService.addFamilyMember(data);
      updateUser({ ...user, familyMembers: response.familyMembers });
      toast.success('Family member added successfully');
      setShowAddFamily(false);
      resetFamily();
    } catch (error) {
      toast.error('Failed to add family member');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFamilyMember = async (memberId) => {
    if (!window.confirm('Are you sure you want to remove this family member?')) return;
    
    try {
      const response = await authService.removeFamilyMember(memberId);
      updateUser({ ...user, familyMembers: response.familyMembers });
      toast.success('Family member removed successfully');
    } catch (error) {
      toast.error('Failed to remove family member');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-width-container section-padding">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-heading font-bold text-gray-900">
            My Profile
          </h1>
          <p className="text-gray-600">
            Manage your account information and preferences
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-primary hover:text-primary-dark inline-flex items-center"
                  >
                    <FiEdit2 className="mr-2" />
                    Edit
                  </button>
                )}
              </div>

              {isEditing ? (
                <form onSubmit={handleSubmit(handleProfileUpdate)} className="space-y-6">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiUser className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        {...register('name', {
                          required: 'Name is required',
                          minLength: {
                            value: 2,
                            message: 'Name must be at least 2 characters'
                          }
                        })}
                        className="input-field pl-10"
                      />
                    </div>
                    {errors.name && (
                      <p className="error-text">{errors.name.message}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiMail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        {...register('email', {
                          pattern: {
                            value: EMAIL_REGEX,
                            message: 'Please enter a valid email'
                          }
                        })}
                        className="input-field pl-10"
                      />
                    </div>
                    {errors.email && (
                      <p className="error-text">{errors.email.message}</p>
                    )}
                  </div>

                  {/* WhatsApp */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      WhatsApp Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiPhone className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="tel"
                        {...register('whatsapp', {
                          pattern: {
                            value: PHONE_REGEX,
                            message: 'Please enter a valid 10-digit phone number'
                          }
                        })}
                        className="input-field pl-10"
                      />
                    </div>
                    {errors.whatsapp && (
                      <p className="error-text">{errors.whatsapp.message}</p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        reset();
                      }}
                      className="btn-ghost"
                      disabled={isLoading}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn-primary inline-flex items-center"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <LoadingSpinner size="small" color="white" />
                      ) : (
                        <>
                          <FiSave className="mr-2" />
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="font-medium text-gray-900">{user?.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Phone Number</p>
                    <p className="font-medium text-gray-900">{user?.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium text-gray-900">{user?.email || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">WhatsApp</p>
                    <p className="font-medium text-gray-900">{user?.whatsapp || user?.phone}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Family Members */}
            <div className="bg-white rounded-xl shadow-sm p-6 mt-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Family Members</h2>
                <button
                  onClick={() => setShowAddFamily(true)}
                  className="text-primary hover:text-primary-dark inline-flex items-center"
                >
                  <FiPlus className="mr-2" />
                  Add Member
                </button>
              </div>

              {user?.familyMembers?.length > 0 ? (
                <div className="space-y-3">
                  {user.familyMembers.map((member) => (
                    <div key={member._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{member.name}</p>
                        <p className="text-sm text-gray-600">{member.relation} • {member.phone}</p>
                      </div>
                      <button
                        onClick={() => handleRemoveFamilyMember(member._id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <FiTrash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No family members added yet.</p>
              )}
            </div>
          </motion.div>

          {/* Security & Stats */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Security */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Security</h3>
              
              {isChangingPassword ? (
                <form onSubmit={handlePasswordSubmit(handlePasswordChange)} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Password
                    </label>
                    <input
                      type="password"
                      {...registerPassword('currentPassword', {
                        required: 'Current password is required'
                      })}
                      className="input-field"
                    />
                    {passwordErrors.currentPassword && (
                      <p className="error-text">{passwordErrors.currentPassword.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      {...registerPassword('newPassword', {
                        required: 'New password is required',
                        minLength: {
                          value: 6,
                          message: 'Password must be at least 6 characters'
                        }
                      })}
                      className="input-field"
                    />
                    {passwordErrors.newPassword && (
                      <p className="error-text">{passwordErrors.newPassword.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      {...registerPassword('confirmPassword', {
                        required: 'Please confirm your password',
                        validate: value =>
                          value === newPassword || 'Passwords do not match'
                      })}
                      className="input-field"
                    />
                    {passwordErrors.confirmPassword && (
                      <p className="error-text">{passwordErrors.confirmPassword.message}</p>
                    )}
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => {
                        setIsChangingPassword(false);
                        resetPassword();
                      }}
                      className="btn-ghost text-sm"
                      disabled={isLoading}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn-primary text-sm"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <LoadingSpinner size="small" color="white" />
                      ) : (
                        'Change Password'
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                <button
                  onClick={() => setIsChangingPassword(true)}
                  className="w-full btn-secondary inline-flex items-center justify-center"
                >
                  <FiLock className="mr-2" />
                  Change Password
                </button>
              )}
            </div>

            {/* Account Stats */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Member Since</span>
                  <span className="font-medium text-gray-900">
                    {new Date(user?.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Bookings</span>
                  <span className="font-medium text-gray-900">12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Account Type</span>
                  <span className="font-medium text-gray-900 capitalize">{user?.role}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  to="/dashboard"
                  className="w-full btn-ghost text-sm inline-flex items-center justify-center"
                >
                  View Bookings
                </Link>
                <Link
                  to="/book"
                  className="w-full btn-primary text-sm inline-flex items-center justify-center"
                >
                  Book New Visit
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Add Family Member Modal */}
      {showAddFamily && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 max-w-md w-full"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Add Family Member
              </h3>
              <button
                onClick={() => {
                  setShowAddFamily(false);
                  resetFamily();
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFamilySubmit(handleAddFamilyMember)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  {...registerFamily('name', {
                    required: 'Name is required'
                  })}
                  className="input-field"
                  placeholder="Family member's name"
                />
                {familyErrors.name && (
                  <p className="error-text">{familyErrors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Relation
                </label>
                <input
                  type="text"
                  {...registerFamily('relation', {
                    required: 'Relation is required'
                  })}
                  className="input-field"
                  placeholder="e.g., Son, Daughter, Spouse"
                />
                {familyErrors.relation && (
                  <p className="error-text">{familyErrors.relation.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  {...registerFamily('phone', {
                    required: 'Phone number is required',
                    pattern: {
                      value: PHONE_REGEX,
                      message: 'Please enter a valid 10-digit phone number'
                    }
                  })}
                  className="input-field"
                  placeholder="10-digit phone number"
                />
                {familyErrors.phone && (
                  <p className="error-text">{familyErrors.phone.message}</p>
                )}
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddFamily(false);
                    resetFamily();
                  }}
                  className="btn-ghost"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <LoadingSpinner size="small" color="white" />
                  ) : (
                    'Add Member'
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;