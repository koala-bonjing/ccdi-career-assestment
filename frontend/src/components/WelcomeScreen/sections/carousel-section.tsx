// src/components/WelcomeScreen/components/Sections/CarouselSection.tsx
import { useState } from "react";
import { Carousel } from "react-bootstrap";
import { CheckCircle, Target, Sparkles } from "lucide-react";
import discover from "../../../assets/discover.png"; // ✅ adjust path as needed

export const CarouselSection = () => {
  const [index, setIndex] = useState(0);

  return (
    <div className="modern-carousel-container mt-5">
      <Carousel
        activeIndex={index}
        onSelect={setIndex}
        interval={4000}
        fade
        indicators={false}
      >
        <Carousel.Item>
          <div className="modern-carousel-item">
            <img
              src={discover}
              alt="Career assessment illustration"
              className="modern-carousel-image"
            />
            <div className="modern-carousel-caption">
              <CheckCircle size={24} className="mb-2 text-success" />
              <h5>Discover Your Strengths</h5>
              <p>
                Identify your unique talents through comprehensive assessment
              </p>
            </div>
          </div>
        </Carousel.Item>

        <Carousel.Item>
          <div className="modern-carousel-item">
            <img
              src="/api/placeholder/800/400"
              alt="Career paths illustration"
              className="modern-carousel-image"
            />
            <div className="modern-carousel-caption">
              <Target size={24} className="mb-2 text-primary" />
              <h5>Explore Career Paths</h5>
              <p>
                Find the perfect match based on your interests and personality
              </p>
            </div>
          </div>
        </Carousel.Item>

        <Carousel.Item>
          <div className="modern-carousel-item">
            <img
              src="/api/placeholder/800/400"
              alt="Success stories illustration"
              className="modern-carousel-image"
            />
            <div className="modern-carousel-caption">
              <Sparkles size={24} className="mb-2 text-warning" />
              <h5>Plan Your Future</h5>
              <p>Get personalized recommendations for your academic journey</p>
            </div>
          </div>
        </Carousel.Item>
      </Carousel>

      <div className="modern-carousel-indicators">
        {[0, 1, 2].map((i) => (
          <button
            key={i}
            className={`indicator ${index === i ? "active" : ""}`}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </div>
  );
};
