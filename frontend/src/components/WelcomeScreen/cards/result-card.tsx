// src/components/WelcomeScreen/components/Cards/ResultCard.tsx
import { Card } from 'react-bootstrap';

interface ResultCardProps {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  content: React.ReactNode;
}

export const ResultCard = ({ icon, iconBg, title, content }: ResultCardProps) => (
  <Card className="result-card h-100">
    <Card.Body className="text-center p-4">
      <div className={`result-icon-wrapper ${iconBg} mb-3`}>
        {icon}
      </div>
      <h4 className="fw-bold text-dark mb-3">{title}</h4>
      {content}
    </Card.Body>
  </Card>
);