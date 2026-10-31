const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Feedback = require('../models/Feedback');

// @route   GET /api/feedback
// @desc    Get all feedback entries
router.get('/', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const feedbacks = await Feedback.find().sort({ createdAt: -1 }).limit(20);
      return res.json({ success: true, count: feedbacks.length, data: feedbacks });
    }
    return res.json({
      success: true,
      count: 2,
      data: [
        {
          _id: 'demo-1',
          author: 'Rohit Sharma',
          event: 'HackTech 2026',
          rating: 5,
          comment: 'Incredible experience! The security and speed were noticeable.',
          createdAt: new Date().toISOString()
        },
        {
          _id: 'demo-2',
          author: 'Ananya Verma',
          event: 'CyberShield CTF',
          rating: 5,
          comment: 'Great challenges and safe portal setup!',
          createdAt: new Date().toISOString()
        }
      ]
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// @route   POST /api/feedback
// @desc    Submit feedback with input validation & XSS sanitization
router.post(
  '/',
  [
    body('author')
      .trim()
      .notEmpty()
      .withMessage('Author name is required')
      .isLength({ max: 60 })
      .escape(), // Escapes <, >, &, ', "
    body('event')
      .trim()
      .notEmpty()
      .withMessage('Event name is required')
      .escape(),
    body('rating')
      .optional()
      .isInt({ min: 1, max: 5 })
      .withMessage('Rating must be between 1 and 5'),
    body('comment')
      .trim()
      .notEmpty()
      .withMessage('Comment is required')
      .isLength({ max: 1000 })
      .escape() // Neutralizes script injection tags such as <script>alert('hi')</script>
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      const { author, event, rating, comment } = req.body;
      let feedback;
      if (mongoose.connection.readyState === 1) {
        feedback = await Feedback.create({
          author,
          event: event || 'TechFest 2026',
          rating: rating || 5,
          comment
        });
      } else {
        feedback = {
          _id: 'mock-id-' + Date.now(),
          author,
          event: event || 'TechFest 2026',
          rating: rating || 5,
          comment,
          createdAt: new Date()
        };
      }

      res.status(201).json({ success: true, data: feedback });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
);

module.exports = router;
