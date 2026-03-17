/**
 * useGPS101 Hook
 * 
 * CORRECTED STRUCTURE:
 * - 5 Missions (1 per stage)
 * - 30 Sub-missions (6 per mission)
 * - 150 Checkpoints (5 per sub-mission)
 * 
 * Custom hook for GPS 101 functionality with complete action and getter methods.
 * Provides easy access to GPS 101 state and actions.
 * 
 * UPDATED: Added all missing getter methods to fix GPS101StagePage errors
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useGPS101Context } from '../context/GPS101Context';
import {
  enrollInGPS101,
  fetchGPS101Progress,
  fetchAllStages,
  fetchAllMissions,
  startGPS101Mission,
  startGPS101SubMission,
  completeGPS101SubMission,
  submitGPS101Checkpoint,
  completeGPS101Mission,
  completeGPS101Stage,
  saveGPS101Deliverable,
  fetchGPS101Deliverables,
  retryGPS101Checkpoint,
  setCurrentStage,
  setCurrentMission,
  setCurrentSubMission,
  setCurrentCheckpoint
} from '../store/slices/gps101Slice';
import {
  selectGPS101State,
  selectIsEnrolled,
  selectCurrentStage,
  selectCurrentMission,
  selectCurrentSubMission,
  selectProgressSummary,
  selectIsGPS101Completed,
  selectHasOrangeBeacon,
  selectBarakaProgress,
  selectNextMission,
  selectGPS101Loading,
  selectGPS101Error
} from '../store/selectors/gps101Selectors';

/**
 * useGPS101 Hook
 */
