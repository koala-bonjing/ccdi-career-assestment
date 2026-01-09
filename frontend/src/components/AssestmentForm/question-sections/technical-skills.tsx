// src/components/AssessmentForm/TechnicalSkillsSection.tsx
import React from "react";
import { Card, Row, Col, Badge, ProgressBar, Form } from "react-bootstrap";
import { Wrench } from "lucide-react";
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
    prog?: string
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
      (val: unknown) => val === true
    ).length;

  const calculateProgress = () =>
    Math.round((getSelectedCount() / questions.length) * 100);

  return (
    <Card
      className="border-0 shadow-lg w-100"
      style={{
        maxWidth: "1300px",
        borderRadius: "16px",
        overflow: "hidden",
        marginTop: "50px",
        marginBottom: "50px",
      }}
    >
      <SectionHeader
        title="Technical Skills"
        icon={<Wrench size={28} />}
        variant="warning"
        sectionType="technicalSkills"
      />

      <Card.Body className="p-5">
        <Row className="align-items-center mb-4">
          <Col md={4}>
            <Badge bg="warning" className="fs-6 p-3 text-text-primary">
              Skills Selected: {getSelectedCount()} of {questions.length}
            </Badge>
          </Col>
        </Row>

        <ProgressBar
          now={calculateProgress()}
          className="mb-5"
          variant="warning"
          style={{ height: "12px" }}
        />

        <div className="text-center mb-4">
          <h4 className="text-dark mb-3">
            Select the skills you have experience with:
          </h4>
          <p className="text-muted fs-5">
            Choose all that apply. You've selected {getSelectedCount()} out of{" "}
            {questions.length} skills.
          </p>
        </div>

        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="d-grid gap-3 ">
              {questions.map((skill) => (
                <Form.Check
                  key={skill._id}
                  type="checkbox"
                  id={`skill-${skill._id}`}
                  label={<span className="fs-5">{skill.questionText}</span>}
                  checked={!!formData.technicalSkills[skill.questionText]}
                  onChange={(e) =>
                    onChange(
                      "technicalSkills",
                      skill.questionText,
                      e.target.checked,
                      skill.program
                    )
                  }
                  className="p-4 border rounded-3 hover-shadow text-start form-option fs-5"
                />
              ))}
            </div>
          </div>
        </div>
      </Card.Body>

      <AssessmentActionFooter
        currentSection={currentSection}
        totalSections={totalSections}
        onPrevious={onPrevious}
        onNext={onNext}
        onReset={onReset}
        isLastSection={currentSection === totalSections - 1}
        isComplete={calculateProgress() >= 0} 
        nextLabel="Next Section →"
      />
    </Card>
  );
};

export default TechnicalSkillsSection;
