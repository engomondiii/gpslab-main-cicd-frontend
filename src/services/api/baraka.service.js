/**
 * GPS Lab Platform - Baraka Service
 * 
 * Baraka currency management service for balance, transactions,
 * earning, spending, and withdrawal operations.
 * 
 * MOCK MODE: When REACT_APP_USE_MOCK_DATA=true or API is unreachable,
 * all methods return realistic mock data for frontend-only development.
 * 
 * @module services/api/baraka.service
 * @version 1.1.0
 */

import apiClient from './client';
import { getCache, setCache } from '../storage/localStorage.service';
import { logBarakaTransaction, logUserAction } from '../../utils/error/error.logger';
import { getBarakaTier, calculateTierProgress } from '../../utils/helpers/baraka.calculator';

// =============================================================================
// MOCK MODE CONFIGURATION
// =============================================================================

const USE_MOCK = process.env.REACT_APP_USE_MOCK_DATA === 'true' ||
                 process.env.NODE_ENV === 'development';

const mockDelay = (ms = 300) => new Promise(r => setTimeout(r, ms));
const logMock = (method) => console.info(`[BarakaService:MOCK] ${method}`);

// =============================================================================
// MOCK DATA
// =============================================================================

/**
 * In-memory mock balance (mutable for earn/spend simulation)
 */
let mockBalance = {
  available: 2450,
  pending: 150,
  totalEarned: 4200,
  totalSpent: 1600,
  totalWithdrawn: 0,
  currency: 'BRK',
  lastUpdated: new Date().toISOString()
};

const MOCK_TIER = {
  current: 'silver',
  totalEarned: 4200,
  nextTier: 'gold',
  nextTierThreshold: 10000,
  benefits: [
    'Access to Study Hub',
    '5% bonus on mission rewards',
    'Custom profile badge'
  ]
};

const MOCK_TRANSACTIONS = [
  {
    id: 'txn_001', type: 'earn_mission', amount: 250, balance: 2450,
    description: 'Mission S1M1 completed', source: 'mission_complete',
    metadata: { missionId: 'S1M1', missionTitle: 'Introduction to GPS Thinking' },
    createdAt: '2025-12-20T10:30:00Z'
  },
  {
    id: 'txn_002', type: 'earn_checkpoint', amount: 100, balance: 2200,
    description: 'Checkpoint passed: Stage 1', source: 'checkpoint_pass',
    metadata: { stageNumber: 1 },
    createdAt: '2025-12-19T14:15:00Z'
  },
  {
    id: 'txn_003', type: 'earn_streak', amount: 50, balance: 2100,
    description: '7-day streak bonus', source: 'streak_bonus',
    metadata: { streakDays: 7 },
    createdAt: '2025-12-18T08:00:00Z'
  },
  {
    id: 'txn_004', type: 'spend_purchase', amount: -200, balance: 2050,
    description: 'Store: Navigator Theme Pack', source: 'store_purchase',
    metadata: { itemId: 'item_003', itemName: 'Navigator Theme Pack' },
    createdAt: '2025-12-17T16:45:00Z'
  },
  {
    id: 'txn_005', type: 'earn_honor', amount: 75, balance: 2250,
    description: 'Honor received from peer review', source: 'honor_received',
    metadata: { fromUserId: 'usr_002', fromUsername: 'SolverAlpha' },
    createdAt: '2025-12-16T11:20:00Z'
  },
  {
    id: 'txn_006', type: 'earn_mission', amount: 300, balance: 2175,
    description: 'Mission S1M2 completed', source: 'mission_complete',
    metadata: { missionId: 'S1M2', missionTitle: 'Understanding Systems' },
    createdAt: '2025-12-15T09:10:00Z'
  },
  {
    id: 'txn_007', type: 'spend_retry', amount: -50, balance: 1875,
    description: 'Checkpoint retry: Stage 1', source: 'checkpoint_retry',
    metadata: { stageNumber: 1 },
    createdAt: '2025-12-14T13:30:00Z'
  },
  {
    id: 'txn_008', type: 'earn_referral', amount: 500, balance: 1925,
    description: 'Referral bonus: FriendJoined', source: 'referral_bonus',
    metadata: { referredUserId: 'usr_003' },
    createdAt: '2025-12-13T10:00:00Z'
  }
];

