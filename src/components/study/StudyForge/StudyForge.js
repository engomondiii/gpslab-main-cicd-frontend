/**
 * GPS Lab Platform - StudyForge Component
 * 
 * Main study hub component that organizes study missions,
 * modules, and progress tracking. Acts as the central learning area.
 * 
 * @module components/study/StudyForge/StudyForge
 */

import React, { useState, useMemo, useCallback } from 'react';
import StudyForgeHeader from './StudyForgeHeader';
import './StudyForge.css';

/**
 * Default filter options for study content
 */
const DEFAULT_FILTERS = [
  { value: 'all', label: 'All', icon: '📚' },
  { value: 'recommended', label: 'Recommended', icon: '⭐' },
  { value: 'in_progress', label: 'In Progress', icon: '🔄' },
  { value: 'completed', label: 'Completed', icon: '✅' },
  { value: 'new', label: 'New', icon: '🆕' }
];

/**
 * StudyForge Component
 */
const StudyForge = ({
  title = 'Study Forge',
  subtitle = 'Master concepts and prepare for checkpoints',
  stats = {},
  studyMissions = [],
  recommendedMissions = [],
  recentlyAccessed = [],
  filterOptions = DEFAULT_FILTERS,
  onBack,
  onMissionSelect,
  onModuleStart,
  onStartStudy,
  children,
  className = '',
  ...props
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedMission, setSelectedMission] = useState(null);
  
  // Filter and search missions
  const filteredMissions = useMemo(() => {
    let missions = [...studyMissions];
    
    // Apply filter
    if (activeFilter !== 'all') {
      missions = missions.filter(mission => {
        switch (activeFilter) {
          case 'recommended':
            return recommendedMissions.some(r => r.id === mission.id);
          case 'in_progress':
            return mission.status === 'in_progress';
          case 'completed':
            return mission.status === 'completed';
          case 'new':
            return mission.isNew || !mission.lastAccessed;
          default:
            return true;
        }
      });
    }
    
    // Apply search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      missions = missions.filter(mission =>
        mission.title?.toLowerCase().includes(query) ||
        mission.description?.toLowerCase().includes(query) ||
        mission.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    return missions;
  }, [studyMissions, activeFilter, searchQuery, recommendedMissions]);
  
  // Group missions by category/stage
  const groupedMissions = useMemo(() => {
    const groups = {};
    
    filteredMissions.forEach(mission => {
      const category = mission.category || mission.stage || 'General';
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(mission);
    });
    
    return groups;
  }, [filteredMissions]);
  
  // Handle search
  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
  }, []);
  
  // Handle filter change
  const handleFilterChange = useCallback((filter) => {
    setActiveFilter(filter);
  }, []);
  
  // Handle mission selection
  const handleMissionSelect = useCallback((mission) => {
    setSelectedMission(mission);
    if (onMissionSelect) {
      onMissionSelect(mission);
    }
  }, [onMissionSelect]);
  
  // Get beacon color for stage
  const getBeaconColor = (stage) => {
    const colors = {
      1: 'var(--beacon-red, #e74c3c)',
      2: 'var(--beacon-orange, #f39c12)',
      3: 'var(--beacon-yellow, #f1c40f)',
      4: 'var(--beacon-green, #2ecc71)',
      5: 'var(--beacon-blue, #3498db)',
      6: 'var(--beacon-indigo, #9b59b6)',
      7: 'var(--beacon-purple, #8e44ad)'
    };
    return colors[stage] || 'var(--gps-primary, #00d4ff)';
  };
  
  const classNames = [
    'study-forge',
    selectedMission && 'study-forge--mission-selected',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className={classNames} {...props}>
      {/* Header */}
      <StudyForgeHeader
        title={title}
        subtitle={subtitle}
        stats={stats}
        onBack={onBack}
        onSearch={handleSearch}
        searchQuery={searchQuery}
        filterOptions={filterOptions}
        activeFilter={activeFilter}
        onFilterChange={handleFilterChange}
      />
      
      {/* Main Content */}
      <div className="study-forge__content">
        {/* Sidebar - Recently Accessed & Recommended */}
        <aside className="study-forge__sidebar">
          {/* Quick Start */}
          {onStartStudy && (
            <div className="study-forge__quick-start">
              <button
                type="button"
                onClick={onStartStudy}
                className="study-forge__start-btn"
              >
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"/>
                </svg>
                Continue Studying
              </button>
            </div>
          )}
          
          {/* Recommended */}
          {recommendedMissions.length > 0 && (
            <div className="study-forge__section study-forge__section--recommended">
              <h3 className="study-forge__section-title">
                <span className="study-forge__section-icon">⭐</span>
                Recommended for You
              </h3>
              <div className="study-forge__recommended-list">
                {recommendedMissions.slice(0, 3).map((mission) => (
                  <button
                    key={mission.id}
                    type="button"
                    className="study-forge__recommended-item"
                    onClick={() => handleMissionSelect(mission)}
                    style={{ '--beacon-color': getBeaconColor(mission.stage) }}
                  >
                    <span className="study-forge__recommended-beacon" />
                    <div className="study-forge__recommended-info">
                      <span className="study-forge__recommended-title">{mission.title}</span>
                      <span className="study-forge__recommended-meta">
                        Stage {mission.stage} • {mission.duration || '15 min'}
                      </span>
                    </div>
                    <svg viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/>
                    </svg>
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Recently Accessed */}
          {recentlyAccessed.length > 0 && (
            <div className="study-forge__section study-forge__section--recent">
              <h3 className="study-forge__section-title">
                <span className="study-forge__section-icon">🕐</span>
                Recently Accessed
              </h3>
              <div className="study-forge__recent-list">
                {recentlyAccessed.slice(0, 5).map((mission) => (
                  <button
                    key={mission.id}
                    type="button"
                    className="study-forge__recent-item"
                    onClick={() => handleMissionSelect(mission)}
                  >
                    <span className="study-forge__recent-title">{mission.title}</span>
                    <span className="study-forge__recent-progress">
                      {mission.progress || 0}%
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Study Tips */}
          <div className="study-forge__tips">
            <h3 className="study-forge__section-title">
              <span className="study-forge__section-icon">💡</span>
              Study Tips
            </h3>
            <ul className="study-forge__tips-list">
              <li>Complete study missions to earn R2R for checkpoints</li>
              <li>Focus on weak areas identified in your last checkpoint</li>
              <li>Review at spaced intervals for better retention</li>
            </ul>
          </div>
        </aside>
        
        {/* Main Missions Grid */}
        <main className="study-forge__main">
          {/* Results Info */}
          {searchQuery && (
            <div className="study-forge__results-info">
              Found {filteredMissions.length} mission{filteredMissions.length !== 1 ? 's' : ''} 
              {searchQuery && ` for "${searchQuery}"`}
            </div>
          )}
          
          {/* Empty State */}
          {filteredMissions.length === 0 && (
            <div className="study-forge__empty">
              <div className="study-forge__empty-icon">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M9.172 14.828L12 12m0 0l2.828-2.828M12 12L9.172 9.172M12 12l2.828 2.828M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3>No Study Missions Found</h3>
              <p>Try adjusting your search or filters</p>
              <button
                type="button"
                className="study-forge__clear-btn"
                onClick={() => {
                  setSearchQuery('');
                  setActiveFilter('all');
                }}
              >
                Clear Filters
              </button>
            </div>
          )}
          
          {/* Mission Groups */}
          {Object.entries(groupedMissions).map(([category, missions]) => (
            <div key={category} className="study-forge__group">
              <h2 className="study-forge__group-title">
                <span 
                  className="study-forge__group-beacon"
                  style={{ '--beacon-color': getBeaconColor(parseInt(category) || 1) }}
                />
                {typeof category === 'number' || !isNaN(parseInt(category)) 
                  ? `Stage ${category}` 
                  : category}
                <span className="study-forge__group-count">{missions.length}</span>
              </h2>
              
              <div className="study-forge__missions-grid">
                {missions.map((mission) => (
                  <article
                    key={mission.id}
                    className={`study-forge__mission-card ${selectedMission?.id === mission.id ? 'study-forge__mission-card--selected' : ''} ${mission.status === 'completed' ? 'study-forge__mission-card--completed' : ''}`}
                    onClick={() => handleMissionSelect(mission)}
                    style={{ '--beacon-color': getBeaconColor(mission.stage) }}
                  >
                    <div className="study-forge__mission-header">
                      <span className="study-forge__mission-beacon" />
                      <div className="study-forge__mission-badges">
                        {mission.isNew && (
                          <span className="study-forge__badge study-forge__badge--new">New</span>
                        )}
                        {mission.isRequired && (
                          <span className="study-forge__badge study-forge__badge--required">Required</span>
                        )}
                      </div>
                    </div>
                    
                    <h3 className="study-forge__mission-title">{mission.title}</h3>
                    <p className="study-forge__mission-description">
                      {mission.description}
                    </p>
                    
                    <div className="study-forge__mission-meta">
                      <span className="study-forge__mission-duration">
                        <svg viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                        </svg>
                        {mission.duration || '15 min'}
                      </span>
                      <span className="study-forge__mission-modules">
                        {mission.moduleCount || 0} modules
                      </span>
                    </div>
                    
                    {/* Progress */}
                    {mission.progress !== undefined && mission.progress > 0 && (
                      <div className="study-forge__mission-progress">
                        <div className="study-forge__mission-progress-bar">
                          <div 
                            className="study-forge__mission-progress-fill"
                            style={{ width: `${mission.progress}%` }}
                          />
                        </div>
                        <span className="study-forge__mission-progress-text">
                          {mission.progress}%
                        </span>
                      </div>
                    )}
                    
                    {/* Completed Indicator */}
                    {mission.status === 'completed' && (
                      <div className="study-forge__mission-completed">
                        <svg viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                        </svg>
                        Completed
                      </div>
                    )}
                  </article>
                ))}
              </div>
            </div>
          ))}
          
          {/* Custom children content */}
          {children}
        </main>
      </div>
    </div>
  );
};

export default StudyForge;