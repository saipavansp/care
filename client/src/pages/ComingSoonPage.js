import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHome, FiArrowLeft } from 'react-icons/fi';

const ComingSoonPage = ({ title, description }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-light to-white flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        {/* Coming Soon Illustration */}
        <div className="mb-8">
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-6xl mb-4"
          >
            🚀
          </motion.div>
          <h1 className="text-4xl font-heading font-bold text-primary">Coming Soon</h1>
        </div>

        {/* Content */}
        <h2 className="text-3xl font-heading font-bold text-gray-900 mb-4">
          {title || "This Feature is Coming Soon"}
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          {description || "We're working hard to bring you this exciting new feature. Please check back later!"}
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
          <p className="text-sm text-gray-600 mb-4">Explore other available features:</p>
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
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ComingSoonPage;