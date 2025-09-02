import React, { useState } from "react";
import { useEvaluationStore } from "../../../store/useEvaluationStore";
import {
  useWelcomeScreen,
  useShowInputs,
} from "../../../store/useWelcomeScreenStore";
import Logo from "../../assets/logoCCDI.png";
import Assess from "../../assets/assess.png";
import DotGrid from "../ActiveBackground";

function WelcomeScreenComponent() {
  const { setName } = useEvaluationStore();
  const { hideWelcome } = useWelcomeScreen();
  const { showInputs, toggleInputs } = useShowInputs();
  const [localName, setLocalName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (localName.trim()) {
      setName(localName.trim());
      hideWelcome();
    }
  };

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
      {/* Fullscreen DotGrid background */}
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

      {/* Centered card */}
      <div className="relative z-10 grid grid-cols-2 bg-gradient-primary rounded-xl aspect-[763/477]">
        {/* Left Side */}
        <div className="text-text-primary font-poppins font-semibold text-xl text-center pt-4">
          Welcome to CCDI Career
          <br /> Assestment Test
          <div className="flex items-center justify-center">
            <img src={Assess} className="pt-10 h-72 w-72 object-contain pb-5" />
          </div>
          <h1 className="font-inter font-medium text-text-primary mb-2 text-2xl flex justify-center">
            WELCOME
          </h1>
          <h1 className="font-poppins text-text-primary mb-4 text-2xl flex justify-center">
            {localName.toUpperCase()}
          </h1>
        </div>

        {/* Right Side - Centered Form */}
        <div className="bg-gradient-secondary rounded-xl flex items-center justify-center">
          <form
            onSubmit={handleSubmit}
            className="p-6 rounded-lg w-full max-w-sm space-y-4 -mt-6"
          >
            <div className=" flex items-center justify-end space-x-3">
              <img src={Logo} className="h-20 w-20" />
              <span className="text-text-primary font-inter text-sm">
                COMPUTER COMMMUNICATION DEVELOPMENT INSTITUTE
              </span>
            </div>
            <div className="mt-28">
              <h6 className="text-text-primary font-poppins text-sm">
                "Take the first step toward your future at CCDI. This career
                assessment is designed to help you uncover your strengths,
                passions, and learning style—so you can confidently choose the
                course that best aligns with your unique skills, interests, and
                long-term career goals in the field of Information Technology."
              </h6>
            </div>

            {!showInputs && (
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={toggleInputs}
                  className="bg-btn-solid-bg text-btn-solid-text p-2 
                    font-inter rounded-sm font-medium px-5 border 
                    border-transparent hover:bg-transparent hover:border-primary 
                    hover:text-primary transition-all duration-300 ease-in-out hover:scale-110
                    active:scale-95 mt-8"
                >
                  START TEST
                </button>
              </div>
            )}

            {showInputs && (
              <div className="flex flex-col items-center justify-center">
                <input
                  type="text"
                  value={localName}
                  onChange={(e) => setLocalName(e.target.value)}
                  className="border border-gray-300 rounded-sm p-2 
                    hover:border-btn-outline-bg 
                    focus:outline-none focus:ring-2 focus:ring-primary font-inter
                    transition-all duration-300 ease-in-out
                    hover:shadow-[0_0_0_2px_rgba(59,130,246,0.5)] text-center"
                  placeholder="Enter your name"
                  required
                />
                <button
                  type="submit"
                  className="bg-btn-solid-bg text-btn-solid-text p-2 
                    font-inter font-medium rounded-sm px-5 border 
                    border-transparent hover:bg-transparent hover:border-primary 
                    hover:text-primary transition-all duration-300 ease-in-out hover:scale-100
                    active:scale-95 mt-4"
                >
                  LOG IN
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default WelcomeScreenComponent;
