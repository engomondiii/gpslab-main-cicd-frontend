/**
 * useGPS101 Hook
 * 
 * Custom hook for GPS 101 functionality.
 * Provides easy access to GPS 101 state and actions.
 */

import { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useGPS101Context } from '../context/GPS101Context';
import {
  enrollInGPS101,
  fetchGPS101Progress,
  fetchAllStages,
  fetchAllMissions,
  startGPS101Mission,
  submitGPS101Checkpoint,
  completeGPS101Mission,
  completeGPS101Stage,
  saveGPS101Deliverable,
  fetchGPS101Deliverables,
  retryGPS101Checkpoint,
  setCurrentStage,
  setCurrentMission,
  setCurrentCheckpoint
} from '../store/slices/gps101Slice';
import {
  selectGPS101State,
  selectIsEnrolled,
  selectCurrentStage,
  selectCurrentMission,
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

  // Redux selectors
  const gps101State = useSelector(selectGPS101State);
  const isEnrolled = useSelector(selectIsEnrolled);
  const currentStage = useSelector(selectCurrentStage);
  const currentMission = useSelector(selectCurrentMission);
  const progressSummary = useSelector(selectProgressSummary);
  const isCompleted = useSelector(selectIsGPS101Completed);
  const hasOrangeBeacon = useSelector(selectHasOrangeBeacon);
  const barakaProgress = useSelector(selectBarakaProgress);
  const nextMission = useSelector(selectNextMission);
  const loading = useSelector(selectGPS101Loading);
  const error = useSelector(selectGPS101Error);

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
   * Enroll in GPS 101
   */
  const enroll = useCallback(async () => {
    try {
      await dispatch(enrollInGPS101()).unwrap();
      await initialize();
      return { success: true };
    } catch (error) {
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
      context.updateDeliverable(deliverableId, data);
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
    if (context.isStageUnlocked(stageNumber)) {
      dispatch(setCurrentStage(stageNumber));
      context.setCurrentStage(stageNumber);
      return true;
    }
    return false;
  }, [dispatch, context]);

  /**
   * Navigate to mission
   */
  const navigateToMission = useCallback((missionId) => {
    if (context.isMissionUnlocked(missionId)) {
      dispatch(setCurrentMission(missionId));
      context.setCurrentMission(missionId);
      return true;
    }
    return false;
  }, [dispatch, context]);

  /**
   * Navigate to checkpoint
   */
  const navigateToCheckpoint = useCallback((checkpointId) => {
    if (context.isCheckpointUnlocked(checkpointId)) {
      dispatch(setCurrentCheckpoint(checkpointId));
      context.setCurrentCheckpoint(checkpointId);
      return true;
    }
    return false;
  }, [dispatch, context]);

  /**
   * Get current stage data
   */
  const getCurrentStageData = useCallback(() => {
    return context.getCurrentStageData();
  }, [context]);

  /**
   * Get current stage missions
   */
  const getCurrentStageMissions = useCallback(() => {
    return context.getCurrentStageMissions();
  }, [context]);

  /**
   * Get mission by ID
   */
  const getMissionById = useCallback((missionId) => {
    return context.getMissionById(missionId);
  }, [context]);

  /**
   * Get checkpoint by ID
   */
  const getCheckpointById = useCallback((checkpointId) => {
    return context.getCheckpointById(checkpointId);
  }, [context]);

  /**
   * Check if stage is unlocked
   */
  const isStageUnlocked = useCallback((stageNumber) => {
    return context.isStageUnlocked(stageNumber);
  }, [context]);

  /**
   * Check if mission is unlocked
   */
  const isMissionUnlocked = useCallback((missionId) => {
    return context.isMissionUnlocked(missionId);
  }, [context]);

  /**
   * Check if checkpoint is unlocked
   */
  const isCheckpointUnlocked = useCallback((checkpointId) => {
    return context.isCheckpointUnlocked(checkpointId);
  }, [context]);

  /**
   * Get stage completion percentage
   */
  const getStageCompletionPercentage = useCallback((stageNumber) => {
    return context.getStageCompletionPercentage(stageNumber);
  }, [context]);

  /**
   * Get mission completion percentage
   */
  const getMissionCompletionPercentage = useCallback((missionId) => {
    return context.getMissionCompletionPercentage(missionId);
  }, [context]);

  /**
   * Get earned badges
   */
  const getEarnedBadges = useCallback(() => {
    return context.getEarnedBadges();
  }, [context]);

  /**
   * Get R2R balance
   */
  const getR2RBalance = useCallback(() => {
    return context.getR2RBalance();
  }, [context]);

  /**
   * Get pR2R balance
   */
  const getPR2RBalance = useCallback(() => {
    return context.getPR2RBalance();
  }, [context]);

  /**
   * Get weeks remaining
   */
  const getWeeksRemaining = useCallback(() => {
    return context.getWeeksRemaining();
  }, [context]);

  // Memoized values
  const gps101Data = useMemo(() => ({
    isEnrolled,
    currentStage,
    currentMission,
    progressSummary,
    isCompleted,
    hasOrangeBeacon,
    barakaProgress,
    nextMission,
    loading,
    error
  }), [
    isEnrolled,
    currentStage,
    currentMission,
    progressSummary,
    isCompleted,
    hasOrangeBeacon,
    barakaProgress,
    nextMission,
    loading,
    error
  ]);

  return {
    // State
    ...gps101Data,

    // Actions
    initialize,
    enroll,
    startMission,
    submitCheckpoint,
    completeMission,
    completeStage,
    saveDeliverable,
    retryCheckpoint,

    // Navigation
    navigateToStage,
    navigateToMission,
    navigateToCheckpoint,

    // Data getters
    getCurrentStageData,
    getCurrentStageMissions,
    getMissionById,
    getCheckpointById,

    // Status checkers
    isStageUnlocked,
    isMissionUnlocked,
    isCheckpointUnlocked,

    // Progress getters
    getStageCompletionPercentage,
    getMissionCompletionPercentage,
    getEarnedBadges,
    getR2RBalance,
    getPR2RBalance,
    getWeeksRemaining,

    // Context
    context
  };
};

export default useGPS101;