/**
 * GPS Lab Platform - StudyForge Component
 * GPS 101 INTEGRATION: Shows GPS 101 study missions separately, tracks GPS 101 progress
 * 
 * Main study hub component that organizes study missions,
 * modules, and progress tracking. Acts as the central learning area.
 * 
 * @module components/study/StudyForge/StudyForge
 */

import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
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
  { value: 'new', label: 'New', icon: '🆕' },
  // NEW: GPS 101 filter
  { value: 'gps101', label: 'GPS 101', icon: '🎓' }
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
  // NEW: GPS 101 props
  gps101Missions = [],
  isGPS101Enrolled = false,
  gps101CurrentStage = 1,
  gps101Progress = 0,
  filterOptions = DEFAULT_FILTERS,
  onBack,
  onMissionSelect,
  onModuleStart,
  onStartStudy,
  children,
  className = '',
  ...props
}) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedMission, setSelectedMission] = useState(null);
  
  // Filter and search missions
  const filteredMissions = useMemo(() => {
    let missions = [...studyMissions];
    
    // Apply filter
    if (activeFilter !== 'all') {
      if (activeFilter === 'gps101') {
        // NEW: Show only GPS 101 missions
        missions = gps101Missions;
      } else {
        missions = missions.filter(mission => {
          // Exclude GPS 101 missions from other filters
          if (mission.isGPS101) return false;
          
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
  }, [studyMissions, gps101Missions, activeFilter, searchQuery, recommendedMissions]);
  
  // Group missions by category/stage
  const groupedMissions = useMemo(() => {
    const groups = {};
    
    // NEW: Separate GPS 101 grouping
    if (activeFilter === 'gps101') {
      filteredMissions.forEach(mission => {
        const category = `GPS 101 Stage ${mission.gps101StageNumber || 1}`;
        if (!groups[category]) {
          groups[category] = [];
        }
        groups[category].push(mission);
      });
    } else {
      filteredMissions.forEach(mission => {
        const category = mission.category || mission.stage || 'General';
        if (!groups[category]) {
          groups[category] = [];
        }
        groups[category].push(mission);
      });
    }
    
    return groups;
  }, [filteredMissions, activeFilter]);
  
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
    activeFilter === 'gps101' && 'study-forge--gps101',
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
        // NEW: GPS 101 header props
        isGPS101Enrolled={isGPS101Enrolled}
        gps101Progress={gps101Progress}
      />
      
      {/* Main Content */}
      <div className="study-forge__content">
        {/* Sidebar - Recently Accessed & Recommended */}
        <aside className="study-forge__sidebar">
          {/* NEW: GPS 101 Quick Access */}
          {isGPS101Enrolled && activeFilter !== 'gps101' && (
            <div className="study-forge__gps101-quick">
              <div className="study-forge__gps101-header">
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z"/>
                </svg>
                <h4>GPS 101 Progress</h4>
              </div>
              <div className="study-forge__gps101-progress">
                <span className="study-forge__gps101-stage">Stage {gps101CurrentStage}/5</span>
                <div className="study-forge__gps101-bar">
                  <div 
                    className="study-forge__gps101-fill"
                    style={{ width: `${gps101Progress}%` }}
                  />
                </div>
                <span className="study-forge__gps101-percent">{gps101Progress}%</span>
              </div>
              <button
                type="button"
                onClick={() => navigate('/gps-101')}
                className="study-forge__gps101-btn"
              >
                Continue GPS 101
              </button>
            </div>
          )}
          
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
                        {mission.isGPS101 ? `GPS 101 Stage ${mission.gps101StageNumber}` : `Stage ${mission.stage}`} • {mission.duration || '15 min'}
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
                    {mission.isGPS101 && (
                      <span className="study-forge__recent-gps101-badge">🎓</span>
                    )}
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
              {isGPS101Enrolled && (
                <li>GPS 101 missions earn special purpose-discovery badges</li>
              )}
              <li>Focus on weak areas identified in your last checkpoint</li>
              <li>Review at spaced intervals for better retention</li>
            </ul>
          </div>
        </aside>
        
        {/* Main Missions Grid */}
        <main className="study-forge__main">
          {/* NEW: GPS 101 Banner (when viewing GPS 101 filter) */}
          {activeFilter === 'gps101' && (
            <div className="study-forge__gps101-banner">
              <div className="study-forge__gps101-banner-content">
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0z"/>
                </svg>
                <div>
                  <h3>GPS 101 Basic: Purpose Discovery Journey</h3>
                  <p>Study missions designed to support your 15-week solo journey toward discovering your life purpose</p>
                </div>
              </div>
            </div>
          )}
          
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
                {activeFilter === 'gps101' ? (
                  <svg viewBox="0 0 20 20" fill="currentColor" className="study-forge__gps101-icon">
                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z"/>
                  </svg>
                ) : (
                  <span 
                    className="study-forge__group-beacon"
                    style={{ '--beacon-color': getBeaconColor(parseInt(category) || 1) }}
                  />
                )}
                {typeof category === 'number' || !isNaN(parseInt(category)) 
                  ? `Stage ${category}` 
                  : category}
                <span className="study-forge__group-count">{missions.length}</span>
              </h2>
              
              <div className="study-forge__missions-grid">
                {missions.map((mission) => (
                  <article
                    key={mission.id}
                    className={`study-forge__mission-card ${selectedMission?.id === mission.id ? 'study-forge__mission-card--selected' : ''} ${mission.status === 'completed' ? 'study-forge__mission-card--completed' : ''} ${mission.isGPS101 ? 'study-forge__mission-card--gps101' : ''}`}
                    onClick={() => handleMissionSelect(mission)}
                    style={{ '--beacon-color': mission.isGPS101 ? '#667eea' : getBeaconColor(mission.stage) }}
                  >
                    <div className="study-forge__mission-header">
                      <span className="study-forge__mission-beacon" />
                      <div className="study-forge__mission-badges">
                        {mission.isGPS101 && (
                          <span className="study-forge__badge study-forge__badge--gps101">GPS 101</span>
                        )}
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
                      {mission.isGPS101 && mission.gps101R2RReward && (
                        <span className="study-forge__mission-r2r">
                          +{mission.gps101R2RReward} R2R
                        </span>
                      )}
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