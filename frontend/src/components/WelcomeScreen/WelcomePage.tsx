// src/components/WelcomeScreen/WelcomeScreenComponent.tsx
import { useEffect, useState } from "react";
import { useWelcomeScreen } from "../../../store/useWelcomeScreenStore";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import NavigationBar from "../NavigationBarComponents/NavigationBar";

import { ToastContainer } from "react-bootstrap";
import "./WelcomePage.css";

// Submodules
import { ProgressToast } from "../ui/toast/progress-toast";
import { ContinueProgressModal } from "../ui/modals/continue-progress-modal";
import { ResultsModal } from "../ui/modals/result-modal";
import { HeaderSection } from "./sections/header-section";
import { UserSection } from "./sections/user-section";
import { ResultsSection } from "./sections/result-section";
import { FeaturesSection } from "./sections/feature-section";
import { CtaSection } from "./sections/cta-section";
import { CarouselSection } from "./sections/carousel-section";

import { useAssessmentState } from "../../hooks/useAssessmentState";

type Props = {
  onStartNew?: () => void;
};

export default function WelcomeScreenComponent({ onStartNew }: Props) {
  const { hideWelcome } = useWelcomeScreen();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [showProgressModal, setShowProgressModal] = useState(false);
  const [showProgressToast, setShowProgressToast] = useState(false);
  const [showResultsModal, setShowResultsModal] = useState(false);

  const {
    assessmentResult,
    hasProgress,
    hasCompleted,
    clearAssessmentStorage,
    refetch,
  } = useAssessmentState();

  // Side effects on auth change
  useEffect(() => {
    if (isAuthenticated) {
      if (hasCompleted) {
        setShowResultsModal(true);
        setShowProgressModal(false);
      } else if (hasProgress) {
        setShowProgressModal(true);
        setShowProgressToast(true);
      }
    }
  }, [isAuthenticated, hasCompleted, hasProgress]);

  if (!isAuthenticated) {
    return (
      <div className="assessment-container">
        <NavigationBar />
        <div
          className="main-content d-flex align-items-center justify-content-center"
          style={{ minHeight: "80vh" }}
        >
          <div className="text-center">
            <div className="spinner-border text-primary mb-3" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <div className="text-xl text-gray-600">Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  // 🚀 Action Handlers (lean)
  const startNewAssessment = () => {
    clearAssessmentStorage();
    if (onStartNew) onStartNew();
    else navigate("/assessment");
    hideWelcome();
  };

  const continueAssessment = () => {
    hideWelcome();
    navigate("/assessment");
  };

  const viewResults = () => {
    setShowResultsModal(false);
    hideWelcome();
    navigate("/results");
  };

  const retakeAssessment = () => {
    clearAssessmentStorage();
    refetch();
    setShowResultsModal(false);
    startNewAssessment();
  };

  const continueToResults = () => {
    setShowResultsModal(false);
    hideWelcome();
    navigate("/results");
  };

  const handleStartAssessment = () => {
    if (hasCompleted) setShowResultsModal(true);
    else if (hasProgress) setShowProgressModal(true);
    else startNewAssessment();
  };

  return (
    <div className="welcome-assessment-container">
      <NavigationBar />

      <ToastContainer position="top-center" className="p-3">
        <ProgressToast
          show={showProgressToast}
          onClose={() => setShowProgressToast(false)}
        />
      </ToastContainer>

      <ContinueProgressModal
        show={showProgressModal}
        onHide={() => setShowProgressModal(false)}
        onContinue={continueAssessment}
        onStartNew={startNewAssessment}
      />

      <ResultsModal
        show={showResultsModal}
        onHide={() => setShowResultsModal(false)}
        assessmentResult={assessmentResult!}
        onRetake={retakeAssessment}
        onViewResults={continueToResults}
      />

      <div className="welcome-main-content">
        <div className="d-flex justify-content-center">
          <div className="w-100">
            <HeaderSection hasCompleted={hasCompleted} />
            <div className="modern-welcome-card p-4 p-lg-5">
              <UserSection
                user={user}
                hasCompleted={hasCompleted}
                assessmentResult={assessmentResult}
              />

              {hasCompleted && assessmentResult ? (
                <ResultsSection
                  assessmentResult={assessmentResult}
                  onViewResults={viewResults}
                  onRetake={retakeAssessment}
                />
              ) : (
                <>
                  <FeaturesSection />
                  <CtaSection
                    hasProgress={hasProgress}
                    onStart={handleStartAssessment}
                  />
                </>
              )}

              <CarouselSection />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
