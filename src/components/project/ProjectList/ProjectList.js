/**
 * GPS Lab Platform - ProjectList Component
 * 
 * Container component for displaying and filtering projects
 * with search, sort, and view options.
 * 
 * @module components/project/ProjectList/ProjectList
 */

import React, { useState, useMemo, useCallback } from 'react';
import ProjectListItem from './ProjectListItem';
import './ProjectList.css';

/**
 * Stage configurations
 */
const STAGES = [
  { value: 1, label: 'Spark', color: 'var(--beacon-red)' },
  { value: 2, label: 'Explore', color: 'var(--beacon-orange)' },
  { value: 3, label: 'Design', color: 'var(--beacon-yellow)' },
  { value: 4, label: 'Build', color: 'var(--beacon-green)' },
  { value: 5, label: 'Test', color: 'var(--beacon-blue)' },
  { value: 6, label: 'Launch', color: 'var(--beacon-indigo)' },
  { value: 7, label: 'Scale', color: 'var(--beacon-purple)' }
];

/**
 * Status configurations
 */
const STATUSES = [
  { value: 'all', label: 'All Projects' },
  { value: 'active', label: 'Active' },
  { value: 'paused', label: 'Paused' },
  { value: 'completed', label: 'Completed' },
  { value: 'archived', label: 'Archived' }
];

/**
 * Sort options
 */
const SORT_OPTIONS = [
  { value: 'recent', label: 'Recently Updated' },
  { value: 'created', label: 'Newest First' },
  { value: 'name', label: 'Name (A-Z)' },
  { value: 'progress', label: 'Progress' },
  { value: 'stage', label: 'Stage' },
  { value: 'impact', label: 'Impact' }
];

/**
 * ProjectList Component
 */
