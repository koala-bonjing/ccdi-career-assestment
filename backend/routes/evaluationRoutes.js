const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const Evaluation = require("../models/Evaluation");

const genAI = new GoogleGenerativeAI(process.env.VITE_GEMINI_API_KEY);

// COMPLETE 37-QUESTION ANSWER KEY
const FOUNDATIONAL_ANSWER_KEY = {
  // Prerequisite Questions
  found_prereq_001: "Grade 12 Math or higher",
  found_prereq_002: "x = 5",
  found_prereq_003: "20",
  found_prereq_004: "I'm very comfortable reading in English",
  found_prereq_005: "Click on Forgot Password",
  found_prereq_006:
    "I'm very comfortable - I can fix problems and install programs",
  found_prereq_007: "Yes, and I can organize files into multiple folders",
  found_prereq_008: "Yes, regularly",
  found_prereq_009: "Adult",
  found_prereq_010: "Took advanced science courses",
  found_prereq_011: "Yes, I understand these concepts well",
  found_prereq_012:
    "Multiple tools including soldering iron or circuit testing equipment",
  found_prereq_013: "Storage",
  found_prereq_014: "Getting a file from the internet to your computer",
  found_prereq_015: "The amount of electricity flowing",

  // Study Habit Questions
  found_study_001: "More than 15 hours",
  found_study_002: "No, I can focus mostly on studies",
  found_study_003: "As soon as I get the assignment",
  found_study_004: "I create study schedules and use multiple study techniques",
  found_study_005: "I ask the teacher and keep trying until I understand",
  found_study_006: "I try for an hour or more before asking",
  found_study_007: "Yes, and I have a good computer/internet too",
  found_study_008: "Excellent internet access always available",
  found_study_009: "I have an organized system (planner, app, etc.)",
  found_study_010: "90 and above (excellent)",
  found_study_011: "I handle pressure well and stay focused",
  found_study_012: "I learn best in study groups",

  // Problem Solving Questions
  found_problem_001: "13 pesos",
  found_problem_002: "10",
  found_problem_003: "Check if the battery is charged",
  found_problem_004: "6",
  found_problem_005: "100 items",
  found_problem_006: "John might be a programmer",
  found_problem_007: "Set up a network (WiFi or cables with a router)",
  found_problem_008: "Sales are increasing by 50 each week",
  found_problem_009: "Electricity flows through your body",
  found_problem_010: "Voltage doubles (adds together)",
};

