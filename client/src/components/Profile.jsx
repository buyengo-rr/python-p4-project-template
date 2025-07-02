import React, { useState } from 'react';
// Removed unused 'User' import

const Profile = ({ user, onUserUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    bio: user?.bio || ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUserUpdate(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      bio: user?.bio || ''
    });
    setIsEditing(false);
  };

  return (
    <div className="py-8">
      <div className="container max-w-2xl">
        <div className="card">
          <div className="card-header">
            <h2>Profile</h2>
            {!isEditing && (
              <button 
                className="btn btn-primary"
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </button>
            )}
          </div>
          
          <div className="card-body">
            {isEditing ? (
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="form-input"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="form-input"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="form-input"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="bio">Bio</label>
                  <textarea
                    id="bio"
                    name="bio"
                    className="form-input"
                    rows="4"
                    value={formData.bio}
                    onChange={handleInputChange}
                    placeholder="Tell others about yourself..."
                  />
                </div>

                <div className="flex gap-4">
                  <button type="submit" className="btn btn-primary">
                    Save Changes
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Name</label>
                  <p className="text-lg">{user?.name || 'Not provided'}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Email</label>
                  <p className="text-lg">{user?.email || 'Not provided'}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Phone</label>
                  <p className="text-lg">{user?.phone || 'Not provided'}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Bio</label>
                  <p className="text-lg">{user?.bio || 'No bio provided'}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Member Since</label>
                  <p className="text-lg">
                    {user?.joinedAt ? new Date(user.joinedAt).toLocaleDateString() : 'Unknown'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Stats Card */}
        <div className="card mt-6">
          <div className="card-header">
            <h3>Activity Stats</h3>
          </div>
          <div className="card-body">
            <div className="dashboard-grid text-center">
              <div>
                <div className="text-2xl font-bold text-primary">{user?.choreStats?.posted || 0}</div>
                <div className="text-sm text-gray-600">Chores Posted</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-success">{user?.choreStats?.completed || 0}</div>
                <div className="text-sm text-gray-600">Chores Completed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-accent">${user?.choreStats?.earned || 0}</div>
                <div className="text-sm text-gray-600">Total Earned</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-secondary">{user?.choreStats?.rating || 0}/5</div>
                <div className="text-sm text-gray-600">Average Rating</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;