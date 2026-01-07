/**
 * GPS Lab Platform - ProjectImpact Component
 * 
 * Display project impact metrics, stories, and evidence
 * of real-world change.
 * 
 * @module components/project/ProjectDetail/ProjectImpact
 */

import React, { useState } from 'react';
import './ProjectImpact.css';

/**
 * Format number with abbreviation
 */
const formatNumber = (num) => {
  if (num === undefined || num === null) return '0';
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toLocaleString();
};

/**
 * UN Sustainable Development Goals mapping
 */
const SDG_GOALS = {
  1: { name: 'No Poverty', color: '#e5243b' },
  2: { name: 'Zero Hunger', color: '#dda63a' },
  3: { name: 'Good Health', color: '#4c9f38' },
  4: { name: 'Quality Education', color: '#c5192d' },
  5: { name: 'Gender Equality', color: '#ff3a21' },
  6: { name: 'Clean Water', color: '#26bde2' },
  7: { name: 'Clean Energy', color: '#fcc30b' },
  8: { name: 'Decent Work', color: '#a21942' },
  9: { name: 'Innovation', color: '#fd6925' },
  10: { name: 'Reduced Inequalities', color: '#dd1367' },
  11: { name: 'Sustainable Cities', color: '#fd9d24' },
  12: { name: 'Responsible Consumption', color: '#bf8b2e' },
  13: { name: 'Climate Action', color: '#3f7e44' },
  14: { name: 'Life Below Water', color: '#0a97d9' },
  15: { name: 'Life on Land', color: '#56c02b' },
  16: { name: 'Peace & Justice', color: '#00689d' },
  17: { name: 'Partnerships', color: '#19486a' }
};

/**
 * ProjectImpact Component
 */
