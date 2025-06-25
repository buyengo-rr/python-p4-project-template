import React from 'react';

const ChoreRunnerDashboard = ({ user }) => {
  return (
    <div>
      <h2>Welcome, ChoreRunner {user.name}!</h2>
      <p style={{ textAlign: 'center', marginBottom: '25px', fontSize: '1.1rem' }}>
        Find chores near you and start earning!
      </p>
    </div>
  );
};

export default ChoreRunnerDashboard;
