const mongoose = require("mongoose");

const evaluationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  result: { type: String, required: true },
  recommendation: { type: String, required: true },
  recommendedCourse: { type: String, required: true },
  percent: {
    BSIT: Number,
    BSCS: Number,
    BSIS: Number,
    teElectrical: Number,
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Evaluation", evaluationSchema);
