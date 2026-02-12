// src/hooks/saveResultsAsDocument.ts (UPDATED)
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
import type { User, AssessmentResult } from "../types";
import { Bounce, toast } from "react-toastify";

// NEW: Interface for printable document generation
// interface PrintableDocumentOptions {
//   result: AssessmentResult;
//   user: User;
//   format: "word" | "print" | "pdf";
// }

export const saveResultsAsDocument = async (result: AssessmentResult, user: User) => {
  try {
    // Create the Word document
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
                              text: user.fullName || user.name || "Not specified",
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
                  text: result.detailedEvaluation,
                  size: 22,
                }),
              ],
            }),
            new Paragraph({ text: "" }),

            // Category Scores Section
            ...(result.categoryScores
              ? [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: "CATEGORY PERFORMANCE ANALYSIS",
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
                      new TableRow({
                        children: [
                          new TableCell({
                            children: [
                              new Paragraph({
                                children: [
                                  new TextRun({
                                    text: "CATEGORY",
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
                                    text: "SCORE",
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
                      new TableRow({
                        children: [
                          new TableCell({
                            children: [
                              new Paragraph({
                                children: [
                                  new TextRun({
                                    text: "Academic Aptitude",
                                    bold: true,
                                  }),
                                ],
                              }),
                            ],
                          }),
                          new TableCell({
                            children: [
                              new Paragraph({
                                children: [
                                  new TextRun({
                                    text: `${result.categoryScores.academic}%`,
                                  }),
                                ],
                              }),
                            ],
                          }),
                          new TableCell({
                            children: [
                              new Paragraph({
                                children: [
                                  new TextRun({
                                    text: getCategoryAssessment(result.categoryScores.academic),
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
                                    text: "Technical Skills",
                                    bold: true,
                                  }),
                                ],
                              }),
                            ],
                          }),
                          new TableCell({
                            children: [
                              new Paragraph({
                                children: [
                                  new TextRun({
                                    text: `${result.categoryScores.technical}%`,
                                  }),
                                ],
                              }),
                            ],
                          }),
                          new TableCell({
                            children: [
                              new Paragraph({
                                children: [
                                  new TextRun({
                                    text: getCategoryAssessment(result.categoryScores.technical),
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
                                    text: "Career Interest",
                                    bold: true,
                                  }),
                                ],
                              }),
                            ],
                          }),
                          new TableCell({
                            children: [
                              new Paragraph({
                                children: [
                                  new TextRun({
                                    text: `${result.categoryScores.career}%`,
                                  }),
                                ],
                              }),
                            ],
                          }),
                          new TableCell({
                            children: [
                              new Paragraph({
                                children: [
                                  new TextRun({
                                    text: getCategoryAssessment(result.categoryScores.career),
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
                                    text: "Logistics & Work Style",
                                    bold: true,
                                  }),
                                ],
                              }),
                            ],
                          }),
                          new TableCell({
                            children: [
                              new Paragraph({
                                children: [
                                  new TextRun({
                                    text: `${result.categoryScores.logistics}%`,
                                  }),
                                ],
                              }),
                            ],
                          }),
                          new TableCell({
                            children: [
                              new Paragraph({
                                children: [
                                  new TextRun({
                                    text: getCategoryAssessment(result.categoryScores.logistics),
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
                ]
              : []),

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
                        },
                      ),
                    ],
                  }),
                  new Paragraph({ text: "" }),
                ]
              : []),

            // Preparation Needed Section
            ...(result.preparationNeeded && result.preparationNeeded.length > 0
              ? [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: "PREPARATION RECOMMENDATIONS",
                        bold: true,
                        size: 28,
                        color: "2B3176",
                      }),
                    ],
                  }),
                  new Paragraph({ text: "" }),
                  ...result.preparationNeeded.map(
                    (item) =>
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: "• " + item,
                            size: 22,
                          }),
                        ],
                      }),
                  ),
                  new Paragraph({ text: "" }),
                ]
              : []),

            // Success Roadmap
            ...(result.successRoadmap
              ? [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: "YOUR SUCCESS ROADMAP",
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
                        text: result.successRoadmap,
                        size: 22,
                      }),
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
                    },
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
      user.name?.replace(/[^a-zA-Z0-9]/g, "_") || user.fullName?.replace(/[^a-zA-Z0-9]/g, "_") || "Student"
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

// Helper function for category assessment text
const getCategoryAssessment = (score: number): string => {
  if (score >= 85) return "Excellent";
  if (score >= 70) return "Strong";
  if (score >= 55) return "Developing";
  if (score >= 40) return "Emerging";
  return "Needs Development";
};

// NEW: Function to generate print-friendly HTML document
export const generatePrintableHTML = (result: AssessmentResult, user: User): string => {
  const formatDate = () => {
    return new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getCompatibilityLevel = (percentage: number) => {
    if (percentage >= 80) return { text: "Excellent Match", color: "#22c55e" };
    if (percentage >= 60) return { text: "Strong Compatibility", color: "#3b82f6" };
    if (percentage >= 40) return { text: "Moderate Alignment", color: "#eab308" };
    if (percentage >= 20) return { text: "Some Relevance", color: "#f97316" };
    return { text: "Limited Compatibility", color: "#ef4444" };
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      academic: "#3b82f6",
      technical: "#8b5cf6",
      career: "#ec4899",
      logistics: "#14b8a6",
    };
    return colors[category as keyof typeof colors] || "#6c757d";
  };

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>CCDI Assessment Results - ${user.fullName || user.name || "Student"}</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
        <style>
          * {
            font-family: 'Poppins', sans-serif !important;
          }
          body {
            background: white;
            padding: 40px 20px;
          }
          .printable-document {
            max-width: 1000px;
            margin: 0 auto;
            background: white;
            padding: 40px;
            border-radius: 20px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.05);
          }
          .letterhead {
            text-align: center;
            margin-bottom: 40px;
            padding-bottom: 20px;
            border-bottom: 2px solid #e9ecef;
          }
          .letterhead h1 {
            color: #2B3176;
            font-weight: 700;
            font-size: 2.2rem;
            margin-bottom: 5px;
          }
          .letterhead h2 {
            color: #1C6CB3;
            font-weight: 600;
            font-size: 1.4rem;
          }
          .student-info {
            background: linear-gradient(135deg, #f8f9ff 0%, #ffffff 100%);
            padding: 20px;
            border-radius: 16px;
            border-left: 6px solid #2B3176;
            margin-bottom: 40px;
          }
          .executive-summary {
            background: linear-gradient(135deg, #f0f4ff 0%, #e6ecfe 100%);
            padding: 25px;
            border-radius: 20px;
            margin-bottom: 40px;
          }
          .recommended-program {
            background: linear-gradient(135deg, #A41D31 0%, #EC2326 100%);
            padding: 40px;
            border-radius: 24px;
            color: white;
            text-align: center;
            margin-bottom: 40px;
          }
          .recommended-program h2 {
            font-size: clamp(1.8rem, 5vw, 3rem);
            font-weight: 700;
            margin: 15px 0;
          }
          .compatibility-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 40px;
          }
          .compatibility-table th {
            background: linear-gradient(135deg, #2B3176 0%, #1C6CB3 100%);
            color: white;
            padding: 12px;
          }
          .compatibility-table td {
            padding: 12px;
            border-bottom: 1px solid #e9ecef;
          }
          .progress {
            height: 8px;
            background: #f1f5f9;
            border-radius: 4px;
            overflow: hidden;
          }
          .progress-bar {
            height: 100%;
            border-radius: 4px;
          }
          .category-card {
            padding: 20px;
            border-radius: 16px;
            border: 1px solid #e9ecef;
            margin-bottom: 20px;
          }
          .footer {
            margin-top: 50px;
            padding-top: 30px;
            border-top: 2px solid #dee2e6;
            text-align: center;
            color: #6c757d;
            font-size: 0.85rem;
          }
          @media print {
            body { 
              padding: 0.5in !important;
              background: white !important;
            }
            .printable-document {
              box-shadow: none !important;
              padding: 0 !important;
            }
            .recommended-program {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .progress-bar {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
          }
        </style>
      </head>
      <body>
        <div class="printable-document">
          <!-- Letterhead -->
          <div class="letterhead">
            <h1>CCDI</h1>
            <h2>Automated Career Assessment</h2>
            <h3 style="font-size: 1.1rem; font-weight: 400; color: #6c757d;">Official Results Report</h3>
            <div style="margin-top: 15px; color: #6c757d; font-size: 0.9rem;">
              Report ID: CCDI-${new Date().getTime().toString().slice(-8)} • ${formatDate()}
            </div>
          </div>

          <!-- Student Information -->
          <div class="student-info">
            <div style="display: flex; align-items: center; gap: 15px;">
              <div style="width: 56px; height: 56px; background: #2B3176; border-radius: 14px; display: flex; align-items: center; justify-content: center; color: white; font-size: 24px;">
                👤
              </div>
              <div>
                <div style="text-transform: uppercase; font-size: 0.8rem; color: #6c757d; margin-bottom: 5px;">
                  Student Information
                </div>
                <h4 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 5px;">
                  ${user.fullName || user.name || "Student Name"}
                </h4>
                <div style="display: flex; gap: 20px;">
                  <span style="font-size: 0.9rem;">📧 ${user.email || "Email not provided"}</span>
                  <span style="font-size: 0.9rem;">📚 Preferred: ${user.preferredCourse || "Not specified"}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Executive Summary -->
          <div class="executive-summary">
            <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 15px;">
              <span style="font-size: 28px;">🏆</span>
              <h4 style="color: #2B3176; font-weight: 700; margin: 0;">Executive Summary</h4>
            </div>
            <p style="font-size: 1.05rem; line-height: 1.6; color: #1a1e3c; margin: 0;">
              ${result.summary || "Based on your comprehensive assessment across academic aptitude, technical skills, career interests, and work style preferences, we've identified the optimal program alignment for your profile."}
            </p>
          </div>

          <!-- Recommended Program -->
          <div class="recommended-program">
            <span style="background: rgba(255,255,255,0.2); padding: 8px 16px; border-radius: 20px; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 2px;">
              Recommended Program
            </span>
            <h2>${result.recommendedProgram}</h2>
            <p style="font-size: 1.2rem; opacity: 0.95; margin: 0 auto; max-width: 600px;">
              Best match based on your skills, interests, and learning style
            </p>
          </div>

          <!-- Program Compatibility -->
          ${result.percent ? `
            <h4 style="color: #2B3176; font-weight: 700; margin-bottom: 20px;">
              📊 Program Compatibility Analysis
            </h4>
            <table class="compatibility-table">
              <thead>
                <tr>
                  <th>Program</th>
                  <th>Compatibility</th>
                  <th>Assessment</th>
                </tr>
              </thead>
              <tbody>
                ${Object.entries(result.percent).map(([program, percentage]) => {
                  const isRecommended = program === result.recommendedProgram;
                  const level = getCompatibilityLevel(percentage);
                  return `
                    <tr style="background: ${isRecommended ? '#fff8f8' : 'white'};">
                      <td style="font-weight: ${isRecommended ? '700' : '400'}; color: ${isRecommended ? '#A41D31' : 'inherit'};">
                        ${program}
                        ${isRecommended ? '<span style="background: #A41D31; color: white; padding: 4px 8px; border-radius: 12px; font-size: 0.7rem; margin-left: 8px;">Recommended</span>' : ''}
                      </td>
                      <td>
                        <div style="display: flex; align-items: center; gap: 15px;">
                          <span style="font-size: 1.2rem; font-weight: 700; color: ${isRecommended ? '#A41D31' : level.color};">
                            ${percentage}%
                          </span>
                          <div class="progress" style="width: 100px;">
                            <div class="progress-bar" style="width: ${percentage}%; background: ${isRecommended ? '#A41D31' : level.color};"></div>
                          </div>
                        </div>
                      </td>
                      <td style="color: ${level.color};">
                        ${level.text}
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          ` : ''}

          <!-- Detailed Evaluation -->
          <h4 style="color: #2B3176; font-weight: 700; margin: 40px 0 20px 0; padding-bottom: 10px; border-bottom: 2px solid #dee2e6;">
            📝 Detailed Evaluation
          </h4>
          <div style="padding: 20px; background: white; border: 1px solid #e9ecef; border-radius: 16px; margin-bottom: 30px;">
            <p style="font-size: 1rem; line-height: 1.7; color: #2c3e50; margin: 0;">
              ${result.evaluation}
            </p>
          </div>

          <!-- Personalized Recommendations -->
          <h4 style="color: #2B3176; font-weight: 700; margin: 40px 0 20px 0; padding-bottom: 10px; border-bottom: 2px solid #dee2e6;">
            💡 Personalized Recommendations
          </h4>
          <div style="padding: 20px; background: #f8f9ff; border-left: 6px solid #1C6CB3; border-radius: 16px; margin-bottom: 30px;">
            <p style="font-size: 1rem; line-height: 1.7; color: #2c3e50; margin: 0;">
              ${result.detailedEvaluation}
            </p>
          </div>

          <!-- Category Scores -->
          ${result.categoryScores ? `
            <h4 style="color: #2B3176; font-weight: 700; margin: 40px 0 20px 0;">
              🧠 Category Performance Analysis
            </h4>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 30px;">
              ${Object.entries(result.categoryScores).map(([key, score]) => {
                const categoryLabels = {
                  academic: "Academic Aptitude",
                  technical: "Technical Skills",
                  career: "Career Interest",
                  logistics: "Logistics & Work Style"
                };
                const color = getCategoryColor(key);
                return `
                  <div class="category-card">
                    <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 15px;">
                      <div style="width: 44px; height: 44px; background: ${color}20; border-radius: 12px; display: flex; align-items: center; justify-content: center;">
                        <span style="font-size: 22px; color: ${color};">●</span>
                      </div>
                      <div>
                        <div style="font-weight: 600;">${categoryLabels[key as keyof typeof categoryLabels] || key}</div>
                        <div style="display: flex; align-items: baseline; gap: 8px;">
                          <span style="font-size: 1.5rem; font-weight: 700; color: ${color};">${score}%</span>
                          <span style="color: #6c757d;">score</span>
                        </div>
                      </div>
                    </div>
                    <div class="progress">
                      <div class="progress-bar" style="width: ${score}%; background: ${color};"></div>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          ` : ''}

          <!-- Preparation Needed -->
          ${result.preparationNeeded && result.preparationNeeded.length > 0 ? `
            <h4 style="color: #2B3176; font-weight: 700; margin: 40px 0 20px 0;">
              ⚠️ Preparation Recommendations
            </h4>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-bottom: 30px;">
              ${result.preparationNeeded.map(item => `
                <div style="padding: 15px; background: #fff9e6; border: 1px solid #ffeeba; border-radius: 12px; display: flex; align-items: center; gap: 12px;">
                  <span style="color: #eab308;">✓</span>
                  <span>${item}</span>
                </div>
              `).join('')}
            </div>
          ` : ''}

          <!-- Success Roadmap -->
          ${result.successRoadmap ? `
            <h4 style="color: #2B3176; font-weight: 700; margin: 40px 0 20px 0;">
              📈 Your Success Roadmap
            </h4>
            <div style="padding: 25px; background: white; border: 2px solid #2B3176; border-radius: 16px; margin-bottom: 30px;">
              <p style="font-size: 1rem; line-height: 1.7; margin: 0;">
                ${result.successRoadmap}
              </p>
            </div>
          ` : ''}

          <!-- Footer -->
          <div class="footer">
            <p style="margin-bottom: 10px;">
              This report was generated by the CCDI Automated Career Assessment System.
              <br>
              For inquiries or to discuss these results further, please contact the CCDI Career Guidance Office.
            </p>
            <div style="display: flex; justify-content: center; gap: 20px; margin-top: 15px; color: #adb5bd; font-size: 0.75rem;">
              <span>CCDI • Career Assessment Division</span>
              <span>•</span>
              <span>Report Version 2.0</span>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
};

// NEW: Function to open print-friendly view
export const openPrintableResults = (result: AssessmentResult, user: User) => {
  const html = generatePrintableHTML(result, user);
  const printWindow = window.open("", "_blank");
  
  if (!printWindow) {
    toast.error("Please allow pop-ups to view the printable document.", {
      position: "top-right",
      autoClose: 3000,
    });
    return;
  }

  printWindow.document.write(html);
  printWindow.document.close();
  
  // Trigger print dialog immediately or let user click print button
  // Uncomment the next line if you want print dialog to open automatically
  // printWindow.print();
};

// NEW: Complete results management hook
export const useResultsDocument = () => {
  const handleSaveWord = async (result: AssessmentResult, user: User) => {
    await saveResultsAsDocument(result, user);
  };

  const handleViewPrint = (result: AssessmentResult, user: User) => {
    openPrintableResults(result, user);
  };

  return {
    saveAsWord: handleSaveWord,
    viewPrintable: handleViewPrint,
  };
};