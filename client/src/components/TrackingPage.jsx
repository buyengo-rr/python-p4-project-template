import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, CheckCircle, User, Star, MessageCircle, Phone } from 'lucide-react';

const TrackingPage = ({ chores, user }) => {
  const [selectedTab, setSelectedTab] = useState('active');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progressData, setProgressData] = useState({});

  const userActiveChores = chores.filter(chore => 
    (chore.postedBy === user.name || chore.acceptedBy === user.name) && 
    chore.status === 'accepted'
  );

  const userCompletedChores = chores.filter(chore => 
    (chore.postedBy === user.name || chore.acceptedBy === user.name) && 
    chore.status === 'completed'
  );

  const fetchChoreProgress = useCallback(async (choreId) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/chores/${choreId}/progress`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch chore progress');
      }

      const data = await response.json();
      setProgressData(prev => ({ ...prev, [choreId]: data }));
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [user.token]);

  useEffect(() => {
    userActiveChores.forEach(chore => {
      fetchChoreProgress(chore.id);
    });
  }, [userActiveChores, fetchChoreProgress]);

  const ChoreTracker = ({ chore }) => {
    const progress = progressData[chore.id] || [
      { step: 'Chore Accepted', completed: true, time: new Date().toLocaleTimeString() },
      { step: 'Runner En Route', completed: false, time: null },
      { step: 'Arrived at Location', completed: false, time: null },
      { step: 'Task in Progress', completed: false, time: null },
      { step: 'Task Completed', completed: false, time: null },
      { step: 'Payment Processed', completed: false, time: null }
    ];
    const currentStep = progress.findIndex(step => !step.completed);
    const isUserRunner = chore.acceptedBy === user.name;

    const handleContact = async (type) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/chores/${chore.id}/contact`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({ contactType: type, userId: user.id }),
        });

        if (!response.ok) {
          throw new Error(`Failed to initiate ${type}`);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <div className="card">
        <div className="card-header">
          <div className="flex justify-between items-start">
            <div>
              <h3>{chore.title}</h3>
              <p className="text-gray-600">
                {isUserRunner ? `Posted by ${chore.postedBy}` : `Being handled by ${chore.acceptedBy}`}
              </p>
            </div>
            <div className="text-right">
              <div className="chore-price">${chore.price.toFixed(2)}</div>
              <div className="text-small text-gray-600 mt-1">{chore.timeEstimate}</div>
            </div>
          </div>
        </div>

        <div className="card-body">
          {error && <div className="form-error text-center mb-4">{error}</div>}
          <div className="flex items-center gap-3 mb-6">
            <MapPin size={16} className="text-gray-400" />
            <span>{chore.location}</span>
          </div>

          <div className="space-y-4">
            {progress.map((step, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  step.completed 
                    ? 'bg-success text-white' 
                    : index === currentStep 
                      ? 'bg-warning text-white animate-pulse' 
                      : 'bg-gray-200 text-gray-500'
                }`}>
                  {step.completed ? <CheckCircle size={14} /> : index + 1}
                </div>
                <div className="flex-1">
                  <div className={`font-medium ${step.completed ? 'text-gray-900' : 'text-gray-500'}`}>
                    {step.step}
                  </div>
                  {step.time && (
                    <div className="text-small text-gray-500">{step.time}</div>
                  )}
                  {index === currentStep && (
                    <div className="text-small text-warning font-medium">In Progress...</div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex gap-3">
              <button 
                className="btn btn-outline btn-sm flex-1" 
                onClick={() => handleContact('message')}
                disabled={isLoading}
              >
                <MessageCircle size={16} />
                Message {isUserRunner ? 'Poster' : 'Runner'}
              </button>
              <button 
                className="btn btn-secondary btn-sm flex-1" 
                onClick={() => handleContact('call')}
                disabled={isLoading}
              >
                <Phone size={16} />
                Call {isUserRunner ? 'Poster' : 'Runner'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const CompletedChoreCard = ({ chore }) => {
    const isUserRunner = chore.acceptedBy === user.name;
    
    return (
      <div className="card">
        <div className="card-body">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h4 className="font-semibold">{chore.title}</h4>
              <p className="text-gray-600 text-small">
                {isUserRunner ? `For ${chore.postedBy}` : `Completed by ${chore.acceptedBy}`}
              </p>
            </div>
            <div className="text-right">
              <div className="font-semibold text-success">
                {isUserRunner ? '+' : '-'}${chore.price.toFixed(2)}
              </div>
              <div className="flex items-center gap-1 text-small">
                <Star size={12} className="text-warning" />
                <span>{chore.rating || 'N/A'}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-small text-gray-600">
            <span className="flex items-center gap-1">
              <MapPin size={12} />
              {chore.location}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={12} />
              Completed {new Date(chore.completedAt || Date.now()).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) return <div className="py-8 text-center">Loading tracking data...</div>;
  if (error) return <div className="py-8 text-center text-error">{error}</div>;

  return (
    <div className="py-8">
      <div className="container">
        <div className="mb-8">
          <h1>Track Your Chores</h1>
          <p className="text-gray-600 text-large">
            Monitor the progress of your active chores and view your completed tasks.
          </p>
        </div>

        <div className="flex gap-1 mb-8 bg-gray-100 p-1 rounded-lg" style={{ width: 'fit-content' }}>
          <button
            onClick={() => setSelectedTab('active')}
            className={`px-6 py-2 rounded-lg font-medium transition ${
              selectedTab === 'active' 
                ? 'bg-white text-primary shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
            disabled={isLoading}
          >
            Active Chores ({userActiveChores.length})
          </button>
          <button
            onClick={() => setSelectedTab('completed')}
            className={`px-6 py-2 rounded-lg font-medium transition ${
              selectedTab === 'completed' 
                ? 'bg-white text-primary shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
            disabled={isLoading}
          >
            Completed ({userCompletedChores.length})
          </button>
        </div>

        {selectedTab === 'active' ? (
          userActiveChores.length > 0 ? (
            <div className="space-y-6">
              {userActiveChores.map(chore => (
                <ChoreTracker key={chore.id} chore={chore} />
              ))}
            </div>
          ) : (
            <div className="card text-center py-12">
              <Clock size={64} className="text-gray-300 mb-4" style={{margin: '0 auto'}} />
              <h3 className="mb-2 text-gray-700">No Active Chores</h3>
              <p className="text-gray-600 mb-6">
                You don't have any chores in progress at the moment.
              </p>
              <div className="flex justify-center gap-4">
                <Link to="/post-chore" className="btn btn-primary">
                  Post a Chore
                </Link>
                <Link to="/browse-chores" className="btn btn-secondary">
                  Browse Chores
                </Link>
              </div>
            </div>
          )
        ) : (
          userCompletedChores.length > 0 ? (
            <div className="chore-grid">
              {userCompletedChores.map(chore => (
                <CompletedChoreCard key={chore.id} chore={chore} />
              ))}
            </div>
          ) : (
            <div className="card text-center py-12">
              <CheckCircle size={64} className="text-gray-300 mb-4" style={{margin: '0 auto'}} />
              <h3 className="mb-2 text-gray-700">No Completed Chores</h3>
              <p className="text-gray-600">
                Your completed chores will appear here once you finish your first task.
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default TrackingPage;