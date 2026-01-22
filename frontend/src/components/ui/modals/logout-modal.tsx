import { LogOutIcon, X } from "lucide-react";
import { Button, Modal } from "react-bootstrap";

interface LogoutModalProps {
  show: boolean;
  onHide: () => void;
  onConfirm: () => void;
}

export const LogoutModal = ({ show, onHide, onConfirm }: LogoutModalProps) => {
  return (
    <Modal show={show} onHide={onHide} centered className="modern-modal">
      <Modal.Header
        className="modern-modal-header border-0"
        closeButton
        closeVariant="white"
      >
        <Modal.Title className="w-100 text-center">
          <div className="modal-icon-wrapper">
            <LogOutIcon size={32} className="text-warning" />
          </div>
          <h4 className="fw-bold mt-3">Confirm Logout?</h4>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="text-center pt-0">
        <p className="text-muted m-4 modern-modal-text">
          Are you sure you want to <strong>logout?</strong>
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
            onClick={onConfirm}
            className="flex-fill modern-btn-primary"
            size="lg"
            style={{
              background: "linear-gradient(135deg, #A41D31 0%, #EC2326 100%)",
              border: "none",
            }}
          >
            <LogOutIcon size={18} className="me-2" />
            Yes, Logout
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};
