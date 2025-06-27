// const jwt = require('jsonwebtoken');
// const User = require('../models/User');

// const auth = async (req, res, next) => {
//   try {
//     const token = req.header('Authorization')?.replace('Bearer ', '');
    
//     if (!token) {
//       return res.status(401).json({ error: 'Access denied. No token provided.' });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const user = await User.findById(decoded.userId).select('-password');
    
//     if (!user) {
//       return res.status(401).json({ error: 'Invalid token. User not found.' });
//     }

//     if (!user.isActive) {
//       return res.status(401).json({ error: 'Account is deactivated.' });
//     }

//     req.user = user;
//     next();
//   } catch (error) {
//     console.error('Auth middleware error:', error);
//     res.status(401).json({ error: 'Invalid token.' });
//   }
// };

// Mock auth middleware for demo
const auth = async (req, res, next) => {
  try {
    // Mock user for demo
    req.user = {
      _id: 'mock-user-id',
      username: 'demo-user',
      email: 'demo@example.com',
      credits: 5,
      subscription: 'free',
      isActive: true
    };
    next();
  } catch (error) {
    console.error('Mock auth middleware error:', error);
    res.status(401).json({ error: 'Authentication failed.' });
  }
};

const optionalAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (token) {
      // const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // const user = await User.findById(decoded.userId).select('-password');
      
      // if (user && user.isActive) {
      //   req.user = user;
      // }
    }
    
    next();
  } catch (error) {
    // Continue without authentication for optional routes
    next();
  }
};

const requireCredits = (required = 1) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required.' });
    }

    if (!req.user.hasCredits(required)) {
      return res.status(402).json({ 
        error: 'Insufficient credits.',
        required,
        available: req.user.credits,
        message: 'Please purchase more credits to continue.'
      });
    }

    next();
  };
};

const requireSubscription = (minLevel = 'free') => {
  const levels = {
    'free': 0,
    'basic': 1,
    'premium': 2,
    'enterprise': 3
  };

  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required.' });
    }

    const userLevel = levels[req.user.subscription] || 0;
    const requiredLevel = levels[minLevel] || 0;

    if (userLevel < requiredLevel) {
      return res.status(403).json({ 
        error: 'Subscription level required.',
        required: minLevel,
        current: req.user.subscription,
        message: 'Please upgrade your subscription to access this feature.'
      });
    }

    if (!req.user.isSubscriptionActive) {
      return res.status(403).json({ 
        error: 'Subscription expired.',
        message: 'Please renew your subscription to continue.'
      });
    }

    next();
  };
};

module.exports = {
  auth,
  optionalAuth,
  requireCredits,
  requireSubscription
}; 