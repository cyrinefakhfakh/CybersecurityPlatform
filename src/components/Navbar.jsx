import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import logo from '../assets/logo.png';

function Navbar({ isAuthenticated, isAdmin, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    onLogout(); // Update authentication state
    navigate('/login'); // Redirect to login page
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        <img src={logo} alt="CyberSec Logo" className="logo" />
      </Link>
      <div className="links">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/courses" className="nav-link">Courses</Link>
        <Link to="/tests" className="nav-link">Tests</Link>
        <Link to="/profile" className="nav-link">Profile</Link>
        {isAdmin && (
          <>
            <Link to="/admin" className="nav-link">Dashboard</Link>
            <Link to="/admin/courses/add" className="nav-link">Add Course</Link>
          </>
        )}
      </div>
      {isAuthenticated ? (
        <button onClick={handleLogout} className="nav-link logout-button">Logout</button>
      ) : (
        <Link to="/signup" className="signup-button">Sign Up</Link>
      )}
    </nav>
  );
}

export default Navbar;