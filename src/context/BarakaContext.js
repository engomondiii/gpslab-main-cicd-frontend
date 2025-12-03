/**
 * GPS Lab Platform - BarakaContext
 * 
 * Global Baraka currency context provider for managing
 * balance, transactions, and real-time updates.
 * 
 * @module context/BarakaContext
 * @version 1.0.0
 */

import React, { createContext, useContext, useEffect, useMemo, useCallback, useReducer } from 'react';
import barakaService from '../services/api/baraka.service';
import { on as wsOn, WS_EVENTS } from '../services/websocket/websocket.service';
import { getBarakaTier, calculateTierProgress } from '../utils/helpers/baraka.calculator';

// =============================================================================
// INITIAL STATE
// =============================================================================

const initialState = {
  balance: {
    total: 0,
    available: 0,
    pending: 0,
    withdrawn: 0
  },
  tier: {
    current: 'STARTER',
    totalEarned: 0,
    progress: 0,
    nextTier: null,
    nextTierThreshold: null
  },
  transactions: [],
  isLoading: true,
  error: null,
  lastUpdated: null
};

// =============================================================================
// ACTION TYPES
// =============================================================================

const BARAKA_ACTIONS = {
  SET_LOADING: 'baraka/setLoading',
  SET_BALANCE: 'baraka/setBalance',
  SET_TIER: 'baraka/setTier',
  SET_TRANSACTIONS: 'baraka/setTransactions',
  ADD_TRANSACTION: 'baraka/addTransaction',
  SET_ERROR: 'baraka/setError',
  CLEAR_ERROR: 'baraka/clearError',
  EARN: 'baraka/earn',
  SPEND: 'baraka/spend',
  REFRESH: 'baraka/refresh'
};

// =============================================================================
// REDUCER
// =============================================================================

const barakaReducer = (state, action) => {
  switch (action.type) {
    case BARAKA_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload
      };
      
    case BARAKA_ACTIONS.SET_BALANCE:
      return {
        ...state,
        balance: action.payload,
        lastUpdated: new Date().toISOString()
      };
      
    case BARAKA_ACTIONS.SET_TIER:
      return {
        ...state,
        tier: action.payload
      };
      
    case BARAKA_ACTIONS.SET_TRANSACTIONS:
      return {
        ...state,
        transactions: action.payload
      };
      
    case BARAKA_ACTIONS.ADD_TRANSACTION:
      return {
        ...state,
        transactions: [action.payload, ...state.transactions.slice(0, 49)]
      };
      
    case BARAKA_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };
      
    case BARAKA_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };
      
    case BARAKA_ACTIONS.EARN:
      return {
        ...state,
        balance: {
          ...state.balance,
          total: state.balance.total + action.payload.amount,
          available: state.balance.available + action.payload.amount
        },
        tier: {
          ...state.tier,
          totalEarned: state.tier.totalEarned + action.payload.amount,
          ...calculateTierUpdate(state.tier.totalEarned + action.payload.amount)
        }
      };
      
    case BARAKA_ACTIONS.SPEND:
      return {
        ...state,
        balance: {
          ...state.balance,
          available: state.balance.available - action.payload.amount
        }
      };
      
    case BARAKA_ACTIONS.REFRESH:
      return {
        ...state,
        balance: action.payload.balance,
        tier: action.payload.tier,
        isLoading: false,
        lastUpdated: new Date().toISOString()
      };
      
    default:
      return state;
  }
};

/**
 * Calculates tier update based on new total earned
 */
const calculateTierUpdate = (totalEarned) => {
  const tier = getBarakaTier(totalEarned);
  const progress = calculateTierProgress(totalEarned);
  
  return {
    current: tier.name,
    progress: progress.progressPercent,
    nextTier: progress.nextTier?.name || null,
    nextTierThreshold: progress.nextTier?.minBaraka || null
  };
};

// =============================================================================
// CONTEXT
// =============================================================================

const BarakaContext = createContext(null);

// =============================================================================
// PROVIDER
// =============================================================================

