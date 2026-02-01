// models/Question.js
const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    questionText: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: [
        "academicAptitude",
        "technicalSkills",
        "careerInterest",
        "learningStyle",
        "learningWorkStyle", 
      ],
      required: true,
    },
    // NEW FIELD: For LearningStyleSection grouping
    subCategory: {
      type: String,
      enum: [
        "Learning Preferences",
        "Work Style Preferences", 
        "Financial & Time Resources",
        "Career Goals & Logistics",
        null, // For questions that don't need sub-category
      ],
      default: null,
    },
    program: {
      type: String,
      enum: [
        "BSCS",
        "BSIT",
        "BSIS",
        "BSET Electronics Technology",
        "BSET Electrical Technology",
      ],
      required: true,
    },
    weight: {
      type: Number,
      default: 1,
      min: 1,
      max: 5,
    },
    options: {
      type: [String],
      default: [
        "Strongly Disagree",
        "Disagree",
        "Neutral",
        "Agree",
        "Strongly Agree",
      ],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Question", questionSchema);