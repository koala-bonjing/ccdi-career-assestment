import { Document, Packer, Paragraph, TextRun, HeadingLevel } from "docx";
import { saveAs } from "file-saver";
import { Bounce, toast } from "react-toastify";
import { categoryTitles } from "../config/constants";
import type { AssessmentAnswers, User, ProgramScores } from "../types";
import type { Question } from "./useAssessmentQuestions";

interface SaveAnswersParams {
  formData: AssessmentAnswers;
  programScores: ProgramScores;
  currentSection: number;
  sections: string[];
  currentUser: User | null;
  questions?: {
    foundationalAssessment: Question[];
    academicAptitude: Question[];
    technicalSkills: Question[];
    careerInterest: Question[];
    learningWorkStyle: Question[];
  };
}

interface AnswerLabels {
  [key: number]: string;
}

/**
 * Save answers as a Word document (.docx)
 */
export const saveAnswersAsDocument = async ({
  formData,
  currentUser,
  questions,
}: SaveAnswersParams): Promise<void> => {
  try {
    const timestamp = new Date().toISOString();

    // Helper to get question text from ID or return the key as-is
    const getQuestionText = (
      sectionKey: keyof AssessmentAnswers,
      questionKey: string,
    ): string => {
      if (!questions) return questionKey;

      const sectionQuestions = questions[sectionKey];
      if (!sectionQuestions) return questionKey;

      // Try to find question by _id first, then by questionText
      const question = sectionQuestions.find(
        (q) => q._id === questionKey || q.questionText === questionKey,
      );

      return question?.questionText || questionKey;
    };

    // Helper function to format answers for display
    const formatAnswers = (answers: AssessmentAnswers): Paragraph[] => {
      const paragraphs: Paragraph[] = [];

      // Define section order
      const sectionOrder: (keyof AssessmentAnswers)[] = [
        "foundationalAssessment",
        "academicAptitude",
        "technicalSkills",
        "careerInterest",
        "learningWorkStyle",
      ];

      // Process each section in order
      for (const sectionKey of sectionOrder) {
        const sectionData = answers[sectionKey];
        if (!sectionData || Object.keys(sectionData).length === 0) continue;

        const sectionTitle = categoryTitles[sectionKey] || sectionKey;

        // Section Header
        paragraphs.push(
          new Paragraph({
            text: sectionTitle,
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 300, after: 200 },
          }),
        );

        let questionNumber = 1;

        // Process each question in the section
        for (const [questionKey, answer] of Object.entries(sectionData)) {
          // Get the actual question text
          const questionText = getQuestionText(sectionKey, questionKey);

          let answerText = "";

          // Format answer based on section type
          if (sectionKey === "foundationalAssessment") {
            answerText = String(answer || "Not answered");
          } else if (sectionKey === "technicalSkills") {
            answerText = answer ? "✓ Selected" : "Not Selected";
          } else if (sectionKey === "learningWorkStyle") {
            answerText = answer ? "✓ Selected" : "Not Selected";
          } else if (
            sectionKey === "academicAptitude" ||
            sectionKey === "careerInterest"
          ) {
            // Numeric answers (Likert scale)
            const labels: AnswerLabels = {
              1: "Strongly Agree",
              2: "Agree",
              3: "Neutral",
              4: "Disagree",
              5: "Strongly Disagree",
            };

            const numericAnswer = Number(answer);
            if (
              !isNaN(numericAnswer) &&
              numericAnswer >= 1 &&
              numericAnswer <= 5
            ) {
              answerText = labels[numericAnswer];
            } else {
              answerText = `Rating: ${answer}`;
            }
          } else {
            answerText = String(answer || "Not answered");
          }

          // Only include answered questions
          if (
            sectionKey === "technicalSkills" ||
            sectionKey === "learningWorkStyle"
          ) {
            // Only show selected items for checkbox sections
            if (answer === true) {
              paragraphs.push(
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `${questionNumber}. `,
                      bold: true,
                      size: 22,
                    }),
                    new TextRun({
                      text: questionText,
                      size: 22,
                    }),
                  ],
                  indent: { left: 400 },
                  spacing: { after: 100 },
                }),
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `   ${answerText}`,
                      color: "22c55e",
                      bold: true,
                      size: 20,
                    }),
                  ],
                  indent: { left: 600 },
                  spacing: { after: 150 },
                }),
              );
              questionNumber++;
            }
          } else {
            // Show all questions for other sections
            paragraphs.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: `${questionNumber}. `,
                    bold: true,
                    size: 22,
                  }),
                  new TextRun({
                    text: questionText,
                    size: 22,
                  }),
                ],
                indent: { left: 400 },
                spacing: { after: 100 },
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: `   Answer: ${answerText}`,
                    size: 20,
                    color: "2563eb",
                  }),
                ],
                indent: { left: 600 },
                spacing: { after: 150 },
              }),
            );
            questionNumber++;
          }
        }

        // Add spacing between sections
        paragraphs.push(
          new Paragraph({
            text: "",
            spacing: { after: 300 },
          }),
        );
      }

      return paragraphs;
    };

    // Debug log
    console.log("📋 Saving document with data:", {
      formData,
      hasQuestions: !!questions,
    });

    // Build the document
    const doc = new Document({
      sections: [
        {
          children: [
            // Main Title
            new Paragraph({
              text: "Student Assessment Answers",
              heading: HeadingLevel.HEADING_1,
              spacing: { after: 400 },
            }),

            // Student Information Section
            new Paragraph({
              text: "Student Information",
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 200, after: 200 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "Name: ",
                  bold: true,
                  size: 24,
                }),
                new TextRun({
                  text: currentUser?.name || currentUser?.email || "Not specified",
                  size: 24,
                }),
              ],
              spacing: { after: 100 },
              indent: { left: 400 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "Email: ",
                  bold: true,
                  size: 24,
                }),
                new TextRun({
                  text: currentUser?.email || "Not specified",
                  size: 24,
                }),
              ],
              spacing: { after: 100 },
              indent: { left: 400 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "Preferred Course: ",
                  bold: true,
                  size: 24,
                }),
                new TextRun({
                  text: currentUser?.preferredCourse || "Not specified",
                  size: 24,
                }),
              ],
              spacing: { after: 100 },
              indent: { left: 400 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "Date: ",
                  bold: true,
                  size: 24,
                }),
                new TextRun({
                  text: new Date(timestamp).toLocaleDateString(),
                  size: 24,
                  italics: true,
                }),
              ],
              spacing: { after: 300 },
              indent: { left: 400 },
            }),

            // Divider
            new Paragraph({
              text: "─".repeat(80),
              spacing: { before: 200, after: 200 },
            }),

            // Assessment Answers
            ...formatAnswers(formData),
          ],
        },
      ],
    });

    // Generate and trigger download
    const blob = await Packer.toBlob(doc);
    const fileName = `assessment-${currentUser?.name || "student"}-${
      timestamp.split("T")[0]
    }.docx`;
    saveAs(blob, fileName);

    // Success toast
    toast.success("Document saved successfully!", {
      position: "top-right",
      autoClose: 3000,
      style: {
        backgroundColor: "rgba(34, 197, 94, 0.3)",
        backdropFilter: "blur(6px)",
        border: "2px solid #22c55e",
        color: "#fff",
        fontWeight: "bold",
        fontSize: "14px",
        borderRadius: "8px",
        fontFamily: "Poppins",
      },
      transition: Bounce,
    });
  } catch (error) {
    console.error("Error saving document:", error);
    toast.error("Failed to save document. Please try again.", {
      position: "top-right",
      autoClose: 3000,
      style: {
        backgroundColor: "rgba(239, 68, 68, 0.3)",
        backdropFilter: "blur(6px)",
        border: "2px solid #ef4444",
        color: "#fff",
        fontWeight: "bold",
        fontSize: "14px",
        borderRadius: "8px",
        fontFamily: "Poppins",
      },
      transition: Bounce,
    });
  }
};