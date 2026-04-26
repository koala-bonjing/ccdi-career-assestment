import { PDFDocument, rgb, StandardFonts, type RGB } from "pdf-lib";
import { saveAs } from "file-saver";
import { toast } from "react-toastify";
import type { User, AssessmentResult } from "../types";

const hex = (r: number, g: number, b: number): RGB =>
  rgb(r / 255, g / 255, b / 255);

const C = {
  black: rgb(0, 0, 0),
  darkGrey: hex(60, 60, 60),
  grey: hex(120, 120, 120),
  lightGrey: hex(200, 200, 200),
  white: rgb(1, 1, 1),
  line: hex(180, 180, 180),
};

const sanitizeText = (text: string): string => {
  if (!text) return "";
  return text
    .replace(/[\u20B1]/g, "PHP ")
    .replace(/[\u00A3]/g, "GBP ")
    .replace(/[\u00A5]/g, "JPY ")
    .replace(/[\u20AC]/g, "EUR ")
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2013\u2014]/g, "-")
    .replace(/[\u2026]/g, "...");
};

const getLabel = (
  score: number,
  type: "category" | "compat" | "found" | "sub",
): string => {
  if (type === "category") {
    if (score >= 85) return "Excellent";
    if (score >= 70) return "Strong";
    if (score >= 55) return "Developing";
    return "Needs Development";
  }
  if (type === "compat") {
    if (score >= 80) return "Excellent Match";
    if (score >= 60) return "Strong";
    if (score >= 40) return "Moderate";
    return "Limited";
  }
  if (type === "found") {
    if (score >= 80) return "Strong";
    if (score >= 60) return "Moderate";
    if (score >= 40) return "Developing";
    return "Needs Improvement";
  }
  if (score >= 4) return "Excellent";
  if (score >= 3) return "Good";
  return "Needs Work";
};

// ── Layout ──────────────────────────────────────────────────────────
const PAGE_W = 612; // 8.5 inches = 215.9mm
const PAGE_H = 1008;
const MARGIN = 50;
const CONTENT_W = PAGE_W - MARGIN * 2;
const LINE_H = 13;

type EmbeddedFont = Awaited<ReturnType<PDFDocument["embedFont"]>>;

interface Ctx {
  doc: PDFDocument;
  page: ReturnType<PDFDocument["addPage"]>;
  bold: EmbeddedFont;
  reg: EmbeddedFont;
  y: number;
}

const drawLine = (
  ctx: Ctx,
  text: string,
  opts: { size?: number; font?: EmbeddedFont; indent?: number } = {},
): void => {
  const { size = 10, font = ctx.reg, indent = 0 } = opts;
  ctx.page.drawText(sanitizeText(text), {
    x: MARGIN + indent,
    y: ctx.y,
    size,
    font,
    color: C.black,
  });
  ctx.y -= LINE_H + 2;
};

const drawWrapped = (ctx: Ctx, text: string, size = 10): void => {
  const words = sanitizeText(text).replace(/\n/g, " ").split(" ");
  let line = "";
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.reg.widthOfTextAtSize(test, size) > CONTENT_W && line) {
      ctx.page.drawText(line, {
        x: MARGIN,
        y: ctx.y,
        size,
        font: ctx.reg,
        color: C.black,
      });
      ctx.y -= LINE_H;
      line = word;
    } else {
      line = test;
    }
  }
  if (line) {
    ctx.page.drawText(line, {
      x: MARGIN,
      y: ctx.y,
      size,
      font: ctx.reg,
      color: C.black,
    });
    ctx.y -= LINE_H;
  }
};

const sectionTitle = (ctx: Ctx, title: string): void => {
  ctx.y -= 6;
  drawLine(ctx, title, { size: 11, font: ctx.bold });
  ctx.page.drawLine({
    start: { x: MARGIN, y: ctx.y + 4 },
    end: { x: PAGE_W - MARGIN, y: ctx.y + 4 },
    thickness: 0.5,
    color: C.line,
  });
  ctx.y -= 6;
};

const drawBar = (ctx: Ctx, label: string, score: number, max: number): void => {
  const barW = 180;
  const barH = 6;
  const filled = Math.round((score / max) * barW);
  ctx.page.drawText(sanitizeText(label), {
    x: MARGIN,
    y: ctx.y,
    size: 9,
    font: ctx.reg,
    color: C.black,
  });
  ctx.page.drawRectangle({
    x: MARGIN + 180,
    y: ctx.y - barH,
    width: barW,
    height: barH,
    color: C.lightGrey,
    borderColor: C.grey,
    borderWidth: 0.3,
  });
  if (filled > 0)
    ctx.page.drawRectangle({
      x: MARGIN + 180,
      y: ctx.y - barH,
      width: filled,
      height: barH,
      color: C.darkGrey,
    });
  ctx.page.drawText(`${score}/${max}`, {
    x: MARGIN + 180 + barW + 8,
    y: ctx.y - 1,
    size: 9,
    font: ctx.bold,
    color: C.black,
  });
  ctx.y -= 16;
};

