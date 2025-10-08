// models/AssessmentSession.js
const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: true
  },
  answer: {
    type: mongoose.Schema.Types.Mixed, // Can be number, string, or boolean
    required: true
  },
  score: {
    type: Number,
    default: 0
  }
});

const assessmentSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  answers: [answerSchema],
  programScores: {
    BSCS: { type: Number, default: 0 },
    BSIT: { type: Number, default: 0 },
    BSIS: { type: Number, default: 0 },
    EE: { type: Number, default: 0 }
  },
  currentSection: {
    type: String,
    enum: ['academicAptitude', 'technicalSkills', 'careerInterest', 'learningStyle'],
    default: 'academicAptitude'
  },
  currentQuestionIndex: {
    type: Number,
    default: 0
  },
  completed: {
    type: Boolean,
    default: false
  },
  results: {
    recommendedProgram: String,
    compatibilityPercentages: {
      BSCS: Number,
      BSIT: Number,
      BSIS: Number,
      EE: Number
    },
    evaluation: String,
    recommendations: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('AssessmentSession', assessmentSessionSchema);