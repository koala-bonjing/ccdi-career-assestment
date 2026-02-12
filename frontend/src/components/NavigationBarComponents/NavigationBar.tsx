import { useEffect, useState } from "react";
// 1. Added OverlayTrigger and Tooltip to imports
import {
  Navbar,
  Nav,
  Container,
  Button,
  OverlayTrigger,
  Tooltip,
  type TooltipProps,
} from "react-bootstrap";
import { LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import LOGO from "../../assets/ccdi_banner1.png";
import LOGO_Alt from "../../assets/logoCCDI.png"
import "./NavigationBar.css";
import { LogoutModal } from "../ui/modals/logout-modal";
import { StorageEncryptor } from "../ResultPage/utils/encryption";

function NavigationBar() {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 992);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleLogoutClick = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setShowLogoutModal(true);
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
  };

  // 2. Define the Tooltip component
  const renderHomeTooltip = (props: TooltipProps) => (
    <Tooltip id="home-tooltip" {...props}>
      ← Click to go to Home
    </Tooltip>
  );

  return (
    <>
      <Navbar variant="dark" expand="sm" fixed="top" className="custom-navbar">
        <Container fluid>
          {/* 3. Wrap Navbar.Brand with OverlayTrigger */}
          <OverlayTrigger
            placement="bottom"
            delay={{ show: 250, hide: 400 }}
            overlay={renderHomeTooltip}
          >
            <Navbar.Brand
              href="#home"
              onClick={handleHome}
              className="d-flex align-items-center"
              style={{ cursor: "pointer" }}
            >
              <img
                src={isMobile ? LOGO_Alt : LOGO}
                alt="CCDI Logo"
                width={isMobile ? 50 : 500}
                height={isMobile ? 50 : 80}
                className="d-inline-block align-top"
                style={{
                  objectFit: "contain",
                  margin: "0",
                }}


  
              />
            </Navbar.Brand>
          </OverlayTrigger>

          <Navbar.Toggle aria-controls="basic-navbar-nav" className="ms-auto" />

          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto d-flex align-items-center">
              <Nav.Link
                href="#home"
                className="fw-semibold fs-6 mx-2 mx-md-3 nav-link-custom"
              >
                Courses
              </Nav.Link>
              <Nav.Link
                href="#about"
                className="fw-semibold fs-5 mx-2 mx-md-3 nav-link-custom"
              >
                About
              </Nav.Link>
              <Nav.Link
                href="#contact"
                className="fw-semibold fs-5 mx-2 mx-md-3 nav-link-custom"
              >
                Contact
              </Nav.Link>

              {isAuthenticated && (
                <Nav.Link
                  as={Button}
                  onClick={handleLogoutClick}
                  className="logout-link fw-semibold fs-5 mx-2 mx-md-3"
                >
                  <LogOut size={18} className="me-1" />
                  Log Out
                </Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <LogoutModal
        show={showLogoutModal}
        onHide={() => setShowLogoutModal(false)}
        onConfirm={handleConfirmLogout}
      />

      <div style={{ height: "40px" }}></div>
    </>
  );
}

export default NavigationBar;