import { useEffect, useState } from "react";
import { LogOut, Menu, X, BookOpen, Info } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import LOGO from "../../assets/Group 1.png";
import "./NavigationBar.css";
import { LogoutModal } from "../ui/modals/logout-modal";
import { StorageEncryptor } from "../ResultPage/utils/encryption";
import { AboutModal } from "../ui/modals/about-modal";
import { CoursesModal } from "../ui/modals/courses-modal";

function NavigationBar() {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showCoursesModal, setShowCoursesModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
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

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

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
              style={isMobile ? { height: "40px", width: "auto", maxWidth: "280px" } : undefined}
            />
          </div>

          {/* Desktop Navigation */}
          <div className="navbar-links desktop-only">
            <button
              className="nav-tab-button"
              onClick={() => setShowAboutModal(true)}
            >
              <Info size={18} />
              <span>About</span>
            </button>
            <button
              className="nav-tab-button"
              onClick={() => setShowCoursesModal(true)}
            >
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
                setShowAboutModal(true);
                setIsMenuOpen(false);
              }}
            >
              <Info size={18} />
              <span>About</span>
            </button>
            <button
              className="mobile-nav-tab-button"
              onClick={() => {
                setShowCoursesModal(true);
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

      <AboutModal
        show={showAboutModal}
        onHide={() => setShowAboutModal(false)}
      />

      <CoursesModal
        show={showCoursesModal}
        onHide={() => setShowCoursesModal(false)}
      />

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