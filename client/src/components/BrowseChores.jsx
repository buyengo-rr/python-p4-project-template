import React, { useState, useCallback, useEffect } from 'react';
import { Search } from 'lucide-react';
import ChoreCard from './ChoreCard';

const BrowseChores = ({ chores, onAcceptChore, user, onRefreshChores }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [isAccepting, setIsAccepting] = useState(null); // Track which chore is being accepted
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Refresh chores when component mounts
  useEffect(() => {
    const refreshData = async () => {
      if (onRefreshChores) {
        setIsRefreshing(true);
        try {
          await onRefreshChores();
        } catch (err) {
          console.error('Failed to refresh chores:', err);
        } finally {
          setIsRefreshing(false);
        }
      }
    };

    refreshData();
  }, [onRefreshChores]);

  // Get unique categories from available chores (excluding user's own chores)
  const availableChores = chores.filter(chore => 
    chore.postedBy !== user.name && chore.status === 'active'
  );
  const categories = [...new Set(availableChores.map(chore => chore.category))].filter(Boolean);

  const filteredChores = availableChores.filter(chore => {
    const matchesSearch = chore.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         chore.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || chore.category === selectedCategory;
    const matchesPriority = !selectedPriority || chore.priority === selectedPriority;
    const matchesPrice = !priceRange || (
      (priceRange === 'low' && chore.price < 20) ||
      (priceRange === 'medium' && chore.price >= 20 && chore.price <= 50) ||
      (priceRange === 'high' && chore.price > 50)
    );
    
    return matchesSearch && matchesCategory && matchesPriority && matchesPrice;
  });

  const handleAcceptChore = useCallback(async (choreId) => {
    setIsAccepting(choreId);
    try {
      await onAcceptChore(choreId);
      // Refresh the chores list after accepting to get the latest data
      if (onRefreshChores) {
        await onRefreshChores();
      }
    } catch (err) {
      console.error('Failed to accept chore:', err);
      // Error handling is managed by parent component
    } finally {
      setIsAccepting(null);
    }
  }, [onAcceptChore, onRefreshChores]);

  const handleRefresh = useCallback(async () => {
    if (onRefreshChores) {
      setIsRefreshing(true);
      try {
        await onRefreshChores();
      } catch (err) {
        console.error('Failed to refresh chores:', err);
      } finally {
        setIsRefreshing(false);
      }
    }
  }, [onRefreshChores]);

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedPriority('');
    setPriceRange('');
  };

  const hasActiveFilters = searchTerm || selectedCategory || selectedPriority || priceRange;

  return (
    <div className="py-8">
      <div className="container">
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1>Browse Available Chores</h1>
              <p className="text-gray-600 text-large">
                Find chores that match your skills and earn money helping others.
              </p>
            </div>
            <button 
              className={`btn btn-secondary ${isRefreshing ? 'opacity-50' : ''}`}
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>

        {/* Search and Filter Section */}
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
                    placeholder="Search chores by title or description..."
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
                  <option value="urgent">Urgent</option>
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

            {hasActiveFilters && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <button 
                  className="btn btn-secondary btn-sm"
                  onClick={clearAllFilters}
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Results Summary */}
        <div className="mb-6 flex justify-between items-center">
          <p className="text-gray-600">
            Showing {filteredChores.length} available chore{filteredChores.length !== 1 ? 's' : ''}
            {searchTerm && ` matching "${searchTerm}"`}
            {isRefreshing && <span className="text-sm ml-2">(refreshing...)</span>}
          </p>
          {filteredChores.length > 0 && (
            <div className="text-sm text-gray-500">
              Total value: ${filteredChores.reduce((sum, chore) => sum + (chore.price || 0), 0).toFixed(2)}
            </div>
          )}
        </div>

        {/* Chores Grid */}
        {filteredChores.length > 0 ? (
          <div className="chore-grid">
            {filteredChores.map(chore => (
              <ChoreCard 
                key={chore.id} 
                chore={chore} 
                onAccept={() => handleAcceptChore(chore.id)}
                showAcceptButton={true}
                disabled={isAccepting === chore.id || isRefreshing}
                isLoading={isAccepting === chore.id}
              />
            ))}
          </div>
        ) : (
          <div className="card text-center py-12">
            <Search size={64} className="text-gray-300 mb-4" style={{margin: '0 auto'}} />
            <h3 className="mb-2 text-gray-700">
              {isRefreshing ? 'Loading chores...' : 
               availableChores.length === 0 ? 'No chores available' : 'No chores found'}
            </h3>
            <p className="text-gray-600 mb-6">
              {isRefreshing ? 'Please wait while we fetch the latest chores.' :
               availableChores.length === 0 
                ? "There are no available chores at the moment. Check back later or ask friends to post some chores!"
                : hasActiveFilters
                  ? "Try adjusting your search filters to find more chores."
                  : "All available chores are currently filtered out."
              }
            </p>
            {hasActiveFilters && !isRefreshing && (
              <button 
                className="btn btn-primary"
                onClick={clearAllFilters}
              >
                Clear All Filters
              </button>
            )}
          </div>
        )}

        {/* Stats Section */}
        {availableChores.length > 0 && !isRefreshing && (
          <div className="mt-8 p-6 bg-gray-50 rounded-lg">
            <h4 className="mb-3 text-gray-700">Browse Statistics</h4>
            <div className="dashboard-grid text-center">
              <div>
                <div className="text-2xl font-bold text-primary">{availableChores.length}</div>
                <div className="text-sm text-gray-600">Total Available</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-success">
                  ${availableChores.reduce((sum, chore) => sum + (chore.price || 0), 0).toFixed(2)}
                </div>
                <div className="text-sm text-gray-600">Total Value</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-accent">{categories.length}</div>
                <div className="text-sm text-gray-600">Categories</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-secondary">
                  ${availableChores.length > 0 
                    ? (availableChores.reduce((sum, chore) => sum + (chore.price || 0), 0) / availableChores.length).toFixed(2)
                    : '0.00'
                  }
                </div>
                <div className="text-sm text-gray-600">Average Price</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowseChores;