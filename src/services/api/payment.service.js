/**
 * GPS Lab Platform - Payment Service
 * 
 * Subscription management, payment processing, and billing operations.
 * 
 * @module services/api/payment.service
 * @version 1.1.0
 */

import apiClient from './client';
import { logUserAction } from '../../utils/error/logger';

const USE_MOCK = process.env.REACT_APP_USE_MOCK_DATA === 'true' ||
                 process.env.NODE_ENV === 'development';
const mockDelay = (ms = 300) => new Promise(r => setTimeout(r, ms));
const logMock = (method) => console.info(`[PaymentService:MOCK] ${method}`);

// =============================================================================
// MOCK DATA
// =============================================================================

const MOCK_PLANS = [
  {
    id: 'plan_free', name: 'Free', price: 0, currency: 'USD', interval: 'month',
    features: ['Basic missions', 'Community access', 'Navigator (limited)', 'Baraka earning'],
    recommended: false, current: true
  },
  {
    id: 'plan_contender', name: 'Contender', price: 19, currency: 'USD', interval: 'month',
    annualPrice: 190, features: ['All missions', 'Full Navigator access', 'Mentor matching', '10% Baraka bonus'],
    recommended: true, current: false
  },
  {
    id: 'plan_pathfinder', name: 'Pathfinder', price: 49, currency: 'USD', interval: 'month',
    annualPrice: 490, features: ['Everything in Contender', 'Priority support', 'Advanced analytics', '20% Baraka bonus', 'Certificate of completion'],
    recommended: false, current: false
  },
  {
    id: 'plan_navigators_circle', name: "Navigator's Circle", price: 149, currency: 'USD', interval: 'month',
    annualPrice: 1490, features: ['Everything in Pathfinder', '1-on-1 mentoring', 'GPS Ambassador status', '30% Baraka bonus', 'Revenue sharing eligibility'],
    recommended: false, current: false
  }
];

const MOCK_METHODS = [
  { id: 'pm_mpesa', type: 'mobile_money', provider: 'M-Pesa', last4: '7890', isDefault: true },
  { id: 'pm_card', type: 'card', brand: 'Visa', last4: '4242', isDefault: false }
];

const MOCK_HISTORY = [
  { id: 'pay_001', amount: 0, currency: 'USD', description: 'Free Plan', status: 'completed', createdAt: '2025-09-01T00:00:00Z' }
];

// =============================================================================
// ENDPOINTS
// =============================================================================

const ENDPOINTS = {
  plans: '/payments/plans',
  subscribe: '/payments/subscribe',
  cancel: '/payments/cancel',
  history: '/payments/history',
  methods: '/payments/methods',
  addMethod: '/payments/methods',
  removeMethod: (id) => `/payments/methods/${id}`,
  purchase: '/payments/purchase',
  invoice: (id) => `/payments/invoice/${id}`
};

// =============================================================================
// OPERATIONS
// =============================================================================

export const getPlans = async () => {
  if (USE_MOCK) { logMock('getPlans'); await mockDelay(250); return { plans: [...MOCK_PLANS] }; }
  const response = await apiClient.get(ENDPOINTS.plans);
  return response.data;
};

export const subscribe = async ({ planId, paymentMethodId, isAnnual = false }) => {
  if (USE_MOCK) {
    logMock(`subscribe: ${planId}`);
    await mockDelay(800);
    logUserAction('subscription_created', { planId, isAnnual });
    const plan = MOCK_PLANS.find(p => p.id === planId);
    return {
      subscriptionId: 'sub_' + Date.now(), planId,
      planName: plan?.name, status: 'active',
      amount: isAnnual ? plan?.annualPrice || 0 : plan?.price || 0,
      interval: isAnnual ? 'year' : 'month',
      nextBillingDate: new Date(Date.now() + (isAnnual ? 365 : 30) * 86400000).toISOString(),
      covenantReturn: ((isAnnual ? plan?.annualPrice || 0 : plan?.price || 0) * 0.5)
    };
  }
  const response = await apiClient.post(ENDPOINTS.subscribe, { planId, paymentMethodId, isAnnual });
  logUserAction('subscription_created', { planId });
  return response.data;
};

export const cancelSubscription = async ({ reason } = {}) => {
  if (USE_MOCK) {
    logMock('cancelSubscription');
    await mockDelay(500);
    logUserAction('subscription_cancelled', { reason });
    return { status: 'cancelled', effectiveDate: new Date(Date.now() + 30 * 86400000).toISOString() };
  }
  const response = await apiClient.post(ENDPOINTS.cancel, { reason });
  logUserAction('subscription_cancelled', { reason });
  return response.data;
};

export const getPaymentHistory = async ({ page = 1, limit = 20 } = {}) => {
  if (USE_MOCK) {
    logMock('getPaymentHistory');
    await mockDelay(250);
    return { payments: [...MOCK_HISTORY], pagination: { page, limit, total: 1, totalPages: 1 } };
  }
  const response = await apiClient.get(ENDPOINTS.history, { params: { page, limit } });
  return response.data;
};

export const getPaymentMethods = async () => {
  if (USE_MOCK) { logMock('getPaymentMethods'); await mockDelay(200); return { methods: [...MOCK_METHODS] }; }
  const response = await apiClient.get(ENDPOINTS.methods);
  return response.data;
};

export const addPaymentMethod = async (data) => {
  if (USE_MOCK) {
    logMock('addPaymentMethod');
    await mockDelay(600);
    logUserAction('payment_method_added', { type: data.type });
    return { id: 'pm_' + Date.now(), ...data, isDefault: false };
  }
  const response = await apiClient.post(ENDPOINTS.addMethod, data);
  logUserAction('payment_method_added', { type: data.type });
  return response.data;
};

export const removePaymentMethod = async (methodId) => {
  if (USE_MOCK) {
    logMock(`removePaymentMethod: ${methodId}`);
    await mockDelay(400);
    logUserAction('payment_method_removed', { methodId });
    return { removed: true };
  }
  const response = await apiClient.delete(ENDPOINTS.removeMethod(methodId));
  logUserAction('payment_method_removed', { methodId });
  return response.data;
};

export const processPurchase = async ({ itemType, itemId, amount, paymentMethodId }) => {
  if (USE_MOCK) {
    logMock(`processPurchase: ${itemType}/${itemId}`);
    await mockDelay(700);
    logUserAction('purchase_completed', { itemType, itemId, amount });
    return {
      transactionId: 'txn_' + Date.now(), itemType, itemId, amount,
      status: 'completed', covenantReturn: amount * 0.5
    };
  }
  const response = await apiClient.post(ENDPOINTS.purchase, { itemType, itemId, amount, paymentMethodId });
  logUserAction('purchase_completed', { itemType, itemId });
  return response.data;
};

export const getInvoice = async (invoiceId) => {
  if (USE_MOCK) {
    logMock(`getInvoice: ${invoiceId}`);
    await mockDelay(300);
    return { id: invoiceId, amount: 0, currency: 'USD', status: 'paid', pdfUrl: null };
  }
  const response = await apiClient.get(ENDPOINTS.invoice(invoiceId));
  return response.data;
};

export default {
  getPlans, subscribe, cancelSubscription,
  getPaymentHistory, getPaymentMethods, addPaymentMethod, removePaymentMethod,
  processPurchase, getInvoice
};