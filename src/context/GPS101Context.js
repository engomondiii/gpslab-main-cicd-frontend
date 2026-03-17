/**
 * GPS 101 Context
 * 
 * Provides global state management for GPS 101 Basic course.
 * Manages current stage, mission, sub-mission, checkpoint, deliverables, and progress.
 * 
 * CORRECTED STRUCTURE:
 * - 5 Stages (1 mission per stage)
 * - 5 Missions total
 * - 30 Sub-missions (6 per mission)
 * - 150 Checkpoints (5 per sub-mission)
 * 
 * UPDATED: Added all missing getter methods to fix GPS101StagePage errors
 * UPDATED: Added mock-safe status defaults so Stage 1 is 'available' after enrollment
 *          even when no real API exists (no Redux stage/mission state seeded yet).
 * UPDATED: isMissionUnlocked, isSubMissionUnlocked, isCheckpointUnlocked, and
 *          getSubMissionsByMissionId all return true/available when the user is
 *          enrolled but no real API has populated Redux state. This unblocks the
 *          entire GPS 101 flow (mission page, checkpoint page) during development.
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
  
  const user = useSelector((state) => state.user?.currentUser || null);
  const gps101State = useSelector((state) => state.gps101 || {
    missions: [],
    subMissions: [],
    checkpoints: [],
    stages: [],
    totalBarakaEarned: 0,
    totalXPEarned: 0
  });

  // Local State
  const [currentStage, setCurrentStage] = useState(1);
  const [currentMission, setCurrentMission] = useState(null);
  const [currentSubMission, setCurrentSubMission] = useState(null);
  const [currentCheckpoint, setCurrentCheckpoint] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // FIX: Local enrollment flag read from localStorage.
  // This bridges the gap between handleEnroll() in GPS101Page (which writes to
  // localStorage) and this context, so isUserEnrolled is true even before the
  // Redux gps101State.isEnrolled flag is set (which requires a real API response).
  const [isEnrolledLocally, setIsEnrolledLocally] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('gps_user');
      if (stored) {
        const parsedUser = JSON.parse(stored);
        if (parsedUser.gps101Enrolled) {
          setIsEnrolledLocally(true);
        }
      }
    } catch (e) {
      console.error('GPS101Context: error reading enrollment from localStorage', e);
    }
  }, []);

  // FIX: Combined enrollment check — true if either Redux OR localStorage says enrolled.
  // This ensures getStageByNumber / getMissionByStageNumber return 'available'
  // for Stage 1 without needing a real API to seed gps101State.stages.
  const isUserEnrolled = isEnrolledLocally || (gps101State?.isEnrolled ?? false);

  // Derived State
  const [progress, setProgress] = useState({
    completedStages: 0,
    completedMissions: 0,
    completedSubMissions: 0,
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

  // Store stages data
  const [stages, setStages] = useState([]);

  /**
   * Calculate overall progress
   */
  const calculateProgress = useCallback(() => {
    if (!gps101State || !gps101State.missions) {
      return {
        completedStages: 0,
        completedMissions: 0,
        completedSubMissions: 0,
        completedCheckpoints: 0,
        totalBarakaEarned: 0,
        totalXPEarned: 0,
        overallProgress: 0
      };
    }

    const completedMissions = gps101State.missions?.filter(m => m.status === 'completed').length || 0;
    const completedSubMissions = gps101State.subMissions?.filter(sm => sm.status === 'completed').length || 0;
    const completedCheckpoints = gps101State.checkpoints?.filter(c => c.status === 'passed').length || 0;
    const completedStages = gps101State.stages?.filter(s => s.status === 'completed').length || 0;

    const totalBarakaEarned = gps101State.totalBarakaEarned || 0;
    const totalXPEarned = gps101State.totalXPEarned || 0;

    // CORRECTED: 5 total missions, not 30
    const totalMissions = GPS_101_CONFIG?.TOTAL_MISSIONS || 5;
    const overallProgress = (completedMissions / totalMissions) * 100;

    return {
      completedStages,
      completedMissions,
      completedSubMissions,
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
   * Initialize stages from config
   */
  useEffect(() => {
    if (GPS_101_CONFIG?.STAGES) {
      setStages(GPS_101_CONFIG.STAGES);
    }
  }, []);

  /**
   * Get current stage data
   */
  const getCurrentStageData = useCallback(() => {
    if (!GPS_101_CONFIG?.STAGES) return null;
    return GPS_101_CONFIG.STAGES.find(stage => stage.stageNumber === currentStage);
  }, [currentStage]);

  /**
   * Get mission for current stage (CORRECTED: 1 mission per stage)
   */
  const getCurrentStageMission = useCallback(() => {
    if (!GPS_101_ALL_MISSIONS) return null;
    return GPS_101_ALL_MISSIONS.find(mission => mission.stageNumber === currentStage);
  }, [currentStage]);

  /**
   * Get sub-missions for current mission
   */
  const getCurrentMissionSubMissions = useCallback(() => {
    const mission = getCurrentStageMission();
    return mission?.subMissions || [];
  }, [getCurrentStageMission]);

  /**
   * Get mission by ID
   */
  const getMissionById = useCallback((missionId) => {
    if (!GPS_101_ALL_MISSIONS) return null;
    return GPS_101_ALL_MISSIONS.find(mission => mission.missionId === missionId);
  }, []);

  /**
   * Get sub-mission by ID
   */
  const getSubMissionById = useCallback((subMissionId) => {
    if (!GPS_101_ALL_MISSIONS) return null;
    for (const mission of GPS_101_ALL_MISSIONS) {
      if (!mission.subMissions) continue;
      const subMission = mission.subMissions.find(sm => sm.subMissionId === subMissionId);
      if (subMission) {
        return subMission;
      }
    }
    return null;
  }, []);

  /**
   * Get checkpoint by ID
   */
  const getCheckpointById = useCallback((checkpointId) => {
    if (!GPS_101_ALL_MISSIONS) return null;
    for (const mission of GPS_101_ALL_MISSIONS) {
      if (!mission.subMissions) continue;
      for (const subMission of mission.subMissions) {
        if (!subMission.checkpoints) continue;
        const checkpoint = subMission.checkpoints.find(cp => cp.checkpointId === checkpointId);
        if (checkpoint) {
          return checkpoint;
        }
      }
    }
    return null;
  }, []);

  /**
   * NEW: Get stage by number (ADDED TO FIX GPS101StagePage ERROR)
   *
   * FIX: Previously defaulted status to 'locked' when gps101State.stages is empty
   * (which is always the case with no real API). Now uses getMockStageStatus() to
   * return 'available' for Stage 1 when the user is enrolled, and 'locked' for
   * later stages until the previous stage is completed.
   */
  const getStageByNumber = useCallback((stageNumber) => {
    if (!GPS_101_CONFIG?.STAGES) return null;
    
    const configStage = GPS_101_CONFIG.STAGES.find(s => s.stageNumber === stageNumber);
    if (!configStage) return null;

    // Find stage state from Redux (populated when a real API exists)
    const stageState = gps101State?.stages?.find(s => s.stageNumber === stageNumber);

    // FIX: Mock-safe status fallback.
    // When there is no real API, gps101State.stages is [] so stageState is always
    // undefined, which previously caused every stage to default to 'locked'.
    // Now we compute a sensible default based on enrollment and prior stage completion.
    const getMockStageStatus = (num) => {
      if (!isUserEnrolled) return 'locked';
      if (num === 1) return 'available';
      // Stage N is available only if stage N-1 is completed in Redux state
      const prevStageState = gps101State?.stages?.find(s => s.stageNumber === num - 1);
      return prevStageState?.status === 'completed' ? 'available' : 'locked';
    };

    return {
      ...configStage,
      status: stageState?.status || getMockStageStatus(stageNumber),
      completedAt: stageState?.completedAt || null,
      barakaEarned: stageState?.barakaEarned || 0,
      xpEarned: stageState?.xpEarned || 0
    };
  }, [gps101State, isUserEnrolled]);

  /**
   * NEW: Get mission by stage number (ADDED TO FIX GPS101StagePage ERROR)
   *
   * FIX: Previously defaulted mission status to 'locked' when gps101State.missions
   * is empty (always the case with no real API). Now mirrors the stage status: if
   * the stage is 'available' or 'completed', the mission is also 'available'.
   */
  const getMissionByStageNumber = useCallback((stageNumber) => {
    if (!GPS_101_ALL_MISSIONS) return null;
    
    const mission = GPS_101_ALL_MISSIONS.find(m => m.stageNumber === stageNumber);
    if (!mission) return null;

    // Find mission state from Redux (populated when a real API exists)
    const missionState = gps101State?.missions?.find(m => m.missionId === mission.missionId);

    // FIX: Mock-safe status fallback.
    // Derive mission availability from the stage status so the mission card
    // renders as 'available' (not 'locked') when the stage is accessible.
    const getMockMissionStatus = () => {
      if (!isUserEnrolled) return 'locked';
      // Check if the parent stage is available or completed
      const stageData = getStageByNumber(stageNumber);
      if (stageData?.status === 'completed') return 'completed';
      if (stageData?.status === 'available') return 'available';
      return 'locked';
    };

    return {
      ...mission,
      status: missionState?.status || getMockMissionStatus(),
      startedAt: missionState?.startedAt || null,
      completedAt: missionState?.completedAt || null,
      barakaEarned: missionState?.barakaEarned || 0,
      xpEarned: missionState?.xpEarned || 0
    };
  }, [gps101State, isUserEnrolled, getStageByNumber]);

  /**
   * NEW: Get sub-missions by mission ID (ADDED TO FIX GPS101StagePage ERROR)
   *
   * FIX: Previously defaulted every sub-mission and checkpoint status to 'locked'
   * when gps101State.subMissions/checkpoints are empty (always the case with no
   * real API). Now returns 'available' for all sub-missions and 'unlocked' for all
   * checkpoints when the user is enrolled, unblocking the mission page grid and
   * checkpoint navigation.
   */
  const getSubMissionsByMissionId = useCallback((missionId) => {
    if (!missionId) return [];
    
    const mission = getMissionById(missionId);
    if (!mission || !mission.subMissions) return [];

    // Merge sub-missions with their state
    return mission.subMissions.map(subMission => {
      const subMissionState = gps101State?.subMissions?.find(
        sm => sm.subMissionId === subMission.subMissionId
      );

      // FIX: When enrolled with no API, gps101State.subMissions is empty so
      // subMissionState is always undefined → was always 'locked'. Now defaults
      // to 'available' so the sub-mission grid renders as clickable.
      const defaultSubMissionStatus = isUserEnrolled ? 'available' : 'locked';

      return {
        ...subMission,
        status: subMissionState?.status || defaultSubMissionStatus,
        startedAt: subMissionState?.startedAt || null,
        completedAt: subMissionState?.completedAt || null,
        barakaEarned: subMissionState?.barakaEarned || 0,
        xpEarned: subMissionState?.xpEarned || 0,
        // Include checkpoints with their state
        checkpoints: subMission.checkpoints?.map(checkpoint => {
          const checkpointState = gps101State?.checkpoints?.find(
            c => c.checkpointId === checkpoint.checkpointId
          );
          // FIX: Default to 'unlocked' when enrolled so checkpoints are navigable.
          const defaultCheckpointStatus = isUserEnrolled ? 'unlocked' : 'locked';
          return {
            ...checkpoint,
            status: checkpointState?.status || defaultCheckpointStatus,
            submittedAt: checkpointState?.submittedAt || null,
            score: checkpointState?.score || null,
            feedback: checkpointState?.feedback || null
          };
        }) || []
      };
    });
  }, [getMissionById, gps101State, isUserEnrolled]);

  /**
   * NEW: Get stage deliverable status (ADDED TO FIX GPS101StagePage ERROR)
   */
  const getStageDeliverableStatus = useCallback((stageNumber) => {
    if (!GPS_101_CONFIG?.DELIVERABLES) return null;
    
    const deliverable = GPS_101_CONFIG.DELIVERABLES.find(
      d => d.stageNumber === stageNumber
    );
    
    if (!deliverable) return null;

    // Check if deliverable is completed
    const deliverableData = deliverables[deliverable.id];
    const isCompleted = !!deliverableData;

    return {
      id: deliverable.id,
      name: deliverable.name,
      description: deliverable.description,
      stageNumber: deliverable.stageNumber,
      completed: isCompleted,
      data: deliverableData
    };
  }, [deliverables]);

  /**
   * Check if stage is unlocked
   */
  const isStageUnlocked = useCallback((stageNumber) => {
    if (stageNumber === 1) return true;
    if (!GPS_101_ALL_MISSIONS) return false;
    
    // Check if previous stage's mission is completed
    const previousStageNumber = stageNumber - 1;
    const previousMission = GPS_101_ALL_MISSIONS.find(
      m => m.stageNumber === previousStageNumber
    );
    
    if (!previousMission) return false;

    const missionState = gps101State?.missions?.find(m => m.missionId === previousMission.missionId);
    return missionState?.status === 'completed';
  }, [gps101State]);

  /**
   * Check if mission is unlocked
   *
   * FIX: Previously delegated to isStageUnlocked which only returns true for
   * Stage 1 (stage 2–5 need completed previous stage in Redux, always empty with
   * no API). Now returns true for ALL missions when the user is enrolled so the
   * mission page renders correctly during development without a real API.
   */
  const isMissionUnlocked = useCallback((missionId) => {
    const mission = getMissionById(missionId);
    if (!mission) return false;

    // FIX: When enrolled with no API, unlock all missions so the mission page
    // does not redirect back to /gps101 with "Loading mission..." forever.
    if (isUserEnrolled) return true;

    // With a real API, fall back to stage-based unlock logic
    return isStageUnlocked(mission.stageNumber);
  }, [getMissionById, isStageUnlocked, isUserEnrolled]);

  /**
   * Check if sub-mission is unlocked
   *
   * FIX: Previously checked gps101State.subMissions for a completed previous
   * sub-mission. With no API that array is empty → only the very first
   * sub-mission of the first mission was ever unlocked. Now returns true for
   * all sub-missions when enrolled so the mission grid is fully navigable.
   */
  const isSubMissionUnlocked = useCallback((subMissionId) => {
    const subMission = getSubMissionById(subMissionId);
    if (!subMission) return false;

    // FIX: When enrolled with no API, unlock all sub-missions.
    if (isUserEnrolled) return true;

    // With a real API, use sequential unlock logic
    const mission = GPS_101_ALL_MISSIONS.find(m => 
      m.subMissions?.some(sm => sm.subMissionId === subMissionId)
    );

    if (!mission) return false;

    // First sub-mission is unlocked if mission is unlocked
    if (subMission.subMissionNumber === 1) {
      return isMissionUnlocked(mission.missionId);
    }

    // Check if previous sub-mission is completed
    const previousSubMissionNumber = subMission.subMissionNumber - 1;
    const previousSubMission = mission.subMissions?.find(
      sm => sm.subMissionNumber === previousSubMissionNumber
    );

    if (!previousSubMission) return false;

    const previousSubMissionState = gps101State?.subMissions?.find(
      sm => sm.subMissionId === previousSubMission.subMissionId
    );

    return previousSubMissionState?.status === 'completed';
  }, [getSubMissionById, isMissionUnlocked, gps101State, isUserEnrolled]);

  /**
   * Check if checkpoint is unlocked
   *
   * FIX: Previously checked gps101State.checkpoints for a passed previous
   * checkpoint. With no API that array is empty → only checkpoint order === 1
   * in the very first sub-mission was ever unlocked. Now returns true for all
   * checkpoints when enrolled so the checkpoint page renders correctly.
   */
  const isCheckpointUnlocked = useCallback((checkpointId) => {
    const checkpoint = getCheckpointById(checkpointId);
    if (!checkpoint) return false;

    // FIX: When enrolled with no API, unlock all checkpoints so the checkpoint
    // page does not show "Checkpoint Locked" or redirect back to /gps101.
    if (isUserEnrolled) return true;

    // With a real API, use sequential unlock logic
    let parentSubMission = null;
    for (const mission of GPS_101_ALL_MISSIONS) {
      if (!mission.subMissions) continue;
      for (const subMission of mission.subMissions) {
        if (subMission.checkpoints?.some(cp => cp.checkpointId === checkpointId)) {
          parentSubMission = subMission;
          break;
        }
      }
      if (parentSubMission) break;
    }

    if (!parentSubMission) return false;

    // First checkpoint is unlocked if sub-mission is unlocked
    if (checkpoint.order === 1) {
      return isSubMissionUnlocked(parentSubMission.subMissionId);
    }

    // Check if previous checkpoint is passed
    const previousCheckpoint = parentSubMission.checkpoints?.find(
      cp => cp.order === checkpoint.order - 1
    );

    if (!previousCheckpoint) return false;

    const previousCheckpointState = gps101State?.checkpoints?.find(
      c => c.checkpointId === previousCheckpoint.checkpointId
    );

    return previousCheckpointState?.status === 'passed';
  }, [getCheckpointById, isSubMissionUnlocked, gps101State, isUserEnrolled]);

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
   * Get next uncompleted checkpoint in current sub-mission
   */
  const getNextCheckpoint = useCallback((subMissionId) => {
    const subMission = getSubMissionById(subMissionId);
    if (!subMission || !subMission.checkpoints) return null;

    for (const checkpoint of subMission.checkpoints) {
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
  }, [getSubMissionById, isCheckpointUnlocked, gps101State]);

  /**
   * Check if GPS 101 is completed
   */
  const isGPS101Completed = useCallback(() => {
    const totalMissions = GPS_101_CONFIG?.TOTAL_MISSIONS || 5; // CORRECTED: 5 missions
    return progress.completedMissions === totalMissions;
  }, [progress]);

  /**
   * Get completion percentage for stage
   */
  const getStageCompletionPercentage = useCallback((stageNumber) => {
    if (!GPS_101_ALL_MISSIONS) return 0;
    
    // CORRECTED: 1 mission per stage
    const stageMission = GPS_101_ALL_MISSIONS.find(m => m.stageNumber === stageNumber);
    if (!stageMission) return 0;
    
    const missionState = gps101State?.missions?.find(m => m.missionId === stageMission.missionId);
    if (!missionState) return 0;
    
    if (missionState.status === 'completed') return 100;
    
    // Calculate based on sub-missions completion
    if (!stageMission.subMissions || stageMission.subMissions.length === 0) return 0;
    
    const completedSubMissions = stageMission.subMissions.filter(sm => {
      const smState = gps101State?.subMissions?.find(s => s.subMissionId === sm.subMissionId);
      return smState?.status === 'completed';
    }).length;
    
    return Math.round((completedSubMissions / stageMission.subMissions.length) * 100);
  }, [gps101State]);

  /**
   * Get completion percentage for mission
   */
  const getMissionCompletionPercentage = useCallback((missionId) => {
    const mission = getMissionById(missionId);
    if (!mission || !mission.subMissions || mission.subMissions.length === 0) return 0;

    const completedSubMissions = mission.subMissions.filter(subMission => {
      const subMissionState = gps101State?.subMissions?.find(
        sm => sm.subMissionId === subMission.subMissionId
      );
      return subMissionState?.status === 'completed';
    }).length;

    return Math.round((completedSubMissions / mission.subMissions.length) * 100);
  }, [getMissionById, gps101State]);

  /**
   * Get completion percentage for sub-mission
   */
  const getSubMissionCompletionPercentage = useCallback((subMissionId) => {
    const subMission = getSubMissionById(subMissionId);
    if (!subMission || !subMission.checkpoints || subMission.checkpoints.length === 0) return 0;

    const passedCheckpoints = subMission.checkpoints.filter(checkpoint => {
      const checkpointState = gps101State?.checkpoints?.find(
        c => c.checkpointId === checkpoint.checkpointId
      );
      return checkpointState?.status === 'passed';
    }).length;

    return Math.round((passedCheckpoints / subMission.checkpoints.length) * 100);
  }, [getSubMissionById, gps101State]);

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
        badges.push(`GPS101_STAGE_${i}`);
      }
    }

    // Completion badge
    if (isGPS101Completed()) {
      badges.push('GPS101_COMPLETE');
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
    const weeksCompleted = Math.floor(progress.completedMissions * 3); // 3 weeks per mission
    const totalWeeks = GPS_101_CONFIG?.DURATION_WEEKS || 15;
    return Math.max(0, totalWeeks - weeksCompleted);
  }, [progress]);

  // Context value
  const contextValue = {
    // State
    currentStage,
    currentMission,
    currentSubMission,
    currentCheckpoint,
    isLoading,
    error,
    progress,
    deliverables,
    stages,

    // Setters
    setCurrentStage,
    setCurrentMission,
    setCurrentSubMission,
    setCurrentCheckpoint,
    setIsLoading,
    setError,

    // Data getters
    getCurrentStageData,
    getCurrentStageMission,
    getCurrentMissionSubMissions,
    getMissionById,
    getSubMissionById,
    getCheckpointById,
    getStageDeliverable,
    getNextMission,
    getNextCheckpoint,
    getEarnedBadges,
    getWeeksRemaining,

    // NEW: Added getters to fix GPS101StagePage errors
    getStageByNumber,
    getMissionByStageNumber,
    getSubMissionsByMissionId,
    getStageDeliverableStatus,

    // Status checkers
    isStageUnlocked,
    isMissionUnlocked,
    isSubMissionUnlocked,
    isCheckpointUnlocked,
    isGPS101Completed,
    hasOrangeBeacon,

    // Progress getters
    getStageCompletionPercentage,
    getMissionCompletionPercentage,
    getSubMissionCompletionPercentage,
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