import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiArrowRight, FiCheck, FiStar } from 'react-icons/fi';
import pricingService from '../../services/pricing';
import LoadingSpinner from '../common/LoadingSpinner';
import { formatCurrency } from '../../utils/helpers';

const PackageSelectionStep = ({ data, updateData, onNext, onPrevious }) => {
  const [plans, setPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPlanId, setSelectedPlanId] = useState(data.packageId || 'single');

  useEffect(() => {
    fetchPricingPlans();
  }, []);

  const fetchPricingPlans = async () => {
    try {
      const response = await pricingService.getPricingPlans();
      setPlans(response.plans);
    } catch (error) {
      console.error('Error fetching pricing plans:', error);
      // Fallback pricing plans if API fails
      setPlans([
        {
          id: 'single',
          name: 'Single Visit',
          price: 799,
          originalPrice: 999,
          visits: 1,
          features: [
            'Door-to-door companion service',
            'In-clinic support & advocacy',
            'Digital visit summary',
            'Medicine reminders',
            'Family updates via WhatsApp'
          ],
          popular: false,
          savings: null
        },
        {
          id: 'pack6',
          name: '6 Visit Package',
          price: 4499,
          originalPrice: 5994,
          visits: 6,
          pricePerVisit: 750,
          features: [
            'All Single Visit features',
            'Priority companion assignment',
            'Dedicated care coordinator',
            'Monthly health report',
            'Free rescheduling'
          ],
          popular: true,
          savings: 1495
        },
        {
          id: 'pack12',
          name: '12 Visit Package',
          price: 8499,
          originalPrice: 11988,
          visits: 12,
          pricePerVisit: 708,
          features: [
            'All 6 Visit Package features',
            'Same companion preference',
            'Quarterly doctor consultation',
            'Medicine delivery assistance',
            'Emergency support helpline'
          ],
          popular: false,
          savings: 3489
        },
        {
          id: 'pack24',
          name: '24 Visit Package',
          price: 15999,
          originalPrice: 23976,
          visits: 24,
          pricePerVisit: 667,
          features: [
            'All 12 Visit Package features',
            'Dedicated companion team',
            'Home health checkups',
            'Annual health assessment',
            'VIP support & priority booking'
          ],
          popular: false,
          savings: 7977
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectPlan = (plan) => {
    setSelectedPlanId(plan.id);
    updateData({
      packageId: plan.id,
      packageName: plan.name,
      totalAmount: plan.price,
      visits: plan.visits,
      originalPrice: plan.originalPrice,
      savings: plan.savings
    });
  };

  const handleContinue = () => {
    onNext();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <h2 className="text-2xl font-heading font-semibold text-gray-900 mb-6">
        Select Your Package
      </h2>
      <p className="text-gray-600 mb-8">
        Choose the package that best fits your needs
      </p>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {plans.map((plan) => (
          <div
            key={plan.id}
            onClick={() => handleSelectPlan(plan)}
            className={`border-2 rounded-xl p-5 cursor-pointer transition-all ${
              selectedPlanId === plan.id
                ? 'border-primary bg-primary/5'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold text-lg">{plan.name}</h3>
                {plan.visits > 1 && (
                  <p className="text-sm text-gray-600">{plan.visits} visits</p>
                )}
              </div>
              {plan.popular && (
                <span className="bg-primary text-white text-xs px-2 py-1 rounded-full flex items-center">
                  <FiStar className="mr-1" size={12} />
                  Popular
                </span>
              )}
            </div>

            <div className="mb-4">
              <div className="flex items-baseline">
                <span className="text-2xl font-bold">{formatCurrency(plan.price)}</span>
                {plan.originalPrice && (
                  <span className="text-gray-500 line-through ml-2">
                    {formatCurrency(plan.originalPrice)}
                  </span>
                )}
              </div>
              {plan.pricePerVisit && (
                <p className="text-sm text-gray-600 mt-1">
                  ₹{plan.pricePerVisit} per visit
                </p>
              )}
              {plan.savings && (
                <p className="text-sm text-green-600 font-medium mt-1">
                  Save {formatCurrency(plan.savings)}
                </p>
              )}
            </div>

            <ul className="space-y-2 mb-4">
              {plan.features.slice(0, 3).map((feature, idx) => (
                <li key={idx} className="flex items-start">
                  <FiCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
              {plan.features.length > 3 && (
                <li className="text-sm text-gray-600 pl-5">
                  +{plan.features.length - 3} more features
                </li>
              )}
            </ul>

            <div className="mt-4">
              <button
                type="button"
                className={`w-full py-2 px-4 rounded-lg text-center font-medium ${
                  selectedPlanId === plan.id
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {selectedPlanId === plan.id ? 'Selected' : 'Select Package'}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
        <h4 className="font-medium text-yellow-900 mb-2">Package Benefits</h4>
        <ul className="text-sm text-yellow-800 space-y-1">
          <li>• Multi-visit packages offer significant savings</li>
          <li>• Packages are valid for 12 months from purchase</li>
          <li>• Free rescheduling with 6+ visit packages</li>
          <li>• Priority booking for package customers</li>
        </ul>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <button
          type="button"
          onClick={onPrevious}
          className="btn-ghost inline-flex items-center"
        >
          <FiArrowLeft className="mr-2" />
          Previous
        </button>
        <button
          type="button"
          onClick={handleContinue}
          className="btn-primary inline-flex items-center"
        >
          Next
          <FiArrowRight className="ml-2" />
        </button>
      </div>
    </motion.div>
  );
};

export default PackageSelectionStep;