const MOCK_STORE_ITEMS = [
  {
    id: 'item_001', name: 'XP Booster (24h)', description: '2x XP for 24 hours',
    price: 500, category: 'boosters', icon: '⚡', stock: 99, popular: true
  },
  {
    id: 'item_002', name: 'Checkpoint Retry Token', description: 'One free checkpoint retry',
    price: 150, category: 'tokens', icon: '🔄', stock: 99, popular: true
  },
  {
    id: 'item_003', name: 'Navigator Theme Pack', description: 'Unlock custom navigator themes',
    price: 200, category: 'cosmetics', icon: '🎨', stock: 50, popular: false
  },
  {
    id: 'item_004', name: 'Profile Badge: Early Solver', description: 'Show off your pioneer status',
    price: 300, category: 'cosmetics', icon: '🏅', stock: 25, popular: false
  },
  {
    id: 'item_005', name: 'Party Slot Expansion', description: 'Add 2 more members to your party',
    price: 750, category: 'upgrades', icon: '👥', stock: 10, popular: true
  }
];

const MOCK_EARN_OPPORTUNITIES = [
  { id: 'opp_001', title: 'Complete Daily Mission', reward: 100, type: 'daily', available: true },
  { id: 'opp_002', title: 'Peer Review (3 submissions)', reward: 75, type: 'task', available: true },
  { id: 'opp_003', title: 'Maintain 7-day Streak', reward: 50, type: 'streak', available: true },
  { id: 'opp_004', title: 'Invite a Friend', reward: 500, type: 'referral', available: true },
  { id: 'opp_005', title: 'Complete Stage Checkpoint', reward: 200, type: 'checkpoint', available: true }
];

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
  if (USE_MOCK) {
    logMock('getBalance');
    await mockDelay(200);
    return { ...mockBalance };
  }
  
  if (useCache) {
    const cached = getCache('baraka_balance', CACHE_TTL.balance);
    if (cached) return cached;
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
  if (USE_MOCK) {
    logMock('getBarakaSummary');
    await mockDelay(250);
    return {
      balance: { ...mockBalance },
      tier: { ...MOCK_TIER },
      recentTransactions: MOCK_TRANSACTIONS.slice(0, 5),
      earningRate: { daily: 85, weekly: 595, monthly: 2380 },
      topSources: [
        { source: 'mission_complete', total: 2800, percentage: 66.7 },
        { source: 'referral_bonus', total: 500, percentage: 11.9 },
        { source: 'checkpoint_pass', total: 400, percentage: 9.5 },
        { source: 'streak_bonus', total: 300, percentage: 7.1 },
        { source: 'honor_received', total: 200, percentage: 4.8 }
      ]
    };
  }
  
  const response = await apiClient.get(`${ENDPOINTS.balance}/summary`);
  return response.data;
};

/**
 * Gets user's Baraka tier
 * @param {Object} options - Options
 * @returns {Promise<Object>} Tier data
 */
export const getTier = async ({ useCache = true } = {}) => {
  if (USE_MOCK) {
    logMock('getTier');
    await mockDelay(200);
    return {
      ...MOCK_TIER,
      localTier: getBarakaTier(MOCK_TIER.totalEarned),
      progress: calculateTierProgress(MOCK_TIER.totalEarned)
    };
  }
  
  if (useCache) {
    const cached = getCache('baraka_tier', CACHE_TTL.tier);
    if (cached) return cached;
  }
  
  const response = await apiClient.get(ENDPOINTS.tier);
  
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
  if (USE_MOCK) {
    logMock('getTransactions');
    await mockDelay(300);
    
    let filtered = [...MOCK_TRANSACTIONS];
    if (type) filtered = filtered.filter(t => t.type === type);
    
    const start = (page - 1) * limit;
    const paged = filtered.slice(start, start + limit);
    
    return {
      transactions: paged,
      pagination: {
        page, limit, total: filtered.length,
        totalPages: Math.ceil(filtered.length / limit)
      }
    };
  }
  
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
  if (USE_MOCK) {
    logMock('getTransaction');
    await mockDelay(200);
    const txn = MOCK_TRANSACTIONS.find(t => t.id === transactionId);
    if (!txn) throw new Error(`Transaction ${transactionId} not found`);
    return { ...txn };
  }
  
  const response = await apiClient.get(`${ENDPOINTS.transactions}/${transactionId}`);
  return response.data;
};

/**
 * Gets transaction summary
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} Summary data
 */
