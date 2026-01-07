// src/components/WelcomeScreen/components/Sections/ResultsSection.tsx
import { Row, Col, ProgressBar, } from 'react-bootstrap';
import { TrendingUp, Target, Star, CheckCircle, BookOpen, BarChart3, Sparkles } from 'lucide-react';
import { Button } from 'react-bootstrap';
import type { AssessmentResult } from '../types';
import { ResultCard } from '../cards/result-card';

interface ResultsSectionProps {
  assessmentResult: AssessmentResult;
  onViewResults: () => void;
  onRetake: () => void;
}

export const ResultsSection = ({
  assessmentResult,
  onViewResults,
  onRetake,
}: ResultsSectionProps) => (
  <>
    <Row className="g-4">
      {assessmentResult.score !== undefined && (
        <Col md={6}>
          <ResultCard
            icon={<TrendingUp size={24} />}
            iconBg="bg-primary"
            title="Your Score"
            content={
              <>
                <div className="score-display mb-3">
                  <span className="display-4 fw-bold text-primary">{assessmentResult.score}</span>
                  <span className="text-muted fs-5">/{assessmentResult.totalQuestions}</span>
                </div>
                <ProgressBar
                  now={(assessmentResult.score / (assessmentResult.totalQuestions || 1)) * 100}
                  variant="primary"
                />
                <p className="text-muted small">Based on your responses and career preferences</p>
              </>
            }
          />
        </Col>
      )}

      {assessmentResult.recommendedPaths && assessmentResult.recommendedPaths.length > 0 && (
        <Col md={6}>
          <ResultCard
            icon={<Target size={24} />}
            iconBg="bg-success"
            title="Recommended Paths"
            content={
              <div className="recommended-paths">
                {assessmentResult.recommendedPaths.slice(0, 3).map((path, i) => (
                  <div key={i} className="path-item d-flex align-items-center mb-2">
                    <Star size={16} className="text-warning me-2" />
                    <span className="text-dark">{path}</span>
                  </div>
                ))}
                {assessmentResult.recommendedPaths.length > 3 && (
                  <p className="text-muted small mt-2 mb-0">
                    +{assessmentResult.recommendedPaths.length - 3} more recommendations
                  </p>
                )}
              </div>
            }
          />
        </Col>
      )}

      {assessmentResult.strengths && assessmentResult.strengths.length > 0 && (
        <Col md={12}>
          <ResultCard
            icon={<BookOpen size={24} />}
            iconBg="bg-warning"
            title="Your Strengths"
            content={
              <Row>
                {assessmentResult.strengths.slice(0, 4).map((s, i) => (
                  <Col md={6} key={i} className="mb-2">
                    <div className="strength-item d-flex align-items-center">
                      <CheckCircle size={16} className="text-success me-2" />
                      <span className="text-dark">{s}</span>
                    </div>
                  </Col>
                ))}
              </Row>
            }
          />
        </Col>
      )}
    </Row>

    <div className="results-actions text-center mt-5">
      <Row className="g-3 justify-content-center">
        <Col xs={12} md={4}>
          <Button variant="primary" onClick={onViewResults} className="w-100 modern-cta-btn" size="lg">
            <BarChart3 size={20} className="me-2" /> View Detailed Results
          </Button>
        </Col>
        <Col xs={12} md={4}>
          <Button variant="outline-primary" onClick={onRetake} className="w-100 modern-btn-outline" size="lg">
            <Sparkles size={20} className="me-2" /> Retake Assessment
          </Button>
        </Col>
      </Row>
    </div>
  </>
);