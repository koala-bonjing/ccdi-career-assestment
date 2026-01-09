// src/components/ui/modals/assessment-completed-modal.tsx
import React from "react";
import { Modal, Button } from "react-bootstrap";
import { CheckCircle, BarChart3, RefreshCw } from "lucide-react";
import type { AssessmentResult } from "../../../types";

interface AssessmentCompletedModalProps {
  show: boolean;
  onHide: () => void;
  assessmentResult: AssessmentResult | null;
  onViewResults: () => void;
  onRetake: () => void;
}

export const AssessmentCompletedModal: React.FC<AssessmentCompletedModalProps> = ({
  show,
  onHide,
  assessmentResult,
  onViewResults,
  onRetake,
}) => {
  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      size="lg"
      backdrop="static"
      keyboard={false}
      className="modern-modal"
    >
      <Modal.Header
        className="modern-modal-header border-0 pb-0"
        closeButton
        closeVariant="white"
      >
        <Modal.Title className="w-100 text-center">
          <div className="modal-icon-wrapper">
            <CheckCircle size={32} className="text-success" />
          </div>
          <h4 className="fw-bold mt-3">Assessment Already Completed</h4>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="text-center modern-modal-text pt-0">
        <p className="text-muted mb-4">
          You have already completed the CCDI Career Assessment Test.
        </p>

        {/* Recommended Program Card */}
        <div
          className="d-inline-block bg-white rounded p-3 mb-4 shadow-sm"
          style={{ maxWidth: "500px" }}
        >
          <div className="d-flex align-items-center justify-content-center mb-2">
            <BarChart3 size={20} className="me-2 text-primary" />
            <strong>Your Recommended Program</strong>
          </div>
          <h5 className="mb-0 fw-bold" style={{ color: "#2B3176" }}>
            {assessmentResult?.recommendedProgram || "—"}
          </h5>
        </div>

        {/* Completion Date */}
        <p className="text-muted mb-4 small">
          Completed on:{" "}
          {assessmentResult?.submissionDate
            ? new Date(assessmentResult.submissionDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            : "—"}
        </p>

        {/* Warning Note */}
        <div className="bg-light-warning rounded p-3 mb-4">
          <p className="mb-0 small text-dark">
            <strong>Note:</strong> If you retake the assessment, your previous results will be
            replaced with the new ones.
          </p>
        </div>
      </Modal.Body>

      <Modal.Footer className="border-0 justify-content-center pb-4">
        <div className="d-flex flex-column flex-sm-row justify-content-center gap-3 w-100">
          <Button
            variant="outline-primary"
            onClick={onViewResults}
            className="flex-fill modern-btn-outline"
            size="lg"
          >
            <BarChart3 size={18} className="me-2" />
            View Full Results
          </Button>
          <Button
            variant="primary"
            onClick={onRetake}
            className="flex-fill modern-btn-primary"
            size="lg"
            style={{
              background: "linear-gradient(135deg, #A41D31 0%, #EC2326 100%)",
              border: "none",
            }}
          >
            <RefreshCw size={18} className="me-2" />
            Retake Assessment
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};