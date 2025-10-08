// src/components/WelcomeScreenComponent/WelcomeScreenComponent.tsx
import React, { useEffect } from "react";
import { useWelcomeScreen } from "../../../store/useWelcomeScreenStore";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import NavigationBar from "../NavigationBarComponents/NavigationBar";
import ProgressSideBar from "../ProgressSideBar/ProgressSideBar";
import ImageSlider from "../ImageSlider/ImageSlider";
import "./WelcomePage.css";

function WelcomeScreenComponent() {
  const { hideWelcome } = useWelcomeScreen();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleStartAssessment = () => {
    hideWelcome();
    // Navigate directly to assessment test
    navigate('/ccdi-career-assessment-test');
  };

  // Show loading while checking authentication
  if (!isAuthenticated) {
    return (
      <div className="welcome-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="welcome-container">
      {/* Background */}
      <div className="welcome-background"></div>

      <NavigationBar />
      <ProgressSideBar isWelcomePage={true} />

      {/* Center Content */}
      <div className="welcome-content">
        <div className="welcome-card">
          {user && (
            <div className="user-welcome-section">
              <h2 className="user-greeting">
                Hello, <span className="user-name">{user.fullName}</span> !
              </h2>
              <p className="user-course">
                Preferred Course: <strong>{user.preferredCourse}</strong>
              </p>
            </div>
          )}

          <div className="features-grid">
            <p className="feature-text">
              Start your career assessment test
            </p>
            <p className="feature-text">Discover your strengths</p>
            <p className="feature-text">
              Plan your future with CCDI
            </p>
          </div>

          {/* Single START button - no form needed */}
          <button
            onClick={handleStartAssessment}
            className="start-button"
          >
            START ASSESSMENT
          </button>

          {/* Image slider is always shown below */}
          <ImageSlider />
        </div>
      </div>
    </div>
  );
}

export default WelcomeScreenComponent;