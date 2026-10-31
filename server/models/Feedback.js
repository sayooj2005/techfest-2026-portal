const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
  author: {
    type: String,
    required: [true, 'Author name is required'],
    trim: true,
    maxlength: 60
  },
  event: {
    type: String,
    default: 'General'
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: 5
  },
  comment: {
    type: String,
    required: [true, 'Feedback comment cannot be empty'],
    maxlength: 1000
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Feedback', FeedbackSchema);
