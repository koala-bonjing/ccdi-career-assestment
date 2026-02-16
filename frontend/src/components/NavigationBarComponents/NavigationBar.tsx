  import { useEffect, useState } from "react";
  import { LogOut, Menu, X } from "lucide-react";
  import { useAuth } from "../../context/AuthContext";
  import { useNavigate } from "react-router-dom";
  import LOGO from "../../assets/ccdi_banner1.png";
  import LOGO_Alt from "../../assets/logoCCDI.png";
  import "./NavigationBar.css";
  import { LogoutModal } from "../ui/modals/logout-modal";
  import { StorageEncryptor } from "../ResultPage/utils/encryption";

  function NavigationBar() {
    const [showLogoutModal, setShowLogoutModal] = useState(false);
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



    const toggleMenu = () => {
      setIsMenuOpen(!isMenuOpen);
    };

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
                src={isMobile ? LOGO_Alt : LOGO}
                alt="CCDI Logo"
                className="navbar-logo"
              />
            </div>

            {/* Desktop Navigation */}
            <div className="navbar-links desktop-only">
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
