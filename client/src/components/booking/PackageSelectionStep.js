import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiArrowRight, FiCheck, FiStar } from 'react-icons/fi';
import pricingService from '../../services/pricing';
import { trackEvent } from '../../utils/attribution';
import LoadingSpinner from '../common/LoadingSpinner';
import { formatCurrency } from '../../utils/helpers';

const PackageSelectionStep = ({ data, updateData, onNext, onPrevious }) => {
  const [plans, setPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPlanId, setSelectedPlanId] = useState(data.packageId || 'single');
  const [promoCode, setPromoCode] = useState(data.promoCode || '');
  const [expandedPlans, setExpandedPlans] = useState({});
  const normalizedCode = promoCode.trim().toUpperCase();
  const computedDiscount = (normalizedCode === 'NCKLPRD' || normalizedCode === 'GLDPM') ? 200 : 0;

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
          name: 'Single Visit Package',
          price: 799,
          originalPrice: 799, // No discount for single visit
          visits: 1,
          validity: 'One-time use',
          description: 'One-time hospital visit assistance',
          features: [
            'Door-to-door companion service',
            'In-clinic support & advocacy',
            'Digital visit summary',
            'Medicine reminders',
            'Family updates via WhatsApp'
          ],
          popular: false,
          savings: 0 // No savings for single visit
        },
        {
          id: 'weekly',
          name: 'Weekly Care Package',
          price: 2800,
          originalPrice: 3196,
          visits: 4,
          validity: '30 days from purchase',
          description: '4 hospital visits within a month',
          pricePerVisit: 700,
          features: [
            'All Single Visit features',
            'Priority companion assignment',
            'Dedicated care coordinator',
            'Monthly health report',
            'Free rescheduling'
          ],
          popular: true,
          savings: 396
        },
        {
          id: 'monthly',
          name: 'Monthly Complete Care Package',
          price: 4500,
          originalPrice: 6392,
          visits: 8,
          validity: '30 days from purchase',
          description: '8 hospital visits + priority scheduling',
          pricePerVisit: 562.50,
          features: [
            'All Weekly Package features',
            'Same companion preference',
            'Priority booking included',
            'Medicine delivery assistance',
            'Emergency support helpline'
          ],
          popular: false,
          savings: 1892
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectPlan = (plan) => {
    trackEvent('pricing_plan_select', { planId: plan.id, price: plan.price });
    setSelectedPlanId(plan.id);
    updateData({
      packageId: plan.id,
      packageName: plan.name,
      totalAmount: plan.price,
      visits: plan.visits,
      originalPrice: plan.originalPrice,
      savings: plan.savings,
      validity: plan.validity,
      description: plan.description
    });
  };

  const handleContinue = () => {
    // Apply promo into booking data (discount calculation happens on backend as well)
    updateData({ promoCode });
    trackEvent('booking_step_continue', { step: 'package_selection', selectedPlanId });
    onNext();
  };

  const toggleExpanded = (planId) => {
    setExpandedPlans((prev) => ({ ...prev, [planId]: !prev[planId] }));
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
                <p className="text-xs text-gray-500 mt-1">{plan.description}</p>
                <p className="text-xs text-gray-500">Validity: {plan.validity}</p>
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
              {(expandedPlans[plan.id] ? plan.features : plan.features.slice(0, 3)).map((feature, idx) => (
                <li key={idx} className="flex items-start">
                  <FiCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
              {plan.features.length > 3 && (
                <li className="text-sm text-gray-600 pl-5">
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); toggleExpanded(plan.id); }}
                    className="text-primary hover:underline"
                  >
                    {expandedPlans[plan.id] ? 'Show fewer features' : `+${plan.features.length - 3} more features`}
                  </button>
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
          <li>• Weekly and Monthly packages valid for 30 days from purchase</li>
          <li>• Free rescheduling with Weekly Care Package</li>
          <li>• Priority booking included with Monthly Complete Care Package</li>
        </ul>
      </div>

      {/* Promo Code */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-8">
        <h4 className="font-medium text-gray-900 mb-2">Have a promo code?</h4>
        <div className="flex gap-3 items-center">
          <input
            type="text"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            placeholder="Enter promo (optional)"
            className="input-field flex-1"
          />
          {computedDiscount > 0 && (
            <span className="text-green-700 font-medium">-₹{computedDiscount} (Applied)</span>
          )}
        </div>
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