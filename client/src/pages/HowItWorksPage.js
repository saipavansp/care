import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiClock, FiShield, FiArrowRight } from 'react-icons/fi';
import { HOW_IT_WORKS_STEPS } from '../utils/constants';

const HowItWorksPage = () => {
  const detailedSteps = [
    {
      step: 1,
      title: 'Book Your Companion',
      icon: '📝',
      description: 'Fill our simple online form with patient and appointment details',
      details: [
        'Enter patient information including age and medical conditions',
        'Provide hospital and doctor details',
        'Select appointment date and time',
        'Choose pickup location',
        'Specify language preference and special requirements'
      ],
      time: '5 minutes'
    },
    {
      step: 2,
      title: 'Companion Assignment',
      icon: '👥',
      description: 'We match you with the perfect companion based on your needs',
      details: [
        'Companion selected based on language and special requirements',
        'You receive companion details via SMS/WhatsApp',
        'Companion reviews patient information and appointment details',
        'Confirmation call 1 day before appointment',
        'Any special arrangements are coordinated'
      ],
      time: 'Within 2 hours'
    },
    {
      step: 3,
      title: 'Pickup & Travel',
      icon: '🚗',
      description: 'Door-to-door service with comfortable transportation',
      details: [
        'Companion arrives 30 minutes before scheduled pickup',
        'Helps patient get ready and gather necessary documents',
        'Comfortable cab arranged for travel',
        'Companion ensures patient comfort during journey',
        'Family receives pickup confirmation via WhatsApp'
      ],
      time: '30-60 minutes before appointment'
    },
    {
      step: 4,
      title: 'Hospital Support',
      icon: '🏥',
      description: 'Complete assistance throughout the hospital visit',
      details: [
        'Registration and documentation assistance',
        'Navigation through hospital departments',
        'Waiting with patient and providing company',
        'Advocating for patient needs with medical staff',
        'Taking notes during doctor consultation',
        'Help with tests, procedures, and pharmacy'
      ],
      time: 'Throughout visit'
    },
    {
      step: 5,
      title: 'Return Journey',
      icon: '🏠',
      description: 'Safe return home with all necessary follow-ups',
      details: [
        'Assistance with medicine collection if needed',
        'Comfortable return journey arranged',
        'Companion ensures patient reaches home safely',
        'Handover to family member if available',
        'Brief verbal update about the visit'
      ],
      time: '30-45 minutes'
    },
    {
      step: 6,
      title: 'Digital Summary',
      icon: '📱',
      description: 'Comprehensive visit report shared digitally',
      details: [
        'Detailed visit summary prepared',
        'Doctor\'s instructions and prescriptions documented',
        'Next appointment details included',
        'Test reports and recommendations noted',
        'Digital report shared via WhatsApp/Email within 2 hours'
      ],
      time: 'Within 2 hours'
    }
  ];

  const companionQualities = [
    'Trained healthcare professionals',
    'Background verified and certified',
    'Multilingual communication skills',
    'Patient handling expertise',
    'First aid certified',
    'Empathetic and caring nature'
  ];

  const faqs = [
    {
      question: 'How far in advance should I book?',
      answer: 'We recommend booking at least 24 hours in advance. However, we do accommodate same-day requests based on companion availability.'
    },
    {
      question: 'Can the same companion be requested for future visits?',
      answer: 'Yes! If you\'re happy with a companion, you can request them for future visits. We\'ll do our best to accommodate based on their availability.'
    },
    {
      question: 'What if my appointment gets rescheduled?',
      answer: 'No problem! Just inform us at least 2 hours before the scheduled pickup time, and we\'ll reschedule your companion service accordingly.'
    },
    {
      question: 'Are companions medically trained?',
      answer: 'Yes, all our companions undergo healthcare training and are certified in first aid. However, they don\'t provide medical treatment - they facilitate and support.'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="max-width-container section-padding">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-6">
              How Kinpin Works
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              A step-by-step guide to our healthcare companion service
            </p>
            <Link to="/book" className="btn-primary inline-flex items-center">
              Book Your Companion
              <FiArrowRight className="ml-2" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Detailed Steps */}
      <section className="py-20">
        <div className="max-width-container section-padding">
          <div className="space-y-16">
            {detailedSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`flex flex-col lg:flex-row gap-8 items-center ${
                  index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                }`}
              >
                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold text-xl">
                      {step.step}
                    </div>
                    <h3 className="text-2xl font-heading font-semibold text-gray-900">
                      {step.title}
                    </h3>
                  </div>
                  
                  <p className="text-gray-600 mb-6">{step.description}</p>
                  
                  <ul className="space-y-2 mb-4">
                    {step.details.map((detail, idx) => (
                      <li key={idx} className="flex items-start">
                        <FiCheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                        <span className="text-gray-700">{detail}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="inline-flex items-center text-sm text-primary font-medium">
                    <FiClock className="mr-2" />
                    {step.time}
                  </div>
                </div>

                {/* Illustration */}
                <div className="flex-1 flex justify-center">
                  <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-12 text-center">
                    <span className="text-6xl">{step.icon}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Companion Qualities */}
      <section className="py-20 bg-gray-50">
        <div className="max-width-container section-padding">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-heading font-bold text-gray-900 mb-4">
              Our Companion Standards
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Every Kinpin companion meets our strict quality standards
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {companionQualities.map((quality, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-lg p-6 shadow-md flex items-center space-x-3"
              >
                <FiShield className="w-6 h-6 text-primary flex-shrink-0" />
                <span className="text-gray-700">{quality}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sample Report */}
      <section className="py-20">
        <div className="max-width-container section-padding">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-heading font-bold text-gray-900 mb-6">
                Digital Visit Summary
              </h2>
              <p className="text-gray-600 mb-6">
                After each visit, you receive a comprehensive digital report that includes:
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <FiCheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Complete visit timeline and activities</span>
                </li>
                <li className="flex items-start">
                  <FiCheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Doctor's diagnosis and recommendations</span>
                </li>
                <li className="flex items-start">
                  <FiCheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Prescription details with dosage instructions</span>
                </li>
                <li className="flex items-start">
                  <FiCheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Follow-up appointment details</span>
                </li>
                <li className="flex items-start">
                  <FiCheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Test results and reports (if any)</span>
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gray-100 rounded-2xl p-8"
            >
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Sample Visit Report</h4>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-gray-600">Patient: Mrs. Sharma</p>
                    <p className="text-gray-600">Date: 25 Jan 2024</p>
                  </div>
                  <div className="border-t pt-3">
                    <p className="font-medium text-gray-900">Visit Summary</p>
                    <p className="text-gray-600 mt-1">
                      Routine cardiology checkup completed successfully. 
                      BP stable at 130/80. ECG normal...
                    </p>
                  </div>
                  <div className="border-t pt-3">
                    <p className="font-medium text-gray-900">Prescriptions</p>
                    <ul className="mt-1 text-gray-600">
                      <li>• Amlodipine 5mg - Once daily</li>
                      <li>• Aspirin 75mg - Once daily</li>
                    </ul>
                  </div>
                  <div className="border-t pt-3">
                    <p className="font-medium text-gray-900">Next Appointment</p>
                    <p className="text-gray-600 mt-1">25 April 2024, 10:00 AM</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20 bg-gray-50">
        <div className="max-width-container section-padding">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl font-heading font-bold text-gray-900 text-center mb-12">
              Frequently Asked Questions
            </h2>
            
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-lg p-6 shadow-md"
                >
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {faq.question}
                  </h3>
                  <p className="text-gray-600">
                    {faq.answer}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary">
        <div className="max-width-container section-padding text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-heading font-bold text-white mb-4">
              Ready to Experience Kinpin?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Book your first companion visit and see the difference professional healthcare support makes
            </p>
            <Link
              to="/book"
              className="bg-white text-primary px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center"
            >
              Book Now
              <FiArrowRight className="ml-2" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HowItWorksPage;