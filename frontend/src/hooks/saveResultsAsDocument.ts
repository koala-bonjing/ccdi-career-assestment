import { PDFDocument, rgb, StandardFonts, type RGB } from "pdf-lib";
import { saveAs } from "file-saver";
import { Bounce, toast } from "react-toastify";
import type { User, AssessmentResult } from "../types";

const hex = (r: number, g: number, b: number): RGB =>
  rgb(r / 255, g / 255, b / 255);

const C = {
  darkBlue: hex(43, 49, 118),
  midBlue: hex(28, 108, 179),
  red: hex(164, 29, 49),
  green: hex(25, 135, 84),
  orange: hex(253, 126, 20),
  lightBg: hex(240, 248, 255),
  rowAlt: hex(248, 249, 255),
  grey: hex(102, 102, 102),
  lightGrey: hex(200, 200, 200),
  white: rgb(1, 1, 1),
  black: rgb(0, 0, 0),
  bodyText: hex(44, 62, 80),
};

// ── text sanitization helper ──────────────────────────────────────────────────
const sanitizeText = (text: string): string => {
  if (!text) return "";
  return text
    .replace(/[\u20B1]/g, "PHP ") // Peso symbol to "PHP"
    .replace(/[\u00A3]/g, "GBP ") // Pound symbol to "GBP"
    .replace(/[\u00A5]/g, "JPY ") // Yen symbol to "JPY"
    .replace(/[\u20AC]/g, "EUR ") // Euro symbol to "EUR"
    .replace(/[\u0024]/g, "$") // Dollar symbol (keep as is, but ensure ASCII)
    .replace(/[\u26A0\u26A1]/g, "[!]") // Warning symbols
    .replace(/[\u2022\u25E6\u2023]/g, "-") // Bullet points
    .replace(/[\u2018\u2019]/g, "'") // Smart single quotes
    .replace(/[\u201C\u201D]/g, '"') // Smart double quotes
    .replace(/[\u2013\u2014]/g, "-") // En/Em dashes
    .replace(/[\u00A9]/g, "(c)") // Copyright symbol
    .replace(/[\u00AE]/g, "(r)") // Registered trademark
    .replace(/[\u2122]/g, "(tm)") // Trademark
    .replace(/[\u2026]/g, "..."); // Ellipsis
  // .replace(/[^\x00-\x7F\s]/g, "");        // Remove any other non-ASCII characters
};

// ── helpers ───────────────────────────────────────────────────────────────────

const getCategoryAssessment = (score: number): string => {
  if (score >= 85) return "Excellent";
  if (score >= 70) return "Strong";
  if (score >= 55) return "Developing";
  if (score >= 40) return "Emerging";
  return "Needs Development";
};

const getCompatibilityText = (pct: number): string => {
  if (pct >= 80) return "Excellent Match";
  if (pct >= 60) return "Strong Compatibility";
  if (pct >= 40) return "Moderate Alignment";
  if (pct >= 20) return "Some Relevance";
  return "Limited Compatibility";
};

const getFoundationalLabel = (score: number): string => {
  if (score >= 80) return "Strong Readiness";
  if (score >= 60) return "Moderate Readiness";
  if (score >= 40) return "Developing Readiness";
  return "Needs Improvement";
};

const getSubScoreLabel = (score: number): string => {
  if (score >= 4) return "Excellent";
  if (score >= 3) return "Good";
  if (score >= 2) return "Fair";
  return "Needs Work";
};

// ── PDF layout constants ──────────────────────────────────────────────────────

// A4 dimensions in points: 595.28 x 841.89
const PAGE_W = 595.28;
const PAGE_H = 841.89;
const MARGIN = 50;
const CONTENT_W = PAGE_W - MARGIN * 2;
const LINE_SM = 14;
const LINE_MD = 17;

type EmbeddedFont = Awaited<ReturnType<PDFDocument["embedFont"]>>;

interface Ctx {
  doc: PDFDocument;
  pages: ReturnType<PDFDocument["addPage"]>[];
  bold: EmbeddedFont;
  reg: EmbeddedFont;
  italic: EmbeddedFont;
  y: number;
  pageIdx: number;
}

const currentPage = (ctx: Ctx) => ctx.pages[ctx.pageIdx];

const newPage = (ctx: Ctx): void => {
  ctx.pages.push(ctx.doc.addPage([PAGE_W, PAGE_H]));
  ctx.pageIdx++;
  ctx.y = PAGE_H - MARGIN;
};

