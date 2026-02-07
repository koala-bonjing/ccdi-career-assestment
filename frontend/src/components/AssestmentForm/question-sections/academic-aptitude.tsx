// src/components/AssessmentForm/AcademicAptitudeSection.tsx
import React from "react";
import {
  Card,
  Row,
  Col,
  Badge,
  ProgressBar,
  Form,
  Button,
} from "react-bootstrap";
import { BookOpen, ChevronLeft, ChevronRight } from "lucide-react";
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

  const labelMap = [
    "Strongly Agree",
    "Agree",
    "Neutral",
    "Disagree",
    "Strongly Disagree",
  ];

  return (
    <Card
      className="border-0 shadow-lg "
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
        <Row className="align-items-center mb-4">
          <Col md={4} className="mb-2">
            <Badge bg="info" className="fs-6 p-3">
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
                className="px-3 py-1"
              >
                <ChevronLeft size={14} /> Previous
              </Button>
              <Button
                variant="outline-primary"
                size="lg"
                onClick={() =>
                  setCurrentQuestionIndex(
                    Math.min(questions.length - 1, currentIndex + 1),
                  )
                }
                disabled={currentIndex === questions.length - 1}
                className="px-3 py-1"
              >
                Next <ChevronRight size={14} />
              </Button>
            </div>
          </Col>
          <Col xs={12} md={4} className="text-md-end">
            <Badge bg="light" text="dark" className="fs-6 p-2">
              {calculateProgress()}% Complete
            </Badge>
          </Col>
        </Row>

        <ProgressBar
          now={calculateProgress()}
          className="mb-4 mb-md-5"
          variant="primary"
          style={{ height: "10px", borderRadius: "5px" }}
        />

        <div className="text-center mb-4 mb-md-5">
          <Form.Label className="h3 mb-4 text-dark d-block fw-bold">
            {currentQuestion.questionText}
          </Form.Label>
        </div>

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
                    className="d-flex align-items-center p-3 p-md-4 border border-secondary rounded-3 text-start fs-5 mb-2"
                    style={{
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      backgroundColor: isSelected ? "#e7f1ff" : "white",
                      borderColor: isSelected ? "#0d6efd" : "#ced4da",
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.backgroundColor = "#f8f9fa";
                        e.currentTarget.style.borderColor = "#adb5bd";
                        e.currentTarget.style.boxShadow =
                          "0 2px 6px rgba(0,0,0,0.1)";
                        e.currentTarget.style.transform = "translateY(-2px)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.backgroundColor = "white";
                        e.currentTarget.style.borderColor = "#ced4da";
                        e.currentTarget.style.boxShadow = "none";
                        e.currentTarget.style.transform = "translateY(0)";
                      }
                    }}
                  >
                    {/* Hidden radio input */}
                    <input
                      type="radio"
                      name={`academic-q-${currentIndex}`}
                      id={`academic-${currentIndex}-${val}`}
                      checked={isSelected}
                      onChange={() => {
                        // Save the answer
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
                      style={{ display: "none" }} // Use inline style instead of class
                    />
                    {/* Custom radio indicator */}
                    <span
                      className="d-inline-flex align-items-center justify-content-center me-3 rounded-circle border"
                      style={{
                        width: "20px",
                        height: "20px",
                        minWidth: "20px", // Prevents shrinking
                        minHeight: "20px",
                        borderColor: isSelected ? "#0d6efd" : "#ced4da",
                        borderWidth: "2px",
                        borderStyle: "solid",
                      }}
                    >
                      {isSelected && (
                        <span
                          className="rounded-circle"
                          style={{
                            width: "10px",
                            height: "10px",
                            backgroundColor: "#0d6efd",
                          }}
                        />
                      )}
                    </span>
                    {/* Text stays the same */}
                    <span className="text-dark">{labelMap[val - 1]}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>
      </Card.Body>

      <AssessmentActionFooter
        currentSection={currentSection}
        totalSections={totalSections}
        onPrevious={onPrevious}
        onNext={onNext}
        onReset={onReset}
        isLastSection={currentSection === totalSections - 1}
        isComplete={calculateProgress() === 100}
        nextLabel="Technicall Skills and Interests →"
      />
    </Card>
  );
};

export default AcademicAptitudeSection;
