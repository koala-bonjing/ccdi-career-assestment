// src/components/AssessmentForm/ReviewSection.tsx
import React from "react";
import { Card, Row, Col, Badge, Button, Spinner } from "react-bootstrap";
import {
  Eye,
  Edit,
  CheckCircle,
  AlertCircle,
  Download,
  CircleCheck,
} from "lucide-react";
import type { Question, AssessmentAnswers, User } from "../../types";
import { categoryTitles, sections } from "../../config/constants";
import { saveAnswersAsDocument } from "../../hooks/saveAnswersAsDocument";
import { type ProgramScores } from "./types";

interface ReviewSectionProps {
  formData: AssessmentAnswers;
  questions: {
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
  const getQuestionsBySection = (sectionKey: string): Question[] => {
    switch (sectionKey) {
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
    _question: string,
    value: number | boolean | null | undefined,
  ): string => {
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
      return value === true ? "Selected ✓" : "Not Selected";
    }
    return "Not Answered";
  };

  const getAnswerColor = (
    sectionKey: keyof AssessmentAnswers,
    value: number | boolean | null | undefined,
  ): string => {
    if (
      sectionKey === "technicalSkills" ||
      sectionKey === "learningWorkStyle"
    ) {
      return value === true ? "#28a745" : "#6c757d";
    }

    if (typeof value === "number") {
      const colors = [
        "#28a745", // Strongly Agree/Matches (1)
        "#20c997", // Agree/Matches (2)
        "#6c757d", // Neutral (3)
        "#fd7e14", // Disagree/Partially Matches (4)
        "#dc3545", // Strongly Disagree/Does Not Match (5)
      ];
      return colors[value - 1] || "#6c757d";
    }

    return "#6c757d";
  };

  const sectionColors = [
    {
      bg: "linear-gradient(135deg, #2B3176 0%, #1C6CB3 100%)",
      text: "white",
      accent: "#A41D31",
    },
    {
      bg: "linear-gradient(135deg, #EC2326 0%, #A41D31 100%)",
      text: "white",
      accent: "#2B3176",
    },
    {
      bg: "linear-gradient(135deg, #1C6CB3 0%, #2B3176 100%)",
      text: "white",
      accent: "#EC2326",
    },
    {
      bg: "linear-gradient(135deg, #EC2326 0%, #A41D31 100%)",
      text: "white",
      accent: "#2B3176",
    },
  ];

  const getSectionCompletion = (sectionKey: string) => {
    const sectionQuestions = getQuestionsBySection(sectionKey);
    const answeredCount = sectionQuestions.filter((q) => {
      const answer =
        formData[sectionKey as keyof AssessmentAnswers][q.questionText];

      // Different validation for each section type
      if (
        sectionKey === "academicAptitude" ||
        sectionKey === "careerInterest"
      ) {
        return typeof answer === "number" && answer >= 1 && answer <= 5;
      }
      if (
        sectionKey === "technicalSkills" ||
        sectionKey === "learningWorkStyle"
      ) {
        return answer === true; // Checkbox selected
      }
      return false;
    }).length;

    const totalCount = sectionQuestions.length;

    return {
      answeredCount,
      totalCount,
      percentage: Math.round((answeredCount / totalCount) * 100),
    };
  };

  // Group learning work style questions by category for better display
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

  return (
    <Card className="border-0 shadow-lg review-card">
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
                border: "2px solid #2B3176",
              }}
            >
              <Card.Body className="p-4">
                <h5
                  className="fw-bold mb-3 text-center"
                  style={{ color: "#2B3176" }}
                >
                  Assessment Progress Summary
                </h5>
                <Row className="g-3">
                  {sections.map((sectionKey, idx) => {
                    const completion = getSectionCompletion(sectionKey);
                    const isComplete = completion.answeredCount > 0;

                    return (
                      <Col md={3} key={sectionKey}>
                        <div
                          className="d-flex flex-column p-3 rounded text-center"
                          style={{
                            background: "white",
                            border: `2px solid ${isComplete ? sectionColors[idx].accent : "#e9ecef"}`,
                            height: "100%",
                          }}
                        >
                          <div className="mb-2">
                            <span
                              className="fw-bold d-block"
                              style={{
                                color: "#2B3176",
                                fontSize: "0.9rem",
                              }}
                            >
                              {categoryTitles[sectionKey]}
                            </span>
                          </div>
                          <div className="mt-auto">
                            <Badge
                              style={{
                                background: isComplete
                                  ? "linear-gradient(135deg, #28a745 0%, #20c997 100%)"
                                  : "linear-gradient(135deg, #6c757d 0%, #495057 100%)",
                                color: "white",
                                border: "none",
                              }}
                              className="fs-6 p-2 w-100"
                            >
                              {completion.answeredCount}/{completion.totalCount}
                            </Badge>
                          </div>
                        </div>
                      </Col>
                    );
                  })}
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Answer Grid */}
        <Row className="g-4 review-answers-grid">
          {sections.map((sectionKey, sectionIndex) => {
            const sectionQuestions = getQuestionsBySection(sectionKey);
            const answeredQuestions = sectionQuestions.filter((q) => {
              const answer =
                formData[sectionKey as keyof AssessmentAnswers][q.questionText];

              // Different logic for different section types
              if (
                sectionKey === "academicAptitude" ||
                sectionKey === "careerInterest"
              ) {
                return typeof answer === "number" && answer >= 1 && answer <= 5;
              }
              if (
                sectionKey === "technicalSkills" ||
                sectionKey === "learningWorkStyle"
              ) {
                return answer === true; // Checkbox is checked
              }
              return false;
            });

            const color = sectionColors[sectionIndex];

            const learningStyleGroups = groupLearningStyleQuestions();

            return (
              <Col xl={6} lg={12} key={sectionKey}>
                <Card className="h-100 shadow-sm review-section-card border-0">
                  <Card.Header
                    className="d-flex justify-content-between align-items-center py-3"
                    style={{
                      background: color.bg,
                      color: color.text,
                      borderBottom: `3px solid ${color.accent}`,
                    }}
                  >
                    <div>
                      <h5 className="mb-0 fw-bold">
                        {categoryTitles[sectionKey]}
                      </h5>
                    </div>
                    <Button
                      variant="light"
                      size="sm"
                      onClick={() => onEditSection(sectionIndex)}
                      className="fw-bold"
                      style={{
                        background: "rgba(255, 255, 255, 0.9)",
                        color: "#2B3176",
                        border: "2px solid rgba(255, 255, 255, 0.5)",
                      }}
                    >
                      <Edit size={16} className="me-1" />
                      Edit
                    </Button>
                  </Card.Header>

                  <Card.Body className="p-3 p-md-4 review-section-body h-100">
                    {sectionKey === "technicalSkills" ? (
                      <div className="technical-skills-review h-100">
                        <h6
                          className="fw-bold mb-3 text-center"
                          style={{ color: "#2B3176" }}
                        >
                          Selected Technical Skills ({answeredQuestions.length})
                        </h6>

                        {answeredQuestions.length > 0 ? (
                          <div className="skills-container">
                            {/* Treat all technical skills as one group */}
                            <div className="mb-4">
                              <div
                                className="d-flex align-items-center mb-2 p-2 rounded"
                                style={{
                                  background: "rgba(40, 167, 69, 0.1)",
                                  borderLeft: "4px solid #28a745",
                                }}
                              >
                                <Badge
                                  className="me-2"
                                  style={{
                                    background: color.bg,
                                    color: "white",
                                  }}
                                >
                                  1
                                </Badge>
                                <h6
                                  className="mb-0"
                                  style={{
                                    color: "#2B3176",
                                    fontSize: "0.95rem",
                                  }}
                                >
                                  Technical Competencies
                                  <small className="ms-2 text-muted">
                                    ({answeredQuestions.length} selected)
                                  </small>
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
                                    <Badge className="me-2 mt-1 flex-shrink-0">
                                      <CircleCheck size={15} />
                                    </Badge>
                                    <div className="flex-grow-1">
                                      <div
                                        className="text-dark mb-1"
                                        style={{
                                          lineHeight: 1.3,
                                          fontSize: "0.9rem",
                                        }}
                                      >
                                        {question.questionText}
                                      </div>
                                      <Badge
                                        className="px-2 py-1"
                                        style={{
                                          background: "#28a745",
                                          color: "white",
                                          fontSize: "0.75rem",
                                          fontWeight: 600,
                                          borderRadius: "4px",
                                        }}
                                      >
                                        ✓ Selected
                                      </Badge>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-4">
                            <div className="mb-3">
                              <AlertCircle
                                size={48}
                                style={{ color: "#6c757d" }}
                              />
                            </div>
                            <p className="mb-1" style={{ color: "#6c757d" }}>
                              No technical skills selected
                            </p>
                            <small className="text-muted">
                              Technical skills are selected via checkboxes
                            </small>
                          </div>
                        )}
                      </div>
                    ) : sectionKey === "learningWorkStyle" ? (
                      <div className="learning-style-review">
                        <h6
                          className="fw-bold mb-3 text-center"
                          style={{ color: "#2B3176" }}
                        >
                          Selected Preferences ({answeredQuestions.length})
                        </h6>

                        {answeredQuestions.length > 0 ? (
                          <div className="preferences-container">
                            {Object.entries(learningStyleGroups).map(
                              ([category, catQuestions], catIndex) => {
                                const answeredCatQuestions =
                                  catQuestions.filter(
                                    (q) =>
                                      formData.learningWorkStyle[
                                        q.questionText
                                      ] === true,
                                  );

                                if (answeredCatQuestions.length === 0)
                                  return null;

                                return (
                                  <div key={category} className="mb-4">
                                    <div
                                      className="d-flex align-items-center mb-2 p-2 rounded"
                                      style={{
                                        background: "rgba(40, 167, 69, 0.1)",
                                        borderLeft: "4px solid #28a745",
                                      }}
                                    >
                                      <Badge
                                        className="me-2"
                                        style={{
                                          background: color.bg,
                                          color: "white",
                                        }}
                                      >
                                        {catIndex + 1}
                                      </Badge>
                                      <h6
                                        className="mb-0"
                                        style={{
                                          color: "#2B3176",
                                          fontSize: "0.95rem",
                                        }}
                                      >
                                        {category}
                                        <small className="ms-2 text-muted">
                                          ({answeredCatQuestions.length} of{" "}
                                          {catQuestions.length} selected)
                                        </small>
                                      </h6>
                                    </div>

                                    <div className="ms-3">
                                      {answeredCatQuestions.map((question) => (
                                        <div
                                          key={question._id}
                                          className="d-flex align-items-start p-2 mb-2 rounded"
                                          style={{
                                            background:
                                              "rgba(248, 249, 255, 0.5)",
                                            border: "1px solid #dee2e6",
                                          }}
                                        >
                                          <Badge className="me-2 mt-1 flex-shrink-0">
                                            <CircleCheck size={15} />
                                          </Badge>
                                          <div className="flex-grow-1">
                                            <div
                                              className="text-dark mb-1"
                                              style={{
                                                lineHeight: 1.3,
                                                fontSize: "0.9rem",
                                              }}
                                            >
                                              {question.questionText}
                                            </div>
                                            <Badge
                                              className="px-2 py-1"
                                              style={{
                                                background: "#28a745",
                                                color: "white",
                                                fontSize: "0.75rem",
                                                fontWeight: 600,
                                                borderRadius: "4px",
                                              }}
                                            >
                                              ✓ Selected
                                            </Badge>
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
                            <div className="mb-3">
                              <AlertCircle
                                size={48}
                                style={{ color: "#6c757d" }}
                              />
                            </div>
                            <p className="mb-1" style={{ color: "#6c757d" }}>
                              No preferences selected
                            </p>
                            <small className="text-muted">
                              Learning & Work Style uses checkbox selections
                              (not ratings)
                            </small>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="review-questions-container">
                        <h6
                          className="fw-bold mb-3 text-center"
                          style={{ color: "#2B3176" }}
                        >
                          Questions & Answers ({answeredQuestions.length})
                        </h6>
                        {answeredQuestions.length > 0 ? (
                          <div>
                            {answeredQuestions.map((question, qIndex) => {
                              const answer =
                                formData[sectionKey as keyof AssessmentAnswers][
                                  question.questionText
                                ];
                              const answerColor = getAnswerColor(
                                sectionKey,
                                answer,
                              );
                              const answerLabel = getAnswerLabel(
                                sectionKey,
                                question.questionText,
                                answer,
                              );

                              return (
                                <div
                                  key={question._id}
                                  className="d-flex align-items-start p-3 mb-3 rounded"
                                  style={{
                                    background: "rgba(248, 249, 255, 0.5)",
                                    border: "1px solid #dee2e6",
                                  }}
                                >
                                  <Badge
                                    className="me-3 mt-1 flex-shrink-0"
                                    style={{
                                      background: color.bg,
                                      color: "white",
                                      fontSize: "0.85rem",
                                      minWidth: "32px",
                                      height: "32px",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      borderRadius: "6px",
                                    }}
                                  >
                                    {qIndex + 1}
                                  </Badge>
                                  <div className="flex-grow-1">
                                    <div
                                      className="text-dark mb-2"
                                      style={{
                                        lineHeight: 1.4,
                                        fontSize: "0.95rem",
                                      }}
                                    >
                                      {question.questionText}
                                    </div>
                                    <div className="d-flex align-items-center">
                                      <Badge
                                        className="px-3 py-1"
                                        style={{
                                          background: answerColor,
                                          color: "white",
                                          fontSize: "0.8rem",
                                          fontWeight: 600,
                                          borderRadius: "20px",
                                        }}
                                      >
                                        {answerLabel}
                                      </Badge>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="text-center py-4">
                            <AlertCircle
                              size={32}
                              className="mb-2"
                              style={{ color: "#6c757d" }}
                            />
                            <p className="mb-0" style={{ color: "#6c757d" }}>
                              No answers provided
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>

        {/* Action Area - Same as before */}
        <div
          className="text-center mt-5 p-4 rounded action-section"
          style={{
            background: "linear-gradient(135deg, #f8f9ff 0%, #e8f4ff 100%)",
            border: "2px solid #2B3176",
          }}
        >
          <h4 className="mb-3" style={{ color: "#2B3176" }}>
            Ready to Submit Your Assessment?
          </h4>
          <p className="mb-4" style={{ color: "#6c757d" }}>
            Please ensure all answers are correct before submitting. You can
            edit any section by clicking the "Edit" button.
          </p>

          <div className="d-flex gap-3 justify-content-center flex-wrap action-buttons">
            <Button
              variant="outline-secondary"
              size="lg"
              onClick={() => onEditSection(0)}
              className="px-4 py-2 action-btn"
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
              className="px-4 py-2 action-btn"
              style={{
                background: loading
                  ? "linear-gradient(135deg, #6c757d 0%, #495057 100%)"
                  : "linear-gradient(135deg, #28a745 0%, #20c997 100%)",
                color: "white",
                border: "none",
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-2"
                  />
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
              onClick={() => {
                saveAnswersAsDocument({
                  formData,
                  programScores,
                  currentSection: 3, // final section
                  sections,
                  currentUser: currentUser as User,
                });
              }}
              className="px-4 py-2 action-btn"
              style={{
                background: "white",
                color: "#2B3176",
                border: "2px solid #2B3176",
              }}
            >
              <Download size={20} className="me-2" />
              Save as Document
            </Button>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ReviewSection;
