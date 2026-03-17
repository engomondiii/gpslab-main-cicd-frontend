/**
 * GPS 101 Redux Selectors
 * 
 * CORRECTED STRUCTURE:
 * - 5 Missions (1 per stage)
 * - 30 Sub-missions (6 per mission)
 * - 150 Checkpoints (5 per sub-mission)
 * 
 * Memoized selectors for GPS 101 state with complete selector logic.
 */

import { createSelector } from '@reduxjs/toolkit';
import { GPS_101_CONFIG } from '../../config/gps101.config';
import { GPS_101_ALL_MISSIONS } from '../../utils/constants/gps101.constants';

// ==================== BASE SELECTORS ====================

export const selectGPS101State = (state) => state.gps101;

export const selectIsEnrolled = (state) => state.gps101?.isEnrolled || false;

export const selectCurrentStage = (state) => state.gps101?.currentStage || 1;

export const selectCurrentMission = (state) => state.gps101?.currentMission || null;

export const selectCurrentSubMission = (state) => state.gps101?.currentSubMission || null; // NEW

export const selectCurrentCheckpoint = (state) => state.gps101?.currentCheckpoint || null;

export const selectStages = (state) => state.gps101?.stages || [];

export const selectMissions = (state) => state.gps101?.missions || []; // 5 missions

export const selectSubMissions = (state) => state.gps101?.subMissions || []; // NEW: 30 sub-missions

export const selectCheckpoints = (state) => state.gps101?.checkpoints || []; // 150 checkpoints

export const selectDeliverables = (state) => state.gps101?.deliverables || {};

export const selectCompletedStages = (state) => state.gps101?.completedStages || 0;

export const selectCompletedMissions = (state) => state.gps101?.completedMissions || 0; // Out of 5

export const selectCompletedSubMissions = (state) => state.gps101?.completedSubMissions || 0; // NEW: Out of 30

export const selectCompletedCheckpoints = (state) => state.gps101?.completedCheckpoints || 0; // Out of 150

export const selectTotalBarakaEarned = (state) => state.gps101?.totalBarakaEarned || 0;

export const selectTotalXPEarned = (state) => state.gps101?.totalXPEarned || 0;

export const selectEarnedBadges = (state) => state.gps101?.earnedBadges || [];

export const selectR2RBalance = (state) => state.gps101?.r2rBalance ?? 3;

export const selectPR2RBalance = (state) => state.gps101?.pr2rBalance || 0;

export const selectGPS101Loading = (state) => state.gps101?.loading || {};

export const selectGPS101Error = (state) => state.gps101?.error || {};

// ==================== COMPUTED SELECTORS ====================

/**
 * Select overall progress percentage (CORRECTED: Based on 5 missions)
 */
export const selectOverallProgress = createSelector(
  [selectCompletedMissions],
  (completedMissions) => {
    const totalMissions = GPS_101_CONFIG?.TOTAL_MISSIONS || 5;
    return Math.round((completedMissions / totalMissions) * 100);
  }
);

/**
 * Select current stage data
 */
export const selectCurrentStageData = createSelector(
  [selectCurrentStage],
  (currentStage) => {
    if (!GPS_101_CONFIG?.STAGES) return null;
    return GPS_101_CONFIG.STAGES.find(stage => stage.stageNumber === currentStage);
  }
);

/**
 * Select mission for current stage (CORRECTED: 1 mission per stage)
 */
export const selectCurrentStageMission = createSelector(
  [selectCurrentStage, selectMissions],
  (currentStage, missions) => {
    if (!GPS_101_ALL_MISSIONS) return null;
    
    // Find the mission for this stage
    const stageMission = GPS_101_ALL_MISSIONS.find(m => m.stageNumber === currentStage);
    if (!stageMission) return null;
    
    const missionState = missions.find(m => m.missionId === stageMission.missionId);
    
    return {
      ...stageMission,
      status: missionState?.status || 'locked',
      startedAt: missionState?.startedAt,
      completedAt: missionState?.completedAt
    };
  }
);

/**
 * NEW: Select sub-missions for current mission
 */
