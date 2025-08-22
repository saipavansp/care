import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { FiMail, FiPhone, FiKey, FiShield } from 'react-icons/fi';
import authService from '../services/auth';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { PHONE_REGEX } from '../utils/constants';

const ForgotPasswordPage = () => {
  const [step, setStep] = useState(1); // 1: choose channel, 2: enter code, 3: reset
  const [isLoading, setIsLoading] = useState(false);
  const [channel, setChannel] = useState('email');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm();
  const { register: registerCode, handleSubmit: handleSubmitCode, formState: { errors: errorsCode } } = useForm();
  const { register: registerReset, handleSubmit: handleSubmitReset, formState: { errors: errorsReset }, watch } = useForm();

  const newPassword = watch('newPassword');

  const onSend = async (data) => {
    setIsLoading(true);
    try {
      if (channel === 'email') {
        const providedEmail = (data.email || '').toString().trim().toLowerCase();
        setEmail(providedEmail);
        try { localStorage.setItem('fpEmail', providedEmail); } catch {}
        await authService.forgotPassword({ channel: 'email', email: providedEmail });
      } else {
        const cleanPhone = (data.phone || '').toString().trim().replace(/\s+/g, '');
        setPhone(cleanPhone);
        await authService.forgotPassword({ channel: 'sms', phone: cleanPhone });
      }
      setStep(2);
    } catch (e) {
      // no-op, toast is handled globally if needed
    } finally {
      setIsLoading(false);
    }
  };

  const onVerify = async (data) => {
    setIsLoading(true);
    try {
      const savedEmail = email || (() => { try { return localStorage.getItem('fpEmail') || ''; } catch { return ''; } })();
      const payload = channel === 'email'
        ? { email: savedEmail, channel: 'email', code: data.code }
        : { phone, channel: 'sms', code: data.code };
      const res = await authService.verifyPasswordCode(payload);
      setResetToken(res.resetToken);
      setStep(3);
    } catch (e) {
      // no-op
    } finally {
      setIsLoading(false);
    }
  };

  const onReset = async (data) => {
    setIsLoading(true);
    try {
      await authService.resetPassword({ resetToken, newPassword: data.newPassword });
      setSuccessMessage('Password changed successfully. Redirecting to login...');
      setTimeout(() => {
        window.location.href = '/login';
      }, 1500);
    } catch (e) {
      // no-op
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-light to-white flex items-center justify-center py-12 px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-heading font-bold text-gray-900 mb-2 text-center">Forgot Password</h2>
        <p className="text-gray-600 text-center mb-8">Reset your password securely</p>

        {step === 1 && (
          <form onSubmit={handleSubmit(onSend)} className="space-y-6">
            {channel === 'sms' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiPhone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    {...register('phone', { required: 'Phone number is required', pattern: { value: PHONE_REGEX, message: 'Enter a valid 10-digit number' } })}
                    className="input-field pl-10"
                    placeholder="9876543210"
                  />
                </div>
                {errors.phone && <p className="error-text">{errors.phone.message}</p>}
              </div>
            )}

            {channel === 'email' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Registered Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    {...register('email', { required: 'Email is required for email verification' })}
                    className="input-field pl-10"
                    placeholder="you@example.com"
                  />
                </div>
                {errors.email && <p className="error-text">{errors.email.message}</p>}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Send code via</label>
              <div className="grid grid-cols-2 gap-3">
                <button type="button" onClick={() => setChannel('email')} className={`px-4 py-2 rounded-lg border ${channel === 'email' ? 'border-primary text-primary' : 'border-gray-300 text-gray-700'}`}>
                  <div className="flex items-center justify-center space-x-2"><FiMail /> <span>Email</span></div>
                </button>
                <button type="button" onClick={() => setChannel('sms')} className={`px-4 py-2 rounded-lg border ${channel === 'sms' ? 'border-primary text-primary' : 'border-gray-300 text-gray-700'}`}>
                  <div className="flex items-center justify-center space-x-2"><FiShield /> <span>SMS</span></div>
                </button>
              </div>
            </div>

            <button type="submit" disabled={isLoading} className="w-full btn-primary flex items-center justify-center">
              {isLoading ? <LoadingSpinner size="small" color="white" /> : 'Send Code'}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleSubmitCode(onVerify)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Enter OTP</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiKey className="h-5 w-5 text-gray-400" />
                </div>
                <input type="text" maxLength={6} {...registerCode('code', { required: 'Code is required', minLength: { value: 6, message: '6 digits' } })} className="input-field pl-10" placeholder="123456" />
              </div>
              {errorsCode.code && <p className="error-text">{errorsCode.code.message}</p>}
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <button type="button" onClick={() => setStep(1)} className="text-primary">Change method</button>
              <button
                type="button"
                onClick={() => {
                  const savedEmail = email || (() => { try { return localStorage.getItem('fpEmail') || ''; } catch { return ''; } })();
                  onSend(channel === 'email' ? { email: savedEmail } : { phone });
                }}
                className="text-primary"
              >
                Resend
              </button>
            </div>
            <button type="submit" disabled={isLoading} className="w-full btn-primary flex items-center justify-center">{isLoading ? <LoadingSpinner size="small" color="white" /> : 'Verify'}</button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleSubmitReset(onReset)} className="space-y-6">
            {successMessage && (
              <div className="bg-green-50 text-green-700 p-3 rounded-lg text-sm">
                {successMessage}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
              <input type="password" {...registerReset('newPassword', { required: 'New password is required', minLength: { value: 6, message: 'Min 6 characters' } })} className="input-field" />
              {errorsReset.newPassword && <p className="error-text">{errorsReset.newPassword.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
              <input type="password" {...registerReset('confirmPassword', { required: 'Confirm your password', validate: v => v === newPassword || 'Passwords do not match' })} className="input-field" />
              {errorsReset.confirmPassword && <p className="error-text">{errorsReset.confirmPassword.message}</p>}
            </div>
            <button type="submit" disabled={isLoading} className="w-full btn-primary flex items-center justify-center">{isLoading ? <LoadingSpinner size="small" color="white" /> : 'Reset Password'}</button>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;


