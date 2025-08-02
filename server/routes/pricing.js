const express = require('express');
const router = express.Router();

const pricingPlans = [
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
    if (visits >= 24) {
      basePrice = 667;
      discount = 0.33;
    } else if (visits >= 12) {
      basePrice = 708;
      discount = 0.29;
    } else if (visits >= 6) {
      basePrice = 750;
      discount = 0.25;
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