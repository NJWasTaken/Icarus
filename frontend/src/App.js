import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Homepage from './components/Homepage.js';
import Login from './components/Login.js';
import ExpenseTracker from './components/ExpenseTracker.js';
import Calendar from './components/Calendar.js';
import Todo from './components/Todo.js';
import Register from './components/Register.js';
import { AuthProvider } from './components/contexts/AuthContext.js';
import Profile from './components/Profile.js';
import Events from './components/Events.js';
import AttendanceCalculator from './components/AttendanceCalculator.js';
import CGPACalculator from './components/CGPACalculator.js';

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Homepage />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/expenses" element={<ExpenseTracker />} />
                    <Route path="/calendar" element={<Calendar />} />
                    <Route path='/todo' element={<Todo />} />
                    <Route path="/register" element={<Register />} />
                    <Route path='/profile' element={<Profile />} />
                    <Route path='/events' element={<Events />} />
                    <Route path='/cgpa-calculator' element={<CGPACalculator />} />
                    <Route path='/attendance-calculator' element={<AttendanceCalculator />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default App;
