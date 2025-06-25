import React, { useState } from 'react';

const Auth = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [selectedRole, setSelectedRole] = useState('seeker');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage('');
    setMessageType('');

    if (username === '' || password === '') {
      setMessage('Username and password cannot be empty.');
      setMessageType('error');
      return;
    }

    if (!isLogin && email === '') {
      setMessage('Email cannot be empty for registration.');
      setMessageType('error');
      return;
    }

    // Simulate API call for login/signup
    setTimeout(() => {
      if (isLogin) {
        // Simple mock login logic
        if (username === 'testuser' && password === 'password') {
          onLogin({ id: 'user123', name: username, email: 'test@example.com', role: 'seeker' });
        } else if (username === 'runner' && password === 'password') {
          onLogin({ id: 'runner123', name: username, email: 'runner@example.com', role: 'runner' });
        } else {
          setMessage('Invalid username or password.');
          setMessageType('error');
        }
      } else {
        // Simulate successful registration
        setMessage('Registration successful! Please log in.');
        setMessageType('success');
        setUsername('');
        setPassword('');
        setEmail('');
        setIsLogin(true);
        onLogin({ id: Math.random().toString(36).substr(2, 9), name: username, email: email, role: selectedRole });
      }
    }, 500);
  };

  