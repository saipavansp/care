const express = require('express');
const { body } = require('express-validator');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const validate = require('../middleware/validate');
const Otp = require('../models/Otp');
const bcrypt = require('bcryptjs');
const smsProvider = require('../utils/smsProvider');
const nodemailer = require('nodemailer');
const sheets = require('../utils/sheets');

const router = express.Router();

// Route-level CORS headers for auth endpoints (helps ensure preflight succeeds)
router.use((req, res, next) => {
  const origin = req.headers.origin;
  const allowedOrigins = [
    'https://www.kinpin.in',
    'https://kinpin.in',
    'https://carecap.vercel.app',
    'http://localhost:3000',
    process.env.CLIENT_URL
  ].filter(Boolean);

  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  // ensure caches/proxies vary by Origin
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { userId }, 
    process.env.JWT_SECRET || 'your_jwt_secret_here_change_in_production',
    { expiresIn: '30d' }
  );
};

// Register
router.post('/register', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('phone').trim().notEmpty().withMessage('Phone is required')
    .matches(/^[6-9]\d{9}$/).withMessage('Please enter a valid Indian phone number'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('preVerifiedToken').notEmpty().withMessage('Email verification is required')
], validate, async (req, res) => {
  try {
    const { name, phone, email, password, whatsapp, preVerifiedToken } = req.body;

    // Verify the preVerifiedToken matches email and purpose
    try {
      const tokenPayload = jwt.verify(preVerifiedToken, process.env.JWT_SECRET || 'temp_secret');
      if (tokenPayload.type !== 'preverified_register' || tokenPayload.email?.toLowerCase() !== (email || '').toLowerCase()) {
        return res.status(400).json({ message: 'Invalid email verification token' });
      }
    } catch (e) {
      return res.status(400).json({ message: 'Invalid or expired email verification token' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this phone number already exists' });
    }

    // Create new user (unverified phone)
    const user = new User({
      name,
      phone,
      email,
      password,
      whatsapp: whatsapp || phone,
      phoneVerified: false
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    // Fire-and-forget: append to Google Sheets if enabled
    try { sheets.appendUserRow(user); } catch {}

    // Fire-and-forget: send ops email (no password)
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT || 587),
        secure: false,
        auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
      });
      const toOps = process.env.BOOKING_NOTIFY_TO || process.env.EMAIL_USER;
      const from = process.env.EMAIL_FROM || process.env.EMAIL_USER;
      const text = `New user registered\nName: ${name}\nPhone: ${phone}\nEmail: ${email}`;
      await transporter.sendMail({ from, to: toOps, subject: 'New User Registration', text });
    } catch (e) {
      console.error('Registration ops email error:', e.message || e);
    }

    res.status(201).json({
      message: 'Registration successful. Please verify your phone number via OTP to login.',
      user: user.toJSON(),
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Error registering user' });
  }
});

// Send email OTP for registration
router.post('/email/send', [
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('purpose').optional().isIn(['register']).withMessage('Invalid purpose')
], validate, async (req, res) => {
  try {
    const { email } = req.body;

    // Generate OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const codeHash = await bcrypt.hash(code, 10);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await Otp.create({
      subject: (email || '').toLowerCase(),
      purpose: 'register',
      channel: 'email',
      codeHash,
      expiresAt,
    });

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT || 587),
      secure: false,
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
    });

    await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: email,
      subject: 'Your KinPin Registration OTP',
      text: `Your OTP is ${code}. It is valid for 5 minutes.`
    });

    res.json({ message: 'OTP sent to email' });
  } catch (error) {
    console.error('Send email OTP error:', error);
    res.status(500).json({ message: 'Failed to send email OTP' });
  }
});

