import { useEffect, useState } from "react";
import { LogOut, Menu, X, BookOpen } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import LOGO from "../../assets/Group 1.png";
import "./NavigationBar.css";
import { LogoutModal } from "../ui/modals/logout-modal";
import { StorageEncryptor } from "../ResultPage/utils/encryption";

// Course Data
const FOUR_YEAR_COURSES = [
  {
    code: "BSCS",
    name: "Bachelor of Science in Computer Science",
    description: "Focuses on theoretical foundations of computing, algorithms, data structures, and software engineering.",
    characteristics: "Heavy on mathematics, logic, algorithmic thinking, and advanced programming paradigms.",
    primaryJob: "Software Developer, Systems Analyst, Data Scientist",
    secondaryJobs: "AI/ML Engineer, Research Scientist, Technical Consultant"
  },
  {
    code: "BSIT",
    name: "Bachelor of Science in Information Technology",
    description: "Emphasizes practical application of technology in business, networking, and IT infrastructure.",
    characteristics: "Hands-on with web development, database management, cloud services, and system administration.",
    primaryJob: "IT Specialist, Network Administrator, Web Developer",
    secondaryJobs: "Cybersecurity Analyst, Cloud Support Engineer, Technical Support Manager"
  },
  {
    code: "BSIS",
    name: "Bachelor of Science in Information Systems",
    description: "Bridges business processes and information technology, focusing on system analysis and data management.",
    characteristics: "Combines IT skills with business acumen, project management, ERP, and database architecture.",
    primaryJob: "Business/Systems Analyst, IT Project Manager, Database Administrator",
    secondaryJobs: "Data Analyst, ERP Consultant, Quality Assurance Specialist"
  },
  {
    code: "BSEE",
    name: "BS Electrical Engineering",
    description: "Deals with the study and application of electricity, electronics, power systems, and electromagnetism.",
    characteristics: "Strong foundation in physics, circuit analysis, control systems, and power distribution.",
    primaryJob: "Electrical Engineer, Power Systems Engineer, Control Systems Engineer",
    secondaryJobs: "Project Engineer, Renewable Energy Specialist, HVAC Designer"
  },
  {
    code: "BSECE",
    name: "BS Electronics Engineering",
    description: "Focuses on electronic devices, circuits, communication systems, and embedded technologies.",
    characteristics: "Hands-on with hardware design, signal processing, telecommunications, and microcontrollers.",
    primaryJob: "Electronics Engineer, Hardware Design Engineer, Telecommunications Engineer",
    secondaryJobs: "Embedded Systems Developer, RF Engineer, Test & Measurement Specialist"
  }
];

const TWO_YEAR_COURSES = [
  {
    code: "ACT-Programming",
    name: "Associate in Computer Technology - Programming",
    description: "Intensive training in software development, coding practices, and application building.",
    characteristics: "Project-based learning, focus on modern languages (Python, JS, Java), and agile workflows.",
    primaryJob: "Junior Software Developer, Web Developer, QA Tester",
    secondaryJobs: "Technical Support, Freelance Developer, IT Trainer"
  },
  {
    code: "ACT-Networking",
    name: "Associate in Computer Technology - Networking",
    description: "Focuses on computer networks, infrastructure setup, security, and system administration.",
    characteristics: "Hands-on lab work, certification alignment (CCNA, CompTIA), and troubleshooting skills.",
    primaryJob: "Network Technician, IT Support Specialist, System Administrator",
    secondaryJobs: "Cybersecurity Analyst, Cloud Support Associate, NOC Technician"
  },
  {
    code: "ACT-Multimedia & Animation",
    name: "Associate in Computer Technology - Multimedia & Animation",
    description: "Covers digital content creation, 2D/3D animation, graphic design, and video production.",
    characteristics: "Creative + technical blend, software proficiency (Adobe, Blender, Maya), portfolio-driven.",
    primaryJob: "Multimedia Artist, Animator, Graphic Designer",
    secondaryJobs: "Video Editor, UI/UX Designer, Content Creator, Game Asset Designer"
  }
];

function NavigationBar() {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 992);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = showCourseModal ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [showCourseModal]);

  const handleLogoutClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowLogoutModal(true);
    setIsMenuOpen(false);
  };

  const handleConfirmLogout = () => {
    logout();
    setShowLogoutModal(false);
    StorageEncryptor.removeItem("user");
    StorageEncryptor.removeItem("assessmentResults");
    StorageEncryptor.removeItem("assessment-result");
    StorageEncryptor.removeItem("evaluation-storage");
    navigate("/signup");
  };

  const handleHome = () => {
    navigate("/welcome");
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const CourseCard = ({ course }: { course: typeof FOUR_YEAR_COURSES[0] }) => (
    <div className="course-card">
      <div className="course-header">
        <span className="course-code">{course.code}</span>
        <h4 className="course-title">{course.name}</h4>
      </div>
      <p className="course-desc">{course.description}</p>
      <div className="course-details">
        <div className="detail-item">
          <strong>Characteristics:</strong>
          <p>{course.characteristics}</p>
        </div>
        <div className="detail-item">
          <strong>Primary Jobs:</strong>
          <p>{course.primaryJob}</p>
        </div>
        <div className="detail-item">
          <strong>Secondary Jobs:</strong>
          <p>{course.secondaryJobs}</p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <nav className="custom-navbar">
        <div className="navbar-container">
          <div
            className="navbar-brand"
            onClick={handleHome}
            title="Click to go to Home"
          >
            <img
              src={LOGO}
              alt="CCDI Logo"
              className="navbar-logo"
              style={isMobile ? { height: "36px", width: "auto", maxWidth: "280px" } : undefined}
            />
          </div>

          {/* Desktop Navigation */}
          <div className="navbar-links desktop-only">
            <button className="nav-tab-button" onClick={() => setShowCourseModal(true)}>
              <BookOpen size={18} />
              <span>Courses</span>
            </button>
            {isAuthenticated && (
              <button className="logout-button" onClick={handleLogoutClick}>
                <LogOut size={18} />
                <span>Log Out</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button className="menu-toggle mobile-only" onClick={toggleMenu}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="mobile-menu">
            <button
              className="mobile-nav-tab-button"
              onClick={() => {
                setShowCourseModal(true);
                setIsMenuOpen(false);
              }}
            >
              <BookOpen size={18} />
              <span>Courses</span>
            </button>
            {isAuthenticated && (
              <button
                className="mobile-logout-button"
                onClick={handleLogoutClick}
              >
                <LogOut size={18} />
                <span>Log Out</span>
              </button>
            )}
          </div>
        )}
      </nav>

      {/* Course Modal */}
      {showCourseModal && (
        <div className="course-modal-overlay" onClick={() => setShowCourseModal(false)}>
          <div className="course-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setShowCourseModal(false)}>
              <X size={24} />
            </button>
            <h2 className="modal-title">Academic Programs</h2>
            
            <div className="modal-section">
              <h3>4-Year Degree Programs</h3>
              <div className="course-grid">
                {FOUR_YEAR_COURSES.map((course) => (
                  <CourseCard key={course.code} course={course} />
                ))}
              </div>
            </div>

            <div className="modal-section">
              <h3>2-Year Associate Programs</h3>
              <div className="course-grid">
                {TWO_YEAR_COURSES.map((course) => (
                  <CourseCard key={course.code} course={course} />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <LogoutModal
        show={showLogoutModal}
        onHide={() => setShowLogoutModal(false)}
        onConfirm={handleConfirmLogout}
      />

      <div className="navbar-spacer"></div>
    </>
  );
}

export default NavigationBar;