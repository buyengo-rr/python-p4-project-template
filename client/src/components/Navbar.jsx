import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Package, User, LogOut, Home, Plus, Search, BarChart3 } from 'lucide-react';

const Navbar = ({ user, onLogout }) => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="container navbar-content">
        <Link to="/" className="navbar-brand">
          <Package size={28} />
          ChoreRun
        </Link>
        
        {user ? (
          <ul className="navbar-nav">
            <li>
              <Link 
                to="/dashboard" 
                className={`navbar-link ${isActive('/dashboard') ? 'active' : ''}`}
              >
                <Home size={16} />
                Dashboard
              </Link>
            </li>
            <li>
              <Link 
                to="/post-chore" 
                className={`navbar-link ${isActive('/post-chore') ? 'active' : ''}`}
              >
                <Plus size={16} />
                Post Chore
              </Link>
            </li>
            <li>
              <Link 
                to="/browse-chores" 
                className={`navbar-link ${isActive('/browse-chores') ? 'active' : ''}`}
              >
                <Search size={16} />
                Browse Chores
              </Link>
            </li>
            <li>
              <Link 
                to="/tracking" 
                className={`navbar-link ${isActive('/tracking') ? 'active' : ''}`}
              >
                <BarChart3 size={16} />
                Tracking
              </Link>
            </li>
            <li>
              <Link 
                to="/profile" 
                className={`navbar-link ${isActive('/profile') ? 'active' : ''}`}
              >
                <User size={16} />
                Profile
              </Link>
            </li>
            <li>
              <button 
                onClick={onLogout} 
                className="btn btn-ghost btn-sm"
                style={{ padding: '0.5rem', marginLeft: '1rem' }}
              >
                <LogOut size={16} />
                Logout
              </button>
            </li>
          </ul>
        ) : (
          <div className="flex items-center gap-4">
            <Link to="/login" className="navbar-link">
              Login
            </Link>
            <Link to="/register" className="btn btn-primary btn-sm">
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;