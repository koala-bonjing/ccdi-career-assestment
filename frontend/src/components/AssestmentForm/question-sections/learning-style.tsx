// src/components/AssessmentForm/LearningStyleSection.tsx

import {
  Card,
  Row,
  Col,
  Badge,
  ProgressBar,
  Form,
  Button,
} from "react-bootstrap";
import { Brain, ChevronLeft, ChevronRight } from "lucide-react";
import SectionHeader from "../section-header";
import AssessmentActionFooter from "../assessment-action-footer";
import type { AssessmentSectionProps } from "../types";

const LearningStyleSection: React.FC<AssessmentSectionProps> = ({
  questions,
  formData,
  onChange,
  onNext,
  onPrevious,
  onReset,
  currentSection,
  totalSections,
  setCurrentQuestionIndex,
  currentQuestionIndex,
}) => {
  const currentIndex = currentQuestionIndex;
  const currentQuestion = questions[currentIndex] || {
    questionText: "Loading...",
  };

  const calculateProgress = () => {
    const answered = questions.filter(
      (q) => typeof formData.learningStyle[q.questionText] === "number"
    ).length;
    return Math.round((answered / questions.length) * 100);
  };

  // Same as Academic Aptitude (Agree/Disagree scale)
  const labelMap = [
    "Strongly Agree",
    "Agree",
    "Neutral",
    "Disagree",
    "Strongly Disagree",
  ];

  return (
    <Card
      className="border-0 shadow-lg w-100"
      style={{
        maxWidth: "1300px",
        borderRadius: "16px",
        overflow: "hidden",
        marginTop: "50px",
        marginBottom: "50px",
      }}
    >
      <SectionHeader
        title="Learning Style"
        icon={<Brain size={28} />}
        variant="success"
        currentQuestionIndex={currentIndex}
        totalQuestions={questions.length}
        sectionType="learningStyle"
      />

      <Card.Body className="p-5">
        <Row className="align-items-center mb-4">
          <Col md={4} className="mb-2">
            <Badge bg="success" className="fs-6 p-3">
              Question {currentIndex + 1} of {questions.length}
            </Badge>
          </Col>
          <Col md={4} className="text-center">
            <div className="d-flex gap-2 justify-content-center">
              <Button
                variant="outline-danger"
                size="lg"
                onClick={() =>
                  setCurrentQuestionIndex(Math.max(0, currentIndex - 1))
                }
                disabled={currentIndex === 0}
                className="px-3"
              >
                <ChevronLeft size={16} /> Previous
              </Button>
              <Button
                variant="outline-danger"
                size="lg"
                onClick={() =>
                  setCurrentQuestionIndex(Math.max(0, currentIndex + 1))
                }
                disabled={currentIndex === questions.length - 1}
                className="px-3"
              >
                Next <ChevronRight size={16} />
              </Button>
            </div>
          </Col>
          <Col md={4} className="text-end">
            <Badge bg="light" text="dark" className="fs-6 p-2">
              {calculateProgress()}% Complete
            </Badge>
          </Col>
        </Row>

        <ProgressBar
          now={calculateProgress()}
          className="mb-5"
          variant="success"
          style={{ height: "12px" }}
        />

        <div className="text-center mb-5">
          <Form.Label className="h3 mb-4 text-dark d-block fw-bold">
            {currentQuestion.questionText}
          </Form.Label>
        </div>

        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="d-grid gap-3">
              {[1, 2, 3, 4, 5].map((val) => {
                const isSelected =
                  formData.learningStyle[currentQuestion.questionText] === val;
                return (
                  <label
                    key={val}
                    className="d-flex align-items-center p-3 p-md-4 border border-secondary rounded-3 text-start fs-5 mb-2"
                    style={{ cursor: "pointer" }}
                  >
                    {/* Hidden radio input */}
                    <input
                      type="radio"
                      name={`academic-q-${currentIndex}`}
                      id={`academic-${currentIndex}-${val}`}
                      checked={isSelected}
                      onChange={() =>
                        onChange(
                          "learningStyle",
                          currentQuestion.questionText,
                          val,
                          currentQuestion.program
                        )
                      }
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
        nextLabel={
          calculateProgress() === 100
            ? "Review Answers"
            : "Complete All Questions"
        }
      />
    </Card>
  );
};

export default LearningStyleSection;
