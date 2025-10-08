import React, { useState } from "react";
import { Navbar, Nav, Container, Modal, Button } from 'react-bootstrap';
import { LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

function NavigationBar() {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogoutClick = (e) => {
    e.preventDefault(); // This is crucial: it stops the link from navigating
    setShowLogoutModal(true);
  };

  const handleConfirmLogout = () => {
    logout(); // Perform your logout logic
    setShowLogoutModal(false); // Close the modal
    navigate("/signup"); // Redirect after logout
  };

  const handleCancelLogout = () => {
    setShowLogoutModal(false); // Simply close the modal
  };

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg" fixed="top">
        <Container fluid>
          <Navbar.Brand href="#home" className="d-flex align-items-center">
            <span className="fw-bold fs-4">CCDI</span>
            <span className="fw-light fs-6 ms-2 mt-1">Career Assessment</span>
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="#home">Courses</Nav.Link>
              <Nav.Link href="#about">About</Nav.Link>
              <Nav.Link href="#contact">Contact</Nav.Link>
            </Nav>
            <Nav className="ms-auto">
              {isAuthenticated && (
                // Use a Nav.Link as a button to trigger the modal
                <Nav.Link as={Button} onClick={handleLogoutClick} className="logout-link">
                  <LogOut size={16} className="me-1" />
                  Log Out
                </Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Bootstrap Modal for Logout Confirmation */}
      <Modal show={showLogoutModal} onHide={handleCancelLogout} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Logout</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to log out? Any unsaved progress will be lost.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancelLogout}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleConfirmLogout}>
            Log Out
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Spacer to prevent content from being hidden under fixed nav */}
      <div style={{ height: '76px' }}></div>
    </>
  );
}

export default NavigationBar;