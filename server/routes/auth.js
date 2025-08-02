const express = require('express');
const { body } = require('express-validator');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

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
  body('email').optional().isEmail().withMessage('Please enter a valid email')
], validate, async (req, res) => {
  try {
    const { name, phone, email, password, whatsapp } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this phone number already exists' });
    }

    // Create new user
    const user = new User({
      name,
      phone,
      email,
      password,
      whatsapp: whatsapp || phone
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      message: 'Registration successful',
      user: user.toJSON(),
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Error registering user' });
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

module.exports = router;