// src/components/Navbar.js
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import './Navbar.css';

function Navbar({ isAuthenticated }) {
  const [isMobile, setIsMobile] = useState(false);

  const toggleMenu = () => setIsMobile(!isMobile);

  return (
    <nav className="navbar">
      <h1 className="navbar-title">CyberSec</h1>
      <div className={`links ${isMobile ? 'mobile' : ''}`}>
        <Link to="/" className="nav-link" onClick={toggleMenu}>Home</Link>
        <Link to="/courses" className="nav-link" onClick={toggleMenu}>Courses</Link>
        <Link to="/tests" className="nav-link" onClick={toggleMenu}>Tests</Link>
        <Link to="/profile" className="nav-link" onClick={toggleMenu}>Profile</Link>
      </div>
      <button className="menu-icon" onClick={toggleMenu}>
        {isMobile ? <FaTimes /> : <FaBars />}
      </button>
      {!isAuthenticated && <Link to="/signup" className="signup-button">Sign Up</Link>}
    </nav>
  );
}

export default Navbar;
