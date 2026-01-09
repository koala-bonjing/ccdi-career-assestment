// src/components/WelcomeScreen/components/Sections/UserSection.tsx
import { User, Target, Award } from "lucide-react";
import { Badge } from "react-bootstrap";
import type { User as AuthUser } from "../../../context/AuthContext"; // adjust path as needed
import type { AssessmentDisplayResult } from "../../../types";

interface UserSectionProps {
  user: AuthUser | null;
  hasCompleted: boolean;
  assessmentResult: AssessmentDisplayResult | null;
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
        <div className="recommendation-badge mt-3">
          <Badge className="modern-user-badge h-20 w-auto d-inline-flex align-items-center">
            <Award size={20} className="me-2" />
            <span className="course-label mr-3 text-xl">
              Recommended Program:
            </span>
            <strong
              className="course-name text-4xl"
              style={{ color: "#ffffffff" }}
            >
              {assessmentResult.recommendedProgram}
            </strong>
          </Badge>
        </div>
      )}
    </div>
  );
};
