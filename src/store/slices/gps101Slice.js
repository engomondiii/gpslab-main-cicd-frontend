/**
 * GPS 101 Redux Slice
 * 
 * Manages GPS 101 state in Redux store.
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import gps101Service from '../../services/api/gps101.service';
import { GPS_101_CONFIG } from '../../config/gps101.config';

// ==================== ASYNC THUNKS ====================

/**
 * Enroll in GPS 101
 */
export const enrollInGPS101 = createAsyncThunk(
  'gps101/enroll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await gps101Service.enrollInGPS101();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

/**
 * Fetch GPS 101 progress
 */
export const fetchGPS101Progress = createAsyncThunk(
  'gps101/fetchProgress',
  async (_, { rejectWithValue }) => {
    try {
      const response = await gps101Service.getOverallProgress();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

/**
 * Fetch all stages
 */
export const fetchAllStages = createAsyncThunk(
  'gps101/fetchAllStages',
  async (_, { rejectWithValue }) => {
    try {
      const response = await gps101Service.getAllStages();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

/**
 * Fetch all missions
 */
export const fetchAllMissions = createAsyncThunk(
  'gps101/fetchAllMissions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await gps101Service.getAllMissions();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

/**
 * Start mission
 */
export const startGPS101Mission = createAsyncThunk(
  'gps101/startMission',
  async (missionId, { rejectWithValue }) => {
    try {
      const response = await gps101Service.startMission(missionId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

/**
 * Submit checkpoint
 */
export const submitGPS101Checkpoint = createAsyncThunk(
  'gps101/submitCheckpoint',
  async ({ checkpointId, submissionData }, { rejectWithValue }) => {
    try {
      const response = await gps101Service.submitCheckpoint(checkpointId, submissionData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

/**
 * Complete mission
 */
export const completeGPS101Mission = createAsyncThunk(
  'gps101/completeMission',
  async (missionId, { rejectWithValue }) => {
    try {
      const response = await gps101Service.completeMission(missionId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

/**
 * Complete stage
 */
export const completeGPS101Stage = createAsyncThunk(
  'gps101/completeStage',
  async ({ stageNumber, deliverableData }, { rejectWithValue }) => {
    try {
      const response = await gps101Service.completeStage(stageNumber, deliverableData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

/**
 * Save deliverable
 */
export const saveGPS101Deliverable = createAsyncThunk(
  'gps101/saveDeliverable',
  async ({ deliverableId, data }, { rejectWithValue }) => {
    try {
      const response = await gps101Service.saveDeliverable(deliverableId, data);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

/**
 * Fetch all deliverables
 */
export const fetchGPS101Deliverables = createAsyncThunk(
  'gps101/fetchDeliverables',
  async (_, { rejectWithValue }) => {
    try {
      const response = await gps101Service.getAllDeliverables();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

/**
 * Retry checkpoint
 */
export const retryGPS101Checkpoint = createAsyncThunk(
  'gps101/retryCheckpoint',
  async ({ checkpointId, retryType }, { rejectWithValue }) => {
    try {
      const response = await gps101Service.retryCheckpoint(checkpointId, retryType);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ==================== INITIAL STATE ====================

const initialState = {
  // Enrollment
  isEnrolled: false,
  enrollmentDate: null,

  // Stages
  stages: [],
  currentStage: 1,

  // Missions
  missions: [],
  currentMission: null,

  // Checkpoints
  checkpoints: [],
  currentCheckpoint: null,

  // Deliverables
  deliverables: {
    identityStatement: null,
    problemCandidate: null,
    problemOwnerStory: null,
    lifePurposeStatement: null,
    purposeDrivenProject: null
  },

  // Progress
  completedStages: 0,
  completedMissions: 0,
  completedCheckpoints: 0,
  overallProgress: 0,

  // Rewards
  totalBarakaEarned: 0,
  totalXPEarned: 0,
  earnedBadges: [],

  // R2R/pR2R
  r2rBalance: GPS_101_CONFIG.R2R_INITIAL,
  pr2rBalance: 0,

  // Loading states
  loading: {
    enrollment: false,
    progress: false,
    stages: false,
    missions: false,
    checkpoints: false,
    deliverables: false
  },

  // Error states
  error: {
    enrollment: null,
    progress: null,
    stages: null,
    missions: null,
    checkpoints: null,
    deliverables: null
  }
};

// ==================== SLICE ====================

const gps101Slice = createSlice({
  name: 'gps101',
  initialState,
  reducers: {
    // Set current stage
    setCurrentStage: (state, action) => {
      state.currentStage = action.payload;
    },

    // Set current mission
    setCurrentMission: (state, action) => {
      state.currentMission = action.payload;
    },

    // Set current checkpoint
    setCurrentCheckpoint: (state, action) => {
      state.currentCheckpoint = action.payload;
    },

    // Update deliverable
    updateDeliverable: (state, action) => {
      const { deliverableId, data } = action.payload;
      state.deliverables[deliverableId] = data;
    },

    // Clear GPS 101 state
    clearGPS101State: (state) => {
      return initialState;
    },

    // Update mission status
    updateMissionStatus: (state, action) => {
      const { missionId, status } = action.payload;
      const missionIndex = state.missions.findIndex(m => m.missionId === missionId);
      if (missionIndex !== -1) {
        state.missions[missionIndex].status = status;
      }
    },

    // Update checkpoint status
    updateCheckpointStatus: (state, action) => {
      const { checkpointId, status } = action.payload;
      const checkpointIndex = state.checkpoints.findIndex(c => c.checkpointId === checkpointId);
      if (checkpointIndex !== -1) {
        state.checkpoints[checkpointIndex].status = status;
      }
    },

    // Add earned badge
    addEarnedBadge: (state, action) => {
      if (!state.earnedBadges.includes(action.payload)) {
        state.earnedBadges.push(action.payload);
      }
    }
  },
  extraReducers: (builder) => {
    // Enroll in GPS 101
    builder
      .addCase(enrollInGPS101.pending, (state) => {
        state.loading.enrollment = true;
        state.error.enrollment = null;
      })
      .addCase(enrollInGPS101.fulfilled, (state, action) => {
        state.loading.enrollment = false;
        state.isEnrolled = true;
        state.enrollmentDate = action.payload.enrollmentDate;
      })
      .addCase(enrollInGPS101.rejected, (state, action) => {
        state.loading.enrollment = false;
        state.error.enrollment = action.payload;
      });

    // Fetch progress
    builder
      .addCase(fetchGPS101Progress.pending, (state) => {
        state.loading.progress = true;
        state.error.progress = null;
      })
      .addCase(fetchGPS101Progress.fulfilled, (state, action) => {
        state.loading.progress = false;
        state.completedStages = action.payload.completedStages;
        state.completedMissions = action.payload.completedMissions;
        state.completedCheckpoints = action.payload.completedCheckpoints;
        state.overallProgress = action.payload.overallProgress;
        state.totalBarakaEarned = action.payload.totalBarakaEarned;
        state.totalXPEarned = action.payload.totalXPEarned;
      })
      .addCase(fetchGPS101Progress.rejected, (state, action) => {
        state.loading.progress = false;
        state.error.progress = action.payload;
      });

    // Fetch all stages
    builder
      .addCase(fetchAllStages.pending, (state) => {
        state.loading.stages = true;
        state.error.stages = null;
      })
      .addCase(fetchAllStages.fulfilled, (state, action) => {
        state.loading.stages = false;
        state.stages = action.payload;
      })
      .addCase(fetchAllStages.rejected, (state, action) => {
        state.loading.stages = false;
        state.error.stages = action.payload;
      });

    // Fetch all missions
    builder
      .addCase(fetchAllMissions.pending, (state) => {
        state.loading.missions = true;
        state.error.missions = null;
      })
      .addCase(fetchAllMissions.fulfilled, (state, action) => {
        state.loading.missions = false;
        state.missions = action.payload;
      })
      .addCase(fetchAllMissions.rejected, (state, action) => {
        state.loading.missions = false;
        state.error.missions = action.payload;
      });

    // Start mission
    builder
      .addCase(startGPS101Mission.pending, (state) => {
        state.loading.missions = true;
      })
      .addCase(startGPS101Mission.fulfilled, (state, action) => {
        state.loading.missions = false;
        state.currentMission = action.payload.missionId;
        
        // Update mission status
        const missionIndex = state.missions.findIndex(m => m.missionId === action.payload.missionId);
        if (missionIndex !== -1) {
          state.missions[missionIndex].status = 'in_progress';
          state.missions[missionIndex].startedAt = action.payload.startedAt;
        }
      })
      .addCase(startGPS101Mission.rejected, (state, action) => {
        state.loading.missions = false;
        state.error.missions = action.payload;
      });

    // Submit checkpoint
    builder
      .addCase(submitGPS101Checkpoint.pending, (state) => {
        state.loading.checkpoints = true;
      })
      .addCase(submitGPS101Checkpoint.fulfilled, (state, action) => {
        state.loading.checkpoints = false;
        
        // Update checkpoint
        const checkpointIndex = state.checkpoints.findIndex(
          c => c.checkpointId === action.payload.checkpointId
        );
        if (checkpointIndex !== -1) {
          state.checkpoints[checkpointIndex] = action.payload;
        } else {
          state.checkpoints.push(action.payload);
        }

        // Update totals if passed
        if (action.payload.status === 'passed') {
          state.completedCheckpoints += 1;
          state.totalBarakaEarned += action.payload.barakaEarned || 0;
          state.totalXPEarned += action.payload.xpEarned || 0;
        }
      })
      .addCase(submitGPS101Checkpoint.rejected, (state, action) => {
        state.loading.checkpoints = false;
        state.error.checkpoints = action.payload;
      });

    // Complete mission
    builder
      .addCase(completeGPS101Mission.pending, (state) => {
        state.loading.missions = true;
      })
      .addCase(completeGPS101Mission.fulfilled, (state, action) => {
        state.loading.missions = false;
        state.completedMissions += 1;
        state.totalBarakaEarned += action.payload.barakaEarned || 0;
        state.totalXPEarned += action.payload.xpEarned || 0;

        // Update mission status
        const missionIndex = state.missions.findIndex(m => m.missionId === action.payload.missionId);
        if (missionIndex !== -1) {
          state.missions[missionIndex].status = 'completed';
          state.missions[missionIndex].completedAt = action.payload.completedAt;
        }

        // Add badge if earned
        if (action.payload.badgeEarned) {
          if (!state.earnedBadges.includes(action.payload.badgeEarned)) {
            state.earnedBadges.push(action.payload.badgeEarned);
          }
        }
      })
      .addCase(completeGPS101Mission.rejected, (state, action) => {
        state.loading.missions = false;
        state.error.missions = action.payload;
      });

    // Complete stage
    builder
      .addCase(completeGPS101Stage.pending, (state) => {
        state.loading.stages = true;
      })
      .addCase(completeGPS101Stage.fulfilled, (state, action) => {
        state.loading.stages = false;
        state.completedStages += 1;
        state.totalBarakaEarned += action.payload.barakaEarned || 0;
        state.totalXPEarned += action.payload.xpEarned || 0;

        // Update stage status
        const stageIndex = state.stages.findIndex(s => s.stageNumber === action.payload.stageNumber);
        if (stageIndex !== -1) {
          state.stages[stageIndex].status = 'completed';
          state.stages[stageIndex].completedAt = action.payload.completedAt;
        }

        // Add badge if earned
        if (action.payload.badgeEarned) {
          if (!state.earnedBadges.includes(action.payload.badgeEarned)) {
            state.earnedBadges.push(action.payload.badgeEarned);
          }
        }
      })
      .addCase(completeGPS101Stage.rejected, (state, action) => {
        state.loading.stages = false;
        state.error.stages = action.payload;
      });

    // Save deliverable
    builder
      .addCase(saveGPS101Deliverable.pending, (state) => {
        state.loading.deliverables = true;
      })
      .addCase(saveGPS101Deliverable.fulfilled, (state, action) => {
        state.loading.deliverables = false;
        const { deliverableId, data } = action.payload;
        state.deliverables[deliverableId] = data;
      })
      .addCase(saveGPS101Deliverable.rejected, (state, action) => {
        state.loading.deliverables = false;
        state.error.deliverables = action.payload;
      });

    // Fetch deliverables
    builder
      .addCase(fetchGPS101Deliverables.pending, (state) => {
        state.loading.deliverables = true;
      })
      .addCase(fetchGPS101Deliverables.fulfilled, (state, action) => {
        state.loading.deliverables = false;
        state.deliverables = action.payload;
      })
      .addCase(fetchGPS101Deliverables.rejected, (state, action) => {
        state.loading.deliverables = false;
        state.error.deliverables = action.payload;
      });

    // Retry checkpoint
    builder
      .addCase(retryGPS101Checkpoint.pending, (state) => {
        state.loading.checkpoints = true;
      })
      .addCase(retryGPS101Checkpoint.fulfilled, (state, action) => {
        state.loading.checkpoints = false;
        
        // Update R2R or pR2R balance
        if (action.payload.retryType === 'R2R') {
          state.r2rBalance = action.payload.newR2RBalance;
        } else if (action.payload.retryType === 'pR2R') {
          state.pr2rBalance = action.payload.newPR2RBalance;
        }

        // Reset checkpoint status
        const checkpointIndex = state.checkpoints.findIndex(
          c => c.checkpointId === action.payload.checkpointId
        );
        if (checkpointIndex !== -1) {
          state.checkpoints[checkpointIndex].status = 'retrying';
        }
      })
      .addCase(retryGPS101Checkpoint.rejected, (state, action) => {
        state.loading.checkpoints = false;
        state.error.checkpoints = action.payload;
      });
  }
});

// Export actions
export const {
  setCurrentStage,
  setCurrentMission,
  setCurrentCheckpoint,
  updateDeliverable,
  clearGPS101State,
  updateMissionStatus,
  updateCheckpointStatus,
  addEarnedBadge
} = gps101Slice.actions;

// Export reducer
export default gps101Slice.reducer;