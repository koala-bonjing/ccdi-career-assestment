import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import {
  Brain,
  BookOpen,
  Code2,
  Briefcase,
  Layers,
  GraduationCap,
  ChevronDown,
  ChevronUp,
  EyeOff,
  Clock,
  CheckCircle,
  BarChart3,
} from "lucide-react";

interface AssessmentInstructionsModalProps {
  show: boolean;
  onHide: () => void;
}

// ─── per-section data (scoring removed) ───────────────────────────────────────

const SECTIONS = [
  {
    key: "foundational",
    label: "Foundational",
    questions: 40,
    icon: GraduationCap,
    color: "#2B3176",
    bg: "rgba(43,49,118,0.08)",
    border: "rgba(43,49,118,0.25)",
    title: "Section 1 — Foundational Assessment",
    desc: "The only section that has right and wrong answers. It tests basic math, English, and computer knowledge through multiple choice, then measures your study habits and problem-solving mindset through honest self-assessment.",
    subsections: [
      {
        name: "Basic Knowledge",
        count: "14 questions",
        types: ["10 multiple choice", "4 self-assessment"],
        detail:
          "Covers percentages, algebra, English spelling, computer parts, file types, LED definitions, Wi-Fi, operating systems, and browser usage.",
        examples: [
          "What is 25% of 100?",
          "In electronics, what does LED stand for?",
          "Do you have access to a computer and internet at home?",
        ],
      },
      {
        name: "Study Habits",
        count: "13 questions",
        types: ["13 self-assessment only"],
        detail:
          "No right or wrong — you describe your real situation. Covers weekly study hours, commute distance, home study environment, and organization.",
        examples: [
          "How many hours per week can you study outside of class?",
          "How far is your home from the school?",
          "When working on a long project, how do you handle it?",
        ],
      },
      {
        name: "Problem Solving",
        count: "13 questions",
        types: ["8 multiple choice", "5 self-assessment"],
        detail:
          "Multiple choice tests practical logic — number patterns, proportions, troubleshooting steps. Self-assessment covers your attitude when facing problems.",
        examples: [
          "If a pattern goes 2, 4, 6, 8, ___, what comes next?",
          "Your phone isn't charging. What should you try FIRST?",
          "When you face a problem you don't know how to solve, what do you do?",
        ],
      },
    ],
    tip: "Answer based on your real situation right now — not the student you hope to be.",
  },
  {
    key: "academic",
    label: "Academic Aptitude",
    questions: 40,
    icon: BookOpen,
    color: "#1a7a3c",
    bg: "rgba(26,122,60,0.06)",
    border: "rgba(26,122,60,0.25)",
    title: "Section 2 — Academic Aptitude",
    desc: "All 40 questions use a 5-point agreement scale (Strongly Disagree → Strongly Agree). You rate how accurately each statement describes your thinking and learning abilities.",
    subsections: [
      {
        name: "Logic & Reasoning",
        count: "BSCS track",
        types: ["Agree / Disagree scale (1-5)"],
        detail:
          "Covers abstract thinking, breaking problems into steps, pattern recognition, and evaluating solutions logically.",
        examples: [
          "I can break down complex problems into smaller, manageable parts.",
          "I enjoy discovering patterns and finding the best solutions to problems.",
        ],
      },
      {
        name: "Systems & Troubleshooting",
        count: "BSIT / BSET track",
        types: ["Agree / Disagree scale (1-5)"],
        detail:
          "Covers understanding how systems interconnect, diagnosing faults, following technical procedures.",
        examples: [
          "I can identify what's wrong when systems or technology don't work as expected.",
          "I can follow detailed technical instructions step-by-step.",
        ],
      },
      {
        name: "Business & Data Analysis",
        count: "BSIS track",
        types: ["Agree / Disagree scale (1-5)"],
        detail:
          "Covers interpreting data, understanding business processes, explaining technical ideas to non-technical people.",
        examples: [
          "I'm good at understanding how business processes work and finding ways to improve them.",
          "I can look at data and numbers to find trends.",
        ],
      },
      {
        name: "Creative & Visual Thinking",
        count: "ACT Multimedia",
        types: ["Agree / Disagree scale (1-5)"],
        detail:
          "Covers aesthetic sense, translating ideas into visual form, taking creative feedback.",
        examples: [
          "I have a strong sense of visual aesthetics.",
          "I am good at translating ideas into visual representations.",
        ],
      },
    ],
    tip: "Be honest rather than optimistic. You are rating your current confidence level — not your potential.",
  },
  {
    key: "technical",
    label: "Technical Skills",
    questions: 40,
    icon: Code2,
    color: "#d97706",
    bg: "rgba(217,119,6,0.06)",
    border: "rgba(217,119,6,0.25)",
    title: "Section 3 — Technical Skills & Interests",
    desc: "Select ALL skills you have experience with — whether you're an expert or just starting to learn. You can select as many as apply. Don't worry if you're still learning; we want to know what you're familiar with.",
    subsections: [
      {
        name: "Programming & Development",
        count: "Coding skills",
        types: ["Checkbox / Multiple select"],
        detail:
          "Covers programming languages, web development, databases, and software development concepts.",
        examples: [
          "I have experience with HTML, CSS, or JavaScript",
          "I know how to work with databases",
          "I understand basic programming concepts",
        ],
      },
      {
        name: "Hardware & Electronics",
        count: "Technical skills",
        types: ["Checkbox / Multiple select"],
        detail:
          "Covers working with computer hardware, electronics, circuits, and troubleshooting physical devices.",
        examples: [
          "I can assemble or repair computer hardware",
          "I have experience with Arduino or Raspberry Pi",
          "I understand basic electronics and circuits",
        ],
      },
      {
        name: "Creative & Design Tools",
        count: "Design skills",
        types: ["Checkbox / Multiple select"],
        detail:
          "Covers graphic design, photo editing, video production, and creative software.",
        examples: [
          "I can use Photoshop or similar image editing software",
          "I have experience with video editing",
          "I understand design principles and color theory",
        ],
      },
      {
        name: "Networking & IT Support",
        count: "IT skills",
        types: ["Checkbox / Multiple select"],
        detail:
          "Covers setting up networks, troubleshooting computers, and providing technical support.",
        examples: [
          "I can set up a home network or Wi-Fi",
          "I know how to troubleshoot computer problems",
          "I understand basic cybersecurity concepts",
        ],
      },
    ],
    tip: "Select ANY skill you have experience with — even if you're still a beginner. There are no wrong answers, and selecting more skills helps us find the best program match for you.",
  },
  {
    key: "career",
    label: "Career Interest",
    questions: 40,
    icon: Briefcase,
    color: "#0e7490",
    bg: "rgba(14,116,144,0.06)",
    border: "rgba(14,116,144,0.25)",
    title: "Section 4 — Career Interest",
    desc: "All 40 questions use the 5-point scale. Each statement describes a specific job role or career path. Rate how much each direction appeals to you.",
    subsections: [
      {
        name: "Software & Research",
        count: "BSCS",
        types: ["Agree / Disagree scale (1-5)"],
        detail:
          "Roles: software developer, data scientist, AI/ML engineer. Focus on building new software and cutting-edge technology.",
        examples: [
          "I want to create new software applications and programs.",
          "I'm fascinated by artificial intelligence and machine learning.",
        ],
      },
      {
        name: "IT & Cybersecurity",
        count: "BSIT",
        types: ["Agree / Disagree scale (1-5)"],
        detail:
          "Roles: network admin, IT support, cybersecurity analyst. Focus on keeping systems running and secure.",
        examples: [
          "I'm interested in network administration or cybersecurity roles.",
          "I want to help organizations run their technology smoothly.",
        ],
      },
      {
        name: "Business & Systems",
        count: "BSIS",
        types: ["Agree / Disagree scale (1-5)"],
        detail:
          "Roles: business analyst, IT consultant, data analyst. Focus on bridging business needs with technology.",
        examples: [
          "I want to work at the intersection of business and technology.",
          "I'm interested in roles like business analyst or IT consultant.",
        ],
      },
      {
        name: "Electrical & Industrial",
        count: "BSET Electrical",
        types: ["Agree / Disagree scale (1-5)"],
        detail:
          "Roles: electrical technician, PLC programmer. Focus on power systems, manufacturing, renewable energy.",
        examples: [
          "I want to work with power systems or electrical infrastructure.",
          "I'm interested in industrial automation.",
        ],
      },
      {
        name: "Creative & Media",
        count: "ACT Multimedia",
        types: ["Agree / Disagree scale (1-5)"],
        detail:
          "Roles: graphic designer, animator, video editor. Focus on digital media, branding, advertising.",
        examples: [
          "I want to work as a graphic designer or animator.",
          "I am attracted to creative industries like film or gaming.",
        ],
      },
      {
        name: "Networking & Helpdesk",
        count: "ACT Networking",
        types: ["Agree / Disagree scale (1-5)"],
        detail:
          "Roles: IT support, network technician. Focus on setup, maintenance, and troubleshooting.",
        examples: [
          "I want to work as a network technician or IT support specialist.",
          "I want a stable technical job where I can start within 2 years.",
        ],
      },
    ],
    tip: "It's normal to feel drawn to more than one path. Rate each statement individually.",
  },
  {
    key: "learning",
    label: "Learning Style",
    questions: 40,
    icon: Layers,
    color: "#7c3aed",
    bg: "rgba(124,58,237,0.06)",
    border: "rgba(124,58,237,0.25)",
    title: "Section 5 — Learning Style & Logistics",
    desc: "Select ALL options that apply to you across 4 categories. You must select at least one option from each category to complete this section. This helps us understand your real-life situation and what you can realistically commit to.",
    subsections: [
      {
        name: "Learning Preferences",
        count: "How you study",
        types: ["Checkbox / Multiple select", "Select at least 1"],
        detail:
          "Covers preference for hands-on project-based learning vs. theory, 2-year vs. 4-year programs, self-study commitment, and comfort with lab-intensive work.",
        examples: [
          "I prefer learning by building actual projects",
          "I can commit to a 4-year program with lab work",
          "I can dedicate time outside class for coding",
        ],
      },
      {
        name: "Work Style Preferences",
        count: "How you work",
        types: ["Checkbox / Multiple select", "Select at least 1"],
        detail:
          "Covers openness to unpaid OJT/internships, working part-time during studies, physical demands, and reliable transport.",
        examples: [
          "I'm open to internships that may be unpaid",
          "I'm physically capable of hands-on work",
          "I have reliable transportation",
        ],
      },
      {
        name: "Financial & Time Resources",
        count: "What you can invest",
        types: ["Checkbox / Multiple select", "Select at least 1"],
        detail:
          "Covers readiness to spend on tools, lab fees, safety equipment, certification exams, textbooks, and having a capable computer.",
        examples: [
          "I'm willing to invest in tools and equipment",
          "I'm willing to invest in certification exams",
          "I have access to a capable computer",
        ],
      },
      {
        name: "Career Goals & Logistics",
        count: "Long-term plan",
        types: ["Checkbox / Multiple select", "Select at least 1"],
        detail:
          "Covers understanding program outcomes — management potential, licensure paths, creative careers, entry-level employment, or path to higher degree.",
        examples: [
          "I want a degree that can lead to management roles",
          "I'm investing in a career with strong demand",
          "I understand this 2-year program leads to entry-level roles",
        ],
      },
    ],
    tip: "Select ALL options that apply to you in each category. You must select at least one option per category to proceed. If a 4-year program with heavy lab work isn't realistic, don't select it — the system will recommend a 2-year ACT track instead.",
  },
];

