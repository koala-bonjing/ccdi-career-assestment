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
  lightBg: hex(240, 248, 255),
  rowAlt: hex(248, 249, 255),
  grey: hex(102, 102, 102),
  lightGrey: hex(200, 200, 200),
  white: rgb(1, 1, 1),
  black: rgb(0, 0, 0),
  bodyText: hex(44, 62, 80),
};

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

const PAGE_W = 595;
const PAGE_H = 842;
const MARGIN = 45;
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

  const words = text.replace(/\n/g, " ").split(" ");
  let line = "";

  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (font.widthOfTextAtSize(test, size) > maxWidth && line) {
      currentPage(ctx).drawText(line, { x, y: ctx.y, size, font, color });
      advance(ctx, lineHeight);
      line = word;
    } else {
      line = test;
    }
  }
  if (line) {
    currentPage(ctx).drawText(line, { x, y: ctx.y, size, font, color });
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

  let drawX = x;
  if (align === "center")
    drawX = (PAGE_W - font.widthOfTextAtSize(text, size)) / 2;
  if (align === "right")
    drawX = PAGE_W - MARGIN - font.widthOfTextAtSize(text, size);

  currentPage(ctx).drawText(text, { x: drawX, y: ctx.y, size, font, color });
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
}

const drawTable = (ctx: Ctx, cols: ColDef[], rows: RowData[]): void => {
  const ROW_H = 20;
  const PAD = 5;
  const totalH = ROW_H * (rows.length + 1);

  if (ctx.y - totalH < MARGIN + 24) newPage(ctx);

  const startY = ctx.y;
  const colWidths = cols.map((c) => c.width * CONTENT_W);

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
    const tw = ctx.bold.widthOfTextAtSize(col.header, 9);
    const tx = col.align === "center" ? xc + (cw - tw) / 2 : xc + PAD;
    currentPage(ctx).drawText(col.header, {
      x: tx,
      y: startY - ROW_H + PAD + 2,
      size: 9,
      font: ctx.bold,
      color: C.white,
    });
    xc += cw;
  });

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

    let xr = MARGIN;
    cols.forEach((col, ci) => {
      const cw = colWidths[ci];
      const text = row.cells[ci] ?? "";
      const fnt = row.highlight ? ctx.bold : ctx.reg;
      const clr = row.highlight ? C.red : C.bodyText;
      const tw = fnt.widthOfTextAtSize(text, 9);
      const tx = col.align === "center" ? xr + (cw - tw) / 2 : xr + PAD;
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

  currentPage(ctx).drawRectangle({
    x: MARGIN,
    y: startY - totalH,
    width: CONTENT_W,
    height: totalH,
    borderColor: C.lightGrey,
    borderWidth: 0.5,
  });

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

    currentPage(ctx).drawRectangle({
      x: 0,
      y: PAGE_H - 52,
      width: PAGE_W,
      height: 52,
      color: C.darkBlue,
    });

    const title = "CCDI AUTOMATED CAREER ASSESSMENT";
    currentPage(ctx).drawText(title, {
      x: (PAGE_W - bold.widthOfTextAtSize(title, 18)) / 2,
      y: PAGE_H - 26,
      size: 18,
      font: bold,
      color: C.white,
    });

    const sub = "ASSESSMENT RESULTS REPORT";
    currentPage(ctx).drawText(sub, {
      x: (PAGE_W - reg.widthOfTextAtSize(sub, 11)) / 2,
      y: PAGE_H - 42,
      size: 11,
      font: reg,
      color: hex(180, 200, 255),
    });

    ctx.y = PAGE_H - 52 - 20;

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

    sectionHeading(ctx, "ASSESSMENT SUMMARY");
    drawWrapped(
      ctx,
      result.summary ||
        "Based on your comprehensive assessment, here are your personalized results and program recommendations.",
      { size: 10, lineHeight: LINE_SM },
    );
    advance(ctx, 10);

    sectionHeading(ctx, "RECOMMENDED PROGRAM");

    const BOX_H = 48;
    if (ctx.y - BOX_H < MARGIN + 24) newPage(ctx);

    currentPage(ctx).drawRectangle({
      x: MARGIN,
      y: ctx.y - BOX_H,
      width: CONTENT_W,
      height: BOX_H,
      color: C.red,
    });

    const prog = result.recommendedProgram;
    const progSize = Math.min(
      18,
      Math.max(11, 18 - Math.max(0, prog.length - 30) * 0.2),
    );
    currentPage(ctx).drawText(prog, {
      x: (PAGE_W - bold.widthOfTextAtSize(prog, progSize)) / 2,
      y: ctx.y - 20,
      size: progSize,
      font: bold,
      color: C.white,
    });

    const tagline =
      "Best match based on your skills, interests, and learning style";
    currentPage(ctx).drawText(tagline, {
      x: (PAGE_W - italic.widthOfTextAtSize(tagline, 8)) / 2,
      y: ctx.y - 36,
      size: 8,
      font: italic,
      color: hex(240, 200, 200),
    });

    ctx.y -= BOX_H;
    advance(ctx, 14);

    sectionHeading(ctx, "DETAILED EVALUATION");
    drawWrapped(ctx, result.evaluation, { size: 10, lineHeight: LINE_SM });
    advance(ctx, 10);

    sectionHeading(ctx, "PERSONALIZED RECOMMENDATIONS");
    drawWrapped(ctx, result.detailedEvaluation, {
      size: 10,
      lineHeight: LINE_SM,
    });
    advance(ctx, 10);

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

    if (result.percent) {
      sectionHeading(ctx, "PROGRAM COMPATIBILITY ANALYSIS");
      const sortedPercents = Object.entries(result.percent).sort(
        (a, b) => b[1] - a[1]
      );
      const compRows: RowData[] = sortedPercents.map(
        ([p, pct], i) => ({
          cells: [p, `${pct}%`, getCompatibilityText(pct)],
          highlight: p === result.recommendedProgram,
          shade: p !== result.recommendedProgram && i % 2 === 1,
        }),
      );
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

    if (result.preparationNeeded && result.preparationNeeded.length > 0) {
      sectionHeading(ctx, "PREPARATION RECOMMENDATIONS");
      for (const item of result.preparationNeeded) {
        drawWrapped(ctx, `\u2022  ${item}`, {
          x: MARGIN + 6,
          size: 10,
          lineHeight: LINE_SM,
          maxWidth: CONTENT_W - 6,
        });
      }
      advance(ctx, 10);
    }

    if (result.successRoadmap) {
      sectionHeading(ctx, "YOUR SUCCESS ROADMAP");
      drawWrapped(ctx, result.successRoadmap, {
        size: 10,
        lineHeight: LINE_SM,
      });
      advance(ctx, 10);
    }

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
  } catch (error) {
    // Error already handled in generateResultsDocument
  }
};

export const useResultsPDF = () => ({
  saveAsPDF: saveResultsAsPDF,
});
