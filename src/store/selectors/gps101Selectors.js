/**
 * GPS 101 Redux Selectors
 * 
 * Memoized selectors for GPS 101 state.
 */

import { createSelector } from '@reduxjs/toolkit';
import { GPS_101_CONFIG } from '../../config/gps101.config';
import { GPS_101_ALL_MISSIONS } from '../../utils/constants/gps101.constants';

// ==================== BASE SELECTORS ====================

export const selectGPS101State = (state) => state.gps101;

export const selectIsEnrolled = (state) => state.gps101.isEnrolled;

export const selectCurrentStage = (state) => state.gps101.currentStage;

export const selectCurrentMission = (state) => state.gps101.currentMission;

export const selectCurrentCheckpoint = (state) => state.gps101.currentCheckpoint;

export const selectStages = (state) => state.gps101.stages;

export const selectMissions = (state) => state.gps101.missions;

export const selectCheckpoints = (state) => state.gps101.checkpoints;

export const selectDeliverables = (state) => state.gps101.deliverables;

export const selectCompletedStages = (state) => state.gps101.completedStages;

export const selectCompletedMissions = (state) => state.gps101.completedMissions;

export const selectCompletedCheckpoints = (state) => state.gps101.completedCheckpoints;

export const selectTotalBarakaEarned = (state) => state.gps101.totalBarakaEarned;

export const selectTotalXPEarned = (state) => state.gps101.totalXPEarned;

export const selectEarnedBadges = (state) => state.gps101.earnedBadges;

export const selectR2RBalance = (state) => state.gps101.r2rBalance;

export const selectPR2RBalance = (state) => state.gps101.pr2rBalance;

export const selectGPS101Loading = (state) => state.gps101.loading;

export const selectGPS101Error = (state) => state.gps101.error;

// ==================== COMPUTED SELECTORS ====================

/**
 * Select overall progress percentage
 */
export const selectOverallProgress = createSelector(
  [selectCompletedMissions],
  (completedMissions) => {
    return Math.round((completedMissions / GPS_101_CONFIG.TOTAL_MISSIONS) * 100);
  }
);

/**
 * Select current stage data
 */
export const selectCurrentStageData = createSelector(
  [selectCurrentStage],
  (currentStage) => {
    return GPS_101_CONFIG.STAGES.find(stage => stage.stageNumber === currentStage);
  }
);

/**
 * Select missions for current stage
 */
export const selectCurrentStageMissions = createSelector(
  [selectCurrentStage, selectMissions],
  (currentStage, missions) => {
    const stageMissions = GPS_101_ALL_MISSIONS.filter(m => m.stageNumber === currentStage);
    return stageMissions.map(mission => {
      const missionState = missions.find(m => m.missionId === mission.missionId);
      return {
        ...mission,
        status: missionState?.status || 'locked',
        startedAt: missionState?.startedAt,
        completedAt: missionState?.completedAt
      };
    });
  }
);

/**
 * Select stage completion status
 */
export const selectStageCompletionStatus = createSelector(
  [selectStages, selectMissions],
  (stages, missions) => {
    return GPS_101_CONFIG.STAGES.map(stage => {
      const stageMissions = GPS_101_ALL_MISSIONS.filter(m => m.stageNumber === stage.stageNumber);
      const completedMissions = stageMissions.filter(mission => {
        const missionState = missions.find(m => m.missionId === mission.missionId);
        return missionState?.status === 'completed';
      }).length;

      return {
        stageNumber: stage.stageNumber,
        stageName: stage.stageName,
        totalMissions: stageMissions.length,
        completedMissions,
        completionPercentage: Math.round((completedMissions / stageMissions.length) * 100),
        isCompleted: completedMissions === stageMissions.length
      };
    });
  }
);

/**
 * Select mission completion status for a specific mission
 */
export const selectMissionCompletionStatus = (missionId) => createSelector(
  [selectCheckpoints],
  (checkpoints) => {
    const mission = GPS_101_ALL_MISSIONS.find(m => m.missionId === missionId);
    if (!mission) return null;

    const passedCheckpoints = mission.checkpoints.filter(checkpoint => {
      const checkpointState = checkpoints.find(c => c.checkpointId === checkpoint.checkpointId);
      return checkpointState?.status === 'passed';
    }).length;

    return {
      missionId,
      totalCheckpoints: mission.checkpoints.length,
      passedCheckpoints,
      completionPercentage: Math.round((passedCheckpoints / mission.checkpoints.length) * 100),
      isCompleted: passedCheckpoints === mission.checkpoints.length
    };
  }
);

/**
 * Select next uncompleted mission
 */
export const selectNextMission = createSelector(
  [selectMissions],
  (missions) => {
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
    return completedMissions === GPS_101_CONFIG.TOTAL_MISSIONS;
  }
);

/**
 * Select if Orange Beacon is earned
 */
