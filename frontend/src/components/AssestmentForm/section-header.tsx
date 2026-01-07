import React from "react";
import { Card,} from "react-bootstrap";

interface SectionHeaderProps {
  title: string;
  icon: React.ReactNode;
  variant: string;
  currentQuestionIndex?: number;
  totalQuestions?: number;
  sectionType: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  icon,
  variant,
}) => (
  <Card.Header
    className={`bg-${variant} text-white text-center py-3 py-md-4 py-lg-5`}
  >
    <Card.Title className="mb-0 d-flex align-items-center justify-content-center fs-2 pt-3">
      {icon}
      <span className="ms-3">{title}</span>
    </Card.Title>
  </Card.Header>
);

export default SectionHeader;
