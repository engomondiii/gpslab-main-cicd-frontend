/**
 * GPS Lab Platform - Baraka Service
 * 
 * Baraka currency management service for balance, transactions,
 * earning, spending, and withdrawal operations.
 * 
 * @module services/api/baraka.service
 * @version 1.0.0
 */

import apiClient from './client';
import { getCache, setCache } from '../storage/localStorage.service';
import { logBarakaTransaction, logUserAction } from '../../utils/error/error.logger';
import { getBarakaTier, calculateTierProgress } from '../../utils/helpers/baraka.calculator';

// =============================================================================
// API ENDPOINTS
// =============================================================================

const ENDPOINTS = {
  balance: '/baraka/balance',
  transactions: '/baraka/transactions',
  earn: '/baraka/earn',
  spend: '/baraka/spend',
  withdraw: '/baraka/withdraw',
  withdrawHistory: '/baraka/withdraw/history',
  tier: '/baraka/tier',
  opportunities: '/baraka/opportunities',
  store: '/baraka/store',
  storeItem: (id) => `/baraka/store/${id}`,
  purchase: '/baraka/purchase',
  transfer: '/baraka/transfer',
  covenant: '/baraka/covenant'
};

// =============================================================================
// CACHE CONFIGURATION
// =============================================================================

const CACHE_TTL = {
  balance: 30 * 1000,       // 30 seconds
  tier: 5 * 60 * 1000,      // 5 minutes
  store: 10 * 60 * 1000     // 10 minutes
};

// =============================================================================
// BALANCE OPERATIONS
// =============================================================================

/**
 * Gets current Baraka balance
 * @param {Object} options - Options
 * @returns {Promise<Object>} Balance data
 */
export const getBalance = async ({ useCache = true } = {}) => {
  if (useCache) {
    const cached = getCache('baraka_balance', CACHE_TTL.balance);
    if (cached) {
      return cached;
    }
  }
  
  const response = await apiClient.get(ENDPOINTS.balance);
  
  setCache('baraka_balance', response.data);
  
  return response.data;
};

/**
 * Gets detailed Baraka summary
 * @returns {Promise<Object>} Summary data
 */
export const getBarakaSummary = async () => {
  const response = await apiClient.get(`${ENDPOINTS.balance}/summary`);
  return response.data;
};

/**
 * Gets user's Baraka tier
 * @param {Object} options - Options
 * @returns {Promise<Object>} Tier data
 */
export const getTier = async ({ useCache = true } = {}) => {
  if (useCache) {
    const cached = getCache('baraka_tier', CACHE_TTL.tier);
    if (cached) {
      return cached;
    }
  }
  
  const response = await apiClient.get(ENDPOINTS.tier);
  
  // Enrich with local calculations
  const enriched = {
    ...response.data,
    localTier: getBarakaTier(response.data.totalEarned),
    progress: calculateTierProgress(response.data.totalEarned)
  };
  
  setCache('baraka_tier', enriched);
  
  return enriched;
};

// =============================================================================
// TRANSACTIONS
// =============================================================================

/**
 * Gets Baraka transactions
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} Transactions list
 */
export const getTransactions = async ({
  page = 1,
  limit = 20,
  type,
  startDate,
  endDate,
  sortOrder = 'desc'
} = {}) => {
  const params = { page, limit, sortOrder };
  if (type) params.type = type;
  if (startDate) params.startDate = startDate;
  if (endDate) params.endDate = endDate;
  
  const response = await apiClient.get(ENDPOINTS.transactions, { params });
  
  return response.data;
};

/**
 * Gets transaction details
 * @param {string} transactionId - Transaction ID
 * @returns {Promise<Object>} Transaction data
 */
export const getTransaction = async (transactionId) => {
  const response = await apiClient.get(`${ENDPOINTS.transactions}/${transactionId}`);
  return response.data;
};

/**
 * Gets transaction summary
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} Summary data
 */
export const getTransactionSummary = async ({ period = '30d' } = {}) => {
  const response = await apiClient.get(`${ENDPOINTS.transactions}/summary`, {
    params: { period }
  });
  return response.data;
};

// =============================================================================
// EARNING OPERATIONS
// =============================================================================

/**
 * Records Baraka earnings
 * @param {Object} data - Earning data
 * @returns {Promise<Object>} Transaction result
 */