export const selectCurrentMissionSubMissions = createSelector(
  [selectCurrentMission, selectSubMissions],
  (currentMissionId, subMissions) => {
    if (!currentMissionId || !GPS_101_ALL_MISSIONS) return [];
    
    const mission = GPS_101_ALL_MISSIONS.find(m => m.missionId === currentMissionId);
    if (!mission?.subMissions) return [];
    
    return mission.subMissions.map(subMission => {
      const subMissionState = subMissions.find(sm => sm.subMissionId === subMission.subMissionId);
      return {
        ...subMission,
        status: subMissionState?.status || 'locked',
        startedAt: subMissionState?.startedAt,
        completedAt: subMissionState?.completedAt
      };
    });
  }
);

/**
 * Select stage completion status (CORRECTED: 1 mission per stage)
 */
export const selectStageCompletionStatus = createSelector(
  [selectStages, selectMissions],
  (stages, missions) => {
    if (!GPS_101_CONFIG?.STAGES || !GPS_101_ALL_MISSIONS) return [];
    
    return GPS_101_CONFIG.STAGES.map(stage => {
      // CORRECTED: 1 mission per stage
      const stageMission = GPS_101_ALL_MISSIONS.find(m => m.stageNumber === stage.stageNumber);
      const missionState = missions.find(m => m.missionId === stageMission?.missionId);
      const isCompleted = missionState?.status === 'completed';
      
      return {
        stageNumber: stage.stageNumber,
        stageName: stage.stageName,
        stageNameKo: stage.stageNameKo,
        totalMissions: 1, // CORRECTED: 1 mission per stage
        completedMissions: isCompleted ? 1 : 0,
        completionPercentage: isCompleted ? 100 : 0,
        isCompleted
      };
    });
  }
);

/**
 * Select mission completion status (CORRECTED: Based on sub-missions)
 */
export const selectMissionCompletionStatus = (missionId) => createSelector(
  [selectSubMissions],
  (subMissions) => {
    if (!GPS_101_ALL_MISSIONS) return null;
    
    const mission = GPS_101_ALL_MISSIONS.find(m => m.missionId === missionId);
    if (!mission?.subMissions) return null;

    const completedSubMissions = mission.subMissions.filter(subMission => {
      const subMissionState = subMissions.find(sm => sm.subMissionId === subMission.subMissionId);
      return subMissionState?.status === 'completed';
    }).length;

    return {
      missionId,
      totalSubMissions: mission.subMissions.length, // 6
      completedSubMissions,
      completionPercentage: Math.round((completedSubMissions / mission.subMissions.length) * 100),
      isCompleted: completedSubMissions === mission.subMissions.length
    };
  }
);

/**
 * NEW: Select sub-mission completion status (Based on checkpoints)
 */
export const selectSubMissionCompletionStatus = (subMissionId) => createSelector(
  [selectCheckpoints],
  (checkpoints) => {
    if (!GPS_101_ALL_MISSIONS) return null;
    
    // Find the sub-mission in mission data
    let subMission = null;
    for (const mission of GPS_101_ALL_MISSIONS) {
      if (!mission.subMissions) continue;
      const found = mission.subMissions.find(sm => sm.subMissionId === subMissionId);
      if (found) {
        subMission = found;
        break;
      }
    }
    
    if (!subMission?.checkpoints) return null;

    const passedCheckpoints = subMission.checkpoints.filter(checkpoint => {
      const checkpointState = checkpoints.find(c => c.checkpointId === checkpoint.checkpointId);
      return checkpointState?.status === 'passed';
    }).length;

    return {
      subMissionId,
      totalCheckpoints: subMission.checkpoints.length, // 5
      passedCheckpoints,
      completionPercentage: Math.round((passedCheckpoints / subMission.checkpoints.length) * 100),
      isCompleted: passedCheckpoints === subMission.checkpoints.length
    };
  }
);

/**
 * Select next uncompleted mission
 */
export const selectNextMission = createSelector(
  [selectMissions],
  (missions) => {
    if (!GPS_101_ALL_MISSIONS) return null;
    
    for (const mission of GPS_101_ALL_MISSIONS) {
      const missionState = missions.find(m => m.missionId === mission.missionId);
      if (!missionState || missionState.status !== 'completed') {
        return mission;
      }
    }
    return null;
  }
);

/**
 * Select if GPS 101 is completed
 */