// ─── sub-item component ───────────────────────────────────────────────────────

const SubItem: React.FC<{
  name: string;
  count: string;
  types: string[];
  detail: string;
  examples: string[];
  color: string;
}> = ({ name, count, types, detail, examples, color }) => {
  const [open, setOpen] = useState(false);

  return (
    <div
      style={{
        border: "1px solid #d4d4d8",
        borderRadius: 8,
        overflow: "hidden",
        marginBottom: 6,
        background: "white",
      }}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        style={{
          width: "100%",
          background: open ? "#f4f4f5" : "white",
          border: "none",
          padding: "10px 14px",
          display: "flex",
          alignItems: "flex-start",
          gap: 8,
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            padding: "3px 8px",
            borderRadius: 12,
            background: `${color}15`,
            color: color,
            border: `1px solid ${color}50`,
            flexShrink: 0,
            marginTop: 1,
            whiteSpace: "nowrap",
          }}
        >
          {count}
        </span>
        <span style={{ fontSize: 13, color: "#18181b", flex: 1, lineHeight: 1.4, fontWeight: 500 }}>
          {name}
        </span>
        <span style={{ color: "#52525b", flexShrink: 0, marginTop: 2 }}>
          {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </span>
      </button>

      {open && (
        <div
          style={{
            padding: "0 14px 12px 14px",
            borderTop: "1px solid #e4e4e7",
            background: "#fafafa",
          }}
        >
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", margin: "10px 0 8px" }}>
            {types.map((t) => (
              <span
                key={t}
                style={{
                  fontSize: 11,
                  padding: "3px 8px",
                  borderRadius: 12,
                  background: "#e4e4e7",
                  color: "#3f3f46",
                  border: "1px solid #d4d4d8",
                  fontWeight: 500,
                }}
              >
                {t}
              </span>
            ))}
          </div>
          <p style={{ fontSize: 12.5, color: "#3f3f46", lineHeight: 1.5, margin: "0 0 10px" }}>
            {detail}
          </p>
          <p style={{ fontSize: 11, fontWeight: 600, color: "#52525b", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 6px" }}>
            Example questions
          </p>
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            {examples.map((ex) => (
              <li key={ex} style={{ fontSize: 12, color: "#18181b", lineHeight: 1.5, marginBottom: 4, fontWeight: 450 }}>
                <em>"{ex}"</em>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

// ─── main modal ───────────────────────────────────────────────────────────────

export const AssessmentInstructionsModal: React.FC<
  AssessmentInstructionsModalProps
> = ({ show, onHide }) => {
  const [activeTab, setActiveTab] = useState(0);
  const sec = SECTIONS[activeTab];
  const Icon = sec.icon;

  return (
    <Modal show={show} onHide={onHide} centered size="lg" className="modern-modal">
      {/* ── header ── */}
      <Modal.Header
        className="border-0 pb-0"
        closeButton
        closeVariant="white"
        style={{ background: "#2B3176", borderRadius: "12px 12px 0 0", padding: "1.2rem 1.5rem" }}
      >
        <Modal.Title className="w-100 d-flex align-items-center gap-3">
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Brain size={20} color="#fff" />
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>
              Assessment Instructions
            </div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.75)", marginTop: 2 }}>
              5 sections · 200 questions · 20–25 minutes
            </div>
          </div>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body style={{ padding: "1.2rem 1.5rem", display: "flex", flexDirection: "column", gap: 14 }}>

        {/* notice */}
        <div
          style={{
            background: "#e0f2fe",
            border: "1px solid #7dd3fc",
            borderRadius: 10,
            padding: "12px 16px",
            fontSize: 13,
            color: "#0369a1",
            lineHeight: 1.5,
            fontWeight: 450,
          }}
        >
          This is a <strong style={{ color: "#0284c7" }}>program recommendation tool</strong>, not a test. There are no
          passing or failing scores. Answer every question as honestly as you can —
          your results are only as accurate as your answers.
        </div>

        {/* Quick Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap: 10 }}>
          {[
            { icon: Clock, label: "Duration", value: "20–25 mins", color: "#2B3176" },
            { icon: CheckCircle, label: "Sections", value: "5 Parts", color: "#1a7a3c" },
            { icon: EyeOff, label: "Privacy", value: "Confidential", color: "#0e7490" },
            { icon: BarChart3, label: "Result", value: "AI-Powered", color: "#d97706" },
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
              <item.icon size={22} color={item.color} style={{ marginBottom: 4 }} />
              <small style={{ color: "#52525b", fontSize: 11, fontWeight: 500 }}>{item.label}</small>
              <strong style={{ fontSize: 13, color: "#18181b" }}>{item.value}</strong>
            </div>
          ))}
        </div>

        {/* section tabs */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, minmax(0,1fr))", gap: 6 }}>
          {SECTIONS.map((s, i) => {
            const SIcon = s.icon;
            const active = activeTab === i;
            return (
              <button
                key={s.key}
                type="button"
                onClick={() => setActiveTab(i)}
                style={{
                  border: active ? `2px solid ${s.color}` : "1px solid #d4d4d8",
                  borderRadius: 10,
                  padding: "10px 4px",
                  cursor: "pointer",
                  background: active ? s.bg : "#f4f4f5",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 4,
                  transition: "all 0.15s",
                }}
              >
                <SIcon size={16} color={active ? s.color : "#52525b"} />
                <span style={{
                  fontSize: 10,
                  fontWeight: 600,
                  color: active ? s.color : "#3f3f46",
                  textAlign: "center",
                  lineHeight: 1.2,
                }}>
                  {s.label}
                </span>
                <span style={{ fontSize: 10, color: active ? s.color : "#71717a", fontWeight: 500 }}>
                  {s.questions} items
                </span>
              </button>
            );
          })}
        </div>

        {/* active panel */}
        <div
          style={{
            border: `1.5px solid ${sec.border}`,
            borderRadius: 12,
            padding: "14px 16px",
            background: sec.bg,
            display: "flex",
            alignItems: "flex-start",
            gap: 12,
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              flexShrink: 0,
              background: `${sec.color}25`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon size={18} color={sec.color} />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#18181b" }}>{sec.title}</div>
            <div style={{ fontSize: 12.5, color: "#3f3f46", marginTop: 4, lineHeight: 1.5, fontWeight: 450 }}>
              {sec.desc}
            </div>
          </div>
        </div>

        {/* sub-items */}
        <div>
          <p style={{
            fontSize: 11,
            fontWeight: 700,
            color: "#52525b",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            marginBottom: 8,
          }}>
            What's covered — tap each to expand
          </p>
          {sec.subsections.map((sub) => (
            <SubItem key={sub.name} {...sub} color={sec.color} />
          ))}
        </div>

        {/* tip row - full width now since scoring is removed */}
        <div
          style={{
            borderRadius: 10,
            padding: "12px 14px",
            border: "1px solid #d4d4d8",
            background: "#f4f4f5",
            fontSize: 12,
            color: "#3f3f46",
            lineHeight: 1.5,
            display: "flex",
            gap: 8,
            alignItems: "flex-start",
          }}
        >
          <span style={{ flexShrink: 0, marginTop: 1 }}>💡</span>
          <span style={{ fontWeight: 450 }}>{sec.tip}</span>
        </div>

        {/* Program Options Summary */}
        <div
          style={{
            background: "#f4f4f5",
            borderRadius: 10,
            border: "1px solid #d4d4d8",
            padding: "14px 16px",
          }}
        >
          <p style={{ fontSize: 12, fontWeight: 700, color: "#18181b", marginBottom: 8 }}>
            📋 Programs We'll Recommend From:
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 16px" }}>
            {[
              "BSCS - Software Dev, AI/ML",
              "BSIT - Networking, Cybersecurity",
              "BSIS - Business Analysis, Data",
              "BSET Electronics - Circuits, Robotics",
              "BSET Electrical - Power, Automation",
              "ACT Multimedia - Design, Animation",
              "ACT Programming - Web/App Dev",
              "ACT Networking - SysAdmin, Hardware",
            ].map((item) => (
              <span key={item} style={{ fontSize: 12, color: "#3f3f46", fontWeight: 450 }}>
                <strong style={{ color: "#18181b" }}>{item.split(" - ")[0]}</strong> - {item.split(" - ")[1]}
              </span>
            ))}
          </div>
        </div>

        {/* after submission */}
        <div
          style={{
            background: "#f4f4f5",
            borderRadius: 10,
            border: "1px solid #d4d4d8",
            padding: "14px 16px",
          }}
        >
          <p style={{ fontSize: 12, fontWeight: 700, color: "#18181b", marginBottom: 8 }}>
            📊 After you finish all 5 sections you'll instantly receive:
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 16px" }}>
            {[
              "AI-generated program recommendation",
              "Foundational readiness score & breakdown",
              "Compatibility scores across all 8 programs",
              "Detailed explanation of why each program fits",
              "Preparation topics to study before enrolling",
              "Visual charts showing your strengths",
            ].map((item) => (
              <div key={item} style={{ fontSize: 12, color: "#3f3f46", display: "flex", gap: 6, alignItems: "flex-start", fontWeight: 450 }}>
                <span style={{ color: "#2B3176", flexShrink: 0, fontWeight: 700 }}>•</span>
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* Tips */}
        <div
          style={{
            background: "#fef3c7",
            borderRadius: 10,
            border: "1px solid #fcd34d",
            padding: "14px 16px",
          }}
        >
          <p style={{ fontSize: 12, fontWeight: 700, color: "#92400e", marginBottom: 8 }}>
            💡 Tips for Best Results
          </p>
          <ul style={{ margin: 0, paddingLeft: 20 }}>
            <li style={{ fontSize: 12, color: "#78350f", lineHeight: 1.5, marginBottom: 4, fontWeight: 450 }}>
              <strong style={{ color: "#92400e" }}>Be honest</strong> — Answer truthfully for accurate recommendations.
            </li>
            <li style={{ fontSize: 12, color: "#78350f", lineHeight: 1.5, marginBottom: 4, fontWeight: 450 }}>
              <strong style={{ color: "#92400e" }}>Don't stress about "wrong" answers</strong> — The goal is to find the right program for YOU.
            </li>
            <li style={{ fontSize: 12, color: "#78350f", lineHeight: 1.5, marginBottom: 4, fontWeight: 450 }}>
              For the <strong>Foundational Assessment</strong>, don't guess wildly. If you don't know, select the closest option.
            </li>
            <li style={{ fontSize: 12, color: "#78350f", lineHeight: 1.5, fontWeight: 450 }}>
              You can navigate between questions and edit answers before final submission.
            </li>
          </ul>
        </div>

        {/* privacy */}
        <div
          style={{
            textAlign: "center",
            padding: "10px 14px",
            background: "#fff",
            border: "1px solid #d4d4d8",
            borderRadius: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          <EyeOff size={14} color="#52525b" />
          <small style={{ color: "#3f3f46", fontSize: 11.5, fontWeight: 450 }}>
            Your responses are private and used only to generate your personalized program recommendation.
          </small>
        </div>

      </Modal.Body>

      <Modal.Footer className="border-0 justify-content-center pb-4">
        <Button
          variant="primary"
          onClick={() => {
            localStorage.setItem("hasSeenAssessmentInstructions", "true");
            onHide();
          }}
          className="px-5 py-2"
          style={{
            background: "linear-gradient(135deg, #1C6CB3 0%, #2B3176 100%)",
            border: "none",
            fontSize: "1rem",
            fontWeight: 600,
            borderRadius: 8,
          }}
        >
          Start Assessment →
        </Button>
      </Modal.Footer>
    </Modal>
  );
};