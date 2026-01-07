// src/components/AssessmentForm/ReviewSection.tsx
import React from "react";
import { Card, Row, Col, Badge, Button, Spinner } from "react-bootstrap";
import { Eye, Edit, CheckCircle, AlertCircle, Download } from "lucide-react";
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
    learningStyle: Question[];
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
      case "learningStyle":
        return questions.learningStyle || [];
      default:
        return [];
    }
  };

  const getAnswerLabel = (
    sectionKey: keyof AssessmentAnswers,
    _question: string,
    value: number | boolean | null | undefined
  ): string => {
    if (
      sectionKey === "academicAptitude" ||
      sectionKey === "careerInterest" ||
      sectionKey === "learningStyle"
    ) {
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
    if (sectionKey === "technicalSkills") {
      return value === true ? "Yes" : "No";
    }
    return "Not answered";
  };

  const sectionColors = [
    { bg: "linear-gradient(135deg, #2B3176 0%, #1C6CB3 100%)", text: "white" },
    { bg: "linear-gradient(135deg, #EC2326 0%, #A41D31 100%)", text: "white" },
    { bg: "linear-gradient(135deg, #1C6CB3 0%, #2B3176 100%)", text: "white" },
    { bg: "linear-gradient(135deg, #A41D31 0%, #EC2326 100%)", text: "white" },
  ];

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
          <Col md={8} className="mx-auto">
            <Card
              className="border-0"
              style={{
                background: "linear-gradient(135deg, #f8f9ff 0%, #e8f4ff 100%)",
                border: "2px solid #2B3176",
              }}
            >
              <Card.Body className="text-center p-4">
                <h5 className="fw-bold mb-3" style={{ color: "#2B3176" }}>
                  Assessment Progress Summary
                </h5>
                <Row className="g-3">
                  {sections.map((sectionKey) => {
                    const sectionQuestions = getQuestionsBySection(sectionKey);
                    const answeredCount = sectionQuestions.filter((q) => {
                      const answer = formData[sectionKey][q.questionText];
                      if (
                        sectionKey === "academicAptitude" ||
                        sectionKey === "careerInterest" ||
                        sectionKey === "learningStyle"
                      ) {
                        return (
                          typeof answer === "number" &&
                          answer >= 1 &&
                          answer <= 5
                        );
                      }
                      if (sectionKey === "technicalSkills") {
                        return answer === true;
                      }
                      return false;
                    }).length;
                    const totalCount = sectionQuestions.length;

                    return (
                      <Col md={6} key={sectionKey}>
                        <div
                          className="d-flex justify-content-between align-items-center p-3 rounded"
                          style={{
                            background: "white",
                            border: "2px solid #e9ecef",
                          }}
                        >
                          <span
                            className="fw-semibold"
                            style={{ color: "#2B3176" }}
                          >
                            {categoryTitles[sectionKey]}
                          </span>
                          <Badge
                            style={{
                              background:
                                answeredCount === totalCount
                                  ? "linear-gradient(135deg, #A41D31 0%, #EC2326 100%)"
                                  : "linear-gradient(135deg, #1C6CB3 0%, #2B3176 100%)",
                              color: "white",
                              border: "none",
                            }}
                            className="fs-6 p-2"
                          >
                            {answeredCount}/{totalCount}
                          </Badge>
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
              const answer = formData[sectionKey][q.questionText];
              if (
                sectionKey === "academicAptitude" ||
                sectionKey === "careerInterest" ||
                sectionKey === "learningStyle"
              ) {
                return typeof answer === "number" && answer >= 1 && answer <= 5;
              }
              if (sectionKey === "technicalSkills") {
                return answer === true;
              }
              return false;
            });
            const color = sectionColors[sectionIndex];

            return (
              <Col xl={6} lg={12} key={sectionKey}>
                <Card className="h-100 shadow-sm review-section-card">
                  <Card.Header
                    className="d-flex justify-content-between align-items-center py-3"
                    style={{
                      background: color.bg,
                      color: color.text,
                      borderBottom: `3px solid ${
                        sectionIndex === 1 ? "#2B3176" : "#EC2326"
                      }`,
                    }}
                  >
                    <h5 className="mb-0 fw-bold">
                      {categoryTitles[sectionKey]}
                    </h5>
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

                  <Card.Body className="p-3 p-md-4 review-section-body">
                    {sectionKey === "technicalSkills" ? (
                      <div className="technical-skills-review">
                        <h6
                          className="fw-bold mb-3 text-center"
                          style={{ color: "#2B3176" }}
                        >
                          Selected Technical Skills ({answeredQuestions.length})
                        </h6>
                        {answeredQuestions.length > 0 ? (
                          <div className="skills-container">
                            <div className="d-flex flex-wrap gap-2 justify-content-center skills-badge-container">
                              {answeredQuestions.map((skill) => (
                                <Badge
                                  key={skill._id}
                                  className="skill-badge"
                                  style={{
                                    background:
                                      "linear-gradient(135deg, #A41D31 0%, #EC2326 100%)",
                                    color: "white",
                                    border: "2px solid #2B3176",
                                  }}
                                >
                                  {skill.questionText}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div
                            className="text-center py-3"
                            style={{ color: "#6c757d" }}
                          >
                            <AlertCircle size={32} className="mb-2" />
                            <p className="mb-0">No technical skills selected</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="review-questions-container">
                        <h6
                          className="fw-bold mb-3 text-center small"
                          style={{ color: "#2B3176" }}
                        >
                          Questions & Answers ({answeredQuestions.length})
                        </h6>
                        {answeredQuestions.length > 0 ? (
                          <div className="small">
                            {answeredQuestions.map((question, qIndex) => {
                              const answer =
                                formData[sectionKey][question.questionText];
                              return (
                                <div
                                  key={question._id}
                                  className="d-flex align-items-start py-1 border-bottom border-light pb-2"
                                  style={{
                                    fontSize: "0.95rem",
                                    border: "3px solid black",
                                    padding: "8px",
                                  }}
                                >
                                  <Badge
                                    className="me-2 mt-1 flex-shrink-0"
                                    style={{
                                      background:
                                        sectionColors[sectionIndex].bg,
                                      color: "white",
                                      fontSize: "0.75rem",
                                      width: "24px",
                                      height: "24px",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      borderRadius: "50%",
                                      border: "1.5px solid black",
                                    }}
                                  >
                                    {qIndex + 1}
                                  </Badge>
                                  <div className="flex-grow-1">
                                    <div
                                      className="text-dark fw-medium mb-1"
                                      style={{ lineHeight: 1.3 }}
                                    >
                                      {question.questionText.length > 70
                                        ? `${question.questionText.substring(
                                            0,
                                            70
                                          )}…`
                                        : question.questionText}
                                    </div>
                                    <Badge
                                      className="px-2 py-1"
                                      style={{
                                        background: "rgba(43, 49, 118, 0.1)",
                                        color: "#ffffffff",
                                        fontSize: "0.8rem",
                                        fontWeight: 500,
                                        borderRadius: "6px",
                                      }}
                                    >
                                      {getAnswerLabel(
                                        sectionKey,
                                        question.questionText,
                                        answer
                                      )}
                                    </Badge>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="text-center py-2 small text-muted">
                            <AlertCircle size={18} className="mb-1" />
                            <div>No answers</div>
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

        {/* Action Area */}
        <div
          className="text-center mt-5 p-4 rounded action-section"
          style={{
            background: "linear-gradient(135deg, #f8f9ff 0%, #e8f4ff 100%)",
            border: "3px solid #2B3176",
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
                  : "linear-gradient(135deg, #A41D31 0%, #EC2326 100%)",
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
