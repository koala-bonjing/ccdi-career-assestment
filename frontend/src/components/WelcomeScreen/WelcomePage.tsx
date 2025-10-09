// src/components/WelcomeScreenComponent/WelcomeScreenComponent.tsx
import React, { useEffect } from "react";
import { useWelcomeScreen } from "../../../store/useWelcomeScreenStore";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import NavigationBar from "../NavigationBarComponents/NavigationBar";
import ProgressSideBar from "../ProgressSideBar/ProgressSideBar";
import ImageSlider from "../ImageSlider/ImageSlider";
import { Card, Button, Container, Row, Col, Badge } from "react-bootstrap";
import { Play, User, Target, BarChart3 } from "lucide-react";
import "./WelcomePage.css";

function WelcomeScreenComponent() {
  const { hideWelcome } = useWelcomeScreen();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const handleStartAssessment = () => {
    hideWelcome();
    // Navigate directly to assessment test
    navigate("/ccdi-career-assessment-test");
  };

  // Show loading while checking authentication
  if (!isAuthenticated) {
    return (
      <div className="assessment-container">
        <NavigationBar />
        <Container
          fluid
          className="main-content d-flex align-items-center justify-content-center"
          style={{ minHeight: "80vh" }}
        >
          <div className="text-center">
            <div className="spinner-border text-primary mb-3" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <div className="text-xl text-gray-600">Loading...</div>
          </div>
        </Container>
      </div>
    );
  }

  // In your WelcomeScreenComponent.tsx
  return (
    <div className="welcome-assessment-container">
      <NavigationBar />

      <Container fluid className="welcome-main-content">
        <section className="welcome-section">
          <div className="d-flex justify-content-center">
            <div className="w-100">
              <Card className="border-0 shadow-lg welcome-card">
                <Card.Header className="welcome-section-header">
                  <Card.Title className="mb-0 d-flex align-items-center justify-content-center">
                    <User size={28} className="me-3" />
                    Welcome to Career Assessment Test
                  </Card.Title>
                </Card.Header>

                <Card.Body className="p-5">
                  {/* User Welcome Section */}
                  {user && (
                    <div className="welcome-user-section">
                      <h2 className="display-5 fw-bold text-gray-800 mb-3">
                        Hello,{" "}
                        <span className="welcome-text-primary">
                          {user.fullName}
                        </span>
                        !
                      </h2>
                      <Badge className="welcome-badge fs-5 p-3">
                        <Target size={18} className="me-2" />
                        Preferred Course:{" "}
                        <strong>{user.preferredCourse}</strong>
                      </Badge>
                    </div>
                  )}

                  {/* Features Grid */}
                  <div className="welcome-features-grid">
                    <Row className="g-4 text-center">
                      <Col md={4}>
                        <div className="welcome-feature-card">
                          <BarChart3 size={52} className="text-primary mb-3" />
                          <h5 className="fw-bold text-gray-800 mb-3">
                            Career Assessment
                          </h5>
                          <p className="text-muted mb-0">
                            Discover your strengths and career preferences
                          </p>
                        </div>
                      </Col>
                      <Col md={4}>
                        <div className="welcome-feature-card">
                          <Target size={52} className="text-success mb-3" />
                          <h5 className="fw-bold text-gray-800 mb-3">
                            Personalized Results
                          </h5>
                          <p className="text-muted mb-0">
                            Get tailored program recommendations
                          </p>
                        </div>
                      </Col>
                      <Col md={4}>
                        <div className="welcome-feature-card">
                          <User size={52} className="text-warning mb-3" />
                          <h5 className="fw-bold text-gray-800 mb-3">
                            Future Planning
                          </h5>
                          <p className="text-muted mb-0">
                            Plan your academic and career path
                          </p>
                        </div>
                      </Col>
                    </Row>
                  </div>

                  {/* Start Button */}
                  <div className="text-center mb-4">
                    <Button
                      variant="success"
                      size="lg"
                      onClick={handleStartAssessment}
                      className="px-5 py-3 fw-bold fs-5 welcome-btn welcome-btn-success"
                    >
                      <Play size={24} className="me-2" />
                      START ASSESSMENT
                    </Button>
                    <p className="text-muted mt-3 fs-6">
                      Ready to discover your ideal career path? Click start to
                      begin your assessment journey.
                    </p>
                  </div>

                  {/* Centered Image Slider */}
                  <div className="welcome-image-slider-container">
                    <div className="image-slider">
                      <ImageSlider />
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </div>
          </div>
        </section>
      </Container>
    </div>
  );
}

export default WelcomeScreenComponent;
