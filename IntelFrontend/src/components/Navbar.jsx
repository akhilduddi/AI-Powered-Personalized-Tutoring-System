import { useState } from 'react';
import { Link } from 'react-router-dom';
import './../styles/navbar.css';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Brand/Logo */}
        <div className="navbar-brand">
          <Link to="/" className="brand-link">
            <span className="brand-icon">🎓</span>
            <span className="brand-text">SkillSync</span>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button className="mobile-menu-button" onClick={toggleMenu} aria-label="Toggle menu">
          <span className={menuOpen ? "menu-icon open" : "menu-icon"}></span>
        </button>

        {/* Navigation Links */}
        <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          <div className="nav-left">
            <Link to="/" className="nav-link" onClick={toggleMenu}>Home</Link>
            <Link to="/courses" className="nav-link" onClick={toggleMenu}>Courses</Link>
            <Link to="/discover-yourself" className="nav-link" onClick={toggleMenu}>Discover Yourself</Link>
            <Link to="/dashboard" className="nav-link" onClick={toggleMenu}>Dashboard</Link>
            <Link to="/testQuestions" className="nav-link" onClick={toggleMenu}>Test</Link>
            <Link to="/supreme" className="nav-link" onClick={toggleMenu}>supreme</Link>
            <Link to="/materials" className="nav-link" onClick={toggleMenu}>Material</Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;