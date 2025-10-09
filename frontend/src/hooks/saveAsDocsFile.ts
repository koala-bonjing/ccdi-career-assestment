import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";
import { Bounce, toast } from "react-toastify";
import { categoryTitles } from "../../src/config/constants";

/**
 * Save answers as a Word document (.docx)
 */
export const saveAnswersAsDocument = async (
  formData: any,
  programScores: any,
  currentSection: number,
  sections: string[],
  currentUser: any // Add currentUser parameter
) => {
  try {
    const timestamp = new Date().toISOString();
    const sectionTitle = categoryTitles[sections[currentSection]];

    // Helper function to format answers for display
    const formatAnswers = (answers: any) => {
      const paragraphs = [];

      // Process each section (academicAptitude, technicalSkills, etc.)
      for (const [sectionKey, sectionData] of Object.entries(answers)) {
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `${categoryTitles[sectionKey] || sectionKey}:`,
                bold: true,
                size: 24,
              }),
            ],
            spacing: { after: 100 },
          })
        );

        // Process each question in the section
        for (const [question, answer] of Object.entries(
          sectionData as object
        )) {
          let answerText = "";

          // Format the answer based on its type
          if (typeof answer === "boolean") {
            answerText = answer ? "Yes" : "No";
          } else if (typeof answer === "number") {
            // For numeric answers (Likert scale)
            const labels =
              sectionKey === "careerInterest"
                ? [
                    "Strongly Matches",
                    "Matches",
                    "Neutral",
                    "Partially Matches",
                    "Does Not Match",
                  ]
                : [
                    "Strongly Disagree",
                    "Disagree",
                    "Neutral",
                    "Agree",
                    "Strongly Agree",
                  ];
            answerText = labels[answer - 1] || `Rating: ${answer}`;
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
              indent: { left: 400 }, // Indent for better readability
              spacing: { after: 50 },
            })
          );
        }

        // Add some space between sections
        paragraphs.push(
          new Paragraph({
            children: [new TextRun({ text: "" })],
            spacing: { after: 150 },
          })
        );
      }

      return paragraphs;
    };

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
                    currentUser?.name ||
                    currentUser?.username ||
                    currentUser?.email ||
                    "Not specified"
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
              spacing: { after: 200 },
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
            new Paragraph({
              children: [
                new TextRun({
                  text: `Current Section: ${sectionTitle}`,
                  bold: true,
                  size: 26,
                }),
              ],
              spacing: { after: 300 },
            }),

            // --- Answers Section ---
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
    saveAs(
      blob,
      `assessment-${currentUser?.name || currentUser?.username || "student"}-${
        timestamp.split("T")[0]
      }.docx`
    );

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