export const BarakaProvider = ({ children }) => {
  const [state, dispatch] = useReducer(barakaReducer, initialState);
  
  // ===========================================================================
  // INITIALIZATION
  // ===========================================================================
  
  useEffect(() => {
    const initializeBaraka = async () => {
      try {
        dispatch({ type: BARAKA_ACTIONS.SET_LOADING, payload: true });
        
        const [balance, tier] = await Promise.all([
          barakaService.getBalance(),
          barakaService.getTier()
        ]);
        
        dispatch({
          type: BARAKA_ACTIONS.REFRESH,
          payload: { balance, tier }
        });
        
      } catch (error) {
        console.error('Failed to initialize Baraka:', error);
        dispatch({
          type: BARAKA_ACTIONS.SET_ERROR,
          payload: error
        });
      }
    };
    
    initializeBaraka();
  }, []);
  
  // ===========================================================================
  // WEBSOCKET LISTENERS
  // ===========================================================================
  
  useEffect(() => {
    // Listen for real-time Baraka updates
    const unsubscribeEarned = wsOn(WS_EVENTS.BARAKA_EARNED, (data) => {
      dispatch({
        type: BARAKA_ACTIONS.EARN,
        payload: data
      });
      
      dispatch({
        type: BARAKA_ACTIONS.ADD_TRANSACTION,
        payload: {
          id: data.transactionId,
          type: data.type,
          amount: data.amount,
          source: data.source,
          createdAt: new Date().toISOString()
        }
      });
    });
    
    const unsubscribeSpent = wsOn(WS_EVENTS.BARAKA_SPENT, (data) => {
      dispatch({
        type: BARAKA_ACTIONS.SPEND,
        payload: data
      });
      
      dispatch({
        type: BARAKA_ACTIONS.ADD_TRANSACTION,
        payload: {
          id: data.transactionId,
          type: data.type,
          amount: -data.amount,
          purpose: data.purpose,
          createdAt: new Date().toISOString()
        }
      });
    });
    
    return () => {
      unsubscribeEarned();
      unsubscribeSpent();
    };
  }, []);
  
  // ===========================================================================
  // WINDOW EVENT LISTENERS
  // ===========================================================================
  
  useEffect(() => {
    const handleBarakaEarned = (event) => {
      dispatch({
        type: BARAKA_ACTIONS.EARN,
        payload: event.detail
      });
    };
    
    const handleBarakaSpent = (event) => {
      dispatch({
        type: BARAKA_ACTIONS.SPEND,
        payload: event.detail
      });
    };
    
    window.addEventListener('baraka:earned', handleBarakaEarned);
    window.addEventListener('baraka:spent', handleBarakaSpent);
    
    return () => {
      window.removeEventListener('baraka:earned', handleBarakaEarned);
      window.removeEventListener('baraka:spent', handleBarakaSpent);
    };
  }, []);
  
  // ===========================================================================
  // METHODS
  // ===========================================================================
  
  /**
   * Refreshes balance from server
   */
  const refreshBalance = useCallback(async () => {
    try {
      const balance = await barakaService.getBalance({ useCache: false });
      dispatch({
        type: BARAKA_ACTIONS.SET_BALANCE,
        payload: balance
      });
      return balance;
    } catch (error) {
      dispatch({
        type: BARAKA_ACTIONS.SET_ERROR,
        payload: error
      });
      throw error;
    }
  }, []);
  
  /**
   * Refreshes tier from server
   */
  const refreshTier = useCallback(async () => {
    try {
      const tier = await barakaService.getTier({ useCache: false });
      dispatch({
        type: BARAKA_ACTIONS.SET_TIER,
        payload: tier
      });
      return tier;
    } catch (error) {
      dispatch({
        type: BARAKA_ACTIONS.SET_ERROR,
        payload: error
      });
      throw error;
    }
  }, []);
  
  /**
   * Fetches transactions
   */
  const fetchTransactions = useCallback(async (params = {}) => {
    try {
      const result = await barakaService.getTransactions(params);
      
      if (params.page === 1 || !params.page) {
        dispatch({
          type: BARAKA_ACTIONS.SET_TRANSACTIONS,
          payload: result.transactions
        });
      }
      
      return result;
    } catch (error) {
      dispatch({
        type: BARAKA_ACTIONS.SET_ERROR,
        payload: error
      });
      throw error;
    }
  }, []);
  
  /**
   * Spends Baraka
   */
  const spend = useCallback(async (data) => {
    try {
      const result = await barakaService.spendBaraka(data);
      
      // Update will come through WebSocket/event, but do optimistic update
      dispatch({
        type: BARAKA_ACTIONS.SPEND,
        payload: { amount: data.amount }
      });
      
      return result;
    } catch (error) {
      // Refresh balance to get accurate state
      await refreshBalance();
      throw error;
    }
  }, [refreshBalance]);
  
  /**
   * Checks if user can afford amount
   */
  const canAfford = useCallback((amount) => {
    return state.balance.available >= amount;
  }, [state.balance.available]);
  
  /**
   * Clears error
   */
  const clearError = useCallback(() => {
    dispatch({ type: BARAKA_ACTIONS.CLEAR_ERROR });
  }, []);
  
  // ===========================================================================
  // COMPUTED VALUES
  // ===========================================================================
  
  const formattedBalance = useMemo(() => {
    return barakaService.formatBarakaAmount(state.balance.available);
  }, [state.balance.available]);
  
  const formattedTotalEarned = useMemo(() => {
    return barakaService.formatBarakaAmount(state.tier.totalEarned);
  }, [state.tier.totalEarned]);
  
  // ===========================================================================
  // CONTEXT VALUE
  // ===========================================================================
  
  const contextValue = useMemo(() => ({
    // State
    ...state,
    
    // Formatted values
    formattedBalance,
    formattedTotalEarned,
    
    // Methods
    refreshBalance,
    refreshTier,
    fetchTransactions,
    spend,
    canAfford,
    clearError,
    
    // Utilities
    formatAmount: barakaService.formatBarakaAmount,
    getTransactionTypeInfo: barakaService.getTransactionTypeInfo
  }), [
    state,
    formattedBalance,
    formattedTotalEarned,
    refreshBalance,
    refreshTier,
    fetchTransactions,
    spend,
    canAfford,
    clearError
  ]);
  
  return (
    <BarakaContext.Provider value={contextValue}>
      {children}
    </BarakaContext.Provider>
  );
};

// =============================================================================
// HOOK
// =============================================================================

/**
 * Hook to use Baraka context
 * @returns {Object} Baraka context value
 */
export const useBaraka = () => {
  const context = useContext(BarakaContext);
  
  if (!context) {
    throw new Error('useBaraka must be used within a BarakaProvider');
  }
  
  return context;
};

// =============================================================================
// EXPORTS
// =============================================================================

export default BarakaContext;