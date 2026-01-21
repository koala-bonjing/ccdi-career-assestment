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
      className="border-0 shadow-lg w-100 mt-5 mb-5"
      style={{ maxWidth: "1200px", borderRadius: "16px" }}
    >
      <SectionHeader
        title="Technical Skills & Interests"
        icon={<Wrench size={28} />}
        variant="warning"
        sectionType="technicalSkills"
      />

      <Card.Body className="p-4 p-md-5">
        {/* Progress Header */}
        <div className="mb-4">
          <div className="d-flex justify-content-between align-items-end mb-2">
            <div>
              <h5 className="fw-bold mb-1">Skills & Experience</h5>
              <small className="text-muted">
                Select all skills you have experience with
              </small>
            </div>
            <div className="text-end">
              <span className="fw-bold" style={{ color: "#f59e0b" }}>
                {selectedCount} / {questions.length} Selected
              </span>
            </div>
          </div>
        </div>

        {/* Info Text */}
        <div className="text-center mb-4 px-3">
          <p className="text-muted mb-0">
            {selectedCount === 0
              ? "Click on any skills you're familiar with. Don't worry if you're still learning!"
              : selectedCount === questions.length
                ? "🎉 Awesome! You've selected all skills. Feel free to deselect any you're less confident about."
                : `Great! ${selectedCount} skill${selectedCount !== 1 ? "s" : ""} selected. Keep going or move on when ready.`}
          </p>
        </div>

        {/* Skills Grid */}
        <Row className="g-3">
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
                  tabIndex={0}
                  onKeyPress={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      onChange(
                        "technicalSkills",
                        skill.questionText,
                        !isSelected,
                        skill.program,
                      );
                    }
                  }}
                >
                  <div className="flex-shrink-0">
                    {isSelected ? (
                      <CheckCircle2 size={24} style={{ color: "#f59e0b" }} />
                    ) : (
                      <Circle size={24} className="text-muted" />
                    )}
                  </div>
                  <span
                    className="flex-grow-1"
                    style={{
                      fontWeight: isSelected ? "600" : "400",
                      color: isSelected ? "#292524" : "#57534e",
                      fontSize: "0.95rem",
                    }}
                  >
                    {skill.questionText}
                  </span>
                </div>
              </Col>
            );
          })}
        </Row>

        {/* Helper Text */}
        <div className="mt-4 p-3 rounded-3" style={{ background: "#fef3c7" }}>
          <p className="text-muted small mb-0 text-center">
            💡 <strong>Tip:</strong> Include skills you're currently learning or
            have basic knowledge of. This helps us recommend programs that match
            your experience level.
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
