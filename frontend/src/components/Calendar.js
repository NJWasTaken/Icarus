import React, { useState, useEffect } from 'react';
import Navigation from './contexts/Nav.js';
import { useAuth } from './contexts/AuthContext';
import './css/Calendar.css';

const Calendar = () => {
  const { user } = useAuth();

  const weekDays = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [eventsByMonth, setEventsByMonth] = useState({});

  useEffect(() => {
    // Fetch events from backend or local storage
    const fetchEvents = async () => {
      try {
        // Replace with actual API call or local storage retrieval
        const mockEvents = {
          October: [
            { day: 2, name: 'Hackathon', type: 'academic' },
            { day: 11, name: 'WF Assignment', type: 'deadline' },
            { day: 12, name: 'Holiday', type: 'personal' },
            { day: 24, name: 'Exam', type: 'academic' },
            { day: 27, name: 'Concert', type: 'personal' }
          ],
          // Add more months and events
        };
        setEventsByMonth(mockEvents);
      } catch (error) {
        console.error('Failed to fetch events', error);
      }
    };

    fetchEvents();
  }, []);

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
  };

  const handleMonthChange = (event) => {
    const [month, year] = event.target.value.split('-');
    setSelectedMonth(parseInt(month));
    setSelectedYear(parseInt(year));
  };

  const getEventForDay = (day) => {
    const monthName = months[selectedMonth];
    const events = eventsByMonth[monthName] || [];
    return events.find(event => event.day === day);
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
    const firstDay = getFirstDayOfMonth(selectedMonth, selectedYear);
    const days = [];

    // Add padding days before the first day of the month
    for (let i = 0; i < (firstDay === 0 ? 6 : firstDay - 1); i++) {
      days.push(<div key={`padding-${i}`} className="calendar-cell"></div>);
    }

    // Add actual days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      const event = getEventForDay(i);
      days.push(
        <div 
          key={i} 
          className={`calendar-cell ${event ? `event-cell event-${event.type}` : ''}`}
        >
          <div className="event-text">
            {i}
            {event && <span>{event.name}</span>}
          </div>
        </div>
      );
    }

    return days;
  };

  return (
    <div className="page-container">
    <Navigation 
        isAuthenticated={!!user}
      />
    <div className="calendar-container">
      <h1 className="calendar-title">Calendar</h1>
      
      <div className="month-selector">
        <select 
          value={`${selectedMonth}-${selectedYear}`} 
          onChange={handleMonthChange}
          className="month-dropdown"
        >
          {months.map((month, index) => (
            <option 
              key={month} 
              value={`${index}-${selectedYear}`}
            >
              {month} {selectedYear}
            </option>
          ))}
        </select>
      </div>
      
      <div className="calendar-grid">
        {weekDays.map(day => (
          <div 
            key={day} 
            className="header-cell"
          >
            {day}
          </div>
        ))}
        
        {renderCalendarDays()}
      </div>
    </div>
    </div>
  );
};

export default Calendar;