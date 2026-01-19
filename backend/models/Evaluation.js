const mongoose = require("mongoose");

const evaluationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userName: { type: String, required: true },
    userEmail: { type: String, required: true },
    evaluation: { type: String, required: true },
    recommendations: { type: String, required: true },
    detailedEvaluation: { type: String, required: true },
    recommendedCourse: {
      type: String,
      enum: [
        "BSCS",
        "BSIT",
        "BSIS",
        "BSET Electronics Technology",
        "BSET Electrical Technology",
        "Undecided",
      ],
      required: true,
    },
    percent: {
      BSIT: { type: Number, required: true, min: 0, max: 100 },
      BSCS: { type: Number, required: true, min: 0, max: 100 },
      BSIS: { type: Number, required: true, min: 0, max: 100 },
      "BSET Electronics Technology": {
        type: Number,
        required: true,
        min: 0,
        max: 100,
      },
      "BSET Electrical Technology": {
        type: Number,
        required: true,
        min: 0,
        max: 100,
      },
    },
    // programScores: {
    //   BSIT: Number,
    //   BSCS: Number,
    //   BSIS: Number,
    //   "BSET Electronics Technology": Number,
    //   "BSET Electrical Technology": Number,
    // },
    answers: { type: Object },
    submissionDate: { type: Date, default: Date.now },
    sessionId: String, // Link to assessment session if needed
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Evaluation", evaluationSchema);