const drawTableRow = (
  ctx: Ctx,
  cells: string[],
  widths: number[],
  bold: boolean = false,
): void => {
  const rowH = 16;
  let x = MARGIN + 2;
  cells.forEach((cell, i) => {
    ctx.page.drawText(sanitizeText(cell), {
      x,
      y: ctx.y - 10,
      size: 9,
      font: bold ? ctx.bold : ctx.reg,
      color: C.black,
    });
    x += widths[i] * CONTENT_W;
  });
  ctx.y -= rowH;
  ctx.page.drawLine({
    start: { x: MARGIN, y: ctx.y + 2 },
    end: { x: PAGE_W - MARGIN, y: ctx.y + 2 },
    thickness: 0.3,
    color: C.lightGrey,
  });
};

// ── Main generator ──────────────────────────────────────────────────
export const generateResultsDocument = async (
  result: AssessmentResult,
  user: User,
): Promise<Blob> => {
  try {
    const doc = await PDFDocument.create();
    const bold = await doc.embedFont(StandardFonts.HelveticaBold);
    const reg = await doc.embedFont(StandardFonts.Helvetica);
    const page = doc.addPage([PAGE_W, PAGE_H]);
    const ctx: Ctx = { doc, page, bold, reg, y: PAGE_H - MARGIN };

    // ── Title ───────────────────────────────────────────────────────
    drawLine(ctx, "CCDI Career Assessment Results", {
      size: 14,
      font: ctx.bold,
    });
    const dateStr = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    drawLine(ctx, `Generated: ${dateStr}`, { size: 8 });
    ctx.y -= 4;

    // ── Student Info ────────────────────────────────────────────────
    sectionTitle(ctx, "STUDENT INFORMATION");
    drawLine(ctx, `Name: ${user.fullName || user.name || "—"}`);
    drawLine(ctx, `Email: ${user.email || "—"}`);
    drawLine(ctx, `Preferred Course: ${user.preferredCourse || "—"}`);
    if (user.address) drawLine(ctx, `Address: ${user.address}`);
    if (user.school) drawLine(ctx, `School: ${user.school}`);
    ctx.y -= 4;

    // ── Summary ─────────────────────────────────────────────────────
    sectionTitle(ctx, "RESULT SUMMARY");
    drawWrapped(ctx, result.summary || "No summary available.");
    ctx.y -= 2;

    // ── Recommended Program ─────────────────────────────────────────
    sectionTitle(ctx, "RECOMMENDED PROGRAM");
    drawLine(ctx, sanitizeText(result.recommendedProgram), {
      size: 12,
      font: ctx.bold,
      indent: 4,
    });
    ctx.y -= 4;

    // ── Evaluation ──────────────────────────────────────────────────
    sectionTitle(ctx, "EVALUATION");
    drawWrapped(ctx, result.evaluation || "No evaluation available.");
    ctx.y -= 2;

    // ── Category Scores ─────────────────────────────────────────────
    if (result.categoryScores) {
      sectionTitle(ctx, "CATEGORY SCORES");
      drawTableRow(
        ctx,
        ["Category", "Score", "Rating"],
        [0.45, 0.2, 0.35],
        true,
      );
      const cats: [string, number][] = [
        ["Academic Aptitude", Number(result.categoryScores.academic) || 0],
        ["Technical Skills", Number(result.categoryScores.technical) || 0],
        ["Career Interest", Number(result.categoryScores.career) || 0],
        [
          "Logistics & Work Style",
          Number(result.categoryScores.logistics) || 0,
        ],
      ];
      cats.forEach(([name, score]) => {
        drawTableRow(
          ctx,
          [name, `${score}%`, getLabel(score, "category")],
          [0.45, 0.2, 0.35],
        );
      });
      ctx.y -= 4;
    }

    // ── Program Compatibility ───────────────────────────────────────
    if (result.percent) {
      sectionTitle(ctx, "PROGRAM COMPATIBILITY");
      drawTableRow(
        ctx,
        ["Program", "Match", "Assessment"],
        [0.45, 0.2, 0.35],
        true,
      );
      Object.entries(result.percent)
        .sort((a, b) => b[1] - a[1])
        .forEach(([p, pct]) => {
          drawTableRow(
            ctx,
            [sanitizeText(p), `${pct}%`, getLabel(pct, "compat")],
            [0.45, 0.2, 0.35],
          );
        });
      ctx.y -= 4;
    }

    // ── Foundational Assessment ─────────────────────────────────────
    if (result.foundationalScore !== undefined || result.prereqAnalysis) {
      sectionTitle(ctx, "FOUNDATIONAL READINESS");
      drawLine(
        ctx,
        `Overall Score: ${result.foundationalScore ?? 0}% — ${getLabel(result.foundationalScore ?? 0, "found")}`,
        { size: 10, font: ctx.bold },
      );
      ctx.y -= 2;

      if (result.prereqAnalysis) {
        const pa = result.prereqAnalysis;
        drawBar(ctx, "Basic Knowledge", pa.prerequisites, 5);
        drawBar(ctx, "Study Habits", pa.studyHabits, 5);
        drawBar(ctx, "Problem Solving", pa.problemSolving, 5);
        drawLine(
          ctx,
          `Overall Readiness: ${pa.overallScore}/5 — ${getLabel(pa.overallScore, "sub")}`,
          { size: 9, font: ctx.bold },
        );
        ctx.y -= 2;

        if (pa.warnings?.length) {
          drawLine(ctx, "Areas to Improve:", { size: 9, font: ctx.bold });
          pa.warnings.forEach((w) =>
            drawLine(ctx, `- ${w}`, { size: 9, indent: 8 }),
          );
          ctx.y -= 2;
        }
      }
    }

    // ── Preparation & Roadmap (side by side) ───────────────────────────
    if (result.preparationNeeded?.length || result.successRoadmap) {
      sectionTitle(ctx, "PREPARATION & NEXT STEPS");

      const leftX = MARGIN;
      const rightX = MARGIN + CONTENT_W / 2 + 10;
      const colW = CONTENT_W / 2 - 15;
      const startY = ctx.y;

      // Left column - Preparation
      if (result.preparationNeeded?.length) {
        ctx.y = startY;
        drawLine(ctx, "Preparation Recommendations:", {
          size: 9,
          font: ctx.bold,
        });
        ctx.y -= 4;
        result.preparationNeeded.forEach((item) => {
          // Simple wrapped text in left column
          const words = sanitizeText(item).split(" ");
          let line = "";
          for (const word of words) {
            const test = line ? `${line} ${word}` : `- ${word}`;
            if (ctx.reg.widthOfTextAtSize(test, 9) > colW && line) {
              ctx.page.drawText(line, {
                x: leftX + 4,
                y: ctx.y,
                size: 9,
                font: ctx.reg,
                color: C.black,
              });
              ctx.y -= LINE_H;
              line = `- ${word}`;
            } else if (!line) {
              line = `- ${word}`;
            } else {
              line = test;
            }
          }
          if (line) {
            ctx.page.drawText(line, {
              x: leftX + 4,
              y: ctx.y,
              size: 9,
              font: ctx.reg,
              color: C.black,
            });
            ctx.y -= LINE_H;
          }
          ctx.y -= 2;
        });
      }

      // Right column - Roadmap
      if (result.successRoadmap) {
        ctx.y = startY;
        ctx.page.drawText("Success Roadmap:", {
          x: rightX,
          y: ctx.y,
          size: 9,
          font: ctx.bold,
          color: C.black,
        });
        ctx.y -= LINE_H + 4;

        const words = sanitizeText(result.successRoadmap)
          .replace(/\n/g, " ")
          .split(" ");
        let line = "";
        for (const word of words) {
          const test = line ? `${line} ${word}` : word;
          if (ctx.reg.widthOfTextAtSize(test, 9) > colW && line) {
            ctx.page.drawText(line, {
              x: rightX,
              y: ctx.y,
              size: 9,
              font: ctx.reg,
              color: C.black,
            });
            ctx.y -= LINE_H;
            line = word;
          } else {
            line = test;
          }
        }
        if (line) {
          ctx.page.drawText(line, {
            x: rightX,
            y: ctx.y,
            size: 9,
            font: ctx.reg,
            color: C.black,
          });
          ctx.y -= LINE_H;
        }
      }

      // Set y to the lowest point of both columns
      ctx.y -= 8;
    }

    // ── Footer ──────────────────────────────────────────────────────
    ctx.page.drawLine({
      start: { x: MARGIN, y: 30 },
      end: { x: PAGE_W - MARGIN, y: 30 },
      thickness: 0.5,
      color: C.line,
    });
    ctx.page.drawText("CCDI Automated Career Assessment System", {
      x: MARGIN,
      y: 16,
      size: 7,
      font: ctx.reg,
      color: C.grey,
    });
    ctx.page.drawText(dateStr, {
      x: PAGE_W - MARGIN - 120,
      y: 16,
      size: 7,
      font: ctx.reg,
      color: C.grey,
    });

    const pdfBytes = await doc.save();
    return new Blob([pdfBytes.buffer as ArrayBuffer], {
      type: "application/pdf",
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    toast.error("Failed to generate PDF", {
      position: "top-right",
      autoClose: 3000,
    });
    throw error;
  }
};

export const saveResultsAsPDF = async (
  result: AssessmentResult,
  user: User,
): Promise<void> => {
  try {
    const blob = await generateResultsDocument(result, user);
    const safeName = (user.name || user.fullName || "Student").replace(
      /[^a-zA-Z0-9]/g,
      "_",
    );
    saveAs(blob, `CCDI_Assessment_${safeName}.pdf`);
    toast.success("PDF saved!", { position: "top-right", autoClose: 3000 });
  } catch {
    toast.error("Failed to save PDF", {
      position: "top-right",
      autoClose: 5000,
    });
  }
};

export const useResultsPDF = () => ({ saveAsPDF: saveResultsAsPDF });
