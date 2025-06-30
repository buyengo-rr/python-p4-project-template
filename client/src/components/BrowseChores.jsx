import React, { useState } from 'react';
import { Search, Filter, MapPin, Clock, DollarSign, User, Star } from 'lucide-react';
import ChoreCard from './ChoreCard';

const BrowseChores = ({ chores, onAcceptChore, user }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('');
  const [priceRange, setPriceRange] = useState('');

  const categories = [...new Set(chores.map(chore => chore.category))];
  
  const filteredChores = chores.filter(chore => {
    const matchesSearch = chore.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         chore.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || chore.category === selectedCategory;
    const matchesPriority = !selectedPriority || chore.priority === selectedPriority;
    const matchesPrice = !priceRange || (
      priceRange === 'low' && chore.price < 20 ||
      priceRange === 'medium' && chore.price >= 20 && chore.price <= 50 ||
      priceRange === 'high' && chore.price > 50
    );
    const notOwnChore = chore.postedBy !== user.name;
    const isActive = chore.status === 'active';
    
    return matchesSearch && matchesCategory && matchesPriority && matchesPrice && notOwnChore && isActive;
  });

  return (
    <div className="py-8">
      <div className="container">
        {/* Header */}
        <div className="mb-8">
          <h1>Browse Available Chores</h1>
          <p className="text-gray-600 text-large">
            Find chores that match your skills and earn money helping others.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="card mb-8">
          <div className="card-body">
            <div className="dashboard-grid mb-4">
              <div className="form-group" style={{ marginBottom: 0 }}>
                <div style={{ position: 'relative' }}>
                  <Search size={20} style={{ 
                    position: 'absolute', 
                    left: '12px', 
                    top: '50%', 
                    transform: 'translateY(-50%)',
                    color: 'var(--gray-400)'
                  }} />
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Search chores..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ paddingLeft: '44px' }}
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <select
                  className="form-select"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="dashboard-grid">
              <div className="form-group" style={{ marginBottom: 0 }}>
                <select
                  className="form-select"
                  value={selectedPriority}
                  onChange={(e) => setSelectedPriority(e.target.value)}
                >
                  <option value="">All Priorities</option>
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <select
                  className="form-select"
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                >
                  <option value="">All Prices</option>
                  <option value="low">Under $20</option>
                  <option value="medium">$20 - $50</option>
                  <option value="high">Over $50</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredChores.length} chore{filteredChores.length !== 1 ? 's' : ''}
            {searchTerm && ` matching "${searchTerm}"`}
          </p>
        </div>

        {/* Chores Grid */}
        {filteredChores.length > 0 ? (
          <div className="chore-grid">
            {filteredChores.map(chore => (
              <ChoreCard 
                key={chore.id} 
                chore={chore} 
                onAccept={() => onAcceptChore(chore.id)}
                showAcceptButton={true}
              />
            ))}
          </div>
        ) : (
          <div className="card text-center py-12">
            <Search size={64} className="text-gray-300 mb-4" style={{margin: '0 auto'}} />
            <h3 className="mb-2 text-gray-700">No chores found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || selectedCategory || selectedPriority || priceRange
                ? "Try adjusting your search filters to find more chores."
                : "There are no available chores at the moment. Check back later!"
              }
            </p>
            {(searchTerm || selectedCategory || selectedPriority || priceRange) && (
              <button 
                className="btn btn-primary"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('');
                  setSelectedPriority('');
                  setPriceRange('');
                }}
              >
                Clear All Filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowseChores;