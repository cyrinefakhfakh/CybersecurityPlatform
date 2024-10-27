import { Link } from 'react-router-dom';
import './Navbar.css'; 
import { FaHome, FaBook, FaClipboardList, FaUser } from 'react-icons/fa'; // Icônes

function Navbar() {
  return (
    <nav className="navbar">
      <h1 className="navbar-title">CyberSec Platform</h1>
      <div className="links">
        <Link to="/" className="nav-link">
          <FaHome className="icon" /> Home
        </Link>
        <Link to="/courses" className="nav-link">
          <FaBook className="icon" /> Courses
        </Link>
        <Link to="/tests" className="nav-link">
          <FaClipboardList className="icon" /> Tests
        </Link>
        <Link to="/profile" className="nav-link">
          <FaUser className="icon" /> Profile
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
