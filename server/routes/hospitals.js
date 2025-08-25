const express = require('express');
const router = express.Router();

// Mock hospital data (Hyderabad focused). In production, this would come from a database
const hospitals = [
  { id: 1, name: 'Apollo Hospitals Jubilee Hills', address: 'Rd Number 72, Jubilee Hills', city: 'Hyderabad', specialties: ['Multi‑Specialty'], rating: 4.6 },
  { id: 2, name: 'Continental Hospitals', address: 'Financial District, Gachibowli', city: 'Hyderabad', specialties: ['Multi‑Specialty'], rating: 4.5 },
  { id: 3, name: 'KIMS Hospitals, Kondapur', address: 'Survey No 5/EE, Kondapur', city: 'Hyderabad', specialties: ['Multi‑Specialty'], rating: 4.5 },
  { id: 4, name: 'Gandhi Hospital', address: 'Musheerabad', city: 'Hyderabad', specialties: ['Government'], rating: 4.2 },
  { id: 5, name: 'Gleneagles AWARE Hospital, LB Nagar', address: 'LB Nagar', city: 'Hyderabad', specialties: ['Multi‑Specialty'], rating: 4.3 },
  { id: 6, name: 'Nampally Government Hospital', address: 'Nampally', city: 'Hyderabad', specialties: ['Government'], rating: 4.1 },
  { id: 7, name: 'Shree Healthcare Multi Specialty Hospital', address: 'Nalla Cheruvu, Boduppal', city: 'Hyderabad', specialties: ['Multi‑Specialty'], rating: 4.2 },
  { id: 8, name: 'Pranadhara Super Speciality Hospitals', address: 'Manikya Nagar, KMG', city: 'Hyderabad', specialties: ['Multi‑Specialty'], rating: 4.0 },
  { id: 9, name: 'Premier Hospital', address: 'Khader Bagh Rd, Tolichowki', city: 'Hyderabad', specialties: ['Multi‑Specialty'], rating: 4.3 },
  { id: 10, name: 'Indo‑US Multi Speciality Hospital', address: 'Jama Masjid St, Mehdipatnam', city: 'Hyderabad', specialties: ['Multi‑Specialty'], rating: 4.1 },
  { id: 11, name: 'Jayanthi Super Specialty Hospital', address: 'Umesh Chandra Statue, Koti', city: 'Hyderabad', specialties: ['Multi‑Specialty'], rating: 4.0 },
  { id: 12, name: 'Pranahitha Multi Speciality, Dilsukhnagar', address: 'Pillar No. A, Dilsukhnagar', city: 'Hyderabad', specialties: ['Multi‑Specialty'], rating: 4.1 },
  { id: 13, name: 'Mina Multispeciality Hospital', address: 'Royal Colony, Mehdipatnam', city: 'Hyderabad', specialties: ['Multi‑Specialty'], rating: 4.0 },
  { id: 14, name: 'Sai Vani Super Speciality Hospital', address: 'Kachiguda', city: 'Hyderabad', specialties: ['Multi‑Specialty'], rating: 4.2 },
  { id: 15, name: 'Nirmala Hospital', address: 'Vijaya Nagar Colony', city: 'Hyderabad', specialties: ['Multi‑Specialty'], rating: 4.0 },
  { id: 16, name: 'Parindhevi Hospitals', address: 'Bhagyanagar Colony, Kukatpally', city: 'Hyderabad', specialties: ['Multi‑Specialty'], rating: 4.1 },
  { id: 17, name: 'SV Super Speciality Hospital', address: 'Ayush Vana Rd, Bahadurpally', city: 'Hyderabad', specialties: ['Multi‑Specialty'], rating: 4.1 },
  { id: 18, name: 'Gleneagles Hospital, Lakdi‑ka‑Pul', address: 'Lakdi‑ka‑Pul', city: 'Hyderabad', specialties: ['Multi‑Specialty'], rating: 4.4 },
  { id: 19, name: 'Health Valley Hospital', address: 'Nizampet', city: 'Hyderabad', specialties: ['Multi‑Specialty'], rating: 4.1 },
  { id: 20, name: 'Sidarth Hospitals, Miyapur', address: 'Miyapur', city: 'Hyderabad', specialties: ['Multi‑Specialty'], rating: 4.0 },
  { id: 21, name: 'Apollo Spectra Hospitals', address: 'Kothaguda X Rd', city: 'Hyderabad', specialties: ['Multi‑Specialty'], rating: 4.2 },
  { id: 22, name: 'Omega Hospitals, Gachibowli', address: 'CHR Lane, Rd No 1, Seven Hills', city: 'Hyderabad', specialties: ['Oncology', 'Multi‑Specialty'], rating: 4.4 },
  { id: 23, name: 'Lifespan Super Speciality Hospital', address: 'Near SBI Bank, APICC Colony', city: 'Hyderabad', specialties: ['Multi‑Specialty'], rating: 4.0 },
  { id: 24, name: 'CARE Hospitals, Banjara Hills', address: 'Rd No 1, Banjara Hills', city: 'Hyderabad', specialties: ['Multi‑Specialty'], rating: 4.5 },
  { id: 25, name: 'Rex Super Speciality Hospital', address: 'A‑Block, Alkapur Township', city: 'Hyderabad', specialties: ['Multi‑Specialty'], rating: 4.1 },
  { id: 26, name: 'CARE Hospitals, Nampally', address: 'Exhibition Grounds, Nampally', city: 'Hyderabad', specialties: ['Multi‑Specialty'], rating: 4.2 },
  { id: 27, name: 'Vasavi Cardiology Institute, Lakdikapul', address: 'Lakdi‑ka‑Pul', city: 'Hyderabad', specialties: ['Cardiology'], rating: 4.2 },
  { id: 28, name: 'American Oncology Institute, Hyderabad', address: 'Citizens Hospital Rd, Nallagandla', city: 'Hyderabad', specialties: ['Oncology'], rating: 4.3 },
  { id: 29, name: 'Sankara Eye Hospital', address: 'Narsingi, Nanakramguda', city: 'Hyderabad', specialties: ['Ophthalmology'], rating: 4.4 },
  { id: 30, name: 'Motherhood Hospitals', address: 'Moula Ali Rd, MIGH Colony', city: 'Hyderabad', specialties: ['Maternity'], rating: 4.2 }
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