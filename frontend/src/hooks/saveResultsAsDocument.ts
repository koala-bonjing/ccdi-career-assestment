// src/hooks/saveResultsAsDocument.ts
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  Table,
  TableCell,
  TableRow,
  WidthType,
} from "docx";
import { saveAs } from "file-saver";
import type { User } from "../types";
import { Bounce, toast } from "react-toastify";

interface ResultData {
  recommendedProgram: string;
  evaluation: string;
  recommendations: string;
  summary?: string;
  percent?: Record<string, number>;
}

export const saveResultsAsDocument = async (result: ResultData, user: User) => {
  try {
    // Create the document
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            // Header with CCDI branding
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: "CCDI AUTOMATED CAREER ASSESSMENT",
                  bold: true,
                  size: 32,
                  color: "2B3176",
                }),
              ],
            }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: "ASSESSMENT RESULTS REPORT",
                  bold: true,
                  size: 24,
                  color: "1C6CB3",
                }),
              ],
            }),
            new Paragraph({ text: "" }), // Spacer

            // Student Information Section
            new Paragraph({
              children: [
                new TextRun({
                  text: "STUDENT INFORMATION",
                  bold: true,
                  size: 28,
                  color: "2B3176",
                }),
              ],
            }),
            new Paragraph({ text: "" }),

            // Student details table
            new Table({
              width: {
                size: 100,
                type: WidthType.PERCENTAGE,
              },
              borders: {
                top: { style: "single", size: 1, color: "2B3176" },
                bottom: { style: "single", size: 1, color: "2B3176" },
                left: { style: "single", size: 1, color: "2B3176" },
                right: { style: "single", size: 1, color: "2B3176" },
                insideHorizontal: { style: "single", size: 1, color: "D3D3D3" },
                insideVertical: { style: "single", size: 1, color: "D3D3D3" },
              },
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({ text: "Full Name", bold: true }),
                          ],
                        }),
                      ],
                      shading: { fill: "F0F8FF" },
                    }),
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: user.name || "Not specified",
                            }),
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
                new TableRow({
                  children: [
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({ text: "Email", bold: true }),
                          ],
                        }),
                      ],
                      shading: { fill: "F0F8FF" },
                    }),
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: user.email || "Not specified",
                            }),
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
                new TableRow({
                  children: [
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "Preferred Course",
                              bold: true,
                            }),
                          ],
                        }),
                      ],
                      shading: { fill: "F0F8FF" },
                    }),
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: user.preferredCourse || "Not specified",
                            }),
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
            new Paragraph({ text: "" }),

            // Assessment Summary
            new Paragraph({
              children: [
                new TextRun({
                  text: "ASSESSMENT SUMMARY",
                  bold: true,
                  size: 28,
                  color: "2B3176",
                }),
              ],
            }),
            new Paragraph({ text: "" }),
            new Paragraph({
              children: [
                new TextRun({
                  text:
                    result.summary ||
                    "Based on your comprehensive assessment, here are your personalized results and program recommendations...",
                  size: 22,
                }),
              ],
            }),
            new Paragraph({ text: "" }),

            // Recommended Program (Highlighted)
            new Paragraph({
              children: [
                new TextRun({
                  text: "RECOMMENDED PROGRAM",
                  bold: true,
                  size: 28,
                  color: "2B3176",
                }),
              ],
            }),
            new Paragraph({ text: "" }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              shading: {
                fill: "A41D31",
              },
              children: [
                new TextRun({
                  text: result.recommendedProgram,
                  bold: true,
                  size: 32,
                  color: "FFFFFF",
                }),
              ],
            }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: "Best match based on your skills, interests, and learning style",
                  italics: true,
                  size: 20,
                  color: "666666",
                }),
              ],
            }),
            new Paragraph({ text: "" }),

            // Detailed Evaluation
            new Paragraph({
              children: [
                new TextRun({
                  text: "DETAILED EVALUATION",
                  bold: true,
                  size: 28,
                  color: "2B3176",
                }),
              ],
            }),
            new Paragraph({ text: "" }),
            new Paragraph({
              children: [
                new TextRun({
                  text: result.evaluation,
                  size: 22,
                }),
              ],
            }),
            new Paragraph({ text: "" }),

            // Personalized Recommendations
            new Paragraph({
              children: [
                new TextRun({
                  text: "PERSONALIZED RECOMMENDATIONS",
                  bold: true,
                  size: 28,
                  color: "2B3176",
                }),
              ],
            }),
            new Paragraph({ text: "" }),
            new Paragraph({
              children: [
                new TextRun({
                  text: result.recommendations,
                  size: 22,
                }),
              ],
            }),
            new Paragraph({ text: "" }),

            // Program Compatibility Table
            ...(result.percent
              ? [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: "PROGRAM COMPATIBILITY ANALYSIS",
                        bold: true,
                        size: 28,
                        color: "2B3176",
                      }),
                    ],
                  }),
                  new Paragraph({ text: "" }),
                  new Table({
                    width: {
                      size: 100,
                      type: WidthType.PERCENTAGE,
                    },
                    columnWidths: [3000, 2000, 3000],
                    borders: {
                      top: { style: "single", size: 2, color: "2B3176" },
                      bottom: { style: "single", size: 2, color: "2B3176" },
                      left: { style: "single", size: 2, color: "2B3176" },
                      right: { style: "single", size: 2, color: "2B3176" },
                      insideHorizontal: {
                        style: "single",
                        size: 1,
                        color: "D3D3D3",
                      },
                      insideVertical: {
                        style: "single",
                        size: 1,
                        color: "D3D3D3",
                      },
                    },
                    rows: [
                      // Header row
                      new TableRow({
                        children: [
                          new TableCell({
                            children: [
                              new Paragraph({
                                children: [
                                  new TextRun({
                                    text: "PROGRAM",
                                    bold: true,
                                    color: "FFFFFF",
                                  }),
                                ],
                              }),
                            ],
                            shading: { fill: "2B3176" },
                          }),
                          new TableCell({
                            children: [
                              new Paragraph({
                                children: [
                                  new TextRun({
                                    text: "COMPATIBILITY",
                                    bold: true,
                                    color: "FFFFFF",
                                  }),
                                ],
                              }),
                            ],
                            shading: { fill: "2B3176" },
                          }),
                          new TableCell({
                            children: [
                              new Paragraph({
                                children: [
                                  new TextRun({
                                    text: "ASSESSMENT",
                                    bold: true,
                                    color: "FFFFFF",
                                  }),
                                ],
                              }),
                            ],
                            shading: { fill: "2B3176" },
                          }),
                        ],
                      }),
                      // Data rows
                      ...Object.entries(result.percent).map(
                        ([program, percentage]) => {
                          const isRecommended =
                            program === result.recommendedProgram;
                          const getAssessmentText = (percent: number) => {
                            if (percent >= 80) return "Excellent Match";
                            if (percent >= 60) return "Strong Compatibility";
                            if (percent >= 40) return "Moderate Alignment";
                            if (percent >= 20) return "Some Relevance";
                            return "Limited Compatibility";
                          };

                          return new TableRow({
                            children: [
                              new TableCell({
                                children: [
                                  new Paragraph({
                                    children: [
                                      new TextRun({
                                        text: program,
                                        bold: isRecommended,
                                        color: isRecommended
                                          ? "A41D31"
                                          : "000000",
                                      }),
                                    ],
                                  }),
                                ],
                                shading: isRecommended
                                  ? { fill: "FFF0F0" }
                                  : undefined,
                              }),
                              new TableCell({
                                children: [
                                  new Paragraph({
                                    children: [
                                      new TextRun({
                                        text: `${percentage}%`,
                                        bold: isRecommended,
                                        color: isRecommended
                                          ? "A41D31"
                                          : "000000",
                                      }),
                                    ],
                                  }),
                                ],
                                shading: isRecommended
                                  ? { fill: "FFF0F0" }
                                  : undefined,
                              }),
                              new TableCell({
                                children: [
                                  new Paragraph({
                                    children: [
                                      new TextRun({
                                        text: getAssessmentText(percentage),
                                        bold: isRecommended,
                                        color: isRecommended
                                          ? "A41D31"
                                          : "000000",
                                      }),
                                    ],
                                  }),
                                ],
                                shading: isRecommended
                                  ? { fill: "FFF0F0" }
                                  : undefined,
                              }),
                            ],
                          });
                        }
                      ),
                    ],
                  }),
                  new Paragraph({ text: "" }),
                ]
              : []),

            // Footer
            new Paragraph({ text: "" }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: "Generated by CCDI Automated Career Assessment System",
                  size: 18,
                  color: "666666",
                  italics: true,
                }),
              ],
            }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: `Report generated on: ${new Date().toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )}`,
                  size: 16,
                  color: "999999",
                }),
              ],
            }),
          ],
        },
      ],
    });

    // Generate the document and save it
    const blob = await Packer.toBlob(doc);

    // Create filename with student name and timestamp
    const fileName = `CCDI_Assessment_Results_${
      user.name?.replace(/[^a-zA-Z0-9]/g, "_") || "Student"
    }_${new Date().getTime()}.docx`;

    // Save the file
    saveAs(blob, fileName);

    // Show success toast
    toast.success("Results document saved successfully!", {
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
    console.error("Error generating Word document:", error);

    // Show error toast
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

    throw error;
  }
};