export const selectIsGPS101Completed = createSelector(
  [selectCompletedMissions],
  (completedMissions) => {
    const totalMissions = GPS_101_CONFIG?.TOTAL_MISSIONS || 5;
    return completedMissions === totalMissions;
  }
);

/**
 * Select if Orange Beacon is earned
 */
export const selectHasOrangeBeacon = createSelector(
  [selectTotalBarakaEarned],
  (totalBarakaEarned) => {
    const targetBaraka = GPS_101_CONFIG?.TOTAL_BARAKA || 5000;
    return totalBarakaEarned >= targetBaraka;
  }
);

/**
 * Select Baraka progress to Orange Beacon
 */
export const selectBarakaProgress = createSelector(
  [selectTotalBarakaEarned],
  (totalBarakaEarned) => {
    const targetBaraka = GPS_101_CONFIG?.TOTAL_BARAKA || 5000;
    return {
      current: totalBarakaEarned,
      target: targetBaraka,
      percentage: Math.round((totalBarakaEarned / targetBaraka) * 100)
    };
  }
);

/**
 * Select completed deliverables count
 */
export const selectCompletedDeliverablesCount = createSelector(
  [selectDeliverables],
  (deliverables) => {
    return Object.values(deliverables || {}).filter(d => d !== null && d !== undefined).length;
  }
);

/**
 * Select progress summary (CORRECTED: Includes sub-missions)
 */
export const selectProgressSummary = createSelector(
  [
    selectCompletedStages,
    selectCompletedMissions,
    selectCompletedSubMissions,
    selectCompletedCheckpoints,
    selectTotalBarakaEarned,
    selectTotalXPEarned,
    selectOverallProgress,
    selectCompletedDeliverablesCount
  ],
  (
    completedStages,
    completedMissions,
    completedSubMissions,
    completedCheckpoints,
    totalBarakaEarned,
    totalXPEarned,
    overallProgress,
    completedDeliverablesCount
  ) => {
    const totalStages = GPS_101_CONFIG?.TOTAL_STAGES || 5;
    const totalMissions = GPS_101_CONFIG?.TOTAL_MISSIONS || 5;
    const totalSubMissions = GPS_101_CONFIG?.TOTAL_SUB_MISSIONS || 30;
    const totalCheckpoints = GPS_101_CONFIG?.TOTAL_CHECKPOINTS || 150;
    const totalDeliverables = GPS_101_CONFIG?.DELIVERABLES?.length || 5;
    
    return {
      stages: {
        completed: completedStages,
        total: totalStages,
        percentage: Math.round((completedStages / totalStages) * 100)
      },
      missions: {
        completed: completedMissions,
        total: totalMissions, // CORRECTED: 5, not 30
        percentage: overallProgress
      },
      subMissions: { // NEW
        completed: completedSubMissions,
        total: totalSubMissions, // 30
        percentage: Math.round((completedSubMissions / totalSubMissions) * 100)
      },
      checkpoints: {
        completed: completedCheckpoints,
        total: totalCheckpoints, // 150
        percentage: Math.round((completedCheckpoints / totalCheckpoints) * 100)
      },
      deliverables: {
        completed: completedDeliverablesCount,
        total: totalDeliverables, // 5
        percentage: Math.round((completedDeliverablesCount / totalDeliverables) * 100)
      },
      rewards: {
        baraka: totalBarakaEarned,
        xp: totalXPEarned
      },
      overallProgress
    };
  }
);

/**
 * Select unlocked stages
 */
export const selectUnlockedStages = createSelector(
  [selectStageCompletionStatus],
  (stageStatuses) => {
    const unlockedStages = [1]; // Stage 1 is always unlocked

    for (let i = 1; i < stageStatuses.length; i++) {
      if (stageStatuses[i - 1].isCompleted) {
        unlockedStages.push(i + 1);
      } else {
        break;
      }
    }

    return unlockedStages;
  }
);

/**
 * Select if stage is unlocked
 */
export const selectIsStageUnlocked = (stageNumber) => createSelector(
  [selectUnlockedStages],
  (unlockedStages) => {
    return unlockedStages.includes(stageNumber);
  }
);

/**
 * Select if mission is unlocked
 */