const advance = (ctx: Ctx, amount: number): void => {
  ctx.y -= amount;
  if (ctx.y < MARGIN + 24) newPage(ctx);
};

const drawWrapped = (
  ctx: Ctx,
  text: string,
  opts: {
    x?: number;
    size?: number;
    font?: EmbeddedFont;
    color?: RGB;
    lineHeight?: number;
    maxWidth?: number;
  } = {},
): void => {
  const {
    x = MARGIN,
    size = 10,
    font = ctx.reg,
    color = C.bodyText,
    lineHeight = LINE_SM,
    maxWidth = CONTENT_W,
  } = opts;

  // Sanitize the input text
  const sanitizedText = sanitizeText(text);
  const words = sanitizedText.replace(/\n/g, " ").split(" ");
  let line = "";

  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    const testWidth = font.widthOfTextAtSize(test, size);

    if (testWidth > maxWidth && line) {
      currentPage(ctx).drawText(line, {
        x,
        y: ctx.y,
        size,
        font,
        color,
      });
      advance(ctx, lineHeight);
      line = word;
    } else {
      line = test;
    }
  }
  if (line) {
    currentPage(ctx).drawText(line, {
      x,
      y: ctx.y,
      size,
      font,
      color,
    });
    advance(ctx, lineHeight);
  }
};

const drawLine = (
  ctx: Ctx,
  text: string,
  opts: {
    x?: number;
    size?: number;
    font?: EmbeddedFont;
    color?: RGB;
    lineHeight?: number;
    align?: "left" | "center" | "right";
  } = {},
): void => {
  const {
    x = MARGIN,
    size = 10,
    font = ctx.reg,
    color = C.bodyText,
    lineHeight = LINE_SM,
    align = "left",
  } = opts;

  // Sanitize the input text
  const sanitizedText = sanitizeText(text);

  let drawX = x;
  if (align === "center")
    drawX = (PAGE_W - font.widthOfTextAtSize(sanitizedText, size)) / 2;
  if (align === "right")
    drawX = PAGE_W - MARGIN - font.widthOfTextAtSize(sanitizedText, size);

  currentPage(ctx).drawText(sanitizedText, {
    x: drawX,
    y: ctx.y,
    size,
    font,
    color,
  });
  advance(ctx, lineHeight);
};

const sectionHeading = (ctx: Ctx, title: string): void => {
  advance(ctx, 6);
  drawLine(ctx, title, {
    size: 13,
    font: ctx.bold,
    color: C.darkBlue,
    lineHeight: LINE_MD,
  });
  currentPage(ctx).drawLine({
    start: { x: MARGIN, y: ctx.y + 2 },
    end: { x: PAGE_W - MARGIN, y: ctx.y + 2 },
    thickness: 0.6,
    color: C.midBlue,
  });
  advance(ctx, 8);
};

interface ColDef {
  header: string;
  width: number;
  align?: "left" | "center";
}
interface RowData {
  cells: string[];
  highlight?: boolean;
  shade?: boolean;
  accentColor?: RGB;
}

