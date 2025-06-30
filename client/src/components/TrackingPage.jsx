import React, { useState } from 'react';
import { MapPin, Clock, CheckCircle, User, Star, MessageCircle, Phone } from 'lucide-react';

const TrackingPage = ({ chores, user }) => {
  const [selectedTab, setSelectedTab] = useState('active');

  const userActiveChores = chores.filter(chore => 
    (chore.postedBy === user.name || chore.acceptedBy === user.name) && 
    chore.status === 'accepted'
  );

  const userCompletedChores = chores.filter(chore => 
    (chore.postedBy === user.name || chore.acceptedBy === user.name) && 
    chore.status === 'completed'
  );

  const getChoreProgress = (chore) => {
    // Mock progress data
    const progressSteps = [
      { step: 'Chore Accepted', completed: true, time: '10:30 AM' },
      { step: 'Runner En Route', completed: true, time: '10:45 AM' },
      { step: 'Arrived at Location', completed: true, time: '11:15 AM' },
      { step: 'Task in Progress', completed: true, time: '11:20 AM' },
      { step: 'Task Completed', completed: false, time: null },
      { step: 'Payment Processed', completed: false, time: null }
    ];
    return progressSteps;
  };

  const ChoreTracker = ({ chore }) => {
    const progress = getChoreProgress(chore);
    const currentStep = progress.findIndex(step => !step.completed);
    const isUserRunner = chore.acceptedBy === user.name;

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
              <div className="chore-price">${chore.price}</div>
              <div className="text-small text-gray-600 mt-1">{chore.timeEstimate}</div>
            </div>
          </div>
        </div>

        <div className="card-body">
          <div className="flex items-center gap-3 mb-6">
            <MapPin size={16} className="text-gray-400" />
            <span>{chore.location}</span>
          </div>

          {/* Progress Timeline */}
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

          {/* Contact Runner/Poster */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex gap-3">
              <button className="btn btn-outline btn-sm flex-1">
                <MessageCircle size={16} />
                Message {isUserRunner ? 'Poster' : 'Runner'}
              </button>
              <button className="btn btn-secondary btn-sm flex-1">
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
                {isUserRunner ? '+' : '-'}${chore.price}
              </div>
              <div className="flex items-center gap-1 text-small">
                <Star size={12} className="text-warning" />
                <span>5.0</span>
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
              Completed yesterday
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="py-8">
      <div className="container">
        <div className="mb-8">
          <h1>Track Your Chores</h1>
          <p className="text-gray-600 text-large">
            Monitor the progress of your active chores and view your completed tasks.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 bg-gray-100 p-1 rounded-lg" style={{ width: 'fit-content' }}>
          <button
            onClick={() => setSelectedTab('active')}
            className={`px-6 py-2 rounded-lg font-medium transition ${
              selectedTab === 'active' 
                ? 'bg-white text-primary shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
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
          >
            Completed ({userCompletedChores.length})
          </button>
        </div>

        {/* Content */}
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
                <button className="btn btn-primary">
                  Post a Chore
                </button>
                <button className="btn btn-secondary">
                  Browse Chores
                </button>
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