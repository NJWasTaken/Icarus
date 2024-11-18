
import React, { useState } from 'react';
import './Calendar.css';

const Calendar = () => {
  const weekDays = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const [selectedMonth, setSelectedMonth] = useState('October');

  // Events organized by month
  const eventsByMonth = {
    October: [
      { day: 2, name: 'Hackathon' },
      { day: 11, name: 'WF Assignment' },
      { day: 12, name: 'Holiday' },
      { day: 24, name: 'Exam' },
      { day: 27, name: 'Concert' }
    ],
    November: [
      { day: 5, name: 'Meeting' },
      { day: 15, name: 'Project Due' },
    ],
    December: [
      { day: 20, name: 'Holiday Party' },
      { day: 25, name: 'Christmas' },
    ]
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const getEventForDay = (day) => {
    const events = eventsByMonth[selectedMonth] || [];
    return events.find(event => event.day === day);
  };

  const renderCalendarDays = () => {
    const totalDays = 35; // 5 weeks * 7 days
    const days = [];

    for (let i = 1; i <= totalDays; i++) {
      const event = getEventForDay(i);
      days.push(
        <div 
          key={i} 
          className={`calendar-cell ${event ? 'event-cell' : ''}`}
        >
          {event && (
            <div className="event-text">
              {event.name}
            </div>
          )}
        </div>
      );
    }
    return days;
  };

  return (
    <div className="calendar-container">
      <h1 className="calendar-title">Calendar</h1>
      
      <div className="month-selector">
        <select 
          value={selectedMonth} 
          onChange={handleMonthChange}
          className="month-dropdown"
        >
          {months.map(month => (
            <option key={month} value={month}>
              {month} 2024
            </option>
          ))}
        </select>
      </div>
      
      <div className="calendar-grid">
        {/* Header row */}
        {weekDays.map(day => (
          <div 
            key={day} 
            className="header-cell"
          >
            {day}
          </div>
        ))}
        
        {/* Calendar days */}
        {renderCalendarDays()}
      </div>
    </div>
  );
};

export default Calendar;