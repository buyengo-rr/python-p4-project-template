import React, { useState, useEffect } from 'react';

// Auth.jsx
const Auth = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [selectedRole, setSelectedRole] = useState('seeker'); // Default role
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
        setIsLogin(true); // Switch to login view after registration
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
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        {!isLogin && (
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        )}
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
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


// UserProfile.jsx
const UserProfile = ({ user, toggleRole, onBack }) => {
  if (!user) {
    return (
      <div className="card">
        <h2>Profile Not Available</h2>
        <p>Please log in to view your profile.</p>
        <button onClick={onBack}>Back to Dashboard</button>
      </div>
    );
  }

  return (
    <div className="card">
      <h2 className="profile-section">Your Profile</h2>
      <div className="profile-info">
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Current Role:</strong> <span style={{ fontWeight: 'bold', color: user.role === 'seeker' ? '#1976D2' : '#4CAF50' }}>{user.role === 'seeker' ? 'Chore Seeker' : 'Chore Runner'}</span></p>
      </div>
      <div className="profile-role-toggle">
        <button
          onClick={toggleRole}
          className={user.role === 'runner' ? 'active' : ''}
        >
          Switch to Chore Runner
        </button>
        <button
          onClick={toggleRole}
          className={user.role === 'seeker' ? 'active' : ''}
        >
          Switch to Chore Seeker
        </button>
      </div>
      <button onClick={onBack} style={{ marginTop: '20px', width: '100%' }}>Back to Dashboard</button>
    </div>
  );
};


// ChoreCard.jsx
const ChoreCard = ({ chore, isRunnerView, onAccept, onTrack, onComplete, onCancel }) => {
  return (
    <div className="chore-card">
      <h3>{chore.title}</h3>
      <p><strong>Description:</strong> {chore.description}</p>
      <p><strong>Location:</strong> {chore.location}</p>
      <p><strong>Estimated Time:</strong> {chore.time}</p>
      <p><strong>Price:</strong> <span className="price">${chore.price.toFixed(2)}</span></p>
      <p><strong>Status:</strong> <span className={`status ${chore.status.replace(' ', '-')}`}>{chore.status.toUpperCase()}</span></p>

      {chore.postedByName && <p><strong>Posted By:</strong> {chore.postedByName}</p>}
      {chore.runnerName && <p><strong>Assigned To:</strong> {chore.runnerName}</p>}

      <div className="chore-card-actions">
        {isRunnerView && chore.status === 'pending' && (
          <button className="accept" onClick={() => onAccept(chore.id)}>Accept Chore</button>
        )}
        {(chore.status === 'in-progress' || (isRunnerView && chore.runnerId && chore.status === 'completed')) && (
          <button className="track" onClick={() => onTrack(chore)}>Track Chore</button>
        )}
        {isRunnerView && chore.status === 'in-progress' && (
          <button className="accept" onClick={() => onComplete(chore.id)}>Mark as Complete</button>
        )}
        {!isRunnerView && (chore.status === 'pending' || chore.status === 'in-progress') && (
          <button className="cancel" onClick={() => onCancel(chore.id)}>Cancel Chore</button>
        )}
      </div>
    </div>
  );
};


// ChoreSeekerDashboard.jsx
const ChoreSeekerDashboard = ({ user, chores, onPostChore, onTrackChore, onCancelChore }) => {
  const activeChores = chores.filter(c => c.status === 'pending' || c.status === 'in-progress');
  const completedChores = chores.filter(c => c.status === 'completed' || c.status === 'cancelled');

  return (
    <div>
      <h2>Welcome, {user.name}!</h2>
      <p style={{ textAlign: 'center', marginBottom: '25px', fontSize: '1.1rem' }}>
        Ready to outsource your errands? Post a new chore or check on your existing ones.
      </p>
      <button onClick={onPostChore} style={{ width: '100%', marginBottom: '30px' }}>Post a New Chore</button>

      <h3>My Active Chores ({activeChores.length})</h3>
      {activeChores.length === 0 ? (
        <p className="message">You have no active chores. Time to post one!</p>
      ) : (
        activeChores.map((chore) => (
          <ChoreCard
            key={chore.id}
            chore={chore}
            isRunnerView={false}
            onTrack={onTrackChore}
            onCancel={onCancelChore}
          />
        ))
      )}

      {completedChores.length > 0 && (
        <>
          <h3 style={{ marginTop: '30px' }}>Past Chores ({completedChores.length})</h3>
          {completedChores.map((chore) => (
            <ChoreCard key={chore.id} chore={chore} isRunnerView={false} />
          ))}
        </>
      )}
    </div>
  );
};


