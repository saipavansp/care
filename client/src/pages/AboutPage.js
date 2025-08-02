import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHeart, FiUsers, FiAward, FiTarget } from 'react-icons/fi';

const AboutPage = () => {
  const values = [
    {
      icon: FiHeart,
      title: 'Compassion First',
      description: 'We treat every patient with the same care and respect we would want for our own family.'
    },
    {
      icon: FiUsers,
      title: 'Professional Excellence',
      description: 'Our companions are thoroughly trained healthcare professionals committed to quality service.'
    },
    {
      icon: FiAward,
      title: 'Trust & Reliability',
      description: 'We build lasting relationships through consistent, dependable service and transparent communication.'
    },
    {
      icon: FiTarget,
      title: 'Patient-Centric',
      description: 'Every decision we make is guided by what\'s best for the patient and their family.'
    }
  ];

  const stats = [
    { number: '500+', label: 'Families Served' },
    { number: '1000+', label: 'Successful Visits' },
    { number: '50+', label: 'Trained Companions' },
    { number: '10+', label: 'Partner Hospitals' }
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
              About Care Companion
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              We're on a mission to ensure no patient faces their healthcare journey alone. 
              Our trained companions provide professional support, advocacy, and peace of mind 
              to families across India.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20">
        <div className="max-width-container section-padding">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-3xl font-heading font-bold text-gray-900 mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Care Companion was born from a personal experience. When our founder's elderly 
                  mother needed frequent hospital visits but family members couldn't always accompany 
                  her due to work commitments, we realized thousands of families face the same challenge.
                </p>
                <p>
                  We started in 2022 with a simple goal: provide professional, compassionate companions 
                  who could fill this gap. Today, we've helped over 500 families ensure their loved 
                  ones receive the support they deserve during medical appointments.
                </p>
                <p>
                  Every companion in our team is carefully selected and trained not just in healthcare 
                  protocols, but in empathy, patience, and effective communication. Because we believe 
                  that healthcare is not just about medical treatment—it's about human connection.
                </p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="relative"
            >
              <img
                src="https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Care Companion team"
                className="rounded-2xl shadow-xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-primary text-white rounded-xl p-6 shadow-lg">
                <p className="text-2xl font-bold"></p>
                <p className="text-sm"> Trusted Service</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-width-container section-padding">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-heading font-bold text-gray-900 mb-4">
              Our Core Values
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              These principles guide everything we do at Care Companion
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.1 }}
                className="text-center"
              >
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow h-full">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 text-primary rounded-full mb-4">
                    <value.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-600">
                    {value.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-primary">
        <div className="max-width-container section-padding">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="text-center text-white"
              >
                <p className="text-4xl font-bold mb-2">{stat.number}</p>
                <p className="text-white/80">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="max-width-container section-padding">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-heading font-bold text-gray-900 mb-4">
              Meet Our Leadership
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Dedicated professionals committed to transforming healthcare support
            </p>
          </motion.div>

          {/* <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                name: 'Dr. Priya Sharma',
                role: 'Founder & CEO',
                image: 'https://i.pravatar.cc/300?img=1',
                bio: 'Former healthcare administrator with 15+ years experience'
              },
              {
                name: 'Rajesh Kumar',
                role: 'Head of Operations',
                image: 'https://i.pravatar.cc/300?img=3',
                bio: 'Operations expert focused on service excellence'
              },
              {
                name: 'Dr. Anita Patel',
                role: 'Head of Training',
                image: 'https://i.pravatar.cc/300?img=5',
                bio: 'Medical professional ensuring companion quality'
              }
            ].map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.1 }}
                className="text-center"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-semibold text-gray-900">{member.name}</h3>
                <p className="text-primary font-medium mb-2">{member.role}</p>
                <p className="text-gray-600 text-sm">{member.bio}</p>
              </motion.div>
            ))}
          </div> */}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary-dark">
        <div className="max-width-container section-padding text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-3xl font-heading font-bold text-white mb-4">
              Join Our Mission
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Experience the difference compassionate healthcare support can make
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/book"
                className="bg-white text-primary px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Book a Companion
              </Link>
              <Link
                to="/contact"
                className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-primary transition-all"
              >
                Get in Touch
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;