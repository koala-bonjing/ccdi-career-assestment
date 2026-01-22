// src/components/WelcomeScreen/sections/carousel-section.tsx
import React, { useEffect, useState } from "react";
import { Carousel } from "react-bootstrap";
import { BrainCircuit, Target, TrendingUp } from "lucide-react";

export const CarouselSection = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 992);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Using specific placeholder services that allow text and colors to simulate the final images
  const slides = [
    {
      id: 1,
      // Navy Blue background with White text
      image: "https://placehold.co/1200x600/2B3176/FFFFFF/png?text=Holistic+Assessment&font=roboto", 
      icon: <BrainCircuit size={isMobile ? 30 : 40} className="text-white" />,
      title: "Holistic Evaluation",
      description: "We analyze your logical reasoning, study habits, and personal interests to build a complete profile."
    },
    {
      id: 2,
      // White background with Navy text (simulating the clean data look)
      image: "https://placehold.co/1200x600/F8F9FA/2B3176/png?text=AI+Compatibility+Analysis&font=roboto",
      icon: <Target size={isMobile ? 30 : 40} style={{ color: "#A41D31" }} />, // Red accent
      title: "Smart Compatibility",
      description: "Our algorithm matches your profile against specific program requirements to find your best fit."
    },
    {
      id: 3,
      // Red gradient-like background
      image: "https://placehold.co/1200x600/A41D31/FFFFFF/png?text=Your+Success+Roadmap&font=roboto",
      icon: <TrendingUp size={isMobile ? 30 : 40} className="text-white" />,
      title: "Path to Success",
      description: "Get a clear recommendation and a detailed roadmap to succeed in your chosen field of study."
    }
  ];

  return (
    <div className={`mt-4 ${isMobile ? "mb-2" : "mb-5"}`}>
      <Carousel 
        indicators={true} 
        interval={4000} 
        className="rounded-4 overflow-hidden shadow-sm"
      >
        {slides.map((slide) => (
          <Carousel.Item key={slide.id}>
            <div className="position-relative">
              {/* Image Container */}
              <img
                className="d-block w-100"
                src={slide.image}
                alt={slide.title}
                style={{ 
                  height: isMobile ? "250px" : "400px", 
                  objectFit: "cover",
                  filter: "brightness(0.9)" 
                }}
              />
              
              {/* Caption Overlay */}
              <div 
                className="position-absolute w-100 h-100 top-0 start-0 d-flex flex-column justify-content-center align-items-center text-center p-4"
                style={{
                  background: "rgba(0, 0, 0, 0.4)", // Dark overlay for readability
                  backdropFilter: "blur(2px)"
                }}
              >
                <div 
                  className="mb-3 p-3 rounded-circle shadow-lg"
                  style={{ 
                    background: "rgba(255, 255, 255, 0.15)",
                    backdropFilter: "blur(5px)",
                    border: "1px solid rgba(255, 255, 255, 0.3)"
                  }}
                >
                  {slide.icon}
                </div>
                <h3 className={`fw-bold text-white mb-2 ${isMobile ? "fs-4" : "fs-2"}`}>
                  {slide.title}
                </h3>
                <p 
                  className={`text-white mx-auto ${isMobile ? "fs-6 w-100" : "fs-5 w-75"}`}
                  style={{ opacity: 0.9 }}
                >
                  {slide.description}
                </p>
              </div>
            </div>
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
};