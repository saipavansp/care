import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { FiEye, FiEyeOff, FiPhone, FiLock, FiUsers, FiUser } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { PHONE_REGEX } from '../utils/constants';
import LinkedInStyleLogo from '../components/common/LinkedInStyleLogo';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const loginType = 'user'; // Only user login is enabled
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || (loginType === 'companion' ? '/companion/dashboard' : '/dashboard');
  const message = location.state?.message;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError
  } = useForm();

  const onSubmit = async (data) => {
    try {
      console.log('Form submitted with data:', data);
      setIsLoading(true);
      // Add login type to the data
      const loginData = { ...data, loginType };
      console.log('Calling login with data:', loginData);
      
      const result = await login(loginData);
      console.log('Login result:', result);
      setIsLoading(false);

      if (result.success) {
        console.log('Login successful, navigating to:', from);
        // Check if there's a pending booking to restore
        const bookingReturnUrl = localStorage.getItem('bookingReturnUrl');
        if (bookingReturnUrl && result.data.user.role === 'user') {
          console.log('Navigating to booking return URL:', bookingReturnUrl);
          navigate(bookingReturnUrl);
        } else {
          console.log('Navigating to:', from);
          navigate(from, { replace: true });
        }
      } else {
        console.error('Login failed:', result.error);
        setError('root', {
          type: 'manual',
          message: result.error
        });
      }
    } catch (error) {
      console.error('Error in login submit handler:', error);
      setIsLoading(false);
      setError('root', {
        type: 'manual',
        message: 'An unexpected error occurred. Please try again.'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        {/* LinkedIn-Style Logo */}
        <div className="flex justify-center mb-8">
          <LinkedInStyleLogo size="xl" />
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Hidden Login Type */}
          <input type="hidden" value="user" />

          <h2 className="text-2xl font-heading font-bold text-gray-900 mb-2 text-center">
            Welcome Back
          </h2>
                      <p className="text-gray-600 text-center mb-8">
              Login to manage your bookings
            </p>

          {message && (
            <div className="bg-orange-50 text-orange-600 p-3 rounded-lg mb-4 text-sm">
              {message}
            </div>
          )}

          {errors.root && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
              {errors.root.message}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Phone Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiPhone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="tel"
                  {...register('phone', {
                    required: 'Phone number is required',
                    pattern: {
                      value: PHONE_REGEX,
                      message: 'Please enter a valid 10-digit phone number'
                    }
                  })}
                  className="input-field pl-10"
                  placeholder="9876543210"
                />
              </div>
              {errors.phone && (
                <p className="error-text">{errors.phone.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters'
                    }
                  })}
                  className="input-field pl-10 pr-10"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <FiEyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <FiEye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="error-text">{errors.password.message}</p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-sm text-primary hover:text-primary-dark"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary flex items-center justify-center"
            >
              {isLoading ? (
                <LoadingSpinner size="small" color="white" />
              ) : (
                'Login'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or</span>
            </div>
          </div>

          {/* Demo Login */}
          {/* <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600 mb-2">
              User Demo:
            </p>
            <p className="text-sm font-mono">
              Phone: 9876543210
            </p>
            <p className="text-sm font-mono">Password: demo123</p>
          </div> */}

          {/* Sign Up Link */}
          <p className="text-center text-gray-600">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="text-primary hover:text-primary-dark font-medium"
            >
              Sign up
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;