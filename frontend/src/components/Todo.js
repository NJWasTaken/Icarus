import React, { useState } from 'react';
import Navigation from './contexts/Nav.js';
import { useAuth } from './contexts/AuthContext';
import './css/Todo.css';

const Todo = () => {
  const { user } = useAuth();
  const [notes, setNotes] = useState([]);
  const [newNoteText, setNewNoteText] = useState('');
  const [newNoteColor, setNewNoteColor] = useState('#D88C9A');
  const [newNoteCategory, setNewNoteCategory] = useState('Upcoming');
  const [filter, setFilter] = useState('All');
  const [warning, setWarning] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleAddNote = () => {
    if (newNoteText.trim() === '') {
      setWarning('Note text cannot be empty.');
      return;
    }

    if (newNoteText.length > 50) {
      setWarning('Note text cannot exceed 50 characters.');
      return;
    }

    const newNote = {
      id: Date.now(),
      text: newNoteText,
      category: newNoteCategory,
      color: newNoteColor,
    };

    setNotes(prevNotes => [...prevNotes, newNote]);
    resetNoteForm();
  };

  const resetNoteForm = () => {
    setNewNoteText('');
    setNewNoteColor('#D88C9A');
    setNewNoteCategory('Upcoming');
    setWarning('');
  };

  const handleDeleteNote = (id) => {
    setNotes(prevNotes => prevNotes.filter(note => note.id !== id));
  };

  const filteredNotes = filter === 'All' 
    ? notes 
    : notes.filter(note => note.category === filter);

  return (
    <div className='page-container'>
    <Navigation isAuthenticated={!!user} />
    <div className="todo-container">
      
      
      <div className="sidebar" style={{ width: isCollapsed ? '60px' : '250px' }}>
        <button 
          className="toggle-sidebar-button"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? '☰' : '←'}
        </button>
        {!isCollapsed && (
          <div className="sidebar-content">
            {/* Sidebar content can be added here */}
          </div>
        )}
      </div>

      <div className="sticky-wall">
        <div className="add-note-form">
          <input
            type="text"
            value={newNoteText}
            onChange={(e) => {
              const text = e.target.value;
              if (text.length <= 50) {
                setNewNoteText(text);
                setWarning('');
              } else {
                setWarning('Note text cannot exceed 50 characters.');
              }
            }}
            placeholder="Add a note (max 50 characters)"
            className="add-note-input"
          />
          <select
            value={newNoteCategory}
            onChange={(e) => setNewNoteCategory(e.target.value)}
            className="add-note-category"
          >
            <option value="Upcoming">Upcoming</option>
            <option value="Today">Today</option>
            <option value="Calendar">Calendar</option>
          </select>
          <input
            type="color"
            value={newNoteColor}
            onChange={(e) => setNewNoteColor(e.target.value)}
            className="add-note-color-input"
          />
          <button 
            onClick={handleAddNote} 
            className="add-note-button"
          >
            Add Note
          </button>
        </div>

        {warning && <div className="warning-message">{warning}</div>}

        <div className="filter-buttons">
          {['All', 'Upcoming', 'Today', 'Calendar'].map(category => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={filter === category ? 'active-filter' : 'filter-button'}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="sticky-grid">
          {filteredNotes.map(note => (
            <div 
              key={note.id} 
              className="sticky-note" 
              style={{ backgroundColor: note.color }}
            >
              <div className="note-text">{note.text}</div>
              <button 
                className="delete-button"
                onClick={() => handleDeleteNote(note.id)}
              >
                ❌
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
    </div>
  );
};

export default Todo;