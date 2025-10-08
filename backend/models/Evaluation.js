const mongoose = require("mongoose");

const evaluationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  userName: { type: String, required: true },
  userEmail: { type: String, required: true },
  evaluation: { type: String, required: true },
  recommendations: { type: String, required: true },
  recommendedCourse: { type: String, required: true },
  percent: {
    BSIT: { type: Number, required: true },
    BSCS: { type: Number, required: true },
    BSIS: { type: Number, required: true },
    EE: { type: Number, required: true }
  },
  programScores: {
    BSCS: Number,
    BSIT: Number,
    BSIS: Number,
    EE: Number
  },
  submissionDate: { type: Date, default: Date.now },
  sessionId: String // Link to assessment session if needed
});

module.exports = mongoose.model("Evaluation", evaluationSchema);