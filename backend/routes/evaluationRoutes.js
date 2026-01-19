const express = require("express");
const router = express.Router();
require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const Evaluation = require("../models/Evaluation");
const { parse } = require("dotenv");

const genAI = new GoogleGenerativeAI(process.env.VITE_GEMINI_API_KEY);

// Save evaluation results
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
      .select("-__v");

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

function flattenAnswers(nested) {
  const flat = {};
  if (nested.academicAptitude)
    Object.entries(nested.academicAptitude).forEach(([q, v]) => {
      flat[`academicAptitude.${q}`] = v;
    });
  if (nested.technicalSkills)
    Object.entries(nested.technicalSkills).forEach(([q, v]) => {
      flat[`technicalSkills.${q}`] = v;
    });
  if (nested.careerInterest)
    Object.entries(nested.careerInterest).forEach(([q, v]) => {
      flat[`careerInterest.${q}`] = v;
    });
  if (nested.learningWorkStyle)
    Object.entries(nested.learningWorkStyle).forEach(([q, v]) => {
      flat[`learningStyle.${q}`] = v;
    });
  return flat;
}

function formatAnswers(flat) {
  return Object.entries(flat)
    .map(([question, value]) => {
      if (typeof value === "number") return `- ${question}: ${value}/5`;
      if (typeof value === "boolean")
        return value ? `- ${question}: Yes` : null;
      return `- ${question}: ${value}`;
    })
    .filter(Boolean)
    .join("\n");
}

