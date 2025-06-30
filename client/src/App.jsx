import React, { useState, useEffect } from 'react';
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
  const [chores, setChores] = useState([
    {
      id: 1,
      title: "Pick up dry cleaning",
      description: "Need someone to pick up my suit from Crystal Clean Dry Cleaners on Main Street. Receipt provided.",
      price: 15,
      location: "Downtown",
      timeEstimate: "30 mins",
      priority: "medium",
      category: "Personal",
      postedBy: "Sarah Johnson",
      postedAt: "2 hours ago",
      status: "active"
    },
    {
      id: 2,
      title: "Grocery shopping at Whole Foods",
      description: "Need weekly groceries picked up. List of 20 items provided. Prefer organic options when available.",
      price: 35,
      location: "Westside",
      timeEstimate: "1.5 hours",
      priority: "high",
      category: "Shopping",
      postedBy: "Mike Chen",
      postedAt: "4 hours ago",
      status: "active"
    },
    {
      id: 3,
      title: "Return Amazon package",
      description: "Need to return a defective laptop to UPS store. Package is ready, just need someone to drop it off.",
      price: 12,
      location: "Midtown",
      timeEstimate: "20 mins",
      priority: "low",
      category: "Errands",
      postedBy: "Emma Davis",
      postedAt: "6 hours ago",
      status: "active"
    },
    {
      id: 4,
      title: "Wait in line for concert tickets",
      description: "Taylor Swift tickets go on sale at 10 AM. Need someone to wait in line at the box office. Will pay hourly rate.",
      price: 50,
      location: "Arena District",
      timeEstimate: "3 hours",
      priority: "high",
      category: "Entertainment",
      postedBy: "Alex Rodriguez",
      postedAt: "8 hours ago",
      status: "active"
    },
    {
      id: 5,
      title: "Dog walking service",
      description: "My golden retriever needs a 30-minute walk while I'm at work. Very friendly dog, just needs exercise.",
      price: 20,
      location: "Suburbs",
      timeEstimate: "45 mins",
      priority: "medium",
      category: "Pet Care",
      postedBy: "Lisa Park",
      postedAt: "1 day ago",
      status: "active"
    }
  ]);

  useEffect(() => {
    const savedUser = localStorage.getItem('chorerun_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('chorerun_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('chorerun_user');
  };

  const addChore = (choreData) => {
    const newChore = {
      id: chores.length + 1,
      ...choreData,
      postedBy: user.name,
      postedAt: 'Just now',
      status: 'active'
    };
    setChores([newChore, ...chores]);
  };

  const acceptChore = (choreId) => {
    setChores(chores.map(chore => 
      chore.id === choreId 
        ? { ...chore, status: 'accepted', acceptedBy: user.name }
        : chore
    ));
  };

  return (
    <Router>
      <div className="App">
        <Navbar user={user} onLogout={logout} />
        <main style={{ paddingTop: '70px', minHeight: 'calc(100vh - 70px)' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route 
              path="/login" 
              element={user ? <Navigate to="/dashboard" /> : <Login onLogin={login} />} 
            />
            <Route 
              path="/register" 
              element={user ? <Navigate to="/dashboard" /> : <Register onLogin={login} />} 
            />
            <Route 
              path="/dashboard" 
              element={user ? <Dashboard user={user} chores={chores} /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/post-chore" 
              element={user ? <PostChore onAddChore={addChore} /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/browse-chores" 
              element={user ? <BrowseChores chores={chores} onAcceptChore={acceptChore} user={user} /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/profile" 
              element={user ? <Profile user={user} /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/tracking" 
              element={user ? <TrackingPage chores={chores} user={user} /> : <Navigate to="/login" />} 
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;