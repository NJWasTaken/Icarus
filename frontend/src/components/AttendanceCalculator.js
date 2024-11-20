import React, { useState } from 'react';
import Navigation from './contexts/Nav.js';
import { useAuth } from './contexts/AuthContext';
import './css/AttendanceCalculator.css';

const AttendanceCalculator = () => {
  const [subjects, setSubjects] = useState([{ name: '', totalClasses: '', attendedClasses: '' }]);
  const [attendanceResult, setAttendanceResult] = useState(null);
  const [error, setError] = useState('');
  const { user } = useAuth();

  const addSubjectRow = () => {
    setSubjects([...subjects, { name: '', totalClasses: '', attendedClasses: '' }]);
  };

  const updateSubject = (index, field, value) => {
    const newSubjects = [...subjects];
    newSubjects[index][field] = value;
    setSubjects(newSubjects);
  };

  const calculateAttendance = () => {
    setError('');
    
    const invalidInput = subjects.some(subject => 
      subject.name === '' || 
      subject.totalClasses === '' || 
      subject.attendedClasses === '' || 
      parseInt(subject.totalClasses) <= 0 || 
      parseInt(subject.attendedClasses) < 0 ||
      parseInt(subject.attendedClasses) > parseInt(subject.totalClasses)
    );

    if (invalidInput) {
      setError('Please enter valid subject details');
      return;
    }

    const attendanceDetails = subjects.map(subject => ({
      name: subject.name,
      percentage: ((parseInt(subject.attendedClasses) / parseInt(subject.totalClasses)) * 100).toFixed(2)
    }));

    const overallAttendance = (
      attendanceDetails.reduce((sum, subject) => sum + parseFloat(subject.percentage), 0) / 
      attendanceDetails.length
    ).toFixed(2);

    setAttendanceResult({ 
      subjectWise: attendanceDetails, 
      overall: overallAttendance 
    });
  };

  return (
    <div className="page-container">
      <Navigation 
        isAuthenticated={!!user}
      />
      <div className="attendance-body">
        <div className="attendance-container">
          <h1>Attendance Calculator</h1>
          
          {subjects.map((subject, index) => (
            <div key={index} className="subject-row">
              <input 
                type="text" 
                placeholder="Subject Name" 
                value={subject.name}
                onChange={(e) => updateSubject(index, 'name', e.target.value)}
              />
              <input 
                type="number" 
                placeholder="Total Classes" 
                value={subject.totalClasses}
                onChange={(e) => updateSubject(index, 'totalClasses', e.target.value)}
                min="1"
              />
              <input 
                type="number" 
                placeholder="Attended Classes" 
                value={subject.attendedClasses}
                onChange={(e) => updateSubject(index, 'attendedClasses', e.target.value)}
                min="0"
              />
            </div>
          ))}

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="button-container">
            <button 
              onClick={addSubjectRow} 
              className="add-subject-btn"
            >
              Add Subject
            </button>
            <button 
              onClick={calculateAttendance} 
              className="calculate-btn"
            >
              Calculate Attendance
            </button>
          </div>

          {attendanceResult && (
            <div className="result-container">
              <h2>Attendance Results</h2>
              <div className="subject-results">
                {attendanceResult.subjectWise.map((subject, index) => (
                  <div key={index} className="subject-attendance">
                    <span>{subject.name}: </span>
                    <span>{subject.percentage}%</span>
                  </div>
                ))}
              </div>
              <div className="overall-attendance">
                <h3>Overall Attendance</h3>
                <p className="attendance-result">{attendanceResult.overall}%</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendanceCalculator;