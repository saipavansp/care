import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiCheckCircle } from 'react-icons/fi';
import { FaUserMd, FaHospital, FaHeartbeat } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const HeroSection = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const features = [
    'Door-to-door service',
    'Professional companions',
    'Digital health records',
    'Family updates'
  ];

  return (
    <section className="relative bg-gradient-to-br from-orange-50 via-white to-primary/5 overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-100/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="max-width-container section-padding py-20 lg:py-32 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div {...fadeIn} className="text-center lg:text-left">
            <div className="inline-flex items-center bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
              <FaHeartbeat className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">500+ Satisfied Families</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-gray-900 mb-6 leading-tight">
              Your Trusted
              <span className="text-gradient block">Medical escort</span>
            </h1>

            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-lg mx-auto lg:mx-0">
              a shoulder to lean on, a voice you can trust.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
              {isAuthenticated ? (
                <Link to="/book" className="btn-primary inline-flex items-center justify-center group">
                  Book Your Companion
                  <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              ) : (
                <button 
                  onClick={() => navigate('/login', { state: { from: { pathname: '/book' }, message: 'Please login to book a companion' } })}
                  className="btn-primary inline-flex items-center justify-center group"
                >
                  Book Your Companion
                  <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
              )}
              <Link to="/how-it-works" className="btn-ghost inline-flex items-center justify-center">
                Learn More
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto lg:mx-0">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="flex items-center space-x-2 text-gray-700"
                >
                  <FiCheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-sm">{feature}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Content - Hero Image/Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative">
              {/* Main Image Container */}
              <div className="relative bg-gradient-to-br from-orange-100 to-orange-50 rounded-3xl p-8 shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1584515933487-779824d29309?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                  alt="Indian elderly patient with healthcare companion"
                  className="rounded-2xl w-full h-[400px] object-cover"
                />
                
                {/* Floating Cards */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -top-4 -right-4 bg-white rounded-xl shadow-lg p-4 flex items-center space-x-3"
                >
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <FaUserMd className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Trained Companions</p>
                    <p className="text-xs text-gray-600">Telugu & English</p>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                  className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg p-4 flex items-center space-x-3"
                >
                  <div className="bg-green-100 p-2 rounded-lg">
                    <FaHospital className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Major Hospitals</p>
                    <p className="text-xs text-gray-600">Apollo, KIMS, Yashoda & More</p>
                  </div>
                </motion.div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full">
                <div className="animate-pulse bg-orange-200/30 rounded-full w-full h-full blur-3xl" />
              </div>

              {/* Trust Badge */}
              <div className="absolute -bottom-8 right-8 bg-white rounded-lg shadow-lg p-3 flex items-center space-x-2">
                <span className="text-2xl">🇮🇳</span>
                <div>
                  <p className="text-xs font-semibold">Made in Hyderabad</p>
                  <p className="text-xs text-gray-600">For Telugu Families</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;