import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHome, FiArrowLeft } from 'react-icons/fi';
import ComingSoonPage from './ComingSoonPage';

const NotFoundPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;
  
  // Special case for forgot-password - keep as 404
  if (path === '/forgot-password') {
    // Return the original 404 page
    return (
      <div className="min-h-screen bg-gradient-to-br from-secondary-light to-white flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          {/* 404 Illustration */}
          <div className="mb-8">
            <h1 className="text-9xl font-heading font-bold text-primary/20">404</h1>
            <div className="relative -mt-20">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-6xl"
              >
                🏥
              </motion.div>
            </div>
          </div>

          {/* Content */}
          <h2 className="text-3xl font-heading font-bold text-gray-900 mb-4">
            Page Not Found
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Oops! It seems like this page took a wrong turn. 
            Let's get you back on track to quality healthcare support.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate(-1)}
              className="btn-ghost inline-flex items-center justify-center"
            >
              <FiArrowLeft className="mr-2" />
              Go Back
            </button>
            <Link
              to="/"
              className="btn-primary inline-flex items-center justify-center"
            >
              <FiHome className="mr-2" />
              Go to Homepage
            </Link>
          </div>

          {/* Helpful Links */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-4">Here are some helpful links:</p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Link to="/book" className="text-primary hover:text-primary-dark">
                Book a Companion
              </Link>
              <span className="text-gray-400">•</span>
              <Link to="/how-it-works" className="text-primary hover:text-primary-dark">
                How It Works
              </Link>
              <span className="text-gray-400">•</span>
              <Link to="/pricing" className="text-primary hover:text-primary-dark">
                Pricing
              </Link>
              <span className="text-gray-400">•</span>
              <Link to="/login" className="text-primary hover:text-primary-dark">
                Login
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }
  
  // For all other paths, show the Coming Soon page
  return (
    <ComingSoonPage 
      title="Coming Soon" 
      description="We're working on this page and will launch it soon. Thank you for your patience!"
    />
  );
};

export default NotFoundPage;