// Verify email OTP for registration
router.post('/email/verify', [
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('code').trim().isLength({ min: 6, max: 6 }).withMessage('Invalid code'),
  body('purpose').optional().isIn(['register']).withMessage('Invalid purpose')
], validate, async (req, res) => {
  try {
    const email = (req.body.email || '').toLowerCase();
    const { code } = req.body;

    const otp = await Otp.findOne({ subject: email, purpose: 'register', channel: 'email', consumed: false }).sort({ createdAt: -1 });
    if (!otp) return res.status(400).json({ message: 'No OTP found. Please request a new one.' });
    if (otp.expiresAt < new Date()) return res.status(400).json({ message: 'OTP expired. Please request a new one.' });
    if (otp.attempts >= otp.maxAttempts) return res.status(429).json({ message: 'Too many attempts. Please request a new OTP.' });

    const isValid = await bcrypt.compare(code, otp.codeHash);
    otp.attempts += 1;
    if (!isValid) {
      await otp.save();
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    otp.consumed = true;
    await otp.save();

    // Issue short-lived pre-verified token for registration
    const preVerifiedToken = jwt.sign({ email, type: 'preverified_register' }, process.env.JWT_SECRET || 'temp_secret', { expiresIn: '15m' });
    res.json({ message: 'Email verified', preVerifiedToken });
  } catch (error) {
    console.error('Verify email OTP error:', error);
    res.status(500).json({ message: 'Failed to verify email OTP' });
  }
});

// Send OTP (register or password_reset) via SMS
router.post('/otp/send', [
  body('phone').trim().notEmpty().withMessage('Phone is required')
    .matches(/^[6-9]\d{9}$/).withMessage('Please enter a valid Indian phone number'),
  body('purpose').isIn(['register', 'password_reset']).withMessage('Invalid purpose')
], validate, async (req, res) => {
  try {
    const { phone, purpose } = req.body;

    // For register: ensure no verified account already exists for phone
    if (purpose === 'register') {
      const existing = await User.findOne({ phone });
      if (existing && existing.phoneVerified) {
        return res.status(400).json({ message: 'This phone is already verified with an account' });
      }
    }

    // Generate 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const codeHash = await bcrypt.hash(code, 10);

    // Expire in 5 minutes
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    // Create OTP record
    await Otp.create({
      subject: phone,
      purpose,
      channel: 'sms',
      codeHash,
      expiresAt,
    });

    // Send via MSG91
    const message = `Your Care Companion OTP is ${code}. It is valid for 5 minutes.`;
    await smsProvider.sendSms(phone, message);

    res.json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({ message: 'Failed to send OTP' });
  }
});

// Verify OTP
router.post('/otp/verify', [
  body('phone').trim().notEmpty().withMessage('Phone is required')
    .matches(/^[6-9]\d{9}$/).withMessage('Please enter a valid Indian phone number'),
  body('purpose').isIn(['register', 'password_reset']).withMessage('Invalid purpose'),
  body('code').trim().isLength({ min: 6, max: 6 }).withMessage('Invalid code')
], validate, async (req, res) => {
  try {
    const { phone, purpose, code } = req.body;

    const otp = await Otp.findOne({ subject: phone, purpose, channel: 'sms', consumed: false }).sort({ createdAt: -1 });
    if (!otp) {
      return res.status(400).json({ message: 'No OTP found. Please request a new one.' });
    }
    if (otp.expiresAt < new Date()) {
      return res.status(400).json({ message: 'OTP expired. Please request a new one.' });
    }
    if (otp.attempts >= otp.maxAttempts) {
      return res.status(429).json({ message: 'Too many attempts. Please request a new OTP.' });
    }

    const isValid = await bcrypt.compare(code, otp.codeHash);
    otp.attempts += 1;
    if (!isValid) {
      await otp.save();
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // Consume OTP
    otp.consumed = true;
    await otp.save();

    if (purpose === 'register') {
      // Mark user phone verified if user exists
      const user = await User.findOne({ phone });
      if (user) {
        user.phoneVerified = true;
        await user.save();
      }
      return res.json({ message: 'Phone verified successfully' });
    }

    if (purpose === 'password_reset') {
      // Issue short-lived reset token
      const resetToken = jwt.sign({ phone, type: 'password_reset' }, process.env.JWT_SECRET || 'temp_secret', { expiresIn: '15m' });
      return res.json({ message: 'OTP verified', resetToken });
    }

    res.json({ message: 'Verified' });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ message: 'Failed to verify OTP' });
  }
});
// Login
router.post('/login', [
  body('phone').trim().notEmpty().withMessage('Phone is required'),
  body('password').notEmpty().withMessage('Password is required')
], validate, async (req, res) => {
  try {
    const { phone, password } = req.body;

    // Find user
    const user = await User.findOne({ phone, isActive: true, role: 'user' });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    // Allow login regardless of phone verification status

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.json({
      message: 'Login successful',
      user: user.toJSON(),
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error logging in' });
  }
});

// Companion Login
router.post('/companion/login', [
  body('phone').trim().notEmpty().withMessage('Phone is required'),
  body('password').notEmpty().withMessage('Password is required')
], validate, async (req, res) => {
  try {
    const { phone, password } = req.body;

    // Find companion
    const user = await User.findOne({ phone, isActive: true, role: 'companion' });
    if (!user) {
      return res.status(401).json({ message: 'Invalid companion credentials' });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.json({
      message: 'Companion login successful',
      user: user.toJSON(),
      token
    });
  } catch (error) {
    console.error('Companion login error:', error);
    res.status(500).json({ message: 'Error logging in' });
  }
});

// Verify token
router.get('/verify-token', auth, async (req, res) => {
  res.json({
    valid: true,
    user: req.user
  });
});

// Get current user
router.get('/me', auth, async (req, res) => {
  res.json({ user: req.user });
});

// Update profile
router.put('/profile', auth, [
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  body('email').optional().isEmail().withMessage('Please enter a valid email'),
  body('whatsapp').optional().matches(/^[6-9]\d{9}$/).withMessage('Please enter a valid phone number')
], validate, async (req, res) => {
  try {
    const updates = {};
    const allowedUpdates = ['name', 'email', 'whatsapp'];
    
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.userId,
      updates,
      { new: true, runValidators: true }
    );

    res.json({
      message: 'Profile updated successfully',
      user: user.toJSON()
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Error updating profile' });
  }
});

// Add family member
router.post('/family-members', auth, [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('relation').trim().notEmpty().withMessage('Relation is required'),
  body('phone').trim().notEmpty().withMessage('Phone is required')
    .matches(/^[6-9]\d{9}$/).withMessage('Please enter a valid phone number')
], validate, async (req, res) => {
  try {
    const { name, relation, phone } = req.body;

    const user = await User.findById(req.userId);
    user.familyMembers.push({ name, relation, phone });
    await user.save();

    res.json({
      message: 'Family member added successfully',
      familyMembers: user.familyMembers
    });
  } catch (error) {
    console.error('Add family member error:', error);
    res.status(500).json({ message: 'Error adding family member' });
  }
});

// Delete family member
router.delete('/family-members/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    user.familyMembers = user.familyMembers.filter(
      member => member._id.toString() !== req.params.id
    );
    await user.save();

    res.json({
      message: 'Family member removed successfully',
      familyMembers: user.familyMembers
    });
  } catch (error) {
    console.error('Delete family member error:', error);
    res.status(500).json({ message: 'Error removing family member' });
  }
});

// Change password
router.put('/change-password', auth, [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
], validate, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.userId);
    
    // Verify current password
    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Error changing password' });
  }
});

