/**
 * GPS 101 Context
 * * Provides global state management for GPS 101 Basic course.
 * Manages current stage, mission, checkpoint, deliverables, and progress.
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { GPS_101_CONFIG } from '../config/gps101.config';
import { GPS_101_ALL_MISSIONS } from '../utils/constants/gps101.constants';

// Create Context
const GPS101Context = createContext(undefined);

// Custom hook to use GPS101 context
export const useGPS101Context = () => {
  const context = useContext(GPS101Context);
  if (!context) {
    throw new Error('useGPS101Context must be used within GPS101Provider');
  }
  return context;
};

/**
 * GPS101 Provider Component
 */
export const GPS101Provider = ({ children }) => {
  // Redux
  const dispatch = useDispatch();
  
  // FIXED: Added optional chaining and fallbacks to prevent "Cannot read properties of undefined"
  const user = useSelector((state) => state.user?.currentUser || null);
  const gps101State = useSelector((state) => state.gps101 || {
    missions: [],
    checkpoints: [],
    stages: [],
    totalBarakaEarned: 0,
    totalXPEarned: 0
  });

  // Local State
  const [currentStage, setCurrentStage] = useState(1);
  const [currentMission, setCurrentMission] = useState(null);
  const [currentCheckpoint, setCurrentCheckpoint] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Derived State
  const [progress, setProgress] = useState({
    completedStages: 0,
    completedMissions: 0,
    completedCheckpoints: 0,
    totalBarakaEarned: 0,
    totalXPEarned: 0,
    overallProgress: 0
  });

  const [deliverables, setDeliverables] = useState({
    identityStatement: null,
    problemCandidate: null,
    problemOwnerStory: null,
    lifePurposeStatement: null,
    purposeDrivenProject: null
  });

  /**
   * Calculate overall progress
   */
  const calculateProgress = useCallback(() => {
    if (!gps101State || !gps101State.missions) {
      return {
        completedStages: 0,
        completedMissions: 0,
        completedCheckpoints: 0,
        totalBarakaEarned: 0,
        totalXPEarned: 0,
        overallProgress: 0
      };
    }

    const completedMissions = gps101State.missions.filter(m => m.status === 'completed').length;
    const completedCheckpoints = gps101State.checkpoints.filter(c => c.status === 'passed').length;
    const completedStages = gps101State.stages.filter(s => s.status === 'completed').length;

    const totalBarakaEarned = gps101State.totalBarakaEarned || 0;
    const totalXPEarned = gps101State.totalXPEarned || 0;

    // Optional chaining added to GPS_101_CONFIG to be safe
    const totalMissions = GPS_101_CONFIG?.TOTAL_MISSIONS || 30;
    const overallProgress = (completedMissions / totalMissions) * 100;

    return {
      completedStages,
      completedMissions,
      completedCheckpoints,
      totalBarakaEarned,
      totalXPEarned,
      overallProgress: Math.round(overallProgress)
    };
  }, [gps101State]);

  /**
   * Update progress whenever gps101State changes
   */
  useEffect(() => {
    const newProgress = calculateProgress();
    setProgress(newProgress);
  }, [gps101State, calculateProgress]);

  /**
   * Get current stage data
   */
  const getCurrentStageData = useCallback(() => {
    if (!GPS_101_CONFIG?.STAGES) return null;
    return GPS_101_CONFIG.STAGES.find(stage => stage.stageNumber === currentStage);
  }, [currentStage]);

  /**
   * Get missions for current stage
   */
  const getCurrentStageMissions = useCallback(() => {
    if (!GPS_101_ALL_MISSIONS) return [];
    return GPS_101_ALL_MISSIONS.filter(mission => mission.stageNumber === currentStage);
  }, [currentStage]);

  /**
   * Get mission by ID
   */
  const getMissionById = useCallback((missionId) => {
    if (!GPS_101_ALL_MISSIONS) return null;
    return GPS_101_ALL_MISSIONS.find(mission => mission.missionId === missionId);
  }, []);

  /**
   * Get checkpoint by ID
   */
  const getCheckpointById = useCallback((checkpointId) => {
    if (!GPS_101_ALL_MISSIONS) return null;
    for (const mission of GPS_101_ALL_MISSIONS) {
      if (!mission.checkpoints) continue;
      const checkpoint = mission.checkpoints.find(cp => cp.checkpointId === checkpointId);
      if (checkpoint) {
        return checkpoint;
      }
    }
    return null;
  }, []);

  /**
   * Check if stage is unlocked
   */
  const isStageUnlocked = useCallback((stageNumber) => {
    if (stageNumber === 1) return true;
    if (!GPS_101_ALL_MISSIONS) return false;
    
    // Check if previous stage is completed
    const previousStageNumber = stageNumber - 1;
    const previousStageMissions = GPS_101_ALL_MISSIONS.filter(
      m => m.stageNumber === previousStageNumber
    );
    
    const allPreviousMissionsCompleted = previousStageMissions.every(mission => {
      const missionState = gps101State?.missions?.find(m => m.missionId === mission.missionId);
      return missionState?.status === 'completed';
    });

    return allPreviousMissionsCompleted;
  }, [gps101State]);

  /**
   * Check if mission is unlocked
   */
  const isMissionUnlocked = useCallback((missionId) => {
    const mission = getMissionById(missionId);
    if (!mission) return false;

    // First mission of each stage is always unlocked if stage is unlocked
    if (mission.missionNumber === 1) {
      return isStageUnlocked(mission.stageNumber);
    }

    if (!GPS_101_ALL_MISSIONS) return false;

    // Check if previous mission is completed
    const previousMissionNumber = mission.missionNumber - 1;
    const previousMission = GPS_101_ALL_MISSIONS.find(
      m => m.stageNumber === mission.stageNumber && m.missionNumber === previousMissionNumber
    );

    if (!previousMission) return false;

    const previousMissionState = gps101State?.missions?.find(
      m => m.missionId === previousMission.missionId
    );

    return previousMissionState?.status === 'completed';
  }, [getMissionById, isStageUnlocked, gps101State]);

  /**
   * Check if checkpoint is unlocked
   */
  const isCheckpointUnlocked = useCallback((checkpointId) => {
    const checkpoint = getCheckpointById(checkpointId);
    if (!checkpoint) return false;
    if (!GPS_101_ALL_MISSIONS) return false;

    // First checkpoint is always unlocked if mission is unlocked
    if (checkpoint.order === 1) {
      // Find mission containing this checkpoint
      const mission = GPS_101_ALL_MISSIONS.find(m => 
        m.checkpoints && m.checkpoints.some(cp => cp.checkpointId === checkpointId)
      );
      return mission ? isMissionUnlocked(mission.missionId) : false;
    }

    // Check if previous checkpoint is passed
    const mission = GPS_101_ALL_MISSIONS.find(m => 
      m.checkpoints && m.checkpoints.some(cp => cp.checkpointId === checkpointId)
    );

    if (!mission || !mission.checkpoints) return false;

    const previousCheckpoint = mission.checkpoints.find(
      cp => cp.order === checkpoint.order - 1
    );

    if (!previousCheckpoint) return false;

    const previousCheckpointState = gps101State?.checkpoints?.find(
      c => c.checkpointId === previousCheckpoint.checkpointId
    );

    return previousCheckpointState?.status === 'passed';
  }, [getCheckpointById, isMissionUnlocked, gps101State]);

  /**
   * Get deliverable for stage
   */
  const getStageDeliverable = useCallback((stageNumber) => {
    if (!GPS_101_CONFIG?.STAGES) return null;
    const stage = GPS_101_CONFIG.STAGES.find(s => s.stageNumber === stageNumber);
    if (!stage) return null;

    const deliverableId = stage.deliverable;
    return deliverables[deliverableId] || null;
  }, [deliverables]);

  /**
   * Update deliverable
   */
  const updateDeliverable = useCallback((deliverableId, data) => {
    setDeliverables(prev => ({
      ...prev,
      [deliverableId]: data
    }));
  }, []);

  /**
   * Get next uncompleted mission
   */
  const getNextMission = useCallback(() => {
    if (!GPS_101_ALL_MISSIONS) return null;
    for (const mission of GPS_101_ALL_MISSIONS) {
      const missionState = gps101State?.missions?.find(m => m.missionId === mission.missionId);
      if (!missionState || missionState.status !== 'completed') {
        if (isMissionUnlocked(mission.missionId)) {
          return mission;
        }
      }
    }
    return null;
  }, [gps101State, isMissionUnlocked]);

  /**
   * Get next uncompleted checkpoint in current mission
   */
  const getNextCheckpoint = useCallback((missionId) => {
    const mission = getMissionById(missionId);
    if (!mission || !mission.checkpoints) return null;

    for (const checkpoint of mission.checkpoints) {
      const checkpointState = gps101State?.checkpoints?.find(
        c => c.checkpointId === checkpoint.checkpointId
      );
      if (!checkpointState || checkpointState.status !== 'passed') {
        if (isCheckpointUnlocked(checkpoint.checkpointId)) {
          return checkpoint;
        }
      }
    }
    return null;
  }, [getMissionById, isCheckpointUnlocked, gps101State]);

  /**
   * Check if GPS 101 is completed
   */
  const isGPS101Completed = useCallback(() => {
    const totalMissions = GPS_101_CONFIG?.TOTAL_MISSIONS || 30;
    return progress.completedMissions === totalMissions;
  }, [progress]);

  /**
   * Get completion percentage for stage
   */
  const getStageCompletionPercentage = useCallback((stageNumber) => {
    if (!GPS_101_ALL_MISSIONS) return 0;
    const stageMissions = GPS_101_ALL_MISSIONS.filter(m => m.stageNumber === stageNumber);
    if (stageMissions.length === 0) return 0;
    
    const completedMissions = stageMissions.filter(mission => {
      const missionState = gps101State?.missions?.find(m => m.missionId === mission.missionId);
      return missionState?.status === 'completed';
    }).length;

    return (completedMissions / stageMissions.length) * 100;
  }, [gps101State]);

  /**
   * Get completion percentage for mission
   */
  const getMissionCompletionPercentage = useCallback((missionId) => {
    const mission = getMissionById(missionId);
    if (!mission || !mission.checkpoints || mission.checkpoints.length === 0) return 0;

    const passedCheckpoints = mission.checkpoints.filter(checkpoint => {
      const checkpointState = gps101State?.checkpoints?.find(
        c => c.checkpointId === checkpoint.checkpointId
      );
      return checkpointState?.status === 'passed';
    }).length;

    return (passedCheckpoints / mission.checkpoints.length) * 100;
  }, [getMissionById, gps101State]);

  /**
   * Get user's R2R (Retry Rights) balance
   */
  const getR2RBalance = useCallback(() => {
    return gps101State?.r2rBalance ?? (GPS_101_CONFIG?.R2R_INITIAL || 3);
  }, [gps101State]);

  /**
   * Get user's pR2R (Provisional Retry Rights) balance
   */
  const getPR2RBalance = useCallback(() => {
    return gps101State?.pr2rBalance || 0;
  }, [gps101State]);

  /**
   * Check if user has earned Orange Beacon
   */
  const hasOrangeBeacon = useCallback(() => {
    const target = GPS_101_CONFIG?.TOTAL_BARAKA || 5000;
    return progress.totalBarakaEarned >= target;
  }, [progress]);

  /**
   * Get earned badges
   */
  const getEarnedBadges = useCallback(() => {
    const badges = [];

    // Stage badges
    for (let i = 1; i <= 5; i++) {
      if (getStageCompletionPercentage(i) === 100) {
        badges.push(`gps-101-stage-${i}`);
      }
    }

    // Completion badge
    if (isGPS101Completed()) {
      badges.push('purpose-pathfinder');
    }

    // Orange Beacon
    if (hasOrangeBeacon()) {
      badges.push('orange-beacon');
    }

    return badges;
  }, [getStageCompletionPercentage, isGPS101Completed, hasOrangeBeacon]);

  /**
   * Get time remaining in weeks
   */
  const getWeeksRemaining = useCallback(() => {
    const weeksCompleted = Math.floor(progress.completedMissions / 2); // Approximate
    const totalWeeks = GPS_101_CONFIG?.DURATION_WEEKS || 15;
    return totalWeeks - weeksCompleted;
  }, [progress]);

  // Context value
  const contextValue = {
    // State
    currentStage,
    currentMission,
    currentCheckpoint,
    isLoading,
    error,
    progress,
    deliverables,

    // Setters
    setCurrentStage,
    setCurrentMission,
    setCurrentCheckpoint,
    setIsLoading,
    setError,

    // Data getters
    getCurrentStageData,
    getCurrentStageMissions,
    getMissionById,
    getCheckpointById,
    getStageDeliverable,
    getNextMission,
    getNextCheckpoint,
    getEarnedBadges,
    getWeeksRemaining,

    // Status checkers
    isStageUnlocked,
    isMissionUnlocked,
    isCheckpointUnlocked,
    isGPS101Completed,
    hasOrangeBeacon,

    // Progress getters
    getStageCompletionPercentage,
    getMissionCompletionPercentage,
    getR2RBalance,
    getPR2RBalance,

    // Actions
    updateDeliverable,

    // Config
    config: GPS_101_CONFIG
  };

  return (
    <GPS101Context.Provider value={contextValue}>
      {children}
    </GPS101Context.Provider>
  );
};

export default GPS101Context;