import type { QuestionCategory } from "./types";

const BASE_URL = "http://localhost:4000";

const questions: QuestionCategory = {
  academicAptitude: [
    "I can solve math problems with confidence.",
    "I understand technical readings and manuals easily.",
    "I can write reports or essays clearly.",
    "I perform well on time-limited tests or quizzes.",
    "I retain information better when I write it down.",
    "I easily follow complex instructions.",
    "I enjoy solving logical problems and puzzles.",
    "I understand how computer programs work.",
    "I prefer subjects that involve numbers and analysis.",
    "I enjoy analyzing data or creating graphs.",
    "I can explain complex ideas in simple terms.",
    "I can learn new software or apps quickly.",
    "I enjoy understanding how networks or connections work.",
  ],

  technicalSkills: [
    "Assembling or repairing electronics",
    "Creating websites or apps",
    "Troubleshooting computer hardware or software",
    "Editing photos, videos, or multimedia",
    "Designing systems, blueprints, or flowcharts",
    "Managing computer networks or databases",
    "Conducting experiments or simulations",
    "Operating machinery or technical equipment",
    "I like understanding how electrical circuits function.",
    "I enjoy building or repairing electronic devices.",
    "I am interested in robotics or smart technology.",
    "I enjoy fixing technical issues with gadgets or appliances.",
    "I enjoy understanding how machines or systems operate.",
  ],

  careerInterest: [
    "Realistic: Working with tools/machines; Building/fixing electronics",
    "Investigative: Solving problems/analyzing data; Doing research/science",
    "Artistic: Designing/creative tasks; Working on media or digital arts",
    "Social: Teaching others; Team projects or mentoring",
    "Enterprising: Leading groups; Starting a business/tech startup",
    "Conventional: Organizing files/databases; Working with spreadsheets or documentation",
    "I want to work as a software developer or programmer.",
    "I want to be a system or network administrator.",
    "I want to manage business operations using IT.",
    "I want to work with electrical systems or industrial machines.",
    "I want to design and develop automated technologies.",
    "I want to create software for business needs.",
    "I want to be part of a team that builds useful systems.",
    "I like helping people solve tech-related problems.",
    "I like improving existing systems or processes.",
  ],

  learningStyle: {
    "I learn better when I…": [
      "A. Watch videos/see diagrams",
      "B. Listen to explanations/discussions",
      "C. Read instructions/books",
      "D. Try it out hands-on",
    ],
    "When studying, I prefer to…": [
      "A. Use charts/color-coded notes",
      "B. Discuss with others",
      "C. Read silently",
      "D. Practice with real problems",
    ],
    "During lectures, I…": [
      "A. Prefer slides and visuals",
      "B. Focus on hearing the instructor",
      "C. Take notes to read later",
      "D. Want to try examples myself",
    ],
  },
};

  const categoryTitles: Record<string, string> = {
    academicAptitude: "Academic Aptitude",
    technicalSkills: "Technical Skills",
    careerInterest: "Career Interests",
    learningStyle: "Learning Style",
  };

export { BASE_URL, questions, categoryTitles};
