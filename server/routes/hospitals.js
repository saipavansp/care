const express = require('express');
const router = express.Router();

// Mock hospital data - In production, this would come from a database
const hospitals = [
  {
    id: 1,
    name: "Apollo Hospitals",
    address: "Jubilee Hills, Hyderabad",
    city: "Hyderabad",
    specialties: ["Cardiology", "Neurology", "Oncology", "Orthopedics"],
    rating: 4.5
  },
  {
    id: 2,
    name: "Fortis Hospital",
    address: "Bannerghatta Road, Bangalore",
    city: "Bangalore",
    specialties: ["Cardiology", "Gastroenterology", "Nephrology", "Pediatrics"],
    rating: 4.3
  },
  {
    id: 3,
    name: "Max Super Speciality Hospital",
    address: "Saket, New Delhi",
    city: "New Delhi",
    specialties: ["Neurology", "Oncology", "Cardiology", "Orthopedics"],
    rating: 4.4
  },
  {
    id: 4,
    name: "Medanta - The Medicity",
    address: "Sector 38, Gurgaon",
    city: "Gurgaon",
    specialties: ["Heart", "Kidney", "Liver", "Bone & Joint"],
    rating: 4.6
  },
  {
    id: 5,
    name: "Kokilaben Dhirubhai Ambani Hospital",
    address: "Andheri West, Mumbai",
    city: "Mumbai",
    specialties: ["Cancer", "Heart", "Transplant", "Neurosciences"],
    rating: 4.5
  },
  {
    id: 6,
    name: "AIIMS",
    address: "Ansari Nagar, New Delhi",
    city: "New Delhi",
    specialties: ["All Specialties"],
    rating: 4.7
  },
  {
    id: 7,
    name: "Narayana Health",
    address: "Bommasandra, Bangalore",
    city: "Bangalore",
    specialties: ["Heart", "Cancer", "Neurology", "Orthopedics"],
    rating: 4.2
  },
  {
    id: 8,
    name: "Manipal Hospital",
    address: "HAL Airport Road, Bangalore",
    city: "Bangalore",
    specialties: ["Multi-Specialty"],
    rating: 4.3
  },
  {
    id: 9,
    name: "Sir Ganga Ram Hospital",
    address: "Rajinder Nagar, New Delhi",
    city: "New Delhi",
    specialties: ["Kidney", "Liver", "Heart", "Cancer"],
    rating: 4.4
  },
  {
    id: 10,
    name: "Breach Candy Hospital",
    address: "Breach Candy, Mumbai",
    city: "Mumbai",
    specialties: ["Multi-Specialty"],
    rating: 4.5
  }
];

// Search hospitals
router.get('/search', (req, res) => {
  try {
    const { q, city, specialty } = req.query;
    let filteredHospitals = [...hospitals];

    // Filter by search query
    if (q) {
      const searchTerm = q.toLowerCase();
      filteredHospitals = filteredHospitals.filter(hospital => 
        hospital.name.toLowerCase().includes(searchTerm) ||
        hospital.address.toLowerCase().includes(searchTerm) ||
        hospital.city.toLowerCase().includes(searchTerm)
      );
    }

    // Filter by city
    if (city) {
      filteredHospitals = filteredHospitals.filter(hospital => 
        hospital.city.toLowerCase() === city.toLowerCase()
      );
    }

    // Filter by specialty
    if (specialty) {
      filteredHospitals = filteredHospitals.filter(hospital => 
        hospital.specialties.some(s => 
          s.toLowerCase().includes(specialty.toLowerCase())
        )
      );
    }

    res.json({
      hospitals: filteredHospitals,
      total: filteredHospitals.length
    });
  } catch (error) {
    console.error('Hospital search error:', error);
    res.status(500).json({ message: 'Error searching hospitals' });
  }
});

// Get all hospitals
router.get('/', (req, res) => {
  res.json({
    hospitals,
    total: hospitals.length
  });
});

// Get cities
router.get('/cities', (req, res) => {
  const cities = [...new Set(hospitals.map(h => h.city))].sort();
  res.json({ cities });
});

// Get specialties
router.get('/specialties', (req, res) => {
  const allSpecialties = hospitals.flatMap(h => h.specialties);
  const specialties = [...new Set(allSpecialties)].sort();
  res.json({ specialties });
});

module.exports = router;