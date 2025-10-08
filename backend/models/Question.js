// models/Question.js
const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['academicAptitude', 'technicalSkills', 'careerInterest', 'learningStyle'],
    required: true
  },
  program: {
    type: String,
    enum: ['BSCS', 'BSIT', 'BSIS', 'EE'],
    required: true
  },
  weight: {
    type: Number,
    default: 1,
    min: 1,
    max: 5
  },
  options: {
    type: [String],
    default: [
      'Strongly Disagree',
      'Disagree', 
      'Neutral',
      'Agree',
      'Strongly Agree'
    ]
  },
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Question', questionSchema);