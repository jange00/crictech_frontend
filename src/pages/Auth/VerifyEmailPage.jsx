import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../auth/useAuth';
import { authAPI } from '../../api/auth';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { FaEnvelope, FaCheckCircle, FaSpinner } from 'react-icons/fa';

const VerifyEmailPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Get email from location state or query params
    const stateEmail = location.state?.email;
    const queryEmail = new URLSearchParams(location.search).get('email');
    const stateMessage = location.state?.message;
    
    if (stateEmail) {
      setEmail(stateEmail);
    } else if (queryEmail) {
      setEmail(queryEmail);
    } else {
      // No email provided, redirect to login
      toast.error('Email address required for verification');
      navigate('/login');
      return;
    }

    if (stateMessage) {
      setMessage(stateMessage);
    }
  }, [location, navigate]);

  const handleVerify = async (e) => {
    e.preventDefault();
    
    if (!code || code.length !== 6) {
      toast.error('Please enter a valid 6-digit verification code');
      return;
    }

    setIsVerifying(true);
    
    try {
      const response = await authAPI.verifyEmail({ email, code });
      
      if (response?.success && response.token) {
        // Store token and user
        const { storageService } = await import('../../services/storageService');
        storageService.setToken(response.token);
        if (response.user) {
          storageService.setUser(response.user);
        }
        
        // Connect socket
        const { socketService } = await import('../../services/socketService');
        socketService.connect(response.token);
        
        toast.success('Email verified successfully!');
        navigate('/dashboard');
      } else {
        throw new Error(response?.message || 'Verification failed');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Verification failed';
      toast.error(errorMessage);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      toast.error('Email address is required');
      return;
    }

    setIsResending(true);
    
    try {
      const response = await authAPI.resendVerification({ email });
      
      if (response?.success) {
        toast.success('Verification code sent! Please check your email.');
      } else {
        throw new Error(response?.message || 'Failed to resend verification code');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to resend verification code';
      toast.error(errorMessage);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 shadow-xl sm:p-10"
      >
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100"
          >
            <FaEnvelope className="h-8 w-8 text-blue-600" />
          </motion.div>
          
          <h1 className="mb-2 text-2xl font-bold text-slate-900 sm:text-3xl">
            Verify Your Email
          </h1>
          
          <p className="mb-6 text-sm text-slate-600">
            {message || `We've sent a 6-digit verification code to ${email}`}
          </p>

          {message && (
            <div className="mb-6 rounded-lg bg-blue-50 p-4 text-sm text-blue-800">
              {message}
            </div>
          )}

          <form onSubmit={handleVerify} className="space-y-6">
            <div>
              <label className="block text-left text-sm font-semibold text-slate-700 mb-2">
                Verification Code
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => {
                  // Only allow digits and limit to 6 characters
                  const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                  setCode(value);
                }}
                placeholder="Enter 6-digit code"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-center text-lg font-mono tracking-widest focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                maxLength={6}
                required
                autoFocus
              />
            </div>

            <button
              type="submit"
              disabled={isVerifying || code.length !== 6}
              className="w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white shadow-md shadow-blue-600/30 transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isVerifying ? (
                <span className="flex items-center justify-center gap-2">
                  <FaSpinner className="h-4 w-4 animate-spin" />
                  Verifying...
                </span>
              ) : (
                'Verify Email'
              )}
            </button>
          </form>

          <div className="mt-6 space-y-3">
            <p className="text-sm text-slate-600">
              Didn't receive the code?
            </p>
            <button
              type="button"
              onClick={handleResend}
              disabled={isResending}
              className="text-sm font-semibold text-blue-600 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isResending ? 'Sending...' : 'Resend Verification Code'}
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-200">
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="text-sm text-slate-600 hover:text-slate-900"
            >
              Back to Login
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyEmailPage;
