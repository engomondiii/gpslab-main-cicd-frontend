/**
 * GPS Lab Platform - PartyList Component
 * 
 * List of parties with filtering, searching, and sorting capabilities.
 * Shows both user's parties and discoverable public parties.
 * 
 * @module components/party/PartyList/PartyList
 */

import React, { useState, useMemo, useCallback } from 'react';
import PartyListItem from './PartyListItem';
import './PartyList.css';

/**
 * Filter options
 */
const FILTER_OPTIONS = [
  { id: 'all', label: 'All Parties' },
  { id: 'my-parties', label: 'My Parties' },
  { id: 'active', label: 'Active Now' },
  { id: 'recruiting', label: 'Recruiting' },
  { id: 'stage', label: 'By Stage' }
];

/**
 * Sort options
 */
const SORT_OPTIONS = [
  { id: 'recent', label: 'Most Recent' },
  { id: 'members', label: 'Most Members' },
  { id: 'activity', label: 'Most Active' },
  { id: 'name', label: 'Name (A-Z)' }
];

/**
 * PartyList Component
 */
const PartyList = ({
  parties = [],
  myPartyIds = [],
  onPartySelect,
  onPartyJoin,
  onCreateParty,
  isLoading = false,
  className = '',
  ...props
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [stageFilter, setStageFilter] = useState(null);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  
  // Filter and sort parties
  const filteredParties = useMemo(() => {
    let result = [...parties];
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(party => 
        party.name.toLowerCase().includes(query) ||
        party.description?.toLowerCase().includes(query)
      );
    }
    
    // Category filter
    switch (activeFilter) {
      case 'my-parties':
        result = result.filter(party => myPartyIds.includes(party.id));
        break;
      case 'active':
        result = result.filter(party => party.isActive);
        break;
      case 'recruiting':
        result = result.filter(party => party.memberCount < party.maxMembers && party.isPublic);
        break;
      case 'stage':
        if (stageFilter) {
          result = result.filter(party => party.stage === stageFilter);
        }
        break;
      default:
        break;
    }
    
    // Sort
    switch (sortBy) {
      case 'members':
        result.sort((a, b) => b.memberCount - a.memberCount);
        break;
      case 'activity':
        result.sort((a, b) => new Date(b.lastActivity) - new Date(a.lastActivity));
        break;
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'recent':
      default:
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
    }
    
    return result;
  }, [parties, searchQuery, activeFilter, sortBy, stageFilter, myPartyIds]);
  
  // My parties for quick access
  const myParties = useMemo(() => {
    return parties.filter(party => myPartyIds.includes(party.id));
  }, [parties, myPartyIds]);
  
  const handleSearchChange = useCallback((e) => {
    setSearchQuery(e.target.value);
  }, []);
  
  const handleFilterChange = useCallback((filterId) => {
    setActiveFilter(filterId);
    if (filterId !== 'stage') {
      setStageFilter(null);
    }
  }, []);
  
  const classNames = [
    'party-list',
    isLoading && 'party-list--loading',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className={classNames} {...props}>
      {/* Header */}
      <div className="party-list__header">
        <div className="party-list__title-section">
          <div className="party-list__icon">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <h2 className="party-list__title">Party Finder</h2>
            <p className="party-list__subtitle">
              Join forces with fellow GPS explorers
            </p>
          </div>
        </div>
        
        {onCreateParty && (
          <button
            type="button"
            onClick={onCreateParty}
            className="party-list__create-btn"
          >
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"/>
            </svg>
            Create Party
          </button>
        )}
      </div>
      
      {/* Search & Filters */}
      <div className="party-list__controls">
        <div className="party-list__search">
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"/>
          </svg>
          <input
            type="text"
            placeholder="Search parties..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="party-list__search-input"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="party-list__search-clear"
            >
              ✕
            </button>
          )}
        </div>
        
        <div className="party-list__filters">
          {FILTER_OPTIONS.map(filter => (
            <button
              key={filter.id}
              type="button"
              className={`party-list__filter ${activeFilter === filter.id ? 'party-list__filter--active' : ''}`}
              onClick={() => handleFilterChange(filter.id)}
            >
              {filter.label}
            </button>
          ))}
        </div>
        
        {/* Stage Filter (when stage filter is active) */}
        {activeFilter === 'stage' && (
          <div className="party-list__stage-filters">
            {[1, 2, 3, 4, 5, 6, 7].map(stage => (
              <button
                key={stage}
                type="button"
                className={`party-list__stage-btn ${stageFilter === stage ? 'party-list__stage-btn--active' : ''}`}
                onClick={() => setStageFilter(stageFilter === stage ? null : stage)}
              >
                {stage}
              </button>
            ))}
          </div>
        )}
        
        {/* Sort Dropdown */}
        <div className="party-list__sort">
          <button
            type="button"
            className="party-list__sort-trigger"
            onClick={() => setShowSortDropdown(!showSortDropdown)}
          >
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path d="M3 3a1 1 0 000 2h11a1 1 0 100-2H3zM3 7a1 1 0 000 2h7a1 1 0 100-2H3zM3 11a1 1 0 100 2h4a1 1 0 100-2H3z"/>
            </svg>
            {SORT_OPTIONS.find(s => s.id === sortBy)?.label}
          </button>
          {showSortDropdown && (
            <div className="party-list__sort-dropdown">
              {SORT_OPTIONS.map(option => (
                <button
                  key={option.id}
                  type="button"
                  className={`party-list__sort-option ${sortBy === option.id ? 'party-list__sort-option--active' : ''}`}
                  onClick={() => {
                    setSortBy(option.id);
                    setShowSortDropdown(false);
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* My Parties Quick Access */}
      {myParties.length > 0 && activeFilter !== 'my-parties' && (
        <div className="party-list__my-parties">
          <h3 className="party-list__section-title">My Parties</h3>
          <div className="party-list__my-parties-grid">
            {myParties.slice(0, 3).map(party => (
              <PartyListItem
                key={party.id}
                variant="compact"
                onSelect={onPartySelect}
                {...party}
              />
            ))}
          </div>
        </div>
      )}
      
      {/* Party List */}
      <div className="party-list__content">
        <div className="party-list__section-header">
          <h3 className="party-list__section-title">
            {activeFilter === 'my-parties' ? 'My Parties' : 'Available Parties'}
          </h3>
          <span className="party-list__count">
            {filteredParties.length} {filteredParties.length === 1 ? 'party' : 'parties'}
          </span>
        </div>
        
        {isLoading ? (
          <div className="party-list__loading">
            <div className="party-list__spinner" />
            <span>Loading parties...</span>
          </div>
        ) : filteredParties.length > 0 ? (
          <div className="party-list__items">
            {filteredParties.map(party => (
              <PartyListItem
                key={party.id}
                role={myPartyIds.includes(party.id) ? party.userRole : null}
                onSelect={onPartySelect}
                onJoin={!myPartyIds.includes(party.id) ? onPartyJoin : null}
                {...party}
              />
            ))}
          </div>
        ) : (
          <div className="party-list__empty">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <h4>No parties found</h4>
            <p>
              {searchQuery 
                ? 'Try adjusting your search or filters'
                : 'Be the first to create a party!'}
            </p>
            {onCreateParty && (
              <button
                type="button"
                onClick={onCreateParty}
                className="party-list__empty-btn"
              >
                Create Party
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PartyList;