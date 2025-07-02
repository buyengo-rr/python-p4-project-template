import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import PostChore from './components/PostChore';
import BrowseChores from './components/BrowseChores';
import Profile from './components/Profile';
import TrackingPage from './components/TrackingPage';

function App() {
  const [user, setUser] = useState(null);
  const [chores, setChores] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Separate function to fetch chores
  const fetchChores = useCallback(async (userToken = null) => {
    try {
      const headers = {
        'Content-Type': 'application/json',
      };
      
      if (userToken) {
        headers.Authorization = `Bearer ${userToken}`;
      }

      const response = await fetch('/api/chores', { headers });

      if (!response.ok) {
        throw new Error(`Failed to fetch chores: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setChores(data);
      setError(null); // Clear any previous errors
    } catch (err) {
      console.error('Error fetching chores:', err);
      setError(err.message);
      setChores([]); // Reset chores on error
    }
  }, []);

  // Refresh chores function that can be called from components
  const refreshChores = useCallback(async () => {
    if (user?.token) {
      await fetchChores(user.token);
    } else {
      await fetchChores();
    }
  }, [fetchChores, user?.token]);

  // Initial data loading effect
  useEffect(() => {
    const initializeApp = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Check for saved user
        const savedUser = localStorage.getItem('chorerun_user');
        let currentUser = null;
        
        if (savedUser) {
          try {
            currentUser = JSON.parse(savedUser);
            setUser(currentUser);
          } catch (parseError) {
            console.error('Error parsing saved user:', parseError);
            localStorage.removeItem('chorerun_user'); // Remove corrupted data
          }
        }

        // Fetch chores with user token if available
        await fetchChores(currentUser?.token);
      } catch (err) {
        console.error('Initialization error:', err);
        setError('Failed to initialize application');
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, [fetchChores]); // Include fetchChores in dependency array

  // Login function
  const login = useCallback(async (userData) => {
    try {
      setError(null);
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Login failed: ${response.status}`);
      }

      const data = await response.json();
      setUser(data);
      localStorage.setItem('chorerun_user', JSON.stringify(data));
      
      // Fetch chores with new user token
      await fetchChores(data.token);
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message);
    }
  }, [fetchChores]);

  // Logout function
  const logout = useCallback(() => {
    setUser(null);
    setChores([]);
    setError(null);
    localStorage.removeItem('chorerun_user');
  }, []);

  // Update user function
  const updateUser = useCallback((updatedUserData) => {
    if (!user) {
      console.error('No user to update');
      return;
    }
    
    const newUser = { ...user, ...updatedUserData };
    setUser(newUser);
    localStorage.setItem('chorerun_user', JSON.stringify(newUser));
  }, [user]);

  // Add chore function
  const addChore = useCallback(async (choreData) => {
    if (!user) {
      setError('User not authenticated');
      return;
    }

    try {
      setError(null);
      const response = await fetch('/api/chores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({
          ...choreData,
          postedBy: user.name,
          postedAt: new Date().toISOString(),
          status: 'active'
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to post chore: ${response.status}`);
      }

      const newChore = await response.json();
      setChores(prev => [newChore, ...prev]);
    } catch (err) {
      console.error('Add chore error:', err);
      setError(err.message);
    }
  }, [user]);

  // Accept chore function
  const acceptChore = useCallback(async (choreId) => {
    if (!user) {
      setError('User not authenticated');
      return;
    }

    try {
      setError(null);
      const response = await fetch(`/api/chores/${choreId}/accept`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({ acceptedBy: user.name })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to accept chore: ${response.status}`);
      }

      const updatedChore = await response.json();
      setChores(prev => prev.map(chore => 
        chore.id === choreId ? updatedChore : chore
      ));
    } catch (err) {
      console.error('Accept chore error:', err);
      setError(err.message);
    }
  }, [user]);

  // Complete chore function
  const completeChore = useCallback(async (choreId) => {
    if (!user) {
      setError('User not authenticated');
      return;
    }

    try {
      setError(null);
      const response = await fetch(`/api/chores/${choreId}/complete`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({ completedBy: user.name, completedAt: new Date().toISOString() })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to complete chore: ${response.status}`);
      }

      const updatedChore = await response.json();
      setChores(prev => prev.map(chore => 
        chore.id === choreId ? updatedChore : chore
      ));
    } catch (err) {
      console.error('Complete chore error:', err);
      setError(err.message);
    }
  }, [user]);

  // Clear error function
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Auto-refresh chores every 30 seconds when user is active
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      refreshChores();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [user, refreshChores]);

  // Loading state
  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px'
      }}>
        Loading ChoreRun...
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Navbar user={user} onLogout={logout} />
        
        {/* Global error display */}
        {error && (
          <div style={{
            backgroundColor: '#fee',
            color: '#c33',
            padding: '10px',
            margin: '10px',
            borderRadius: '4px',
            border: '1px solid #fcc',
            position: 'relative'
          }}>
            <span>{error}</span>
            <button 
              onClick={clearError}
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                fontSize: '16px',
                cursor: 'pointer',
                color: '#c33'
              }}
            >
              ×
            </button>
          </div>
        )}

        <main style={{ paddingTop: '70px', minHeight: 'calc(100vh - 70px)' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route 
              path="/login" 
              element={user ? <Navigate to="/dashboard" replace /> : <Login onLogin={login} error={error} />} 
            />
            <Route 
              path="/register" 
              element={user ? <Navigate to="/dashboard" replace /> : <Register onLogin={login} error={error} />} 
            />
            <Route 
              path="/dashboard" 
              element={user ? <Dashboard user={user} chores={chores} onRefreshChores={refreshChores} /> : <Navigate to="/login" replace />} 
            />
            <Route 
              path="/post-chore" 
              element={user ? <PostChore onAddChore={addChore} /> : <Navigate to="/login" replace />} 
            />
            <Route 
              path="/browse-chores" 
              element={user ? <BrowseChores 
                chores={chores} 
                onAcceptChore={acceptChore} 
                user={user} 
                onRefreshChores={refreshChores}
              /> : <Navigate to="/login" replace />} 
            />
            <Route 
              path="/profile" 
              element={user ? <Profile user={user} onUserUpdate={updateUser} /> : <Navigate to="/login" replace />} 
            />
            <Route 
              path="/tracking" 
              element={user ? <TrackingPage 
                chores={chores} 
                user={user} 
                onCompleteChore={completeChore}
                onRefreshChores={refreshChores}
              /> : <Navigate to="/login" replace />} 
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;