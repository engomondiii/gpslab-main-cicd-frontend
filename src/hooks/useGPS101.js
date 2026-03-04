/**
 * useGPS101 Hook
 * 
 * Custom hook for GPS 101 functionality.
 * Provides easy access to GPS 101 state and actions.
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

  // Local state for enrollment tracking
  const [localEnrolled, setLocalEnrolled] = useState(false);

  // Redux selectors
  const gps101State = useSelector(selectGPS101State);
  const reduxIsEnrolled = useSelector(selectIsEnrolled);
  const currentStage = useSelector(selectCurrentStage);
  const currentMission = useSelector(selectCurrentMission);
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
      // Fetch data from API (don't update local state here to avoid loops)
      await dispatch(fetchGPS101Progress()).unwrap();
      await dispatch(fetchAllStages()).unwrap();
      await dispatch(fetchAllMissions()).unwrap();
      await dispatch(fetchGPS101Deliverables()).unwrap();
    } catch (error) {
      console.error('Failed to initialize GPS 101:', error);
    }
  }, [dispatch]);

  /**
   * FIXED: Enroll in GPS 101 with proper state updates
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
   * Get current stage missions
   */
  const getCurrentStageMissions = useCallback(() => {
    return context?.getCurrentStageMissions ? context.getCurrentStageMissions() : [];
  }, [context]);

  /**
   * Get mission by ID
   */
  const getMissionById = useCallback((missionId) => {
    return context?.getMissionById ? context.getMissionById(missionId) : null;
  }, [context]);

  /**
   * Get checkpoint by ID
   */
  const getCheckpointById = useCallback((checkpointId) => {
    return context?.getCheckpointById ? context.getCheckpointById(checkpointId) : null;
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
   * Get stage deliverable status
   */
  const getStageDeliverableStatus = useCallback((stageNumber) => {
    return context?.getStageDeliverableStatus 
      ? context.getStageDeliverableStatus(stageNumber) 
      : { completed: false, name: '', id: null };
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
    return context?.getR2RBalance ? context.getR2RBalance() : 0;
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

  // Memoized values with safe defaults
  const gps101Data = useMemo(() => ({
    isEnrolled,
    currentStage: currentStage || 1,
    currentMission: currentMission || null,
    progressSummary: progressSummary || {
      totalStages: 5,
      completedStages: 0,
      currentStageNumber: 1,
      totalMissions: 30,
      completedMissions: 0,
      totalCheckpoints: 0,
      completedCheckpoints: 0,
      overallProgress: 0
    },
    isCompleted: isCompleted || false,
    hasOrangeBeacon: hasOrangeBeacon || false,
    barakaProgress: barakaProgress || { earned: 0, total: 5000 },
    nextMission: nextMission || null,
    loading: loading || {},
    error: error || null
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
    getStageDeliverableStatus,
    getEarnedBadges,
    getR2RBalance,
    getPR2RBalance,
    getWeeksRemaining,

    // Context
    context
  };
};

export default useGPS101;