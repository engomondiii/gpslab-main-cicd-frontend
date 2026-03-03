/**
 * Redux Store Configuration
 * 
 * Configures the Redux store with all reducers and middleware.
 */

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/auth.slice';
import gps101Reducer from './slices/gps101Slice';
import userReducer from './slices/user.slice';

/**
 * Create and configure Redux store
 */
const store = configureStore({
  reducer: {
    auth: authReducer,
    gps101: gps101Reducer,
    user: userReducer,
    // Add other reducers here as needed
    // missions: missionsReducer,
    // etc.
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['gps101/enrollInGPS101/fulfilled'],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['payload.timestamp', 'meta.arg'],
        // Ignore these paths in the state
        ignoredPaths: ['gps101.enrollmentDate'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;