export const getTransactionSummary = async ({ period = '30d' } = {}) => {
  if (USE_MOCK) {
    logMock('getTransactionSummary');
    await mockDelay(250);
    return {
      period,
      totalEarned: 1275,
      totalSpent: 250,
      netChange: 1025,
      transactionCount: MOCK_TRANSACTIONS.length,
      byType: {
        earn_mission: { count: 2, total: 550 },
        earn_checkpoint: { count: 1, total: 100 },
        earn_streak: { count: 1, total: 50 },
        earn_honor: { count: 1, total: 75 },
        earn_referral: { count: 1, total: 500 },
        spend_purchase: { count: 1, total: -200 },
        spend_retry: { count: 1, total: -50 }
      }
    };
  }
  
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
  if (USE_MOCK) {
    logMock(`earnBaraka: +${amount} from ${source}`);
    await mockDelay(400);
    
    mockBalance.available += amount;
    mockBalance.totalEarned += amount;
    mockBalance.lastUpdated = new Date().toISOString();
    
    const newBalance = mockBalance.available;
    
    logBarakaTransaction('earn', amount, { source, ...metadata });
    window.dispatchEvent(new CustomEvent('baraka:earned', {
      detail: { amount, source, newBalance }
    }));
    
    return {
      transactionId: 'txn_mock_' + Date.now(),
      amount, source, newBalance,
      tier: getBarakaTier(mockBalance.totalEarned)
    };
  }
  
  const response = await apiClient.post(ENDPOINTS.earn, { source, amount, metadata });
  
  invalidateBalanceCache();
  logBarakaTransaction('earn', amount, { source, ...metadata });
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
  if (USE_MOCK) {
    logMock('getEarnOpportunities');
    await mockDelay(250);
    return { opportunities: [...MOCK_EARN_OPPORTUNITIES] };
  }
  
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
  if (USE_MOCK) {
    logMock(`spendBaraka: -${amount} for ${purpose}`);
    await mockDelay(400);
    
    if (mockBalance.available < amount) {
      throw new Error('Insufficient Baraka balance');
    }
    
    mockBalance.available -= amount;
    mockBalance.totalSpent += amount;
    mockBalance.lastUpdated = new Date().toISOString();
    
    const newBalance = mockBalance.available;
    
    logBarakaTransaction('spend', amount, { purpose, ...metadata });
    window.dispatchEvent(new CustomEvent('baraka:spent', {
      detail: { amount, purpose, newBalance }
    }));
    
    return {
      transactionId: 'txn_mock_' + Date.now(),
      amount, purpose, newBalance
    };
  }
  
  const response = await apiClient.post(ENDPOINTS.spend, { purpose, amount, metadata });
  
  invalidateBalanceCache();
  logBarakaTransaction('spend', amount, { purpose, ...metadata });
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
  if (USE_MOCK) {
    logMock('getStoreItems');
    await mockDelay(300);
    let items = [...MOCK_STORE_ITEMS];
    if (category) items = items.filter(i => i.category === category);
    return {
      items,
      categories: ['boosters', 'tokens', 'cosmetics', 'upgrades']
    };
  }
  
  const cacheKey = `baraka_store_${category || 'all'}`;
  
  if (useCache) {
    const cached = getCache(cacheKey, CACHE_TTL.store);
    if (cached) return cached;
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
  if (USE_MOCK) {
    logMock('getStoreItem');
    await mockDelay(200);
    const item = MOCK_STORE_ITEMS.find(i => i.id === itemId);
    if (!item) throw new Error(`Store item ${itemId} not found`);
    return { ...item };
  }
  
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
  if (USE_MOCK) {
    logMock(`purchaseItem: ${itemId} x${quantity}`);
    await mockDelay(500);
    
    const item = MOCK_STORE_ITEMS.find(i => i.id === itemId);
    if (!item) throw new Error(`Store item ${itemId} not found`);
    
    const totalCost = item.price * quantity;
    if (mockBalance.available < totalCost) {
      throw new Error('Insufficient Baraka balance');
    }
    
    mockBalance.available -= totalCost;
    mockBalance.totalSpent += totalCost;
    
    logUserAction('baraka_purchase', { itemId, quantity });
    logBarakaTransaction('spend', totalCost, { purpose: 'store_purchase', itemId });
    
    return {
      transactionId: 'txn_mock_' + Date.now(),
      itemId, quantity, totalCost,
      item: { ...item },
      newBalance: mockBalance.available
    };
  }
  
  const response = await apiClient.post(ENDPOINTS.purchase, { itemId, quantity });
  
  invalidateBalanceCache();
  logUserAction('baraka_purchase', { itemId, quantity });
  logBarakaTransaction('spend', response.data.totalCost, { purpose: 'store_purchase', itemId });
  
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
  if (USE_MOCK) {
    logMock(`initiateWithdrawal: ${amount} via ${method}`);
    await mockDelay(600);
    
    if (mockBalance.available < amount) {
      throw new Error('Insufficient Baraka balance');
    }
    
    mockBalance.available -= amount;
    mockBalance.pending += amount;
    mockBalance.lastUpdated = new Date().toISOString();
    
    logUserAction('baraka_withdrawal_initiated', { amount, method });
    logBarakaTransaction('withdraw', amount, { method });
    
    return {
      withdrawalId: 'wd_mock_' + Date.now(),
      amount, method, currency,
      status: 'pending',
      estimatedCompletion: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      newBalance: mockBalance.available
    };
  }
  
  const response = await apiClient.post(ENDPOINTS.withdraw, {
    amount, method, accountDetails, currency
  });
  
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
  if (USE_MOCK) {
    logMock('getWithdrawalHistory');
    await mockDelay(250);
    return {
      withdrawals: [],
      pagination: { page, limit, total: 0, totalPages: 0 }
    };
  }
  
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
  if (USE_MOCK) {
    logMock('getWithdrawalMethods');
    await mockDelay(200);
    return {
      methods: [
        { id: 'mpesa', name: 'M-Pesa', minAmount: 100, maxAmount: 50000, fee: 0, currency: 'KES' },
        { id: 'bank_transfer', name: 'Bank Transfer', minAmount: 500, maxAmount: 100000, fee: 50, currency: 'KES' },
        { id: 'paypal', name: 'PayPal', minAmount: 10, maxAmount: 5000, fee: 0.5, currency: 'USD' }
      ]
    };
  }
  
  const response = await apiClient.get(`${ENDPOINTS.withdraw}/methods`);
  return response.data;
};

/**
 * Cancels pending withdrawal
 * @param {string} withdrawalId - Withdrawal ID
 * @returns {Promise<Object>} Cancellation result
 */
export const cancelWithdrawal = async (withdrawalId) => {
  if (USE_MOCK) {
    logMock(`cancelWithdrawal: ${withdrawalId}`);
    await mockDelay(400);
    logUserAction('baraka_withdrawal_cancelled', { withdrawalId });
    return { success: true, withdrawalId, status: 'cancelled' };
  }
  
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
  if (USE_MOCK) {
    logMock(`transferBaraka: ${amount} to ${recipientId}`);
    await mockDelay(500);
    
    if (mockBalance.available < amount) {
      throw new Error('Insufficient Baraka balance');
    }
    
    mockBalance.available -= amount;
    mockBalance.totalSpent += amount;
    
    logBarakaTransaction('transfer_out', amount, { recipientId });
    
    return {
      transferId: 'xfr_mock_' + Date.now(),
      amount, recipientId, message,
      newBalance: mockBalance.available,
      status: 'completed'
    };
  }
  
  const response = await apiClient.post(ENDPOINTS.transfer, { recipientId, amount, message });
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
  if (USE_MOCK) {
    logMock('getCovenantSummary');
    await mockDelay(250);
    return {
      totalContributed: 420,
      totalReturned: 126,
      returnRate: 0.30,
      nextReturnDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      poolSize: 125000,
      participants: 340
    };
  }
  
  const response = await apiClient.get(ENDPOINTS.covenant);
  return response.data;
};

/**
 * Gets covenant return history
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} Covenant history
 */
export const getCovenantHistory = async ({ page = 1, limit = 20 } = {}) => {
  if (USE_MOCK) {
    logMock('getCovenantHistory');
    await mockDelay(250);
    return {
      returns: [
        { id: 'cov_001', amount: 63, returnDate: '2025-12-15T00:00:00Z', poolSize: 120000 },
        { id: 'cov_002', amount: 63, returnDate: '2025-12-08T00:00:00Z', poolSize: 115000 }
      ],
      pagination: { page, limit, total: 2, totalPages: 1 }
    };
  }
  
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
  if (amount >= 1000000) return `${(amount / 1000000).toFixed(1)}M`;
  if (amount >= 1000) return `${(amount / 1000).toFixed(1)}K`;
  return amount.toString();
};

/**
 * Gets transaction type label
 * @param {string} type - Transaction type
 * @returns {Object} Type info with label, icon, color
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
 * Refreshes balance (bypasses cache)
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