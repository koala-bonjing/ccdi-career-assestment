import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
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

const sanitize = (text: string): string =>
  text
    .replace(/₱/g, "PHP")
    .replace(/✓/g, "v")
    // eslint-disable-next-line no-control-regex
    .replace(/[^\x00-\x7F]/g, "?");

export const generateAssessmentDocument = async ({
  formData,
  currentUser,
  questions,
}: SaveAnswersParams): Promise<Blob> => {
  try {
    const timestamp = new Date().toISOString();

    const getQuestionText = (
      sectionKey: keyof AssessmentAnswers,
      questionKey: string,
    ): string => {
      if (!questions) return questionKey;
      const sectionQuestions = questions[sectionKey];
      if (!sectionQuestions) return questionKey;
      const question = sectionQuestions.find(
        (q) => q._id === questionKey || q.questionText === questionKey,
      );
      return question?.questionText || questionKey;
    };

    const pdfDoc = await PDFDocument.create();
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

    const PAGE_WIDTH = 612;
    const PAGE_HEIGHT = 792;
    const MARGIN = 50;
    const LINE_HEIGHT = 16;

    let page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    let y = PAGE_HEIGHT - MARGIN;

    const checkNewPage = () => {
      if (y < MARGIN + LINE_HEIGHT * 2) {
        page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
        y = PAGE_HEIGHT - MARGIN;
      }
    };

    const drawLine = (
      text: string,
      x: number,
      size: number,
      font: typeof fontBold,
      color = rgb(0, 0, 0),
    ) => {
      checkNewPage();
      page.drawText(sanitize(text), { x, y, size, font, color });
      y -= LINE_HEIGHT;
    };

    const drawWrapped = (
      text: string,
      x: number,
      size: number,
      font: typeof fontRegular,
      color = rgb(0, 0, 0),
    ) => {
      const sanitized = sanitize(text);
      const maxWidth = PAGE_WIDTH - x - MARGIN;
      const words = sanitized.split(" ");
      let line = "";
      for (const word of words) {
        const test = line ? `${line} ${word}` : word;
        if (font.widthOfTextAtSize(test, size) > maxWidth) {
          checkNewPage();
          page.drawText(line, { x, y, size, font, color });
          y -= LINE_HEIGHT;
          line = word;
        } else {
          line = test;
        }
      }
      if (line) {
        checkNewPage();
        page.drawText(line, { x, y, size, font, color });
        y -= LINE_HEIGHT;
      }
    };

    drawLine("Student Assessment Answers", MARGIN, 18, fontBold);
    y -= 8;

    drawLine("Student Information", MARGIN, 13, fontBold, rgb(0.1, 0.1, 0.5));
    y -= 4;
    for (const [label, value] of [
      ["Name:", currentUser?.name || currentUser?.email || "Not specified"],
      ["Email:", currentUser?.email || "Not specified"],
      ["Preferred Course:", currentUser?.preferredCourse || "Not specified"],
      ["Date:", new Date(timestamp).toLocaleDateString()],
    ] as [string, string][]) {
      checkNewPage();
      page.drawText(sanitize(label), {
        x: MARGIN + 20,
        y,
        size: 11,
        font: fontBold,
        color: rgb(0, 0, 0),
      });
      page.drawText(sanitize(value), {
        x: MARGIN + 140,
        y,
        size: 11,
        font: fontRegular,
        color: rgb(0, 0, 0),
      });
      y -= LINE_HEIGHT;
    }

    y -= 10;
    page.drawLine({
      start: { x: MARGIN, y },
      end: { x: PAGE_WIDTH - MARGIN, y },
      thickness: 1,
      color: rgb(0.7, 0.7, 0.7),
    });
    y -= 20;

    const sectionOrder: (keyof AssessmentAnswers)[] = [
      "foundationalAssessment",
      "academicAptitude",
      "technicalSkills",
      "careerInterest",
      "learningWorkStyle",
    ];

    const likertLabels: AnswerLabels = {
      1: "Strongly Agree",
      2: "Agree",
      3: "Neutral",
      4: "Disagree",
      5: "Strongly Disagree",
    };

    for (const sectionKey of sectionOrder) {
      const sectionData = formData[sectionKey];
      if (!sectionData || Object.keys(sectionData).length === 0) continue;

      drawLine(
        categoryTitles[sectionKey] || sectionKey,
        MARGIN,
        13,
        fontBold,
        rgb(0.1, 0.1, 0.5),
      );
      y -= 4;

      let num = 1;
      for (const [questionKey, answer] of Object.entries(sectionData)) {
        if (
          (sectionKey === "technicalSkills" ||
            sectionKey === "learningWorkStyle") &&
          answer !== true
        )
          continue;

        const questionText = getQuestionText(sectionKey, questionKey);
        let answerText = "";

        if (sectionKey === "foundationalAssessment") {
          answerText = String(answer || "Not answered");
        } else if (
          sectionKey === "technicalSkills" ||
          sectionKey === "learningWorkStyle"
        ) {
          answerText = "Selected";
        } else {
          const n = Number(answer);
          answerText =
            !isNaN(n) && n >= 1 && n <= 5
              ? likertLabels[n]
              : `Rating: ${answer}`;
        }

        checkNewPage();
        page.drawText(`${num}.`, {
          x: MARGIN + 20,
          y,
          size: 10,
          font: fontBold,
          color: rgb(0, 0, 0),
        });
        drawWrapped(questionText, MARGIN + 40, 10, fontRegular);
        drawLine(
          `Answer: ${answerText}`,
          MARGIN + 40,
          10,
          fontRegular,
          sectionKey === "technicalSkills" || sectionKey === "learningWorkStyle"
            ? rgb(0.13, 0.77, 0.37)
            : rgb(0.15, 0.39, 0.92),
        );
        y -= 4;
        num++;
      }
      y -= 16;
    }

    const pdfBytes = await pdfDoc.save();
    return new Blob([pdfBytes.buffer as ArrayBuffer], {
      type: "application/pdf",
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    toast.error("Failed to generate document. Please try again.", {
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
    throw error;
  }
};

export const saveAnswersAsDocument = async (params: SaveAnswersParams): Promise<void> => {
  try {
    const blob = await generateAssessmentDocument(params);
    const timestamp = new Date().toISOString();
    const studentName = sanitize(params.currentUser?.name || "student");
    saveAs(
      blob,
      `assessment-${studentName}-${timestamp.split("T")[0]}.pdf`,
    );

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
    // Error is already handled/toasted in generateAssessmentDocument
  }
};