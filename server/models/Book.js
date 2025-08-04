const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  author: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  language: {
    type: String,
    required: true,
    trim: true
  },
  level: {
    type: String,
    required: true,
    enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert']
  },
  style: {
    type: String,
    required: true,
    trim: true
  },
  goals: {
    type: String,
    required: true,
    trim: true
  },
  topics: [{
    type: String,
    trim: true
  }],
  examplesPerTopic: {
    type: Number,
    default: 3,
    min: 1,
    max: 10
  },
  numberOfPages: {
    type: Number,
    default: 50,
    min: 10,
    max: 500
  },
  includeTableOfContents: {
    type: Boolean,
    default: true
  },
  includeExercises: {
    type: Boolean,
    default: true
  },
  codeExplanation: {
    type: Boolean,
    default: true
  },
  tone: {
    type: String,
    default: 'Friendly',
    enum: ['Friendly', 'Professional', 'Academic', 'Casual', 'Formal']
  },
  format: {
    type: String,
    default: 'PDF',
    enum: ['PDF', 'DOCX']
  },
  content: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['generating', 'completed', 'failed'],
    default: 'generating'
  },
  generationStartTime: {
    type: Date,
    default: Date.now
  },
  generationEndTime: {
    type: Date
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

// Indexes for better query performance
bookSchema.index({ userId: 1, createdAt: -1 });
bookSchema.index({ status: 1 });
bookSchema.index({ title: 'text', author: 'text' });

// Virtual for generation duration
bookSchema.virtual('generationDuration').get(function() {
  if (this.generationStartTime && this.generationEndTime) {
    return this.generationEndTime - this.generationStartTime;
  }
  return null;
});

// Method to mark book as completed
bookSchema.methods.markCompleted = function() {
  this.status = 'completed';
  this.generationEndTime = new Date();
  return this.save();
};

// Method to mark book as failed
bookSchema.methods.markFailed = function() {
  this.status = 'failed';
  this.generationEndTime = new Date();
  return this.save();
};

module.exports = mongoose.model('Book', bookSchema); 