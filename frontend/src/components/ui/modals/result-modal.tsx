// src/components/WelcomeScreen/components/Modals/ResultsModal.tsx
import { Modal, Row, Col, ProgressBar, Badge } from "react-bootstrap";
import {
  Award,
  TrendingUp,
  FileText,
  Target,
  Star,
  BarChart3,
  RotateCcw,
  CheckCircle,
} from "lucide-react";
import { Button } from "react-bootstrap";
import { ResultCard } from "../../WelcomeScreen/cards/result-card"; // ✅ fixed path (was WelcomeForm/cards/...)

// 🔹 Keep local interface for now (but eventually import from types)
interface AssessmentResult {
  completed: boolean;
  score?: number;
  totalQuestions?: number;
  recommendedPaths?: string[];
  strengths?: string[];
  completionDate?: string;
}

interface ResultsModalProps {
  show: boolean;
  onHide: () => void;
  assessmentResult: AssessmentResult | null;
  onRetake: () => void;
  onViewResults: () => void;
}

export const ResultsModal = ({
  show,
  onHide,
  assessmentResult,
  onRetake,
  onViewResults,
}: ResultsModalProps) => {
  if (!assessmentResult) {
    return (
      <Modal
        show={show}
        onHide={onHide}
        centered
        size="lg"
        className="modern-modal results-modal"
      >
        <Modal.Header closeButton className="modern-modal-header border-0">
          <Modal.Title className="w-100 text-center">
            <div className="modal-icon-wrapper bg-success">
              <Award size={32} />
            </div>
            <h4 className="fw-bold mt-3">Loading Results...</h4>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Preparing your career insights...</p>
        </Modal.Body>
      </Modal>
    );
  }

  const {
    score = 0,
    totalQuestions = 50,
    recommendedPaths = [],
    completionDate = new Date().toLocaleDateString(),
  } = assessmentResult;

  return (
    <Modal
      show={show}
      onHide={onHide}
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
            You've already completed the career assessment. Here's a summary of
            your results:
          </p>
        </div>

        <Row className="g-3 mb-4">
          {score > 0 && (
            <Col md={6}>
              <ResultCard
                icon={<TrendingUp size={24} />}
                iconBg="bg-primary"
                title="Your Score"
                content={
                  <>
                    <div className="score-display mb-2">
                      <span className="h4 fw-bold text-primary">{score}</span>
                      <span className="text-muted"> /{totalQuestions}</span>
                    </div>
                    <ProgressBar
                      now={(score / (totalQuestions || 1)) * 100}
                      variant="primary"
                      style={{ height: "6px" }}
                    />
                  </>
                }
              />
            </Col>
          )}

          <Col md={6}>
            <ResultCard
              icon={<FileText size={24} />}
              iconBg="bg-info"
              title="Completed On"
              content={
                <>
                  <p className="text-primary fw-bold mb-1">{completionDate}</p>
                  <Badge bg="success" className="completed-badge">
                    <CheckCircle size={12} className="me-1" />
                    Completed
                  </Badge>
                </>
              }
            />
          </Col>
        </Row>

        {recommendedPaths.length > 0 && (
          <ResultCard
            icon={<Target size={24} />}
            iconBg="bg-success"
            title="Top Recommendations"
            content={
              <div className="recommendations-list">
                {recommendedPaths.slice(0, 2).map((path, i) => (
                  <div
                    key={i}
                    className="recommendation-item d-flex align-items-center mb-1"
                  >
                    <Star size={14} className="text-warning me-2" />
                    <span className="small text-dark">{path}</span>
                  </div>
                ))}
                {recommendedPaths.length > 2 && (
                  <p className="text-muted small mt-1 mb-0">
                    +{recommendedPaths.length - 2} more career paths
                  </p>
                )}
              </div>
            }
          />
        )}

        <div className="d-flex flex-column flex-sm-row justify-content-center gap-3 mt-4">
          <Button
            variant="outline-primary"
            onClick={onRetake}
            className="flex-fill modern-btn-outline"
            size="lg"
          >
            <RotateCcw size={18} className="me-2" /> Retake Assessment
          </Button>
          <Button
            variant="primary"
            onClick={onViewResults}
            className="flex-fill modern-btn-primary"
            size="lg"
          >
            <BarChart3 size={18} className="me-2" /> View Full Results
          </Button>
        </div>

        <div className="text-center mt-3">
          <Button variant="link" onClick={onHide} className="text-muted">
            Maybe later
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};
