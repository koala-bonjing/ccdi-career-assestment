// src/components/WelcomeScreen/components/Sections/HeaderSection.tsx
import { Sparkles } from 'lucide-react';

interface HeaderSectionProps {
  hasCompleted: boolean;
}

export const HeaderSection = ({ hasCompleted }: HeaderSectionProps) => (
  <div className="modern-header text-center mb-5">
    <div className="header-badge mb-3">
      <Sparkles size={20} className="me-2" />
      Career Assessment Platform
    </div>
    <h1 className="display-4 fw-bold text-dark mb-3">
      {hasCompleted ? (
        <>
          Your Career <span className="gradient-text">Results</span>
        </>
      ) : (
        <>
          Discover Your <span className="gradient-text">Career Path</span>
        </>
      )}
    </h1>
    <p className="lead text-muted max-w-600 mx-auto">
      {hasCompleted
        ? "View your personalized career assessment results and recommended paths"
        : "Unlock your potential with our comprehensive career assessment and get personalized program recommendations."}
    </p>
  </div>
);  