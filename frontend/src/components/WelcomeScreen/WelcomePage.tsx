// src/components/WelcomeScreenComponent/WelcomeScreenComponent.tsx
import React, { useEffect, useState } from "react";
import { useWelcomeScreen } from "../../../store/useWelcomeScreenStore";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import NavigationBar from "../NavigationBarComponents/NavigationBar";
import discover from "../../assets/discover.png";
import {
  Card,
  Button,
  Container,
  Row,
  Col,
  Badge,
  Carousel,
  Modal,
  Toast,
  ToastContainer,
  ProgressBar,
} from "react-bootstrap";
import {
  Play,
  User,
  Target,
  BarChart3,
  Timer,
  History,
  X,
  Sparkles,
  ArrowRight,
  CheckCircle,
  Award,
  TrendingUp,
  BookOpen,
  Star,
  FileText,
  RotateCcw,
} from "lucide-react";
import "./WelcomePage.css";

interface WelcomeScreenComponentProps {
  onStartNew?: () => void;
}

interface AssessmentResult {
  completed: boolean;
  score?: number;
  totalQuestions?: number;
  recommendedPaths?: string[];
  strengths?: string[];
  completionDate?: string;
}

interface AssessmentAnswers {
  academicAptitude: Record<string, number | boolean>;
  technicalSkills: Record<string, number | boolean>;
  careerInterest: Record<string, number | boolean>;
  learningStyle: Record<string, number | boolean>;
}

