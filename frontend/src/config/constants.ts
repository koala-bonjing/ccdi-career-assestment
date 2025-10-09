import { useState } from "react";
import type { AssessmentAnswers } from "../types";
import { Brain, BookOpen, Cpu, Target } from "lucide-react";

const BASE_URL = "http://192.168.1.41:4000";

const categoryTitles: Record<string, string> = {
  academicAptitude: "Academic Aptitude",
  technicalSkills: "Technical Skills",
  careerInterest: "Career Interests",
  learningStyle: "Learning Style",
};

// Map each section to its button background color
const sectionBgColors: Record<string, string> = {
  academicAptitude: "bg-blue-500",
  technicalSkills: "bg-orange-500",
  careerInterest: "bg-purple-500",
  learningStyle: "bg-pink-500",
};

const sectionHoverColors: Record<string, string> = {
  academicAptitude: "hover:bg-blue-400/50",
  technicalSkills: "hover:bg-orange-400/50",
  careerInterest: "hover:bg-purple-400/50",
  learningStyle: "hover:bg-pink-400/50",
};

const sectionFormBgColors: Record<keyof AssessmentAnswers, string> = {
  academicAptitude: "bg-blue-400/20",
  technicalSkills: "bg-orange-400/20",
  careerInterest: "bg-purple-400/20",
  learningStyle: "bg-pink-400/20",
};

export const sectionDotColors: Record<
  string,
  { base: string; active: string }
> = {
  academicAptitude: { base: "#1E3A8A", active: "#3B82F6" }, // Blue shades
  technicalSkills: { base: "#92400E", active: "#F97316" }, // Orange shades
  careerInterest: { base: "#581C87", active: "#A855F7" }, // Purple shades
  learningStyle: { base: "#831843", active: "#EC4899" }, // Pink shades
};

// src/constants/programs.ts
export const ProgramLabels: Record<string, string> = {
  BSCS: "Bachelor of Science in Computer Science",
  BSIT: "Bachelor of Science in Information Technology",
  BSIS: "Bachelor of Science in Information Systems",
  TechEng: "Technology Engineering (Electrical)", // <- matches your store key
};

const assessmentSections = [
  {
    id: 0,
    name: "Academic Aptitude",
    icon: BookOpen,
    description: "Evaluate your academic strengths and learning preferences",
    colorClass: "text-blue-500",
    borderColor: "border-blue-500/30",
    bgColor: "bg-blue-500/10",
  },
  {
    id: 1,
    name: "Technical Skills",
    icon: Cpu,
    description: "Identify your technical abilities and interests",
    colorClass: "text-orange-500",
    borderColor: "border-orange-500/30",
    bgColor: "bg-orange-500/10",
  },
  {
    id: 2,
    name: "Career Interest",
    icon: Target,
    description: "Discover your career preferences and motivations",
    colorClass: "text-purple-500",
    borderColor: "border-purple-500/30",
    bgColor: "bg-purple-500/10",
  },
  {
    id: 3,
    name: "Learning Style",
    icon: Brain,
    description: "Understand how you prefer to learn and process information",
    colorClass: "text-pink-500",
    borderColor: "border-pink-500/30",
    bgColor: "bg-pink-500/10",
  },
];

const sections: (keyof AssessmentAnswers)[] = [
  "academicAptitude",
  "technicalSkills",
  "careerInterest",
  "learningStyle",
];

const choiceLabels: Record<number, string> = {
  1: "Strongly Matches",
  2: "Matches",
  3: "Neutral",
  4: "Partially Matches",
  5: "Does Not Match",
};

const getSectionColorClass = (section: string) => {
  const colorMap: { [key: string]: string } = {
    academicAptitude: "academic-bg academic-hover",
    technicalSkills: "technical-bg technical-hover",
    careerInterest: "career-bg career-hover",
    learningStyle: "learning-bg learning-hover",
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
    case "learningStyle":
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
  assessmentSections,
  sections,
  choiceLabels,
  getSectionColorClass,
  getSectionColorClasses,
};