// ChoreRunnerDashboard.jsx
const ChoreRunnerDashboard = ({ user, availableChores, myAcceptedChores, acceptChore, onTrackChore, onCompleteChore, onCancelChore }) => {
  const completedChores = availableChores.filter(c => c.status === 'completed' || c.status === 'cancelled' || (c.runnerId === user.id && c.status === 'completed'));

  return (
    <div>
      <h2>Welcome, ChoreRunner {user.name}!</h2>
      <p style={{ textAlign: 'center', marginBottom: '25px', fontSize: '1.1rem' }}>
        Find chores near you and start earning!
      </p>

      <h3>My Accepted Chores ({myAcceptedChores.length})</h3>
      {myAcceptedChores.length === 0 ? (
        <p className="message">You currently have no chores in progress. Pick one from below!</p>
      ) : (
        myAcceptedChores.map((chore) => (
          <ChoreCard
            key={chore.id}
            chore={chore}
            isRunnerView={true}
            onTrack={onTrackChore}
            onComplete={onCompleteChore}
            onCancel={onCancelChore}
          />
        ))
      )}

      <h3 style={{ marginTop: '30px' }}>Available Chores ({availableChores.length})</h3>
      {availableChores.length === 0 ? (
        <p className="message">No chores available right now. Check back later!</p>
      ) : (
        availableChores.map((chore) => (
          <ChoreCard key={chore.id} chore={chore} isRunnerView={true} onAccept={acceptChore} />
        ))
      )}

      {completedChores.length > 0 && (
        <>
          <h3 style={{ marginTop: '30px' }}>Past Chores ({completedChores.length})</h3>
          {completedChores.map((chore) => (
            <ChoreCard key={chore.id} chore={chore} isRunnerView={true} />
          ))}
        </>
      )}
    </div>
  );
};


// PostChore.jsx
const PostChore = ({ onAddChore, onBack }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [time, setTime] = useState('');
  const [price, setPrice] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage('');
    setMessageType('');

    if (title === '' || description === '' || location === '' || time === '' || price === '') {
      setMessage('All fields are required.');
      setMessageType('error');
      return;
    }

    if (isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
      setMessage('Price must be a positive number.');
      setMessageType('error');
      return;
    }

    onAddChore({
      title,
      description,
      location,
      time,
      price: parseFloat(price),
    });

    setMessage('Chore posted successfully!');
    setMessageType('success');
    setTitle('');
    setDescription('');
    setLocation('');
    setTime('');
    setPrice('');
  };

  return (
    <div className="card">
      <h2>Post a New Chore</h2>
      {message && <div className={`message ${messageType}`}>{message}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Chore Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Pick up dry cleaning"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="4"
            placeholder="Provide detailed instructions for the ChoreRunner."
            required
          ></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="location">Pickup/Drop-off Location</label>
          <input
            type="text"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g., 123 Main St, Apartment 4B"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="time">Estimated Time/Deadline</label>
          <input
            type="text"
            id="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            placeholder="e.g., By 5:00 PM today"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="price">Offered Price ($)</label>
          <input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            step="0.01"
            min="0.01"
            placeholder="e.g., 15.00"
            required
          />
        </div>
        <button type="submit">Post Chore</button>
      </form>
      <button onClick={onBack} style={{ marginTop: '15px', background: '#ccc', color: '#333' }}>Back to Dashboard</button>
    </div>
  );
};


// LiveTracking.jsx
const LiveTracking = ({ chore, onBack }) => {
  const [runnerPosition, setRunnerPosition] = useState({ x: 10, y: 10 }); // Percentage of map width/height
  const [progress, setProgress] = useState(0); // 0 to 100
  const [choreStatus, setChoreStatus] = useState(chore.status);

  useEffect(() => {
    if (chore.status === 'in-progress') {
      const interval = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress >= 100) {
            clearInterval(interval);
            setChoreStatus('completed'); // Simulate completion
            return 100;
          }
          const newProgress = prevProgress + 2; // Move 2% at a time
          // Simulate movement from start (10,10) to end (90,90)
          setRunnerPosition({
            x: 10 + (newProgress * 0.8),
            y: 10 + (newProgress * 0.8),
          });
          return newProgress;
        });
      }, 500); // Update every 0.5 seconds

      return () => clearInterval(interval);
    }
  }, [chore.status]);

  if (!chore) {
    return (
      <div className="card">
        <h2>No Chore Selected for Tracking</h2>
        <button onClick={onBack}>Back to Dashboard</button>
      </div>
    );
  }

  return (
    <div className="card">
      <h2>Live Tracking: {chore.title}</h2>
      <p className="live-tracking-info">
        <strong>Chore Status:</strong> <span className={`status ${choreStatus.replace(' ', '-')}`}>{choreStatus.toUpperCase()}</span>
      </p>
      {chore.runnerName && <p className="live-tracking-info"><strong>ChoreRunner:</strong> {chore.runnerName}</p>}

      <div className="live-tracking-map">
        <div className="runner-path"></div>
        <div className="map-marker start" style={{ left: '10%', top: '10%' }}>📍</div> {/* Start Marker */}
        <div className="map-marker end" style={{ right: '10%', bottom: '10%' }}>🏁</div> {/* End Marker */}
        <div
          className="map-marker runner"
          style={{ left: `${runnerPosition.x}%`, top: `${runnerPosition.y}%` }}
        >
          🏃
        </div> {/* Runner Marker */}
      </div>

      <p className="live-tracking-info" style={{ marginTop: '20px' }}>
        Progress: {Math.round(progress)}%
      </p>

      {choreStatus === 'completed' && (
        <div className="message success" style={{ marginTop: '20px' }}>
          Chore has been completed by {chore.runnerName}!
        </div>
      )}

      <button onClick={onBack} style={{ marginTop: '20px', width: '100%' }}>Back to Dashboard</button>
    </div>
  );
};


