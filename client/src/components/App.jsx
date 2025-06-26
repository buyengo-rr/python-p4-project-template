
import React, { useState, useEffect } from 'react'; 

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

    setTimeout(() => {
      if (isLogin) {
        if (username === 'testuser' && password === 'password') {
          onLogin({ id: 'user123', name: username, email: 'test@example.com', role: 'seeker' });
        } else if (username === 'runner' && password === 'password') {
          onLogin({ id: 'runner123', name: username, email: 'runner@example.com', role: 'runner' });
        } else {
          setMessage('Invalid username or password.');
          setMessageType('error');
        }
      } else {
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

  return (
    <div className="card">
      <h2>{isLogin ? 'Login to ChoreRun' : 'Register for ChoreRun'}</h2>
      {message && <div className={`message ${messageType}`}>{message}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        {!isLogin && (
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
        )}
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        {!isLogin && (
          <div className="form-group">
            <label htmlFor="role">I want to be a:</label>
            <select id="role" value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)}>
              <option value="seeker">Chore Seeker (need errands done)</option>
              <option value="runner">Chore Runner (offer errand services)</option>
            </select>
          </div>
        )}
        <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
      </form>
      <p style={{ textAlign: 'center', marginTop: '20px' }}>
        {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
        <button
          onClick={() => setIsLogin(!isLogin)}
          style={{ background: 'none', color: '#6a0dad', padding: '0', textDecoration: 'underline', boxShadow: 'none' }}
        >
          {isLogin ? 'Register here' : 'Login here'}
        </button>
      </p>
    </div>
  );
};
