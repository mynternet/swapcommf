import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav, Container, Modal, Tab, NavDropdown } from "react-bootstrap";
import { FaUserCircle, FaHome, FaInfoCircle, FaEnvelope, FaHistory, FaExchangeAlt } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import SignupForm from "./SignupForm";
import LoginForm from "./LoginForm";
import Auth from "../utils/auth";

const AppNavBar = () => {
  const [showModal, setShowModal] = useState(false);
  const [username, setUsername] = useState("");
  const { i18n } = useTranslation();

  useEffect(() => {
    if (Auth.loggedIn()) {
      const profile = Auth.getProfile();
      setUsername(profile.data.username);
    }
  }, []);

  return (
    <>
      <Navbar variant="light" className="color-nav" expand="lg">
        <Container fluid>
          <Navbar.Brand as={Link} to="/">
            <img src="/logo-no-background.png" width="64" alt="Swapcomm Logo" />
            &nbsp; <span className="site-title">Swapcomm</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbar" />
          <Navbar.Collapse id="navbar">
            <Nav className="ml-auto">
              <Nav.Link as={Link} className="nav-text" to="/">
                <FaHome /> Home
              </Nav.Link>
              <Nav.Link as={Link} className="nav-text" to="/about">
                <FaInfoCircle /> About
              </Nav.Link>
              <Nav.Link as={Link} className="nav-text" to="/contact">
                <FaEnvelope /> Contact
              </Nav.Link>
              {Auth.loggedIn() ? (
                <>
                  <Nav.Link as={Link} className="nav-text" to="/swap-history">
                    <FaHistory /> Swap History
                  </Nav.Link>
                  <Nav.Link as={Link} className="nav-text" to="/created">
                    <FaExchangeAlt /> My Items to Swap
                  </Nav.Link>
                  <Nav.Item className="nav-text mx-3">
                    <FaUserCircle /> &nbsp; Welcome, {username}
                  </Nav.Item>
                  <Nav.Link className="nav-text" onClick={Auth.logout}>
                    Logout
                  </Nav.Link>
                </>
              ) : (
                <Nav.Link
                  className="nav-text"
                  onClick={() => setShowModal(true)}
                >
                  Login/Sign Up
                </Nav.Link>
              )}
              
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Modal
        size="lg"
        show={showModal}
        onHide={() => setShowModal(false)}
        aria-labelledby="signup-modal"
      >
        <Tab.Container defaultActiveKey="login">
          <Modal.Header closeButton>
            <Modal.Title id="signup-modal">
              <Nav variant="pills">
                <Nav.Item>
                  <Nav.Link eventKey="login">Login</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="signup">Sign Up</Nav.Link>
                </Nav.Item>
              </Nav>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Tab.Content>
              <Tab.Pane eventKey="login">
                <LoginForm handleModalClose={() => setShowModal(false)} />
              </Tab.Pane>
              <Tab.Pane eventKey="signup">
                <SignupForm handleModalClose={() => setShowModal(false)} />
              </Tab.Pane>
            </Tab.Content>
          </Modal.Body>
        </Tab.Container>
      </Modal>
    </>
  );
};

export default AppNavBar;
