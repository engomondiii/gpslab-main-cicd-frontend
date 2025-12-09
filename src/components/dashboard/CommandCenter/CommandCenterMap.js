/**
 * GPS Lab Platform - CommandCenterMap Component
 * 
 * Visual map display for the Command Center showing journey progress.
 * 
 * @module components/dashboard/CommandCenter/CommandCenterMap
 */

import React, { useMemo } from 'react';
import './CommandCenterMap.css';

/**
 * Map node types
 */
const NODE_TYPES = {
  mission: { icon: '🎯', label: 'Mission' },
  checkpoint: { icon: '🚩', label: 'Checkpoint' },
  boss: { icon: '⚔️', label: 'Boss Battle' },
  treasure: { icon: '💎', label: 'Treasure' },
  party: { icon: '👥', label: 'Party Quest' }
};

/**
 * CommandCenterMap Component
 */
const CommandCenterMap = ({
  currentStage = 1,
  currentMission = null,
  upcomingNodes = [],
  completedNodes = [],
  onNodeClick,
  showLabels = true,
  className = '',
  ...props
}) => {
  
  /**
   * Generate map nodes
   */
  const mapNodes = useMemo(() => {
    // Combine and sort all nodes
    const allNodes = [
      ...completedNodes.map(n => ({ ...n, status: 'completed' })),
      ...(currentMission ? [{ ...currentMission, status: 'current' }] : []),
      ...upcomingNodes.map(n => ({ ...n, status: n.locked ? 'locked' : 'available' }))
    ];
    
    return allNodes.slice(0, 7); // Show max 7 nodes on map
  }, [completedNodes, currentMission, upcomingNodes]);
  
  /**
   * Calculate path progress
   */
  const pathProgress = useMemo(() => {
    const completedCount = completedNodes.length;
    const totalVisible = mapNodes.length;
    return totalVisible > 0 ? (completedCount / totalVisible) * 100 : 0;
  }, [completedNodes.length, mapNodes.length]);
  
  const classNames = ['command-center-map', className].filter(Boolean).join(' ');
  
  return (
    <div className={classNames} {...props}>
      {/* Map Background */}
      <div className="command-center-map__bg">
        {/* Grid Lines */}
        <div className="command-center-map__grid" />
        
        {/* Decorative Elements */}
        <div className="command-center-map__decoration command-center-map__decoration--1" />
        <div className="command-center-map__decoration command-center-map__decoration--2" />
      </div>
      
      {/* Path */}
      <div className="command-center-map__path">
        <svg className="command-center-map__path-svg" viewBox="0 0 600 200" preserveAspectRatio="none">
          {/* Background Path */}
          <path
            d="M 50 100 Q 150 50, 250 100 T 450 100 T 550 100"
            className="command-center-map__path-bg"
          />
          {/* Progress Path */}
          <path
            d="M 50 100 Q 150 50, 250 100 T 450 100 T 550 100"
            className="command-center-map__path-progress"
            style={{ strokeDashoffset: `${100 - pathProgress}%` }}
          />
        </svg>
      </div>
      
      {/* Nodes */}
      <div className="command-center-map__nodes">
        {mapNodes.map((node, index) => {
          const nodeType = NODE_TYPES[node.type] || NODE_TYPES.mission;
          const positionPercent = ((index + 0.5) / mapNodes.length) * 100;
          
          return (
            <button
              key={node.id || index}
              type="button"
              onClick={() => node.status !== 'locked' && onNodeClick?.(node)}
              disabled={node.status === 'locked'}
              className={`command-center-map__node command-center-map__node--${node.status}`}
              style={{ left: `${positionPercent}%` }}
              aria-label={`${nodeType.label}: ${node.title}`}
            >
              <div className="command-center-map__node-marker">
                <span className="command-center-map__node-icon">{nodeType.icon}</span>
                {node.status === 'current' && (
                  <span className="command-center-map__node-pulse" />
                )}
              </div>
              
              {showLabels && (
                <div className="command-center-map__node-label">
                  <span className="command-center-map__node-type">{nodeType.label}</span>
                  <span className="command-center-map__node-title">{node.title}</span>
                </div>
              )}
              
              {node.status === 'locked' && (
                <div className="command-center-map__node-lock">
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>
      
      {/* Current Position Indicator */}
      <div className="command-center-map__navigator">
        <div className="command-center-map__navigator-icon">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5.5-2.5l7.51-3.49L17.5 6.5 9.99 9.99 6.5 17.5zm5.5-6.6c.61 0 1.1.49 1.1 1.1s-.49 1.1-1.1 1.1-1.1-.49-1.1-1.1.49-1.1 1.1-1.1z"/>
          </svg>
        </div>
        <span className="command-center-map__navigator-label">Stage {currentStage}</span>
      </div>
    </div>
  );
};

export { NODE_TYPES };
export default CommandCenterMap;