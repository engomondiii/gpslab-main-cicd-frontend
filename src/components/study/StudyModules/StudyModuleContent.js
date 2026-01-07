/**
 * GPS Lab Platform - StudyModuleContent Component
 * 
 * Displays the actual content of a study module including
 * videos, reading, interactive content, quizzes, etc.
 * 
 * @module components/study/StudyModules/StudyModuleContent
 */

import React, { useState, useCallback } from 'react';
import './StudyModuleContent.css';

/**
 * StudyModuleContent Component
 */
const StudyModuleContent = ({
  module,
  onComplete,
  onProgress,
  onBack,
  onNext,
  onPrevious,
  hasNext = false,
  hasPrevious = false,
  className = '',
  ...props
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [bookmarks, setBookmarks] = useState([]);
  
  const {
    id,
    title,
    contentType = 'reading',
    content = {},
    duration,
    status = 'not_started',
    progress = 0
  } = module || {};
  
  const isCompleted = status === 'completed';
  
  const handleMarkComplete = useCallback(() => {
    if (onComplete) {
      onComplete(id);
    }
  }, [id, onComplete]);
  
  const handleBookmark = useCallback(() => {
    const timestamp = Date.now();
    setBookmarks(prev => [...prev, { id: timestamp, position: progress }]);
  }, [progress]);
  
  const classNames = [
    'study-module-content',
    `study-module-content--${contentType}`,
    isCompleted && 'study-module-content--completed',
    className
  ].filter(Boolean).join(' ');
  
  // Render based on content type
  const renderContent = () => {
    switch (contentType) {
      case 'video':
        return (
          <div className="study-module-content__video">
            {content.videoUrl ? (
              <div className="study-module-content__video-wrapper">
                <video
                  controls
                  src={content.videoUrl}
                  poster={content.thumbnail}
                  className="study-module-content__video-player"
                />
              </div>
            ) : (
              <div className="study-module-content__video-placeholder">
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"/>
                </svg>
                <span>Video content will appear here</span>
              </div>
            )}
            {content.transcript && (
              <div className="study-module-content__transcript">
                <button
                  type="button"
                  className="study-module-content__transcript-toggle"
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  <span>Transcript</span>
                  <svg viewBox="0 0 20 20" fill="currentColor" className={isExpanded ? 'expanded' : ''}>
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"/>
                  </svg>
                </button>
                {isExpanded && (
                  <div className="study-module-content__transcript-text">
                    {content.transcript}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      
      case 'reading':
        return (
          <div className="study-module-content__reading">
            {content.sections?.map((section, index) => (
              <section key={index} className="study-module-content__section">
                {section.heading && (
                  <h3 className="study-module-content__section-heading">
                    {section.heading}
                  </h3>
                )}
                {section.text && (
                  <div 
                    className="study-module-content__section-text"
                    dangerouslySetInnerHTML={{ __html: section.text }}
                  />
                )}
                {section.image && (
                  <figure className="study-module-content__figure">
                    <img src={section.image} alt={section.imageAlt || ''} />
                    {section.imageCaption && (
                      <figcaption>{section.imageCaption}</figcaption>
                    )}
                  </figure>
                )}
                {section.callout && (
                  <div className={`study-module-content__callout study-module-content__callout--${section.calloutType || 'info'}`}>
                    {section.callout}
                  </div>
                )}
              </section>
            )) || (
              <div className="study-module-content__placeholder">
                <p>Reading content will appear here</p>
              </div>
            )}
          </div>
        );
      
      case 'interactive':
        return (
          <div className="study-module-content__interactive">
            {content.embedUrl ? (
              <iframe
                src={content.embedUrl}
                title={title}
                className="study-module-content__embed"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="study-module-content__placeholder">
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.321A1 1 0 0113.277 17H6.723a1 1 0 01-.384-1.924l.804-.32.122-.49H5a2 2 0 01-2-2V5zm2 0v8h10V5H5z" clipRule="evenodd"/>
                </svg>
                <span>Interactive content will appear here</span>
              </div>
            )}
          </div>
        );
      
      case 'quiz':
        return (
          <div className="study-module-content__quiz">
            <div className="study-module-content__placeholder">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"/>
              </svg>
              <span>Quiz component will be integrated here</span>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="study-module-content__placeholder">
            <p>Content not available</p>
          </div>
        );
    }
  };
  
  if (!module) {
    return (
      <div className="study-module-content study-module-content--empty">
        <p>Select a module to view its content</p>
      </div>
    );
  }
  
  return (
    <div className={classNames} {...props}>
      {/* Header */}
      <header className="study-module-content__header">
        <div className="study-module-content__header-left">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="study-module-content__back-btn"
            >
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd"/>
              </svg>
            </button>
          )}
          <div className="study-module-content__title-wrap">
            <h2 className="study-module-content__title">{title}</h2>
            <div className="study-module-content__meta">
              <span className="study-module-content__type">{contentType}</span>
              {duration && <span className="study-module-content__duration">{duration}</span>}
            </div>
          </div>
        </div>
        
        <div className="study-module-content__header-right">
          <button
            type="button"
            onClick={handleBookmark}
            className="study-module-content__action-btn"
            title="Bookmark"
          >
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z"/>
            </svg>
          </button>
          
          {isCompleted && (
            <span className="study-module-content__completed-badge">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              Completed
            </span>
          )}
        </div>
      </header>
      
      {/* Main Content */}
      <main className="study-module-content__main">
        {renderContent()}
      </main>
      
      {/* Footer */}
      <footer className="study-module-content__footer">
        <div className="study-module-content__navigation">
          {hasPrevious && (
            <button
              type="button"
              onClick={onPrevious}
              className="study-module-content__nav-btn"
            >
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd"/>
              </svg>
              Previous
            </button>
          )}
          
          <div className="study-module-content__center-actions">
            {!isCompleted && (
              <button
                type="button"
                onClick={handleMarkComplete}
                className="study-module-content__complete-btn"
              >
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
                Mark as Complete
              </button>
            )}
          </div>
          
          {hasNext && (
            <button
              type="button"
              onClick={onNext}
              className="study-module-content__nav-btn study-module-content__nav-btn--next"
            >
              Next
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/>
              </svg>
            </button>
          )}
        </div>
      </footer>
    </div>
  );
};

export default StudyModuleContent;