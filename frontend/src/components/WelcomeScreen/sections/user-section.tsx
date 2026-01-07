// src/components/WelcomeScreen/components/Sections/UserSection.tsx
import { User, Target, Award } from "lucide-react";
import { Badge } from "react-bootstrap";
import type { User as AuthUser } from "../../../context/AuthContext"; // adjust path as needed
import type { AssessmentResult } from "../types";

interface UserSectionProps {
  user: AuthUser | null;
  hasCompleted: boolean;
  assessmentResult: AssessmentResult | null;
}

export const UserSection = ({
  user,
  hasCompleted,
  assessmentResult,
}: UserSectionProps) => {
  if (!user) return null;

  return (
    <div className="modern-user-section text-center mb-5">
      <div className="user-avatar mb-3">
        <div className="avatar-circle">
          <User size={32} />
        </div>
      </div>
      <h2 className="h3 fw-bold text-dark mb-2">
        Welcome back, {user.fullName}!
      </h2>

      <Badge className="modern-user-badge m-10 h-20 w-auto d-inline-flex align-items-center">
        <Target size={16} className="me-2" />
        <span className="course-label mr-3 text-xl">Interested in:</span>
        <strong className="course-name">{user.preferredCourse}</strong>
      </Badge>

      {hasCompleted && assessmentResult?.completionDate && (
        <div className="completion-badge mt-3">
          <Badge bg="success" className="modern-completion-badge">
            <Award size={14} className="me-1" />
            Assessment Completed • {assessmentResult.completionDate}
          </Badge>
        </div>
      )}
    </div>
  );
};
