import React, { useState } from "react";
import { Navbar, Nav, Container, Modal, Button } from "react-bootstrap";
import { LogOut, AlertTriangle, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import LOGO from "../../assets/logoCCDI.png";
import "./NavigationBar.css";

function NavigationBar() {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogoutClick = (e: any) => {
    e.preventDefault();
    setShowLogoutModal(true);
  };

  const handleConfirmLogout = () => {
    logout();
    setShowLogoutModal(false);
    navigate("/signup");
  };

  const handleHome = () => {
    navigate("/welcome");
  };

  const handleCancelLogout = () => {
    setShowLogoutModal(false);
  };

  return (
    <>
      <Navbar variant="dark" expand="lg" fixed="top" className="custom-navbar">
        <Container fluid>
          <Navbar.Brand
            href="#home"
            onClick={handleHome}
            className="d-flex align-items-center"
            
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
              <span className="fw-bold fs-3">CCDI</span>
              <span className="fw-light fs-5 font-poppins font-semibold">
                Career Assessment Test
              </span>
            </div>
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />

          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto d-flex align-items-center">
              <Nav.Link
                href="#home"
                className="fw-semibold fs-5 mx-3 nav-link-custom"
              >
                Courses
              </Nav.Link>
              <Nav.Link
                href="#about"
                className="fw-semibold fs-5 mx-3 nav-link-custom"
              >
                About
              </Nav.Link>
              <Nav.Link
                href="#contact"
                className="fw-semibold fs-5 mx-3 nav-link-custom"
              >
                Contact
              </Nav.Link>

              {isAuthenticated && (
                <Nav.Link
                  as={Button}
                  onClick={handleLogoutClick}
                  className="logout-link fw-semibold fs-5 mx-3"
                >
                  <LogOut size={18} className="me-1" />
                  Log Out
                </Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Enhanced Logout Modal */}
      <Modal
        show={showLogoutModal}
        onHide={handleCancelLogout}
        centered
        className="logout-modal"
      >
        <Modal.Header className="border-0 pb-0 position-relative">
          <div className="warning-icon-container mx-auto mb-3">
            <div className="warning-icon-bg">
              <AlertTriangle size={32} className="warning-icon" />
            </div>
          </div>
          <Button
            variant="link"
            onClick={handleCancelLogout}
            className="position-absolute top-0 end-0 p-2 close-btn"
          >
            <X size={20} />
          </Button>
        </Modal.Header>

        <Modal.Body className="text-center pt-0">
          <h4 className="fw-bold text-dark mb-3">Wait! Are you sure?</h4>
          <p className="text-muted mb-4">
            You're in the middle of a Test! You're about to log out of your
            account.
          </p>

          <div className="d-flex flex-column flex-sm-row justify-content-center gap-3">
            <Button
              variant="outline-secondary"
              onClick={handleCancelLogout}
              className="flex-fill cancel-btn"
              size="lg"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleConfirmLogout}
              className="flex-fill confirm-btn"
              size="lg"
            >
              Yes, Log Out
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      <div style={{ height: "76px" }}></div>
    </>
  );
}

export default NavigationBar;