// PaymentRating.jsx
const PaymentRating = ({ chore, onSubmitPaymentAndRating }) => {
  const [rating, setRating] = useState(0);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const handleRatingClick = (starValue) => {
    setRating(starValue);
  };

  const handleSubmit = () => {
    setMessage('');
    setMessageType('');
    if (!paymentConfirmed) {
      setMessage('Please confirm payment before submitting.');
      setMessageType('error');
      return;
    }
    onSubmitPaymentAndRating(chore.id, rating);
    setMessage('Payment and rating submitted successfully!');
    setMessageType('success');
  };

  if (!chore) {
    return (
      <div className="card">
        <h2>No Chore Selected for Payment/Rating</h2>
        <p>Please go back to the dashboard.</p>
        <button onClick={() => window.location.reload()}>Back to Dashboard</button>
      </div>
    );
  }

  return (
    <div className="card">
      <h2>Payment & Rating for: {chore.title}</h2>
      <p style={{ textAlign: 'center', fontSize: '1.1rem', marginBottom: '20px' }}>
        Chore completed by <strong>{chore.runnerName}</strong>.
      </p>

      <div style={{ marginBottom: '25px', padding: '15px', border: '1px solid var(--border-color)', borderRadius: '10px', backgroundColor: 'var(--bg-light)' }}>
        <p style={{ fontSize: '1.2rem', fontWeight: 'bold', margin: '0', textAlign: 'center' }}>
          Amount Due: <span style={{ color: "var(--primary-color)" }}>${chore.price.toFixed(2)}</span>
        </p>
      </div>

      <div className="form-group" style={{ marginBottom: '25px' }}>
        <label style={{ textAlign: 'center', display: 'block', marginBottom: '15px', fontSize: '1.1rem' }}>
          Rate your ChoreRunner ({chore.runnerName}):
        </label>
        <div className="rating-stars">
          {[1, 2, 3, 4, 5].map((starValue) => (
            <span
              key={starValue}
              className={`star ${starValue <= rating ? 'filled' : ''}`}
              onClick={() => handleRatingClick(starValue)}
            >
              ★
            </span>
          ))}
        </div>
      </div>

      <div className="form-group" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '25px' }}>
        <input
          type="checkbox"
          id="paymentConfirm"
          checked={paymentConfirmed}
          onChange={(e) => setPaymentConfirmed(e.target.checked)}
          style={{ width: '20px', height: '20px', marginRight: '10px' }}
        />
        <label htmlFor="paymentConfirm" style={{ margin: '0', fontSize: '1rem', cursor: 'pointer' }}>
          I confirm payment of ${chore.price.toFixed(2)} to {chore.runnerName}.
        </label>
      </div>

      {message && <div className={`message ${messageType}`}>{message}</div>}

      <button onClick={handleSubmit} disabled={!paymentConfirmed} style={{ width: '100%' }}>
        Submit Payment & Rating
      </button>
    </div>
  );
};


