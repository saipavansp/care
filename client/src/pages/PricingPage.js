import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCheck, FiTrendingUp } from 'react-icons/fi';
import { formatCurrency } from '../utils/helpers';
import pricingPlans from '../data/pricingPlans';

const PricingPage = () => {
  const plans = pricingPlans;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="max-width-container section-padding">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-6">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Choose the plan that works best for you. No hidden fees, no surprises.
            </p>
            <div className="inline-flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-full">
              <FiTrendingUp className="mr-2" />
              <span className="font-medium">Save up to 33% with our packages</span>
            </div>
            <p className="text-sm text-gray-600 mt-4">
              * All prices are exclusive of 18% GST
            </p>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20">
        <div className="max-width-container section-padding">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative ${plan.popular ? 'scale-105' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className={`bg-white rounded-2xl shadow-lg overflow-hidden h-full ${
                  plan.popular ? 'ring-2 ring-primary' : ''
                }`}>
                  {/* Plan Header */}
                  <div className="p-6 text-center border-b">
                    <h3 className="text-xl font-heading font-semibold text-gray-900 mb-2">
                      {plan.name}
                    </h3>
                    {plan.description && (
                      <p className="text-sm text-gray-600 mb-2">
                        "{plan.description}"
                      </p>
                    )}
                    <div className="mb-2">
                      <span className="text-4xl font-bold text-gray-900">
                        {formatCurrency(plan.price)}
                      </span>
                      {plan.originalPrice && plan.originalPrice > plan.price && (
                        <span className="text-gray-500 line-through ml-2">
                          {formatCurrency(plan.originalPrice)}
                        </span>
                      )}
                    </div>
                    {plan.visits > 1 && (
                      <p className="text-sm text-gray-600">
                        {plan.visits} visits
                      </p>
                    )}
                    {plan.validity && (
                      <p className="text-sm text-gray-600">
                        Validity: {plan.validity}
                      </p>
                    )}
                    {plan.pricePerVisit && (
                      <p className="text-sm text-gray-600 mt-1">
                        ₹{plan.pricePerVisit} per visit
                      </p>
                    )}
                    {plan.savings > 0 && (
                      <p className="text-sm text-green-600 font-medium mt-2">
                        Save {formatCurrency(plan.savings)}
                      </p>
                    )}
                  </div>

                  {/* Features */}
                  <div className="p-6">
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start">
                          <FiCheck className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                          <span className="text-gray-700 text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Link
                      to="/book"
                      className={`w-full text-center py-3 rounded-lg font-medium transition-colors ${
                        plan.popular
                          ? 'bg-primary text-white hover:bg-primary-dark'
                          : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                      }`}
                    >
                      Get Started
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-width-container section-padding">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl font-heading font-bold text-gray-900 text-center mb-12">
              Frequently Asked Questions
            </h2>
            
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Can I change my plan later?
                </h3>
                <p className="text-gray-600">
                  Yes, you can upgrade or downgrade your plan at any time. The changes will reflect in your next billing cycle.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-2">
                  What's included in each visit?
                </h3>
                <p className="text-gray-600">
                  Each visit includes door-to-door pickup and drop, in-clinic support, digital visit summary, 
                  medicine management assistance, and real-time family updates via WhatsApp.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Do unused visits expire?
                </h3>
                <p className="text-gray-600">
                  Weekly and Monthly Care Package visits are valid for 30 days from the date of purchase. We'll send you reminders 
                  to ensure you utilize all your visits within the validity period.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Can I share my package with family members?
                </h3>
                <p className="text-gray-600">
                  Yes! Your package visits can be used for any family member. Simply provide their details 
                  when booking the companion service.
                </p>
              </div>
            </div>

            <div className="text-center mt-12">
              <p className="text-gray-600 mb-4">Have more questions?</p>
              <Link to="/contact" className="btn-primary inline-flex items-center">
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary">
        <div className="max-width-container section-padding text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-3xl font-heading font-bold text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join hundreds of families who trust us with their healthcare journey
            </p>
            <Link
              to="/book"
              className="bg-white text-primary px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center"
            >
              Book Your First Visit
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default PricingPage;