import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserCircle } from 'lucide-react';
import { useAuth } from './AuthContext'; 
import './Nav.css';

const Navigation = ({ isAuthenticated }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isCalcMenuOpen, setIsCalcMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();
  
  const navigation = [
    { name: 'Home', path: '/' },
    { name: 'Expenses', path: '/expenses' },
    { name: 'Calendar', path: '/calendar'},
    { name: 'Events', path: '/events'},
    { name: 'Sticky Wall', path: '/todo'},
  ];

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="logo">
          καιρος
        </Link>
        
        <div className="nav-links">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="nav-link"
            >
              {item.name}
            </Link>
          ))}
          <div className='nav-link'>
            <div onClick={() =>setIsCalcMenuOpen(!isCalcMenuOpen)}>Calculator</div>
            {isCalcMenuOpen && (
                <div className="profile-dropdown-nav">
                  <Link to="/cgpa-calculator" className="dropdown-item-nav">
                    CGPA
                  </Link>
                  <Link to="/attendance-calculator" className="dropdown-item-nav">
                    Attendance
                  </Link>
                </div>
              )}
          </div>

          {!isAuthenticated ? (
            <Link to="/login" className="nav-link">
              Login
            </Link>
          ) : (
            <div className="profile-menu-nav">
              <button
                className="profile-button-nav"
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              >
                <UserCircle className="profile-icon-nav" />
              </button>
              
              {isProfileMenuOpen && (
                <div className="profile-dropdown-nav">
                  <Link to="/profile" className="dropdown-item-nav">
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="dropdown-item-nav"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <button
          className="mobile-menu-button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
      </div>

      <div className={`mobile-menu ${isMenuOpen ? '' : 'hidden'}`}>
        {navigation.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className="nav-link"
            onClick={() => setIsMenuOpen(false)}
          >
            {item.name}
          </Link>
        ))}
        {isAuthenticated && (
          <>
            <Link to="/profile" className="nav-link">Profile</Link>
            <button
              onClick={handleLogout}
              className="nav-link text-left w-full"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navigation;