const express = require('express');
const router = express.Router();

const pricingPlans = [
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
];

// Get all pricing plans
router.get('/', (req, res) => {
  res.json({
    plans: pricingPlans,
    currency: 'INR',
    currencySymbol: '₹'
  });
});

// Get single pricing plan
router.get('/:planId', (req, res) => {
  const plan = pricingPlans.find(p => p.id === req.params.planId);
  
  if (!plan) {
    return res.status(404).json({ message: 'Pricing plan not found' });
  }

  res.json({ plan });
});

// Calculate pricing for custom requirements
router.post('/calculate', (req, res) => {
  try {
    const { visits, addOns = [] } = req.body;

    if (!visits || visits < 1) {
      return res.status(400).json({ message: 'Invalid number of visits' });
    }

    let basePrice = 799;
    let discount = 0;

    // Apply bulk discounts
    if (visits >= 8) {
      basePrice = 562.50;
      discount = 0.30;
    } else if (visits >= 4) {
      basePrice = 700;
      discount = 0.12;
    }

    const subtotal = basePrice * visits;
    const totalDiscount = Math.round(799 * visits - subtotal);

    // Add-on prices
    const addOnPrices = {
      'emergency': 200,
      'reports': 100,
      'medicines': 150
    };

    let addOnTotal = 0;
    addOns.forEach(addon => {
      if (addOnPrices[addon]) {
        addOnTotal += addOnPrices[addon] * visits;
      }
    });

    res.json({
      visits,
      basePrice,
      subtotal,
      discount: discount * 100,
      totalDiscount,
      addOnTotal,
      total: subtotal + addOnTotal,
      currency: 'INR',
      currencySymbol: '₹'
    });
  } catch (error) {
    console.error('Pricing calculation error:', error);
    res.status(500).json({ message: 'Error calculating pricing' });
  }
});

module.exports = router;