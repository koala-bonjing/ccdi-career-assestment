import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { BookOpen } from "lucide-react";

interface CoursesModalProps {
  show: boolean;
  onHide: () => void;
}

const FOUR_YEAR_COURSES = [
  {
    code: "BSCS",
    name: "Bachelor of Science in Computer Science",
    description:
      "Focuses on the theoretical foundations of computing — algorithms, data structures, software engineering, and advanced programming paradigms. Heavy on mathematics and logical reasoning.",
    unique:
      "Strongest math and logic requirements among all programs. Prepares graduates for cutting-edge fields like AI, machine learning, and research computing.",
    primaryJob: "Software Developer, Systems Analyst, Data Scientist",
    secondaryJobs: "AI/ML Engineer, Research Scientist, Technical Consultant",
    color: "#2B3176",
  },
  {
    code: "BSIT",
    name: "Bachelor of Science in Information Technology",
    description:
      "Emphasizes practical application of technology in real business environments — networking, IT infrastructure, web development, and cloud services.",
    unique:
      "Most hands-on and industry-ready program. Graduates can step into IT roles immediately. Aligns with CompTIA, AWS, and cybersecurity certifications.",
    primaryJob: "IT Specialist, Network Administrator, Web Developer",
    secondaryJobs: "Cybersecurity Analyst, Cloud Support Engineer, Tech Support Manager",
    color: "#1a7a3c",
  },
  {
    code: "BSIS",
    name: "Bachelor of Science in Information Systems",
    description:
      "Bridges business processes and technology — system analysis, database architecture, ERP systems, and data management. The ideal choice if you see both sides of the business-tech relationship.",
    unique:
      "Combines IT skills with business acumen and project management. Graduates are sought by organizations that need someone who can translate between technical teams and business stakeholders.",
    primaryJob: "Business Analyst, IT Project Manager, Database Administrator",
    secondaryJobs: "Data Analyst, ERP Consultant, QA Specialist",
    color: "#0e7490",
  },
  {
    code: "BSET-E",
    name: "BS Electrical Engineering",
    description:
      "Studies the application of electricity, power systems, electronics, and electromagnetism. Strong foundation in physics and circuit analysis. Leads to licensure as a professional electrical engineer.",
    unique:
      "The only program leading to PRC board licensure (REE). Covers power distribution, control systems, renewable energy, and industrial automation.",
    primaryJob: "Electrical Engineer, Power Systems Engineer, Control Systems Engineer",
    secondaryJobs: "Project Engineer, Renewable Energy Specialist, HVAC Designer",
    color: "#d97706",
  },
  {
    code: "BSET-EL",
    name: "BS Electronics Engineering",
    description:
      "Covers electronic devices, communication systems, embedded technologies, and signal processing. Ideal for students who want to work with hardware, circuits, and telecommunications at a professional level.",
    unique:
      "Hands-on with hardware design, microcontrollers, RF systems, and IoT. Also leads to PRC licensure (RECE). Bridges the gap between software and physical hardware.",
    primaryJob: "Electronics Engineer, Hardware Designer, Telecom Engineer",
    secondaryJobs: "Embedded Systems Dev, RF Engineer, Test & Measurement Specialist",
    color: "#7c3aed",
  },
];

const TWO_YEAR_COURSES = [
  {
    code: "ACT-Prog",
    name: "Associate in Computer Technology — Programming",
    description:
      "Intensive, project-based training in software development, coding practices, and real application building. Covers modern languages including Python, JavaScript, and Java using agile workflows.",
    unique:
      "For students who want to start coding careers quickly without a 4-year commitment. A great stepping stone — graduates can later pursue BSCS or BSIT through bridging programs.",
    primaryJob: "Junior Software Developer, Web Developer, QA Tester",
    secondaryJobs: "Technical Support, Freelance Developer, IT Trainer",
    color: "#1a7a3c",
  },
  {
    code: "ACT-Net",
    name: "Associate in Computer Technology — Networking",
    description:
      "Hands-on focus on computer networks, infrastructure setup, cybersecurity fundamentals, and system administration. Aligned with industry certifications like CCNA and CompTIA Network+.",
    unique:
      "For students who prefer configuring and maintaining systems over writing code. Ideal for those who want a stable, in-demand technical career with certification pathways.",
    primaryJob: "Network Technician, IT Support Specialist, System Administrator",
    secondaryJobs: "Cybersecurity Analyst, Cloud Support Associate, NOC Technician",
    color: "#0e7490",
  },
  {
    code: "ACT-MM",
    name: "Associate in Computer Technology — Multimedia & Animation",
    description:
      "A creative-technical blend covering digital content creation, 2D/3D animation, graphic design, and video production. Software-focused with tools like Adobe Creative Suite, Blender, and Maya. Portfolio-driven.",
    unique:
      "Best fit if you already enjoy drawing, design, or video creation. Graduates work in digital media, entertainment, advertising, and game asset design.",
    primaryJob: "Multimedia Artist, Animator, Graphic Designer",
    secondaryJobs: "Video Editor, UI/UX Designer, Content Creator, Game Asset Designer",
    color: "#7c3aed",
  },
];

