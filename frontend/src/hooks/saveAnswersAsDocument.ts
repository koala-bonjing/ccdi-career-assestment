import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";
import { Bounce, toast } from "react-toastify";
import { categoryTitles } from "../config/constants";
import type { AssessmentAnswers, User, ProgramScores } from "../types";

interface SaveAnswersParams {
  formData: AssessmentAnswers;
  programScores: ProgramScores;
  currentSection: number;
  sections: string[];
  currentUser: User | null;
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
}: SaveAnswersParams): Promise<void> => {
  try {
    const timestamp = new Date().toISOString();

    // Helper function to format answers for display
    const formatAnswers = (answers: AssessmentAnswers): Paragraph[] => {
      const paragraphs: Paragraph[] = [];

      // Process each section
      for (const [sectionKey, sectionData] of Object.entries(answers)) {
        const typedSectionKey = sectionKey as keyof AssessmentAnswers;
        const sectionTitle = categoryTitles[typedSectionKey] || typedSectionKey;

        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `${sectionTitle}:`,
                bold: true,
                size: 24,
              }),
            ],
            spacing: { after: 100 },
          }),
        );

        // Process each question in the section
        for (const [question, answer] of Object.entries(sectionData)) {
          let answerText = "";

          if (typedSectionKey === "technicalSkills") {
            answerText = answer ? "Yes" : "No";
          } else if (typedSectionKey === "learningWorkStyle") {
            answerText = answer ? "✅ Selected" : "X";
          } else if (
            typedSectionKey === "academicAptitude" ||
            typedSectionKey === "careerInterest"
          ) {
            // Numeric answers (Likert scale) for all three sections
            const labels: AnswerLabels = {
              1:
                typedSectionKey === "careerInterest"
                  ? "Strongly Agree"
                  : "Strongly Agree",
              2: typedSectionKey === "careerInterest" ? "Agree" : "Agree",
              3: "Neutral",
              4: typedSectionKey === "careerInterest" ? "Disagree" : "Disagree",
              5:
                typedSectionKey === "careerInterest"
                  ? "Strongly Disagree"
                  : "Strongly Disagree",
            };

            // Ensure the answer is a number and within valid range
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

          paragraphs.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: `• ${question}: ${answerText}`,
                  size: 20,
                }),
              ],
              indent: { left: 400 },
              spacing: { after: 50 },
            }),
          );
        }

        // Add some space between sections
        paragraphs.push(
          new Paragraph({
            children: [new TextRun({ text: "" })],
            spacing: { after: 150 },
          }),
        );
      }

      return paragraphs;
    };

    // Debug: Log the actual form data to see what's being saved
    console.log("📋 Form Data being saved:", formData);
    console.log("🎯 Learning Style answers:", formData.learningWorkStyle);

    // Build the document
    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: "Student Assessment Answers",
                  bold: true,
                  size: 32,
                }),
              ],
              spacing: { after: 300 },
            }),
            // Add User Information
            new Paragraph({
              children: [
                new TextRun({
                  text: `Student Name: ${
                    currentUser?.name || currentUser?.email || "Not specified"
                  }`,
                  bold: true,
                  size: 24,
                }),
              ],
              spacing: { after: 100 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `Email: ${currentUser?.email || "Not specified"}`,
                  size: 22,
                }),
              ],
              spacing: { after: 100 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `Preferred Course: ${
                    currentUser?.preferredCourse || "Not specified"
                  }`,
                  size: 22,
                }),
              ],
              spacing: { after: 100 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `Date: ${new Date(timestamp).toLocaleDateString()}`,
                  italics: true,
                  size: 22,
                }),
              ],
              spacing: { after: 200 },
            }),

            // Answers Section
            new Paragraph({
              children: [
                new TextRun({
                  text: "Assessment Answers:",
                  bold: true,
                  size: 28,
                }),
              ],
              spacing: { after: 150 },
            }),
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
