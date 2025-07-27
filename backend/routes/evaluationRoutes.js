const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Evaluation = require("../models/Evaluation");

// Save evaluation
router.post("/save-evaluation", async (req, res) => {
  try {
    const { name, result, recommendation, recommendedCourse, percent } =
      req.body;

    if (!name || !result || !recommendation || !recommendedCourse || !percent) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check if user exists
    let user = await User.findOne({ name });
    if (!user) {
      user = await User.create({ name });
    }

    // Save evaluation
    const evaluation = await Evaluation.create({
      userId: user._id,
      result,
      recommendation,
      recommendedCourse,
      percent,
    });

    res.status(200).json({ success: true, user, evaluation });
  } catch (error) {
    console.error("Save error:", error);
    res.status(500).json({ message: "Error saving evaluation" });
  }
});

// Get all evaluations
router.get("/get-evaluation", async (req, res) => {
  try {
    const evaluations = await Evaluation.find().populate("userId", "name");
    res.status(200).json({ success: true, evaluations });
  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({ message: "Error fetching evaluations" });
  }
});

router.get("/get-evaluation/examinee/id", async (req, res) => {
  try {
    const evaluations = await Evaluation.find().populate("userId", "name");
    res.status(200).json({ success: true, evaluations });
  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({ message: "Error fetching evaluations" });
  }
});

module.exports = router;
