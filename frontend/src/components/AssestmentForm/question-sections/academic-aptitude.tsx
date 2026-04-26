import React from "react";
import { Card, Row, Col, Badge, Form, Button } from "react-bootstrap";
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";
import SectionHeader from "../section-header";
import AssessmentActionFooter from "../assessment-action-footer";
import type { AssessmentSectionProps } from "../types";

const AcademicAptitudeSection: React.FC<AssessmentSectionProps> = ({
  questions,
  formData,
  onChange,
  onNext,
  onPrevious,
  onReset,
  currentSection,
  currentQuestionIndex,
  setCurrentQuestionIndex,
  totalSections,
}) => {
  const currentIndex = currentQuestionIndex;
  const currentQuestion = questions[currentIndex] || {
    questionText: "Loading...",
  };

  const calculateProgress = () => {
    const answered = questions.filter(
      (q) => typeof formData.academicAptitude[q.questionText] === "number",
    ).length;
    return Math.round((answered / questions.length) * 100);
  };

  const isComplete = calculateProgress() === 100;

  const labelMap = [
    "Strongly Agree",
    "Agree",
    "Neutral",
    "Disagree",
    "Strongly Disagree",
  ];

  return (
    <Card
      className="border-0 shadow-lg"
      style={{
        maxWidth: "1300px",
        width: "100%",
        borderRadius: "16px",
        overflow: "hidden",
      }}
    >
      <SectionHeader
        title="Academic Aptitude"
        icon={<BookOpen size={30} />}
        variant="primary"
        currentQuestionIndex={currentIndex}
        totalQuestions={questions.length}
        sectionType="academicAptitude"
      />

      <Card.Body className="p-4 p-md-5">
        {/* Progress header */}
        <Row className="align-items-center mb-4">
          <Col md={4} className="mb-2">
            <Badge
              className="fs-6 p-3"
              style={{
                background: "linear-gradient(135deg, #2B3176, #1C6CB3)",
                color: "white",
                fontWeight: "600",
                fontSize: "0.9rem",
              }}
            >
              Question {currentIndex + 1} of {questions.length}
            </Badge>
          </Col>
          <Col xs={12} md={4} className="text-center mb-2 mb-md-0">
            <div className="d-flex gap-2 justify-content-center">
              <Button
                variant="outline-primary"
                size="lg"
                onClick={() =>
                  setCurrentQuestionIndex(Math.max(0, currentIndex - 1))
                }
                disabled={currentIndex === 0}
                className="px-3 py-1 rounded-pill"
                style={{
                  borderColor: currentIndex === 0 ? "#d1d5db" : "#1C6CB3",
                  color: currentIndex === 0 ? "#9ca3af" : "#1C6CB3",
                  fontSize: "0.85rem",
                }}
              >
                <ChevronLeft size={14} /> Previous
              </Button>
              {currentIndex < questions.length - 1 && (
                <Button
                  variant="outline-primary"
                  size="lg"
                  onClick={() =>
                    setCurrentQuestionIndex(
                      Math.min(questions.length - 1, currentIndex + 1),
                    )
                  }
                  className="px-3 py-1 rounded-pill"
                  style={{
                    borderColor: "#1C6CB3",
                    color: "#1C6CB3",
                    fontSize: "0.85rem",
                  }}
                >
                  Next <ChevronRight size={14} />
                </Button>
              )}
            </div>
          </Col>
          <Col xs={12} md={4} className="text-md-end">
            <div
              className="d-inline-flex align-items-center gap-2 px-3 py-2 rounded-pill"
              style={{
                background: isComplete
                  ? "rgba(28, 108, 179, 0.1)"
                  : "rgba(43, 49, 118, 0.04)",
                border: isComplete
                  ? "1px solid rgba(28, 108, 179, 0.3)"
                  : "1px solid rgba(43, 49, 118, 0.15)",
                fontWeight: "600",
                fontSize: "0.85rem",
              }}
            >
              {isComplete && (
                <CheckCircle2 size={14} style={{ color: "#1C6CB3" }} />
              )}
              <span style={{ color: isComplete ? "#1C6CB3" : "#2B3176" }}>
                {calculateProgress()}% Complete
              </span>
            </div>
          </Col>
        </Row>

        {/* Progress bar */}
        <div
          className="w-100 rounded-pill overflow-hidden mb-4 mb-md-5"
          style={{ height: "10px", background: "#e5e7eb" }}
        >
          <div
            className="h-100 rounded-pill"
            style={{
              width: `${calculateProgress()}%`,
              background: isComplete
                ? "#1C6CB3"
                : "linear-gradient(135deg, #2B3176, #1C6CB3)",
              transition: "width 0.4s ease",
              boxShadow: isComplete
                ? "0 0 8px rgba(28, 108, 179, 0.3)"
                : "none",
            }}
          />
        </div>

        {/* Completion message */}
        {isComplete && (
          <div className="text-center mb-4">
            <div
              className="d-inline-flex align-items-center gap-2 px-4 py-2 rounded-pill"
              style={{
                background: "rgba(34, 197, 94, 0.1)",
                border: "1px solid rgba(34, 197, 94, 0.3)",
              }}
            >
              <CheckCircle2 size={18} style={{ color: "#22c55e" }} />
              <span
                style={{
                  color: "#166534",
                  fontWeight: "600",
                  fontSize: "0.9rem",
                }}
              >
                Section Complete!
              </span>
            </div>
          </div>
        )}

        {/* Question */}
        <div className="text-center mb-4 mb-md-5">
          <Form.Label
            className="h3 mb-4 d-block fw-bold"
            style={{ color: "#2B3176", fontSize: "1.9rem" }}
          >
            {currentQuestion.questionText}
          </Form.Label>
        </div>

        {/* Answer options */}
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="d-grid gap-2 gap-md-3">
              {[1, 2, 3, 4, 5].map((val) => {
                const isSelected =
                  formData.academicAptitude[currentQuestion.questionText] ===
                  val;
                return (
                  <label
                    key={val}
                    className="d-flex align-items-center p-3 p-md-4 rounded-3 text-start mb-2"
                    style={{
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      backgroundColor: isSelected
                        ? "rgba(28, 108, 179, 0.08)"
                        : "white",
                      borderColor: isSelected ? "#1C6CB3" : "#D1D5DB",
                      borderWidth: "1.5px",
                      borderStyle: "solid",
                      boxShadow: isSelected
                        ? "0 2px 8px rgba(28, 108, 179, 0.15)"
                        : "none",
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.backgroundColor = "#f8f9fa";
                        e.currentTarget.style.borderColor = "#1C6CB3";
                        e.currentTarget.style.boxShadow =
                          "0 2px 8px rgba(28, 108, 179, 0.1)";
                        e.currentTarget.style.transform = "translateY(-2px)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.backgroundColor = "white";
                        e.currentTarget.style.borderColor = "#D1D5DB";
                        e.currentTarget.style.boxShadow = "none";
                        e.currentTarget.style.transform = "translateY(0)";
                      }
                    }}
                  >
                    <input
                      type="radio"
                      name={`academic-q-${currentIndex}`}
                      id={`academic-${currentIndex}-${val}`}
                      checked={isSelected}
                      onChange={() => {
                        onChange(
                          "academicAptitude",
                          currentQuestion.questionText,
                          val,
                          currentQuestion.program,
                        );
                        if (currentIndex < questions.length - 1) {
                          setTimeout(() => {
                            setCurrentQuestionIndex(currentIndex + 1);
                          }, 250);
                        }
                      }}
                      style={{ display: "none" }}
                    />
                    <span
                      className="d-inline-flex align-items-center justify-content-center me-3 rounded-circle"
                      style={{
                        width: "22px",
                        height: "22px",
                        minWidth: "22px",
                        minHeight: "22px",
                        borderColor: isSelected ? "#1C6CB3" : "#D1D5DB",
                        borderWidth: "2px",
                        borderStyle: "solid",
                        transition: "all 0.2s ease",
                      }}
                    >
                      {isSelected && (
                        <span
                          className="rounded-circle"
                          style={{
                            width: "12px",
                            height: "12px",
                            backgroundColor: "#1C6CB3",
                            transition: "all 0.2s ease",
                          }}
                        />
                      )}
                    </span>
                    <span
                      style={{
                        color: isSelected ? "#2B3176" : "#374151",
                        fontWeight: isSelected ? "600" : "400",
                        fontSize: "1rem",
                      }}
                    >
                      {labelMap[val - 1]}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* Tip - only show when not complete */}
        {!isComplete && (
          <div
            className="mt-5 p-3 rounded-3 text-center"
            style={{
              background: "rgba(28, 108, 179, 0.05)",
              border: "1px solid rgba(28, 108, 179, 0.15)",
            }}
          >
            <p
              className="small mb-0"
              style={{ fontSize: "0.82rem", color: "#2B3176" }}
            >
              💡 <strong>Tip:</strong> Select the option that best represents
              your honest self-assessment for each statement.
            </p>
          </div>
        )}
      </Card.Body>

      {/* Assessment Action Footer - only shows when all questions answered */}
      {isComplete && (
        <AssessmentActionFooter
          currentSection={currentSection}
          totalSections={totalSections}
          onPrevious={onPrevious}
          onNext={onNext}
          onReset={onReset}
          isLastSection={currentSection === totalSections - 1}
          isComplete={calculateProgress() === 100}
          nextLabel="Technical Skills and Interests →"
        />
      )}
    </Card>
  );
};

export default AcademicAptitudeSection;
