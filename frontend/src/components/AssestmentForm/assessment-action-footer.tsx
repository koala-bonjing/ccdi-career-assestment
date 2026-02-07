// src/components/AssessmentForm/AssessmentActionFooter.tsx
import React, { useState } from "react";
import { Card, Row, Col, Button, Badge } from "react-bootstrap";
import { Rocket } from "lucide-react";
import type { AssessmentActionFooterProps } from "./types";
import { StartNewModal } from "../ui/modals/start-new-modal";

const AssessmentActionFooter: React.FC<AssessmentActionFooterProps> = ({
  currentSection,
  totalSections,
  onPrevious,
  onNext,
  onReset,
  isLastSection,
  isComplete,
  nextLabel = "Next Section →",
}) => {
  const [showResetModal, setShowResetModal] = useState(false);

  const handleReset = () => {
    setShowResetModal(false);
    onReset();
  };

  return (
    <>
      <Card.Footer className="bg-transparent border-0 py-4 gap-1">
        <Row className="align-items-center">
          <Col md={4}>
            {currentSection > 0 && (
              <Button
                variant="outline-secondary"
                onClick={onPrevious}
                size="lg"
                className="w-100 h-20"
              >
                ← Previous Section
              </Button>
            )}
          </Col>
          <Col md={4} className="text-center">
            <Badge bg="light" text="dark" className="fs-6 p-3 border">
              Section {currentSection + 1} of {totalSections}
            </Badge>
          </Col>
          <Col md={4}>
            <Button
              variant={isLastSection && !isComplete ? "secondary" : "primary"}
              onClick={onNext}
              disabled={isLastSection && !isComplete}
              size="lg"
              className="w-100 h-20"
            >
              {isLastSection && !isComplete
                ? "Complete All Questions"
                : nextLabel}
            </Button>
          </Col>
        </Row>

        <div className="text-center mt-4">
          <Button
            variant="outline-danger"
            size="lg"
            onClick={() => setShowResetModal(true)}
            className="px-4"
          >
            <Rocket size={16} className="me-1" />
            Start New Assessment
          </Button>
        </div>
      </Card.Footer>

      <StartNewModal
        show={showResetModal}
        onHide={() => setShowResetModal(false)}
        handleReset={handleReset}
      />
    </>
  );
};

export default AssessmentActionFooter;
