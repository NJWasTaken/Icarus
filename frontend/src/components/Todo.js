import React, { useState } from 'react';

const Sidebar = ({ setFilter }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return React.createElement('div', { className: `sidebar ${isCollapsed ? 'collapsed' : ''}` }, [
    React.createElement('button', {
      key: 'toggle-sidebar',
      className: 'toggle-sidebar-button',
      onClick: toggleSidebar,
    }, isCollapsed ? '☰' : '←'),
    !isCollapsed && React.createElement('div', { key: 'menu-content' }, [
      React.createElement('h2', { key: 'menu-title', className: 'sidebar-title' }, 'MENU'),
      React.createElement('div', { key: 'filter', className: 'sidebar-section' }, [
        
        React.createElement('ul', { className: 'sidebar-list' }, [
          
        ]),
      ]),
    ]),
  ]);
};

const StickyWall = () => {
  const [notes, setNotes] = useState([
    { id: 0, text: 'Note 1', category: 'Upcoming', color: '#D88C9A' },
    { id: 1, text: 'Note 2', category: 'Today', color: '#E8C1C1' },
    { id: 2, text: 'Note 3', category: 'Calendar', color: '#D88C9A' },
  ]);

  const [newNoteText, setNewNoteText] = useState('');
  const [newNoteColor, setNewNoteColor] = useState('#D88C9A');
  const [newNoteCategory, setNewNoteCategory] = useState('Upcoming');
  const [filter, setFilter] = useState('All');
  const [warning, setWarning] = useState('');
  const [recentlyDeleted, setRecentlyDeleted] = useState(null);

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

    setNotes((prevNotes) => [...prevNotes, newNote]);
    setNewNoteText('');
    setNewNoteColor('#D88C9A');
    setNewNoteCategory('Upcoming');
    setWarning('');
  };

  const handleTextChange = (e) => {
    const text = e.target.value;

    if (text.length > 50) {
      setWarning('Note text cannot exceed 50 characters.');
    } else {
      setWarning('');
    }

    setNewNoteText(text);
  };

  const handleDeleteNote = (id) => {
    const noteToDelete = notes.find((note) => note.id === id);
    setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
    setRecentlyDeleted(noteToDelete);
  };

  const handleUndoDelete = () => {
    if (recentlyDeleted) {
      setNotes((prevNotes) => [...prevNotes, recentlyDeleted]);
      setRecentlyDeleted(null);
    }
  };

  const filteredNotes = filter === 'All' ? notes : notes.filter((note) => note.category === filter);

  return React.createElement('div', { className: 'sticky-wall' }, [
    React.createElement('div', { key: 'add-note', className: 'add-note-form' }, [
      React.createElement('input', {
        key: 'note-text-input',
        type: 'text',
        value: newNoteText,
        onChange: handleTextChange,
        placeholder: 'Add text (max 50 characters)...',
        maxLength: 50,
        className: 'add-note-input',
      }),
      warning && React.createElement('div', { key: 'warning', className: 'warning-message' }, warning),
      React.createElement('select', {
        key: 'note-category-input',
        value: newNoteCategory,
        onChange: (e) => setNewNoteCategory(e.target.value),
        className: 'add-note-category',
      }, [
        React.createElement('option', { key: 'upcoming', value: 'Upcoming' }, 'Upcoming'),
        React.createElement('option', { key: 'today', value: 'Today' }, 'Today'),
        React.createElement('option', { key: 'calendar', value: 'Calendar' }, 'Calendar'),
      ]),
      React.createElement('input', {
        key: 'note-color-input',
        type: 'color',
        value: newNoteColor,
        onChange: (e) => setNewNoteColor(e.target.value),
        className: 'add-note-color-input',
      }),
      React.createElement('button', {
        key: 'add-note-button',
        onClick: handleAddNote,
        className: 'add-note-button',
      }, 'Add Note'),

      recentlyDeleted &&
        React.createElement('button', {
          key: 'undo-button',
          onClick: handleUndoDelete,
          className: 'undo-button',
        }, 'Undo'),
    ]),

    React.createElement('div', { key: 'filter-buttons', className: 'filter-buttons' }, [
      React.createElement('button', {
        key: 'filter-all',
        onClick: () => setFilter('All'),
        className: filter === 'All' ? 'active-filter' : 'filter-button',
      }, 'Show All'),
      React.createElement('button', {
        key: 'filter-upcoming',
        onClick: () => setFilter('Upcoming'),
        className: filter === 'Upcoming' ? 'active-filter' : 'filter-button',
      }, 'Upcoming'),
      React.createElement('button', {
        key: 'filter-today',
        onClick: () => setFilter('Today'),
        className: filter === 'Today' ? 'active-filter' : 'filter-button',
      }, 'Today'),
      React.createElement('button', {
        key: 'filter-calendar',
        onClick: () => setFilter('Calendar'),
        className: filter === 'Calendar' ? 'active-filter' : 'filter-button',
      }, 'Calendar'),
    ]),

    React.createElement('div', { key: 'grid', className: 'sticky-grid' },
      filteredNotes.map((note) =>
        React.createElement('div', {
          key: note.id,
          className: 'sticky-note',
          style: { backgroundColor: note.color },
        }, [
          React.createElement('div', { key: `text-${note.id}`, className: 'note-text' }, note.text),
          React.createElement('button', {
            key: `delete-${note.id}`,
            className: 'delete-button',
            onClick: () => handleDeleteNote(note.id),
          }, '❌'),
        ])
      )
    ),
  ]);
};



const Todo = () => {
  return React.createElement('div', { className: 'app' }, [
    React.createElement(Sidebar, { key: 'sidebar' }),
    React.createElement('div', { key: 'main', className: 'main-content' }, [
      React.createElement(StickyWall, { key: 'sticky-wall' }),
    ]),
  ]);
};

export default Todo;
