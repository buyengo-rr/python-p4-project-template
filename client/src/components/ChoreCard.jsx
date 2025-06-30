import React from 'react';
import { MapPin, Clock, DollarSign, User, Star, AlertCircle } from 'lucide-react';

const ChoreCard = ({ chore, onAccept, showAcceptButton = false }) => {
  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      case 'low': return 'priority-low';
      default: return '';
    }
  };

  const getPriorityIcon = (priority) => {
    if (priority === 'high') {
      return <AlertCircle size={12} />;
    }
    return null;
  };

  return (
    <div className="chore-card card">
      <div className="card-body">
        <div className="chore-header">
          <div>
            <h3 className="chore-title">{chore.title}</h3>
            <div className="chore-meta">
              <span>
                <User size={14} />
                {chore.postedBy}
              </span>
              <span>
                <Clock size={14} />
                {chore.postedAt}
              </span>
            </div>
          </div>
          <div className="chore-price">
            ${chore.price}
          </div>
        </div>

        <p className="text-gray-600 mb-4">{chore.description}</p>

        <div className="chore-meta mb-4">
          <span>
            <MapPin size={14} />
            {chore.location}
          </span>
          <span>
            <Clock size={14} />
            {chore.timeEstimate}
          </span>
        </div>

        <div className="chore-tags">
          <span className="chore-tag">{chore.category}</span>
          <span className={`chore-tag ${getPriorityClass(chore.priority)}`}>
            {getPriorityIcon(chore.priority)}
            {chore.priority} priority
          </span>
        </div>

        {showAcceptButton && (
          <div className="mt-6">
            <button 
              onClick={onAccept}
              className="btn btn-primary"
              style={{ width: '100%' }}
            >
              <DollarSign size={16} />
              Accept Chore - ${chore.price}
            </button>
          </div>
        )}

        {chore.status === 'accepted' && chore.acceptedBy && (
          <div className="mt-4 p-3 bg-green-50 rounded-lg">
            <div className="flex items-center gap-2 text-success">
              <Star size={16} />
              <span className="font-semibold">Accepted by {chore.acceptedBy}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChoreCard;