import React, { useState, useEffect } from 'react';

const LiveTracking = ({ chore, onBack }) => {
  const [runnerPosition, setRunnerPosition] = useState({ x: 10, y: 10 });
  const [progress, setProgress] = useState(0);
  const [choreStatus, setChoreStatus] = useState(chore.status);
  useEffect(() => {
    if (chore.status === 'in-progress') {
      const interval = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress >= 100) {
            clearInterval(interval);
            setChoreStatus('completed');
            return 100;
          }
          const newProgress = prevProgress + 2;
          setRunnerPosition({
            x: 10 + (newProgress * 0.8),
            y: 10 + (newProgress * 0.8),
          });
          return newProgress;
        });
      }, 500);

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
      <div className="live-tracking-map">
        <div className="runner-path"></div>
        <div className="map-marker start" style={{ left: '10%', top: '10%' }}>📍</div>
        <div className="map-marker end" style={{ right: '10%', bottom: '10%' }}>🏁</div>
        <div
          className="map-marker runner"
          style={{ left: `${runnerPosition.x}%`, top: `${runnerPosition.y}%` }}
        >
          🏃
        </div>
      </div>