// Forgot password - request OTP via chosen channel
router.post('/password/forgot', [
  body('phone').optional().trim().matches(/^[6-9]\d{9}$/).withMessage('Please enter a valid Indian phone number'),
  body('channel').optional().isIn(['sms', 'email']).withMessage('Invalid channel'),
  body('email').optional().isEmail().withMessage('Please enter a valid email')
], validate, async (req, res) => {
  try {
    const { phone, channel, email } = req.body;
    const chosen = channel || 'email';

    let user;
    if (chosen === 'email') {
      const provided = (email || '').trim().toLowerCase();
      if (!provided) {
        return res.status(400).json({ message: 'Email is required' });
      }
      user = await User.findOne({ email: provided });
      if (!user) {
        return res.status(404).json({ message: 'No account found for this email' });
      }
    } else {
      if (!phone) {
        return res.status(400).json({ message: 'Phone is required' });
      }
      user = await User.findOne({ phone });
      if (!user) {
        return res.status(404).json({ message: 'No account found for this phone' });
      }
    }

    // Generate OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const codeHash = await bcrypt.hash(code, 10);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await Otp.create({
      subject: chosen === 'sms' ? phone : (user.email || ''),
      purpose: 'password_reset',
      channel: chosen,
      codeHash,
      expiresAt,
    });

    if (chosen === 'sms') {
      await smsProvider.sendSms(phone, `Your password reset OTP is ${code}. Valid for 5 minutes.`);
    } else {
      // send via email using nodemailer
      const nodemailer = require('nodemailer');
      const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT || 587),
        secure: false,
        auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
      });
      await transporter.sendMail({
        from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
        to: user.email,
        subject: 'Password Reset OTP',
        text: `Your password reset OTP is ${code}. It is valid for 5 minutes.`,
      });
    }

    res.json({ message: 'OTP sent for password reset' });
  } catch (error) {
    console.error('Forgot password send OTP error:', error);
    res.status(500).json({ message: 'Failed to send password reset OTP' });
  }
});

