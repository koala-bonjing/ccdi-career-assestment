// src/components/AssessmentForm/CareerInterestSection.tsx
import {
  Card,
  Row,
  Col,
  Badge,
  ProgressBar,
  Form,
  Button,
} from "react-bootstrap";
import { ChevronLeft, ChevronRight, Eye } from "lucide-react";
import SectionHeader from "../section-header";
import AssessmentActionFooter from "../assessment-action-footer";
import type { AssessmentSectionProps } from "../types";

const CareerInterestSection: React.FC<AssessmentSectionProps> = ({
  questions,
  formData,
  onChange,
  onNext,
  onPrevious,
  onReset,
  currentSection,
  totalSections,
  currentQuestionIndex,
  setCurrentQuestionIndex,
}) => {
  const currentIndex = currentQuestionIndex;
  const currentQuestion = questions[currentIndex] || {
    questionText: "Loading...",
  };

  const calculateProgress = () => {
    const answered = questions.filter(
      (q) => typeof formData.careerInterest[q.questionText] === "number"
    ).length;
    return Math.round((answered / questions.length) * 100);
  };

  // Labels aligned with your original `choiceLabels` mapping:
  // 1: "Strongly Matches", 2: "Matches", ..., 5: "Does Not Match"
  const labelMap = [
    "Strongly Matches",
    "Matches",
    "Neutral",
    "Partially Matches",
    "Does Not Match",
  ];

  return (
    <Card
      className="border-0 shadow-lg w-100"
      style={{
        maxWidth: "1300px",
        width: "100%",
        borderRadius: "16px",
        overflow: "hidden",
        marginTop: "50px",
        marginBottom: "50px",
      }}
    >
      <SectionHeader
        title="Career Interest"
        icon={<Eye size={28} />}
        variant="info"
        currentQuestionIndex={currentIndex}
        totalQuestions={questions.length}
        sectionType="careerInterest"
      />

      <Card.Body className="p-5">
        <Row className="align-items-center mb-4">
          <Col md={4} className="mb-2">
            <Badge bg="info" className="fs-6 p-3">
              Question {currentIndex + 1} of {questions.length}
            </Badge>
          </Col>
          <Col md={4} className="text-center">
            <div className="d-flex gap-2 justify-content-center">
              <Button
                variant="outline-primary"
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
                variant="outline-primary"
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
          variant="info"
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
              {[1, 2, 3, 4, 5].map((val) => (
                <Form.Check
                  key={val}
                  type="radio"
                  name={`career-q-${currentIndex}`}
                  id={`career-${currentIndex}-${val}`}
                  label={
                    <span className="fs-5">
                      {val} — {labelMap[val - 1]}
                    </span>
                  }
                  checked={
                    formData.careerInterest[currentQuestion.questionText] ===
                    val
                  }
                  onChange={() =>
                    onChange(
                      "careerInterest",
                      currentQuestion.questionText,
                      val,
                      currentQuestion.program
                    )
                  }
                  className="p-4 border rounded-3 hover-shadow text-start form-option fs-5"
                />
              ))}
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
        nextLabel="Next Section →"
      />
    </Card>
  );
};

export default CareerInterestSection;
