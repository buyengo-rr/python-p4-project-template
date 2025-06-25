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
