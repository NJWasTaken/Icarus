import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Homepage.css';

const Homepage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const navigation = [
    { name: 'Home', path: '/' },
    { name: 'Expenses', path: '/expenses' },
    { name: 'Login', path: '/login' },
    { name: 'Calendar', path: '/calendar'},
    { name: 'Events', path: '/events'},
    { name: 'Sticky Wall', path: '/todo'}
  ];

  const features = [
    {
      title: "Track Expenses",
      description: "Log and categorize your daily expenses with ease."
    },
    {
      title: "Get it Together",
      description: "Organize your life by prioritizing your tasks and keeping reminders."
    },
    {
      title: "What's New?",
      description: "Check the announcements page for announcements about the latest events."
    },
    {
      title: "Looking Ahead",
      description: "Plan what's next by updating your calendar and always looking at the big picture."
    },
    {
      title: "Identify Yourself",
      description: "Manage your own personal profile and keep track of yourself throughout your student life."
    },
  ];

  return (
    <div className="page-container">
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
        </div>
      </nav>

      <main className="main-content">
        <section className="hero-section">
          <h1 className="hero-title">
            Welcome to Kyros
          </h1>
          <p className="hero-description">
            Keep track of your student life with a to-do list, calendar planner, expense tracker and more.
          </p>
          <Link to="/login" className="get-started-btn">
            Get Started
          </Link>
        </section>

        <div className="features-grid">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="feature-card"
              style={{ animationDelay: `${0.2 * index}s`, alignSelf: 'center'}}
            >
              <h2 className="feature-title">{feature.title}</h2>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Homepage;