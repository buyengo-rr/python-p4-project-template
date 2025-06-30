import React, { useState } from 'react';
import { User, Star, Calendar, Award, Edit, Phone, Mail, MapPin } from 'lucide-react';

const Profile = ({ user }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone || '(555) 123-4567',
    location: 'San Francisco, CA'
  });

  const handleSave = () => {
    // Here you would typically save to backend
    setIsEditing(false);
  };

  const stats = [
    { label: 'Chores Completed', value: user.completedChores, icon: Award },
    { label: 'Average Rating', value: `${user.rating}★`, icon: Star },
    { label: 'Member Since', value: new Date(user.joinedDate).getFullYear(), icon: Calendar },
    { label: 'Total Earnings', value: '$1,247', icon: Award }
  ];

  const recentActivity = [
    { action: 'Completed', chore: 'Grocery shopping at Whole Foods', amount: 35, date: '2 days ago' },
    { action: 'Posted', chore: 'Pick up dry cleaning', amount: 15, date: '4 days ago' },
    { action: 'Completed', chore: 'Dog walking service', amount: 20, date: '1 week ago' },
    { action: 'Completed', chore: 'Return Amazon package', amount: 12, date: '1 week ago' }
  ];

  return (
    <div className="py-8">
      <div className="container">
        <div className="dashboard-grid">
          {/* Profile Card */}
          <div className="profile-card card">
            <div className="card-body">
              <div className="profile-avatar">
                {user.name.charAt(0).toUpperCase()}
              </div>
              
              {isEditing ? (
                <div className="form-group">
                  <input
                    type="text"
                    className="form-input"
                    value={editData.name}
                    onChange={(e) => setEditData({...editData, name: e.target.value})}
                  />
                </div>
              ) : (
                <h2 className="profile-name">{user.name}</h2>
              )}

              <div className="profile-rating">
                <div className="rating-stars">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star 
                      key={star} 
                      size={20} 
                      className={star <= Math.floor(user.rating) ? 'star' : 'text-gray-300'} 
                      fill={star <= Math.floor(user.rating) ? 'currentColor' : 'none'}
                    />
                  ))}
                </div>
                <span className="font-semibold">{user.rating} out of 5</span>
              </div>

              <div className="text-center mb-6">
                <div className="chore-tag bg-primary text-white">
                  {user.type === 'both' ? 'Poster & Runner' : 
                   user.type === 'poster' ? 'Chore Poster' : 'Chore Runner'}
                </div>
              </div>

              {isEditing ? (
                <div className="flex gap-2">
                  <button 
                    onClick={handleSave}
                    className="btn btn-primary btn-sm"
                  >
                    Save Changes
                  </button>
                  <button 
                    onClick={() => setIsEditing(false)}
                    className="btn btn-ghost btn-sm"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="btn btn-outline btn-sm"
                >
                  <Edit size={16} />
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          {/* Contact Info */}
          <div className="card">
            <div className="card-header">
              <h3>Contact Information</h3>
            </div>
            <div className="card-body">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <Mail size={20} className="text-gray-400" />
                  {isEditing ? (
                    <input
                      type="email"
                      className="form-input"
                      value={editData.email}
                      onChange={(e) => setEditData({...editData, email: e.target.value})}
                    />
                  ) : (
                    <span>{user.email}</span>
                  )}
                </div>
                
                <div className="flex items-center gap-3">
                  <Phone size={20} className="text-gray-400" />
                  {isEditing ? (
                    <input
                      type="tel"
                      className="form-input"
                      value={editData.phone}
                      onChange={(e) => setEditData({...editData, phone: e.target.value})}
                    />
                  ) : (
                    <span>{editData.phone}</span>
                  )}
                </div>
                
                <div className="flex items-center gap-3">
                  <MapPin size={20} className="text-gray-400" />
                  {isEditing ? (
                    <input
                      type="text"
                      className="form-input"
                      value={editData.location}
                      onChange={(e) => setEditData({...editData, location: e.target.value})}
                    />
                  ) : (
                    <span>{editData.location}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="dashboard-grid mt-8">
          {stats.map((stat, index) => (
            <div key={index} className="card text-center">
              <div className="card-body">
                <stat.icon size={32} className="text-primary mb-3" style={{margin: '0 auto'}} />
                <div className="stats-number" style={{fontSize: '2rem', marginBottom: '0.5rem'}}>
                  {stat.value}
                </div>
                <div className="stats-label text-gray-600">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="card mt-8">
          <div className="card-header">
            <h3>Recent Activity</h3>
            <p className="text-gray-600">Your recent chore activity</p>
          </div>
          <div className="card-body">
            <div className="flex flex-col gap-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-semibold">
                      {activity.action} "{activity.chore}"
                    </div>
                    <div className="text-small text-gray-600">{activity.date}</div>
                  </div>
                  <div className="text-right">
                    <div className={`font-semibold ${activity.action === 'Completed' ? 'text-success' : 'text-gray-700'}`}>
                      {activity.action === 'Completed' ? '+' : ''}${activity.amount}
                    </div>
                    <div className="text-xs text-gray-500">
                      {activity.action === 'Completed' ? 'earned' : 'posted'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;