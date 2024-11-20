import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navigation from './contexts/Nav.js';
import { useAuth } from './contexts/AuthContext';
import './css/Todo.css';

const Todo = () => {
  const [notes, setNotes] = useState([]);
  const [newNoteText, setNewNoteText] = useState('');
  const [newNoteColor, setNewNoteColor] = useState('#D88C9A');
  const [newNoteCategory, setNewNoteCategory] = useState('Upcoming');
  const [filter, setFilter] = useState('All');
  const [warning, setWarning] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user } = useAuth();

  // Fetch todos on component mount
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/todo');
        setNotes(response.data.data);
      } catch (error) {
        console.error('Error fetching todos:', error);
      }
    };
    fetchTodos();
  }, []);

  const handleAddNote = async () => {
    if (newNoteText.trim() === '') {
      setWarning('Note text cannot be empty.');
      return;
    }

    if (newNoteText.length > 50) {
      setWarning('Note text cannot exceed 50 characters.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/todo', {
        note: newNoteText,
        category: newNoteCategory,
        hexcolor: newNoteColor
      });

      setNotes(prevNotes => [...prevNotes, response.data.data]);
      resetNoteForm();
    } catch (error) {
      console.error('Error adding todo:', error);
      setWarning('Failed to add note. Please try again.');
    }
  };

  const resetNoteForm = () => {
    setNewNoteText('');
    setNewNoteColor('#D88C9A');
    setNewNoteCategory('Upcoming');
    setWarning('');
  };

  const handleDeleteNote = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/todo/${id}`);
      setNotes(prevNotes => prevNotes.filter(note => note._id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const filteredNotes = filter === 'All' 
    ? notes 
    : notes.filter(note => note.category === filter);

  return (
    <div className='page-container'>
      <Navigation 
      isAuthenticated={!!user}
      userEmail={user?.email}/>
      <div className="todo-container">
        <div className="sidebar" style={{ width: isCollapsed ? '40px' : '100px' }}>
          <button 
            className="toggle-sidebar-button"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? '☰' : '←'}
          </button>
          {!isCollapsed && (
            <div className="sidebar-content">
              <div className="sidebar-filters">
                {['All', 'Upcoming', 'Today', 'Note'].map(category => (
                  <button
                    key={category}
                    onClick={() => setFilter(category)}
                    className={filter === category ? 'active-filter' : 'filter-button'}
                  >
                    {category}
                  </button>
                ))}
              </div>
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
              <option value="Note">Note</option>
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

          <div className="sticky-grid">
            {filteredNotes.map(note => (
              <div 
                key={note._id} 
                className="sticky-note" 
                style={{ backgroundColor: note.hexcolor }}
              >
                <div className="note-text">{note.note}</div>
                <button 
                  className="delete-button"
                  onClick={() => handleDeleteNote(note._id)}
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