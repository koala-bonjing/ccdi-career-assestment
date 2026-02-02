import { useState } from "react";
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
import LOGO from "../../assets/logoCCDI.png";
import "./NavigationBar.css";
import { LogoutModal } from "../ui/modals/logout-modal";
import { StorageEncryptor } from "../ResultPage/utils/encryption";

function NavigationBar() {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

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
      <Navbar variant="dark" expand="lg" fixed="top" className="custom-navbar">
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
                src={LOGO}
                alt="CCDI Logo"
                width="70"
                height="70"
                className="me-2"
                style={{ objectFit: "contain" }}
              />

              <div className="d-flex flex-column">
                <span className="fw-bold fs-5 fs-md-4 fs-lg-3 text-nowrap">
                  CCDI
                </span>
                <span
                  className="fw-light text-nowrap "
                  style={{
                    fontSize: "clamp(0.7rem, 2.5vw, 1rem)",
                    lineHeight: 1.2,
                    fontWeight: 400,
                  }}
                >
                  Career Assessment Test
                </span>
              </div>
            </Navbar.Brand>
          </OverlayTrigger>

          <Navbar.Toggle aria-controls="basic-navbar-nav" className="ms-auto" />

          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto d-flex align-items-center">
              <Nav.Link
                href="#home"
                className="fw-semibold fs-5 mx-2 mx-md-3 nav-link-custom"
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

      <div style={{ height: "76px" }}></div>
    </>
  );
}

export default NavigationBar;
