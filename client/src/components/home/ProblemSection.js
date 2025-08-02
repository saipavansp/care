import React from 'react';
import { motion } from 'framer-motion';
import { FiAlertCircle, FiUsers, FiClock, FiFileText } from 'react-icons/fi';

const ProblemSection = () => {
  const problems = [
    {
      icon: FiAlertCircle,
      title: 'Missed Appointments',
      description: '27% of hospital visits are missed or poorly followed due to lack of support',
      color: 'bg-red-100 text-red-600'
    },
    {
      icon: FiUsers,
      title: 'Family Availability',
      description: 'Working family members struggle to accompany elderly parents to hospitals',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      icon: FiClock,
      title: 'Long Wait Times',
      description: 'Patients spend hours navigating complex hospital procedures alone',
      color: 'bg-yellow-100 text-yellow-600'
    },
    {
      icon: FiFileText,
      title: 'Poor Documentation',
      description: 'Critical medical information often gets lost or misunderstood',
      color: 'bg-purple-100 text-purple-600'
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-width-container section-padding">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-4">
            The Healthcare Challenge We Solve
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Navigating healthcare alone is challenging, especially for elderly patients. 
            We're here to bridge that gap.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {problems.map((problem, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${problem.color} mb-4`}>
                <problem.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {problem.title}
              </h3>
              <p className="text-gray-600 text-sm">
                {problem.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-12 text-center bg-primary/10 rounded-2xl p-8"
        >
          <h3 className="text-2xl font-heading font-semibold text-gray-900 mb-2">
            That's Why We Created Care Companion
          </h3>
          <p className="text-gray-700 max-w-2xl mx-auto">
            Professional healthcare companions who ensure no patient faces their medical journey alone, 
            providing support, advocacy, and peace of mind to families.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default ProblemSection;