const RESPONSIVE_CSS = `
  .courses-modal-body { padding: 1.25rem !important; }

  .courses-tabs-row {
    display: flex; gap: 8px; margin-bottom: 18px;
    border-bottom: 1px solid rgba(43,49,118,0.12); padding-bottom: 12px;
  }
  .ctab {
    padding: 7px 18px; border-radius: 20px;
    border: 1px solid rgba(43,49,118,0.15);
    font-size: 13px; font-weight: 500; cursor: pointer;
    background: transparent; color: #52525b;
    transition: all 0.15s;
  }
  .ctab.active { background: #2B3176; color: #fff; border-color: #2B3176; }

  .dur-badge {
    display: inline-flex; align-items: center; gap: 5px;
    font-size: 11px; font-weight: 600; border-radius: 12px;
    padding: 4px 12px; margin-bottom: 14px;
  }
  .dur-4yr { background: #e0f2fe; color: #0369a1; }
  .dur-2yr { background: #d1fae5; color: #065f46; }

  .course-card-v2 {
    border: 1px solid rgba(43,49,118,0.13);
    border-radius: 12px; padding: 16px; margin-bottom: 12px;
    background: #fff; transition: border-color 0.15s;
  }
  .course-card-v2:last-child { margin-bottom: 0; }
  .course-card-v2:hover { border-color: rgba(43,49,118,0.28); }

  .cc-header { display: flex; align-items: flex-start; gap: 11px; margin-bottom: 10px; }
  .cc-badge {
    color: #fff; border-radius: 6px;
    padding: 5px 10px; font-size: 11px; font-weight: 700;
    white-space: nowrap; flex-shrink: 0;
  }
  .cc-name { font-size: 14px; font-weight: 700; color: #18181b; line-height: 1.35; }

  .cc-desc {
    font-size: 12.5px; color: #52525b; line-height: 1.6;
    margin-bottom: 10px;
  }

  .cc-unique {
    background: #f7f8fc; border-radius: 8px;
    padding: 9px 12px; margin-bottom: 10px;
  }
  .cc-unique-label {
    font-size: 10px; font-weight: 700; color: #a1a1aa;
    text-transform: uppercase; letter-spacing: 0.07em; margin-bottom: 4px;
  }
  .cc-unique-val { font-size: 12px; color: #18181b; line-height: 1.5; }

  .cc-jobs { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
  @media (max-width: 480px) { .cc-jobs { grid-template-columns: 1fr; } }

  .cc-job-box { background: #f4f4f5; border-radius: 7px; padding: 8px 10px; }
  .cc-job-label {
    font-size: 10px; font-weight: 700; color: #a1a1aa;
    text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 3px;
  }
  .cc-job-val { font-size: 11.5px; color: #3f3f46; line-height: 1.45; }
`;

interface CourseCardProps {
  course: typeof FOUR_YEAR_COURSES[0];
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => (
  <div className="course-card-v2">
    <div className="cc-header">
      <span className="cc-badge" style={{ background: course.color }}>
        {course.code}
      </span>
      <div className="cc-name">{course.name}</div>
    </div>
    <p className="cc-desc">{course.description}</p>
    <div className="cc-unique">
      <div className="cc-unique-label">What makes this program unique</div>
      <div className="cc-unique-val">{course.unique}</div>
    </div>
    <div className="cc-jobs">
      <div className="cc-job-box">
        <div className="cc-job-label">Primary careers</div>
        <div className="cc-job-val">{course.primaryJob}</div>
      </div>
      <div className="cc-job-box">
        <div className="cc-job-label">Also leads to</div>
        <div className="cc-job-val">{course.secondaryJobs}</div>
      </div>
    </div>
  </div>
);

export const CoursesModal: React.FC<CoursesModalProps> = ({ show, onHide }) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <style>{RESPONSIVE_CSS}</style>

      <Modal.Header
        className="border-0 pb-0"
        closeButton
        closeVariant="white"
        style={{
          background: "#2B3176",
          borderRadius: "12px 12px 0 0",
          padding: "1rem 1.25rem",
        }}
      >
        <Modal.Title className="w-100 d-flex align-items-center gap-3">
          <div
            style={{
              width: 36, height: 36, borderRadius: "50%",
              background: "rgba(255,255,255,0.15)",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <BookOpen size={18} color="#fff" />
          </div>
          <div>
            <div style={{ color: "#fff", fontSize: "clamp(13px,13px + 1vw,16px)", fontWeight: 700 }}>
              Academic Programs
            </div>
            <div style={{ color: "rgba(255,255,255,0.7)", fontSize: "clamp(10px,10px + 0.5vw,12px)", marginTop: 2 }}>
              5 four-year degrees · 3 two-year associate programs
            </div>
          </div>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body
        className="courses-modal-body"
        style={{ maxHeight: "72vh", overflowY: "auto" }}
      >
        {/* Tabs */}
        <div className="courses-tabs-row">
          <button
            className={`ctab ${activeTab === 0 ? "active" : ""}`}
            onClick={() => setActiveTab(0)}
          >
            4-Year Degrees
          </button>
          <button
            className={`ctab ${activeTab === 1 ? "active" : ""}`}
            onClick={() => setActiveTab(1)}
          >
            2-Year Programs
          </button>
        </div>

        {activeTab === 0 && (
          <div>
            <span className="dur-badge dur-4yr">📅 Bachelor's Degree Programs</span>
            {FOUR_YEAR_COURSES.map((course) => (
              <CourseCard key={course.code} course={course} />
            ))}
          </div>
        )}

        {activeTab === 1 && (
          <div>
            <span className="dur-badge dur-2yr">⚡ Associate Programs — Start your career faster</span>
            {TWO_YEAR_COURSES.map((course) => (
              <CourseCard key={course.code} course={course} />
            ))}
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
};