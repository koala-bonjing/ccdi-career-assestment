// src/components/WelcomeScreen/WelcomeScreenComponent.tsx
import { useEffect, useState } from "react";
import { useWelcomeScreen } from "../../../store/useWelcomeScreenStore";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import NavigationBar from "../NavigationBarComponents/NavigationBar";
import { useEvaluationStore } from "../../../store/useEvaluationStore";

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
import type { AssessmentAnswers } from "../../types";

type Props = {
  onStartNew?: () => void;
  restoredFormData?: AssessmentAnswers;
};

export default function WelcomeScreenComponent({
  restoredFormData,
  onStartNew,
}: Props) {
  const { hideWelcome } = useWelcomeScreen();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { setResult } = useEvaluationStore();

  const [showProgressToast, setShowProgressToast] = useState(false);
  const [showCompletedModal, setShowCompletedModal] = useState(true);
  const [showContinueModal, setShowContinueModal] = useState(false);

  // Responsive state logic
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 992);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const {
    assessmentResult,
    hasProgress,
    hasCompleted,
    loading,
    clearAssessmentStorage,
  } = useAssessmentState();

  console.log("📋 Assessment Data Check:", {
    fromHook: {
      assessmentResult: assessmentResult?.recommendedProgram,
      hasCompleted,
      hasProgress,
      loading,
    },
    fromStore: useEvaluationStore.getState().result?.recommendedProgram,
    areTheyEqual: assessmentResult === useEvaluationStore.getState().result,
  });

  // ✅ FIX: Show progress toast when there's progress but no completed assessment
  useEffect(() => {
    if (isAuthenticated && !loading) {
      if (hasProgress && !hasCompleted) {
        setShowProgressToast(true);
      }
    }
  }, [isAuthenticated, hasCompleted, hasProgress, loading]);

  // ✅ FIX: Show continue modal based on hasProgress from the hook
  useEffect(() => {
    // Only show if:
    // 1. Not loading anymore
    // 2. No restoredFormData (not coming from a forced restore)
    // 3. Has progress but hasn't completed
    if (!loading && !restoredFormData && hasProgress && !hasCompleted) {
      const timer = setTimeout(() => {
        setShowContinueModal(true);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [loading, restoredFormData, hasProgress, hasCompleted]);

  if (!isAuthenticated) {
    return (
      <div className="assessment-container">
        <NavigationBar />
        <div
          className={`main-content d-flex align-items-center justify-content-center ${isMobile ? "px-3" : ""}`}
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

  const handleContinueAssessment = () => {
    hideWelcome();
    navigate("/assessment");
    setShowContinueModal(false);
  };

  // ✅ Load result into store BEFORE navigating
  const viewResults = () => {
    console.log("📊 viewResults called");
    console.log("📊 assessmentResult:", assessmentResult);

    if (assessmentResult) {
      console.log("✅ Loading result into evaluation store");
      setResult(assessmentResult);
    } else {
      console.log("❌ No assessmentResult found!");
    }

    hideWelcome();
    navigate("/results");
  };

  const handleStartAssessment = () => {
    startNewAssessment();
  };

  return (
    <div className="welcome-assessment-container">
      <NavigationBar />

      <ToastContainer 
        position="top-center" 
        className={isMobile ? "p-2 w-100" : "p-3"} 
        style={isMobile ? { maxWidth: "100%" } : {}}
      >
        <ProgressToast
          show={showProgressToast}
          onClose={() => setShowProgressToast(false)}
        />
      </ToastContainer>

      <AssessmentCompletedModal
        assessmentResult={assessmentResult}
        show={hasCompleted && showCompletedModal}
        onHide={() => setShowCompletedModal(false)}
        onViewResults={viewResults}
      />

      <ContinueProgressModal
        show={showContinueModal}
        onHide={() => setShowContinueModal(false)}
        onContinue={handleContinueAssessment}
        onStartNew={startNewAssessment}
      />

      <div className={`welcome-main-content ${isMobile ? "px-2 pb-4" : "pb-5"}`}>
        <div className="d-flex justify-content-center">
          {/* Responsive Wrapper: Full width on mobile, Container on desktop */}
          <div className={isMobile ? "w-100" : "container-lg"}>
            
            <HeaderSection hasCompleted={hasCompleted} />
            
            <div 
              className={`modern-welcome-card ${isMobile ? "p-3 mt-3" : "p-5 mt-4"}`}
            >
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