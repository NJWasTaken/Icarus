import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Homepage from './components/Homepage.js';
import Login from './components/Login.js';
import ExpenseTracker from './components/ExpenseTracker.js';
import Calendar from './components/Calendar.js';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/expenses" element={<ExpenseTracker />} />
                <Route path="/calendar" element={<Calendar />} />
            </Routes>
        </Router>
    );
};

export default App;
