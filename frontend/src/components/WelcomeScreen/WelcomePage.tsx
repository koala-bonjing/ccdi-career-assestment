// src/components/WelcomeScreen/WelcomeScreenComponent.tsx
import { useEffect, useState } from "react";
import { useWelcomeScreen } from "../../../store/useWelcomeScreenStore";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import NavigationBar from "../NavigationBarComponents/NavigationBar";
import { useEvaluationStore } from "../../../store/useEvaluationStore"; // ✅ ADD THIS

import { ToastContainer } from "react-bootstrap";
import "./WelcomePage.css";

// Submodules
import { ProgressToast } from "../ui/toast/progress-toast";
import { ContinueProgressModal } from "../ui/modals/continue-progress-modal";
import { HeaderSection } from "./sections/header-section";
import { UserSection } from "./sections/user-section";
import { FeaturesSection } from "./sections/feature-section";
import { CtaSection } from "./sections/cta-section";
import { CarouselSection } from "./sections/carousel-section";

import { useAssessmentState } from "../../hooks/useAssessmentState";
import { AssessmentCompletedModal } from "../ui/modals/assessment-completed-modal";

type Props = {
  onStartNew?: () => void;
};

export default function WelcomeScreenComponent({ onStartNew }: Props) {
  const { hideWelcome } = useWelcomeScreen();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { setResult } = useEvaluationStore(); // ✅ ADD THIS

  const [showProgressModal, setShowProgressModal] = useState(false);
  const [showProgressToast, setShowProgressToast] = useState(false);
  const [showCompletedModal, setShowCompletedModal] = useState(true);

  const {
    assessmentResult,
    hasProgress,
    hasCompleted,
    clearAssessmentStorage,
  } = useAssessmentState();

  // Side effects on auth change
  useEffect(() => {
    if (isAuthenticated) {
      if (hasProgress && !hasCompleted) {
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

  // ✅ FIX: Load result into store BEFORE navigating
  const viewResults = () => {
    console.log("📊 viewResults called");
    console.log("📊 assessmentResult:", assessmentResult);

    if (assessmentResult) {
      console.log("✅ Loading result into evaluation store");
      setResult(assessmentResult); // ✅ Load into store
    } else {
      console.log("❌ No assessmentResult found!");
    }

    hideWelcome();
    navigate("/results");
  };

  const handleStartAssessment = () => {
    if (hasProgress) setShowProgressModal(true);
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

      <AssessmentCompletedModal
        assessmentResult={assessmentResult}
        show={hasCompleted && showCompletedModal} // ✅
        onHide={() => setShowCompletedModal(false)} // ✅ Now this works!
        onViewResults={viewResults}
      />

      <ContinueProgressModal
        show={showProgressModal}
        onHide={() => setShowProgressModal(false)}
        onContinue={continueAssessment}
        onStartNew={startNewAssessment}
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

              <>
                <FeaturesSection />
                <CtaSection
                  hasProgress={hasProgress}
                  onStart={handleStartAssessment}
                  hasCompleted={hasCompleted}
                  onViewResults={viewResults}
                />
              </>

              <CarouselSection />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
