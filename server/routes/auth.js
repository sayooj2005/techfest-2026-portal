const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// Helper to generate JWT and set secure cookie
const sendTokenResponse = (user, statusCode, res) => {
  const token = jwt.sign(
    { id: user._id, role: user.role, email: user.email, name: user.name },
    process.env.JWT_SECRET || 'supersecrettechfestkey2026!@#$%^&*',
    { expiresIn: '7d' }
  );

  const isProduction = process.env.NODE_ENV === 'production';

  // Secure cookie options mitigating XSS and CSRF
  const cookieOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    httpOnly: true, // Prevents client-side scripts from reading the cookie (Mitigates XSS)
    secure: isProduction, // Transmitted only over HTTPS in production
    sameSite: isProduction ? 'none' : 'lax' // Mitigates CSRF attacks
  };

  res
    .status(statusCode)
    .cookie('token', token, cookieOptions)
    .json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
};

// @route   POST /api/auth/register
// @desc    Register a student/participant with input validation & sanitization
router.post(
  '/register',
  [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Name is required')
      .escape(), // Prevent stored XSS
    body('email')
      .isEmail()
      .withMessage('Please provide a valid email')
      .normalizeEmail(),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      const { name, email, password, role } = req.body;

      // Check if user exists
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({
          success: false,
          error: 'An account with this email already exists'
        });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      user = await User.create({
        name,
        email,
        password: hashedPassword,
        role: role || 'student'
      });

      sendTokenResponse(user, 201, res);
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
);

// @route   POST /api/auth/login
// @desc    Authenticate user & return JWT in secure cookie
router.post(
  '/login',
  [
    body('email').notEmpty().withMessage('Email or username is required'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      const { email, password } = req.body;

      // Notice: If mongoSanitize is active, { "$ne": null } is stripped of $ operators.
      // Furthermore, we explicitly enforce type checking for injection prevention.
      if (typeof email !== 'string' || typeof password !== 'string') {
        return res.status(400).json({
          success: false,
          error: 'Invalid input types detected. Injection payload rejected.'
        });
      }

      const user = await User.findOne({ email }).select('+password');
      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'Invalid credentials'
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          error: 'Invalid credentials'
        });
      }

      sendTokenResponse(user, 200, res);
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
);

// @route   GET /api/auth/me
// @desc    Get currently logged in user info
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// @route   POST /api/auth/logout
// @desc    Clear auth cookie
router.post('/logout', (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 5 * 1000),
    httpOnly: true
  });
  res.json({ success: true, message: 'Logged out successfully' });
});

module.exports = router;