// App.jsx (main component)
const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null); // { id, name, email, role: 'seeker' | 'runner' }
  const [currentView, setCurrentView] = useState('auth'); // auth, dashboard, postChore, liveTracking, profile, paymentRating
  const [chores, setChores] = useState([]); // All chores in the system
  const [selectedChore, setSelectedChore] = useState(null); // Chore for tracking/payment

  // Simulate initial load and login check
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('choreRunUser'));
    if (storedUser) {
      setUser(storedUser);
      setLoggedIn(true);
      setCurrentView('dashboard');
    }
  }, []);

  const handleLogin = (userData) => {
    setLoggedIn(true);
    setUser(userData);
    localStorage.setItem('choreRunUser', JSON.stringify(userData));
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setUser(null);
    localStorage.removeItem('choreRunUser');
    setCurrentView('auth');
  };

  const toggleUserRole = () => {
    if (user) {
      const newRole = user.role === 'seeker' ? 'runner' : 'seeker';
      const updatedUser = { ...user, role: newRole };
      setUser(updatedUser);
      localStorage.setItem('choreRunUser', JSON.stringify(updatedUser));
      // After changing role, always go back to dashboard
      setCurrentView('dashboard');
    }
  };

  const addChore = (chore) => {
    const newChore = {
      id: Math.random().toString(36).substr(2, 9),
      ...chore,
      postedBy: user.id,
      postedByName: user.name,
      status: 'pending', // pending, in-progress, completed, cancelled
      runnerId: null,
      runnerName: null,
      rating: 0,
      paymentStatus: 'pending'
    };
    setChores((prevChores) => [...prevChores, newChore]);
    setCurrentView('dashboard');
  };

  const acceptChore = (choreId) => {
    setChores((prevChores) =>
      prevChores.map((chore) =>
        chore.id === choreId && chore.status === 'pending'
          ? { ...chore, status: 'in-progress', runnerId: user.id, runnerName: user.name }
          : chore
      )
    );
    setCurrentView('dashboard');
  };

  const startTracking = (chore) => {
    setSelectedChore(chore);
    setCurrentView('liveTracking');
  };

  const completeChore = (choreId) => {
    setChores((prevChores) =>
      prevChores.map((chore) =>
        chore.id === choreId && chore.status === 'in-progress'
          ? { ...chore, status: 'completed' }
          : chore
      )
    );
    const completedChore = chores.find(c => c.id === choreId);
    if (completedChore && completedChore.postedBy === user.id) {
        setSelectedChore(completedChore);
        setCurrentView('paymentRating');
    }
  };

  const cancelChore = (choreId) => {
    setChores((prevChores) =>
      prevChores.map((chore) =>
        chore.id === choreId && (chore.status === 'pending' || chore.status === 'in-progress')
          ? { ...chore, status: 'cancelled' }
          : chore
      )
    );
    setCurrentView('dashboard');
  };

  const submitPaymentAndRating = (choreId, rating) => {
    setChores((prevChores) =>
      prevChores.map((chore) =>
        chore.id === choreId
          ? { ...chore, paymentStatus: 'paid', rating: rating }
          : chore
      )
    );
    setSelectedChore(null);
    setCurrentView('dashboard');
  };

  const getFilteredChores = () => {
    if (!user) return [];
    if (user.role === 'seeker') {
      return chores.filter((chore) => chore.postedBy === user.id);
    } else { // runner
      return chores.filter((chore) => chore.status === 'pending' || chore.runnerId === user.id);
    }
  };

  const renderContent = () => {
    if (!loggedIn) {
      return <Auth onLogin={handleLogin} />;
    }

    switch (currentView) {
      case 'dashboard':
        return user.role === 'seeker' ? (
          <ChoreSeekerDashboard
            user={user}
            chores={getFilteredChores()}
            onPostChore={() => setCurrentView('postChore')}
            onTrackChore={startTracking}
            onCancelChore={cancelChore}
          />
        ) : (
          <ChoreRunnerDashboard
            user={user}
            availableChores={chores.filter(c => c.status === 'pending' && c.postedBy !== user.id)}
            myAcceptedChores={chores.filter(c => c.runnerId === user.id && c.status === 'in-progress')}
            acceptChore={acceptChore}
            onTrackChore={startTracking}
            onCompleteChore={completeChore}
            onCancelChore={cancelChore}
          />
        );
      case 'postChore':
        return <PostChore onAddChore={addChore} onBack={() => setCurrentView('dashboard')} />;
      case 'liveTracking':
        return <LiveTracking chore={selectedChore} onBack={() => setCurrentView('dashboard')} />;
      case 'profile':
        return <UserProfile user={user} toggleRole={toggleUserRole} onBack={() => setCurrentView('dashboard')} />;
      case 'paymentRating':
        return <PaymentRating chore={selectedChore} onSubmitPaymentAndRating={submitPaymentAndRating} />;
      default:
        return null;
    }
  };

  return (
    <>
      {loggedIn && (
        <header className="header">
          <h1>ChoreRun</h1>
          <div className="header-buttons">
            <button onClick={() => setCurrentView('dashboard')}>Dashboard</button>
            <button onClick={() => setCurrentView('profile')}>Profile</button>
            <button onClick={handleLogout}>Logout</button>
          </div>
        </header>
      )}
      <main className="container">
        {renderContent()}
      </main>
    </>
  );
};

export default App;
