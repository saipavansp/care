const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      throw new Error();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_here_change_in_production');
    const user = await User.findOne({ _id: decoded.userId, isActive: true }).select('-password');
    
    if (!user) {
      throw new Error();
    }

    req.token = token;
    req.user = user;
    req.userId = user._id;
    
    next();
  } catch (error) {
    res.status(401).json({ message: 'Please authenticate' });
  }
};

const adminAuth = async (req, res, next) => {
  try {
    await auth(req, res, () => {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Admin only.' });
      }
      next();
    });
  } catch (error) {
    res.status(401).json({ message: 'Please authenticate' });
  }
};

const companionAuth = async (req, res, next) => {
  try {
    await auth(req, res, () => {
      if (req.user.role !== 'companion' && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Companion or admin only.' });
      }
      next();
    });
  } catch (error) {
    res.status(401).json({ message: 'Please authenticate' });
  }
};

module.exports = { auth, adminAuth, companionAuth };