export const earnBaraka = async ({ source, amount, metadata = {} }) => {
  const response = await apiClient.post(ENDPOINTS.earn, {
    source,
    amount,
    metadata
  });
  
  // Invalidate balance cache
  invalidateBalanceCache();
  
  logBarakaTransaction('earn', amount, { source, ...metadata });
  
  // Dispatch event for UI updates
  window.dispatchEvent(new CustomEvent('baraka:earned', { 
    detail: { amount, source, newBalance: response.data.newBalance }
  }));
  
  return response.data;
};

/**
 * Gets available earning opportunities
 * @returns {Promise<Object>} Opportunities list
 */
export const getEarnOpportunities = async () => {
  const response = await apiClient.get(ENDPOINTS.opportunities);
  return response.data;
};

// =============================================================================
// SPENDING OPERATIONS
// =============================================================================

/**
 * Spends Baraka
 * @param {Object} data - Spending data
 * @returns {Promise<Object>} Transaction result
 */
export const spendBaraka = async ({ purpose, amount, metadata = {} }) => {
  const response = await apiClient.post(ENDPOINTS.spend, {
    purpose,
    amount,
    metadata
  });
  
  // Invalidate balance cache
  invalidateBalanceCache();
  
  logBarakaTransaction('spend', amount, { purpose, ...metadata });
  
  // Dispatch event for UI updates
  window.dispatchEvent(new CustomEvent('baraka:spent', { 
    detail: { amount, purpose, newBalance: response.data.newBalance }
  }));
  
  return response.data;
};

/**
 * Checks if user can afford amount
 * @param {number} amount - Amount to check
 * @returns {Promise<Object>} Affordability result
 */
export const canAfford = async (amount) => {
  const balance = await getBalance();
  return {
    canAfford: balance.available >= amount,
    available: balance.available,
    shortage: Math.max(0, amount - balance.available)
  };
};

// =============================================================================
// STORE OPERATIONS
// =============================================================================

/**
 * Gets Baraka store items
 * @param {Object} options - Options
 * @returns {Promise<Object>} Store items
 */
export const getStoreItems = async ({ category, useCache = true } = {}) => {
  const cacheKey = `baraka_store_${category || 'all'}`;
  
  if (useCache) {
    const cached = getCache(cacheKey, CACHE_TTL.store);
    if (cached) {
      return cached;
    }
  }
  
  const params = {};
  if (category) params.category = category;
  
  const response = await apiClient.get(ENDPOINTS.store, { params });
  
  setCache(cacheKey, response.data);
  
  return response.data;
};

/**
 * Gets store item details
 * @param {string} itemId - Item ID
 * @returns {Promise<Object>} Item details
 */
export const getStoreItem = async (itemId) => {
  const response = await apiClient.get(ENDPOINTS.storeItem(itemId));
  return response.data;
};

/**
 * Purchases store item
 * @param {string} itemId - Item ID
 * @param {Object} options - Purchase options
 * @returns {Promise<Object>} Purchase result
 */
export const purchaseItem = async (itemId, { quantity = 1 } = {}) => {
  const response = await apiClient.post(ENDPOINTS.purchase, {
    itemId,
    quantity
  });
  
  // Invalidate caches
  invalidateBalanceCache();
  
  logUserAction('baraka_purchase', { itemId, quantity });
  logBarakaTransaction('spend', response.data.totalCost, { 
    purpose: 'store_purchase',
    itemId 
  });
  
  return response.data;
};

// =============================================================================
// WITHDRAWAL OPERATIONS
// =============================================================================

/**
 * Initiates Baraka withdrawal
 * @param {Object} data - Withdrawal data
 * @returns {Promise<Object>} Withdrawal result
 */
export const initiateWithdrawal = async ({ 
  amount, 
  method, 
  accountDetails,
  currency = 'USD'
}) => {
  const response = await apiClient.post(ENDPOINTS.withdraw, {
    amount,
    method,
    accountDetails,
    currency
  });
  
  // Invalidate balance cache
  invalidateBalanceCache();
  
  logUserAction('baraka_withdrawal_initiated', { amount, method });
  logBarakaTransaction('withdraw', amount, { method });
  
  return response.data;
};

/**
 * Gets withdrawal history
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} Withdrawal history
 */
export const getWithdrawalHistory = async ({ page = 1, limit = 20 } = {}) => {
  const response = await apiClient.get(ENDPOINTS.withdrawHistory, {
    params: { page, limit }
  });
  return response.data;
};

/**
 * Gets withdrawal methods
 * @returns {Promise<Object>} Available methods
 */
export const getWithdrawalMethods = async () => {
  const response = await apiClient.get(`${ENDPOINTS.withdraw}/methods`);
  return response.data;
};

