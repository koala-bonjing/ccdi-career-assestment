import React, { useState } from "react";
import { useEvaluationStore } from "../../../store/useEvaluationStore";
import { useWelcomeScreen } from "../../../store/useWelcomeScreenStore";
import NavigationBar from "../NavigationBarComponents/NavigationBar";
import ProgressSideBar from "../ProgressSideBar/ProgressSideBar";
import ImageSlider from "../ImageSlider/ImageSlider";
import { ArrowBigRight } from "lucide-react";
import DotGrid from "../ActiveBackground";
import "./WelcomePage.css";

function WelcomeScreenComponent() {
  const { setName } = useEvaluationStore();
  const { hideWelcome } = useWelcomeScreen();
  const [localName, setLocalName] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localName.trim()) {
      setName(localName.trim());
      hideWelcome();
    }
  };

  return (
    <div className="welcome-container">
      {/* Background */}
      <div className="welcome-background">
        <DotGrid
          dotSize={5}
          gap={15}
          baseColor="#393E46"
          activeColor="#5227FF"
          proximity={120}
          shockRadius={250}
          shockStrength={5}
          resistance={750}
          returnDuration={1.5}
        />
      </div>

      <NavigationBar />
      <ProgressSideBar isWelcomePage={true} />

      {/* Center Content */}
      <div className="welcome-content">
        <div className="welcome-card">
          <h1 className="welcome-title">
            Welcome to CCDI Career Assessment Test
          </h1>

          <div className="features-grid">
            <p className="feature-text">
              Start your career assessment test
            </p>
            <p className="feature-text">Discover your strengths</p>
            <p className="feature-text">
              Plan your future with CCDI
            </p>
          </div>

          {/* Show START button first, then form */}
          {!showInput ? (
            <button
              onClick={() => setShowInput(true)}
              className="start-button"
            >
              START ASSESSMENT
            </button>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="name-form"
            >
              <input
                type="text"
                value={localName}
                onChange={(e) => setLocalName(e.target.value)}
                placeholder="Enter your full name"
                className="name-input"
                required
              />

              <button
                type="submit"
                className="submit-button"
                title="Continue"
              >
                <ArrowBigRight size={28} strokeWidth={2.5} />
              </button>
            </form>
          )}

          {/* Image slider is always shown below */}
          <ImageSlider />
        </div>
      </div>
    </div>
  );
}

export default WelcomeScreenComponent;