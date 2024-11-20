import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Trash2, ChevronDown } from 'lucide-react';
import Navigation from './contexts/Nav';
import { useAuth } from './contexts/AuthContext';
import "./css/Event.css"

const Events = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newEvent, setNewEvent] = useState({ 
        name: '', 
        description: '', 
        tag: 'Announcement', // Default value
        date: '' 
    });
    const [selectedTag, setSelectedTag] = useState('All');
    const { user } = useAuth();

    // Predefined tag options
    const EVENT_TAGS = ['Announcement', 'Club Event', 'Academic', 'Co-Curricular'];

    // Fetch events
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await axios.get('http://localhost:5000/api/events');
                if (response.data.success) {
                    const sortedEvents = response.data.data.sort((a, b) => new Date(b.date) - new Date(a.date));
                    setEvents(sortedEvents);
                } else {
                    setError('Failed to fetch events');
                }
            } catch (error) {
                console.error('Error fetching events:', error);
                setError(error.message || 'Failed to fetch events');
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    const tagOptions = ['All', ...EVENT_TAGS];
    
    // Filter events by selected tag
    const filteredEvents = selectedTag === 'All' 
        ? events 
        : events.filter(event => event.tag === selectedTag);

    // Add new event
    const handleAddEvent = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/events', newEvent);
            if (response.data.success) {
                setEvents([response.data.data, ...events]);
                setNewEvent({ 
                    name: '', 
                    description: '', 
                    tag: 'Announcement', 
                    date: '' 
                });
            }
        } catch (error) {
            console.error('Error adding event:', error);
            setError('Failed to add event');
        }
    };

    // Delete event
    const handleDeleteEvent = async (id) => {
        try {
            const response = await axios.delete(`http://localhost:5000/api/events/${id}`);
            if (response.data.success) {
                setEvents(events.filter(evt => evt._id !== id));
            }
        } catch (error) {
            console.error('Error deleting event:', error);
            setError('Failed to delete event');
        }
    };

    return (
        <div className="page-container">
            {loading && (
                <div className="loading-spinner">
                    <div className="spinner"></div>
                    <p>Loading events...</p>
                </div>
            )}
            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}
        
            <Navigation 
                isAuthenticated={!!user} 
                userEmail={user?.email}
            />

            <div className="event-tracker-container">
                <h1 className="event-tracker-title">Community Events</h1>

                {/* Tag Filter Dropdown */}
                <div className="tag-filter-container">
                    <div className="tag-filter-select">
                        <select
                            value={selectedTag}
                            onChange={(e) => setSelectedTag(e.target.value)}
                            className="tag-dropdown"
                        >
                            {tagOptions.map((tag) => (
                                <option key={tag} value={tag}>
                                    {tag}
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="dropdown-icon" />
                    </div>
                </div>

                {/* Add Event Form */}
                <form onSubmit={handleAddEvent} className="event-form">
                    <div className="event-form-fields">
                        <input
                            type="text"
                            placeholder="Event Name"
                            value={newEvent.name}
                            onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
                            className="event-input"
                            required
                        />
                        <div className="tag-select-container">
                            <select
                                value={newEvent.tag}
                                onChange={(e) => setNewEvent({ ...newEvent, tag: e.target.value })}
                                className="event-input tag-select"
                                required
                            >
                                {EVENT_TAGS.map((tag) => (
                                    <option key={tag} value={tag}>
                                        {tag}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="dropdown-icon" />
                        </div>
                        <input
                            type="date"
                            value={newEvent.date}
                            onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                            className="event-input"
                            required
                        />
                        <textarea
                            placeholder="Event Description"
                            value={newEvent.description}
                            onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                            className="event-input event-description1"
                            required
                        />
                    </div>
                    <button type="submit" className="event-form-button">
                        + Post Event
                    </button>
                </form>

                {/* Events List */}
                {events.length === 0 ? (
                    <div className="no-events-container">
                        <p className="no-events">
                            No events found. Be the first to post an event!
                        </p>
                    </div>
                ) : (
                    <ul className="event-list1">
                        {filteredEvents.map((event) => (
                            <li key={event._id} className="event-item">
                                <div className="event-details">
                                    <div className="event-header">
                                        <span className="event-name">{event.name}</span>
                                        <span className="event-tag">{event.tag}</span>
                                    </div>
                                    <p className="event2-description-text">{event.description}</p>
                                    <span className="event-date">
                                        {new Date(event.date).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="event-actions">
                                    <button
                                        onClick={() => handleDeleteEvent(event._id)}
                                        className="event-action event-delete"
                                        title="Delete Event"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default Events;