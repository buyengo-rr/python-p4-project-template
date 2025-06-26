import React, { useState, useEffect } from 'react';

const LiveTracking = ({ chore, onBack }) => {
  const [runnerPosition, setRunnerPosition] = useState({ x: 10, y: 10 }); // Percentage of map width/height
  const [progress, setProgress] = useState(0); // 0 to 100
  const [choreStatus, setChoreStatus] = useState(chore.status);

  useEffect(() => {
    if (chore.status === 'in-progress') {
      const interval = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress >= 100) {
            clearInterval(interval);
            setChoreStatus('completed'); // Simulate completion
            return 100;
          }
          const newProgress = prevProgress + 2; // Move 2% at a time
          // Simulate movement from start (10,10) to end (90,90)
          setRunnerPosition({
            x: 10 + (newProgress * 0.8),
            y: 10 + (newProgress * 0.8),
          });
          return newProgress;
        });
      }, 500); // Update every 0.5 seconds

      return () => clearInterval(interval);
    }
  }, [chore.status]);

  if (!chore) {
    return (
      <div className="card">
        <h2>No Chore Selected for Tracking</h2>
        <button onClick={onBack}>Back to Dashboard</button>
      </div>
    );
  }

  return (
    <div className="card">
      <h2>Live Tracking: {chore.title}</h2>
      <p className="live-tracking-info">
        <strong>Chore Status:</strong> <span className={`status ${choreStatus.replace(' ', '-')}`}>{choreStatus.toUpperCase()}</span>
      </p>
      {chore.runnerName && <p className="live-tracking-info"><strong>ChoreRunner:</strong> {chore.runnerName}</p>}

      <div className="live-tracking-map">
        <div className="runner-path"></div>
        <div className="map-marker start" style={{ left: '10%', top: '10%' }}>📍</div> /* Start Marker */
        <div className="map-marker end" style={{ right: '10%', bottom: '10%' }}>🏁</div> /* End Marker */
        <div
          className="map-marker runner"
          style={{ left: `${runnerPosition.x}%`, top: `${runnerPosition.y}%` }}
        >
          🏃
        </div> /* Runner Marker */
      </div>

      <p className="live-tracking-info" style={{ marginTop: '20px' }}>
        Progress: {Math.round(progress)}%
      </p>

      {choreStatus === 'completed' && (
        <div className="message success" style={{ marginTop: '20px' }}>
          Chore has been completed by {chore.runnerName}!
        </div>
      )}

      <button onClick={onBack} style={{ marginTop: '20px', width: '100%' }}>Back to Dashboard</button>
    </div>
  );
};
