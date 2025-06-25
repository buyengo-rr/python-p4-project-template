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
