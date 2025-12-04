// src/components/AssestmentForm/AssessmentForm.tsx
import React, { useState, useEffect, type JSX } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  ProgressBar,
  Modal,
  Alert,
  Spinner,
  Badge,
} from "react-bootstrap";
import { toast, ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./AssestmentForm.css";
import type {
  AssessmentAnswers,
  AssessmentFormProps,
  Question,
  User,
} from "../../types";
import {
  BookOpen,
  Wrench,
  Eye,
  Edit,
  ChevronLeft,
  ChevronRight,
  Download,
  Rocket,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { categoryTitles, sections, choiceLabels } from "../../config/constants";
import { useAssessmentValidation } from "../../hooks/useAssessmentValidation";
import NavigationBar from "../NavigationBarComponents/NavigationBar";
import { useAssessmentQuestions } from "../../hooks/useAssessmentQuestions";
import { saveAnswersAsDocument } from "../../hooks/saveAnswersAsDocument";
import { useEvaluationStore } from "../../../store/useEvaluationStore";

interface ProgramScores {
  BSCS: number;
  BSIT: number;
  BSIS: number;
  EE: number;
}

interface SectionColors {
  bg: string;
  text: string;
}

const AssessmentForm: React.FC<AssessmentFormProps> = ({
  currentUser,
  onSubmit,
  loading,
  restoredFormData,
  onStartNew,
}) => {
  const { updateAnswer, clearAllAnswers } = useEvaluationStore();
  const {
    questions,
    loading: questionsLoading,
    error,
  } = useAssessmentQuestions();

  const [formData, setFormData] = useState<AssessmentAnswers>(() => {
    if (restoredFormData) {
      console.log("🔄 Using restored form data");
      return restoredFormData;
    }

    try {
      const saved = localStorage.getItem("evaluation-answers");
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error("Error loading from localStorage:", error);
    }

    return {
      academicAptitude: {},
      technicalSkills: {},
      careerInterest: {},
      learningStyle: {},
    };
  });

  const [showResetModal, setShowResetModal] = useState<boolean>(false);
  const [currentSection, setCurrentSection] = useState<number>(() => {
    try {
      const savedSection = localStorage.getItem("currentAssessmentSection");
      return savedSection ? parseInt(savedSection) : 0;
    } catch {
      return 0;
    }
  });
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [showReview, setShowReview] = useState<boolean>(false);
  const [programScores, setProgramScores] = useState<ProgramScores>({
    BSCS: 0,
    BSIT: 0,
    BSIS: 0,
    EE: 0,
  });

  useEffect(() => {
    localStorage.setItem("evaluation-answers", JSON.stringify(formData));
    localStorage.setItem("currentAssessmentSection", currentSection.toString());
  }, [formData, currentSection]);

  const section = sections[currentSection];

  const getCurrentQuestions = (): Question[] => {
    if (!questions) return [];

    switch (section) {
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

  const currentQuestions = getCurrentQuestions();
  const currentQuestion = currentQuestions[currentQuestionIndex];

  const calculateProgress = (sectionKey: keyof AssessmentAnswers): number => {
    const sectionQuestions = getCurrentQuestions();
    if (!sectionQuestions.length) return 0;

    if (sectionKey === "technicalSkills") {
      const selectedCount = Object.values(formData[sectionKey]).filter(
        (val) => val === true
      ).length;
      return Math.round((selectedCount / sectionQuestions.length) * 100);
    } else {
      const answeredCount = sectionQuestions.filter((q) => {
        const answer = formData[sectionKey][q.questionText];
        return typeof answer === "number" && answer >= 1 && answer <= 5;
      }).length;
      return Math.round((answeredCount / sectionQuestions.length) * 100);
    }
  };

  const getSelectedSkillsCount = (): number => {
    return Object.values(formData.technicalSkills).filter((val) => val === true)
      .length;
  };

  const handleChange = (
    sectionKey: keyof AssessmentAnswers,
    questionText: string,
    value: number | boolean,
    program?: string
  ): void => {
    setFormData((prev) => ({
      ...prev,
      [sectionKey]: {
        ...prev[sectionKey],
        [questionText]: value,
      },
    }));

    const storeKey = `${sectionKey}.${questionText}`;
    updateAnswer(storeKey, value);

    if (typeof value === "number" && value >= 1 && value <= 5 && program) {
      setProgramScores((prev) => {
        const newScores = { ...prev };
        const scoreToAdd = (value - 1) * 2;
        newScores[program as keyof ProgramScores] += scoreToAdd;
        return newScores;
      });
    }
  };

  const isLearningStyleComplete = (): boolean => {
    if (section !== "learningStyle") return true;

    const learningAnswers = formData.learningStyle;
    const learningQuestions = questions?.learningStyle || [];

    return learningQuestions.every((question) => {
      const answer = learningAnswers[question.questionText];
      return typeof answer === "number" && answer >= 1 && answer <= 5;
    });
  };

  const handleStartNewAssessment = (): void => {
    setFormData({
      academicAptitude: {},
      technicalSkills: {},
      careerInterest: {},
      learningStyle: {},
    });

    setCurrentSection(0);
    setCurrentQuestionIndex(0);
    setShowReview(false);
    setProgramScores({
      BSCS: 0,
      BSIT: 0,
      BSIS: 0,
      EE: 0,
    });

    localStorage.removeItem("evaluation-answers");
    localStorage.removeItem("currentAssessmentSection");

    clearAllAnswers();

    if (onStartNew) {
      onStartNew();
    }

    console.log("🆕 Started new assessment - all data cleared");
  };

  const { validateSection } = useAssessmentValidation({
    formData,
    section: sections[currentSection],
    currentQuestions,
    setCurrentQuestionIndex,
    categoryTitles,
  });

  const handleNext = (): void => {
    if (validateSection()) {
      if (currentSection === 3 && !isLearningStyleComplete()) {
        toast.warning(
          "Please answer all Learning Style questions before proceeding.",
          {
            position: "top-right",
            autoClose: 3000,
            style: {
              backgroundColor: "rgba(236, 72, 153, 0.3)",
              backdropFilter: "blur(6px)",
              border: "2px solid #EC4899",
              color: "#fff",
              fontWeight: "bold",
              fontSize: "14px",
              borderRadius: "8px",
              fontFamily: "Poppins",
            },
            transition: Bounce,
          }
        );
        return;
      }

      if (currentSection < sections.length - 1) {
        setCurrentSection((prev) => prev + 1);
        setCurrentQuestionIndex(0);
      } else {
        setShowReview(true);
      }
    }
  };

  const handlePrevious = (): void => {
    if (currentSection > 0) {
      setCurrentSection((prev) => prev - 1);
      setCurrentQuestionIndex(0);
    }
  };

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    if (validateSection()) {
      const submissionData = {
        answers: formData,
        programScores,
        recommendedProgram: getRecommendedProgram(programScores),
      };
      onSubmit(submissionData);
    }
  };

  const getRecommendedProgram = (scores: ProgramScores): string => {
    const entries = Object.entries(scores);
    const highest = entries.reduce((max, current) =>
      current[1] > max[1] ? current : max
    );
    return highest[0];
  };

  const navigateToSection = (sectionIndex: number): void => {
    setCurrentSection(sectionIndex);
    setCurrentQuestionIndex(0);
    setShowReview(false);
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
              "Strongly Agree", // Value 1
              "Agree", // Value 2
              "Neutral", // Value 3
              "Disagree", // Value 4
              "Strongly Disagree", // Value 5
            ];

      if (typeof value === "number" && value >= 1 && value <= 5) {
        // Use direct mapping - no inversion needed
        return labels[value - 1];
      }
      return "Not Answered";
    }

    if (sectionKey === "technicalSkills") {
      if (typeof value === "boolean") {
        return value ? "Yes" : "No";
      }
      return "No";
    }

    return "Not answered";
  };

  const renderResetButton = (): JSX.Element => (
    <div className="text-center mt-4">
      <Button
        variant="outline-danger"
        size="sm"
        onClick={() => setShowResetModal(true)}
        className="px-4"
      >
        <Rocket size={16} className="me-1" />
        Start New Assessment
      </Button>
    </div>
  );

  const renderReviewSection = (): JSX.Element => {
    const getQuestionsBySection = (sectionKey: string): Question[] => {
      if (!questions) return [];

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

    const sectionColors: SectionColors[] = [
      {
        bg: "linear-gradient(135deg, #2B3176 0%, #1C6CB3 100%)",
        text: "white",
      },
      {
        bg: "linear-gradient(135deg, #EC2326 0%, #A41D31 100%)",
        text: "white",
      },
      {
        bg: "linear-gradient(135deg, #1C6CB3 0%, #2B3176 100%)",
        text: "white",
      },
      {
        bg: "linear-gradient(135deg, #A41D31 0%, #EC2326 100%)",
        text: "white",
      },
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
          <Row className="mb-5">
            <Col md={8} className="mx-auto">
              <Card
                className="border-0"
                style={{
                  background:
                    "linear-gradient(135deg, #f8f9ff 0%, #e8f4ff 100%)",
                  border: "2px solid #2B3176",
                }}
              >
                <Card.Body className="text-center p-4">
                  <h5 className="fw-bold mb-3" style={{ color: "#2B3176" }}>
                    Assessment Progress Summary
                  </h5>
                  <Row className="g-3">
                    {sections.map((sectionKey) => {
                      const sectionQuestions =
                        getQuestionsBySection(sectionKey);
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
                  return (
                    typeof answer === "number" && answer >= 1 && answer <= 5
                  );
                }
                if (sectionKey === "technicalSkills") {
                  return answer === true;
                }
                return false;
              });

              const currentColor = sectionColors[sectionIndex];

              return (
                <Col xl={6} lg={12} key={sectionKey}>
                  <Card className="h-100 shadow-sm review-section-card">
                    <Card.Header
                      className="d-flex justify-content-between align-items-center py-3"
                      style={{
                        background: currentColor.bg,
                        color: currentColor.text,
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
                        onClick={() => navigateToSection(sectionIndex)}
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
                            Selected Technical Skills (
                            {answeredQuestions.length})
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
                              <p className="mb-0">
                                No technical skills selected
                              </p>
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
                            <div className="questions-list">
                              {answeredQuestions.map((question, qIndex) => {
                                const answer =
                                  formData[sectionKey][question.questionText];
                                return (
                                  <Card
                                    key={question._id}
                                    className="mb-3 border-0 question-answer-card"
                                    style={{
                                      background:
                                        "linear-gradient(135deg, #f8f9ff 0%, #e8f4ff 100%)",
                                      borderLeft: `4px solid ${
                                        sectionIndex === 0
                                          ? "#2B3176"
                                          : sectionIndex === 1
                                          ? "#EC2326"
                                          : sectionIndex === 2
                                          ? "#1C6CB3"
                                          : "#A41D31"
                                      }`,
                                    }}
                                  >
                                    <Card.Body className="p-3">
                                      <div className="d-flex align-items-start">
                                        <Badge
                                          className="me-3 mt-1 flex-shrink-0 question-number"
                                          style={{
                                            background:
                                              "linear-gradient(135deg, #2B3176 0%, #1C6CB3 100%)",
                                            color: "white",
                                          }}
                                        >
                                          {qIndex + 1}
                                        </Badge>
                                        <div className="flex-grow-1">
                                          <p
                                            className="fw-semibold mb-2 question-text"
                                            style={{ color: "#2B3176" }}
                                          >
                                            {question.questionText}
                                          </p>
                                          <Badge
                                            className="answer-badge"
                                            style={{
                                              background:
                                                "linear-gradient(135deg, #1C6CB3 0%, #2B3176 100%)",
                                              color: "white",
                                              border: "1px solid #A41D31",
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
                                    </Card.Body>
                                  </Card>
                                );
                              })}
                            </div>
                          ) : (
                            <div
                              className="text-center py-4"
                              style={{ color: "#6c757d" }}
                            >
                              <AlertCircle size={32} className="mb-2" />
                              <p className="mb-0">
                                No questions answered in this section
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
                onClick={() => setShowReview(false)}
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
                onClick={handleSubmit}
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
                    currentSection,
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

          {renderResetButton()}
        </Card.Body>
      </Card>
    );
  };

  const renderQuestionSection = (
    sectionType: keyof AssessmentAnswers,
    sectionTitle: string,
    icon: React.ReactNode,
    variant: string,
    renderQuestions: () => React.ReactNode
  ): JSX.Element => (
    <Card className="border-0 shadow-lg w-100">
      <Card.Header className={`bg-${variant} text-white text-center py-4`}>
        <Card.Title className="mb-0 d-flex align-items-center justify-content-center fs-2">
          {icon}
          <span className="ms-3">{sectionTitle}</span>
        </Card.Title>
      </Card.Header>
      <Card.Body className="p-5">
        <Row className="align-items-center mb-4">
          <Col md={4}>
            <Badge bg={variant} className="fs-6 p-3">
              {sectionType === "technicalSkills" ? (
                <>
                  Skills Selected: {getSelectedSkillsCount()} of{" "}
                  {currentQuestions.length}
                </>
              ) : (
                <>
                  Question {currentQuestionIndex + 1} of{" "}
                  {currentQuestions.length}
                </>
              )}
            </Badge>
          </Col>
          <Col md={4} className="text-center">
            {sectionType !== "technicalSkills" && (
              <div className="d-flex gap-2 justify-content-center flex-wrap">
                <Button
                  variant={`outline-${variant}`}
                  size="sm"
                  onClick={() =>
                    setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))
                  }
                  disabled={currentQuestionIndex === 0}
                  className="px-3"
                >
                  <ChevronLeft size={16} />
                  Previous
                </Button>
                <Button
                  variant={`outline-${variant}`}
                  size="sm"
                  onClick={() => {
                    if (currentQuestionIndex < currentQuestions.length - 1) {
                      setCurrentQuestionIndex((prev) => prev + 1);
                    }
                  }}
                  disabled={
                    currentQuestionIndex === currentQuestions.length - 1
                  }
                  className="px-3"
                >
                  Next
                  <ChevronRight size={16} />
                </Button>
              </div>
            )}
          </Col>
          <Col md={4} className="text-end">
            <Badge bg="light" text="dark" className="fs-6 p-2">
              {calculateProgress(sectionType)}% Complete
            </Badge>
          </Col>
        </Row>

        <ProgressBar
          now={calculateProgress(sectionType)}
          className="mb-5"
          variant={variant}
          style={{ height: "12px" }}
        />

        {sectionType !== "technicalSkills" && (
          <div className="text-center mb-5">
            <Form.Group>
              <Form.Label className="h3 mb-4 text-dark d-block fw-bold question-text">
                {currentQuestion?.questionText || "Loading question..."}
              </Form.Label>
            </Form.Group>
          </div>
        )}

        {renderQuestions()}
      </Card.Body>

      <Card.Footer className="bg-transparent border-0 py-4">
        <Row className="align-items-center">
          <Col md={4}>
            {currentSection > 0 && (
              <Button
                variant="outline-secondary"
                onClick={handlePrevious}
                size="lg"
                className="w-100"
              >
                ← Previous Section
              </Button>
            )}
          </Col>
          <Col md={4} className="text-center">
            <Badge bg="light" text="dark" className="fs-6 p-3">
              Section {currentSection + 1} of {sections.length}
            </Badge>
          </Col>
          <Col md={4}>
            {currentSection < sections.length - 1 ? (
              <Button
                variant="primary"
                onClick={handleNext}
                size="lg"
                className="w-100"
              >
                Next Section →
              </Button>
            ) : (
              <Button
                variant={isLearningStyleComplete() ? "success" : "secondary"}
                onClick={handleNext}
                disabled={!isLearningStyleComplete()}
                size="lg"
                className="w-100"
              >
                {isLearningStyleComplete()
                  ? "Review Answers"
                  : "Complete All Questions"}
              </Button>
            )}
          </Col>
        </Row>

        {renderResetButton()}
      </Card.Footer>
    </Card>
  );

  const renderAcademicAptitudeSection = (): JSX.Element =>
    renderQuestionSection(
      "academicAptitude",
      "Academic Aptitude",
      <BookOpen size={28} />,
      "primary",
      () => (
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="d-grid gap-3">
              {[1, 2, 3, 4, 5].map((val) => (
                <Form.Check
                  key={val}
                  type="radio"
                  name={`academic-question-${currentQuestionIndex}`}
                  id={`academic-${currentQuestionIndex}-${val}`}
                  label={
                    <span className="fs-5">
                      {
                        [
                          "Strongly Agree",
                          "Agree",
                          "Neutral",
                          "Disagree",
                          "Strongly Disagree",
                        ][val - 1]
                      }
                    </span>
                  }
                  checked={
                    formData.academicAptitude[
                      currentQuestion?.questionText || ""
                    ] === val
                  }
                  onChange={() =>
                    handleChange(
                      "academicAptitude",
                      currentQuestion?.questionText || "",
                      val,
                      currentQuestion?.program
                    )
                  }
                  className="p-4 border rounded-3 hover-shadow text-start form-option fs-5"
                />
              ))}
            </div>
          </div>
        </div>
      )
    );

  const renderTechnicalSkillsSection = (): JSX.Element =>
    renderQuestionSection(
      "technicalSkills",
      "Technical Skills",
      <Wrench size={28} />,
      "warning",
      () => (
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="text-center mb-4">
              <h4 className="text-dark mb-3">
                Select the skills you have experience with:
              </h4>
              <p className="text-muted fs-5">
                Choose all that apply. You've selected{" "}
                {getSelectedSkillsCount()} out of {currentQuestions.length}{" "}
                skills.
              </p>
            </div>
            <div className="d-grid gap-3">
              {currentQuestions.map((skill) => (
                <Form.Check
                  key={skill._id}
                  type="checkbox"
                  id={`skill-${skill._id}`}
                  label={<span className="fs-5">{skill.questionText}</span>}
                  checked={!!formData.technicalSkills[skill.questionText]}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleChange(
                      "technicalSkills",
                      skill.questionText,
                      e.target.checked,
                      skill.program
                    )
                  }
                  className="p-4 border rounded-3 hover-shadow text-start form-option fs-5"
                />
              ))}
            </div>
          </div>
        </div>
      )
    );

  const renderCareerInterestSection = (): JSX.Element =>
    renderQuestionSection(
      "careerInterest",
      "Career Interest",
      <Eye size={28} />,
      "info",
      () => (
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="d-grid gap-3">
              {[1, 2, 3, 4, 5].map((val) => (
                <Form.Check
                  key={val}
                  type="radio"
                  name={`career-question-${currentQuestionIndex}`}
                  id={`career-${currentQuestionIndex}-${val}`}
                  label={
                    <span className="fs-5">
                      {val} - {choiceLabels[val]}
                    </span>
                  }
                  checked={
                    formData.careerInterest[
                      currentQuestion?.questionText || ""
                    ] === val
                  }
                  onChange={() =>
                    handleChange(
                      "careerInterest",
                      currentQuestion?.questionText || "",
                      val,
                      currentQuestion?.program
                    )
                  }
                  className="p-4 border rounded-3 hover-shadow text-start form-option fs-5"
                />
              ))}
            </div>
          </div>
        </div>
      )
    );

  const renderLearningStyleSection = (): JSX.Element =>
    renderQuestionSection(
      "learningStyle",
      "Learning Style",
      <Eye size={28} />,
      "success",
      () => (
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="d-grid gap-3">
              {[1, 2, 3, 4, 5].map((val) => (
                <Form.Check
                  key={val}
                  type="radio"
                  name={`learning-question-${currentQuestionIndex}`}
                  id={`learning-${currentQuestionIndex}-${val}`}
                  label={
                    <span className="fs-5">
                      {
                        [
                          "Strongly Agree",
                          "Agree",
                          "Neutral",
                          "Disagree",
                          "Strongly Disagree",
                        ][val - 1]
                      }
                    </span>
                  }
                  checked={
                    formData.learningStyle[
                      currentQuestion?.questionText || ""
                    ] === val
                  }
                  onChange={() =>
                    handleChange(
                      "learningStyle",
                      currentQuestion?.questionText || "",
                      val,
                      currentQuestion?.program
                    )
                  }
                  className="p-4 border rounded-3 hover-shadow text-start form-option fs-5"
                />
              ))}
            </div>
          </div>
        </div>
      )
    );

  if (questionsLoading) {
    return (
      <div className="assessment-container">
        <NavigationBar />
        <Container
          fluid
          className="main-content d-flex align-items-center justify-content-center min-vh-100"
        >
          <Row className="justify-content-center w-100">
            <Col xl={6} lg={8} md={10} className="text-center">
              <Card className="p-5 shadow-lg">
                <Card.Body>
                  <Spinner
                    animation="border"
                    variant="primary"
                    className="mb-4"
                    style={{ width: "4rem", height: "4rem" }}
                  />
                  <Card.Title className="h3 mb-3">
                    Loading Assessment Questions
                  </Card.Title>
                  <Card.Text className="fs-5">
                    Please wait while we load your assessment...
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }

  if (error) {
    return (
      <div className="assessment-container">
        <NavigationBar />
        <Container
          fluid
          className="main-content d-flex align-items-center justify-content-center min-vh-100"
        >
          <Row className="justify-content-center w-100">
            <Col xl={6} lg={8} md={10}>
              <Alert variant="danger" className="text-center p-4 shadow-lg">
                <Alert.Heading className="h3">
                  Error Loading Questions
                </Alert.Heading>
                <p className="fs-5">{error}</p>
                <hr />
                <div className="d-flex justify-content-center">
                  <Button
                    variant="outline-danger"
                    onClick={() => window.location.reload()}
                    size="lg"
                  >
                    Retry
                  </Button>
                </div>
              </Alert>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }

  if (
    !questions ||
    (questions.academicAptitude.length === 0 &&
      questions.technicalSkills.length === 0 &&
      questions.careerInterest.length === 0 &&
      questions.learningStyle.length === 0)
  ) {
    return (
      <div className="assessment-container">
        <NavigationBar />
        <Container
          fluid
          className="main-content d-flex align-items-center justify-content-center min-vh-100"
        >
          <Row className="justify-content-center w-100">
            <Col xl={6} lg={8} md={10}>
              <Alert variant="warning" className="text-center p-4 shadow-lg">
                <Alert.Heading className="h3">
                  No Questions Available
                </Alert.Heading>
                <p className="fs-5">
                  Please check if the server is running and questions are
                  loaded.
                </p>
              </Alert>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }

  return (
    <div className="assessment-container">
      <NavigationBar />

      <Container fluid className="main-content py-4">
        <Row className="justify-content-center">
          <Col xl={10} lg={12}>
            <div className="d-flex justify-content-center">
              <div className="w-100">
                {showReview ? (
                  renderReviewSection()
                ) : (
                  <>
                    {currentSection === 0 && renderAcademicAptitudeSection()}
                    {currentSection === 1 && renderTechnicalSkillsSection()}
                    {currentSection === 2 && renderCareerInterestSection()}
                    {currentSection === 3 && renderLearningStyleSection()}
                  </>
                )}
              </div>
            </div>
          </Col>
        </Row>
      </Container>

      <Modal
        show={showResetModal}
        onHide={() => setShowResetModal(false)}
        centered
        size="lg"
      >
        <Modal.Header closeButton className="text-center py-4">
          <Modal.Title className="w-100 h3">Start New Assessment?</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center fs-5 py-4">
          Are you sure you want to start a new assessment? All your current
          progress will be lost.
        </Modal.Body>
        <Modal.Footer className="justify-content-center py-4">
          <Button
            variant="secondary"
            onClick={() => setShowResetModal(false)}
            size="lg"
            className="px-4"
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleStartNewAssessment}
            size="lg"
            className="px-4"
          >
            Start New Assessment
          </Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer />
    </div>
  );
};

export default AssessmentForm;
