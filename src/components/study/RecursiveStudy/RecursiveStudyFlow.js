/**
 * GPS Lab Platform - RecursiveStudyFlow Component
 * 
 * Manages recursive study mission trees where students can drill
 * into sub-missions to address knowledge gaps identified during checkpoints.
 * 
 * @module components/study/RecursiveStudy/RecursiveStudyFlow
 */

import React, { useState, useCallback, useMemo } from 'react';
import SubStudyMission from './SubStudyMission';
import './RecursiveStudyFlow.css';

/**
 * Build tree structure from flat mission list
 */
const buildMissionTree = (missions, parentId = null) => {
  return missions
    .filter(mission => mission.parentId === parentId)
    .map(mission => ({
      ...mission,
      children: buildMissionTree(missions, mission.id)
    }));
};

/**
 * RecursiveStudyFlow Component
 */
const RecursiveStudyFlow = ({
  missions = [],
  rootMissionId,
  onMissionSelect,
  onMissionStart,
  onMissionComplete,
  showBreadcrumb = true,
  className = '',
  ...props
}) => {
  const [expandedIds, setExpandedIds] = useState(new Set());
  const [breadcrumb, setBreadcrumb] = useState([]);
  
  // Build mission tree
  const missionTree = useMemo(() => {
    return buildMissionTree(missions, rootMissionId || null);
  }, [missions, rootMissionId]);
  
  // Get flat list of all mission IDs for progress calculation
  const allMissionIds = useMemo(() => {
    const getAllIds = (tree) => {
      return tree.reduce((acc, node) => {
        return [...acc, node.id, ...getAllIds(node.children || [])];
      }, []);
    };
    return getAllIds(missionTree);
  }, [missionTree]);
  
  // Calculate overall progress
  const overallProgress = useMemo(() => {
    const completed = missions.filter(m => m.status === 'completed').length;
    return allMissionIds.length > 0 
      ? Math.round((completed / allMissionIds.length) * 100)
      : 0;
  }, [missions, allMissionIds]);
  
  // Toggle expand/collapse
  const handleToggle = useCallback((id) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);
  
  // Handle mission selection
  const handleSelect = useCallback((id) => {
    const mission = missions.find(m => m.id === id);
    if (mission) {
      // Update breadcrumb
      const newBreadcrumb = [];
      let currentId = id;
      while (currentId) {
        const current = missions.find(m => m.id === currentId);
        if (current) {
          newBreadcrumb.unshift({ id: current.id, title: current.title });
          currentId = current.parentId;
        } else {
          break;
        }
      }
      setBreadcrumb(newBreadcrumb);
    }
    
    if (onMissionSelect) {
      onMissionSelect(id);
    }
  }, [missions, onMissionSelect]);
  
  // Handle mission start
  const handleStart = useCallback((id) => {
    if (onMissionStart) {
      onMissionStart(id);
    }
  }, [onMissionStart]);
  
  // Render mission tree recursively
  const renderMissionTree = (nodes, depth = 0) => {
    return nodes.map(node => (
      <SubStudyMission
        key={node.id}
        id={node.id}
        title={node.title}
        description={node.description}
        depth={depth}
        progress={node.progress || 0}
        status={node.status || 'not_started'}
        moduleCount={node.moduleCount || 0}
        completedModules={node.completedModules || 0}
        duration={node.duration}
        isExpanded={expandedIds.has(node.id)}
        onToggle={handleToggle}
        onSelect={handleSelect}
        onStart={handleStart}
      >
        {node.children && node.children.length > 0 && 
          renderMissionTree(node.children, depth + 1)
        }
      </SubStudyMission>
    ));
  };
  
  const classNames = [
    'recursive-study-flow',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className={classNames} {...props}>
      {/* Header */}
      <div className="recursive-study-flow__header">
        <div className="recursive-study-flow__title-section">
          <div className="recursive-study-flow__icon">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M4 4h6v6H4V4zM14 4h6v6h-6V4zM4 14h6v6H4v-6zM14 14h6v6h-6v-6z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <h2 className="recursive-study-flow__title">Study Path</h2>
            <p className="recursive-study-flow__subtitle">
              Explore topics to strengthen your understanding
            </p>
          </div>
        </div>
        
        <div className="recursive-study-flow__progress">
          <span className="recursive-study-flow__progress-label">Overall Progress</span>
          <div className="recursive-study-flow__progress-bar">
            <div 
              className="recursive-study-flow__progress-fill"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
          <span className="recursive-study-flow__progress-value">{overallProgress}%</span>
        </div>
      </div>
      
      {/* Breadcrumb */}
      {showBreadcrumb && breadcrumb.length > 0 && (
        <nav className="recursive-study-flow__breadcrumb">
          <button
            type="button"
            className="recursive-study-flow__breadcrumb-item"
            onClick={() => setBreadcrumb([])}
          >
            All Topics
          </button>
          {breadcrumb.map((item, index) => (
            <React.Fragment key={item.id}>
              <span className="recursive-study-flow__breadcrumb-sep">/</span>
              <button
                type="button"
                className={`recursive-study-flow__breadcrumb-item ${index === breadcrumb.length - 1 ? 'recursive-study-flow__breadcrumb-item--active' : ''}`}
                onClick={() => {
                  setBreadcrumb(breadcrumb.slice(0, index + 1));
                  handleSelect(item.id);
                }}
              >
                {item.title}
              </button>
            </React.Fragment>
          ))}
        </nav>
      )}
      
      {/* Mission Tree */}
      <div className="recursive-study-flow__tree">
        {missionTree.length > 0 ? (
          renderMissionTree(missionTree)
        ) : (
          <div className="recursive-study-flow__empty">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <h3>No Study Topics Available</h3>
            <p>Study topics will appear here based on your learning path.</p>
          </div>
        )}
      </div>
      
      {/* Quick Actions */}
      <div className="recursive-study-flow__actions">
        <button
          type="button"
          className="recursive-study-flow__expand-all"
          onClick={() => setExpandedIds(new Set(allMissionIds))}
        >
          Expand All
        </button>
        <button
          type="button"
          className="recursive-study-flow__collapse-all"
          onClick={() => setExpandedIds(new Set())}
        >
          Collapse All
        </button>
      </div>
    </div>
  );
};

export default RecursiveStudyFlow;