function WelcomeScreenComponent({ onStartNew }: WelcomeScreenComponentProps) {
  const { hideWelcome } = useWelcomeScreen();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [showProgressToast, setShowProgressToast] = useState(false);
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState<AssessmentResult | null>(null);

  const handleSelect = (selectedIndex: number) => {
    setIndex(selectedIndex);
  };

  const hasExistingProgress = (): boolean => {
    try {
      const savedAnswers = localStorage.getItem("evaluation-answers");
      if (!savedAnswers) return false;

      const answers: AssessmentAnswers = JSON.parse(savedAnswers);
      return Object.values(answers).some(
        (section: Record<string, number | boolean>) => Object.keys(section).length > 0
      );
    } catch (error) {
      console.error("Error checking existing progress:", error);
      return false;
    }
  };

  const checkAssessmentCompletion = (): AssessmentResult | null => {
    try {
      // Check if assessment is marked as completed
      const completionStatus = localStorage.getItem("assessment-completed");
      if (completionStatus === "true") {
        const result: AssessmentResult = {
          completed: true,
          completionDate: localStorage.getItem("assessment-completion-date") || new Date().toLocaleDateString(),
        };

        // Try to get score data if available
        const scoreData = localStorage.getItem("assessment-score");
        if (scoreData) {
          const scoreInfo: { score: number; totalQuestions: number } = JSON.parse(scoreData);
          result.score = scoreInfo.score;
          result.totalQuestions = scoreInfo.totalQuestions;
        }

        // Try to get recommendations if available
        const recommendations = localStorage.getItem("assessment-recommendations");
        if (recommendations) {
          const recData: { recommendedPaths: string[]; strengths: string[] } = JSON.parse(recommendations);
          result.recommendedPaths = recData.recommendedPaths;
          result.strengths = recData.strengths;
        }

        return result;
      }
      return null;
    } catch (error) {
      console.error("Error checking assessment completion:", error);
      return null;
    }
  };

  const handleStartAssessment = (): void => {
    const result = checkAssessmentCompletion();
    
    if (result?.completed) {
      // If already completed, show results modal
      setShowResultsModal(true);
    } else if (hasExistingProgress()) {
      setShowProgressModal(true);
    } else {
      startNewAssessment();
    }
  };

  const startNewAssessment = (): void => {
    if (onStartNew) {
      onStartNew();
    } else {
      localStorage.removeItem("evaluation-answers");
      localStorage.removeItem("currentAssessmentSection");
      localStorage.removeItem("assessmentProgress");
      localStorage.removeItem("assessment-completed");
      localStorage.removeItem("assessment-score");
      localStorage.removeItem("assessment-recommendations");
    }
    hideWelcome();
    navigate("/assessment");
  };

  const continueAssessment = (): void => {
    hideWelcome();
    navigate("/assessment");
  };

  const viewResults = (): void => {
    setShowResultsModal(false);
    hideWelcome();
    navigate("/results");
  };

  const retakeAssessment = (): void => {
    // Clear all assessment data
    localStorage.removeItem("evaluation-answers");
    localStorage.removeItem("currentAssessmentSection");
    localStorage.removeItem("assessmentProgress");
    localStorage.removeItem("assessment-completed");
    localStorage.removeItem("assessment-score");
    localStorage.removeItem("assessment-recommendations");
    
    setAssessmentResult(null);
    setShowResultsModal(false);
    startNewAssessment();
  };

  const continueToResults = (): void => {
    setShowResultsModal(false);
    hideWelcome();
    navigate("/results");
  };

  useEffect(() => {
    if (isAuthenticated) {
      const result = checkAssessmentCompletion();
      setAssessmentResult(result);
      
      if (result?.completed) {
        // User has completed assessment, show results modal automatically
        setShowResultsModal(true);
        setShowProgressModal(false);
      } else if (hasExistingProgress()) {
        setShowProgressModal(true);
        setShowProgressToast(true);
      }
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="assessment-container">
        <NavigationBar />
        <Container
          fluid
          className="main-content d-flex align-items-center justify-content-center"
          style={{ minHeight: "80vh" }}
        >
          <div className="text-center">
            <div className="spinner-border text-primary mb-3" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <div className="text-xl text-gray-600">Loading...</div>
          </div>
        </Container>
      </div>
    );
  }

  const progressExists = hasExistingProgress();
  const hasCompletedAssessment = assessmentResult?.completed;

  return (
    <div className="welcome-assessment-container">
      <NavigationBar />

      {/* Modern Toast Notification */}
      <ToastContainer position="top-center" className="p-3">
        <Toast
          show={showProgressToast}
          onClose={() => setShowProgressToast(false)}
          delay={5000}
          autohide
          className="modern-toast"
        >
          <Toast.Header className="modern-toast-header">
            <History size={16} className="me-2" />
            <strong className="me-auto">Continue Your Journey</strong>
            <Button
              variant="link"
              size="sm"
              onClick={() => setShowProgressToast(false)}
              className="p-0 border-0"
            >
              <X size={14} />
            </Button>
          </Toast.Header>
          <Toast.Body className="modern-toast-body">
            We found your incomplete assessment. Pick up where you left off!
          </Toast.Body>
        </Toast>
      </ToastContainer>

      {/* Modern Progress Modal */}
      <Modal
        show={showProgressModal}
        onHide={() => setShowProgressModal(false)}
        centered
        className="modern-modal"
      >
        <Modal.Header closeButton className="modern-modal-header border-0">
          <Modal.Title className="w-100 text-center">
            <div className="modal-icon-wrapper">
              <History size={32} />
            </div>
            <h4 className="fw-bold mt-3">Continue Your Progress?</h4>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className="text-center pt-0">
          <p className="text-muted mb-4 modern-modal-text">
            We found an incomplete assessment from your previous session. 
            Choose to continue or start fresh.
          </p>

          <div className="d-flex flex-column flex-sm-row justify-content-center gap-3">
            <Button
              variant="outline-primary"
              onClick={continueAssessment}
              className="flex-fill modern-btn-outline"
              size="lg"
            >
              <History size={18} className="me-2" />
              Continue Progress
            </Button>
            <Button
              variant="primary"
              onClick={startNewAssessment}
              className="flex-fill modern-btn-primary"
              size="lg"
            >
              <Sparkles size={18} className="me-2" />
              Start Fresh
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      {/* Results Available Modal - Shows when user has already taken the test */}
      <Modal
        show={showResultsModal}
        onHide={() => setShowResultsModal(false)}
        centered
        size="lg"
        className="modern-modal results-modal"
      >
        <Modal.Header closeButton className="modern-modal-header border-0">
          <Modal.Title className="w-100 text-center">
            <div className="modal-icon-wrapper bg-success">
              <Award size={32} />
            </div>
            <h4 className="fw-bold mt-3">Assessment Completed!</h4>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className="pt-0">
          <div className="text-center mb-4">
            <p className="text-muted modern-modal-text">
              You've already completed the career assessment. Here's a summary of your results:
            </p>
          </div>

          {/* Results Summary */}
          <div className="results-summary">
            <Row className="g-3 mb-4">
              {/* Score Summary */}
              {assessmentResult?.score !== undefined && (
                <Col md={6}>
                  <Card className="summary-card h-100">
                    <Card.Body className="text-center p-3">
                      <div className="summary-icon-wrapper bg-primary mb-2">
                        <TrendingUp size={20} />
                      </div>
                      <h6 className="fw-bold text-dark mb-1">Your Score</h6>
                      <div className="score-summary">
                        <span className="h4 fw-bold text-primary">
                          {assessmentResult.score}
                        </span>
                        <span className="text-muted">
                          /{assessmentResult.totalQuestions}
                        </span>
                      </div>
                      <ProgressBar 
                        now={(assessmentResult.score / (assessmentResult.totalQuestions || 1)) * 100} 
                        className="mt-2"
                        variant="primary"
                        style={{ height: '6px' }}
                      />
                    </Card.Body>
                  </Card>
                </Col>
              )}

              {/* Completion Date */}
              <Col md={6}>
                <Card className="summary-card h-100">
                  <Card.Body className="text-center p-3">
                    <div className="summary-icon-wrapper bg-info mb-2">
                      <FileText size={20} />
                    </div>
                    <h6 className="fw-bold text-dark mb-1">Completed On</h6>
                    <p className="text-primary fw-bold mb-0">
                      {assessmentResult?.completionDate}
                    </p>
                    <div className="mt-2">
                      <Badge bg="success" className="completed-badge">
                        <CheckCircle size={12} className="me-1" />
                        Completed
                      </Badge>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Top Recommendations */}
            {assessmentResult?.recommendedPaths && assessmentResult.recommendedPaths.length > 0 && (
              <Card className="summary-card mb-3">
                <Card.Body className="p-3">
                  <div className="d-flex align-items-center mb-2">
                    <Target size={18} className="text-success me-2" />
                    <h6 className="fw-bold text-dark mb-0">Top Recommendations</h6>
                  </div>
                  <div className="recommendations-list">
                    {assessmentResult.recommendedPaths.slice(0, 2).map((path, index) => (
                      <div key={index} className="recommendation-item d-flex align-items-center mb-1">
                        <Star size={14} className="text-warning me-2" />
                        <span className="small text-dark">{path}</span>
                      </div>
                    ))}
                    {assessmentResult.recommendedPaths.length > 2 && (
                      <p className="text-muted small mt-1 mb-0">
                        +{assessmentResult.recommendedPaths.length - 2} more career paths
                      </p>
                    )}
                  </div>
                </Card.Body>
              </Card>
            )}
          </div>

          {/* Action Buttons */}
          <div className="d-flex flex-column flex-sm-row justify-content-center gap-3 mt-4">
            <Button
              variant="outline-primary"
              onClick={retakeAssessment}
              className="flex-fill modern-btn-outline"
              size="lg"
            >
              <RotateCcw size={18} className="me-2" />
              Retake Assessment
            </Button>
            <Button
              variant="primary"
              onClick={continueToResults}
              className="flex-fill modern-btn-primary"
              size="lg"
            >
              <BarChart3 size={18} className="me-2" />
              View Full Results
            </Button>
          </div>

          <div className="text-center mt-3">
            <Button
              variant="link"
              onClick={() => setShowResultsModal(false)}
              className="text-muted"
            >
              Maybe later
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      <Container fluid className="welcome-main-content">
        <section className="welcome-section">
          <div className="d-flex justify-content-center">
            <div className="w-100">
              {/* Modern Header Section */}
              <div className="modern-header text-center mb-5">
                <div className="header-badge mb-3">
                  <Sparkles size={20} className="me-2" />
                  Career Assessment Platform
                </div>
                <h1 className="display-4 fw-bold text-dark mb-3">
                  {hasCompletedAssessment ? (
                    <>Your Career <span className="gradient-text">Results</span></>
                  ) : (
                    <>Discover Your <span className="gradient-text">Career Path</span></>
                  )}
                </h1>
                <p className="lead text-muted max-w-600 mx-auto">
                  {hasCompletedAssessment
                    ? "View your personalized career assessment results and recommended paths"
                    : "Unlock your potential with our comprehensive career assessment and get personalized program recommendations."}
                </p>
              </div>

              <Card className="modern-welcome-card">
                <Card.Body className="p-4 p-lg-5">
                  {/* User Welcome Section */}
                  {user && (
                    <div className="modern-user-section text-center mb-5">
                      <div className="user-avatar mb-3">
                        <div className="avatar-circle">
                          <User size={32} />
                        </div>
                      </div>
                      <h2 className="h3 fw-bold text-dark mb-2">
                        Welcome back, {user.fullName}!
                      </h2>
                      <Badge className="modern-user-badge">
                        <Target size={14} className="me-2" />
                        Interested in: {user.preferredCourse}
                      </Badge>

                      {progressExists && !hasCompletedAssessment && (
                        <div className="progress-indicator mt-3">
                          <Badge
                            bg="warning"
                            className="modern-progress-badge"
                            onClick={() => setShowProgressModal(true)}
                          >
                            <History size={14} className="me-1" />
                            Incomplete assessment - Click to manage
                          </Badge>
                        </div>
                      )}

                      {hasCompletedAssessment && (
                        <div className="completion-badge mt-3">
                          <Badge bg="success" className="modern-completion-badge">
                            <Award size={14} className="me-1" />
                            Assessment Completed • {assessmentResult?.completionDate}
                          </Badge>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Results Section for Completed Assessment */}
                  {hasCompletedAssessment ? (
                    <div className="results-section mb-5">
                      <Row className="g-4">
                        {/* Score Card */}
                        {assessmentResult?.score !== undefined && (
                          <Col md={6}>
                            <Card className="result-card h-100">
                              <Card.Body className="text-center p-4">
                                <div className="result-icon-wrapper bg-primary mb-3">
                                  <TrendingUp size={24} />
                                </div>
                                <h4 className="fw-bold text-dark mb-2">Your Score</h4>
                                <div className="score-display mb-3">
                                  <span className="display-4 fw-bold text-primary">
                                    {assessmentResult.score}
                                  </span>
                                  <span className="text-muted fs-5">
                                    /{assessmentResult.totalQuestions}
                                  </span>
                                </div>
                                <ProgressBar 
                                  now={(assessmentResult.score / (assessmentResult.totalQuestions || 1)) * 100} 
                                  className="mb-3"
                                  variant="primary"
                                />
                                <p className="text-muted small">
                                  Based on your responses and career preferences
                                </p>
                              </Card.Body>
                            </Card>
                          </Col>
                        )}

                        {/* Recommended Paths */}
                        {assessmentResult?.recommendedPaths && assessmentResult.recommendedPaths.length > 0 && (
                          <Col md={6}>
                            <Card className="result-card h-100">
                              <Card.Body className="p-4">
                                <div className="result-icon-wrapper bg-success mb-3">
                                  <Target size={24} />
                                </div>
                                <h4 className="fw-bold text-dark mb-3">Recommended Paths</h4>
                                <div className="recommended-paths">
                                  {assessmentResult.recommendedPaths.slice(0, 3).map((path, index) => (
                                    <div key={index} className="path-item d-flex align-items-center mb-2">
                                      <Star size={16} className="text-warning me-2" />
                                      <span className="text-dark">{path}</span>
                                    </div>
                                  ))}
                                </div>
                                {assessmentResult.recommendedPaths.length > 3 && (
                                  <p className="text-muted small mt-2 mb-0">
                                    +{assessmentResult.recommendedPaths.length - 3} more recommendations
                                  </p>
                                )}
                              </Card.Body>
                            </Card>
                          </Col>
                        )}

                        {/* Strengths */}
                        {assessmentResult?.strengths && assessmentResult.strengths.length > 0 && (
                          <Col md={12}>
                            <Card className="result-card">
                              <Card.Body className="p-4">
                                <div className="result-icon-wrapper bg-warning mb-3">
                                  <BookOpen size={24} />
                                </div>
                                <h4 className="fw-bold text-dark mb-3">Your Strengths</h4>
                                <Row>
                                  {assessmentResult.strengths.slice(0, 4).map((strength, index) => (
                                    <Col md={6} key={index} className="mb-2">
                                      <div className="strength-item d-flex align-items-center">
                                        <CheckCircle size={16} className="text-success me-2" />
                                        <span className="text-dark">{strength}</span>
                                      </div>
                                    </Col>
                                  ))}
                                </Row>
                              </Card.Body>
                            </Card>
                          </Col>
                        )}
                      </Row>

                      {/* Action Buttons for Results */}
                      <div className="results-actions text-center mt-5">
                        <Row className="g-3 justify-content-center">
                          <Col xs={12} md={4}>
                            <Button
                              variant="primary"
                              onClick={viewResults}
                              className="w-100 modern-cta-btn"
                              size="lg"
                            >
                              <BarChart3 size={20} className="me-2" />
                              View Detailed Results
                            </Button>
                          </Col>
                          <Col xs={12} md={4}>
                            <Button
                              variant="outline-primary"
                              onClick={retakeAssessment}
                              className="w-100 modern-btn-outline"
                              size="lg"
                            >
                              <Sparkles size={20} className="me-2" />
                              Retake Assessment
                            </Button>
                          </Col>
                        </Row>
                      </div>
                    </div>
                  ) : (
                    /* Original Content for Incomplete/New Assessment */
                    <>
                      {/* Modern Features Grid */}
                      <div className="modern-features-grid mb-5">
                        <Row className="g-4">
                          <Col md={4}>
                            <div className="modern-feature-card">
                              <div className="feature-icon-wrapper bg-primary">
                                <BarChart3 size={24} />
                              </div>
                              <h5 className="fw-bold text-dark mb-2">
                                Career Assessment
                              </h5>
                              <p className="text-muted mb-0 small">
                                Comprehensive evaluation of your strengths and preferences
                              </p>
                            </div>
                          </Col>
                          <Col md={4}>
                            <div className="modern-feature-card">
                              <div className="feature-icon-wrapper bg-success">
                                <Target size={24} />
                              </div>
                              <h5 className="fw-bold text-dark mb-2">
                                Personalized Results
                              </h5>
                              <p className="text-muted mb-0 small">
                                Tailored recommendations based on your profile
                              </p>
                            </div>
                          </Col>
                          <Col md={4}>
                            <div className="modern-feature-card">
                              <div className="feature-icon-wrapper bg-warning">
                                <Timer size={24} />
                              </div>
                              <h5 className="fw-bold text-dark mb-2">
                                Quick & Easy
                              </h5>
                              <p className="text-muted mb-0 small">
                                Complete in just 10-15 minutes
                              </p>
                            </div>
                          </Col>
                        </Row>
                      </div>

                      {/* Modern CTA Section */}
                      <div className="modern-cta-section text-center">
                        <Button
                          variant={progressExists ? "warning" : "primary"}
                          size="lg"
                          onClick={handleStartAssessment}
                          className="modern-cta-btn"
                        >
                          {progressExists ? (
                            <>
                              <History size={20} className="me-2" />
                              Resume Assessment
                              <ArrowRight size={16} className="ms-2" />
                            </>
                          ) : (
                            <>
                              <Play size={20} className="me-2" />
                              Start Assessment
                              <ArrowRight size={16} className="ms-2" />
                            </>
                          )}
                        </Button>
                        <p className="text-muted mt-3 small">
                          {progressExists
                            ? "Continue your journey to discover your ideal career path"
                            : "Begin your journey to discover your ideal career path"}
                        </p>
                      </div>
                    </>
                  )}

                  {/* Modern Carousel - Show for all states */}
                  <div className="modern-carousel-container mt-5">
                    <Carousel
                      activeIndex={index}
                      onSelect={handleSelect}
                      interval={4000}
                      fade
                      indicators={false}
                    >
                      <Carousel.Item>
                        <div className="modern-carousel-item">
                          <img
                            src={discover}
                            alt="Career assessment illustration"
                            className="modern-carousel-image"
                          />
                          <div className="modern-carousel-caption">
                            <CheckCircle size={24} className="mb-2 text-success" />
                            <h5>Discover Your Strengths</h5>
                            <p>Identify your unique talents through comprehensive assessment</p>
                          </div>
                        </div>
                      </Carousel.Item>
                      
                      <Carousel.Item>
                        <div className="modern-carousel-item">
                          <img
                            src="/api/placeholder/800/400"
                            alt="Career paths illustration"
                            className="modern-carousel-image"
                          />
                          <div className="modern-carousel-caption">
                            <Target size={24} className="mb-2 text-primary" />
                            <h5>Explore Career Paths</h5>
                            <p>Find the perfect match based on your interests and personality</p>
                          </div>
                        </div>
                      </Carousel.Item>
                      
                      <Carousel.Item>
                        <div className="modern-carousel-item">
                          <img
                            src="/api/placeholder/800/400"
                            alt="Success stories illustration"
                            className="modern-carousel-image"
                          />
                          <div className="modern-carousel-caption">
                            <Sparkles size={24} className="mb-2 text-warning" />
                            <h5>Plan Your Future</h5>
                            <p>Get personalized recommendations for your academic journey</p>
                          </div>
                        </div>
                      </Carousel.Item>
                    </Carousel>
                    
                    {/* Custom Indicators */}
                    <div className="modern-carousel-indicators">
                      {[0, 1, 2].map((i) => (
                        <button
                          key={i}
                          className={`indicator ${index === i ? 'active' : ''}`}
                          onClick={() => setIndex(i)}
                        />
                      ))}
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </div>
          </div>
        </section>
      </Container>
    </div>
  );
}

export default WelcomeScreenComponent;