const ProjectList = ({
  projects = [],
  myProjects = [],
  onProjectSelect,
  onProjectEdit,
  onCreateProject,
  isLoading = false,
  currentUserId,
  showMyProjects = true,
  className = '',
  ...props
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [stageFilter, setStageFilter] = useState(null);
  const [sortBy, setSortBy] = useState('recent');
  const [viewMode, setViewMode] = useState('grid'); // grid, list
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter and sort projects
  const filteredProjects = useMemo(() => {
    let filtered = [...projects];
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.name?.toLowerCase().includes(query) ||
        p.description?.toLowerCase().includes(query) ||
        p.category?.toLowerCase().includes(query) ||
        p.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(p => p.status === statusFilter);
    }
    
    // Stage filter
    if (stageFilter !== null) {
      filtered = filtered.filter(p => p.stage === stageFilter);
    }
    
    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'created':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'name':
          return a.name.localeCompare(b.name);
        case 'progress':
          return (b.progress || 0) - (a.progress || 0);
        case 'stage':
          return (b.stage || 1) - (a.stage || 1);
        case 'impact':
          return (b.impact?.customers || 0) - (a.impact?.customers || 0);
        case 'recent':
        default:
          return new Date(b.updatedAt) - new Date(a.updatedAt);
      }
    });
    
    return filtered;
  }, [projects, searchQuery, statusFilter, stageFilter, sortBy]);
  
  // Featured projects (first 3 completed or high-impact)
  const featuredProjects = useMemo(() => {
    return projects
      .filter(p => p.isFeatured || p.status === 'completed')
      .slice(0, 3);
  }, [projects]);
  
  const handleClearFilters = useCallback(() => {
    setSearchQuery('');
    setStatusFilter('all');
    setStageFilter(null);
    setSortBy('recent');
  }, []);
  
  const hasActiveFilters = searchQuery || statusFilter !== 'all' || stageFilter !== null;
  
  const classNames = [
    'project-list',
    `project-list--${viewMode}`,
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className={classNames} {...props}>
      {/* Header */}
      <header className="project-list__header">
        <div className="project-list__title-row">
          <div className="project-list__title-section">
            <div className="project-list__icon">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <h1 className="project-list__title">Projects</h1>
              <p className="project-list__subtitle">
                {filteredProjects.length} {filteredProjects.length === 1 ? 'project' : 'projects'} 
                {hasActiveFilters && ' (filtered)'}
              </p>
            </div>
          </div>
          
          {onCreateProject && (
            <button
              type="button"
              onClick={onCreateProject}
              className="project-list__create-btn"
            >
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"/>
              </svg>
              New Project
            </button>
          )}
        </div>
        
        {/* Search & Controls */}
        <div className="project-list__controls">
          <div className="project-list__search">
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"/>
            </svg>
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="project-list__search-input"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="project-list__search-clear"
              >
                ✕
              </button>
            )}
          </div>
          
          <div className="project-list__control-group">
            <button
              type="button"
              className={`project-list__filter-toggle ${showFilters ? 'project-list__filter-toggle--active' : ''}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd"/>
              </svg>
              Filters
              {hasActiveFilters && <span className="project-list__filter-badge">●</span>}
            </button>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="project-list__sort-select"
            >
              {SORT_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            
            <div className="project-list__view-toggle">
              <button
                type="button"
                className={`project-list__view-btn ${viewMode === 'grid' ? 'project-list__view-btn--active' : ''}`}
                onClick={() => setViewMode('grid')}
                title="Grid View"
              >
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
                </svg>
              </button>
              <button
                type="button"
                className={`project-list__view-btn ${viewMode === 'list' ? 'project-list__view-btn--active' : ''}`}
                onClick={() => setViewMode('list')}
                title="List View"
              >
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        {/* Expanded Filters */}
        {showFilters && (
          <div className="project-list__filters">
            {/* Status Filter */}
            <div className="project-list__filter-section">
              <span className="project-list__filter-label">Status</span>
              <div className="project-list__filter-tabs">
                {STATUSES.map(status => (
                  <button
                    key={status.value}
                    type="button"
                    className={`project-list__filter-tab ${statusFilter === status.value ? 'project-list__filter-tab--active' : ''}`}
                    onClick={() => setStatusFilter(status.value)}
                  >
                    {status.label}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Stage Filter */}
            <div className="project-list__filter-section">
              <span className="project-list__filter-label">Stage</span>
              <div className="project-list__stage-filters">
                <button
                  type="button"
                  className={`project-list__stage-btn ${stageFilter === null ? 'project-list__stage-btn--active' : ''}`}
                  onClick={() => setStageFilter(null)}
                >
                  All
                </button>
                {STAGES.map(stage => (
                  <button
                    key={stage.value}
                    type="button"
                    className={`project-list__stage-btn ${stageFilter === stage.value ? 'project-list__stage-btn--active' : ''}`}
                    style={{ '--stage-color': stage.color }}
                    onClick={() => setStageFilter(stage.value)}
                  >
                    <span className="project-list__stage-beacon" />
                    {stage.value}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Clear Filters */}
            {hasActiveFilters && (
              <button
                type="button"
                className="project-list__clear-filters"
                onClick={handleClearFilters}
              >
                Clear all filters
              </button>
            )}
          </div>
        )}
      </header>
      
      {/* My Projects Section */}
      {showMyProjects && myProjects.length > 0 && !hasActiveFilters && (
        <section className="project-list__my-projects">
          <h2 className="project-list__section-title">
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
            </svg>
            My Projects
          </h2>
          <div className="project-list__my-projects-grid">
            {myProjects.slice(0, 3).map(project => (
              <ProjectListItem
                key={project.id}
                {...project}
                variant="compact"
                isOwner={true}
                onSelect={onProjectSelect}
                onEdit={onProjectEdit}
              />
            ))}
          </div>
        </section>
      )}
      
      {/* Featured Projects */}
      {featuredProjects.length > 0 && !hasActiveFilters && (
        <section className="project-list__featured">
          <h2 className="project-list__section-title">
            <span className="project-list__section-icon">⭐</span>
            Featured Projects
          </h2>
          <div className="project-list__featured-grid">
            {featuredProjects.map(project => (
              <ProjectListItem
                key={project.id}
                {...project}
                variant="featured"
                onSelect={onProjectSelect}
              />
            ))}
          </div>
        </section>
      )}
      
      {/* Main Project Grid */}
      <section className="project-list__main">
        {hasActiveFilters && (
          <h2 className="project-list__section-title">
            Search Results ({filteredProjects.length})
          </h2>
        )}
        
        {isLoading ? (
          <div className="project-list__loading">
            <div className="project-list__spinner" />
            <p>Loading projects...</p>
          </div>
        ) : filteredProjects.length > 0 ? (
          <div className={`project-list__grid project-list__grid--${viewMode}`}>
            {filteredProjects.map(project => (
              <ProjectListItem
                key={project.id}
                {...project}
                isOwner={project.ownerId === currentUserId || myProjects.some(p => p.id === project.id)}
                onSelect={onProjectSelect}
                onEdit={onProjectEdit}
              />
            ))}
          </div>
        ) : (
          <div className="project-list__empty">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <h3>No projects found</h3>
            <p>
              {hasActiveFilters
                ? 'Try adjusting your filters or search query'
                : 'Start your GPS journey by creating your first project'}
            </p>
            {onCreateProject && !hasActiveFilters && (
              <button
                type="button"
                onClick={onCreateProject}
                className="project-list__empty-btn"
              >
                Create Your First Project
              </button>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default ProjectList;