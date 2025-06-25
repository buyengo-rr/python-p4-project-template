import React from 'react';
import ChoreCard from './ChoreCard.jsx';
const ChoreSeekerDashboard = ({ user, chores, onPostChore, onTrackChore, onCancelChore }) => {
  const activeChores = chores.filter(c => c.status === 'pending' || c.status === 'in-progress');
  const completedChores = chores.filter(c => c.status === 'completed' || c.status === 'cancelled');
  return (
    <div>
      <h2>Welcome, {user.name}!</h2>
      <p style={{ textAlign: 'center', marginBottom: '25px', fontSize: '1.1rem' }}>
        Ready to outsource your errands? Post a new chore or check on your existing ones.
      </p>
      <button onClick={onPostChore} style={{ width: '100%', marginBottom: '30px' }}>
        Post a New Chore
      </button>
      <h3>My Active Chores ({activeChores.length})</h3>
      {activeChores.length === 0 ? (
        <p className="message">You have no active chores. Time to post one!</p>
      ) : (
        activeChores.map((chore) => (
          <ChoreCard
            key={chore.id}
            chore={chore}
            isRunnerView={false}
            onTrack={onTrackChore}
            onCancel={onCancelChore}
          />
        ))
      )}
      {completedChores.length > 0 && (
        <>
          <h3 style={{ marginTop: '30px' }}>Past Chores ({completedChores.length})</h3>
          {completedChores.map((chore) => (
            <ChoreCard key={chore.id} chore={chore} isRunnerView={false} />
          ))}
        </>
      )}
    </div>
  );
};
