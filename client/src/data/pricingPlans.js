export const pricingPlans = [
  {
    id: 'single',
    name: 'Single Visit Package',
    price: 799,
    originalPrice: 799,
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
    savings: 0
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

export default pricingPlans;


