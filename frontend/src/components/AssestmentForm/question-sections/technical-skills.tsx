// src/components/AssessmentForm/TechnicalSkillsSection.tsx
import React from "react";
import { Card, Row, Col } from "react-bootstrap";
import { Wrench, CheckCircle2, Circle } from "lucide-react";
import SectionHeader from "../section-header";
import AssessmentActionFooter from "../assessment-action-footer";
import type { AssessmentAnswers } from "../../../types";

interface TechnicalSkillsSectionProps {
  questions: { _id: string; questionText: string; program?: string }[];
  formData: AssessmentAnswers;
  onChange: (
    section: keyof AssessmentAnswers,
    q: string,
    val: number | boolean,
    prog?: string,
  ) => void;
  onNext: () => void;
  onPrevious: () => void;
  onReset: () => void;
  currentSection: number;
  totalSections: number;
}

const TechnicalSkillsSection: React.FC<TechnicalSkillsSectionProps> = ({
  questions,
  formData,
  onChange,
  onNext,
  onPrevious,
  onReset,
  currentSection,
  totalSections,
}) => {
  const getSelectedCount = () =>
    Object.values(formData.technicalSkills).filter(
      (val: unknown) => val === true,
    ).length;

  const selectedCount = getSelectedCount();

  return (
    <Card
      // Responsive vertical margins: mt-3 on mobile, mt-5 on desktop
      className="border-0 shadow-lg w-100 mt-3 mt-md-5 mb-3 mb-md-5 mx-auto"
      style={{ maxWidth: "1300px", borderRadius: "16px" }}
    >
      <SectionHeader
        title="Technical Skills & Interests"
        // Slightly smaller icon for mobile
        icon={<Wrench size={window.innerWidth < 768 ? 28 : 40} />}
        variant="warning"
        sectionType="technicalSkills"
      />

      <Card.Body className="p-3 p-md-5">
        {/* Progress Header - Stacks on extra small screens */}
        <div className="mb-4">
          <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-end mb-2 gap-2">
            <div>
              <h5 className="fw-bold mb-1" style={{ fontSize: "1.1rem" }}>
                Skills & Experience
              </h5>
              <small className="text-muted">
                Select all skills you have experience with
              </small>
            </div>
            <div className="text-sm-end w-100 w-sm-auto">
              <span className="fw-bold d-block" style={{ color: "#f59e0b" }}>
                {selectedCount} / {questions.length} Selected
              </span>
            </div>
          </div>
        </div>

        {/* Info Text - Smaller font and padding for mobile */}
        <div className="text-center mb-4 px-1 px-md-3">
          <p className="text-muted mb-0 small" style={{ lineHeight: "1.4" }}>
            {selectedCount === 0
              ? "Click on any skills you're familiar with. Don't worry if you're still learning!"
              : selectedCount === questions.length
                ? "🎉 Awesome! You've selected all skills."
                : `Great! ${selectedCount} skill${selectedCount !== 1 ? "s" : ""} selected.`}
          </p>
        </div>

        {/* Skills Grid - Reduced gutter for mobile (g-2) */}
        <Row className="g-2 g-md-3">
          {questions.map((skill) => {
            const isSelected = !!formData.technicalSkills[skill.questionText];

            return (
              <Col key={skill._id} xs={12} sm={6} lg={4}>
                <div
                  onClick={() =>
                    onChange(
                      "technicalSkills",
                      skill.questionText,
                      !isSelected,
                      skill.program,
                    )
                  }
                  // Balanced padding for mobile thumbs
                  className="p-3 rounded-3 h-100 d-flex align-items-center gap-3"
                  style={{
                    cursor: "pointer",
                    border: `2px solid ${isSelected ? "#f59e0b" : "#e5e7eb"}`,
                    background: isSelected ? "#fef3c7" : "white",
                    transition: "all 0.2s ease",
                    boxShadow: isSelected
                      ? "0 4px 12px rgba(245, 158, 11, 0.15)"
                      : "none",
                  }}
                  role="button"
                >
                  {/* flex-shrink-0 ensures the icon never squishes */}
                  <div className="flex-shrink-0 d-flex align-items-center">
                    {isSelected ? (
                      <CheckCircle2
                        size={24}
                        style={{ color: "#f59e0b", flexShrink: 0 }}
                      />
                    ) : (
                      <Circle
                        size={24}
                        className="text-muted"
                        style={{ flexShrink: 0 }}
                      />
                    )}
                  </div>
                  <span
                    className="flex-grow-1"
                    style={{
                      fontWeight: isSelected ? "600" : "400",
                      color: isSelected ? "#292524" : "#57534e",
                      fontSize: "0.9rem", // Slightly smaller for better text fitting
                      lineHeight: "1.2",
                    }}
                  >
                    {skill.questionText}
                  </span>
                </div>
              </Col>
            );
          })}
        </Row>

        {/* Helper Text - Simplified padding for mobile */}
        <div className="mt-4 p-3 rounded-3" style={{ background: "#fef3c7" }}>
          <p
            className="text-muted small mb-0 text-center"
            style={{ fontSize: "0.8rem" }}
          >
            💡 <strong>Tip:</strong> Include skills you're currently learning.
          </p>
        </div>
      </Card.Body>

      <AssessmentActionFooter
        currentSection={currentSection}
        totalSections={totalSections}
        onPrevious={onPrevious}
        onNext={onNext}
        onReset={onReset}
        isLastSection={currentSection === totalSections - 1}
        isComplete={selectedCount >= 1}
        nextLabel="Career Interest →"
      />
    </Card>
  );
};

export default TechnicalSkillsSection;
