const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const Evaluation = require("../models/Evaluation");

const genAI = new GoogleGenerativeAI(process.env.VITE_GEMINI_API_KEY);

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

router.get("/get-evaluations/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    // 1. Check if the ID is valid hex string
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid ID format" });
    }

    // 2. Query the EVALUATIONS collection, not the user collection
    // We look for any evaluation where the userId field matches the ID in the URL
    const evaluations = await Evaluation.find({ userId: userId }).sort({
      submissionDate: -1,
    });

    // 3. Return the data. If it's empty, data will just be [] (empty array)
    // This PREVENTS the 500 error because [] is a valid response.
    return res.status(200).json({
      success: true,
      count: evaluations.length,
      data: evaluations,
    });
  } catch (error) {
    console.error("🔥 Backend Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

// ✅ MAIN EVALUATION ROUTE - SIMPLIFIED
router.post("/evaluate-assessment", async (req, res) => {
  console.log("🎯 /api/evaluate-assessment endpoint hit!");
  console.log("📦 Request body:", JSON.stringify(req.body, null, 2));

  try {
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

    // ✅ SIMPLIFIED PROMPT - No foundational assessment evaluation
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
6. **categoryScores**: Assign a score from 0 to 100 for EACH of the following categories, based on how well the student aligns with the **recommended program**:
   - academic: How well their academic aptitude (math, logic, learning style) matches the program's demands
   - technical: How well their technical interests and hands-on skills fit the program's focus
   - career: How aligned their career goals and job preferences are with typical outcomes of this program
   - logistics: How feasible the program is given their resources, time, equipment, and personal situation
7. **categoryExplanations**: Specific reasons for each category score (1-2 sentences each):
   - academicReason: Why their academic aptitude fits this program
   - technicalReason: Why their technical skills match this program
   - careerReason: Why their career goals align with this program
   - logisticsReason: Why this program is logistically feasible for them
8. **successRoadmap**: A list of 3-5 specific topics or skills the student should study BEFORE starting the recommended program to ensure success.
9. **preparationNeeded**: An array of 3 specific study topics based on their assessment responses.

IMPORTANT GUIDELINES:
- Base your recommendation on the ASSESSMENT DATA, not just their initial preference
- Be specific and personalized in category explanations
- Use the student's actual answers to justify each category
- Make explanations actionable and encouraging

CRITICAL RULES FOR PERCENTAGES:
- If student shows EXTREME alignment with one program, top score MUST be 85-95
- Never give >60% to more than two programs
- Programs with no relevant skills/interests should score ≤15

Respond ONLY with valid JSON (no markdown, no explanation):
{
  "summary": "string",
  "result": "string",
  "detailedEvaluation": "string",
  "recommendations": "A personalized advice based on the answers of the student. Make it simple and beginner friendly.",
  "recommendedCourse": "BSCS|BSIT|BSIS|BSET Electronics Technology|BSET Electrical Technology",
  "percent": {
    "BSCS": number,
    "BSIT": number,
    "BSIS": number,
    "BSET Electronics Technology": number,
    "BSET Electrical Technology": number
  },
  "categoryScores": {
    "academic": number,
    "technical": number,
    "career": number,
    "logistics": number
  },
  "categoryExplanations": {
    "academicReason": "string",
    "technicalReason": "string",
    "careerReason": "string",
    "logisticsReason": "string"
  },
  "successRoadmap": "string",
  "preparationNeeded": ["topic 1", "topic 2", "topic 3"]
}`;

    console.log("🤖 Calling Gemini API...");

    // AI Evaluation
    const model = genAI.getGenerativeModel({
      model: "gemini-3-flash-preview",
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    const aiResponse = await model.generateContent(prompt);
    const raw = aiResponse.response.text();
    console.log("📥 Raw AI response:", raw.substring(0, 200) + "...");

    const parsed = JSON.parse(raw);

    if (!parsed.recommendedCourse || !parsed.percent) {
      throw new Error(
        "Invalid AI response: missing recommendedCourse or percent",
      );
    }

    console.log("✅ AI response parsed successfully");
    console.log("📊 Recommended course:", parsed.recommendedCourse);

    // ✅ Build evaluation document
    const evaluationDoc = new Evaluation({
      userId,
      userName: fullName || "Anonymous User",
      userEmail: email || "",
      evaluation: parsed.result || "No evaluation details provided",
      detailedEvaluation:
        parsed.detailedEvaluation || "No evaluation details provided",
      recommendations: parsed.recommendations || "No specific recommendations",
      percent: parsed.percent,
      recommendedCourse: parsed.recommendedCourse,
      categoryScores: parsed.categoryScores || {
        academic: 0,
        technical: 0,
        career: 0,
        logistics: 0,
      },
      categoryExplanations: parsed.categoryExplanations || {
        academicReason: "No explanation provided",
        technicalReason: "No explanation provided",
        careerReason: "No explanation provided",
        logisticsReason: "No explanation provided",
      },
      submissionDate: new Date(),
      successRoadmap: parsed.successRoadmap,
      preparationNeeded: parsed.preparationNeeded,
      answers: answers,
    });

    await evaluationDoc.save();

    const result = {
      success: true,
      summary: parsed.summary,
      evaluation: parsed.result,
      detailedEvaluation: parsed.detailedEvaluation,
      recommendations: parsed.recommendations,
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
      categoryExplanations: parsed.categoryExplanations,
      categoryScores: parsed.categoryScores,
      preparationNeeded: parsed.preparationNeeded || null,
      evaluationId: evaluationDoc._id,
      successRoadmap: parsed.successRoadmap,
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
