// src/components/AssessmentForm/modals/AssessmentInstructionsModal.tsx
import React from "react";
import { Modal, Button } from "react-bootstrap";
import {
  BookOpen,
  Clock,
  CheckCircle,
  EyeOff,
  BarChart3,
  Target,
  Users,
  Laptop,
} from "lucide-react";

interface AssessmentInstructionsModalProps {
  show: boolean;
  onHide: () => void;
}

export const AssessmentInstructionsModal: React.FC<AssessmentInstructionsModalProps> = ({
  show,
  onHide,
}) => {
  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      size="lg"
      className="modern-modal"
    >
      <Modal.Header
        className="modern-modal-header border-0 pb-0"
        closeButton
        closeVariant="white"
      >
        <Modal.Title className="w-100 text-center">
          <div className="modal-icon-wrapper">
            <BookOpen size={32} className="text-info" />
          </div>
          <h4 className="fw-bold mt-3">Assessment Instructions</h4>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="modern-modal-text pt-0">
        <div className="text-center mb-4 mt-4">
          <p className="text-muted">
            Welcome! This quick assessment helps CCDI recommend the best-fit program for your future.
          </p>
        </div>

        {/* Key Info Cards */}
        <div className="row g-3 mb-4">
          <div className="col-6 col-md-3">
            <div className="d-flex flex-column align-items-center text-center">
              <Clock size={24} className="text-primary mb-1" />
              <small className="text-muted">Duration</small>
              <strong>8–12 mins</strong>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="d-flex flex-column align-items-center text-center">
              <CheckCircle size={24} className="text-success mb-1" />
              <small className="text-muted">Questions</small>
              <strong>~50 total</strong>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="d-flex flex-column align-items-center text-center">
              <EyeOff size={24} className="text-info mb-1" />
              <small className="text-muted">Privacy</small>
              <strong>Confidential</strong>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="d-flex flex-column align-items-center text-center">
              <BarChart3 size={24} className="text-warning mb-1" />
              <small className="text-muted">Result</small>
              <strong>Instant</strong>
            </div>
          </div>
        </div>

        {/* Section Breakdown */}
        <h6 className="fw-bold mb-3 text-center">What You’ll Be Asked</h6>
        <div className="row g-4 mb-4">
          <div className="col-md-6">
            <div className="d-flex align-items-start">
              <Target size={22} className="text-primary me-3 mt-1 flex-shrink-0" />
              <div>
                <h6 className="fw-bold">Career Interests</h6>
                <p className="small text-muted mb-0">
                  Rate your interest in tasks like coding, designing systems, working with people, or hands-on electronics.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="d-flex align-items-start">
              <BarChart3 size={22} className="text-success me-3 mt-1 flex-shrink-0" />
              <div>
                <h6 className="fw-bold">Academic Aptitude</h6>
                <p className="small text-muted mb-0">
                  Self-assess your strengths in logic, math, reading comprehension, and problem-solving.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="d-flex align-items-start">
              <Users size={22} className="text-warning me-3 mt-1 flex-shrink-0" />
              <div>
                <h6 className="fw-bold">Learning Style</h6>
                <p className="small text-muted mb-0">
                  Choose how you learn best: watching demos, group discussions, reading manuals, or trying things yourself.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="d-flex align-items-start">
              <Laptop size={22} className="text-danger me-3 mt-1 flex-shrink-0" />
              <div>
                <h6 className="fw-bold">Technical Skills</h6>
                <p className="small text-muted mb-0">
                  Indicate your experience with programming, networking, hardware, or software tools (no prior knowledge needed!).
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="alert alert-light border-start border-primary border-4 p-3 mb-4">
          <h6 className="fw-bold mb-2">💡 Tips for Best Results</h6>
          <ul className="mb-0 small">
            <li>Answer honestly — there are no “right” or “wrong” answers.</li>
            <li>Think about what you genuinely enjoy, not what you think you “should” pick.</li>
            <li>You can review and edit answers before final submission.</li>
          </ul>
        </div>

        {/* After Submission */}
        <div className="bg-light rounded p-3 mb-4">
          <h6 className="fw-bold mb-2">After You Finish</h6>
          <p className="small mb-0">
            You’ll instantly see:
            <br />
            • Your recommended CCDI program (BSIT, BSCS, BSIS, or BSET)
            <br />
            • Compatibility scores for all programs
            <br />
            • A detailed explanation of why it’s the best fit
            <br />
            • Option to save or print your results
          </p>
        </div>

        {/* Privacy Note */}
        <div className="text-center p-2 bg-white border rounded">
          <EyeOff size={16} className="me-1" />
          <small className="text-muted">
            Your responses are private and used only for personalized recommendations.
          </small>
        </div>
      </Modal.Body>

      <Modal.Footer className="border-0 justify-content-center pb-4">
        <Button
          variant="primary"
          onClick={onHide}
          className="modern-btn-primary px-5"
          style={{
            background: "linear-gradient(135deg, #1C6CB3 0%, #2B3176 100%)",
            border: "none",
          }}
        >
          Start Assessment
        </Button>
      </Modal.Footer>
    </Modal>
  );
};