// Verify password reset OTP and issue reset token
router.post('/password/verify', [
  body('phone').optional().trim().matches(/^[6-9]\d{9}$/).withMessage('Please enter a valid Indian phone number'),
  body('email').optional().isEmail().withMessage('Please enter a valid email'),
  body('channel').isIn(['sms', 'email']).withMessage('Invalid channel'),
  body('code').trim().isLength({ min: 6, max: 6 }).withMessage('Invalid code')
], validate, async (req, res) => {
  try {
    const { phone, email, channel, code } = req.body;
    let user;
    if (channel === 'email') {
      const provided = (email || '').trim().toLowerCase();
      if (!provided) return res.status(400).json({ message: 'Email is required' });
      user = await User.findOne({ email: provided });
      if (!user) return res.status(404).json({ message: 'No account found for this email' });
    } else {
      if (!phone) return res.status(400).json({ message: 'Phone is required' });
      user = await User.findOne({ phone });
      if (!user) return res.status(404).json({ message: 'No account found for this phone' });
    }

    const subject = channel === 'sms' ? phone : (user.email || '');
    if (!subject) {
      return res.status(400).json({ message: 'Email not available for this account' });
    }

    const otp = await Otp.findOne({ subject, purpose: 'password_reset', channel, consumed: false }).sort({ createdAt: -1 });
    if (!otp) return res.status(400).json({ message: 'No OTP found. Please request a new one.' });
    if (otp.expiresAt < new Date()) return res.status(400).json({ message: 'OTP expired. Please request a new one.' });
    if (otp.attempts >= otp.maxAttempts) return res.status(429).json({ message: 'Too many attempts. Please request a new OTP.' });

    const isValid = await bcrypt.compare(code, otp.codeHash);
    otp.attempts += 1;
    if (!isValid) {
      await otp.save();
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    otp.consumed = true;
    await otp.save();

    const resetToken = jwt.sign({ userId: user._id, type: 'password_reset' }, process.env.JWT_SECRET || 'temp_secret', { expiresIn: '15m' });
    res.json({ message: 'OTP verified', resetToken });
  } catch (error) {
    console.error('Verify password OTP error:', error);
    res.status(500).json({ message: 'Failed to verify password reset OTP' });
  }
});

// Reset password using resetToken
router.post('/password/reset', [
  body('resetToken').notEmpty().withMessage('Reset token is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
], validate, async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;
    let payload;
    try {
      payload = jwt.verify(resetToken, process.env.JWT_SECRET || 'temp_secret');
    } catch (e) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }
    if (payload.type !== 'password_reset') {
      return res.status(400).json({ message: 'Invalid token type' });
    }

    const user = await User.findById(payload.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.password = newPassword;
    await user.save();
    res.json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ message: 'Failed to reset password' });
  }
});

module.exports = router;