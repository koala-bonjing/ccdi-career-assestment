const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const Evaluation = require("../models/Evaluation");

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
// Updated evaluation endpoint - ADDS prerequisites analysis to existing system

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

    // ✅ NEW: Calculate prerequisites readiness if available
    let prerequisitesSection = "";
    if (answers.prerequisites) {
      const prereqAnalysis = analyzePrerequisites(answers.prerequisites);
      prerequisitesSection = `\n\nPREREQUISITE READINESS ASSESSMENT:
  ${prereqAnalysis.summary}

  Key Indicators:
  - Math Foundation: ${prereqAnalysis.mathScore}/5
  - Technical Aptitude: ${prereqAnalysis.technicalScore}/5  
  - Communication Skills: ${prereqAnalysis.communicationScore}/5
  - Time Commitment: ${prereqAnalysis.timeScore}/5
  - Overall Readiness: ${prereqAnalysis.overallScore}/5

  ${prereqAnalysis.warnings.length > 0 ? "⚠️ READINESS CONCERNS:\n" + prereqAnalysis.warnings.map((w) => `  - ${w}`).join("\n") : "✅ Student shows good foundational readiness"}

  ${prereqAnalysis.recommendations.length > 0 ? "\n📚 PREPARATION RECOMMENDATIONS:\n" + prereqAnalysis.recommendations.map((r) => `  - ${r}`).join("\n") : ""}
  `;
    }

    // ✅ KEEP YOUR EXISTING PROMPT - Just add prerequisites section
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
            ${prerequisitesSection}

            STUDENT ASSESSMENT RESPONSES:
            ${formatted}

            EVALUATION CRITERIA:
            Analyze the student's responses across these dimensions:
            - Academic Aptitude: Math skills, theoretical vs. practical preference, learning style
            - Technical Interests: Software vs. hardware, systems vs. applications, business vs. pure tech
            - Career Goals: Desired work environment, job type, industry preferences
            - Logistics & Resources: Financial capacity, time availability, equipment access, physical requirements

            Use the ${answers.prerequisites} text answers to determine the following scores for the Radar Chart:

            SCORING INSTRUCTIONS (For categoryScores):
        - ACADEMIC (0-100): High if they finished Grade 12 Math, solve algebra correctly, and have science experience.
        - TECHNICAL (0-100): High if they troubleshoot logic puzzles (battery/pattern) correctly and are comfortable with computers.
        - CAREER (0-100): High if they have strong motivation and plan to study >10 hours per week.
        - LOGISTICS (0-100): High if they have internet access, a quiet study space, and manageable responsibilities.


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
            7. **categoryScores**: Assign a score from 0 to 100 for EACH of the following categories, based on how well the student aligns with the **recommended program**:
            - academic: How well their academic aptitude (math, logic, learning style) matches the program's demands
            - technical: How well their technical interests and hands-on skills fit the program's focus
            - career: How aligned their career goals and job preferences are with typical outcomes of this program
            - logistics: How feasible the program is given their resources, time, equipment, and personal situation
            IMPORTANT GUIDELINES:
            - Base your recommendation on the ASSESSMENT DATA, not just their initial preference
            - Be specific and personalized in category explanations
            - Use the student's actual answers to justify each category
            - Make explanations actionable and encouraging

            CRITICAL RULES FOR PERCENTAGES:
            - If student shows EXTREME alignment with one program (e.g., loves math + theoretical work + wants research career), top score MUST be 85-95
            - Never give >60% to more than two programs
            - Programs with no relevant skills/interests should score ≤15

            Strictly: Do not include any other text before or after the JSON. Only output the JSON object.
            Respond ONLY with valid JSON (no markdown, no explanation):
            {
              "summary": "string",
              "result": "string",
              "detailedEvaluation": "string",
              "recommendations": "string",
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
               "prerequisites": "A 2-sentence summary of their foundational readiness (Math/Logic/Habits)",
                "aiAnswer": "string"
              }
              `;

    console.log("🤖 Calling Gemini API...");

    // AI Evaluation
    const model = genAI.getGenerativeModel({
      model: "gemini-3-flash-preview",
    });

    const aiResponse = await model.generateContent(prompt);
    const raw = aiResponse.response.text();
    console.log("📥 Raw AI response:", raw.substring(0, 200) + "...");

    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("AI did not return valid JSON format");
    }
    const parsed = JSON.parse(jsonMatch[0]);

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
      prerequisites: parsed.prerequisites,
    });

    // ✅ Add preparationNeeded if it exists
    if (parsed.preparationNeeded) {
      evaluationDoc.preparationNeeded = parsed.preparationNeeded;
    }

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
      aiAnswer: parsed.aiAnswer,
      categoryExplanations: parsed.categoryExplanations,
      categoryScores: parsed.categoryScores,
      preparationNeeded: parsed.preparationNeeded || null,
      evaluationId: evaluationDoc._id,
      prerequisites: parsed.prerequisites,
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
