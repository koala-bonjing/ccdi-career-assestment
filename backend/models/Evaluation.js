// Optional Schema Update - Only add if you want to store preparation recommendations

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

    categoryScores: {
      academic: { type: Number, default: 0 },
      technical: { type: Number, default: 0 },
      career: { type: Number, default: 0 },
      logistics: { type: Number, default: 0 },
    },

    categoryExplanations: {
      academicReason: String,
      technicalReason: String,
      careerReason: String,
      logisticsReason: String,
    },

    // ✅ OPTIONAL NEW FIELD: Only add if you want to store preparation recommendations
    preparationNeeded: {
      mathReview: { type: Boolean, default: false },
      readingSupport: { type: Boolean, default: false },
      timeManagement: { type: Boolean, default: false },
      estimatedPrepTime: { type: String, default: "ready now" },
    },

    submissionDate: {
      type: Date,
      default: Date.now,
    },

    // Optional: Store raw answers
    rawAnswers: {
      type: mongoose.Schema.Types.Mixed,
      required: false,
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
