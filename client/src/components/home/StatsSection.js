import React from 'react';
import { motion } from 'framer-motion';
import { FiUsers, FiHeart, FiClock, FiStar } from 'react-icons/fi';

const StatsSection = () => {
  const stats = [
    {
      icon: FiUsers,
      value: '500+',
      label: 'Happy Families',
      color: 'text-primary'
    },
    {
      icon: FiHeart,
      value: '1000+',
      label: 'Successful Visits',
      color: 'text-red-500'
    },
    {
      icon: FiClock,
      value: '24/7',
      label: 'Support Available',
      color: 'text-blue-500'
    },
    {
      icon: FiStar,
      value: '4.9/5',
      label: 'Customer Rating',
      color: 'text-yellow-500'
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-width-container section-padding">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 ${stat.color} mb-4`}>
                <stat.icon className="w-8 h-8" />
              </div>
              <h3 className="text-3xl font-heading font-bold text-gray-900 mb-1">
                {stat.value}
              </h3>
              <p className="text-gray-600">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;