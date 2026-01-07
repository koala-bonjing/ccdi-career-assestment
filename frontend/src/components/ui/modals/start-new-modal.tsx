import { AlertTriangle, Rocket, X } from "lucide-react";
import { Button, Modal } from "react-bootstrap";

interface StartNewModalProps {
  show: boolean;
  onHide: () => void;
  handleReset: () => void;
}

export const StartNewModal = ({
  show,
  onHide,
  handleReset,
}: StartNewModalProps) => {
  return (
    <Modal show={show} onHide={onHide} centered className="modern-modal">
      <Modal.Header
        className="modern-modal-header border-0"
        closeButton
        closeVariant="white"
      >
        <Modal.Title className="w-100 text-center">
          <div className="modal-icon-wrapper">
            <AlertTriangle size={32} className="text-warning" />
          </div>
          <h4 className="fw-bold mt-3">Confirm Reset?</h4>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="text-center pt-0">
        <p className="text-muted mb-4 modern-modal-text">
          Starting a new assessment will <strong>permanently erase</strong> your
          current progress.
          <br />
          Are you sure you want to continue?
        </p>

        <div className="d-flex flex-column flex-sm-row justify-content-center gap-3">
          <Button
            variant="outline-primary"
            onClick={onHide}
            className="flex-fill modern-btn-outline"
            size="lg"
          >
            <X size={18} className="me-2" />
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleReset}
            className="flex-fill modern-btn-primary"
            size="lg"
            style={{
              background: "linear-gradient(135deg, #A41D31 0%, #EC2326 100%)",
              border: "none",
            }}
          >
            <Rocket size={18} className="me-2" />
            Yes, Reset
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};
