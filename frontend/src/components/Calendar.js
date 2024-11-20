import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X } from 'lucide-react';
import Navigation from './contexts/Nav.js';
import { useAuth } from './contexts/AuthContext';
import './css/Calendar.css';

const Calendar = () => {
  const { user } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState({});
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    type: 'reminder',
    date: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isAddingEvent, setIsAddingEvent] = useState(false);

  const weekDays = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());

  const EVENT_TYPES = ['reminder', 'deadline', 'regular'];
  const TYPE_COLORS = {
    reminder: 'event1-reminder',
    deadline: 'event1-deadline',
    regular: 'event1-regular'
  };

  useEffect(() => {
    fetchEvents();
  }, [selectedMonth, selectedYear]);

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      const response = await axios.get('http://localhost:5000/api/calendar');
      if (response.data.success) {
        const eventsByDate = response.data.data.reduce((acc, event) => {
          const dateKey = new Date(event.date).toISOString().split('T')[0];
          if (!acc[dateKey]) {
            acc[dateKey] = [];
          }
          acc[dateKey].push(event);
          return acc;
        }, {});
        setEvents(eventsByDate);
      }
    } catch (error) {
      console.error('Failed to fetch events', error);
      setErrorMessage('Failed to fetch events');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();
    try {
      const eventData = {
        name: newEvent.title,
        description: newEvent.description,
        type: newEvent.type,
        date: selectedDate
      };
  
      const response = await axios.post('http://localhost:5000/api/calendar', eventData);
  
      if (response.data.success) {
        const dateKey = selectedDate;
        setEvents(prev => ({
          ...prev,
          [dateKey]: [...(prev[dateKey] || []), response.data.data]
        }));
        
        setIsAddingEvent(false);
        setNewEvent({
          title: '',
          description: '',
          type: 'reminder',
          date: ''
        });
      }
    } catch (error) {
      console.error('Error adding event:', error);
      setErrorMessage('Failed to add event: ' + (error.response?.data?.message || error.message));
    }
  };  

  const handleDeleteEvent = async (eventId, dateKey, e) => {
    e.stopPropagation();
    try {
      const response = await axios.delete(`http://localhost:5000/api/calendar/${eventId}`);
      if (response.data.success) {
        setEvents(prev => ({
          ...prev,
          [dateKey]: prev[dateKey].filter(event => event._id !== eventId)
        }));
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      setErrorMessage('Failed to delete event');
    }
  };

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month, year) => {
    const firstDay = new Date(year, month, 1).getDay();
    return firstDay === 0 ? 6 : firstDay - 1;
  };

  const handleMonthChange = (event) => {
    const [month, year] = event.target.value.split('-');
    setSelectedMonth(parseInt(month));
    setSelectedYear(parseInt(year));
  };

  const handleDateClick = (day) => {
    const dateString = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSelectedDate(dateString);
    setIsDialogOpen(true);
    setIsAddingEvent(false);
  };

  const renderEventDots = (dayEvents) => {
    const eventTypes = [...new Set(dayEvents.map((event) => event.type))];
    return (
      <div className="event-dots">
        {eventTypes.map((type, index) => (
          <div key={index} className={`event-dot ${TYPE_COLORS[type]}`} />
        ))}
      </div>
    );
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
    const firstDay = getFirstDayOfMonth(selectedMonth, selectedYear);
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`padding-${i}`} className="calendar-cell"></div>);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const dateString = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      const dayEvents = events[dateString] || [];
      
      days.push(
        <div 
          key={i} 
          onClick={() => handleDateClick(i)}
          className="calendar-cell"
        >
          <div className="date-content">
            <span className="date-number">{i}</span>
            {dayEvents.length > 0 && renderEventDots(dayEvents)}
          </div>
        </div>
      );
    }

    return days;
  };

  const renderEventList = () => {
    const dateEvents = events[selectedDate] || [];
    return (
      <div className="event-list">
        {dateEvents.map((event) => (
          <div 
            key={event._id} 
            className={`event-item ${TYPE_COLORS[event.type]}`}
          >
            <div className="event-item-header">
              <h3>{event.title}</h3>
              <button
                onClick={(e) => handleDeleteEvent(event._id, selectedDate, e)}
                className="delete-event1"
              >
                <X size={16} />
              </button>
            </div>
            <p className="event-description">{event.description}</p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="page-container">
      <Navigation isAuthenticated={!!user} />
      
      <div className="calendar-container">
        <h1 className="calendar-title">Calendar</h1>
        
        {errorMessage && (
          <div className="error-message">
            {errorMessage}
          </div>
        )}

        {isLoading && (
          <div className="loading-message">
            Loading events...
          </div>
        )}
        
        <div className="month-selector">
          <select 
            value={`${selectedMonth}-${selectedYear}`} 
            onChange={handleMonthChange}
            className="month-dropdown"
          >
            {months.map((month, index) => (
              <option key={month} value={`${index}-${selectedYear}`}>
                {month} {selectedYear}
              </option>
            ))}
          </select>
        </div>
        
        <div className="calendar-grid">
          {weekDays.map(day => (
            <div key={day} className="header-cell">{day}</div>
          ))}
          {renderCalendarDays()}
        </div>

        {isDialogOpen && (
          <div className="modal-overlay" onClick={() => setIsDialogOpen(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Events for {selectedDate}</h2>
                <button 
                  className="modal-close"
                  onClick={() => setIsDialogOpen(false)}
                >
                  <X size={20} />
                </button>
              </div>
              
              {!isAddingEvent ? (
                <div className="modal-body">
                  {renderEventList()}
                  <button 
                    className="add-event-button"
                    onClick={() => setIsAddingEvent(true)}
                  >
                    Add New Event
                  </button>
                </div>
              ) : (
                <form onSubmit={handleAddEvent} className="event1-form">
                  <div className="event1-form-fields">
                    <input
                      type="text"
                      placeholder="Event Name"
                      value={newEvent.title}
                      onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                      className="event1-input"
                      required
                    />
                    <textarea
                      placeholder="Event Description"
                      value={newEvent.description}
                      onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                      className="event1-input event1-description"
                      rows="3"
                    />
                    <select
                      value={newEvent.type}
                      onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
                      className="event1-select"
                      required
                    >
                      {EVENT_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-buttons">
                    <button 
                      type="button" 
                      className="cancel-button"
                      onClick={() => setIsAddingEvent(false)}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="event1-form-button">
                      Add Event
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Calendar;