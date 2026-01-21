// src/components/AssessmentForm/modals/AssessmentInstructionsModal.tsx
import React from "react";
import { Modal, Button } from "react-bootstrap";
import {
  BookOpen,
  Clock,
  CheckCircle,
  EyeOff,
  BarChart3,
  Brain,
  Code,
  GraduationCap,
  Workflow,
} from "lucide-react";

interface AssessmentInstructionsModalProps {
  show: boolean;
  onHide: () => void;
}

export const AssessmentInstructionsModal: React.FC<
  AssessmentInstructionsModalProps
> = ({ show, onHide }) => {
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
            Welcome! This comprehensive assessment helps CCDI recommend the
            best-fit technology program for your future career based on your
            readiness, skills, interests, and learning style.
          </p>
        </div>

        {/* Key Info Cards */}
        <div className="row g-3 mb-4">
          <div className="col-6 col-md-3">
            <div className="d-flex flex-column align-items-center text-center">
              <Clock size={24} className="text-primary mb-1" />
              <small className="text-muted">Duration</small>
              <strong>20–25 mins</strong>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="d-flex flex-column align-items-center text-center">
              <CheckCircle size={24} className="text-success mb-1" />
              <small className="text-muted">Sections</small>
              <strong>5 Parts</strong>
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
              <strong>AI-Powered</strong>
            </div>
          </div>
        </div>

        {/* Section Breakdown */}
        <h6 className="fw-bold mb-3 text-center">What You'll Be Asked</h6>
        <div className="row g-3 mb-4">
          {/* NEW: Foundational Assessment */}
          <div className="col-md-12">
            <div className="d-flex align-items-start p-3 border rounded-3 bg-light">
              <GraduationCap
                size={24}
                className="text-primary me-3 mt-1 flex-shrink-0"
              />
              <div>
                <h6 className="fw-bold mb-1">
                  1. Foundational Assessment (37 Questions)
                </h6>
                <p className="small text-muted mb-2">
                  We'll assess your readiness across three key areas:
                </p>
                <ul className="small text-muted mb-0 ps-3">
                  <li>
                    <strong>Basic Skills:</strong> Math level, English reading,
                    computer literacy, and technical background
                  </li>
                  <li>
                    <strong>Study Habits:</strong> Time availability, study
                    environment, organization skills, and past performance
                  </li>
                  <li>
                    <strong>Logic & Puzzles:</strong> Simple problem-solving
                    tests to see how you think and approach challenges
                  </li>
                </ul>
                <div className="mt-2 p-2 bg-white rounded-2 border border-info">
                  <small className="text-info fw-semibold">
                    💡 Tip: Answer honestly! Some questions have right/wrong
                    answers to help us assess your current knowledge level.
                  </small>
                </div>
              </div>
            </div>
          </div>

          {/* Academic Aptitude */}
          <div className="col-md-6">
            <div className="d-flex align-items-start">
              <BarChart3
                size={22}
                className="text-primary me-3 mt-1 flex-shrink-0"
              />
              <div>
                <h6 className="fw-bold mb-1">2. Academic Aptitude</h6>
                <p className="small text-muted mb-0">
                  Rate your confidence in math, logic, problem-solving, and
                  theoretical concepts using a 1-5 scale.
                </p>
              </div>
            </div>
          </div>

          {/* Technical Skills */}
          <div className="col-md-6">
            <div className="d-flex align-items-start">
              <Code size={22} className="text-danger me-3 mt-1 flex-shrink-0" />
              <div>
                <h6 className="fw-bold mb-1">
                  3. Technical Skills & Interests
                </h6>
                <p className="small text-muted mb-0">
                  Check what excites you: coding, building systems, working with
                  hardware, or troubleshooting. No prior experience needed!
                </p>
              </div>
            </div>
          </div>

          {/* Career Interests */}
          <div className="col-md-6">
            <div className="d-flex align-items-start">
              <Workflow
                size={22}
                className="text-info me-3 mt-1 flex-shrink-0"
              />
              <div>
                <h6 className="fw-bold mb-1">4. Career Interests</h6>
                <p className="small text-muted mb-0">
                  Rate your interest in activities like coding, system design,
                  business analysis, or electronics work.
                </p>
              </div>
            </div>
          </div>

          {/* Learning Style */}
          <div className="col-md-6">
            <div className="d-flex align-items-start">
              <Brain
                size={22}
                className="text-warning me-3 mt-1 flex-shrink-0"
              />
              <div>
                <h6 className="fw-bold mb-1">5. Learning & Work Style</h6>
                <p className="small text-muted mb-0">
                  Select preferences for learning style, work environment,
                  available resources, and career goals. Choose all that apply!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Program Options */}
        <div className="bg-light rounded p-3 mb-4">
          <h6 className="fw-bold mb-2">Programs We'll Recommend From:</h6>
          <div className="row small">
            <div className="col-md-6">
              <p className="mb-1">
                <strong>BSCS</strong> - Computer Science (Software Development,
                AI/ML)
              </p>
              <p className="mb-1">
                <strong>BSIT</strong> - Information Technology (Networking,
                Cybersecurity)
              </p>
              <p className="mb-1">
                <strong>BSIS</strong> - Information Systems (Business Analysis,
                Data)
              </p>
            </div>
            <div className="col-md-6">
              <p className="mb-1">
                <strong>BSET Electronics</strong> - Electronics Technology
                (Circuits, Robotics)
              </p>
              <p className="mb-1">
                <strong>BSET Electrical</strong> - Electrical Technology (Power
                Systems, Automation)
              </p>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="alert alert-light border-start border-primary border-4 p-3 mb-4">
          <h6 className="fw-bold mb-2">💡 Tips for Best Results</h6>
          <ul className="mb-0 small">
            <li>
              <strong>Be honest</strong> — Some questions test your actual
              knowledge (not just interest), so answer truthfully for accurate
              recommendations.
            </li>
            <li>
              <strong>Don't stress about "wrong" answers</strong> — The goal is
              to find the right program for YOU, not to get a perfect score.
            </li>
            <li>
              For the <strong>Foundational Assessment</strong>, don't guess
              wildly. If you don't know, select "I don't know" or the closest
              option.
            </li>
            <li>
              For the <strong>Learning & Work Style</strong> section, select{" "}
              <strong>all options that apply to you</strong>.
            </li>
            <li>
              You can navigate between questions and edit answers before final
              submission.
            </li>
          </ul>
        </div>

        {/* After Submission */}
        <div className="bg-light rounded p-3 mb-4">
          <h6 className="fw-bold mb-2">📊 After You Finish</h6>
          <p className="small mb-0">
            You'll instantly receive:
            <br />• <strong>AI-generated recommendation</strong> for your
            best-fit CCDI program
            <br />• <strong>Readiness assessment</strong> showing if you need
            any preparation (math review, computer basics, etc.)
            <br />• <strong>Detailed compatibility scores</strong> across all
            assessment areas
            <br />• <strong>Personalized explanation</strong> of why each
            program fits your profile
            <br />• <strong>Preparation timeline</strong> with specific courses
            or resources you might need
            <br />• <strong>Visual breakdowns</strong> with charts showing your
            strengths
          </p>
        </div>

        {/* Privacy Note */}
        <div className="text-center p-2 bg-white border rounded">
          <EyeOff size={16} className="me-1" />
          <small className="text-muted">
            Your responses are private and confidential. They are only used to
            generate your personalized program recommendations and readiness
            assessment.
          </small>
        </div>
      </Modal.Body>

      <Modal.Footer className="border-0 justify-content-center pb-4">
        <Button
          variant="primary"
          onClick={() => {
            localStorage.setItem("hasSeenAssessmentInstructions", "true");
            onHide();
          }}
          className="modern-btn-primary px-5 py-2"
          style={{
            background: "linear-gradient(135deg, #1C6CB3 0%, #2B3176 100%)",
            border: "none",
            fontSize: "1rem",
            fontWeight: "600",
          }}
        >
          Start Assessment →
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
