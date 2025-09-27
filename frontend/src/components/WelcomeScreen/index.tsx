import React, { useState } from "react";
import { useEvaluationStore } from "../../../store/useEvaluationStore";
import { useWelcomeScreen } from "../../../store/useWelcomeScreenStore";
import NavigationBar from "../NavigationBarComponents/NavigationBar";
import ProgressSideBar from "../ProgressSideBar/ProgressSideBar";
import ImageSlider from "../ImageSlider/ImageSlider";
import { ArrowBigRight } from "lucide-react";
import DotGrid from "../ActiveBackground";

function WelcomeScreenComponent() {
  const { setName } = useEvaluationStore();
  const { hideWelcome } = useWelcomeScreen();
  const [localName, setLocalName] = useState("");
  const [showInput, setShowInput] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localName.trim()) {
      setName(localName.trim());
      hideWelcome();
    }
  };

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0 bg-black">
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
      <ProgressSideBar currentStep={1} />

      {/* Center Content */}
      <div className="relative z-10 mr-96">
        <div className="flex flex-col items-center justify-center bg-white/10 rounded-xl p-12 shadow-lg">
          <h1 className="text-3xl font-bold text-white mb-4">
            Welcome to CCDI Career Assessment Test
          </h1>

          <div className="grid grid-cols-3 gap-6 w-full mb-6">
            <p className="text-white/80 text-center">
              Start your career assessment test
            </p>
            <p className="text-white/80 text-center">Discover your strengths</p>
            <p className="text-white/80 text-center">
              Plan your future with CCDI
            </p>
          </div>

          {/* Show START button first, then form */}
          {!showInput ? (
            <button
              onClick={() => setShowInput(true)}
              className="w-full bg-btn-solid-bg text-btn-solid-text px-6 py-3 rounded-md 
              hover:bg-transparent hover:border hover:border-primary hover:text-primary 
              transition-all duration-300 mb-6 text-lg font-medium font-poppins"
            >
              START ASSESTMENT
            </button>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex flex-row items-center space-x-4 mb-6 w-full"
            >
              <input
                type="text"
                value={localName}
                onChange={(e) => setLocalName(e.target.value)}
                placeholder="Enter your full name"
                className="flex-1 p-3 font-poppins text-xl rounded-md text-center
  border border-white focus:outline-none focus:ring-2 focus:ring-primary
  bg-transparent text-white placeholder-white capitalize
  transition-all duration-300 hover:bg-white/30 hover:border-white"
                required
              />

              <button
                type="submit"
                className="bg-btn-solid-bg text-btn-solid-text p-3 rounded-md 
                hover:bg-transparent hover:border hover:border-primary hover:text-primary 
                transition-all duration-300 flex items-center justify-center w-16 h-16"
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
