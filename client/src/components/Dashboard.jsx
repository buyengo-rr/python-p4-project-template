import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, CheckCircle, Star, RefreshCw } from 'lucide-react';

const Dashboard = ({ user, chores: initialChores }) => {
  const [chores, setChores] = useState(initialChores || []);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastFetchTime, setLastFetchTime] = useState(null);

  // Fetch chores function - works with App.jsx's API structure
  const fetchChores = useCallback(async (showLoading = true) => {
    if (!user?.token) return;
    
    try {
      if (showLoading) setIsLoading(true);
      setError(null);

      const response = await fetch('/api/chores', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch chores: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setChores(Array.isArray(data) ? data : []);
      setLastFetchTime(new Date());
    } catch (err) {
      console.error('Error fetching chores:', err);
      setError(err.message);
    } finally {
      if (showLoading) setIsLoading(false);
    }
  }, [user]);

  // Update local state when props change (from App.jsx)
  useEffect(() => {
    if (initialChores && Array.isArray(initialChores)) {
      setChores(initialChores);
      setLastFetchTime(new Date());
    }
  }, [initialChores]);

  // Auto-refresh chores every 30 seconds (optional - App.jsx handles main fetching)
  useEffect(() => {
    if (!user?.token) return;

    // Set up auto-refresh interval for real-time updates
    const interval = setInterval(() => {
      fetchChores(false); // Don't show loading for background refreshes
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [user, fetchChores]);

  // Manual refresh handler
  const handleRefresh = () => {
    fetchChores(true);
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  // Filter chores based on user - with null safety
  const userChores = chores.filter(chore => 
    chore && chore.postedBy === user?.name
  );
  
  const acceptedChores = chores.filter(chore => 
    chore && chore.acceptedBy === user?.name
  );
  
  const completedChores = chores.filter(chore => 
    chore && chore.acceptedBy === user?.name && chore.status === 'completed'
  );
  
  const totalEarnings = completedChores.reduce((sum, chore) => 
    sum + (parseFloat(chore.price) || 0), 0
  );

  // Format date helper function
  const formatDate = (dateString) => {
    try {
      if (!dateString) return 'Unknown date';
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString || 'Unknown date';
    }
  };

  // Format last fetch time
  const formatLastFetch = (date) => {
    if (!date) return '';
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return date.toLocaleDateString();
  };

  // Get status display info
  const getStatusDisplay = (status) => {
    switch (status) {
      case 'active':
        return { class: 'bg-green-100 text-green-700', text: 'Active' };
      case 'accepted':
        return { class: 'bg-blue-100 text-blue-700', text: 'In Progress' };
      case 'completed':
        return { class: 'bg-purple-100 text-purple-700', text: 'Completed' };
      default:
        return { class: 'bg-gray-100 text-gray-700', text: 'Pending' };
    }
  };

  if (!user) {
    return (
      <div className="py-8">
        <div className="container">
          <div className="text-center">
            <p className="text-gray-600">Please log in to view your dashboard.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="container">
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1>Welcome back, {user.name}! 👋</h1>
              <p className="text-gray-600 text-large">
                Ready to get things done? Here's what's happening with your chores.
              </p>
              {lastFetchTime && (
                <p className="text-xs text-gray-500 mt-1">
                  Last updated: {formatLastFetch(lastFetchTime)}
                </p>
              )}
            </div>
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="btn btn-outline btn-sm flex items-center gap-2"
              title="Refresh data"
            >
              <RefreshCw 
                size={16} 
                className={isLoading ? 'animate-spin' : ''} 
              />
              {isLoading ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>

        {/* Error display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex justify-between items-center">
              <p className="text-red-700 text-sm">
                Error loading chores: {error}
              </p>
              <button
                onClick={clearError}
                className="text-red-500 hover:text-red-700 text-lg"
                aria-label="Close error"
              >
                ×
              </button>
            </div>
            <button
              onClick={() => fetchChores(true)}
              className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
            >
              Try again
            </button>
          </div>
        )}

        <div className="dashboard-grid mb-8">
          <div className="stats-card">
            <div className="stats-number">{userChores.length}</div>
            <div className="stats-label">Chores Posted</div>
          </div>
          <div className="stats-card" style={{background: 'linear-gradient(135deg, var(--secondary), var(--secondary-dark))'}}>
            <div className="stats-number">{acceptedChores.length}</div>
            <div className="stats-label">Chores Accepted</div>
          </div>
          <div className="stats-card" style={{background: 'linear-gradient(135deg, var(--accent), var(--accent-dark))'}}>
            <div className="stats-number">${totalEarnings.toFixed(2)}</div>
            <div className="stats-label">Total Earnings</div>
          </div>
          <div className="stats-card" style={{background: 'linear-gradient(135deg, var(--success), #059669)'}}>
            <div className="stats-number">{user.rating ? user.rating.toFixed(1) : '0.0'}★</div>
            <div className="stats-label">Your Rating</div>
          </div>
        </div>

        <div className="card mb-8">
          <div className="card-header">
            <h3>Quick Actions</h3>
            <p className="text-gray-600">What would you like to do today?</p>
          </div>
          <div className="card-body">
            <div className="dashboard-grid">
              <Link to="/post-chore" className="card text-center transition">
                <div className="card-body">
                  <div className="feature-icon mb-4">
                    <Plus size={24} />
                  </div>
                  <h4 className="mb-2">Post a Chore</h4>
                  <p className="text-gray-600">Need something done? Post it now.</p>
                </div>
              </Link>
              
              <Link to="/browse-chores" className="card text-center transition">
                <div className="card-body">
                  <div className="feature-icon mb-4" style={{background: 'linear-gradient(135deg, var(--secondary), var(--secondary-dark))'}}>
                    <Search size={24} />
                  </div>
                  <h4 className="mb-2">Find Chores</h4>
                  <p className="text-gray-600">Browse and accept available chores.</p>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Loading overlay for stats cards */}
        {isLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded-lg shadow-lg flex items-center gap-3">
              <RefreshCw size={20} className="animate-spin text-primary" />
              <span>Updating dashboard...</span>
            </div>
          </div>
        )}

        <div className="dashboard-grid">
          <div className="card">
            <div className="card-header">
              <h3>Your Posted Chores</h3>
              <p className="text-gray-600">Chores you've posted recently</p>
            </div>
            <div className="card-body">
              {userChores.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {userChores.slice(0, 3).map(chore => {
                    const statusInfo = getStatusDisplay(chore.status);
                    return (
                      <div key={chore.id || Math.random()} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <h5 className="font-semibold">{chore.title || 'Untitled Chore'}</h5>
                          <p className="text-small text-gray-600">{formatDate(chore.postedAt)}</p>
                          {chore.acceptedBy && (
                            <p className="text-xs text-blue-600">Accepted by: {chore.acceptedBy}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-accent">${(parseFloat(chore.price) || 0).toFixed(2)}</div>
                          <div className={`text-xs px-2 py-1 rounded ${statusInfo.class}`}>
                            {statusInfo.text}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {userChores.length > 3 && (
                    <div className="text-center pt-2">
                      <Link to="/tracking" className="text-primary text-sm hover:underline">
                        View all {userChores.length} posted chores →
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Plus size={48} className="text-gray-300 mb-4" style={{margin: '0 auto'}} />
                  <p className="text-gray-600 mb-4">You haven't posted any chores yet.</p>
                  <Link to="/post-chore" className="btn btn-primary btn-sm">
                    Post Your First Chore
                  </Link>
                </div>
              )}
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3>Your Accepted Chores</h3>
              <p className="text-gray-600">Chores you've accepted to do</p>
            </div>
            <div className="card-body">
              {acceptedChores.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {acceptedChores.slice(0, 3).map(chore => {
                    const statusInfo = getStatusDisplay(chore.status);
                    const isCompleted = chore.status === 'completed';
                    return (
                      <div key={chore.id || Math.random()} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <h5 className="font-semibold">{chore.title || 'Untitled Chore'}</h5>
                          <p className="text-small text-gray-600">Posted by: {chore.postedBy || 'Unknown'}</p>
                          <div className={`text-xs px-2 py-1 rounded inline-block mt-1 ${statusInfo.class}`}>
                            {statusInfo.text}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`font-semibold ${isCompleted ? 'text-success' : 'text-accent'}`}>
                            {isCompleted ? '+' : ''}${(parseFloat(chore.price) || 0).toFixed(2)}
                          </div>
                          {chore.rating && (
                            <div className="flex items-center gap-1 text-xs text-gray-600">
                              <Star size={12} className="text-warning" />
                              {chore.rating}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  {acceptedChores.length > 3 && (
                    <div className="text-center pt-2">
                      <Link to="/tracking" className="text-primary text-sm hover:underline">
                        View all {acceptedChores.length} accepted chores →
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle size={48} className="text-gray-300 mb-4" style={{margin: '0 auto'}} />
                  <p className="text-gray-600 mb-4">You haven't accepted any chores yet.</p>
                  <Link to="/browse-chores" className="btn btn-secondary btn-sm">
                    Browse Available Chores
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;