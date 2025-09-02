import type { QuestionCategory, AssessmentAnswers } from "./types";

const BASE_URL = "http://localhost:4000";

const categoryTitles: Record<string, string> = {
  academicAptitude: "Academic Aptitude",
  technicalSkills: "Technical Skills",
  careerInterest: "Career Interests",
  learningStyle: "Learning Style",
};

const questions = {
  academicAptitude: [
    // Problem-Solving & Logic
    "I enjoy solving puzzles or brain teasers.",
    "I can break down complex tasks into smaller, manageable steps.",

    // Technical Curiosity (Non-intimidating)
    "I’m curious about how gadgets, apps, or computer systems work.",
    "I understand technical instructions (e.g., manuals, diagrams) with some effort.",

    // Learning & Adaptability
    "I retain information better when I write it down or practice hands-on.",
    "I learn well from video tutorials or step-by-step demonstrations.",
    "I’m comfortable asking for help when I don’t understand something.",

    // Academic Basics
    "I can write clear summaries or short reports.",
    "I perform reasonably well on time-limited quizzes.",

    // Math/Logic (Beginner-Friendly)
    "I’m willing to practice math basics (like algebra) to improve.",
    "I notice patterns or inconsistencies easily (e.g., spotting errors in lists).",

    // Instructions & Detail
    "I can follow multi-step instructions (e.g., recipes, assembly guides).",
    "I pay attention to details when completing tasks.",
  ],
  technicalSkills: [
    // Beginner-Friendly & General Tech Interest
    "I enjoy troubleshooting gadgets or software (e.g., fixing phone settings, Wi-Fi issues).",
    "I’ve edited photos/videos using apps like Photoshop, Canva, or CapCut.",
    "I’ve built or customized simple websites (e.g., Wix, WordPress, HTML/CSS).",
    "I’ve used tools like Excel/Google Sheets for data organization or calculations.",

    // Hands-On & Practical Skills
    "I’ve assembled or repaired electronics (e.g., PCs, keyboards, wiring).",
    "I’ve designed diagrams, flowcharts, or layouts (e.g., PowerPoint, Lucidchart).",
    "I’ve operated technical equipment (e.g., 3D printers, robotics kits, lab tools).",

    // IT-Adjacent Experience
    "I’ve managed social media accounts or online communities.",
    "I’ve run experiments or simulations (e.g., science labs, game mods).",
    "I’ve learned basic coding (e.g., Scratch, Python, or game scripts).",

    // Soft Skills with Tech Relevance
    "I can explain technical concepts to others in simple terms.",
    "I follow tech-related news or YouTube channels (e.g., AI, gadgets).",
  ],
  careerInterest: [
    // Realistic - The Doers
    "Realistic: Hands-on work with tools, machines, or hardware (e.g., building PCs, repairing devices, working with engineering equipment).",
    
    // Investigative - The Problem-Solvers
    "Investigative: Analyzing data, researching solutions, and solving complex puzzles (e.g., investigating software bugs, researching new technologies, data analysis).",
    
    // Artistic - The Creators
    "Artistic: Designing creative solutions and working on visual or multimedia projects (e.g., UI/UX design, game development, video editing, digital graphics).",
    
    // Social - The Helpers & Collaborators
    "Social: Teaching, helping, and collaborating with others (e.g., tech support, training users, leading team projects, managing client relationships).",
    
    // Enterprising - The Leaders
    "Enterprising: Leading teams, managing projects, or starting new ventures (e.g., project management, tech entrepreneurship, IT sales and marketing).",
    
    // Conventional - The Organizers
    "Conventional: Organizing information, working with data, and maintaining structured systems (e.g., database management, network administration, technical documentation).",
    
    // Added: A specifically modern and relevant IT angle
    "I am curious about the 'behind-the-scenes' of how the internet and digital services work.",
    "I enjoy playing strategy games or thinking about systems and how to optimize them.",
  ],
  learningStyle: [
    {
      question: "I learn a new skill best when I…",
      options: [
        "A. Watch video tutorials or see visual diagrams.",
        "B. Listen to someone explain it or talk it through with a friend.",
        "C. Read articles, textbooks, or written step-by-step guides.",
        "D. Immediately try it myself, even if I make mistakes.",
      ],
    },
    {
      question: "When tackling a difficult problem, I usually…",
      options: [
        "A. Draw a picture or diagram to map it out.",
        "B. Explain the problem out loud to someone else.",
        "C. Research and read about similar solutions online.",
        "D. Start experimenting with different solutions to see what works.",
      ],
    },
    {
      question: "In a group project, my strongest role is…",
      options: [
        "A. Designing the presentation, visuals, or user interface.",
        "B. Communicating ideas and facilitating team discussion.",
        "C. Researching and writing the report or documentation.",
        "D. Building the functional prototype or testing the system.",
      ],
    },
    {
      question: "If an app or website is confusing, my first instinct is to…",
      options: [
        "A. Look for a tutorial or a diagram that explains it.",
        "B. Call a friend or customer support to talk it through.",
        "C. Find the 'Help' section or FAQ to read the instructions.",
        "D. Click on everything to explore and figure it out through trial and error.",
      ],
    },
    {
      question: "I feel most confident in my knowledge after I…",
      options: [
        "A. See the overall structure and how things connect visually.",
        "B. Teach the concept to another person.",
        "C. Have my notes organized and can review them.",
        "D. Have successfully used it in a practical, hands-on way.",
      ],
    },
  ],
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

export const sectionDotColors: Record<string, { base: string; active: string }> = {
  academicAptitude: { base: "#1E3A8A", active: "#3B82F6" }, // Blue shades
  technicalSkills: { base: "#92400E", active: "#F97316" }, // Orange shades
  careerInterest: { base: "#581C87", active: "#A855F7" }, // Purple shades
  learningStyle: { base: "#831843", active: "#EC4899" }, // Pink shades
};


export { BASE_URL, questions, categoryTitles,sectionBgColors, sectionHoverColors, sectionFormBgColors };
