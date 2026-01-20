// src/components/AssessmentForm/question-sections/prerequisites.tsx
import React from "react";
import {
  Card,
  Badge,
  ProgressBar,
  Form,
  Button,
  Row,
  Col,
} from "react-bootstrap";
import { ShieldCheck, Info, AlertCircle, CheckCircle2 } from "lucide-react";
import SectionHeader from "../section-header";
import AssessmentActionFooter from "../assessment-action-footer";
import type { AssessmentSectionProps } from "../types";

export const PrerequisitesSection: React.FC<AssessmentSectionProps> = ({
  questions,
  formData,
  onChange,
  onNext,
  onPrevious,
  onReset,
  currentSection,
  totalSections,
}) => {
  // ✅ ALGORITHM: Calculate progress
  const calculateProgress = () => {
    if (!questions.length) return 0;
    const answered = questions.filter(
      (q) => !!formData.prerequisites[q.questionText],
    ).length;
    return Math.round((answered / questions.length) * 100);
  };

  // ✅ ALGORITHM: Group questions by Program for a better Form UI
  const groupedQuestions = questions.reduce(
    (acc, q) => {
      const prog = q.program || "General";
      if (!acc[prog]) acc[prog] = [];
      acc[prog].push(q);
      return acc;
    },
    {} as Record<string, typeof questions>,
  );

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
        maxWidth: "1000px", // Narrower for better reading flow
        width: "100%",
        borderRadius: "16px",
      }}
    >
      <SectionHeader
        title="Foundational Readiness Profile"
        icon={<ShieldCheck size={30} />}
        variant="success"
        sectionType="prerequisites"
      />

      <Card.Body className="p-4 p-md-5">
        <div className="mb-5 text-center">
          <h4 className="fw-bold">Self-Assessment Checklist</h4>
          <p className="text-muted">
            Please rate your current skills and circumstances. This helps us
            determine which technical track fits your current foundations.
          </p>
          <div className="d-flex align-items-center justify-content-center gap-3 mt-3">
            <ProgressBar
              now={calculateProgress()}
              variant="success"
              style={{ height: "12px", width: "100%", borderRadius: "10px" }}
              className="flex-grow-1"
            />
            <Badge bg={isComplete ? "success" : "secondary"} className="p-2">
              {calculateProgress()}% Done
            </Badge>
          </div>
        </div>

        {/* Form Body */}
        <Form>
          {Object.entries(groupedQuestions).map(
            ([program, items], groupIndex) => (
              <div key={program} className="mb-5">
                <div className="d-flex align-items-center gap-2 mb-4 border-bottom pb-2">
                  <Badge bg="dark" className="rounded-circle p-2">
                    {groupIndex + 1}
                  </Badge>
                  <h5 className="mb-0 fw-bold text-uppercase letter-spacing-1">
                    {program} Readiness
                  </h5>
                </div>

                {/* ✅ 2x2 GRID Logic */}
                <Row xs={1} md={2} className="g-4 ">
                  {items.map((q) => {
                    const currentAnswer =
                      formData.prerequisites[q.questionText];
                    const isAnswered = !!currentAnswer;

                    return (
                      <Col key={q._id}>
                        <div
                          className={`h-100 p-3 rounded-4 transition-all border-2 ${
                            isAnswered
                              ? "bg-white border-success shadow-sm"
                              : "bg-white border-gray    shadow-sm"
                          }`}
                          style={{
                            transition: "all 0.3s ease",
                            borderLeftWidth: "6px !important",
                            borderLeftColor: isAnswered ? "#198754" : "#e9ecef",
                          }}
                        >
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <Form.Label
                              className={`fw-bold small mb-0 ${isAnswered ? "text-dark" : "text-secondary"}`}
                            >
                              {q.questionText}
                            </Form.Label>
                            {isAnswered && (
                              <CheckCircle2
                                size={16}
                                className="text-success flex-shrink-0 ms-2"
                              />
                            )}
                          </div>

                          {q.helperText && (
                            <div
                              className="d-flex align-items-start gap-1 text-muted mb-3"
                              style={{ fontSize: "0.75rem" }}
                            >
                              <Info size={12} className="mt-1 flex-shrink-0" />
                              <span>{q.helperText}</span>
                            </div>
                          )}

                          {/* Option Buttons */}
                          <div className="d-flex flex-wrap gap-1 mt-auto">
                            {labelMap!.map((option) => (
                              <Button
                                key={option}
                                variant={
                                  currentAnswer === option
                                    ? "success"
                                    : "outline-light"
                                }
                                className={`py-1 px-2 rounded-pill border shadow-none ${
                                  currentAnswer === option
                                    ? "text-white"
                                    : "text-muted hover-bg-light"
                                }`}
                                onClick={() =>
                                  onChange(
                                    "prerequisites",
                                    q.questionText,
                                    option,
                                  )
                                }
                                style={{
                                  fontSize: "0.7rem",
                                  fontWeight:
                                    currentAnswer === option ? "600" : "400",
                                  borderColor:
                                    currentAnswer === option
                                      ? "#198754"
                                      : "#f0f0f0",
                                }}
                              >
                                {option}
                              </Button>
                            ))}
                          </div>
                        </div>
                      </Col>
                    );
                  })}
                </Row>
              </div>
            ),
          )}
        </Form>

        {!isComplete && (
          <div className="alert alert-info d-flex align-items-center gap-3 rounded-4 border-0 shadow-sm mt-4">
            <AlertCircle className="flex-shrink-0" />
            <div>
              <strong>Almost there!</strong> Please answer all questions to
              proceed to the Academic Aptitude section.
            </div>
          </div>
        )}
      </Card.Body>

      <AssessmentActionFooter
        currentSection={currentSection}
        totalSections={totalSections}
        onPrevious={onPrevious}
        onNext={onNext}
        onReset={onReset}
        isLastSection={currentSection === totalSections - 1}
        isComplete={isComplete}
        nextLabel="Continue to Academic Aptitude →"
      />
      <style>{`
        .transition-all:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 15px rgba(0,0,0,0.05) !important;
            border-color: #dee2e6 !important;
        }
        .hover-bg-light:hover {
            background-color: #f8f9fa !important;
            color: #198754 !important;
            border-color: #198754 !important;
        }
      `}</style>
    </Card>
  );
};
