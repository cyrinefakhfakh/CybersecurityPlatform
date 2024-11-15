import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from './Button';
import './Navbar.css';

function Navbar({ isAuthenticated, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    onLogout(); // Update authentication state
    navigate('/login'); // Redirect to login page
  };

  return (
    <nav className="navbar">
      <h1 className="navbar-title">CyberSec</h1>
      <div className="links">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/courses" className="nav-link">Courses</Link>
        <Link to="/tests" className="nav-link">Tests</Link>
        <Link to="/profile" className="nav-link">Profile</Link>
        
      </div>
      {isAuthenticated ? (
          <button onClick={handleLogout} className="nav-link logout-button">Logout</button>
        ) : (
          <>
            <Link to="/signup" className="signup-button">Sign Up</Link>
         
          </>
        )}
    </nav>
  );
}

export default Navbar;