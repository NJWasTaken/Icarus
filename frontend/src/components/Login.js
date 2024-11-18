// LoginForm.js
import React, { useState } from 'react';
import './LoginForm.css';

const Login = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return React.createElement('div', { className: 'login-container' },
    React.createElement('div', { className: 'login-form' }, [
      React.createElement('h1', { key: 'title' }, 'Welcome back, Login below'),
      React.createElement('p', { 
        key: 'register',
        className: 'register-link' 
      }, 'Not Registered? Create New Account'),
      
      React.createElement('form', { 
        key: 'form',
        onSubmit: handleSubmit 
      }, [
        // Name Field
        React.createElement('div', { 
          key: 'name-group',
          className: 'form-group' 
        }, [
          React.createElement('label', { 
            key: 'name-label',
            htmlFor: 'name' 
          }, 'NAME'),
          React.createElement('input', {
            key: 'name-input',
            type: 'text',
            id: 'name',
            name: 'name',
            value: formData.name,
            onChange: handleChange
          })
        ]),

        // Email Field
        React.createElement('div', { 
          key: 'email-group',
          className: 'form-group' 
        }, [
          React.createElement('label', { 
            key: 'email-label',
            htmlFor: 'email' 
          }, 'EMAIL'),
          React.createElement('input', {
            key: 'email-input',
            type: 'email',
            id: 'email',
            name: 'email',
            value: formData.email,
            onChange: handleChange
          })
        ]),

        // Password Field
        React.createElement('div', { 
          key: 'password-group',
          className: 'form-group' 
        }, [
          React.createElement('label', { 
            key: 'password-label',
            htmlFor: 'password' 
          }, 'PASSWORD'),
          React.createElement('input', {
            key: 'password-input',
            type: 'password',
            id: 'password',
            name: 'password',
            value: formData.password,
            onChange: handleChange
          })
        ]),

        // Submit Button
        React.createElement('button', {
          key: 'submit-button',
          type: 'submit',
          className: 'login-button'
        }, 'LOG IN')
      ])
    ])
  );
};

export default Login;