import type { AssessmentAnswers } from "../types";
import { Brain, BookOpen, Cpu, Target } from "lucide-react";

const BASE_URL = "http://localhost:4000";

const categoryTitles: Record<string, string> = {
  academicAptitude: "Academic Aptitude",
  technicalSkills: "Technical Skills",
  careerInterest: "Career Interests",
  learningStyle: "Learning Style",
};

const questions = {
  academicAptitude: [
    // Logical & Abstract Thinking (Core for CS/IT/IS)
    "I enjoy solving logic puzzles or playing strategy games like chess or Sudoku.",
    "I can easily understand instructions that involve sequences and conditional steps (if-then scenarios).",
    "I'm comfortable working with abstract concepts and theoretical ideas.",
    "I can identify flaws in arguments or spot inconsistencies in reasoning.",
    "When faced with a complex problem, I naturally look for underlying patterns or principles.",
    "I enjoy brain teasers that require thinking outside the box.",

    // Mathematical Foundation (Essential for Engineering, important for CS)
    "I find working with formulas and mathematical equations to be a manageable and interesting challenge.",
    "I am good at identifying patterns in numbers or data sets.",
    "I understand that strong math skills are crucial for my chosen field and am willing to put in the work to develop them.",
    "I can visualize mathematical concepts in my mind.",
    "I enjoy challenges that require precise calculations.",
    "I'm comfortable with algebraic manipulations and solving for unknowns.",

    // Analytical & Problem-Solving
    "When a system (like an app or a device) fails, I systematically think about what could have caused the problem.",
    "I enjoy breaking down a complex problem into smaller, more manageable parts to find a solution.",
    "I pay close attention to details, as I know a small error can lead to a big problem in coding or engineering.",
    "I can think through multiple possible solutions before choosing one to implement.",
    "When I encounter an error, I persistently work to understand its root cause.",
    "I enjoy optimizing processes to make them more efficient.",
  ],
  technicalSkills: [
    // Software & Programming Inclination
    "I have tried learning a programming language (e.g., Python, Java, C++, HTML/CSS) or am very interested in starting.",
    "I understand what an algorithm is—a step-by-step procedure for solving a problem.",
    "I've troubleshooted software issues on my computer or phone beyond a simple restart (e.g., checking settings, updating drivers).",
    "I have experience with version control systems like Git, or understand their purpose.",
    "I can read and understand basic code snippets, even if I can't write them yet.",
    "I understand the difference between front-end and back-end development.",

    // Hardware & Systems Understanding (Key for EE and IT)
    "I am curious about how computer hardware components (CPU, RAM, motherboard) work together.",
    "I have basic knowledge of electrical components (e.g., resistors, circuits) or am eager to learn about them.",
    "I understand the difference between hardware problems and software problems on a device.",
    "I have built or upgraded a computer system myself.",
    "I understand basic networking concepts like IP addresses, DNS, and routers.",
    "I can read and interpret technical diagrams or schematics.",

    // Practical Tech Application
    "I have used tools like spreadsheets (Excel/Sheets) for more than basic lists, such as using formulas or creating charts.",
    "I feel confident that I could learn to use new, complex software with some time and practice.",
    "I have set up or configured a network, like a home Wi-Fi, and understand basic concepts like IP addresses or bandwidth.",
    "I have experience with database concepts or have used simple databases.",
    "I regularly use keyboard shortcuts to work more efficiently.",
    "I enjoy customizing software settings to better suit my workflow.",

    // Advanced Technical Exposure
    "I understand basic concepts of cybersecurity and why it's important.",
    "I have experience with command line interfaces or terminal commands.",
    "I follow technology trends and emerging technologies.",
    "I have worked with APIs or understand their purpose in connecting different systems.",
  ],
  careerInterest: [
    // Investigative - The Core of CS & Engineering
    "Investigative: I enjoy deep-diving into how things work, researching complex topics, and solving abstract problems (e.g., optimizing code, designing efficient algorithms, understanding circuit theory).",
    "I enjoy reading about new technological discoveries and breakthroughs.",
    "I would enjoy work that involves research and development of new technologies.",

    // Realistic - The Hands-On Side of EE & IT
    "Realistic: I enjoy hands-on work with hardware, systems, and tools (e.g., building computers, setting up networks, working with electrical systems, prototyping with microcontrollers like Arduino).",
    "I prefer work environments where I can see tangible results of my efforts.",
    "I enjoy working with physical devices and equipment.",

    // Conventional - The Structured Side of IS & IT
    "Conventional: I enjoy organizing information, working with data, and maintaining structured, efficient systems (e.g., database management, system administration, ensuring network security).",
    "I appreciate well-documented processes and clear procedures.",
    "I enjoy creating order from chaos in information systems.",

    // Enterprising - The Business Tech Angle (Especially for IS)
    "Enterprising: I am interested in how technology can solve business problems, improve processes, or be leveraged for entrepreneurial ventures.",
    "I can see myself managing technology projects or teams.",
    "I'm interested in the business aspects of technology implementation.",

    // Artistic - The Creative Tech Side
    "Artistic: I enjoy designing user interfaces, creating digital graphics, or working on creative coding projects.",
    "I appreciate good design in software and websites.",
    "I enjoy creating visual representations of data or concepts.",

    // Social - The Collaborative Side
    "Social: I enjoy working in teams and collaborating on projects.",
    "I would be comfortable providing technical support or training to users.",
    "I enjoy explaining technical concepts to non-technical people.",

    // Specific Field Inclinations
    "I am more fascinated by the theory and creation of software itself (how operating systems, AI, or compilers work) than just using it. (BSCS)",
    "I am interested in applying technology to meet the practical needs of users and organizations, like managing IT infrastructure. (BSIT)",
    "I see myself as a bridge between technical teams and business stakeholders, helping them understand each other. (BSIS)",
    "I am drawn to the challenge of designing, building, and improving physical systems that use electricity and electronics. (Electrical Engineering)",
    "I enjoy thinking about how different systems integrate and work together.",
    "I'm interested in emerging fields like artificial intelligence, IoT, or robotics.",
    "I would enjoy work that involves both technical and creative problem-solving.",
  ],
  learningStyle: [
    {
      question:
        "When presented with a new software tool or programming language, I prefer to...",
      options: [
        "A. Read the official documentation or a textbook to understand its structure.",
        "B. Watch a video tutorial to see it in action.",
        "C. Listen to a lecture or have someone explain the core concepts first.",
        "D. Dive right in and start a small project, learning from my mistakes.",
      ],
    },
    {
      question:
        "My approach to a large, complex project (like building an app or a circuit) is to...",
      options: [
        "A. Plan everything meticulously on paper first, creating diagrams and flowcharts.",
        "B. Build a small, simple version (a prototype) to test my ideas early on.",
        "C. Research and study similar projects to understand best practices.",
        "D. Break it into modules and tackle one piece at a time in a structured way.",
      ],
    },
    {
      question: "In a lab or practical setting, I am the one who...",
      options: [
        "A. Carefully follows the procedure step-by-step to ensure accuracy.",
        "B. Tries to experiment with the instructions to see if I can get a different or better result.",
        "C. Focuses on understanding the 'why' behind each step in the procedure.",
        "D. Enjoys the hands-on process of connecting components and seeing the system come to life.",
      ],
    },
    {
      question: "If I get stuck on a difficult coding or math problem, I...",
      options: [
        "A. Take a break and come back to it later with a fresh perspective.",
        "B. Search online forums like Stack Overflow for similar problems and solutions.",
        "C. Try to explain the problem to a peer or a rubber duck to clarify my thinking.",
        "D. Systematically test different hypotheses until I find what's wrong.",
      ],
    },
    {
      question:
        "I know I have truly mastered a technical concept when I can...",
      options: [
        "A. Explain it clearly to someone who has no background in the subject.",
        "B. Successfully use it to solve a real-world problem in a project.",
        "C. Write clean, efficient code or design an elegant circuit based on it.",
        "D. Answer deep, theoretical questions about its limitations and applications.",
      ],
    },
    {
      question: "When learning new technical material, I prefer...",
      options: [
        "A. Structured courses with clear learning objectives and assessments.",
        "B. Project-based learning where I apply concepts to real problems.",
        "C. Self-paced exploration with lots of examples to study.",
        "D. Collaborative learning with peers where we can discuss concepts.",
      ],
    },
    {
      question: "In group technical projects, I naturally gravitate toward...",
      options: [
        "A. The architecture and planning phase.",
        "B. The implementation and coding/building phase.",
        "C. The testing and debugging phase.",
        "D. The documentation and presentation phase.",
      ],
    },
    {
      question:
        "When encountering a new complex system, my first instinct is to...",
      options: [
        "A. Understand the overall architecture and how components interact.",
        "B. Start using it to see how it works in practice.",
        "C. Look for documentation or specifications.",
        "D. Find someone who can give me a guided tour or explanation.",
      ],
    },
    {
      question: "I absorb technical information best when it's presented...",
      options: [
        "A. Visually, with diagrams, charts, and flowcharts.",
        "B. Through hands-on exercises and labs.",
        "C. In written form with clear examples.",
        "D. Through discussion and Q&A sessions.",
      ],
    },
    {
      question: "My ideal technical learning environment includes...",
      options: [
        "A. Access to comprehensive reference materials and documentation.",
        "B. Plenty of opportunities for hands-on experimentation.",
        "C. Regular feedback and guidance from experts.",
        "D. Collaborative spaces where I can work with peers.",
      ],
    },
  ],
  personalAttributes: [
    // Persistence & Work Ethic
    "I can work on a challenging problem for hours without getting frustrated.",
    "I'm willing to put in extra time to understand difficult concepts.",
    "I consistently follow through on tasks I start, even when they become challenging.",

    // Attention to Detail
    "I naturally double-check my work for errors before considering it complete.",
    "I notice small inconsistencies that others might overlook.",
    "I'm meticulous about organization in my work and notes.",

    // Adaptability & Learning Mindset
    "I embrace new technologies and am eager to learn new tools.",
    "I view failures as learning opportunities rather than setbacks.",
    "I'm comfortable with the idea that in technology, continuous learning is essential.",

    // Communication & Teamwork
    "I can explain technical concepts to non-technical people effectively.",
    "I work well in team environments and value diverse perspectives.",
    "I'm comfortable asking for help when I need it.",

    // Problem-Solving Approach
    "I enjoy the process of debugging and finding root causes.",
    "I'm patient when working through complex, multi-step problems.",
    "I can maintain focus on long-term projects without losing motivation.",

    // Professional Mindset
    "I understand the importance of deadlines and time management in technical work.",
    "I'm interested in the ethical implications of technology.",
    "I stay curious about how things work, even outside my immediate interests.",
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

export {
  BASE_URL,
  questions,
  categoryTitles,
  sectionBgColors,
  sectionHoverColors,
  sectionFormBgColors,
  assessmentSections,
};