// Helper to analyze readiness
function analyzePrerequisites(foundational) {
  if (!foundational)
    return {
      summary: "No foundational data provided",
      mathScore: 0,
      technicalScore: 0,
      communicationScore: 0,
      timeScore: 0,
      overallScore: 0,
      warnings: [],
      recommendations: [],
    };

  // Calculate scores based on actual answers
  let mathScore = 0;
  let techScore = 0;
  let communicationScore = 0;
  let timeScore = 0;

  // Math questions (1-3)
  if (
    foundational["found_prereq_001"] ===
    FOUNDATIONAL_ANSWER_KEY["found_prereq_001"]
  )
    mathScore += 2;
  if (
    foundational["found_prereq_002"] ===
    FOUNDATIONAL_ANSWER_KEY["found_prereq_002"]
  )
    mathScore += 2;
  if (
    foundational["found_prereq_003"] ===
    FOUNDATIONAL_ANSWER_KEY["found_prereq_003"]
  )
    mathScore += 1;

  // Technical questions (6-12)
  if (
    foundational["found_prereq_006"] ===
    FOUNDATIONAL_ANSWER_KEY["found_prereq_006"]
  )
    techScore += 2;
  if (
    foundational["found_prereq_007"] ===
    FOUNDATIONAL_ANSWER_KEY["found_prereq_007"]
  )
    techScore += 1;
  if (
    foundational["found_prereq_008"] ===
    FOUNDATIONAL_ANSWER_KEY["found_prereq_008"]
  )
    techScore += 1;
  if (
    foundational["found_prereq_009"] ===
    FOUNDATIONAL_ANSWER_KEY["found_prereq_009"]
  )
    techScore += 1;

  // Communication (4-5, 13-15)
  if (
    foundational["found_prereq_004"] ===
    FOUNDATIONAL_ANSWER_KEY["found_prereq_004"]
  )
    communicationScore += 2;
  if (
    foundational["found_prereq_005"] ===
    FOUNDATIONAL_ANSWER_KEY["found_prereq_005"]
  )
    communicationScore += 1;
  if (
    foundational["found_prereq_013"] ===
    FOUNDATIONAL_ANSWER_KEY["found_prereq_013"]
  )
    communicationScore += 1;
  if (
    foundational["found_prereq_014"] ===
    FOUNDATIONAL_ANSWER_KEY["found_prereq_014"]
  )
    communicationScore += 1;
  if (
    foundational["found_prereq_015"] ===
    FOUNDATIONAL_ANSWER_KEY["found_prereq_015"]
  )
    communicationScore += 1;

  // Time/Study habits (16-27)
  if (
    foundational["found_study_001"] ===
    FOUNDATIONAL_ANSWER_KEY["found_study_001"]
  )
    timeScore += 2;
  if (
    foundational["found_study_002"] ===
    FOUNDATIONAL_ANSWER_KEY["found_study_002"]
  )
    timeScore += 1;
  if (
    foundational["found_study_003"] ===
    FOUNDATIONAL_ANSWER_KEY["found_study_003"]
  )
    timeScore += 1;
  if (
    foundational["found_study_004"] ===
    FOUNDATIONAL_ANSWER_KEY["found_study_004"]
  )
    timeScore += 1;
  if (
    foundational["found_study_005"] ===
    FOUNDATIONAL_ANSWER_KEY["found_study_005"]
  )
    timeScore += 1;

  // Convert to 0-5 scale
  mathScore = Math.min(5, Math.round(mathScore));
  techScore = Math.min(5, Math.round((techScore * 5) / 6));
  communicationScore = Math.min(5, Math.round((communicationScore * 5) / 6));
  timeScore = Math.min(5, Math.round((timeScore * 5) / 5));
  const overallScore = Math.round(
    (mathScore + techScore + communicationScore + timeScore) / 4,
  );

  // Generate warnings and recommendations
  const warnings = [];
  const recommendations = [];

  if (mathScore < 3) {
    warnings.push("Limited math background");
    recommendations.push("Review basic algebra and percentages");
  }

  if (techScore < 3) {
    warnings.push("Limited technical experience");
    recommendations.push("Practice basic computer skills before classes start");
  }

  if (timeScore < 3) {
    warnings.push("Limited study time available");
    recommendations.push(
      "Consider part-time enrollment or time management strategies",
    );
  }

  return {
    summary: `Student shows ${overallScore >= 4 ? "strong" : overallScore >= 3 ? "moderate" : "basic"} foundational readiness`,
    mathScore,
    technicalScore: techScore,
    communicationScore,
    timeScore,
    overallScore,
    warnings,
    recommendations,
  };
}

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

    // Calculate foundational assessment scores if available
    let foundationalSection = "";
    let prereqAnalysis = null;
    let foundationalScore = 0;
    let weaknesses = [];

    if (answers.foundationalAssessment && Object.keys(answers.foundationalAssessment).length > 0) {
      // Calculate prerequisite analysis
      prereqAnalysis = analyzePrerequisites(answers.foundationalAssessment);
      
      // Calculate foundational score
      let correctCount = 0;
      const totalQuestions = Object.keys(FOUNDATIONAL_ANSWER_KEY).length;
      
      Object.entries(FOUNDATIONAL_ANSWER_KEY).forEach(([id, correctAnswer]) => {
        if (answers.foundationalAssessment[id] === correctAnswer) {
          correctCount++;
        } else {
          weaknesses.push(id);
        }
      });
      
      foundationalScore = Math.round((correctCount / totalQuestions) * 100);
      
      // Build foundational section for the prompt
      foundationalSection = `
FOUNDATIONAL ASSESSMENT:
- Score: ${foundationalScore}%
- Math Foundation: ${prereqAnalysis.mathScore}/5
- Technical Aptitude: ${prereqAnalysis.technicalScore}/5  
- Communication Skills: ${prereqAnalysis.communicationScore}/5
- Time Commitment: ${prereqAnalysis.timeScore}/5
- Overall Readiness: ${prereqAnalysis.overallScore}/5

${prereqAnalysis.warnings.length > 0 ? "AREAS NEEDING ATTENTION:\n" + prereqAnalysis.warnings.map((w) => `  - ${w}`).join("\n") + "\n" : ""}
${prereqAnalysis.recommendations.length > 0 ? "PREPARATION RECOMMENDATIONS:\n" + prereqAnalysis.recommendations.map((r) => `  - ${r}`).join("\n") + "\n" : ""}
`;
    }

    // ✅ FIXED PROMPT - No undefined variables
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
${foundationalSection}

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
9. **examAnalysis**: A brief comment on their foundational exam performance (if available).
10. **preparationNeeded**: An array of 3 specific study topics based on their assessment responses.

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
  "examAnalysis": "string",
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
      examAnalysis: parsed.examAnalysis || "",
      successRoadmap: parsed.successRoadmap || "",
      preparationNeeded: parsed.preparationNeeded || [],
      answers: answers,
      foundationalScore: foundationalScore,
      weaknesses: weaknesses,
      prereqAnalysis: prereqAnalysis,
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
      foundationalScore: foundationalScore,
      weaknesses: weaknesses,
      prereqAnalysis: prereqAnalysis,
      examAnalysis: parsed.examAnalysis,
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