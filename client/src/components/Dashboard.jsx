import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, DollarSign, Clock, CheckCircle, Star } from 'lucide-react';

const Dashboard = ({ user, chores }) => {
  const userChores = chores.filter(chore => chore.postedBy === user.name);
  const acceptedChores = chores.filter(chore => chore.acceptedBy === user.name);
  const totalEarnings = acceptedChores.reduce((sum, chore) => sum + chore.price, 0);

  return (
    <div className="py-8">
      <div className="container">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1>Welcome back, {user.name}! 👋</h1>
          <p className="text-gray-600 text-large">
            Ready to get things done? Here's what's happening with your chores.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="dashboard-grid mb-8">
          <div className="stats-card">
            <div className="stats-number">{userChores.length}</div>
            <div className="stats-label">Chores Posted</div>
          </div>
          <div className="stats-card" style={{background: 'linear-gradient(135deg, var(--secondary), var(--secondary-dark))'}}>
            <div className="stats-number">{acceptedChores.length}</div>
            <div className="stats-label">Chores Completed</div>
          </div>
          <div className="stats-card" style={{background: 'linear-gradient(135deg, var(--accent), var(--accent-dark))'}}>
            <div className="stats-number">${totalEarnings}</div>
            <div className="stats-label">Total Earnings</div>
          </div>
          <div className="stats-card" style={{background: 'linear-gradient(135deg, var(--success), #059669)'}}>
            <div className="stats-number">{user.rating}★</div>
            <div className="stats-label">Your Rating</div>
          </div>
        </div>

        {/* Quick Actions */}
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

        {/* Recent Activity */}
        <div className="dashboard-grid">
          {/* Your Posted Chores */}
          <div className="card">
            <div className="card-header">
              <h3>Your Posted Chores</h3>
              <p className="text-gray-600">Chores you've posted recently</p>
            </div>
            <div className="card-body">
              {userChores.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {userChores.slice(0, 3).map(chore => (
                    <div key={chore.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <h5 className="font-semibold">{chore.title}</h5>
                        <p className="text-small text-gray-600">{chore.postedAt}</p>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-accent">${chore.price}</div>
                        <div className={`text-xs px-2 py-1 rounded ${chore.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                          {chore.status}
                        </div>
                      </div>
                    </div>
                  ))}
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

          {/* Completed Chores */}
          <div className="card">
            <div className="card-header">
              <h3>Completed Chores</h3>
              <p className="text-gray-600">Chores you've completed for others</p>
            </div>
            <div className="card-body">
              {acceptedChores.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {acceptedChores.slice(0, 3).map(chore => (
                    <div key={chore.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <h5 className="font-semibold">{chore.title}</h5>
                        <p className="text-small text-gray-600">For {chore.postedBy}</p>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-success">+${chore.price}</div>
                        <div className="flex items-center gap-1 text-xs text-gray-600">
                          <Star size={12} className="text-warning" />
                          5.0
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle size={48} className="text-gray-300 mb-4" style={{margin: '0 auto'}} />
                  <p className="text-gray-600 mb-4">You haven't completed any chores yet.</p>
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