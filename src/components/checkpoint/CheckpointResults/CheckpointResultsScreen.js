/**
 * GPS Lab Platform - CheckpointResultsScreen Component
 * 
 * Main results container that displays either pass or fail screen
 * based on evaluation outcome.
 * 
 * @module components/checkpoint/CheckpointResults/CheckpointResultsScreen
 */

import React from 'react';
import CheckpointPassScreen from './CheckpointPassScreen';
import CheckpointFailScreen from './CheckpointFailScreen';
import './CheckpointResultsScreen.css';

/**
 * CheckpointResultsScreen Component
 */
const CheckpointResultsScreen = ({
  checkpoint,
  result,
  onContinue,
  onRetry,
  onStudy,
  onViewDetails,
  onExit,
  className = '',
  ...props
}) => {
  const {
    passed = false,
    score = 0,
    maxScore = 16,
    percentage = 0,
    passingScore = 70,
    rewards = {},
    weakAreas = [],
    studyRecommendations = [],
    retryOptions = {},
    nextStage = null,
    feedback = {}
  } = result || {};
  
  const classNames = [
    'checkpoint-results-screen',
    passed ? 'checkpoint-results-screen--passed' : 'checkpoint-results-screen--failed',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className={classNames} {...props}>
      {passed ? (
        <CheckpointPassScreen
          checkpoint={checkpoint}
          score={score}
          maxScore={maxScore}
          percentage={percentage}
          rewards={rewards}
          nextStage={nextStage}
          onContinue={onContinue}
          onViewDetails={onViewDetails}
        />
      ) : (
        <CheckpointFailScreen
          checkpoint={checkpoint}
          score={score}
          maxScore={maxScore}
          percentage={percentage}
          passingScore={passingScore}
          weakAreas={weakAreas}
          studyRecommendations={studyRecommendations}
          retryOptions={retryOptions}
          onRetry={onRetry}
          onStudy={onStudy}
          onViewDetails={onViewDetails}
          onExit={onExit}
        />
      )}
    </div>
  );
};

export default CheckpointResultsScreen;