/**
 * Cancels pending withdrawal
 * @param {string} withdrawalId - Withdrawal ID
 * @returns {Promise<Object>} Cancellation result
 */
export const cancelWithdrawal = async (withdrawalId) => {
  const response = await apiClient.post(`${ENDPOINTS.withdraw}/${withdrawalId}/cancel`);
  
  invalidateBalanceCache();
  
  logUserAction('baraka_withdrawal_cancelled', { withdrawalId });
  
  return response.data;
};

// =============================================================================
// TRANSFER OPERATIONS
// =============================================================================

/**
 * Transfers Baraka to another user
 * @param {Object} data - Transfer data
 * @returns {Promise<Object>} Transfer result
 */
export const transferBaraka = async ({ recipientId, amount, message }) => {
  const response = await apiClient.post(ENDPOINTS.transfer, {
    recipientId,
    amount,
    message
  });
  
  // Invalidate balance cache
  invalidateBalanceCache();
  
  logBarakaTransaction('transfer_out', amount, { recipientId });
  
  return response.data;
};

// =============================================================================
// COVENANT OPERATIONS
// =============================================================================

/**
 * Gets covenant return summary
 * @returns {Promise<Object>} Covenant data
 */
export const getCovenantSummary = async () => {
  const response = await apiClient.get(ENDPOINTS.covenant);
  return response.data;
};

/**
 * Gets covenant return history
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} Covenant history
 */
export const getCovenantHistory = async ({ page = 1, limit = 20 } = {}) => {
  const response = await apiClient.get(`${ENDPOINTS.covenant}/history`, {
    params: { page, limit }
  });
  return response.data;
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Invalidates balance cache
 */
const invalidateBalanceCache = () => {
  const { removeItem } = require('../storage/localStorage.service');
  removeItem('cache_baraka_balance');
  removeItem('cache_baraka_tier');
};

/**
 * Formats Baraka amount for display
 * @param {number} amount - Amount to format
 * @returns {string} Formatted amount
 */
export const formatBarakaAmount = (amount) => {
  if (amount >= 1000000) {
    return `${(amount / 1000000).toFixed(1)}M`;
  }
  if (amount >= 1000) {
    return `${(amount / 1000).toFixed(1)}K`;
  }
  return amount.toString();
};

/**
 * Gets transaction type label
 * @param {string} type - Transaction type
 * @returns {Object} Type info
 */
export const getTransactionTypeInfo = (type) => {
  const types = {
    earn_mission: { label: 'Mission Reward', icon: '🎯', color: 'green' },
    earn_checkpoint: { label: 'Checkpoint Bonus', icon: '✅', color: 'green' },
    earn_streak: { label: 'Streak Bonus', icon: '🔥', color: 'green' },
    earn_honor: { label: 'Honor Received', icon: '🙏', color: 'green' },
    earn_referral: { label: 'Referral Bonus', icon: '👥', color: 'green' },
    spend_retry: { label: 'Retry Cost', icon: '🔄', color: 'red' },
    spend_purchase: { label: 'Store Purchase', icon: '🛒', color: 'red' },
    spend_pr2r: { label: 'pR2R Activation', icon: '⚡', color: 'red' },
    transfer_out: { label: 'Transfer Sent', icon: '📤', color: 'red' },
    transfer_in: { label: 'Transfer Received', icon: '📥', color: 'green' },
    withdraw: { label: 'Withdrawal', icon: '💸', color: 'red' },
    covenant: { label: 'Covenant Return', icon: '🤝', color: 'green' }
  };
  
  return types[type] || { label: type, icon: '💰', color: 'gray' };
};

/**
 * Refreshes balance
 * @returns {Promise<Object>} Updated balance
 */
export const refreshBalance = async () => {
  return getBalance({ useCache: false });
};

// =============================================================================
// EXPORTS
// =============================================================================

export default {
  // Balance
  getBalance,
  getBarakaSummary,
  getTier,
  refreshBalance,
  
  // Transactions
  getTransactions,
  getTransaction,
  getTransactionSummary,
  
  // Earning
  earnBaraka,
  getEarnOpportunities,
  
  // Spending
  spendBaraka,
  canAfford,
  
  // Store
  getStoreItems,
  getStoreItem,
  purchaseItem,
  
  // Withdrawal
  initiateWithdrawal,
  getWithdrawalHistory,
  getWithdrawalMethods,
  cancelWithdrawal,
  
  // Transfer
  transferBaraka,
  
  // Covenant
  getCovenantSummary,
  getCovenantHistory,
  
  // Helpers
  formatBarakaAmount,
  getTransactionTypeInfo
};