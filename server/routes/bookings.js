const express = require('express');
const { body, query } = require('express-validator');
const Booking = require('../models/Booking');
const { auth, adminAuth, companionAuth } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

// Create new booking
router.post('/create', auth, [
  body('patientName').trim().notEmpty().withMessage('Patient name is required'),
  body('patientAge').isInt({ min: 1, max: 120 }).withMessage('Please enter a valid age'),
  body('patientGender').isIn(['male', 'female', 'other']).withMessage('Please select a valid gender'),
  body('hospital').trim().notEmpty().withMessage('Hospital is required'),
  body('doctor').trim().notEmpty().withMessage('Doctor name is required'),
  body('appointmentDate').isISO8601().withMessage('Please enter a valid date'),
  body('appointmentTime').trim().notEmpty().withMessage('Appointment time is required'),
  body('pickupAddress').trim().notEmpty().withMessage('Pickup address is required'),
  body('totalAmount').isFloat({ min: 0 }).withMessage('Invalid amount')
], validate, async (req, res) => {
  try {
    const bookingData = {
      userId: req.userId,
      ...req.body
    };
    // Confirm booking immediately (no online payments for now)
    bookingData.status = 'confirmed';

    // Check for conflicting bookings
    const appointmentDate = new Date(req.body.appointmentDate);
    appointmentDate.setHours(0, 0, 0, 0);
    
    const existingBookings = await Booking.find({
      userId: req.userId,
      appointmentDate: {
        $gte: appointmentDate,
        $lt: new Date(appointmentDate.getTime() + 24 * 60 * 60 * 1000)
      },
      status: { $nin: ['cancelled', 'completed'] }
    });

    // Check if there's a conflict
    if (existingBookings.length > 0) {
      // Check if it's the same patient and same time
      const hasConflict = existingBookings.some(booking => 
        booking.patientName === req.body.patientName && 
        booking.appointmentTime === req.body.appointmentTime
      );

      if (hasConflict) {
        return res.status(400).json({ 
          message: 'You already have a booking for this patient at this time. Please choose a different time.' 
        });
      }

      // Check if bookings are at the same time (even for different patients)
      const hasTimeConflict = existingBookings.some(booking => 
        booking.appointmentTime === req.body.appointmentTime
      );

      if (hasTimeConflict) {
        return res.status(400).json({ 
          message: 'You already have another appointment at this time. Please choose a different time slot.' 
        });
      }
    }

    const booking = new Booking(bookingData);
    await booking.save();

    // Send booking details via email to the specified recipient
    try {
      const nodemailer = require('nodemailer');
      const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: Number(process.env.EMAIL_PORT || 587),
        secure: false,
        auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
      });

      const user = req.user || {};
      const toAddress = process.env.BOOKING_NOTIFY_TO || process.env.EMAIL_USER;
      const fromAddress = process.env.EMAIL_FROM || process.env.EMAIL_USER;

      const lines = [
        `Booking ID: ${booking.bookingId} (MongoID: ${booking._id})`,
        `Status: ${booking.status}`,
        `Created At: ${booking.createdAt}`,
        '',
        `User Name: ${user.name || ''}`,
        `User Phone: ${user.phone || ''}`,
        `User Email: ${user.email || ''}`,
        '',
        `Patient Name: ${req.body.patientName}`,
        `Patient Age: ${req.body.patientAge}`,
        `Patient Gender: ${req.body.patientGender}`,
        `Hospital: ${req.body.hospital}`,
        `Doctor: ${req.body.doctor}`,
        `Appointment Date: ${req.body.appointmentDate}`,
        `Appointment Time: ${req.body.appointmentTime}`,
        `Pickup Address: ${req.body.pickupAddress}`,
        req.body.package ? `Package: ${req.body.package}` : '',
        req.body.preferences ? `Preferences: ${JSON.stringify(req.body.preferences)}` : '',
        `Total Amount: ${req.body.totalAmount}`
      ].filter(Boolean);

      const html = `
        <h2>New Booking Confirmation</h2>
        <p><strong>Booking ID:</strong> ${booking.bookingId}</p>
        <p><strong>Status:</strong> ${booking.status}</p>
        <p><strong>Created At:</strong> ${new Date(booking.createdAt).toLocaleString()}</p>
        <hr />
        <p><strong>User Name:</strong> ${user.name || ''}</p>
        <p><strong>User Phone:</strong> ${user.phone || ''}</p>
        <p><strong>User Email:</strong> ${user.email || ''}</p>
        <hr />
        <p><strong>Patient Name:</strong> ${req.body.patientName}</p>
        <p><strong>Patient Age:</strong> ${req.body.patientAge}</p>
        <p><strong>Patient Gender:</strong> ${req.body.patientGender}</p>
        <p><strong>Hospital:</strong> ${req.body.hospital}</p>
        <p><strong>Doctor:</strong> ${req.body.doctor}</p>
        <p><strong>Appointment Date:</strong> ${req.body.appointmentDate}</p>
        <p><strong>Appointment Time:</strong> ${req.body.appointmentTime}</p>
        <p><strong>Pickup Address:</strong> ${req.body.pickupAddress}</p>
        ${req.body.package ? `<p><strong>Package:</strong> ${req.body.package}</p>` : ''}
        ${req.body.preferences ? `<p><strong>Preferences:</strong> ${JSON.stringify(req.body.preferences)}</p>` : ''}
        <p><strong>Total Amount:</strong> ${req.body.totalAmount}</p>
      `;

      await transporter.sendMail({
        from: fromAddress,
        to: toAddress,
        subject: `New Booking Confirmation - ${booking.bookingId}`,
        text: lines.join('\n'),
        html
      });
    } catch (mailErr) {
      console.error('Booking email send error:', mailErr);
      // Do not fail the booking if email fails
    }

    res.status(201).json({
      message: 'Booking created successfully',
      booking
    });
  } catch (error) {
    console.error('Booking creation error:', error);
    res.status(500).json({ message: 'Error creating booking' });
  }
});