const ProjectImpact = ({
  impact = {},
  onAddStory,
  onAddEvidence,
  isOwner = false,
  className = '',
  ...props
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  
  const {
    // Impact metrics
    livesImpacted = 0,
    communitiesServed = 0,
    problemsSolved = 0,
    sustainableValue = 0,
    
    // SDGs
    sdgGoals = [],
    
    // Stories
    impactStories = [],
    
    // Evidence
    evidence = [],
    
    // Testimonials
    testimonials = []
  } = impact;
  
  const classNames = [
    'project-impact',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className={classNames} {...props}>
      {/* Header */}
      <div className="project-impact__header">
        <h3 className="project-impact__title">
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"/>
          </svg>
          Impact Dashboard
        </h3>
        
        <div className="project-impact__tabs">
          <button
            type="button"
            className={`project-impact__tab ${activeTab === 'overview' ? 'project-impact__tab--active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            type="button"
            className={`project-impact__tab ${activeTab === 'stories' ? 'project-impact__tab--active' : ''}`}
            onClick={() => setActiveTab('stories')}
          >
            Stories ({impactStories.length})
          </button>
          <button
            type="button"
            className={`project-impact__tab ${activeTab === 'evidence' ? 'project-impact__tab--active' : ''}`}
            onClick={() => setActiveTab('evidence')}
          >
            Evidence ({evidence.length})
          </button>
        </div>
      </div>
      
      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="project-impact__overview">
          {/* Impact Metrics */}
          <div className="project-impact__metrics">
            <div className="project-impact__metric project-impact__metric--highlight">
              <span className="project-impact__metric-icon">🌍</span>
              <span className="project-impact__metric-value">{formatNumber(livesImpacted)}</span>
              <span className="project-impact__metric-label">Lives Impacted</span>
            </div>
            <div className="project-impact__metric">
              <span className="project-impact__metric-icon">🏘️</span>
              <span className="project-impact__metric-value">{formatNumber(communitiesServed)}</span>
              <span className="project-impact__metric-label">Communities Served</span>
            </div>
            <div className="project-impact__metric">
              <span className="project-impact__metric-icon">✨</span>
              <span className="project-impact__metric-value">{formatNumber(problemsSolved)}</span>
              <span className="project-impact__metric-label">Problems Solved</span>
            </div>
            <div className="project-impact__metric">
              <span className="project-impact__metric-icon">♻️</span>
              <span className="project-impact__metric-value">${formatNumber(sustainableValue)}</span>
              <span className="project-impact__metric-label">Sustainable Value</span>
            </div>
          </div>
          
          {/* SDG Alignment */}
          {sdgGoals.length > 0 && (
            <div className="project-impact__sdg-section">
              <h4 className="project-impact__section-title">UN Sustainable Development Goals</h4>
              <div className="project-impact__sdg-list">
                {sdgGoals.map(goalNum => {
                  const goal = SDG_GOALS[goalNum];
                  if (!goal) return null;
                  return (
                    <div 
                      key={goalNum}
                      className="project-impact__sdg-item"
                      style={{ '--sdg-color': goal.color }}
                    >
                      <span className="project-impact__sdg-number">{goalNum}</span>
                      <span className="project-impact__sdg-name">{goal.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          
          {/* Recent Testimonials */}
          {testimonials.length > 0 && (
            <div className="project-impact__testimonials-section">
              <h4 className="project-impact__section-title">Testimonials</h4>
              <div className="project-impact__testimonials">
                {testimonials.slice(0, 2).map((testimonial, index) => (
                  <blockquote key={index} className="project-impact__testimonial">
                    <p className="project-impact__testimonial-quote">"{testimonial.quote}"</p>
                    <footer className="project-impact__testimonial-footer">
                      <div 
                        className="project-impact__testimonial-avatar"
                        style={{
                          backgroundImage: testimonial.avatar ? `url(${testimonial.avatar})` : 'none'
                        }}
                      >
                        {!testimonial.avatar && testimonial.name?.charAt(0)}
                      </div>
                      <div className="project-impact__testimonial-info">
                        <span className="project-impact__testimonial-name">{testimonial.name}</span>
                        <span className="project-impact__testimonial-role">{testimonial.role}</span>
                      </div>
                    </footer>
                  </blockquote>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Stories Tab */}
      {activeTab === 'stories' && (
        <div className="project-impact__stories">
          {isOwner && onAddStory && (
            <button
              type="button"
              onClick={onAddStory}
              className="project-impact__add-btn"
            >
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"/>
              </svg>
              Add Impact Story
            </button>
          )}
          
          {impactStories.length > 0 ? (
            <div className="project-impact__stories-list">
              {impactStories.map((story, index) => (
                <article key={index} className="project-impact__story">
                  {story.image && (
                    <div 
                      className="project-impact__story-image"
                      style={{ backgroundImage: `url(${story.image})` }}
                    />
                  )}
                  <div className="project-impact__story-content">
                    <h5 className="project-impact__story-title">{story.title}</h5>
                    <p className="project-impact__story-text">{story.description}</p>
                    {story.date && (
                      <span className="project-impact__story-date">{story.date}</span>
                    )}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="project-impact__empty">
              <span className="project-impact__empty-icon">📖</span>
              <p>No impact stories yet</p>
              <span className="project-impact__empty-hint">
                Share stories of how your project is making a difference
              </span>
            </div>
          )}
        </div>
      )}
      
      {/* Evidence Tab */}
      {activeTab === 'evidence' && (
        <div className="project-impact__evidence">
          {isOwner && onAddEvidence && (
            <button
              type="button"
              onClick={onAddEvidence}
              className="project-impact__add-btn"
            >
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"/>
              </svg>
              Add Evidence
            </button>
          )}
          
          {evidence.length > 0 ? (
            <div className="project-impact__evidence-list">
              {evidence.map((item, index) => (
                <div key={index} className="project-impact__evidence-item">
                  <div className="project-impact__evidence-icon">
                    {item.type === 'document' && '📄'}
                    {item.type === 'photo' && '📷'}
                    {item.type === 'video' && '🎬'}
                    {item.type === 'data' && '📊'}
                    {item.type === 'report' && '📋'}
                    {!item.type && '📎'}
                  </div>
                  <div className="project-impact__evidence-content">
                    <span className="project-impact__evidence-title">{item.title}</span>
                    <span className="project-impact__evidence-type">{item.type || 'Document'}</span>
                  </div>
                  <button
                    type="button"
                    className="project-impact__evidence-view"
                    onClick={() => item.url && window.open(item.url, '_blank')}
                  >
                    View
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="project-impact__empty">
              <span className="project-impact__empty-icon">📎</span>
              <p>No evidence uploaded yet</p>
              <span className="project-impact__empty-hint">
                Add documents, photos, or data that demonstrate your impact
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProjectImpact;