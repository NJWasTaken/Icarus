import React, { useState } from 'react';
import Navigation from './contexts/Nav.js';
import { useAuth } from './contexts/AuthContext';
import './css/CGPACalculator.css';

const CGPACalculator = () => {
  const [courses, setCourses] = useState([{ credits: '', grade: '' }]);
  const [cgpa, setCGPA] = useState(null);
  const [error, setError] = useState('');
  const { user } = useAuth();

  const gradePoints = {
    'S': 10, 'A': 9, 'B': 8, 'C': 7, 
    'D': 6, 'E': 5, 'F': 0
  };    

  const addCourseRow = () => {
    setCourses([...courses, { credits: '', grade: '' }]);
  };

  const updateCourse = (index, field, value) => {
    const newCourses = [...courses];
    newCourses[index][field] = value;
    setCourses(newCourses);
  };

  const calculateCGPA = () => {
    setError('');
    
    const invalidInput = courses.some(course => 
      course.credits === '' || 
      course.grade === '' || 
      parseFloat(course.credits) <= 0 || 
      !gradePoints.hasOwnProperty(course.grade)
    );

    if (invalidInput) {
      setError('Please enter valid credits and grades');
      return;
    }

    const totalCredits = courses.reduce((sum, course) => sum + parseFloat(course.credits), 0);
    const totalGradePoints = courses.reduce((sum, course) => 
      sum + (parseFloat(course.credits) * gradePoints[course.grade]), 0);

    const calculatedCGPA = (totalGradePoints / totalCredits).toFixed(2);
    setCGPA(calculatedCGPA);
  };

  return (
    <div className="page-container">
      <Navigation 
        isAuthenticated={!!user}
      />
      <div className="cgpa-body">
        <div className="cgpa-container">
          <h1>CGPA Calculator</h1>
          
          {courses.map((course, index) => (
            <div key={index} className="course-row">
              <input 
                type="number" 
                placeholder="Credits" 
                value={course.credits}
                onChange={(e) => updateCourse(index, 'credits', e.target.value)}
                min="0"
              />
              <select 
                value={course.grade}
                onChange={(e) => updateCourse(index, 'grade', e.target.value)}
              >
                <option value="">Select Grade</option>
                {Object.keys(gradePoints).map(grade => (
                  <option key={grade} value={grade}>{grade}</option>
                ))}
              </select>
            </div>
          ))}

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="button-container">
            <button 
              onClick={addCourseRow} 
              className="add-course-btn"
            >
              Add Course
            </button>
            <button 
              onClick={calculateCGPA} 
              className="calculate-btn"
            >
              Calculate CGPA
            </button>
          </div>

          {cgpa !== null && (
            <div className="result-container">
              <h2>Your CGPA</h2>
              <p className="cgpa-result">{cgpa}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CGPACalculator;