const drawTable = (ctx: Ctx, cols: ColDef[], rows: RowData[]): void => {
  const ROW_H = 20;
  const PAD = 5;
  const totalH = ROW_H * (rows.length + 1);

  if (ctx.y - totalH < MARGIN + 24) newPage(ctx);

  const startY = ctx.y;
  const colWidths = cols.map((c) => c.width * CONTENT_W);

  // header row
  currentPage(ctx).drawRectangle({
    x: MARGIN,
    y: startY - ROW_H,
    width: CONTENT_W,
    height: ROW_H,
    color: C.darkBlue,
  });

  let xc = MARGIN;
  cols.forEach((col, ci) => {
    const cw = colWidths[ci];
    const sanitizedHeader = sanitizeText(col.header);
    const tw = ctx.bold.widthOfTextAtSize(sanitizedHeader, 9);
    const tx = col.align === "center" ? xc + (cw - tw) / 2 : xc + PAD;
    currentPage(ctx).drawText(sanitizedHeader, {
      x: tx,
      y: startY - ROW_H + PAD + 2,
      size: 9,
      font: ctx.bold,
      color: C.white,
    });
    xc += cw;
  });

  // data rows
  rows.forEach((row, ri) => {
    const rowY = startY - ROW_H * (ri + 2);
    const bgColor = row.highlight
      ? hex(255, 240, 240)
      : row.shade
        ? C.rowAlt
        : C.white;

    currentPage(ctx).drawRectangle({
      x: MARGIN,
      y: rowY,
      width: CONTENT_W,
      height: ROW_H,
      color: bgColor,
    });

    // optional left accent stripe
    if (row.accentColor) {
      currentPage(ctx).drawRectangle({
        x: MARGIN,
        y: rowY,
        width: 3,
        height: ROW_H,
        color: row.accentColor,
      });
    }

    let xr = MARGIN;
    cols.forEach((col, ci) => {
      const cw = colWidths[ci];
      const rawText = row.cells[ci] ?? "";
      const text = sanitizeText(rawText);
      const fnt = row.highlight ? ctx.bold : ctx.reg;
      const clr = row.highlight ? C.red : C.bodyText;
      const tw = fnt.widthOfTextAtSize(text, 9);
      const tx =
        col.align === "center"
          ? xr + (cw - tw) / 2
          : xr + PAD + (ci === 0 && row.accentColor ? 4 : 0);
      currentPage(ctx).drawText(text, {
        x: tx,
        y: rowY + PAD + 2,
        size: 9,
        font: fnt,
        color: clr,
      });
      xr += cw;
    });
  });

  // outer border
  currentPage(ctx).drawRectangle({
    x: MARGIN,
    y: startY - totalH,
    width: CONTENT_W,
    height: totalH,
    borderColor: C.lightGrey,
    borderWidth: 0.5,
  });

  // horizontal dividers
  for (let r = 0; r <= rows.length; r++) {
    const ry = startY - ROW_H * (r + 1);
    currentPage(ctx).drawLine({
      start: { x: MARGIN, y: ry },
      end: { x: PAGE_W - MARGIN, y: ry },
      thickness: 0.3,
      color: C.lightGrey,
    });
  }

  ctx.y = startY - totalH - 4;
};

// ── score bar (used for foundational sub-scores) ──────────────────────────────

const drawScoreBar = (
  ctx: Ctx,
  label: string,
  score: number,
  maxScore: number,
  barColor: RGB,
): void => {
  const BAR_W = CONTENT_W * 0.5;
  const BAR_H = 10;
  const LABEL_W = CONTENT_W * 0.35;
  const filled = Math.round((score / maxScore) * BAR_W);

  if (ctx.y - 20 < MARGIN + 24) newPage(ctx);

  // label
  currentPage(ctx).drawText(sanitizeText(label), {
    x: MARGIN,
    y: ctx.y - 2,
    size: 9,
    font: ctx.reg,
    color: C.bodyText,
  });

  // track
  currentPage(ctx).drawRectangle({
    x: MARGIN + LABEL_W,
    y: ctx.y - BAR_H,
    width: BAR_W,
    height: BAR_H,
    color: hex(230, 230, 230),
    borderColor: C.lightGrey,
    borderWidth: 0.3,
  });

  // fill
  if (filled > 0) {
    currentPage(ctx).drawRectangle({
      x: MARGIN + LABEL_W,
      y: ctx.y - BAR_H,
      width: filled,
      height: BAR_H,
      color: barColor,
    });
  }

  // score text
  const scoreText = `${score}/${maxScore}`;
  currentPage(ctx).drawText(scoreText, {
    x: MARGIN + LABEL_W + BAR_W + 6,
    y: ctx.y - 2,
    size: 9,
    font: ctx.bold,
    color: C.bodyText,
  });

  advance(ctx, 16);
};

// ── main export ───────────────────────────────────────────────────────────────

