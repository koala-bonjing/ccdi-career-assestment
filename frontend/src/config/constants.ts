import type { AssessmentAnswers } from "../types";

const BASE_URL = "https://backend-tau-nine-54.vercel.app";

const categoryTitles: Record<string, string> = {
  academicAptitude: "Academic Aptitude",
  technicalSkills: "Technical Skills",
  careerInterest: "Career Interests",
  learningWorkStyle: "Learning Style",
};

// Map each section to its button background color
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

const sectionFormBgColors: Record<keyof AssessmentAnswers, string> = {
  academicAptitude: "bg-blue-400/20",
  technicalSkills: "bg-orange-400/20",
  careerInterest: "bg-purple-400/20",
  learningWorkStyle: "bg-pink-400/20",
};

export const sectionDotColors: Record<
  string,
  { base: string; active: string }
> = {
  academicAptitude: { base: "#1E3A8A", active: "#3B82F6" }, // Blue shades
  technicalSkills: { base: "#92400E", active: "#F97316" }, // Orange shades
  careerInterest: { base: "#581C87", active: "#A855F7" }, // Purple shades
  learningWorkStyle: { base: "#831843", active: "#EC4899" }, // Pink shades
};

const sections: (keyof AssessmentAnswers)[] = [
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
  sectionFormBgColors,
  sections,
  getSectionColorClass,
  getSectionColorClasses,
};
