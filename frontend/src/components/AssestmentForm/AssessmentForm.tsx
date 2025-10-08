import React, { useState, useEffect } from "react";
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
  ListGroup,
} from "react-bootstrap";
import { toast, ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./AssestmentForm.css";
import type { User, AssessmentAnswers, AssessmentFormProps } from "../../types";
import {
  BookOpen,
  Wrench,
  Eye,
  Edit,
  ChevronLeft,
  ChevronRight,
  Download,
} from "lucide-react";
import { categoryTitles, sections, choiceLabels } from "../../config/constants";
import NavigationBar from "../NavigationBarComponents/NavigationBar";
import ProgressSideBar from "../ProgressSideBar/ProgressSideBar";
import { useAssessmentQuestions } from "../../hooks/useAssessmentQuestions";
import { useEvaluationStore } from "../../../store/useEvaluationStore";

const AssessmentForm: React.FC<AssessmentFormProps> = ({
  currentUser,
  setCurrentUser,
  onSubmit,
  loading,
  restoredFormData,
}) => {
  const { updateAnswer } = useEvaluationStore();
  const {
    questions,
    loading: questionsLoading,
    error,
  } = useAssessmentQuestions();

  const [formData, setFormData] = useState<AssessmentAnswers>(() => {
    if (restoredFormData) {
      console.log("🔄 Initializing form with restored data:", restoredFormData);
      return restoredFormData;
    }
    return {
      academicAptitude: {},
      technicalSkills: {},
      careerInterest: {},
      learningStyle: {},
    };
  });

  const [showResetModal, setShowResetModal] = useState(false);
  const [sectionToReset, setSectionToReset] = useState<
    keyof AssessmentAnswers | null
  >(null);
  const [currentSection, setCurrentSection] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showReview, setShowReview] = useState(false);
  const [completedSections, setCompletedSections] = useState<number[]>([]);
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [programScores, setProgramScores] = useState({
    BSCS: 0,
    BSIT: 0,
    BSIS: 0,
    EE: 0,
  });

  useEffect(() => {
    if (restoredFormData) {
      console.log("🔄 Updating form with restored data:", restoredFormData);
      setFormData(restoredFormData);

      setShowRestoreModal(true);
    }
  }, [restoredFormData]);

  const section = sections[currentSection];

  const getCurrentQuestions = () => {
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

  const handleChange = (
    section: keyof AssessmentAnswers,
    questionText: string,
    value: string | boolean | number,
    program?: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [questionText]: value,
      },
    }));

    const storeKey = `${section}.${questionText}`;
    updateAnswer(storeKey, value);
    console.log("📝 Updated store with:", { storeKey, value });

    if (typeof value === "number" && value >= 1 && value <= 5 && program) {
      setProgramScores((prev) => {
        const newScores = { ...prev };
        const scoreToAdd = (value - 1) * 2;
        newScores[program as keyof typeof programScores] += scoreToAdd;
        return newScores;
      });
    }
  };

  const isLearningStyleComplete = () => {
    if (section !== "learningStyle") return true;

    const learningAnswers = formData.learningStyle;
    return questions.learningStyle.every(
      (question) =>
        learningAnswers[question.questionText] !== undefined &&
        learningAnswers[question.questionText] !== ""
    );
  };

  const handleReset = (section?: keyof AssessmentAnswers) => {
    if (section) {
      setFormData((prev) => ({
        ...prev,
        [section]: {},
      }));
      if (section === "academicAptitude") {
        setCurrentQuestionIndex(0);
      }
    } else {
      setFormData({
        academicAptitude: {},
        technicalSkills: {},
        careerInterest: {},
        learningStyle: {},
      });
      setCurrentQuestionIndex(0);
      setProgramScores({ BSCS: 0, BSIT: 0, BSIS: 0, EE: 0 });
    }
    setShowResetModal(false);
  };

  const saveAnswersLocally = () => {
    try {
      const timestamp = new Date().toISOString();
      const dataToSave = {
        answers: formData,
        programScores,
        timestamp: timestamp,
        section: categoryTitles[sections[currentSection]],
        currentSection: currentSection,
      };

      const blob = new Blob([JSON.stringify(dataToSave, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `assessment-answers-${timestamp.split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success("Answers saved successfully!", {
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
      toast.error("Failed to save answers. Please try again.", {
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
    }
  };

  const validateSection = (): boolean => {
    const answers = formData[section];

    if (
      section === "academicAptitude" ||
      section === "careerInterest" ||
      section === "learningStyle"
    ) {
      const firstUnansweredIndex = currentQuestions.findIndex(
        (q) =>
          answers[q.questionText] === undefined ||
          answers[q.questionText] === ""
      );

      if (firstUnansweredIndex !== -1) {
        const sectionName = categoryTitles[section];
        toast.warning(`Please answer all ${sectionName} questions.`, {
          position: "top-right",
          autoClose: 3000,
          style: {
            backgroundColor: "rgba(33, 150, 243, 0.3)",
            backdropFilter: "blur(6px)",
            border: "2px solid #2196F3",
            color: "#fff",
            fontWeight: "bold",
            fontSize: "14px",
            borderRadius: "8px",
            fontFamily: "Poppins",
          },
          transition: Bounce,
        });

        setCurrentQuestionIndex(firstUnansweredIndex);
        return false;
      }
    }

    if (section === "technicalSkills") {
      const hasAtLeastOne = Object.values(answers).some((val) => val === true);
      if (!hasAtLeastOne) {
        toast.warning("Please select at least one Technical Skill.", {
          position: "top-right",
          style: {
            backgroundColor: "rgba(255, 140, 0, 0.35)",
            color: "#fff",
            border: "2px solid rgba(255, 120, 0, 0.7)",
            borderRadius: "10px",
            fontWeight: "500",
            fontFamily: "Poppins",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            boxShadow: "0 4px 20px rgba(255, 120, 0, 0.4)",
          },
        });
        return false;
      }
    }

    return true;
  };

  const handleNext = () => {
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

      setCompletedSections((prev) => [...prev, currentSection]);

      if (currentSection < sections.length - 1) {
        setCurrentSection((prev) => prev + 1);
        setCurrentQuestionIndex(0);
      } else {
        setShowReview(true);
      }
    }
  };

  const handlePrevious = () => {
    if (currentSection > 0) {
      setCurrentSection((prev) => prev - 1);
      setCurrentQuestionIndex(0);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
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

  const getRecommendedProgram = (scores: typeof programScores) => {
    const entries = Object.entries(scores);
    const highest = entries.reduce((max, current) =>
      current[1] > max[1] ? current : max
    );
    return highest[0];
  };

  const navigateToSection = (sectionIndex: number) => {
    setCurrentSection(sectionIndex);
    setCurrentQuestionIndex(0);
    setShowReview(false);
  };

  const getAnswerLabel = (
    section: keyof AssessmentAnswers,
    question: string,
    value: any
  ): string => {
    if (section === "academicAptitude" || section === "careerInterest") {
      const labels =
        section === "careerInterest"
          ? [
              "Strongly Matches",
              "Matches",
              "Neutral",
              "Partially Matches",
              "Does Not Match",
            ]
          : [
              "Strongly Disagree",
              "Disagree",
              "Neutral",
              "Agree",
              "Strongly Agree",
            ];

      return labels[value - 1] || "Not Answered";
    }

    if (section === "technicalSkills") {
      return value ? "Yes" : "No";
    }

    if (section === "learningStyle") {
      return value || "Not answered";
    }

    return value?.toString() || "Not answered";
  };

  const renderReviewSection = () => {
    const getQuestionsBySection = (sectionKey: string) => {
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

    return (
      <Card className="border-0 shadow">
        <Card.Header className="bg-secondary text-white text-center">
          <Card.Title className="mb-0 d-flex align-items-center justify-content-center">
            <Eye size={24} className="me-2" />
            Review Your Answers
          </Card.Title>
        </Card.Header>
        <Card.Body className="p-4">
          <div className="review-content">
            {sections.map((sectionKey, sectionIndex) => {
              const sectionQuestions = getQuestionsBySection(sectionKey);
              return (
                <Card key={sectionKey} className="mb-4">
                  <Card.Header className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">{categoryTitles[sectionKey]}</h5>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => navigateToSection(sectionIndex)}
                    >
                      <Edit size={16} className="me-1" />
                      Edit
                    </Button>
                  </Card.Header>
                  <Card.Body>
                    {sectionKey === "technicalSkills" ? (
                      <div>
                        <h6 className="fw-bold mb-3 text-center">
                          Selected Skills:
                        </h6>
                        <ListGroup variant="flush" className="text-center">
                          {sectionQuestions
                            .filter(
                              (skill) =>
                                formData.technicalSkills[skill.questionText]
                            )
                            .map((skill) => (
                              <ListGroup.Item
                                key={skill._id}
                                className="px-0 border-0"
                              >
                                {skill.questionText}
                              </ListGroup.Item>
                            ))}
                          {Object.values(formData.technicalSkills).filter(
                            (v) => v
                          ).length === 0 && (
                            <ListGroup.Item className="text-muted px-0 border-0">
                              No skills selected
                            </ListGroup.Item>
                          )}
                        </ListGroup>
                      </div>
                    ) : (
                      <div>
                        {sectionQuestions.map((question, qIndex) => {
                          const answer =
                            formData[sectionKey][question.questionText];
                          return (
                            <div
                              key={question._id}
                              className="mb-3 pb-3 border-bottom text-center"
                            >
                              <p className="fw-bold mb-2">
                                {qIndex + 1}. {question.questionText}
                              </p>
                              <Badge bg="info" className="fs-6">
                                {getAnswerLabel(
                                  sectionKey,
                                  question.questionText,
                                  answer
                                )}
                              </Badge>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </Card.Body>
                </Card>
              );
            })}
          </div>
        </Card.Body>
      </Card>
    );
  };

  const renderAcademicAptitudeSection = () => (
    <Card className="border-0 shadow-sm mx-auto" style={{ maxWidth: "800px" }}>
      <Card.Header className="bg-primary text-white text-center">
        <Card.Title className="mb-0 d-flex align-items-center justify-content-center">
          <BookOpen size={20} className="me-2" />
          Academic Aptitude
        </Card.Title>
      </Card.Header>
      <Card.Body className="p-4">
        {/* Progress Info */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <Badge bg="primary" className="fs-6">
            Question {currentQuestionIndex + 1} of {currentQuestions.length}
          </Badge>
          <div className="d-flex gap-2 align-items-center">
            <Button
              variant="outline-primary"
              size="sm"
              onClick={() =>
                setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))
              }
              disabled={currentQuestionIndex === 0}
            >
              <ChevronLeft size={16} />
            </Button>
            <div className="d-flex gap-1 align-items-center mx-2">
              {currentQuestions.map((_, index) => (
                <Button
                  key={index}
                  variant={
                    index === currentQuestionIndex
                      ? "primary"
                      : "outline-primary"
                  }
                  size="sm"
                  className="px-2 py-1"
                  onClick={() => setCurrentQuestionIndex(index)}
                >
                  {index + 1}
                </Button>
              ))}
            </div>
            <Button
              variant="outline-primary"
              size="sm"
              onClick={() => {
                if (currentQuestionIndex < currentQuestions.length - 1) {
                  setCurrentQuestionIndex((prev) => prev + 1);
                }
              }}
              disabled={currentQuestionIndex === currentQuestions.length - 1}
            >
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        <ProgressBar
          now={((currentQuestionIndex + 1) / currentQuestions.length) * 100}
          className="mb-4"
          variant="primary"
          style={{ height: "8px" }}
        />

        {/* Question Content */}
        <div className="text-center">
          <Form.Group>
            <Form.Label className="h4 mb-4 text-dark d-block">
              {currentQuestion?.questionText || "Loading question..."}
            </Form.Label>
            <div className="d-grid gap-3 mx-auto" style={{ maxWidth: "600px" }}>
              {[1, 2, 3, 4, 5].map((val, index) => (
                <Form.Check
                  key={val}
                  type="radio"
                  name={`academic-question-${currentQuestionIndex}`}
                  id={`academic-${currentQuestionIndex}-${val}`}
                  label={
                    [
                      "Strongly Agree",
                      "Agree",
                      "Neutral",
                      "Disagree",
                      "Strongly Disagree",
                    ][val - 1]
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
                  className="p-3 border rounded hover-shadow text-start"
                />
              ))}
            </div>
          </Form.Group>
        </div>
      </Card.Body>
    </Card>
  );

  const renderTechnicalSkillsSection = () => (
    <Card className="border-0 shadow-sm mx-auto" style={{ maxWidth: "800px" }}>
      <Card.Header className="bg-warning text-dark text-center">
        <Card.Title className="mb-0 d-flex align-items-center justify-content-center">
          <Wrench size={20} className="me-2" />
          Technical Skills
        </Card.Title>
      </Card.Header>
      <Card.Body className="p-4">
        <div className="text-center">
          <Form.Group>
            <Form.Label className="h5 mb-4 text-dark d-block">
              Select the skills you have experience with:
            </Form.Label>
            <div className="d-grid gap-3 mx-auto" style={{ maxWidth: "600px" }}>
              {currentQuestions.map((skill, index) => (
                <Form.Check
                  key={skill._id}
                  type="checkbox"
                  id={`skill-${skill._id}`}
                  label={skill.questionText}
                  checked={!!formData.technicalSkills[skill.questionText]}
                  onChange={(e) =>
                    handleChange(
                      "technicalSkills",
                      skill.questionText,
                      e.target.checked,
                      skill.program
                    )
                  }
                  className="p-3 border rounded hover-shadow text-start"
                />
              ))}
            </div>
          </Form.Group>
        </div>
      </Card.Body>
    </Card>
  );

  const renderCareerInterestSection = () => (
    <Card className="border-0 shadow-sm mx-auto" style={{ maxWidth: "800px" }}>
      <Card.Header className="bg-info text-white text-center">
        <Card.Title className="mb-0 d-flex align-items-center justify-content-center">
          <Eye size={20} className="me-2" />
          Career Interest
        </Card.Title>
      </Card.Header>
      <Card.Body className="p-4">
        {/* Progress Info */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <Badge bg="info" className="fs-6">
            Question {currentQuestionIndex + 1} of {currentQuestions.length}
          </Badge>
          <div className="d-flex gap-2 align-items-center">
            <Button
              variant="outline-info"
              size="sm"
              onClick={() =>
                setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))
              }
              disabled={currentQuestionIndex === 0}
            >
              <ChevronLeft size={16} />
            </Button>
            <div className="d-flex gap-1 align-items-center mx-2">
              {currentQuestions.map((_, index) => (
                <Button
                  key={index}
                  variant={
                    index === currentQuestionIndex ? "info" : "outline-info"
                  }
                  size="sm"
                  className="px-2 py-1"
                  onClick={() => setCurrentQuestionIndex(index)}
                >
                  {index + 1}
                </Button>
              ))}
            </div>
            <Button
              variant="outline-info"
              size="sm"
              onClick={() => {
                if (currentQuestionIndex < currentQuestions.length - 1) {
                  setCurrentQuestionIndex((prev) => prev + 1);
                }
              }}
              disabled={currentQuestionIndex === currentQuestions.length - 1}
            >
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>

        <ProgressBar
          now={((currentQuestionIndex + 1) / currentQuestions.length) * 100}
          className="mb-4"
          variant="info"
          style={{ height: "8px" }}
        />

        <div className="text-center">
          <Form.Group>
            <Form.Label className="h4 mb-4 text-dark d-block">
              {currentQuestion?.questionText || "Loading question..."}
            </Form.Label>
            <div className="d-grid gap-3 mx-auto" style={{ maxWidth: "600px" }}>
              {[1, 2, 3, 4, 5].map((val, index) => (
                <Form.Check
                  key={val}
                  type="radio"
                  name={`career-question-${currentQuestionIndex}`}
                  id={`career-${currentQuestionIndex}-${val}`}
                  label={`${val} - ${choiceLabels[val]}`}
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
                  className="p-3 border rounded hover-shadow text-start"
                />
              ))}
            </div>
          </Form.Group>
        </div>
      </Card.Body>
    </Card>
  );

  const renderLearningStyleSection = () => (
    <Card className="border-0 shadow-sm mx-auto" style={{ maxWidth: "800px" }}>
      <Card.Header className="bg-success text-white text-center">
        <Card.Title className="mb-0 d-flex align-items-center justify-content-center">
          <Eye size={20} className="me-2" />
          Learning Style
        </Card.Title>
      </Card.Header>
      <Card.Body className="p-4">
        {/* Progress Info */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <Badge bg="success" className="fs-6">
            Question {currentQuestionIndex + 1} of {currentQuestions.length}
          </Badge>
          <div className="d-flex gap-2 align-items-center">
            <Button
              variant="outline-success"
              size="sm"
              onClick={() =>
                setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))
              }
              disabled={currentQuestionIndex === 0}
            >
              <ChevronLeft size={16} />
            </Button>
            <div className="d-flex gap-1 align-items-center mx-2">
              {currentQuestions.map((_, index) => (
                <Button
                  key={index}
                  variant={
                    index === currentQuestionIndex
                      ? "success"
                      : "outline-success"
                  }
                  size="sm"
                  className="px-2 py-1"
                  onClick={() => setCurrentQuestionIndex(index)}
                >
                  {index + 1}
                </Button>
              ))}
            </div>
            <Button
              variant="outline-success"
              size="sm"
              onClick={() => {
                if (currentQuestionIndex < currentQuestions.length - 1) {
                  setCurrentQuestionIndex((prev) => prev + 1);
                }
              }}
              disabled={currentQuestionIndex === currentQuestions.length - 1}
            >
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>

        <ProgressBar
          now={((currentQuestionIndex + 1) / currentQuestions.length) * 100}
          className="mb-4"
          variant="success"
          style={{ height: "8px" }}
        />

        <div className="text-center">
          <Form.Group>
            <Form.Label className="h4 mb-4 text-dark d-block">
              {currentQuestion?.questionText || "Loading question..."}
            </Form.Label>
            <div className="d-grid gap-3 mx-auto" style={{ maxWidth: "600px" }}>
              {currentQuestion?.options?.map((opt, index) => (
                <Form.Check
                  key={opt}
                  type="radio"
                  name={`learning-question-${currentQuestionIndex}`}
                  id={`learning-${currentQuestionIndex}-${index}`}
                  label={opt}
                  checked={
                    formData.learningStyle[
                      currentQuestion?.questionText || ""
                    ] === opt
                  }
                  onChange={() =>
                    handleChange(
                      "learningStyle",
                      currentQuestion?.questionText || "",
                      opt,
                      currentQuestion?.program
                    )
                  }
                  className="p-3 border rounded hover-shadow text-start"
                />
              ))}
            </div>
          </Form.Group>
        </div>
      </Card.Body>
    </Card>
  );

  if (questionsLoading) {
    return (
      <div className="assessment-container">
        <NavigationBar />
        <Container
          fluid
          className="main-content d-flex align-items-center justify-content-center"
          style={{ minHeight: "80vh" }}
        >
          <Row className="justify-content-center w-100">
            <Col md={6} className="text-center">
              <Card className="p-5">
                <Card.Body>
                  <Spinner
                    animation="border"
                    variant="primary"
                    className="mb-3"
                  />
                  <Card.Title>Loading Assessment Questions</Card.Title>
                  <Card.Text>
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
          className="main-content d-flex align-items-center justify-content-center"
          style={{ minHeight: "80vh" }}
        >
          <Row className="justify-content-center w-100">
            <Col md={6}>
              <Alert variant="danger" className="text-center">
                <Alert.Heading>Error Loading Questions</Alert.Heading>
                <p>{error}</p>
                <hr />
                <div className="d-flex justify-content-center">
                  <Button
                    variant="outline-danger"
                    onClick={() => window.location.reload()}
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
          className="main-content d-flex align-items-center justify-content-center"
          style={{ minHeight: "80vh" }}
        >
          <Row className="justify-content-center w-100">
            <Col md={6}>
              <Alert variant="warning" className="text-center">
                <Alert.Heading>No Questions Available</Alert.Heading>
                <p>
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
          <Col md={9} lg={8}>
            <div className="d-flex justify-content-center">
              <div className="w-100" style={{ maxWidth: "900px" }}>
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

                {/* Navigation Buttons */}
                {!showReview && (
                  <Card.Footer className="bg-transparent border-0 mt-4">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        {currentSection > 0 && (
                          <Button
                            variant="outline-secondary"
                            onClick={handlePrevious}
                            size="lg"
                          >
                            Previous Section
                          </Button>
                        )}
                      </div>
                      <div>
                        {currentSection < sections.length - 1 ? (
                          <Button
                            variant="primary"
                            onClick={handleNext}
                            size="lg"
                          >
                            Next Section
                          </Button>
                        ) : (
                          <Button
                            variant={
                              isLearningStyleComplete()
                                ? "success"
                                : "secondary"
                            }
                            onClick={handleNext}
                            disabled={!isLearningStyleComplete()}
                            size="lg"
                          >
                            {isLearningStyleComplete()
                              ? "Review Answers"
                              : "Complete All Questions"}
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card.Footer>
                )}

                {/* Review Section Buttons */}
                {showReview && (
                  <Card.Footer className="bg-transparent border-0 mt-4">
                    <div className="d-flex gap-3 justify-content-center flex-wrap">
                      <Button
                        variant="outline-secondary"
                        onClick={() => setShowReview(false)}
                        size="lg"
                      >
                        Back to Form
                      </Button>
                      <Button
                        variant="outline-primary"
                        onClick={saveAnswersLocally}
                        size="lg"
                      >
                        <Download size={18} className="me-2" />
                        Save Answers Locally
                      </Button>
                      <Button
                        variant="success"
                        onClick={handleSubmit}
                        disabled={loading}
                        size="lg"
                      >
                        {loading ? (
                          <>
                            <Spinner
                              animation="border"
                              size="sm"
                              className="me-2"
                            />
                            Submitting...
                          </>
                        ) : (
                          "Submit Assessment"
                        )}
                      </Button>
                    </div>
                  </Card.Footer>
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
      >
        <Modal.Header closeButton className="text-center">
          <Modal.Title className="w-100">Confirm Reset</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          {sectionToReset
            ? `Are you sure you want to reset the ${categoryTitles[sectionToReset]} section?`
            : "Are you sure you want to reset ALL sections?"}
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <Button variant="secondary" onClick={() => setShowResetModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={() => handleReset(sectionToReset)}>
            Yes, Reset
          </Button>
        </Modal.Footer>
      </Modal>
            
      {/* Restore Confirmation Modal */}
      <Modal
        show={showRestoreModal}
        onHide={() => setShowRestoreModal(false)}
        centered
      >
        <Modal.Header closeButton className="bg-success text-white">
          <Modal.Title className="w-100 text-center">
            <span className="me-2">✅</span>
            Progress Restored
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center py-4">
          <p className="fs-5 mb-3">Your previous answers have been restored!</p>
          <p className="text-muted">
            You can continue where you left off. All your progress has been
            loaded.
          </p>
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <Button
            variant="success"
            onClick={() => {
              setShowRestoreModal(false);
              // Show toast when user clicks Continue Assessment
              toast.success(
                "✅ Your previous answers have been restored - you can continue where you left off",
                {
                  position: "top-right",
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  style: {
                    backgroundColor: "rgba(34, 197, 94, 0.9)",
                    backdropFilter: "blur(6px)",
                    border: "2px solid #22c55e",
                    color: "#fff",
                    fontWeight: "bold",
                    fontSize: "14px",
                    borderRadius: "8px",
                    fontFamily: "Poppins",
                  },
                  transition: Bounce,
                }
              );
            }}
            size="lg"
          >
            Continue Assessment
          </Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer />
    </div>
  );
};

export default AssessmentForm;
