const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Booking = require('./models/Booking');

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/care-companion');
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Booking.deleteMany({});
    console.log('Cleared existing data');

    // Create demo users
    const hashedPassword = await bcrypt.hash('demo123', 10);

    // Demo User
    const demoUser = await User.create({
      name: 'Demo User',
      phone: '9876543210',
      email: 'demo@carecompanion.in',
      password: hashedPassword,
      whatsapp: '9876543210',
      role: 'user',
      familyMembers: [
        {
          name: 'Sunita Sharma',
          relation: 'Mother',
          phone: '9876543211'
        }
      ]
    });

    // Demo Companion
    const demoCompanion = await User.create({
      name: 'Rajesh Kumar',
      phone: '9876543211',
      email: 'companion@carecompanion.in',
      password: hashedPassword,
      whatsapp: '9876543211',
      role: 'companion'
    });

    // Demo Admin
    const demoAdmin = await User.create({
      name: 'Admin User',
      phone: '9876543212',
      email: 'admin@carecompanion.in',
      password: hashedPassword,
      role: 'admin'
    });

    console.log('Created demo users');

    // Create demo bookings
    const bookings = [
      {
        userId: demoUser._id,
        patientName: 'Sunita Sharma',
        patientAge: 65,
        patientGender: 'female',
        medicalConditions: 'Diabetes, Hypertension',
        hospital: 'Apollo Hospitals, Delhi',
        doctor: 'Dr. Arun Verma',
        department: 'Cardiology',
        appointmentDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        appointmentTime: '10:00 AM',
        pickupAddress: 'B-42, Vasant Kunj, New Delhi - 110070',
        preferredLanguage: 'Hindi',
        status: 'confirmed',
        totalAmount: 799,
        paymentStatus: 'paid'
      },
      {
        userId: demoUser._id,
        patientName: 'Sunita Sharma',
        patientAge: 65,
        patientGender: 'female',
        hospital: 'AIIMS, New Delhi',
        doctor: 'Dr. Priya Singh',
        department: 'General Medicine',
        appointmentDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
        appointmentTime: '2:00 PM',
        pickupAddress: 'B-42, Vasant Kunj, New Delhi - 110070',
        preferredLanguage: 'Hindi',
        status: 'completed',
        totalAmount: 799,
        paymentStatus: 'paid',
        companion: {
          id: demoCompanion._id,
          name: demoCompanion.name,
          phone: demoCompanion.phone,
          assignedAt: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000)
        },
        visitSummary: {
          notes: 'Patient visited for routine checkup. Blood pressure stable at 130/80. Doctor prescribed medication for 30 days. Next appointment scheduled after 1 month.',
          prescriptions: [
            {
              medicine: 'Metformin 500mg',
              dosage: 'Twice daily after meals',
              duration: '30 days'
            },
            {
              medicine: 'Amlodipine 5mg',
              dosage: 'Once daily in morning',
              duration: '30 days'
            }
          ],
          uploadedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
        },
        rating: {
          score: 5,
          feedback: 'Excellent service! The companion was very helpful and caring.',
          ratedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000)
        }
      }
    ];

    await Booking.create(bookings);
    console.log('Created demo bookings');

    console.log('\n=== Demo Credentials ===');
    console.log('User Login:');
    console.log('Phone: 9876543210');
    console.log('Password: demo123');
    console.log('\nCompanion Login:');
    console.log('Phone: 9876543211');
    console.log('Password: demo123');
    console.log('\nAdmin Login:');
    console.log('Phone: 9876543212');
    console.log('Password: demo123');
    console.log('========================\n');

    console.log('Seed data created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();