// ✅ MAIN EVALUATION ROUTE - FIXED
router.post("/evaluate-assessment", async (req, res) => {
  console.log("🎯 /api/evaluate-assessment endpoint hit!");
  console.log("📦 Request body:", JSON.stringify(req.body, null, 2));

  try {
    // ✅ FIX: Properly destructure fullName from req.body
    const { userId, fullName, email, preferredCourse, answers, programScores } =
      req.body;

    // Validation
    if (!userId || !answers) {
      console.error("❌ Validation failed: Missing userId or answers");
      return res.status(400).json({ error: "Missing required fields" });
    }

    const flatAnswers = flattenAnswers(answers);
    const formatted = formatAnswers(flatAnswers);

    if (!formatted.trim()) {
      console.error("❌ No valid answers after formatting");
      return res.status(400).json({ error: "No valid answers provided" });
    }

    console.log("📝 Formatted answers length:", formatted.length);

    // ✅ FIX: Use the destructured variables instead of authUser
    const prompt = `
  You are a career guidance assistant for CCDI Sorsogon, helping students identify the most suitable technology program based on their aptitudes, interests, and circumstances.

  AVAILABLE PROGRAMS:
  1. BSCS (Computer Science) — Focuses on software development, algorithms, theoretical computing, and mathematics. Prepares students for software engineering, AI/ML, and research roles.
  2. BSIT (Information Technology) — Focuses on IT infrastructure, networking, system administration, and cybersecurity. Prepares students for network admin, IT support, and security roles.
  3. BSIS (Information Systems) — Bridges business and technology through data analysis, systems analysis, and IT project management. Prepares students for business analyst and IT consulting roles.
  4. BSET Electronics Technology — Focuses on electronic systems, circuits, microcontrollers, robotics, automation, and embedded systems. Prepares students for electronics technician and design roles.
  5. BSET Electrical Technology — Focuses on electrical power systems, motors, transformers, industrial control, PLC programming, and electrical installation. Prepares students for electrical technician and industrial roles.

  STUDENT PROFILE:
  - Name: ${fullName || "Student"}
  - Initially Interested In: ${preferredCourse || "Not specified"}

  STUDENT ASSESSMENT RESPONSES:
  ${formatted}

  EVALUATION CRITERIA:
  Analyze the student's responses across these dimensions:
  - Academic Aptitude: Math skills, theoretical vs. practical preference, learning style
  - Technical Interests: Software vs. hardware, systems vs. applications, business vs. pure tech
  - Career Goals: Desired work environment, job type, industry preferences
  - Logistics & Resources: Financial capacity, time availability, equipment access, physical requirements

  RESPONSE REQUIREMENTS:
  1. **recommendedCourse**: Must be EXACTLY one of: "BSCS", "BSIT", "BSIS", "BSET Electronics Technology", "BSET Electrical Technology"
  2. **summary**: 2-3 sentences highlighting the student's strongest aptitudes and interests
  3. **result**: A clear statement of your primary recommendation and why it's the best fit (3-4 sentences)
  4. **detailedEvaluation**: A comprehensive analysis (4-6 sentences) covering all aspects
  5. **percent**: Assign an ABSOLUTE confidence score (0-100) for EACH program independently based on assessment fit:
    - Top program: 70-95 for strong matches
    - Secondary programs: 30-60 for moderate fits
    - Weak matches: 0-25
    - Scores DO NOT need to sum to 100
    - Example structure:
        "BSCS": 85,
        "BSIT": 40,
        "BSIS": 35,
        "BSET Electronics Technology": 15,
        "BSET Electrical Technology": 10
  6. **categoryExplanations**: Specific reasons for each category score (1-2 sentences each):
    - academicReason: Why their academic aptitude fits this program
    - technicalReason: Why their technical skills match this program
    - careerReason: Why their career goals align with this program
    - logisticsReason: Why this program is logistically feasible for them

  IMPORTANT GUIDELINES:
  - Base your recommendation on the ASSESSMENT DATA, not just their initial preference
  - Be specific and personalized in category explanations
  - Use the student's actual answers to justify each category
  - Make explanations actionable and encouraging

  PRIORITIZE THESE FACTORS WHEN CALCULATING PERCENTAGES:
  1. Academic Aptitude (40% weight): Math strength, theoretical vs practical preference
  2. Technical Interests (30% weight): Hardware/software preference, systems thinking
  3. Career Goals (20% weight): Desired work environment, job type preferences
  4. Logistics (10% weight): Financial capacity, equipment access, time availability

  CRITICAL RULES FOR PERCENTAGES:
  - If student shows EXTREME alignment with one program (e.g., loves math + theoretical work + wants research career), top score MUST be 85-95
  - Never give >60% to more than two programs
  - Programs with no relevant skills/interests should score ≤15

  Respond ONLY with valid JSON (no markdown, no explanation):
  {
    "summary": "string",
    "result": "string",
    "detailedEvaluation": "string",
    "recommendedCourse": "BSCS|BSIT|BSIS|BSET Electronics Technology|BSET Electrical Technology",
    "percent": {
      "BSCS": number,
      "BSIT": number,
      "BSIS": number,
      "BSET Electronics Technology": number,
      "BSET Electrical Technology": number
    },
    "categoryExplanations": {
      "academicReason": "string",
      "technicalReason": "string",
      "careerReason": "string",
      "logisticsReason": "string"
    },
    "aiAnswer": "string"
  }
  `;

    console.log("🤖 Calling Gemini API...");

    // AI Evaluation
    const model = genAI.getGenerativeModel({
      model: "gemini-3-pro-preview",
    });

    const aiResponse = await model.generateContent(prompt);
    const raw = aiResponse.response.text();
    console.log("📥 Raw AI response:", raw.substring(0, 200) + "...");

    const cleaned = raw.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleaned);

    if (!parsed.recommendedCourse || !parsed.percent) {
      throw new Error(
        "Invalid AI response: missing recommendedCourse or percent",
      );
    }

    console.log("✅ AI response parsed successfully");
    console.log("📊 Recommended course:", parsed.recommendedCourse);

    const evaluationDoc = new Evaluation({
      userId,
      fullName: parsed.fullName || "Anonymous User",
      email: parsed.email || "",
      evaluation: parsed.evaluation || "No evaluation details provided",
      detailedEvaluation:
        parsed.detailedEvaluation || "No evaluation details provided",
      recommendations: parsed.recommendations || "No specific recommendations",
      percent: parsed.percent,
      recommendedCourse: parsed.recommendedCourse,
      percent: parsed.percent,
      submissionDate: new Date(),
    });

    await evaluationDoc.save();

    const result = {
      success: true,
      summary: parsed.summary,
      evaluation: parsed.result,
      detailedEvaluation: parsed.detailedEvaluation,
      recommendedProgram: parsed.recommendedCourse,
      user: {
        _id: userId,
        name: fullName || "Student",
        email: email || "",
        preferredCourse: preferredCourse || "Undecided",
      },
      percent: parsed.percent,
      programScores: programScores || {},
      submissionDate: new Date().toISOString(),
      answers,
      aiAnswer: parsed.aiAnswer,
      categoryExplanations: parsed.categoryExplanations,
      evaluationId: evaluationDoc._id,
    };

    console.log("✅ Sending response to client");
    res.json(result);
  } catch (error) {
    console.error("❌ Evaluation error:", error);
    res.status(500).json({
      error: "Failed to generate evaluation",
      message: error.message || "Unknown error",
    });
  }
});

module.exports = router;
