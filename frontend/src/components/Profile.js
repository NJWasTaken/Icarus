import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from './contexts/AuthContext';
import Navigation from './contexts/Nav.js';
import './css/Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const { user, login } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    dob: '',
    bio: '',
    email: ''
  });
  const [originalData, setOriginalData] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (user) {
      const userData = {
        name: user.name || '',
        phone: user.phone || '',
        dob: user.dob ? new Date(user.dob).toISOString().split('T')[0] : '',
        bio: user.bio || '',
        email: user.email || ''
      };
      setFormData(userData);
      setOriginalData(userData);
    } else {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const changedFields = {};
      Object.keys(formData).forEach(key => {
        if (formData[key] !== originalData[key]) {
          changedFields[key] = formData[key];
        }
      });

      const response = await axios.patch(`http://localhost:5000/api/accounts/${user.id}`, changedFields);
      if (response.data.success) {
        login(response.data.data);
        setOriginalData(formData);
        setIsEditing(false);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Update failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

//   async (e) => {
//     e.preventDefault();
//     try {
//     const response = await axios.put(`http://localhost:5000/api/expenses/${editingExpense._id}`, editingExpense);
//     if (response.data.success) {
//         setExpenses(expenses.map(exp => 
//         exp._id === editingExpense._id ? response.data.data : exp
//         ));
//         setEditingExpense(null);
//     }
//     } catch (error) {
//     console.error('Error updating expense:', error);
//     setError('Failed to update expense');
//     }
// };

  const handleCancel = () => {
    setFormData(originalData);
    setIsEditing(false);
    setError('');
  };

  const hasChanges = JSON.stringify(formData) !== JSON.stringify(originalData);

  return (
    <div className="page-container">
      <Navigation isAuthenticated={!!user} />
      
      <main className="main-content">
        <section className="hero-section">
          <h1 className="hero-title">Your Profile</h1>
          
          <div className="profile1-form-container">
            {error && <div className="profile1-error-message">{error}</div>}
            
            <form onSubmit={handleSubmit} className="profile1-form">
              <div className="profile1-form-group">
                <label className="profile1-form-label">NAME</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={!isEditing || loading}
                  className="profile1-form-input"
                  required
                />
              </div>

              <div className="profile1-form-group">
                <label className="profile1-form-label">EMAIL</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled
                  className="profile1-form-input"
                />
              </div>

              <div className="profile1-form-group">
                <label className="profile1-form-label">PHONE</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={!isEditing || loading}
                  className="profile1-form-input"
                  required
                />
              </div>

              <div className="profile1-form-group">
                <label className="profile1-form-label">DATE OF BIRTH</label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  disabled={!isEditing || loading}
                  className="profile1-form-input"
                  required
                />
              </div>

              <div className="profile1-form-group">
                <label className="profile1-form-label">BIO</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  disabled={!isEditing || loading}
                  className="profile1-form-textarea"
                  placeholder="Tell us about yourself"
                />
              </div>

              <div className="profile1-actions">
                {!isEditing ? (
                  <button 
                    type="button" 
                    className="profile1-button1"
                    onClick={() => setIsEditing(true)}
                  >
                    EDIT PROFILE
                  </button>
                ) : (
                  <>
                    <button 
                      type="submit" 
                      className="profile1-button1"
                      disabled={loading || !hasChanges}
                    >
                      {loading ? 'SAVING...' : 'SAVE CHANGES'}
                    </button>
                    <button 
                      type="button" 
                      className="profile1-button cancel-button"
                      onClick={handleCancel}
                    >
                      CANCEL
                    </button>
                  </>
                )}
              </div>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Profile;