// Get user's bookings
router.get('/user/:userId', auth, async (req, res) => {
  try {
    // Ensure user can only access their own bookings unless admin
    if (req.userId.toString() !== req.params.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { status, page = 1, limit = 10 } = req.query;
    const query = { userId: req.params.userId };
    
    if (status) {
      query.status = status;
    }

    const bookings = await Booking.find(query)
      .sort({ appointmentDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Booking.countDocuments(query);

    res.json({
      bookings,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ message: 'Error fetching bookings' });
  }
});

// Get single booking
router.get('/:bookingId', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId)
      .populate('userId', 'name phone email')
      .populate('companion.id', 'name phone');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check authorization
    if (booking.userId._id.toString() !== req.userId.toString() && 
        req.user.role !== 'admin' && 
        req.user.role !== 'companion') {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({ booking });
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({ message: 'Error fetching booking' });
  }
});

// Update booking status (admin/companion only)
router.put('/:bookingId/status', companionAuth, [
  body('status').isIn(['confirmed', 'assigned', 'in-progress', 'completed', 'cancelled'])
    .withMessage('Invalid status')
], validate, async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.bookingId);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.status = status;
    
    if (status === 'cancelled') {
      booking.cancelledAt = new Date();
      booking.cancelledBy = req.userId;
    }

    await booking.save();

    res.json({
      message: 'Booking status updated successfully',
      booking
    });
  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({ message: 'Error updating booking status' });
  }
});

// Reschedule booking
router.put('/:bookingId/reschedule', auth, [
  body('appointmentDate').isISO8601().withMessage('Valid date required'),
  body('appointmentTime').notEmpty().withMessage('Appointment time required'),
  body('rescheduleReason').notEmpty().withMessage('Reason required')
], validate, async (req, res) => {
  try {
    const { appointmentDate, appointmentTime, rescheduleReason } = req.body;
    const booking = await Booking.findById(req.params.bookingId);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Verify the booking belongs to the user
    if (booking.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized to reschedule this booking' });
    }

    // Check if booking can be rescheduled
    if (['cancelled', 'completed'].includes(booking.status)) {
      return res.status(400).json({ 
        message: `Cannot reschedule ${booking.status} booking` 
      });
    }

    // Check if rescheduling at least 24 hours before current appointment
    const currentAppointmentTime = new Date(booking.appointmentDate);
    const hoursUntilAppointment = (currentAppointmentTime - new Date()) / (1000 * 60 * 60);
    
    if (hoursUntilAppointment < 24) {
      return res.status(400).json({ 
        message: 'Cannot reschedule within 24 hours of appointment' 
      });
    }

    // Store previous appointment details in history
    if (!booking.history) {
      booking.history = [];
    }
    
    booking.history.push({
      action: 'rescheduled',
      previousDate: booking.appointmentDate,
      previousTime: booking.appointmentTime,
      newDate: appointmentDate,
      newTime: appointmentTime,
      reason: rescheduleReason,
      changedBy: req.userId,
      changedAt: new Date()
    });

    // Update appointment details
    booking.appointmentDate = appointmentDate;
    booking.appointmentTime = appointmentTime;
    booking.status = 'pending'; // Reset to pending for confirmation

    await booking.save();

    res.json({
      message: 'Booking rescheduled successfully',
      booking
    });
  } catch (error) {
    console.error('Reschedule booking error:', error);
    res.status(500).json({ message: 'Error rescheduling booking' });
  }
});

