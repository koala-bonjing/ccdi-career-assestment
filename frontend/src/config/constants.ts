import type { AssessmentAnswers } from "../types";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

const categoryTitles: Record<string, string> = {
  foundationalAssessment: "Foundational Assessment",
  academicAptitude: "Academic Aptitude",
  technicalSkills: "Technical Skills & Interests",
  careerInterest: "Career Interest",
  learningWorkStyle: "Learning & Work Style",
};
const sectionBgColors: Record<string, string> = {
  academicAptitude: "bg-blue-500",
  technicalSkills: "bg-orange-500",
  careerInterest: "bg-purple-500",
  learningWorkStyle: "bg-pink-500",
};

const sectionHoverColors: Record<string, string> = {
  academicAptitude: "hover:bg-blue-400/50",
  technicalSkills: "hover:bg-orange-400/50",
  careerInterest: "hover:bg-purple-400/50",
  learningWorkStyle: "hover:bg-pink-400/50",
};

export const sectionDotColors: Record<
  string,
  { base: string; active: string }
> = {
  academicAptitude: { base: "#1E3A8A", active: "#3B82F6" },
  technicalSkills: { base: "#92400E", active: "#F97316" },
  careerInterest: { base: "#581C87", active: "#A855F7" },
  learningWorkStyle: { base: "#831843", active: "#EC4899" },
};

const sections: (keyof AssessmentAnswers)[] = [
  "foundationalAssessment",
  "academicAptitude",
  "technicalSkills",
  "careerInterest",
  "learningWorkStyle",
];

const getSectionColorClass = (section: string) => {
  const colorMap: { [key: string]: string } = {
    academicAptitude: "academic-bg academic-hover",
    technicalSkills: "technical-bg technical-hover",
    careerInterest: "career-bg career-hover",
    learningWorkStyle: "learning-bg learning-hover",
  };
  return colorMap[section] || "bg-blue-500 hover:bg-blue-600";
};

const getSectionColorClasses = (section: string): string => {
  switch (section) {
    case "academicAptitude":
      return "bg-blue-600 hover:bg-blue-700";
    case "technicalSkills":
      return "bg-orange-500 hover:bg-orange-600";
    case "careerInterest":
      return "bg-purple-600 hover:bg-purple-700";
    case "learningWorkStyle":
      return "bg-pink-500 hover:bg-pink-600";
    default:
      return "bg-gray-500";
  }
};


export {
  BASE_URL,
  categoryTitles,
  sectionBgColors,
  sectionHoverColors,
  sections,
  getSectionColorClass,
  getSectionColorClasses,
};

export const sectionIcons: Record<string, string> = {
  foundationalAssessment: "GraduationCap",
  academicAptitude: "BookOpen",
  technicalSkills: "Code",
  careerInterest: "Workflow",
  learningWorkStyle: "Brain",
};

export const sectionColors: Record<string, string> = {
  foundationalAssessment: "#2B3176",
  academicAptitude: "#1C6CB3",
  technicalSkills: "#EC2326",
  careerInterest: "#17a2b8",
  learningWorkStyle: "#ffc107",
};

export const sectionDescriptions: Record<string, string> = {
  foundationalAssessment:
    "We'll assess your current readiness through basic skills, study habits, and problem-solving abilities.",
  academicAptitude:
    "Rate your confidence in mathematical and analytical thinking.",
  technicalSkills:
    "Tell us about your technical interests and hands-on experience.",
  careerInterest:
    "Share your career goals and what type of work interests you most.",
  learningWorkStyle:
    "Let us know your learning preferences, work style, and available resources.",
};
