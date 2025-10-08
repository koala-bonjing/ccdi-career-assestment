// routes/assessment.js
const express = require('express');
const router = express.Router();
const AssessmentSession = require('../models/AssessmentSession');

// Start new assessment session
router.post('/session', async (req, res) => {
  try {
    const { userId } = req.body;
    
    const session = new AssessmentSession({
      userId,
      answers: []
    });
    
    await session.save();
    res.status(201).json(session);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Save answer and update progress
router.post('/session/:sessionId/answer', async (req, res) => {
  try {
    const { questionId, answer, score, program } = req.body;
    
    const session = await AssessmentSession.findById(req.params.sessionId);
    
    // Update or add answer
    const existingAnswerIndex = session.answers.findIndex(
      a => a.questionId.toString() === questionId
    );
    
    if (existingAnswerIndex > -1) {
      session.answers[existingAnswerIndex] = { questionId, answer, score };
    } else {
      session.answers.push({ questionId, answer, score });
    }
    
    // Update program scores
    if (program && score) {
      session.programScores[program] += score;
    }
    
    await session.save();
    res.json(session);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update session progress
router.put('/session/:sessionId/progress', async (req, res) => {
  try {
    const { currentSection, currentQuestionIndex } = req.body;
    
    const session = await AssessmentSession.findByIdAndUpdate(
      req.params.sessionId,
      { currentSection, currentQuestionIndex },
      { new: true }
    );
    
    res.json(session);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Submit assessment and get results
router.post('/session/:sessionId/submit', async (req, res) => {
  try {
    const session = await AssessmentSession.findById(req.params.sessionId);
    
    // Calculate final percentages
    const totalScore = Object.values(session.programScores).reduce((a, b) => a + b, 0);
    const percentages = {};
    
    Object.keys(session.programScores).forEach(program => {
      percentages[program] = totalScore > 0 
        ? Math.round((session.programScores[program] / totalScore) * 100)
        : 25; // Equal distribution if no scores
    });
    
    // Determine recommended program
    const recommendedProgram = Object.keys(percentages).reduce((a, b) => 
      percentages[a] > percentages[b] ? a : b
    );
    
    session.results = {
      recommendedProgram,
      compatibilityPercentages: percentages,
      evaluation: "AI evaluation will be added here",
      recommendations: "AI recommendations will be added here"
    };
    
    session.completed = true;
    await session.save();
    
    res.json(session.results);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get user's assessment history
router.get('/user/:userId/history', async (req, res) => {
  try {
    const sessions = await AssessmentSession.find({ 
      userId: req.params.userId 
    }).sort({ createdAt: -1 });
    
    res.json(sessions);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;