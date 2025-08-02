import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiChevronRight, FiStar } from 'react-icons/fi';

const TestimonialsSection = () => {
  const TESTIMONIALS = [
    {
      id: 1,
      name: 'Priya Sharma',
      role: 'Daughter (Delhi)',
      content: 'Care Companion has been a blessing for our family. My mother needed regular visits to AIIMS for her cardiac checkups. The companion spoke fluent Hindi, helped with all paperwork, and sent me updates throughout. माँ बहुत खुश हैं!',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80'
    },
    {
      id: 2,
      name: 'Rajesh Kumar',
      role: 'Son (Mumbai)',
      content: 'Working in IT, I couldn\'t accompany my father to Kokilaben Hospital. The companion not only helped with the doctor visit but also explained the prescription in simple terms. They even helped get the medicines. Excellent service!',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80'
    },
    {
      id: 3,
      name: 'Anita Patel',
      role: 'Patient (Ahmedabad)',
      content: 'मैं 72 साल की हूँ और अकेली रहती हूँ। Care Companion की वजह से मुझे अस्पताल जाने में कोई परेशानी नहीं होती। They treat me like family and handle everything professionally.',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1582896911227-c966f6e7fb93?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80'
    },
    {
      id: 4,
      name: 'Suresh Reddy',
      role: 'Son (Hyderabad)',
      content: 'My parents live in Hyderabad while I work in the US. Care Companion ensures they never miss their appointments at Apollo Hospital. The digital reports help me stay updated about their health. Truly reliable service!',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80'
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? TESTIMONIALS.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === TESTIMONIALS.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="py-20 bg-orange-50/30">
      <div className="max-width-container section-padding">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-4">
            What Indian Families Say
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Real stories from families across India who trust us with their parents' healthcare
          </p>
        </motion.div>

        <div className="relative max-w-4xl mx-auto">
          {/* Testimonial Carousel */}
          <div className="relative overflow-hidden rounded-2xl bg-white shadow-xl p-8 md:p-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="text-center"
              >
                {/* Rating Stars */}
                <div className="flex justify-center mb-6">
                  {[...Array(5)].map((_, i) => (
                    <FiStar
                      key={i}
                      className={`w-6 h-6 ${
                        i < TESTIMONIALS[currentIndex].rating
                          ? 'text-orange-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>

                {/* Content */}
                <blockquote className="text-xl md:text-2xl text-gray-700 mb-8 italic">
                  "{TESTIMONIALS[currentIndex].content}"
                </blockquote>

                {/* Author */}
                <div className="flex items-center justify-center space-x-4">
                  <img
                    src={TESTIMONIALS[currentIndex].image}
                    alt={TESTIMONIALS[currentIndex].name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="text-left">
                    <p className="font-semibold text-gray-900">
                      {TESTIMONIALS[currentIndex].name}
                    </p>
                    <p className="text-gray-600">
                      {TESTIMONIALS[currentIndex].role}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <button
              onClick={handlePrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow"
              aria-label="Previous testimonial"
            >
              <FiChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow"
              aria-label="Next testimonial"
            >
              <FiChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-6 space-x-2">
            {TESTIMONIALS.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-primary w-8'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <p className="text-gray-600 mb-4">Trusted by families across India</p>
          <div className="flex flex-wrap justify-center gap-8 items-center">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">500+</p>
              <p className="text-sm text-gray-600">Indian Families</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">15+</p>
              <p className="text-sm text-gray-600">Cities Covered</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">8+</p>
              <p className="text-sm text-gray-600">Regional Languages</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;