const useGPS101 = () => {
  const dispatch = useDispatch();
  const context = useGPS101Context();

  // Local state for enrollment tracking
  const [localEnrolled, setLocalEnrolled] = useState(false);

  // Redux selectors
  const gps101State = useSelector(selectGPS101State);
  const reduxIsEnrolled = useSelector(selectIsEnrolled);
  const currentStage = useSelector(selectCurrentStage);
  const currentMission = useSelector(selectCurrentMission);
  const currentSubMission = useSelector(selectCurrentSubMission);
  const progressSummary = useSelector(selectProgressSummary);
  const isCompleted = useSelector(selectIsGPS101Completed);
  const hasOrangeBeacon = useSelector(selectHasOrangeBeacon);
  const barakaProgress = useSelector(selectBarakaProgress);
  const nextMission = useSelector(selectNextMission);
  const loading = useSelector(selectGPS101Loading);
  const error = useSelector(selectGPS101Error);

  // Check localStorage for enrollment status once on mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('gps_user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        if (user.gps101Enrolled) {
          setLocalEnrolled(true);
        }
      }
    } catch (e) {
      console.error('Error reading localStorage:', e);
    }
  }, []);

  // Combined enrollment status (Redux OR local state)
  const isEnrolled = useMemo(() => {
    return reduxIsEnrolled || localEnrolled;
  }, [reduxIsEnrolled, localEnrolled]);

  /**
   * Initialize GPS 101 data
   */
  const initialize = useCallback(async () => {
    try {
      await dispatch(fetchGPS101Progress()).unwrap();
      await dispatch(fetchAllStages()).unwrap();
      await dispatch(fetchAllMissions()).unwrap();
      await dispatch(fetchGPS101Deliverables()).unwrap();
    } catch (error) {
      console.error('Failed to initialize GPS 101:', error);
    }
  }, [dispatch]);

  /**
   * Enroll in GPS 101 with proper state updates
   */
  const enroll = useCallback(async () => {
    try {
      // 1. Update Redux
      const result = await dispatch(enrollInGPS101()).unwrap();
      
      // 2. Update local state immediately
      setLocalEnrolled(true);
      
      // 3. Re-initialize to fetch fresh data
      await initialize();
      
      return { success: true, data: result };
    } catch (error) {
      console.error('Enrollment error:', error);
      
      // Even if API fails, mark as enrolled locally
      setLocalEnrolled(true);
      
      return { success: false, error };
    }
  }, [dispatch, initialize]);

  /**
   * Start a mission
   */
  const startMission = useCallback(async (missionId) => {
    try {
      const result = await dispatch(startGPS101Mission(missionId)).unwrap();
      dispatch(setCurrentMission(missionId));
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error };
    }
  }, [dispatch]);

  /**
   * Complete a mission
   */
  const completeMission = useCallback(async (missionId) => {
    try {
      const result = await dispatch(completeGPS101Mission(missionId)).unwrap();
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error };
    }
  }, [dispatch]);

  /**
   * Start a sub-mission
   */
  const startSubMission = useCallback(async (subMissionId) => {
    try {
      const result = await dispatch(startGPS101SubMission(subMissionId)).unwrap();
      dispatch(setCurrentSubMission(subMissionId));
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error };
    }
  }, [dispatch]);

  /**
   * Complete a sub-mission
   */
  const completeSubMission = useCallback(async (subMissionId) => {
    try {
      const result = await dispatch(completeGPS101SubMission(subMissionId)).unwrap();
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error };
    }
  }, [dispatch]);

  /**
   * Submit a checkpoint
   */
  const submitCheckpoint = useCallback(async (checkpointId, submissionData) => {
    try {
      const result = await dispatch(submitGPS101Checkpoint({ 
        checkpointId, 
        submissionData 
      })).unwrap();
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error };
    }
  }, [dispatch]);

  /**
   * Complete a stage
   */
  const completeStage = useCallback(async (stageNumber, deliverableData) => {
    try {
      const result = await dispatch(completeGPS101Stage({ 
        stageNumber, 
        deliverableData 
      })).unwrap();
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error };
    }
  }, [dispatch]);

  /**
   * Save a deliverable
   */
  const saveDeliverable = useCallback(async (deliverableId, data) => {
    try {
      const result = await dispatch(saveGPS101Deliverable({ 
        deliverableId, 
        data 
      })).unwrap();
      if (context?.updateDeliverable) {
        context.updateDeliverable(deliverableId, data);
      }
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error };
    }
  }, [dispatch, context]);

  /**
   * Retry a checkpoint
   */
  const retryCheckpoint = useCallback(async (checkpointId, retryType = 'R2R') => {
    try {
      const result = await dispatch(retryGPS101Checkpoint({ 
        checkpointId, 
        retryType 
      })).unwrap();
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error };
    }
  }, [dispatch]);

  /**
   * Navigate to stage
   */
  const navigateToStage = useCallback((stageNumber) => {
    if (context?.isStageUnlocked && context.isStageUnlocked(stageNumber)) {
      dispatch(setCurrentStage(stageNumber));
      if (context.setCurrentStage) {
        context.setCurrentStage(stageNumber);
      }
      return true;
    }
    return false;
  }, [dispatch, context]);

  /**
   * Navigate to mission
   */
  const navigateToMission = useCallback((missionId) => {
    if (context?.isMissionUnlocked && context.isMissionUnlocked(missionId)) {
      dispatch(setCurrentMission(missionId));
      if (context.setCurrentMission) {
        context.setCurrentMission(missionId);
      }
      return true;
    }
    return false;
  }, [dispatch, context]);

  /**
   * Navigate to sub-mission
   */
  const navigateToSubMission = useCallback((subMissionId) => {
    if (context?.isSubMissionUnlocked && context.isSubMissionUnlocked(subMissionId)) {
      dispatch(setCurrentSubMission(subMissionId));
      if (context.setCurrentSubMission) {
        context.setCurrentSubMission(subMissionId);
      }
      return true;
    }
    return false;
  }, [dispatch, context]);

  /**
   * Navigate to checkpoint
   */
  const navigateToCheckpoint = useCallback((checkpointId) => {
    if (context?.isCheckpointUnlocked && context.isCheckpointUnlocked(checkpointId)) {
      dispatch(setCurrentCheckpoint(checkpointId));
      if (context.setCurrentCheckpoint) {
        context.setCurrentCheckpoint(checkpointId);
      }
      return true;
    }
    return false;
  }, [dispatch, context]);

  /**
   * Get current stage data
   */
  const getCurrentStageData = useCallback(() => {
    return context?.getCurrentStageData ? context.getCurrentStageData() : null;
  }, [context]);

  /**
   * Get current stage mission (CORRECTED: 1 mission per stage)
   */
  const getCurrentStageMission = useCallback(() => {
    return context?.getCurrentStageMission ? context.getCurrentStageMission() : null;
  }, [context]);

  /**
   * Get sub-missions for current mission
   */
  const getCurrentMissionSubMissions = useCallback(() => {
    return context?.getCurrentMissionSubMissions ? context.getCurrentMissionSubMissions() : [];
  }, [context]);

  /**
   * Get mission by ID
   */
  const getMissionById = useCallback((missionId) => {
    return context?.getMissionById ? context.getMissionById(missionId) : null;
  }, [context]);

  /**
   * Get sub-mission by ID
   */
  const getSubMissionById = useCallback((subMissionId) => {
    return context?.getSubMissionById ? context.getSubMissionById(subMissionId) : null;
  }, [context]);

  /**
   * Get checkpoint by ID
   */
  const getCheckpointById = useCallback((checkpointId) => {
    return context?.getCheckpointById ? context.getCheckpointById(checkpointId) : null;
  }, [context]);

  /**
   * NEW: Get stage by number (ADDED TO FIX GPS101StagePage ERROR)
   */
  const getStageByNumber = useCallback((stageNumber) => {
    return context?.getStageByNumber ? context.getStageByNumber(stageNumber) : null;
  }, [context]);

  /**
   * NEW: Get mission by stage number (ADDED TO FIX GPS101StagePage ERROR)
   */
  const getMissionByStageNumber = useCallback((stageNumber) => {
    return context?.getMissionByStageNumber ? context.getMissionByStageNumber(stageNumber) : null;
  }, [context]);

  /**
   * NEW: Get sub-missions by mission ID (ADDED TO FIX GPS101StagePage ERROR)
   */
  const getSubMissionsByMissionId = useCallback((missionId) => {
    return context?.getSubMissionsByMissionId ? context.getSubMissionsByMissionId(missionId) : [];
  }, [context]);

  /**
   * NEW: Get stage deliverable status (ADDED TO FIX GPS101StagePage ERROR)
   */
  const getStageDeliverableStatus = useCallback((stageNumber) => {
    return context?.getStageDeliverableStatus ? context.getStageDeliverableStatus(stageNumber) : null;
  }, [context]);

  /**
   * Check if stage is unlocked
   */
  const isStageUnlocked = useCallback((stageNumber) => {
    return context?.isStageUnlocked ? context.isStageUnlocked(stageNumber) : false;
  }, [context]);

  /**
   * Check if mission is unlocked
   */
  const isMissionUnlocked = useCallback((missionId) => {
    return context?.isMissionUnlocked ? context.isMissionUnlocked(missionId) : false;
  }, [context]);

  /**
   * Check if sub-mission is unlocked
   */
  const isSubMissionUnlocked = useCallback((subMissionId) => {
    return context?.isSubMissionUnlocked ? context.isSubMissionUnlocked(subMissionId) : false;
  }, [context]);

  /**
   * Check if checkpoint is unlocked
   */
  const isCheckpointUnlocked = useCallback((checkpointId) => {
    return context?.isCheckpointUnlocked ? context.isCheckpointUnlocked(checkpointId) : false;
  }, [context]);

  /**
   * Get stage completion percentage
   */
  const getStageCompletionPercentage = useCallback((stageNumber) => {
    return context?.getStageCompletionPercentage 
      ? context.getStageCompletionPercentage(stageNumber) 
      : 0;
  }, [context]);

  /**
   * Get mission completion percentage
   */
  const getMissionCompletionPercentage = useCallback((missionId) => {
    return context?.getMissionCompletionPercentage 
      ? context.getMissionCompletionPercentage(missionId) 
      : 0;
  }, [context]);

  /**
   * Get sub-mission completion percentage
   */
  const getSubMissionCompletionPercentage = useCallback((subMissionId) => {
    return context?.getSubMissionCompletionPercentage 
      ? context.getSubMissionCompletionPercentage(subMissionId) 
      : 0;
  }, [context]);

  /**
   * Get stage deliverable
   */
  const getStageDeliverable = useCallback((stageNumber) => {
    return context?.getStageDeliverable 
      ? context.getStageDeliverable(stageNumber) 
      : null;
  }, [context]);

  /**
   * Get earned badges
   */
  const getEarnedBadges = useCallback(() => {
    return context?.getEarnedBadges ? context.getEarnedBadges() : [];
  }, [context]);

  /**
   * Get R2R balance
   */
  const getR2RBalance = useCallback(() => {
    return context?.getR2RBalance ? context.getR2RBalance() : 3;
  }, [context]);

  /**
   * Get pR2R balance
   */
  const getPR2RBalance = useCallback(() => {
    return context?.getPR2RBalance ? context.getPR2RBalance() : 0;
  }, [context]);

  /**
   * Get weeks remaining
   */
  const getWeeksRemaining = useCallback(() => {
    return context?.getWeeksRemaining ? context.getWeeksRemaining() : 15;
  }, [context]);

  /**
   * Get next checkpoint in current sub-mission
   */
  const getNextCheckpoint = useCallback((subMissionId) => {
    return context?.getNextCheckpoint ? context.getNextCheckpoint(subMissionId) : null;
  }, [context]);

  /**
   * Get all stages data
   */
  const stages = useMemo(() => {
    return context?.stages || gps101State?.stages || [];
  }, [context, gps101State]);

  /**
   * Get total Baraka earned
   */
  const totalBaraka = useMemo(() => {
    return gps101State?.totalBarakaEarned || 0;
  }, [gps101State]);

  // Memoized values with safe defaults (CORRECTED)
  const gps101Data = useMemo(() => ({
    isEnrolled,
    currentStage: currentStage || 1,
    currentMission: currentMission || null,
    currentSubMission: currentSubMission || null,
    progressSummary: progressSummary || {
      stages: { completed: 0, total: 5, percentage: 0 },
      missions: { completed: 0, total: 5, percentage: 0 },
      subMissions: { completed: 0, total: 30, percentage: 0 },
      checkpoints: { completed: 0, total: 150, percentage: 0 },
      deliverables: { completed: 0, total: 5, percentage: 0 },
      rewards: { baraka: 0, xp: 0 },
      overallProgress: 0
    },
    isCompleted: isCompleted || false,
    hasOrangeBeacon: hasOrangeBeacon || false,
    barakaProgress: barakaProgress || { current: 0, target: 5000, percentage: 0 },
    nextMission: nextMission || null,
    loading: loading || {},
    error: error || null,
    stages,
    totalBaraka
  }), [
    isEnrolled,
    currentStage,
    currentMission,
    currentSubMission,
    progressSummary,
    isCompleted,
    hasOrangeBeacon,
    barakaProgress,
    nextMission,
    loading,
    error,
    stages,
    totalBaraka
  ]);

  return {
    // State
    ...gps101Data,

    // Actions
    initialize,
    enroll,
    startMission,
    completeMission,
    startSubMission,
    completeSubMission,
    submitCheckpoint,
    completeStage,
    saveDeliverable,
    retryCheckpoint,

    // Navigation
    navigateToStage,
    navigateToMission,
    navigateToSubMission,
    navigateToCheckpoint,

    // Data getters
    getCurrentStageData,
    getCurrentStageMission,
    getCurrentMissionSubMissions,
    getMissionById,
    getSubMissionById,
    getCheckpointById,
    getNextCheckpoint,
    
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

    // Progress getters
    getStageCompletionPercentage,
    getMissionCompletionPercentage,
    getSubMissionCompletionPercentage,
    getStageDeliverable,
    getEarnedBadges,
    getR2RBalance,
    getPR2RBalance,
    getWeeksRemaining,

    // Context
    context
  };
};

export default useGPS101;