export const generateResultsDocument = async (
  result: AssessmentResult,
  user: User,
): Promise<Blob> => {
  try {
    const doc = await PDFDocument.create();
    const bold = await doc.embedFont(StandardFonts.HelveticaBold);
    const reg = await doc.embedFont(StandardFonts.Helvetica);
    const italic = await doc.embedFont(StandardFonts.HelveticaOblique);

    const ctx: Ctx = { doc, pages: [], bold, reg, italic, y: 0, pageIdx: -1 };
    newPage(ctx);

    // ── cover header ──────────────────────────────────────────────────────────
    currentPage(ctx).drawRectangle({
      x: 0,
      y: PAGE_H - 60,
      width: PAGE_W,
      height: 60,
      color: C.darkBlue,
    });

    const title = "CCDI AUTOMATED CAREER ASSESSMENT";
    currentPage(ctx).drawText(title, {
      x: (PAGE_W - bold.widthOfTextAtSize(title, 18)) / 2,
      y: PAGE_H - 28,
      size: 18,
      font: bold,
      color: C.white,
    });

    const sub = "ASSESSMENT RESULTS REPORT";
    currentPage(ctx).drawText(sub, {
      x: (PAGE_W - reg.widthOfTextAtSize(sub, 11)) / 2,
      y: PAGE_H - 46,
      size: 11,
      font: reg,
      color: hex(180, 200, 255),
    });

    ctx.y = PAGE_H - 80;

    const dateStr = `Generated: ${new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })}`;
    drawLine(ctx, dateStr, {
      size: 8,
      color: C.grey,
      align: "right",
      lineHeight: LINE_MD,
    });

    advance(ctx, 10);

    // ── student info ──────────────────────────────────────────────────────────
    sectionHeading(ctx, "STUDENT INFORMATION");
    drawTable(
      ctx,
      [
        { header: "FIELD", width: 0.3 },
        { header: "DETAILS", width: 0.7 },
      ],
      [
        { cells: ["Full Name", user.fullName || user.name || "Not specified"] },
        { cells: ["Email", user.email || "Not specified"], shade: true },
        {
          cells: ["Preferred Course", user.preferredCourse || "Not specified"],
        },
      ],
    );
    advance(ctx, 10);

    // ── summary ───────────────────────────────────────────────────────────────
    sectionHeading(ctx, "ASSESSMENT SUMMARY");
    drawWrapped(
      ctx,
      result.summary ||
        "Based on your comprehensive assessment, here are your personalized results and program recommendations.",
      { size: 10, lineHeight: LINE_SM },
    );
    advance(ctx, 10);

    // ── recommended program ───────────────────────────────────────────────────
    sectionHeading(ctx, "RECOMMENDED PROGRAM");

    const BOX_H = 50;
    if (ctx.y - BOX_H < MARGIN + 24) newPage(ctx);

    currentPage(ctx).drawRectangle({
      x: MARGIN,
      y: ctx.y - BOX_H,
      width: CONTENT_W,
      height: BOX_H,
      color: C.red,
    });

    const prog = sanitizeText(result.recommendedProgram);
    const progSize = Math.min(
      16,
      Math.max(11, 16 - Math.max(0, prog.length - 25) * 0.2),
    );
    currentPage(ctx).drawText(prog, {
      x: (PAGE_W - bold.widthOfTextAtSize(prog, progSize)) / 2,
      y: ctx.y - 22,
      size: progSize,
      font: bold,
      color: C.white,
    });

    const tagline =
      "Best match based on your skills, interests, and learning style";
    currentPage(ctx).drawText(tagline, {
      x: (PAGE_W - italic.widthOfTextAtSize(tagline, 8)) / 2,
      y: ctx.y - 38,
      size: 8,
      font: italic,
      color: hex(240, 200, 200),
    });

    ctx.y -= BOX_H;
    advance(ctx, 14);

    // ── detailed evaluation ───────────────────────────────────────────────────
    sectionHeading(ctx, "DETAILED EVALUATION");
    drawWrapped(ctx, result.evaluation, { size: 10, lineHeight: LINE_SM });
    advance(ctx, 10);

    sectionHeading(ctx, "PERSONALIZED RECOMMENDATIONS");
    drawWrapped(ctx, result.detailedEvaluation, {
      size: 10,
      lineHeight: LINE_SM,
    });
    advance(ctx, 10);

    // ── category performance ──────────────────────────────────────────────────
    if (result.categoryScores) {
      sectionHeading(ctx, "CATEGORY PERFORMANCE ANALYSIS");
      drawTable(
        ctx,
        [
          { header: "CATEGORY", width: 0.45 },
          { header: "SCORE", width: 0.2, align: "center" },
          { header: "ASSESSMENT", width: 0.35, align: "center" },
        ],
        [
          {
            cells: [
              "Academic Aptitude",
              `${result.categoryScores.academic}%`,
              getCategoryAssessment(result.categoryScores.academic),
            ],
          },
          {
            cells: [
              "Technical Skills",
              `${result.categoryScores.technical}%`,
              getCategoryAssessment(result.categoryScores.technical),
            ],
            shade: true,
          },
          {
            cells: [
              "Career Interest",
              `${result.categoryScores.career}%`,
              getCategoryAssessment(result.categoryScores.career),
            ],
          },
          {
            cells: [
              "Logistics & Work Style",
              `${result.categoryScores.logistics}%`,
              getCategoryAssessment(result.categoryScores.logistics),
            ],
            shade: true,
          },
        ],
      );
      advance(ctx, 10);
    }

    // ── program compatibility ─────────────────────────────────────────────────
    if (result.percent) {
      sectionHeading(ctx, "PROGRAM COMPATIBILITY ANALYSIS");
      const sortedPercents = Object.entries(result.percent).sort(
        (a, b) => b[1] - a[1],
      );
      const compRows: RowData[] = sortedPercents.map(([p, pct], i) => ({
        cells: [sanitizeText(p), `${pct}%`, getCompatibilityText(pct)],
        highlight: p === result.recommendedProgram,
        shade: p !== result.recommendedProgram && i % 2 === 1,
      }));
      drawTable(
        ctx,
        [
          { header: "PROGRAM", width: 0.45 },
          { header: "COMPATIBILITY", width: 0.2, align: "center" },
          { header: "ASSESSMENT", width: 0.35, align: "center" },
        ],
        compRows,
      );
      advance(ctx, 10);
    }

    // ── foundational assessment results ───────────────────────────────────────
    if (result.foundationalScore !== undefined || result.prereqAnalysis) {
      sectionHeading(ctx, "FOUNDATIONAL READINESS ASSESSMENT");

      // overall score banner
      const fScore = result.foundationalScore ?? 0;
      const fLabel = getFoundationalLabel(fScore);
      const bannerColor =
        fScore >= 80
          ? C.green
          : fScore >= 60
            ? C.midBlue
            : fScore >= 40
              ? C.orange
              : C.red;

      if (ctx.y - 32 < MARGIN + 24) newPage(ctx);

      currentPage(ctx).drawRectangle({
        x: MARGIN,
        y: ctx.y - 32,
        width: CONTENT_W,
        height: 32,
        color: bannerColor,
      });

      const overallText = `Overall Foundational Score: ${fScore}%  -  ${fLabel}`;
      currentPage(ctx).drawText(overallText, {
        x: (PAGE_W - bold.widthOfTextAtSize(overallText, 11)) / 2,
        y: ctx.y - 20,
        size: 11,
        font: bold,
        color: C.white,
      });

      ctx.y -= 32;
      advance(ctx, 12);

      // sub-category score bars
      if (result.prereqAnalysis) {
        const pa = result.prereqAnalysis;

        drawLine(ctx, "Readiness Breakdown by Category", {
          size: 10,
          font: ctx.bold,
          color: C.darkBlue,
          lineHeight: LINE_SM,
        });
        advance(ctx, 4);

        drawScoreBar(
          ctx,
          "Basic Knowledge (Prerequisites)",
          pa.prerequisites,
          5,
          C.darkBlue,
        );
        drawScoreBar(
          ctx,
          "Study Habits & Time Management",
          pa.studyHabits,
          5,
          C.midBlue,
        );
        drawScoreBar(
          ctx,
          "Problem Solving & Logic",
          pa.problemSolving,
          5,
          C.green,
        );

        advance(ctx, 4);

        // overall readiness row
        drawTable(
          ctx,
          [
            { header: "CATEGORY", width: 0.4 },
            { header: "SCORE (/5)", width: 0.2, align: "center" },
            { header: "RATING", width: 0.2, align: "center" },
            { header: "STATUS", width: 0.2, align: "center" },
          ],
          [
            {
              cells: [
                "Basic Knowledge",
                `${pa.prerequisites}/5`,
                getSubScoreLabel(pa.prerequisites),
                pa.prerequisites >= 3 ? "Ready" : "Needs Work",
              ],
              accentColor: C.darkBlue,
            },
            {
              cells: [
                "Study Habits",
                `${pa.studyHabits}/5`,
                getSubScoreLabel(pa.studyHabits),
                pa.studyHabits >= 3 ? "Ready" : "Needs Work",
              ],
              shade: true,
              accentColor: C.midBlue,
            },
            {
              cells: [
                "Problem Solving",
                `${pa.problemSolving}/5`,
                getSubScoreLabel(pa.problemSolving),
                pa.problemSolving >= 3 ? "Ready" : "Needs Work",
              ],
              accentColor: C.green,
            },
            {
              cells: [
                "Overall Readiness",
                `${pa.overallScore}/5`,
                getSubScoreLabel(pa.overallScore),
                pa.overallScore >= 3 ? "Sufficient" : "Needs Preparation",
              ],
              shade: true,
              highlight: pa.overallScore < 3,
            },
          ],
        );
        advance(ctx, 8);

        // warnings
        if (pa.warnings && pa.warnings.length > 0) {
          drawLine(ctx, "Areas Flagged for Improvement:", {
            size: 10,
            font: ctx.bold,
            color: C.red,
            lineHeight: LINE_SM,
          });
          for (const warning of pa.warnings) {
            drawWrapped(ctx, `[!]  ${warning}`, {
              x: MARGIN + 8,
              size: 9,
              font: ctx.reg,
              color: C.red,
              lineHeight: LINE_SM,
              maxWidth: CONTENT_W - 8,
            });
          }
          advance(ctx, 4);
        }

        // recommendations
        if (pa.recommendations && pa.recommendations.length > 0) {
          drawLine(ctx, "Recommended Actions:", {
            size: 10,
            font: ctx.bold,
            color: C.green,
            lineHeight: LINE_SM,
          });
          for (const rec of pa.recommendations) {
            drawWrapped(ctx, `-  ${rec}`, {
              x: MARGIN + 8,
              size: 9,
              font: ctx.reg,
              color: C.bodyText,
              lineHeight: LINE_SM,
              maxWidth: CONTENT_W - 8,
            });
          }
          advance(ctx, 4);
        }
      }

      // AI exam analysis
      if (result.examAnalysis) {
        drawLine(ctx, "AI Evaluation of Foundational Exam:", {
          size: 10,
          font: ctx.bold,
          color: C.darkBlue,
          lineHeight: LINE_SM,
        });
        drawWrapped(ctx, result.examAnalysis, {
          size: 9,
          font: ctx.italic,
          color: C.bodyText,
          lineHeight: LINE_SM,
        });
        advance(ctx, 6);
      }

      // REMOVED: wrong answers breakdown section
      // The "Questions to Review" section has been removed

      advance(ctx, 4);
    }

    // ── preparation needed ────────────────────────────────────────────────────
    if (result.preparationNeeded && result.preparationNeeded.length > 0) {
      sectionHeading(ctx, "PREPARATION RECOMMENDATIONS");
      for (const item of result.preparationNeeded) {
        drawWrapped(ctx, `-  ${item}`, {
          x: MARGIN + 6,
          size: 10,
          lineHeight: LINE_SM,
          maxWidth: CONTENT_W - 6,
        });
      }
      advance(ctx, 10);
    }

    // ── success roadmap ───────────────────────────────────────────────────────
    if (result.successRoadmap) {
      sectionHeading(ctx, "YOUR SUCCESS ROADMAP");
      drawWrapped(ctx, result.successRoadmap, {
        size: 10,
        lineHeight: LINE_SM,
      });
      advance(ctx, 10);
    }

    // ── footer on every page ──────────────────────────────────────────────────
    const totalPages = ctx.pages.length;
    ctx.pages.forEach((pg, idx) => {
      pg.drawRectangle({
        x: 0,
        y: 0,
        width: PAGE_W,
        height: 22,
        color: C.darkBlue,
      });

      const footerText = "Generated by CCDI Automated Career Assessment System";
      pg.drawText(footerText, {
        x: (PAGE_W - reg.widthOfTextAtSize(footerText, 7.5)) / 2,
        y: 9,
        size: 7.5,
        font: reg,
        color: C.white,
      });

      const pageLabel = `Page ${idx + 1} of ${totalPages}`;
      pg.drawText(pageLabel, {
        x: PAGE_W - MARGIN - reg.widthOfTextAtSize(pageLabel, 7.5),
        y: 9,
        size: 7.5,
        font: reg,
        color: hex(180, 200, 255),
      });
    });

    const pdfBytes = await doc.save();
    return new Blob([pdfBytes.buffer as ArrayBuffer], {
      type: "application/pdf",
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    toast.error("Failed to generate PDF. Please try again.", {
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

// ── save helper ───────────────────────────────────────────────────────────────

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
    saveAs(blob, `CCDI_Assessment_Results_${safeName}_${Date.now()}.pdf`);

    toast.success("PDF saved successfully!", {
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
  } catch {
    toast.error("Failed to save document. Please try again.", {
      position: "top-right",
      autoClose: 5000,
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

export const useResultsPDF = () => ({
  saveAsPDF: saveResultsAsPDF,
});
