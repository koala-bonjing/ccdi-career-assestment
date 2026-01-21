const mongoose = require("mongoose");

const evaluationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    userEmail: {
      type: String,
      required: true,
    },

    // AI Generated Results
    evaluation: {
      type: String,
      required: true,
    },
    detailedEvaluation: {
      type: String,
      required: true,
    },
    recommendations: {
      type: String,
    },
    recommendedCourse: {
      type: String,
      required: true,
    },

    // Scores
    percent: {
      BSCS: { type: Number, default: 0 },
      BSIT: { type: Number, default: 0 },
      BSIS: { type: Number, default: 0 },
      "BSET Electronics Technology": { type: Number, default: 0 },
      "BSET Electrical Technology": { type: Number, default: 0 },
    },
    summary: {
      type: String,
      required: false,
    },

    // Category scores
    categoryScores: {
      academic: { type: Number, default: 0 },
      technical: { type: Number, default: 0 },
      career: { type: Number, default: 0 },
      logistics: { type: Number, default: 0 },
    },

    // Category explanations - FIXED: Only one definition
    categoryExplanations: {
      academicReason: { type: String, default: "" },
      technicalReason: { type: String, default: "" },
      careerReason: { type: String, default: "" },
      logisticsReason: { type: String, default: "" },
    },

    // ✅ Preparation recommendations - Updated to match route
    preparationNeeded: {
      type: [String],
      default: [],
    },

    // ✅ New fields for better analysis
    successRoadmap: {
      type: String,
      default: "",
    },

    examAnalysis: {
      type: String,
      default: "",
    },

    prerequisites: {
      type: String,
      default: "",
    },

    // ✅ Foundational assessment data
    foundationalScore: {
      type: Number,
      default: 0,
    },

    weaknesses: {
      type: [String],
      default: [],
    },

    answers: {
      type: Object,
      required: false,
    },

    submissionDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

// Add index for faster queries
evaluationSchema.index({ userId: 1, submissionDate: -1 });

const Evaluation = mongoose.model("Evaluation", evaluationSchema);

module.exports = Evaluation;
