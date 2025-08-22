import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { FiEye, FiEyeOff, FiPhone, FiLock, FiUser, FiMail } from 'react-icons/fi';
import authService from '../services/auth';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { PHONE_REGEX, EMAIL_REGEX } from '../utils/constants';
import LinkedInStyleLogo from '../components/common/LinkedInStyleLogo';

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [emailOtp, setEmailOtp] = useState('');
  const [preVerifiedToken, setPreVerifiedToken] = useState('');
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    watch
  } = useForm();

  const password = watch('password');

  const handleSendOtp = async () => {
    const emailValue = watch('email');
    if (!emailValue) {
      setError('email', { type: 'manual', message: 'Email is required for OTP' });
      return;
    }
    try {
      await authService.sendEmailOtp(emailValue);
      setOtpSent(true);
    } catch (e) {
      // handled globally
    }
  };

  const handleVerifyOtp = async () => {
    const emailValue = watch('email');
    if (!emailValue || !emailOtp) return;
    try {
      const res = await authService.verifyEmailOtp({ email: emailValue, code: emailOtp });
      setPreVerifiedToken(res.preVerifiedToken);
    } catch (e) {
      // handled globally
    }
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    // Require email OTP verification prior to account creation
    if (!preVerifiedToken) {
      setIsLoading(false);
      setError('root', { type: 'manual', message: 'Please verify your email OTP before creating account' });
      return;
    }

    const result = await registerUser({ ...data, preVerifiedToken });
    setIsLoading(false);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError('root', {
        type: 'manual',
        message: result.error
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-light to-white flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        {/* LinkedIn-Style Logo */}
        <div className="flex justify-center mb-8">
          <LinkedInStyleLogo size="xl" />
        </div>

        {/* Register Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-heading font-bold text-gray-900 mb-2 text-center">
            Create Your Account
          </h2>
          <p className="text-gray-600 text-center mb-8">
            Join us to book healthcare companions
          </p>

          {errors.root && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
              {errors.root.message}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Name Field */}
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
                  placeholder="John Doe"
                />
              </div>
              {errors.name && (
                <p className="error-text">{errors.name.message}</p>
              )}
            </div>

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

            {/* Email Field (Mandatory with OTP) */}
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
                    required: 'Email is required',
                    pattern: {
                      value: EMAIL_REGEX,
                      message: 'Please enter a valid email'
                    }
                  })}
                  className="input-field pl-10"
                  placeholder="john@example.com"
                />
              </div>
              {errors.email && (
                <p className="error-text">{errors.email.message}</p>
              )}
              <div className="flex items-center gap-2 mt-2">
                <button type="button" onClick={handleSendOtp} className="btn-secondary text-sm">Send OTP</button>
                <input
                  type="text"
                  value={emailOtp}
                  onChange={(e) => setEmailOtp(e.target.value)}
                  className="input-field text-sm"
                  placeholder="Enter OTP"
                />
                <button type="button" onClick={handleVerifyOtp} className="btn-primary text-sm">Verify</button>
                {preVerifiedToken && <span className="text-green-600 text-sm">Verified</span>}
              </div>
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
                  placeholder="Create a password"
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

            {/* Confirm Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: value =>
                      value === password || 'Passwords do not match'
                  })}
                  className="input-field pl-10"
                  placeholder="Confirm your password"
                />
              </div>
              {errors.confirmPassword && (
                <p className="error-text">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start">
              <input
                type="checkbox"
                {...register('terms', {
                  required: 'You must agree to the terms'
                })}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded mt-0.5"
              />
              <label className="ml-2 text-sm text-gray-600">
                I agree to the{' '}
                <Link to="/terms" className="text-primary hover:text-primary-dark">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-primary hover:text-primary-dark">
                  Privacy Policy
                </Link>
              </label>
            </div>
            {errors.terms && (
              <p className="error-text">{errors.terms.message}</p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary flex items-center justify-center"
            >
              {isLoading ? (
                <LoadingSpinner size="small" color="white" />
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Sign In Link */}
          <p className="text-center text-gray-600 mt-6">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-primary hover:text-primary-dark font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;