export const selectIsMissionUnlocked = (missionId) => createSelector(
  [selectMissions, selectUnlockedStages],
  (missions, unlockedStages) => {
    if (!GPS_101_ALL_MISSIONS) return false;
    
    const mission = GPS_101_ALL_MISSIONS.find(m => m.missionId === missionId);
    if (!mission) return false;

    // Mission is unlocked if its stage is unlocked
    return unlockedStages.includes(mission.stageNumber);
  }
);

/**
 * NEW: Select if sub-mission is unlocked
 */
export const selectIsSubMissionUnlocked = (subMissionId) => createSelector(
  [selectMissions, selectSubMissions],
  (missions, subMissions) => {
    if (!GPS_101_ALL_MISSIONS) return false;
    
    // Find parent mission
    let parentMission = null;
    let targetSubMission = null;
    
    for (const mission of GPS_101_ALL_MISSIONS) {
      if (!mission.subMissions) continue;
      const found = mission.subMissions.find(sm => sm.subMissionId === subMissionId);
      if (found) {
        parentMission = mission;
        targetSubMission = found;
        break;
      }
    }
    
    if (!parentMission || !targetSubMission) return false;
    
    // Check if parent mission is unlocked
    const missionState = missions.find(m => m.missionId === parentMission.missionId);
    const isMissionUnlocked = missionState?.status === 'in_progress' || missionState?.status === 'completed';
    
    if (!isMissionUnlocked) return false;
    
    // First sub-mission is unlocked if mission is unlocked
    if (targetSubMission.subMissionNumber === 1) return true;
    
    // Check if previous sub-mission is completed
    const previousSubMission = parentMission.subMissions.find(
      sm => sm.subMissionNumber === targetSubMission.subMissionNumber - 1
    );
    
    if (!previousSubMission) return false;
    
    const previousSubMissionState = subMissions.find(
      sm => sm.subMissionId === previousSubMission.subMissionId
    );
    
    return previousSubMissionState?.status === 'completed';
  }
);

/**
 * Select weeks remaining
 */
export const selectWeeksRemaining = createSelector(
  [selectCompletedMissions],
  (completedMissions) => {
    const weeksCompleted = Math.floor(completedMissions * 3); // 3 weeks per mission
    const totalWeeks = GPS_101_CONFIG?.DURATION_WEEKS || 15;
    return Math.max(0, totalWeeks - weeksCompleted);
  }
);

/**
 * Select stage badges earned
 */
export const selectStageBadgesEarned = createSelector(
  [selectEarnedBadges],
  (earnedBadges) => {
    return earnedBadges.filter(badge => badge.startsWith('GPS101_STAGE_'));
  }
);

/**
 * Select if specific badge is earned
 */
export const selectIsBadgeEarned = (badgeId) => createSelector(
  [selectEarnedBadges],
  (earnedBadges) => {
    return earnedBadges.includes(badgeId);
  }
);

// ==================== EXPORTS ====================

export default {
  // Base selectors
  selectGPS101State,
  selectIsEnrolled,
  selectCurrentStage,
  selectCurrentMission,
  selectCurrentSubMission, // NEW
  selectCurrentCheckpoint,
  selectStages,
  selectMissions,
  selectSubMissions, // NEW
  selectCheckpoints,
  selectDeliverables,
  selectCompletedStages,
  selectCompletedMissions,
  selectCompletedSubMissions, // NEW
  selectCompletedCheckpoints,
  selectTotalBarakaEarned,
  selectTotalXPEarned,
  selectEarnedBadges,
  selectR2RBalance,
  selectPR2RBalance,
  selectGPS101Loading,
  selectGPS101Error,
  
  // Computed selectors
  selectOverallProgress,
  selectCurrentStageData,
  selectCurrentStageMission,
  selectCurrentMissionSubMissions, // NEW
  selectStageCompletionStatus,
  selectMissionCompletionStatus,
  selectSubMissionCompletionStatus, // NEW
  selectNextMission,
  selectIsGPS101Completed,
  selectHasOrangeBeacon,
  selectBarakaProgress,
  selectCompletedDeliverablesCount,
  selectProgressSummary,
  selectUnlockedStages,
  selectIsStageUnlocked,
  selectIsMissionUnlocked,
  selectIsSubMissionUnlocked, // NEW
  selectWeeksRemaining,
  selectStageBadgesEarned,
  selectIsBadgeEarned
};