// Cancel booking
router.put('/:bookingId/cancel', auth, [
  body('reason').optional().trim()
], validate, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check authorization
    if (booking.userId.toString() !== req.userId.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Check if booking can be cancelled
    if (!booking.canBeCancelled()) {
      return res.status(400).json({ 
        message: 'Booking cannot be cancelled. It may be too close to the appointment time or already completed/cancelled.' 
      });
    }

    booking.status = 'cancelled';
    booking.cancellationReason = req.body.reason || 'Cancelled by user';
    booking.cancelledAt = new Date();
    booking.cancelledBy = req.userId;

    await booking.save();

    res.json({
      message: 'Booking cancelled successfully',
      booking
    });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({ message: 'Error cancelling booking' });
  }
});

// Assign companion to booking (admin only)
router.put('/:bookingId/assign-companion', adminAuth, [
  body('companionId').notEmpty().withMessage('Companion ID is required'),
  body('companionName').trim().notEmpty().withMessage('Companion name is required'),
  body('companionPhone').trim().notEmpty().withMessage('Companion phone is required')
], validate, async (req, res) => {
  try {
    const { companionId, companionName, companionPhone } = req.body;
    
    const booking = await Booking.findById(req.params.bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.companion = {
      id: companionId,
      name: companionName,
      phone: companionPhone,
      assignedAt: new Date()
    };
    booking.status = 'assigned';

    await booking.save();

    res.json({
      message: 'Companion assigned successfully',
      booking
    });
  } catch (error) {
    console.error('Assign companion error:', error);
    res.status(500).json({ message: 'Error assigning companion' });
  }
});

// Add visit summary (companion only)
router.put('/:bookingId/visit-summary', companionAuth, [
  body('notes').trim().notEmpty().withMessage('Visit notes are required'),
  body('prescriptions').optional().isArray(),
  body('tests').optional().isArray(),
  body('nextAppointment').optional().isISO8601()
], validate, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if companion is assigned to this booking
    if (booking.companion.id.toString() !== req.userId.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    booking.visitSummary = {
      ...req.body,
      uploadedAt: new Date()
    };
    booking.status = 'completed';

    await booking.save();

    res.json({
      message: 'Visit summary added successfully',
      booking
    });
  } catch (error) {
    console.error('Add visit summary error:', error);
    res.status(500).json({ message: 'Error adding visit summary' });
  }
});

// Add rating (user only)
router.post('/:bookingId/rating', auth, [
  body('score').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('feedback').optional().trim()
], validate, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check authorization
    if (booking.userId.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Check if booking is completed
    if (booking.status !== 'completed') {
      return res.status(400).json({ message: 'Can only rate completed bookings' });
    }

    booking.rating = {
      score: req.body.score,
      feedback: req.body.feedback,
      ratedAt: new Date()
    };

    await booking.save();

    res.json({
      message: 'Rating added successfully',
      booking
    });
  } catch (error) {
    console.error('Add rating error:', error);
    res.status(500).json({ message: 'Error adding rating' });
  }
});

// Get upcoming bookings (admin/companion)
router.get('/upcoming/all', companionAuth, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const query = {
      appointmentDate: { $gte: new Date() },
      status: { $in: ['pending', 'confirmed', 'assigned'] }
    };

    // If companion, only show their assigned bookings
    if (req.user.role === 'companion') {
      query['companion.id'] = req.userId;
    }

    const bookings = await Booking.find(query)
      .populate('userId', 'name phone')
      .sort({ appointmentDate: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Booking.countDocuments(query);

    res.json({
      bookings,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get upcoming bookings error:', error);
    res.status(500).json({ message: 'Error fetching upcoming bookings' });
  }
});

module.exports = router;