import React from 'react';

const ChoreCard = ({ chore, isRunnerView, onAccept, onTrack, onComplete, onCancel }) => {
  return (
    <div className="chore-card">
              <h3>{chore.title}</h3>
      <p><strong>Description:</strong> {chore.description}</p>
      <p><strong>Location:</strong> {chore.location}</p>
      <p><strong>Estimated Time:</strong> {chore.time}</p>
      <p><strong>Price:</strong> <span className="price">${chore.price.toFixed(2)}</span></p>
      <p><strong>Status:</strong> <span className={`status ${chore.status.replace(' ', '-')}`}>{chore.status.toUpperCase()}</span></p>
       {chore.postedByName && <p><strong>Posted By:</strong> {chore.postedByName}</p>}
      {chore.runnerName && <p><strong>Assigned To:</strong> {chore.runnerName}</p>}
       <div className="chore-card-actions">
        {isRunnerView && chore.status === 'pending' && (
          <button className="accept" onClick={() => onAccept(chore.id)}>Accept Chore</button>
        )}
        {(chore.status === 'in-progress' || (isRunnerView && chore.runnerId && chore.status === 'completed')) && (
          <button className="track" onClick={() => onTrack(chore)}>Track Chore</button>
        )}
        {isRunnerView && chore.status === 'in-progress' && (
          <button className="accept" onClick={() => onComplete(chore.id)}>Mark as Complete</button>
        )}
        {!isRunnerView && (chore.status === 'pending' || chore.status === 'in-progress') && (
          <button className="cancel" onClick={() => onCancel(chore.id)}>Cancel Chore</button>
        )}
      </div>
        

