// src/components/WelcomeScreen/components/Toasts/ProgressToast.tsx
import { Toast, Button } from 'react-bootstrap';
import { History, X } from 'lucide-react';

interface ProgressToastProps {
  show: boolean;
  onClose: () => void;
}

export const ProgressToast = ({ show, onClose }: ProgressToastProps) => (
  <Toast
    show={show}
    onClose={onClose}
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
        onClick={onClose}
        className="p-0 border-0"
      >
        <X size={14} />
      </Button>
    </Toast.Header>
    <Toast.Body className="modern-toast-body">
      We found your incomplete assessment. Pick up where you left off!
    </Toast.Body>
  </Toast>
);