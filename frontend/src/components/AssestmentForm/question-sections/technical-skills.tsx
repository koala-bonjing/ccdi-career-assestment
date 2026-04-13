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
      className="border-0 shadow-lg w-100 mt-3 mt-md-5 mb-3 mb-md-5 mx-auto"
      style={{ maxWidth: "1300px", borderRadius: "16px" }}
    >
      <SectionHeader
        title="Technical Interests"
        icon={<Wrench size={window.innerWidth < 768 ? 28 : 40} />}
        variant="warning"
        sectionType="technicalSkills"
      />

      <Card.Body className="p-3 p-md-5">
        {/* Header */}
        <div className="mb-4">
          <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-end mb-2 gap-2">
            <div>
              <h5 className="fw-bold mb-1" style={{ fontSize: "1.1rem" }}>
                What Do You Want to Learn?
              </h5>
              <small className="text-muted">
                Select every area you're genuinely interested in — no prior
                experience needed
              </small>
            </div>
            <div className="text-sm-end w-100 w-sm-auto">
              <span className="fw-bold d-block" style={{ color: "#f59e0b" }}>
                {selectedCount} / {questions.length} Selected
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic feedback text */}
        <div className="text-center mb-4 px-1 px-md-3">
          <p className="text-muted mb-0 small" style={{ lineHeight: "1.4" }}>
            {selectedCount === 0
              ? "Tap any area that excites you — even things you've never tried before."
              : selectedCount === questions.length
                ? "🎉 You've selected all areas — that's a wide range of interests!"
                : `${selectedCount} area${selectedCount !== 1 ? "s" : ""} selected. Keep going if more apply to you.`}
          </p>
        </div>

        {/* Questions grid */}
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
                      fontSize: "0.9rem",
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

        {/* Tip box */}
        <div className="mt-4 p-3 rounded-3" style={{ background: "#fef3c7" }}>
          <p
            className="text-muted small mb-0 text-center"
            style={{ fontSize: "0.8rem" }}
          >
            💡 <strong>Tip:</strong> Select based on genuine interest, not just
            what you already know. If a topic sounds exciting, that's enough to
            select it.
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
