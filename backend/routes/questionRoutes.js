// routes/questions.js
const express = require("express");
const router = express.Router();
const Question = require("../models/Question");

// Get all questions for assessment (grouped by category)
router.get("/", async (req, res) => {
  try {
    const questions = await Question.find({ isActive: true }).sort({
      category: 1,
      order: 1,
    });

    // Group by category for frontend
    const groupedQuestions = {
      academicAptitude: [],
      technicalSkills: [],
      careerInterest: [],
      learningStyle: [],
    };

    questions.forEach((question) => {
      groupedQuestions[question.category].push({
        _id: question._id,
        questionText: question.questionText,
        program: question.program,
        weight: question.weight,
        options: question.options,
      });
    });

    res.json(groupedQuestions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all questions (flat list - for admin)
router.get("/questions", async (req, res) => {
  try {
    const questions = await Question.find();
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add new question (admin)
router.post("/", async (req, res) => {
  try {
    const question = new Question(req.body);
    await question.save();
    res.status(201).json(question);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Add multiple questions at once
router.post("/bulk", async (req, res) => {
  try {
    const questions = await Question.insertMany(req.body);
    res.status(201).json({
      message: `Successfully added ${questions.length} questions`,
      questions,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


// Update question (admin)
router.put("/:id", async (req, res) => {
  try {
    const question = await Question.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(question);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
