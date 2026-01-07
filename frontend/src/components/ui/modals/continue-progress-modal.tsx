// src/components/WelcomeScreen/components/Modals/ContinueProgressModal.tsx
import { Button, Modal } from 'react-bootstrap';
import { History, Sparkles, } from 'lucide-react';

interface ContinueProgressModalProps {
  show: boolean;
  onHide: () => void;
  onContinue: () => void;
  onStartNew: () => void;
}

export const ContinueProgressModal = ({
  show,
  onHide,
  onContinue,
  onStartNew,
}: ContinueProgressModalProps) => (
  <Modal show={show} onHide={onHide} centered className="modern-modal">
    <Modal.Header closeButton className="modern-modal-header border-0">
      <Modal.Title className="w-100 text-center">
        <div className="modal-icon-wrapper"><History size={32} /></div>
        <h4 className="fw-bold mt-3">Continue Your Progress?</h4>
      </Modal.Title>
    </Modal.Header>

    <Modal.Body className="text-center pt-0">
      <p className="text-muted mb-4 modern-modal-text">
        We found an incomplete assessment from your previous session. Choose to continue or start fresh.
      </p>
        
      <div className="d-flex flex-column flex-sm-row justify-content-center gap-3">
        <Button
          variant="outline-primary"
          onClick={onContinue}
          className="flex-fill modern-btn-outline"
          size="lg"
        >
          <History size={18} className="me-2" /> Continue Progress
        </Button>
        <Button
          variant="primary"
          onClick={onStartNew}
          className="flex-fill modern-btn-primary"
          size="lg"
        >
          <Sparkles size={18} className="me-2" /> Start Fresh
        </Button>
      </div>
    </Modal.Body>
  </Modal>
);