import React, { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Button,
  Spinner,
  Collapse,
  Modal,
} from "react-bootstrap";
import {
  Eye,
  Edit,
  CheckCircle,
  AlertCircle,
  Download,
  CircleCheck,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import type { AssessmentAnswers, User } from "../../types";
import { categoryTitles, sections } from "../../config/constants";
import {
  generateAssessmentDocument,
  saveAnswersAsDocument,
} from "../../hooks/saveAnswersAsDocument";
import { type ProgramScores } from "./types";
import type { Question } from "../../hooks/useAssessmentQuestions";
import PDFViewer from "../ui/iframe/PDFViewer";
import { toast } from "react-toastify";

interface ReviewSectionProps {
  formData: AssessmentAnswers;
  questions: {
    foundationalAssessment: Question[];
    academicAptitude: Question[];
    technicalSkills: Question[];
    careerInterest: Question[];
    learningWorkStyle: Question[];
  };
  programScores: ProgramScores;
  onEditSection: (index: number) => void;
  onSubmit: () => void;
  loading: boolean;
  currentUser?: User;
}

const ReviewSection: React.FC<ReviewSectionProps> = ({
  formData,
  questions,
  programScores,
  onEditSection,
  onSubmit,
  loading,
  currentUser,
}) => {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    foundationalAssessment: false,
    academicAptitude: false,
    technicalSkills: false,
    careerInterest: false,
    learningWorkStyle: false,
  });

  const [showPreview, setShowPreview] = useState(false);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const handlePreviewDocument = async () => {
    try {
      setIsGeneratingPdf(true);
      const blob = await generateAssessmentDocument({
        formData,
        programScores,
        currentSection: sections.length - 1,
        sections,
        currentUser: currentUser as User,
        questions,
      });
      setPdfBlob(blob);
      setShowPreview(true);
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate document");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  useEffect(() => {
    if (pdfBlob) {
      const url = URL.createObjectURL(pdfBlob);
      setPdfUrl(url);
      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [pdfBlob]);

  useEffect(() => {
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [pdfUrl]);

  useEffect(() => {
    const newOpenSections: Record<string, boolean> = {};
    sections.forEach((sectionKey) => {
      const sectionQuestions = getQuestionsBySection(sectionKey);
      const hasAnswers = sectionQuestions.some((q) => {
        let answer;
        if (sectionKey === "foundationalAssessment") {
          answer =
            formData.foundationalAssessment?.[q._id] ||
            formData.foundationalAssessment?.[q.questionText];
          return typeof answer === "string" && answer.trim() !== "";
        }
        if (sectionKey === "academicAptitude") {
          answer =
            formData.academicAptitude?.[q._id] ||
            formData.academicAptitude?.[q.questionText];
          return typeof answer === "number" && answer >= 1 && answer <= 5;
        }
        if (sectionKey === "careerInterest") {
          answer =
            formData.careerInterest?.[q._id] ||
            formData.careerInterest?.[q.questionText];
          return typeof answer === "number" && answer >= 1 && answer <= 5;
        }
        if (sectionKey === "technicalSkills") {
          answer =
            formData.technicalSkills?.[q._id] ||
            formData.technicalSkills?.[q.questionText];
          return answer === true;
        }
        if (sectionKey === "learningWorkStyle") {
          answer =
            formData.learningWorkStyle?.[q._id] ||
            formData.learningWorkStyle?.[q.questionText];
          return answer === true;
        }
        return false;
      });
      newOpenSections[sectionKey] = hasAnswers;
    });
    setOpenSections(newOpenSections);
  }, []);

  const toggleSection = (sectionKey: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }));
  };

  const getQuestionsBySection = (sectionKey: string): Question[] => {
    switch (sectionKey) {
      case "foundationalAssessment":
        return questions.foundationalAssessment || [];
      case "academicAptitude":
        return questions.academicAptitude || [];
      case "technicalSkills":
        return questions.technicalSkills || [];
      case "careerInterest":
        return questions.careerInterest || [];
      case "learningWorkStyle":
        return questions.learningWorkStyle || [];
      default:
        return [];
    }
  };

  const getAnswerLabel = (
    sectionKey: keyof AssessmentAnswers,
    questionText: string,
    value: string | number | boolean | undefined,
  ): string => {
    if (sectionKey === "foundationalAssessment") {
      if (typeof value === "string" && value.trim() !== "") {
        return value;
      }
      return "Not Answered";
    }

    if (sectionKey === "academicAptitude" || sectionKey === "careerInterest") {
      const labels = [
        "Strongly Agree",
        "Agree",
        "Neutral",
        "Disagree",
        "Strongly Disagree",
      ];
      if (typeof value === "number" && value >= 1 && value <= 5) {
        return labels[value - 1];
      }
      return "Not Answered";
    }

    if (
      sectionKey === "technicalSkills" ||
      sectionKey === "learningWorkStyle"
    ) {
      return value === true ? "Yes" : "No";
    }

    return "Not Answered";
  };

  const getAnswerColor = (
    sectionKey: keyof AssessmentAnswers,
    value: string | number | boolean | undefined,
  ): string => {
    if (sectionKey === "foundationalAssessment") {
      return typeof value === "string" && value.trim() !== "" ? "#1C6CB3" : "#6c757d";
    }

    if (sectionKey === "technicalSkills" || sectionKey === "learningWorkStyle") {
      return value === true ? "#EC2326" : "#6c757d";
    }

    if (typeof value === "number") {
      const colors = ["#2B3176", "#1C6CB3", "#6c757d", "#EC2326", "#A41D31"];
      return colors[value - 1] || "#6c757d";
    }

    return "#6c757d";
  };

  const sectionColors = [
    { bg: "linear-gradient(135deg, #2B3176 0%, #1C6CB3 100%)", text: "white", accent: "#1C6CB3" },
    { bg: "linear-gradient(135deg, #A41D31 0%, #EC2326 100%)", text: "white", accent: "#EC2326" },
    { bg: "linear-gradient(135deg, #2B3176 0%, #1C6CB3 100%)", text: "white", accent: "#1C6CB3" },
    { bg: "linear-gradient(135deg, #A41D31 0%, #EC2326 100%)", text: "white", accent: "#EC2326" },
    { bg: "linear-gradient(135deg, #2B3176 0%, #1C6CB3 100%)", text: "white", accent: "#1C6CB3" },
  ];


  const groupLearningStyleQuestions = () => {
    const questions = getQuestionsBySection("learningWorkStyle");
    const groups: Record<string, Question[]> = {};

    questions.forEach((question) => {
      const category = question.subCategory || "Uncategorized";
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(question);
    });

    return groups;
  };

  const groupFoundationalQuestions = () => {
    const questions = getQuestionsBySection("foundationalAssessment");
    const groups: Record<string, Question[]> = {};

    questions.forEach((question) => {
      const category = question.subCategory || "General";
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(question);
    });

    return groups;
  };

  const getAnsweredQuestions = (sectionKey: string) => {
    const sectionQuestions = getQuestionsBySection(sectionKey);
    return sectionQuestions.filter((q) => {
      let answer;

      if (sectionKey === "foundationalAssessment") {
        answer =
          formData.foundationalAssessment?.[q._id] ||
          formData.foundationalAssessment?.[q.questionText];
        return typeof answer === "string" && answer.trim() !== "";
      }

      if (sectionKey === "academicAptitude") {
        answer =
          formData.academicAptitude?.[q._id] ||
          formData.academicAptitude?.[q.questionText];
        return typeof answer === "number" && answer >= 1 && answer <= 5;
      }

      if (sectionKey === "careerInterest") {
        answer =
          formData.careerInterest?.[q._id] ||
          formData.careerInterest?.[q.questionText];
        return typeof answer === "number" && answer >= 1 && answer <= 5;
      }

      if (sectionKey === "technicalSkills") {
        answer =
          formData.technicalSkills?.[q._id] ||
          formData.technicalSkills?.[q.questionText];
        return answer === true;
      }

      if (sectionKey === "learningWorkStyle") {
        answer =
          formData.learningWorkStyle?.[q._id] ||
          formData.learningWorkStyle?.[q.questionText];
        return answer === true;
      }

      return false;
    });
  };

  return (
    <Card className="border-0 shadow-lg review-card" style={{ borderRadius: "16px" }}>
      <Card.Header
        className="text-white text-center py-4"
        style={{
          background: "linear-gradient(135deg, #2B3176 0%, #1C6CB3 100%)",
          borderBottom: "3px solid #A41D31",
        }}
      >
        <Card.Title className="mb-0 d-flex align-items-center justify-content-center fs-2 fw-bold">
          <Eye size={32} className="me-3" />
          Review Your Answers
        </Card.Title>
        <p className="mb-0 mt-2 opacity-75">
          Please review all your answers before submitting
        </p>
      </Card.Header>

      <Card.Body className="p-4 p-lg-5">
        {/* Progress Summary */}
        <Row className="mb-5">
          <Col md={10} className="mx-auto">
            <Card
              className="border-0 shadow-sm"
              style={{
                background: "linear-gradient(135deg, #f8f9ff 0%, #e8f4ff 100%)",
                border: "2px solid rgba(43, 49, 118, 0.2)",
                borderRadius: "16px",
              }}
            >
              <Card.Body className="p-4">
                <h5
                  className="fw-bold mb-4 text-center"
                  style={{ color: "#2B3176", fontSize: "1.9rem" }}
                >
                  Assessment Progress Summary
                </h5>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Answer Grid */}
        <Row className="g-4 review-answers-grid">
          {sections.map((sectionKey, sectionIndex) => {
            const answeredQuestions = getAnsweredQuestions(sectionKey);
            const learningStyleGroups = groupLearningStyleQuestions();
            const foundationalGroups = groupFoundationalQuestions();
            const isExpanded = openSections[sectionKey];

            return (
              <Col xl={6} lg={12} key={sectionKey}>
                <Card className="h-100 shadow-sm review-section-card border-0" style={{ borderRadius: "16px" }}>
                  <Card.Header
                    className="d-flex justify-content-between align-items-center py-3 cursor-pointer"
                    style={{
                      background: sectionColors[sectionIndex].bg,
                      color: sectionColors[sectionIndex].text,
                      borderBottom: `3px solid ${sectionColors[sectionIndex].accent}`,
                      borderRadius: "16px 16px 0 0",
                    }}
                    onClick={() => toggleSection(sectionKey)}
                  >
                    <div className="d-flex align-items-center">
                      <Button
                        variant="link"
                        className="p-0 me-2"
                        style={{ color: "white", minWidth: "24px" }}
                      >
                        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </Button>
                      <h5 className="mb-0 fw-bold">{categoryTitles[sectionKey]}</h5>
                      <span
                        className="ms-2 px-2 py-1 rounded-pill"
                        style={{
                          background: "rgba(255,255,255,0.2)",
                          color: "white",
                          fontSize: "0.8rem",
                          fontWeight: "600",
                        }}
                      >
                        {answeredQuestions.length}
                      </span>
                    </div>
                    <Button
                      variant="light"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditSection(sectionIndex);
                      }}
                      className="fw-bold rounded-pill"
                      style={{
                        background: "rgba(255, 255, 255, 0.9)",
                        color: sectionColors[sectionIndex].accent,
                        border: "2px solid rgba(255, 255, 255, 0.5)",
                      }}
                    >
                      <Edit size={16} className="me-1" />
                      Edit
                    </Button>
                  </Card.Header>

                  <Collapse in={isExpanded} timeout={300}>
                    <div>
                      <Card.Body className="p-3 p-md-4 review-section-body">
                        {sectionKey === "technicalSkills" ? (
                          <div className="technical-skills-review h-100">
                            <h6 className="fw-bold mb-3 text-center" style={{ color: "#2B3176" }}>
                              Selected Technical Interests ({answeredQuestions.length})
                            </h6>

                            {answeredQuestions.length > 0 ? (
                              <div className="skills-container">
                                <div className="mb-4">
                                  <div
                                    className="d-flex align-items-center mb-2 p-2 rounded"
                                    style={{
                                      background: "rgba(28, 108, 179, 0.08)",
                                      borderLeft: "4px solid #1C6CB3",
                                    }}
                                  >
                                    <span
                                      className="me-2 px-2 py-1 rounded-pill"
                                      style={{
                                        background: sectionColors[sectionIndex].bg,
                                        color: "white",
                                        fontSize: "0.8rem",
                                        fontWeight: "600",
                                      }}
                                    >
                                      {answeredQuestions.length}
                                    </span>
                                    <h6 className="mb-0" style={{ color: "#2B3176", fontSize: "0.95rem" }}>
                                      Technical Competencies
                                    </h6>
                                  </div>

                                  <div className="ms-3">
                                    {answeredQuestions.map((question) => (
                                      <div
                                        key={question._id}
                                        className="d-flex align-items-start p-2 mb-2 rounded"
                                        style={{
                                          background: "rgba(248, 249, 255, 0.5)",
                                          border: "1px solid #dee2e6",
                                        }}
                                      >
                                        <CircleCheck size={16} className="me-2 mt-1 flex-shrink-0" style={{ color: "#EC2326" }} />
                                        <div className="flex-grow-1">
                                          <div className="text-dark mb-1" style={{ lineHeight: 1.3, fontSize: "0.9rem" }}>
                                            {question.questionText}
                                          </div>
                                          <span
                                            className="px-2 py-1 rounded-pill"
                                            style={{
                                              background: "#EC2326",
                                              color: "white",
                                              fontSize: "0.7rem",
                                              fontWeight: 600,
                                            }}
                                          >
                                            ✓ Yes
                                          </span>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="text-center py-4">
                                <AlertCircle size={48} style={{ color: "#6c757d" }} className="mb-3" />
                                <p className="mb-1" style={{ color: "#6c757d" }}>No technical skills selected</p>
                              </div>
                            )}
                          </div>
                        ) : sectionKey === "learningWorkStyle" ? (
                          <div className="learning-style-review">
                            <h6 className="fw-bold mb-3 text-center" style={{ color: "#2B3176" }}>
                              Selected Preferences ({answeredQuestions.length})
                            </h6>

                            {answeredQuestions.length > 0 ? (
                              <div className="preferences-container">
                                {Object.entries(learningStyleGroups).map(
                                  ([category, catQuestions], catIndex) => {
                                    const answeredCatQuestions = catQuestions.filter(
                                      (q) => formData.learningWorkStyle?.[q.questionText] === true,
                                    );

                                    if (answeredCatQuestions.length === 0) return null;

                                    return (
                                      <div key={category} className="mb-4">
                                        <div
                                          className="d-flex align-items-center mb-2 p-2 rounded"
                                          style={{
                                            background: "rgba(28, 108, 179, 0.08)",
                                            borderLeft: "4px solid #1C6CB3",
                                          }}
                                        >
                                          <span
                                            className="me-2 px-2 py-1 rounded-pill"
                                            style={{
                                              background: sectionColors[sectionIndex].bg,
                                              color: "white",
                                              fontSize: "0.8rem",
                                              fontWeight: "600",
                                            }}
                                          >
                                            {catIndex + 1}
                                          </span>
                                          <h6 className="mb-0" style={{ color: "#2B3176", fontSize: "0.95rem" }}>
                                            {category}
                                            <small className="ms-2 text-muted">
                                              ({answeredCatQuestions.length} of {catQuestions.length})
                                            </small>
                                          </h6>
                                        </div>

                                        <div className="ms-3">
                                          {answeredCatQuestions.map((question) => (
                                            <div
                                              key={question._id}
                                              className="d-flex align-items-start p-2 mb-2 rounded"
                                              style={{
                                                background: "rgba(248, 249, 255, 0.5)",
                                                border: "1px solid #dee2e6",
                                              }}
                                            >
                                              <CircleCheck size={16} className="me-2 mt-1 flex-shrink-0" style={{ color: "#EC2326" }} />
                                              <div className="flex-grow-1">
                                                <div className="text-dark mb-1" style={{ lineHeight: 1.3, fontSize: "0.9rem" }}>
                                                  {question.questionText}
                                                </div>
                                                <span
                                                  className="px-2 py-1 rounded-pill"
                                                  style={{
                                                    background: "#EC2326",
                                                    color: "white",
                                                    fontSize: "0.7rem",
                                                    fontWeight: 600,
                                                  }}
                                                >
                                                  ✓ Yes
                                                </span>
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    );
                                  },
                                )}
                              </div>
                            ) : (
                              <div className="text-center py-4">
                                <AlertCircle size={48} style={{ color: "#6c757d" }} className="mb-3" />
                                <p className="mb-1" style={{ color: "#6c757d" }}>No preferences selected</p>
                              </div>
                            )}
                          </div>
                        ) : sectionKey === "foundationalAssessment" ? (
                          <div className="foundational-assessment-review">
                            <h6 className="fw-bold mb-3 text-center" style={{ color: "#2B3176" }}>
                              Foundational Assessment ({answeredQuestions.length})
                            </h6>
                            {answeredQuestions.length > 0 ? (
                              Object.entries(foundationalGroups).map(
                                ([category, catQuestions], catIndex) => {
                                  const answeredCatQuestions = catQuestions.filter((q) => {
                                    const answer =
                                      formData.foundationalAssessment?.[q._id] ||
                                      formData.foundationalAssessment?.[q.questionText];
                                    return typeof answer === "string" && answer.trim() !== "";
                                  });
                                  if (answeredCatQuestions.length === 0) return null;
                                  return (
                                    <div key={category} className="mb-4">
                                      <div
                                        className="d-flex align-items-center mb-2 p-2 rounded"
                                        style={{
                                          background: "rgba(28, 108, 179, 0.08)",
                                          borderLeft: "4px solid #1C6CB3",
                                        }}
                                      >
                                        <span
                                          className="me-2 px-2 py-1 rounded-pill"
                                          style={{
                                            background: sectionColors[sectionIndex].bg,
                                            color: "white",
                                            fontSize: "0.8rem",
                                            fontWeight: "600",
                                          }}
                                        >
                                          {catIndex + 1}
                                        </span>
                                        <h6 className="mb-0" style={{ color: "#2B3176", fontSize: "0.95rem", textTransform: "capitalize" }}>
                                          {category}
                                          <small className="ms-2 text-muted">
                                            ({answeredCatQuestions.length} of {catQuestions.length})
                                          </small>
                                        </h6>
                                      </div>
                                      <div className="ms-3">
                                        {answeredCatQuestions.map((question, qIndex) => {
                                          const answer =
                                            formData.foundationalAssessment?.[question._id] ||
                                            formData.foundationalAssessment?.[question.questionText];

                                          const answerLabel = getAnswerLabel(
                                            "foundationalAssessment",
                                            question.questionText,
                                            answer,
                                          );
                                          const answerColor = getAnswerColor(
                                            "foundationalAssessment",
                                            answer,
                                          );

                                          return (
                                            <div
                                              key={question._id || question.questionText}
                                              className="d-flex align-items-start p-3 mb-3 rounded"
                                              style={{ background: "rgba(248, 249, 255, 0.5)", border: "1px solid #dee2e6" }}
                                            >
                                              <span
                                                className="me-3 mt-1 flex-shrink-0 rounded-pill d-flex align-items-center justify-content-center"
                                                style={{
                                                  background: sectionColors[sectionIndex].bg,
                                                  color: "white",
                                                  fontSize: "0.8rem",
                                                  fontWeight: "600",
                                                  minWidth: "28px",
                                                  height: "28px",
                                                }}
                                              >
                                                {qIndex + 1}
                                              </span>
                                              <div className="flex-grow-1">
                                                <div className="text-dark mb-2" style={{ lineHeight: 1.4, fontSize: "0.95rem" }}>
                                                  {question.questionText}
                                                </div>
                                                <span
                                                  className="px-3 py-1 rounded-pill"
                                                  style={{
                                                    background: answerColor,
                                                    color: "white",
                                                    fontSize: "0.75rem",
                                                    fontWeight: 600,
                                                  }}
                                                >
                                                  {answerLabel}
                                                </span>
                                              </div>
                                            </div>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  );
                                },
                              )
                            ) : (
                              <div className="text-center py-4">
                                <AlertCircle size={32} className="mb-2" style={{ color: "#6c757d" }} />
                                <p className="mb-0" style={{ color: "#6c757d" }}>No answers provided</p>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="review-questions-container">
                            <h6 className="fw-bold mb-3 text-center" style={{ color: "#2B3176" }}>
                              Questions & Answers ({answeredQuestions.length})
                            </h6>
                            {answeredQuestions.length > 0 ? (
                              <div>
                                {answeredQuestions.map((question, qIndex) => {
                                  const answer =
                                    sectionKey === "academicAptitude"
                                      ? formData.academicAptitude[question._id] ||
                                        formData.academicAptitude[question.questionText]
                                      : sectionKey === "careerInterest"
                                        ? formData.careerInterest[question._id] ||
                                          formData.careerInterest[question.questionText]
                                        : undefined;

                                  const answerColor = getAnswerColor(
                                    sectionKey as keyof AssessmentAnswers,
                                    answer,
                                  );
                                  const answerLabel = getAnswerLabel(
                                    sectionKey as keyof AssessmentAnswers,
                                    question.questionText,
                                    answer,
                                  );

                                  return (
                                    <div
                                      key={question._id}
                                      className="d-flex align-items-start p-3 mb-3 rounded"
                                      style={{ background: "rgba(248, 249, 255, 0.5)", border: "1px solid #dee2e6" }}
                                    >
                                      <span
                                        className="me-3 mt-1 flex-shrink-0 rounded-pill d-flex align-items-center justify-content-center"
                                        style={{
                                          background: sectionColors[sectionIndex].bg,
                                          color: "white",
                                          fontSize: "0.8rem",
                                          fontWeight: "600",
                                          minWidth: "28px",
                                          height: "28px",
                                        }}
                                      >
                                        {qIndex + 1}
                                      </span>
                                      <div className="flex-grow-1">
                                        <div className="text-dark mb-2" style={{ lineHeight: 1.4, fontSize: "0.95rem" }}>
                                          {question.questionText}
                                        </div>
                                        <span
                                          className="px-3 py-1 rounded-pill"
                                          style={{
                                            background: answerColor,
                                            color: "white",
                                            fontSize: "0.75rem",
                                            fontWeight: 600,
                                          }}
                                        >
                                          {answerLabel}
                                        </span>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            ) : (
                              <div className="text-center py-4">
                                <AlertCircle size={32} className="mb-2" style={{ color: "#6c757d" }} />
                                <p className="mb-0" style={{ color: "#6c757d" }}>No answers provided</p>
                              </div>
                            )}
                          </div>
                        )}
                      </Card.Body>
                    </div>
                  </Collapse>
                </Card>
              </Col>
            );
          })}
        </Row>

        {/* Action Area */}
        <div
          className="text-center mt-5 p-4 rounded-4 action-section"
          style={{
            background: "linear-gradient(135deg, #f8f9ff 0%, #e8f4ff 100%)",
            border: "2px solid rgba(43, 49, 118, 0.2)",
          }}
        >
          <h4 className="mb-3" style={{ color: "#2B3176" }}>
            Ready to Submit Your Assessment?
          </h4>
          <p className="mb-4" style={{ color: "#6c757d" }}>
            Please ensure all answers are correct before submitting. You can edit any section by clicking the "Edit" button.
          </p>

          <div className="d-flex gap-3 justify-content-center flex-wrap action-buttons">
            <Button
              variant="outline-secondary"
              size="lg"
              onClick={() => onEditSection(0)}
              className="px-4 py-2 rounded-pill"
              style={{
                border: "2px solid #6c757d",
                color: "#6c757d",
                background: "white",
              }}
            >
              ← Back to Assessment
            </Button>

            <Button
              size="lg"
              onClick={onSubmit}
              disabled={loading}
              className="px-4 py-2 rounded-pill"
              style={{
                background: loading
                  ? "linear-gradient(135deg, #6c757d 0%, #495057 100%)"
                  : "linear-gradient(135deg, #A41D31 0%, #EC2326 100%)",
                color: "white",
                border: "none",
                opacity: loading ? 0.7 : 1,
                boxShadow: loading ? "none" : "0 4px 16px rgba(236, 35, 38, 0.35)",
              }}
            >
              {loading ? (
                <>
                  <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                  Submitting...
                </>
              ) : (
                <>
                  <CheckCircle size={20} className="me-2" />
                  Submit Assessment
                </>
              )}
            </Button>

            <Button
              variant="outline-primary"
              size="lg"
              onClick={handlePreviewDocument}
              disabled={isGeneratingPdf}
              className="px-4 py-2 rounded-pill"
              style={{
                background: "white",
                color: "#2B3176",
                border: "2px solid #2B3176",
              }}
            >
              {isGeneratingPdf ? (
                <>
                  <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                  Generating...
                </>
              ) : (
                <>
                  <Eye size={20} className="me-2" />
                  Preview Answer Document
                </>
              )}
            </Button>
          </div>
        </div>
      </Card.Body>

      {/* Document Preview Modal */}
      <Modal
        show={showPreview}
        onHide={() => {
          setShowPreview(false);
          setPdfBlob(null);
          setPdfUrl(null);
        }}
        size="lg"
        centered
      >
        <Modal.Header
          closeButton
          style={{ background: "#f8f9ff", borderBottom: "2px solid #2B3176" }}
        >
          <Modal.Title style={{ color: "#2B3176", fontWeight: "bold" }}>
            <Eye size={24} className="me-2 mb-1" />
            Document Preview
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-0" style={{ background: "#e9ecef" }}>
          {pdfUrl ? (
            <PDFViewer pdfUrl={pdfUrl} />
          ) : (
            <div
              className="d-flex justify-content-center align-items-center"
              style={{ height: "70vh", color: "#6c757d" }}
            >
              <Spinner animation="border" className="me-2" />
              Loading Preview...
            </div>
          )}
        </Modal.Body>
        <Modal.Footer style={{ background: "#f8f9ff", borderTop: "1px solid #dee2e6" }}>
          <Button
            variant="outline-secondary"
            onClick={() => {
              setShowPreview(false);
              setPdfBlob(null);
              setPdfUrl(null);
            }}
            className="rounded-pill"
          >
            Close
          </Button>
          <Button
            onClick={() => {
              saveAnswersAsDocument({
                formData,
                programScores,
                currentSection: sections.length - 1,
                sections,
                currentUser: currentUser as User,
                questions,
              });
            }}
            className="d-flex align-items-center rounded-pill"
            style={{
              background: "linear-gradient(135deg, #2B3176 0%, #1C6CB3 100%)",
              border: "none",
              boxShadow: "0 4px 16px rgba(43, 49, 118, 0.35)",
            }}
          >
            <Download size={18} className="me-2" />
            Download PDF
          </Button>
        </Modal.Footer>
      </Modal>
    </Card>
  );
};

export default ReviewSection;