export const selectHasOrangeBeacon = createSelector(
  [selectTotalBarakaEarned],
  (totalBarakaEarned) => {
    return totalBarakaEarned >= GPS_101_CONFIG.TOTAL_BARAKA;
  }
);

/**
 * Select Baraka progress to Orange Beacon
 */
export const selectBarakaProgress = createSelector(
  [selectTotalBarakaEarned],
  (totalBarakaEarned) => {
    return {
      current: totalBarakaEarned,
      target: GPS_101_CONFIG.TOTAL_BARAKA,
      percentage: Math.round((totalBarakaEarned / GPS_101_CONFIG.TOTAL_BARAKA) * 100)
    };
  }
);

/**
 * Select completed deliverables count
 */
export const selectCompletedDeliverablesCount = createSelector(
  [selectDeliverables],
  (deliverables) => {
    return Object.values(deliverables).filter(d => d !== null).length;
  }
);

/**
 * Select progress summary
 */
export const selectProgressSummary = createSelector(
  [
    selectCompletedStages,
    selectCompletedMissions,
    selectCompletedCheckpoints,
    selectTotalBarakaEarned,
    selectTotalXPEarned,
    selectOverallProgress,
    selectCompletedDeliverablesCount
  ],
  (
    completedStages,
    completedMissions,
    completedCheckpoints,
    totalBarakaEarned,
    totalXPEarned,
    overallProgress,
    completedDeliverablesCount
  ) => {
    return {
      stages: {
        completed: completedStages,
        total: GPS_101_CONFIG.TOTAL_STAGES,
        percentage: Math.round((completedStages / GPS_101_CONFIG.TOTAL_STAGES) * 100)
      },
      missions: {
        completed: completedMissions,
        total: GPS_101_CONFIG.TOTAL_MISSIONS,
        percentage: overallProgress
      },
      checkpoints: {
        completed: completedCheckpoints,
        total: GPS_101_CONFIG.TOTAL_CHECKPOINTS,
        percentage: Math.round((completedCheckpoints / GPS_101_CONFIG.TOTAL_CHECKPOINTS) * 100)
      },
      deliverables: {
        completed: completedDeliverablesCount,
        total: GPS_101_CONFIG.DELIVERABLES.length,
        percentage: Math.round((completedDeliverablesCount / GPS_101_CONFIG.DELIVERABLES.length) * 100)
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
    const mission = GPS_101_ALL_MISSIONS.find(m => m.missionId === missionId);
    if (!mission) return false;

    // Check if stage is unlocked
    if (!unlockedStages.includes(mission.stageNumber)) return false;

    // First mission of stage is always unlocked if stage is unlocked
    if (mission.missionNumber === 1) return true;

    // Check if previous mission is completed
    const previousMission = GPS_101_ALL_MISSIONS.find(
      m => m.stageNumber === mission.stageNumber && m.missionNumber === mission.missionNumber - 1
    );

    if (!previousMission) return false;

    const previousMissionState = missions.find(m => m.missionId === previousMission.missionId);
    return previousMissionState?.status === 'completed';
  }
);

/**
 * Select weeks remaining
 */
export const selectWeeksRemaining = createSelector(
  [selectCompletedMissions],
  (completedMissions) => {
    const weeksCompleted = Math.floor(completedMissions / 2); // Approximate: 2 missions per week
    return Math.max(0, GPS_101_CONFIG.DURATION_WEEKS - weeksCompleted);
  }
);

/**
 * Select stage badges earned
 */
export const selectStageBadgesEarned = createSelector(
  [selectEarnedBadges],
  (earnedBadges) => {
    return earnedBadges.filter(badge => badge.startsWith('gps-101-stage-'));
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

export default {
  selectGPS101State,
  selectIsEnrolled,
  selectCurrentStage,
  selectCurrentMission,
  selectCurrentCheckpoint,
  selectStages,
  selectMissions,
  selectCheckpoints,
  selectDeliverables,
  selectCompletedStages,
  selectCompletedMissions,
  selectCompletedCheckpoints,
  selectTotalBarakaEarned,
  selectTotalXPEarned,
  selectEarnedBadges,
  selectR2RBalance,
  selectPR2RBalance,
  selectGPS101Loading,
  selectGPS101Error,
  selectOverallProgress,
  selectCurrentStageData,
  selectCurrentStageMissions,
  selectStageCompletionStatus,
  selectMissionCompletionStatus,
  selectNextMission,
  selectIsGPS101Completed,
  selectHasOrangeBeacon,
  selectBarakaProgress,
  selectCompletedDeliverablesCount,
  selectProgressSummary,
  selectUnlockedStages,
  selectIsStageUnlocked,
  selectIsMissionUnlocked,
  selectWeeksRemaining,
  selectStageBadgesEarned,
  selectIsBadgeEarned
};