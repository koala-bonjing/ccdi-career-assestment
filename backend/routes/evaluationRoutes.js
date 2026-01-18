const express = require("express");
const router = express.Router();
const Evaluation = require("../models/Evaluation");

// Save evaluation results (your existing route)
router.post("/save-evaluation", async (req, res) => {
  try {
    const {
      userId,
      userName,
      userEmail,
      evaluation,
      detailedEvaluation,
      recommendations,
      recommendedCourse,
      percent,
      programScores,
    } = req.body;

    // Validate required fields
    if (!userId || !recommendedCourse || !percent) {
      return res.status(400).json({
        success: false,
        message:
          "Missing required fields: userId, recommendedCourse, or percent",
      });
    }

    const evaluationDoc = new Evaluation({
      userId,
      userName: userName || "Anonymous User",
      userEmail: userEmail || "",
      evaluation: evaluation || "No evaluation details provided",
      detailedEvaluation:
        detailedEvaluation || "No evaluation details provided",
      recommendations: recommendations || "No specific recommendations",
      recommendedCourse,
      percent,
      programScores: programScores || {},
      submissionDate: new Date(),
    });

    await evaluationDoc.save();

    console.log("✅ Evaluation saved for user:", userId);
    res.status(201).json({
      success: true,
      message: "Evaluation saved successfully",
      evaluationId: evaluationDoc._id,
      data: evaluationDoc,
    });
  } catch (error) {
    console.error("❌ Error saving evaluation:", error);
    res.status(500).json({
      success: false,
      message: "Failed to save evaluation",
      error: error.message,
    });
  }
});

// Get all evaluations for a specific user
router.get("/get-evaluations/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const evaluations = await Evaluation.find({ userId })
      .sort({ submissionDate: -1 })
      .select("-__v"); // Exclude version key

    res.status(200).json({
      success: true,
      count: evaluations.length,
      data: evaluations,
    });
  } catch (error) {
    console.error("❌ Error fetching evaluations:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch evaluations",
      error: error.message,
    });
  }
});

// Get a specific evaluation by ID
router.get("/evaluation/:evaluationId", async (req, res) => {
  try {
    const { evaluationId } = req.params;

    const evaluation = await Evaluation.findById(evaluationId);

    if (!evaluation) {
      return res.status(404).json({
        success: false,
        message: "Evaluation not found",
      });
    }

    res.status(200).json({
      success: true,
      data: evaluation,
    });
  } catch (error) {
    console.error("❌ Error fetching evaluation:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch evaluation",
      error: error.message,
    });
  }
});

// Delete an evaluation
router.delete("/evaluation/:evaluationId", async (req, res) => {
  try {
    const { evaluationId } = req.params;

    const evaluation = await Evaluation.findByIdAndDelete(evaluationId);

    if (!evaluation) {
      return res.status(404).json({
        success: false,
        message: "Evaluation not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Evaluation deleted successfully",
    });
  } catch (error) {
    console.error("❌ Error deleting evaluation:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete evaluation",
      error: error.message,
    });
  }
});

module.exports = router;
