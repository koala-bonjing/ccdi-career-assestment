  // src/components/WelcomeScreen/components/Sections/CtaSection.tsx
  import { Button } from 'react-bootstrap';
  import { Play, History, ArrowRight } from 'lucide-react';

  interface CtaSectionProps {
    hasProgress: boolean;
    hasCompleted: boolean;
    onStart: () => void;
    onViewResults?: () => void;
  }

  export const CtaSection = ({
    hasProgress,
    hasCompleted,
    onStart,
    onViewResults,
  }: CtaSectionProps) => {
    const renderButtonContent = () => {
      if (hasCompleted) {
        return (
          <>
            <History size={20} className="me-2" />
            View Results
            <ArrowRight size={16} className="ms-2" />
          </>
        );
      } else if (hasProgress) {
        return (
          <>
            <History size={20} className="me-2" />
            Resume Assessment
            <ArrowRight size={16} className="ms-2" />
          </>
        );
      } else {
        return (
          <>
            <Play size={20} className="me-2" />
            Start Assessment
            <ArrowRight size={16} className="ms-2" />
          </>
        );
      }
    };

    const renderCaption = () => {
      if (hasCompleted) {
        return 'Review your personalized career recommendations';
      } else if (hasProgress) {
        return 'Continue your journey to discover your ideal career path';
      } else {
        return 'Begin your journey to discover your ideal career path';
      }
    };

    const handleClick = () => {
      if (hasCompleted && onViewResults) {
        onViewResults();
      } else {
        onStart();
      }
    };

    return (
      <div className="modern-cta-section text-center">
        <Button
          variant={
            hasCompleted ? 'success' : hasProgress ? 'warning' : 'primary'
          }
          size="lg"
          onClick={handleClick}
          className="modern-cta-btn text-white"
        >
          {renderButtonContent()}
        </Button>
        <p className="text-muted mt-3 small">{renderCaption()}</p>
      </div>
    );
  };