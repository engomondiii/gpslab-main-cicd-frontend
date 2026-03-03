/**
 * GPS Lab Platform - GPOCallPage Component
 * 
 * Main page for GPO Call workflow.
 * Displays GPOCallFlow with all stages.
 * 
 * @module pages/GPOCallPage
 */

import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import GPOCallFlow from '../../components/gpo/GPOCallFlow/GPOCallFlow';
import { formatForAPISubmission } from '../../utils/formatters/gpo.formatter';
import { countTotalMediaFiles, estimateReadingTime } from '../../utils/helpers/gpo.helper';
import './GPOCallPage.css';

/**
 * GPOCallPage Component
 */
const GPOCallPage = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Handle GPO Call completion
   */
  const handleComplete = useCallback(async (showcaseData) => {
    setIsSubmitting(true);
    
    try {
      // Format data for API submission
      const apiData = formatForAPISubmission(showcaseData);
      
      // Get additional metadata
      const mediaCount = countTotalMediaFiles(showcaseData);
      const readingTime = estimateReadingTime(showcaseData);
      
      console.log('Submitting Problem Showcase:', {
        ...apiData,
        metadata: {
          mediaFiles: mediaCount,
          estimatedReadingTime: readingTime
        }
      });
      
      // TODO: Replace with actual API call
      // const response = await fetch('/api/gpo/showcase', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(apiData)
      // });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Navigate to success page with showcase data
      navigate('/gpo-call/success', { 
        state: { 
          showcaseData,
          mediaCount,
          readingTime
        } 
      });
    } catch (error) {
      console.error('Failed to submit showcase:', error);
      alert('Failed to submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [navigate]);

  return (
    <div className="gpo-call-page">
      {/* Hero Section */}
      <div className="gpo-call-page__hero">
        <div className="gpo-call-page__hero-content">
          <h1 className="gpo-call-page__hero-title">
            Welcome to the GPO Call! 📢
          </h1>
          <p className="gpo-call-page__hero-subtitle">
            Transform your problem into a powerful showcase that attracts Global Problem Solvers from around the world.
          </p>
          <div className="gpo-call-page__hero-features">
            <div className="gpo-call-page__feature">
              <span className="gpo-call-page__feature-icon">👋</span>
              <span className="gpo-call-page__feature-text">Introduce yourself</span>
            </div>
            <div className="gpo-call-page__feature">
              <span className="gpo-call-page__feature-icon">🎯</span>
              <span className="gpo-call-page__feature-text">Define the problem</span>
            </div>
            <div className="gpo-call-page__feature">
              <span className="gpo-call-page__feature-icon">💔</span>
              <span className="gpo-call-page__feature-text">Show the impact</span>
            </div>
            <div className="gpo-call-page__feature">
              <span className="gpo-call-page__feature-icon">🌟</span>
              <span className="gpo-call-page__feature-text">Paint the vision</span>
            </div>
            <div className="gpo-call-page__feature">
              <span className="gpo-call-page__feature-icon">🤝</span>
              <span className="gpo-call-page__feature-text">Invite collaboration</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="gpo-call-page__content">
        <GPOCallFlow 
          initialStage={-4}
          onComplete={handleComplete}
        />
      </div>

      {/* Submitting Overlay */}
      {isSubmitting && (
        <div className="gpo-call-page__overlay">
          <div className="gpo-call-page__loader">
            <div className="gpo-call-page__spinner" />
            <p className="gpo-call-page__loader-text">
              Submitting your Problem Showcase...
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default GPOCallPage;