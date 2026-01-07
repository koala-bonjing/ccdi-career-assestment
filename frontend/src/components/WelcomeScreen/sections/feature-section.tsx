// src/components/WelcomeScreen/components/Sections/FeaturesSection.tsx
import { BarChart3, Target, Timer } from 'lucide-react';
import { Row, Col } from 'react-bootstrap';

export const FeaturesSection = () => (
  <div className="modern-features-grid mb-5">
    <Row className="g-4">
      <Col md={4}>
        <div className="modern-feature-card">
          <div className="feature-icon-wrapper bg-primary"><BarChart3 size={24} /></div>
          <h5 className="fw-bold text-dark mb-2">Career Assessment</h5>
          <p className="text-muted mb-0 small">
            Comprehensive evaluation of your strengths and preferences
          </p>
        </div>
      </Col>
      <Col md={4}>
        <div className="modern-feature-card">
          <div className="feature-icon-wrapper bg-success"><Target size={24} /></div>
          <h5 className="fw-bold text-dark mb-2">Personalized Results</h5>
          <p className="text-muted mb-0 small">
            Tailored recommendations based on your profile
          </p>
        </div>
      </Col>
      <Col md={4}>
        <div className="modern-feature-card">
          <div className="feature-icon-wrapper bg-warning"><Timer size={24} /></div>
          <h5 className="fw-bold text-dark mb-2">Quick & Easy</h5>
          <p className="text-muted mb-0 small">
            Complete in just 10–15 minutes
          </p>
        </div>
      </Col>
    </Row>
  </div>
);