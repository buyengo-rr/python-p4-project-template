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
<h3 style={{ marginTop: '30px' }}>Available Chores ({availableChores.length})</h3>
{availableChores.length === 0 ? (
  <p className="message">No chores available right now. Check back later!</p>
) : (
  availableChores.map((chore) => (
    <ChoreCard key={chore.id} chore={chore} isRunnerView={true} onAccept={acceptChore} />
  ))
)}
const completedChores = availableChores.filter(c => 
  c.status === 'completed' || 
  c.status === 'cancelled' || 
  (c.runnerId === user.id && c.status === 'completed')
);

{completedChores.length > 0 && (
  <>
    <h3 style={{ marginTop: '30px' }}>Past Chores ({completedChores.length})</h3>
    {completedChores.map((chore) => (
      <ChoreCard key={chore.id} chore={chore} isRunnerView={true} />
    ))}
  </>
)}
