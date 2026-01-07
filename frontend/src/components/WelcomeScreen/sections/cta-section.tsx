// src/components/WelcomeScreen/components/Sections/CtaSection.tsx
import { Button } from 'react-bootstrap';
import { Play, History, ArrowRight } from 'lucide-react';

interface CtaSectionProps {
  hasProgress: boolean;
  onStart: () => void;
}

export const CtaSection = ({ hasProgress, onStart }: CtaSectionProps) => (
  <div className="modern-cta-section text-center">
    <Button
      variant={hasProgress ? 'warning' : 'primary'}
      size="lg"
      onClick={onStart}
      className="modern-cta-btn text-white"
    >
      {hasProgress ? (
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
      {hasProgress
        ? 'Continue your journey to discover your ideal career path'
        : 'Begin your journey to discover your ideal career path'}
    </p>
  </div>
);