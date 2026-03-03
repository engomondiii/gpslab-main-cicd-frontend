/**
 * GPS Lab Platform - BiteBoard Component
 * GPS 101 INTEGRATION: Recognizes GPS 101 missions' bites, shows GPS 101 context
 * 
 * Kanban board for managing bite tasks across status columns.
 * 
 * @module components/bite/BiteBoard/BiteBoard
 */

import React, { useState, useMemo, useCallback } from 'react';
import BiteBoardColumn from './BiteBoardColumn';
import { BITE_STATUS } from '../BiteList/BiteListItem';
import './BiteBoard.css';

/**
 * Default column configuration
 */
const DEFAULT_COLUMNS = [
  { status: 'backlog', wipLimit: null },
  { status: 'planned', wipLimit: null },
  { status: 'in_progress', wipLimit: 5 },
  { status: 'review', wipLimit: 3 },
  { status: 'completed', wipLimit: null }
];

/**
 * BiteBoard Component
 */
const BiteBoard = ({
  bites = [],
  columns = DEFAULT_COLUMNS,
  title = 'Task Board',
  subtitle,
  missionId,
  missionTitle,
  // NEW: GPS 101 props
  isGPS101 = false,
  gps101StageNumber,
  gps101StageQuestion,
  gps101DeliverableName,
  onBiteClick,
  onBiteStatusChange,
  onAddBite,
  onRefresh,
  showHeader = true,
  showFilters = true,
  showBlockedColumn = false,
  isLoading = false,
  className = '',
  ...props
}) => {
  const [collapsedColumns, setCollapsedColumns] = useState(new Set());
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [filterAssignee, setFilterAssignee] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  /**
   * Toggle column collapse
   */
  const handleToggleCollapse = useCallback((columnId) => {
    setCollapsedColumns(prev => {
      const next = new Set(prev);
      if (next.has(columnId)) {
        next.delete(columnId);
      } else {
        next.add(columnId);
      }
      return next;
    });
  }, []);
  
  /**
   * Handle bite drop (status change)
   */
  const handleBiteDrop = useCallback((biteId, newStatus) => {
    const bite = bites.find(b => b.id === biteId);
    if (bite && bite.status !== newStatus && onBiteStatusChange) {
      onBiteStatusChange(biteId, newStatus, bite.status);
    }
  }, [bites, onBiteStatusChange]);
  
  /**
   * Filter bites
   */
  const filteredBites = useMemo(() => {
    let result = [...bites];
    
    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(bite => 
        bite.title?.toLowerCase().includes(query) ||
        bite.id?.toLowerCase().includes(query)
      );
    }
    
    // Apply priority filter
    if (filterPriority !== 'all') {
      result = result.filter(bite => bite.priority === filterPriority);
    }
    
    // Apply type filter
    if (filterType !== 'all') {
      result = result.filter(bite => bite.type === filterType);
    }
    
    // Apply assignee filter
    if (filterAssignee !== 'all') {
      if (filterAssignee === 'unassigned') {
        result = result.filter(bite => !bite.assignee);
      } else {
        result = result.filter(bite => bite.assignee?.id === filterAssignee);
      }
    }
    
    return result;
  }, [bites, searchQuery, filterPriority, filterType, filterAssignee]);
  
  /**
   * Group bites by status
   */
  const bitesByStatus = useMemo(() => {
    const grouped = {};
    
    // Initialize all columns
    columns.forEach(col => {
      grouped[col.status] = [];
    });
    
    // Add blocked column if enabled
    if (showBlockedColumn) {
      grouped['blocked'] = [];
    }
    
    // Distribute bites
    filteredBites.forEach(bite => {
      const status = bite.blockedBy?.length > 0 && showBlockedColumn ? 'blocked' : bite.status;
      if (grouped[status]) {
        grouped[status].push(bite);
      } else if (grouped['backlog']) {
        grouped['backlog'].push(bite);
      }
    });
    
    return grouped;
  }, [filteredBites, columns, showBlockedColumn]);
  
  /**
   * Get unique assignees
   */
  const assignees = useMemo(() => {
    const unique = new Map();
    bites.forEach(bite => {
      if (bite.assignee?.id) {
        unique.set(bite.assignee.id, bite.assignee);
      }
    });
    return Array.from(unique.values());
  }, [bites]);
  
  /**
   * Board stats
   */
  const stats = useMemo(() => ({
    total: bites.length,
    completed: bites.filter(b => b.status === 'completed').length,
    inProgress: bites.filter(b => b.status === 'in_progress').length,
    blocked: bites.filter(b => b.blockedBy?.length > 0).length
  }), [bites]);
  
  /**
   * Clear filters
   */
  const clearFilters = useCallback(() => {
    setSearchQuery('');
    setFilterPriority('all');
    setFilterType('all');
    setFilterAssignee('all');
  }, []);
  
  const hasActiveFilters = searchQuery || filterPriority !== 'all' || filterType !== 'all' || filterAssignee !== 'all';
  
  // Columns to render
  const columnsToRender = useMemo(() => {
    const cols = [...columns];
    if (showBlockedColumn && stats.blocked > 0) {
      cols.push({ status: 'blocked', wipLimit: null });
    }
    return cols;
  }, [columns, showBlockedColumn, stats.blocked]);
  
  const classNames = [
    'bite-board',
    isGPS101 && 'bite-board--gps101',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className={classNames} {...props}>
      {/* Header */}
      {showHeader && (
        <div className="bite-board__header">
          <div className="bite-board__header-left">
            {/* NEW: GPS 101 Badge */}
            {isGPS101 && (
              <div className="bite-board__gps101-badge">
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
                </svg>
                <div className="bite-board__gps101-info">
                  <span className="bite-board__gps101-label">GPS 101 • Stage {gps101StageNumber}</span>
                  {gps101StageQuestion && (
                    <span className="bite-board__gps101-question">"{gps101StageQuestion}"</span>
                  )}
                </div>
              </div>
            )}
            
            <div className="bite-board__title-section">
              <h2 className="bite-board__title">{title}</h2>
              {subtitle && <p className="bite-board__subtitle">{subtitle}</p>}
              {missionTitle && (
                <div className="bite-board__mission">
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" clipRule="evenodd"/>
                  </svg>
                  <span>{missionTitle}</span>
                </div>
              )}
              
              {/* NEW: GPS 101 Deliverable Info */}
              {isGPS101 && gps101DeliverableName && (
                <div className="bite-board__gps101-deliverable">
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd"/>
                  </svg>
                  <span>Deliverable: {gps101DeliverableName}</span>
                </div>
              )}
            </div>
            
            {/* Stats */}
            <div className="bite-board__stats">
              <span className="bite-board__stat">
                <span className="bite-board__stat-value bite-board__stat-value--completed">{stats.completed}</span>
                <span className="bite-board__stat-label">Done</span>
              </span>
              <span className="bite-board__stat-divider">/</span>
              <span className="bite-board__stat">
                <span className="bite-board__stat-value">{stats.total}</span>
                <span className="bite-board__stat-label">Total</span>
              </span>
              {stats.blocked > 0 && (
                <>
                  <span className="bite-board__stat-divider">•</span>
                  <span className="bite-board__stat">
                    <span className="bite-board__stat-value bite-board__stat-value--blocked">{stats.blocked}</span>
                    <span className="bite-board__stat-label">Blocked</span>
                  </span>
                </>
              )}
            </div>
          </div>
          
          <div className="bite-board__header-right">
            {/* Refresh Button */}
            {onRefresh && (
              <button
                type="button"
                onClick={onRefresh}
                className="bite-board__refresh-btn"
                aria-label="Refresh board"
              >
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd"/>
                </svg>
              </button>
            )}
            
            {/* Add Task Button */}
            {onAddBite && (
              <button
                type="button"
                onClick={() => onAddBite()}
                className="bite-board__add-btn"
              >
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"/>
                </svg>
                {isGPS101 ? 'New GPS 101 Task' : 'New Task'}
              </button>
            )}
          </div>
        </div>
      )}
      
      {/* Filters */}
      {showFilters && (
        <div className="bite-board__filters">
          {/* Search */}
          <div className="bite-board__search">
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"/>
            </svg>
            <input
              type="text"
              placeholder={isGPS101 ? 'Search GPS 101 tasks...' : 'Search tasks...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bite-board__search-input"
            />
          </div>
          
          {/* Filter Dropdowns */}
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="bite-board__filter-select"
          >
            <option value="all">All Priorities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bite-board__filter-select"
          >
            <option value="all">All Types</option>
            <option value="task">Task</option>
            <option value="coding">Coding</option>
            <option value="research">Research</option>
            <option value="design">Design</option>
            <option value="writing">Writing</option>
            <option value="quiz">Quiz</option>
            {isGPS101 && <option value="reflection">Reflection</option>}
            {isGPS101 && <option value="deliverable">Deliverable</option>}
          </select>
          
          {assignees.length > 0 && (
            <select
              value={filterAssignee}
              onChange={(e) => setFilterAssignee(e.target.value)}
              className="bite-board__filter-select"
            >
              <option value="all">All Assignees</option>
              <option value="unassigned">Unassigned</option>
              {assignees.map(a => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          )}
          
          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="bite-board__clear-btn"
            >
              Clear
            </button>
          )}
        </div>
      )}
      
      {/* Board */}
      <div className="bite-board__content">
        {isLoading ? (
          <div className="bite-board__loading">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bite-board__loading-column">
                <div className="bite-board__loading-header" />
                {[...Array(3)].map((_, j) => (
                  <div key={j} className="bite-board__loading-card" />
                ))}
              </div>
            ))}
          </div>
        ) : (
          <div className="bite-board__columns">
            {columnsToRender.map(col => (
              <BiteBoardColumn
                key={col.status}
                id={col.status}
                status={col.status}
                title={col.title}
                bites={bitesByStatus[col.status] || []}
                wipLimit={col.wipLimit}
                onBiteClick={onBiteClick}
                onBiteDrop={handleBiteDrop}
                onAddBite={onAddBite}
                isCollapsed={collapsedColumns.has(col.status)}
                onToggleCollapse={handleToggleCollapse}
                showAddButton={col.status !== 'completed' && col.status !== 'blocked'}
                isGPS101={isGPS101}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export { DEFAULT_COLUMNS };
export default BiteBoard;