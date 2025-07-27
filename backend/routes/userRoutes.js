const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Evaluation = require("../models/Evaluation"); // ✅ Don't forget this

// GET route to fetch evaluations with user names
router.get("/get-evaluation", async (req, res) => {
  try {
    const evaluations = await Evaluation.find().populate("userId", "name");
    res.status(200).json({ success: true, evaluations });
  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({ message: "Error fetching evaluations" });
  }
});

module.exports = router;
