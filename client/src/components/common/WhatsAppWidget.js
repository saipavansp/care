import React, { useState, useEffect } from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import { FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { WHATSAPP_NUMBER, WHATSAPP_MESSAGE } from '../../utils/constants';
import { generateWhatsAppUrl } from '../../utils/helpers';

const WhatsAppWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showWidget, setShowWidget] = useState(false);

  useEffect(() => {
    // Show widget after 3 seconds
    const timer = setTimeout(() => {
      setShowWidget(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleWhatsAppClick = () => {
    const url = generateWhatsAppUrl(WHATSAPP_NUMBER, WHATSAPP_MESSAGE);
    window.open(url, '_blank');
  };

  if (!showWidget) return null;

  return (
    <>
      {/* WhatsApp Button */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="fixed bottom-6 right-6 z-40"
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
          aria-label="WhatsApp Support"
        >
          <FaWhatsapp className="w-6 h-6 group-hover:scale-110 transition-transform" />
          <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
            1
          </div>
        </button>
      </motion.div>

      {/* WhatsApp Popup */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-24 right-6 bg-white rounded-lg shadow-2xl z-40 w-80 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-green-500 text-white p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <FaWhatsapp className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold">Care Companion Support</h3>
                  <p className="text-xs opacity-90">Typically replies within minutes</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Body */}
            <div className="p-4 bg-gray-50">
              <div className="bg-white rounded-lg p-3 shadow-sm mb-4">
                <p className="text-sm text-gray-700">
                  👋 Hello! Welcome to Care Companion.
                </p>
                <p className="text-sm text-gray-700 mt-2">
                  How can we help you today?
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  11:30 AM
                </p>
              </div>

              <div className="space-y-2">
                <button
                  onClick={handleWhatsAppClick}
                  className="w-full text-left bg-primary/10 hover:bg-primary/20 text-primary rounded-lg p-3 text-sm transition-colors"
                >
                  💬 Chat about booking a companion
                </button>
                <button
                  onClick={handleWhatsAppClick}
                  className="w-full text-left bg-primary/10 hover:bg-primary/20 text-primary rounded-lg p-3 text-sm transition-colors"
                >
                  ❓ Ask about our services
                </button>
                <button
                  onClick={handleWhatsAppClick}
                  className="w-full text-left bg-primary/10 hover:bg-primary/20 text-primary rounded-lg p-3 text-sm transition-colors"
                >
                  🏥 Get hospital visit support
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-white border-t">
              <button
                onClick={handleWhatsAppClick}
                className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
              >
                <FaWhatsapp className="w-5 h-5" />
                <span>Start WhatsApp Chat</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default WhatsAppWidget;