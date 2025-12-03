/**
 * GPS Lab Platform - WebSocket Service
 * 
 * WebSocket connection management for real-time features including
 * party chat, praise notifications, and mission updates.
 * 
 * @module services/websocket/websocket.service
 * @version 1.0.0
 */

import { getAccessToken } from '../api/client';
import { logUserAction } from '../../utils/error/error.logger';

// =============================================================================
// CONFIGURATION
// =============================================================================

const WS_CONFIG = {
  url: process.env.REACT_APP_WS_URL || 'wss://ws.gpslab.io',
  reconnectInterval: 1000,
  maxReconnectInterval: 30000,
  reconnectDecay: 1.5,
  maxReconnectAttempts: 10,
  heartbeatInterval: 30000,
  messageTimeout: 10000
};

/**
 * WebSocket event types
 */
export const WS_EVENTS = {
  // Connection
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  RECONNECT: 'reconnect',
  ERROR: 'error',
  
  // Mission
  MISSION_UPDATE: 'mission:update',
  MISSION_COMPLETED: 'mission:completed',
  CHECKPOINT_RESULT: 'checkpoint:result',
  
  // Party
  PARTY_MESSAGE: 'party:message',
  PARTY_MEMBER_JOINED: 'party:member_joined',
  PARTY_MEMBER_LEFT: 'party:member_left',
  PARTY_TASK_UPDATE: 'party:task_update',
  
  // Praise
  PRAISE_RECEIVED: 'praise:received',
  HONOR_RECEIVED: 'honor:received',
  
  // Notifications
  NOTIFICATION: 'notification',
  
  // Baraka
  BARAKA_EARNED: 'baraka:earned',
  BARAKA_SPENT: 'baraka:spent',
  
  // User
  USER_ONLINE: 'user:online',
  USER_OFFLINE: 'user:offline',
  
  // Navigator
  NAVIGATOR_MESSAGE: 'navigator:message'
};

/**
 * Connection states
 */
export const CONNECTION_STATES = {
  CONNECTING: 'connecting',
  CONNECTED: 'connected',
  DISCONNECTING: 'disconnecting',
  DISCONNECTED: 'disconnected',
  RECONNECTING: 'reconnecting'
};

// =============================================================================
// WEBSOCKET SERVICE CLASS
// =============================================================================

class WebSocketService {
  constructor() {
    this.socket = null;
    this.state = CONNECTION_STATES.DISCONNECTED;
    this.reconnectAttempts = 0;
    this.reconnectTimeout = null;
    this.heartbeatInterval = null;
    this.messageHandlers = new Map();
    this.eventListeners = new Map();
    this.pendingMessages = [];
    this.messageCallbacks = new Map();
    this.messageId = 0;
  }
  
  // ===========================================================================
  // CONNECTION MANAGEMENT
  // ===========================================================================
  
  /**
   * Connects to WebSocket server
   * @returns {Promise<void>}
   */
  connect() {
    return new Promise((resolve, reject) => {
      if (this.socket && this.state === CONNECTION_STATES.CONNECTED) {
        resolve();
        return;
      }
      
      this.state = CONNECTION_STATES.CONNECTING;
      this.emit('stateChange', this.state);
      
      const token = getAccessToken();
      const url = `${WS_CONFIG.url}?token=${token}`;
      
      try {
        this.socket = new WebSocket(url);
        
        this.socket.onopen = () => {
          this.state = CONNECTION_STATES.CONNECTED;
          this.reconnectAttempts = 0;
          this.emit('stateChange', this.state);
          this.emit(WS_EVENTS.CONNECT);
          
          // Start heartbeat
          this.startHeartbeat();
          
          // Send pending messages
          this.flushPendingMessages();
          
          logUserAction('websocket_connected');
          
          resolve();
        };
        
        this.socket.onclose = (event) => {
          this.handleClose(event);
        };
        
        this.socket.onerror = (error) => {
          this.emit(WS_EVENTS.ERROR, error);
          reject(error);
        };
        
        this.socket.onmessage = (event) => {
          this.handleMessage(event);
        };
        
      } catch (error) {
        this.state = CONNECTION_STATES.DISCONNECTED;
        this.emit('stateChange', this.state);
        reject(error);
      }
    });
  }
  
  /**
   * Disconnects from WebSocket server
   */
  disconnect() {
    this.state = CONNECTION_STATES.DISCONNECTING;
    this.emit('stateChange', this.state);
    
    // Stop heartbeat
    this.stopHeartbeat();
    
    // Clear reconnect timeout
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    
    // Close socket
    if (this.socket) {
      this.socket.close(1000, 'Client disconnect');
      this.socket = null;
    }
    
    this.state = CONNECTION_STATES.DISCONNECTED;
    this.emit('stateChange', this.state);
    this.emit(WS_EVENTS.DISCONNECT);
    
    logUserAction('websocket_disconnected');
  }
  
  /**
   * Handles socket close
   * @param {CloseEvent} event - Close event
   */
  handleClose(event) {
    this.stopHeartbeat();
    
    if (this.state === CONNECTION_STATES.DISCONNECTING) {
      return;
    }
    
    this.state = CONNECTION_STATES.DISCONNECTED;
    this.emit('stateChange', this.state);
    this.emit(WS_EVENTS.DISCONNECT, { code: event.code, reason: event.reason });
    
    // Attempt reconnect if not intentional
    if (event.code !== 1000) {
      this.scheduleReconnect();
    }
  }
  
  /**
   * Schedules reconnection attempt
   */
  scheduleReconnect() {
    if (this.reconnectAttempts >= WS_CONFIG.maxReconnectAttempts) {
      this.emit(WS_EVENTS.ERROR, { message: 'Max reconnect attempts reached' });
      return;
    }
    
    this.state = CONNECTION_STATES.RECONNECTING;
    this.emit('stateChange', this.state);
    
    const delay = Math.min(
      WS_CONFIG.reconnectInterval * Math.pow(WS_CONFIG.reconnectDecay, this.reconnectAttempts),
      WS_CONFIG.maxReconnectInterval
    );
    
    this.reconnectTimeout = setTimeout(() => {
      this.reconnectAttempts++;
      this.emit(WS_EVENTS.RECONNECT, { attempt: this.reconnectAttempts });
      this.connect().catch(() => {
        // Will retry via scheduleReconnect
      });
    }, delay);
  }
  
  // ===========================================================================
  // HEARTBEAT
  // ===========================================================================
  
  /**
   * Starts heartbeat
   */
  startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      if (this.state === CONNECTION_STATES.CONNECTED) {
        this.send('ping');
      }
    }, WS_CONFIG.heartbeatInterval);
  }
  
  /**
   * Stops heartbeat
   */
  stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }
  
  // ===========================================================================
  // MESSAGE HANDLING
  // ===========================================================================
  
  /**
   * Handles incoming message
   * @param {MessageEvent} event - Message event
   */
  handleMessage(event) {
    try {
      const data = JSON.parse(event.data);
      
      // Handle pong
      if (data.type === 'pong') {
        return;
      }
      
      // Handle response to request
      if (data.id && this.messageCallbacks.has(data.id)) {
        const callback = this.messageCallbacks.get(data.id);
        this.messageCallbacks.delete(data.id);
        callback(data.error, data.payload);
        return;
      }
      
      // Emit event
      if (data.type) {
        this.emit(data.type, data.payload);
      }
      
      // Call registered handlers
      const handlers = this.messageHandlers.get(data.type);
      if (handlers) {
        handlers.forEach(handler => {
          try {
            handler(data.payload);
          } catch (e) {
            console.error('WebSocket handler error:', e);
          }
        });
      }
      
    } catch (error) {
      console.error('Failed to parse WebSocket message:', error);
    }
  }
  
  /**
   * Sends message
   * @param {string} type - Message type
   * @param {Object} payload - Message payload
   * @param {Object} options - Send options
   * @returns {Promise<Object>} Response
   */
  send(type, payload = {}, options = {}) {
    const { expectResponse = false, timeout = WS_CONFIG.messageTimeout } = options;
    
    const message = {
      type,
      payload,
      timestamp: new Date().toISOString()
    };
    
    // Add message ID if expecting response
    if (expectResponse) {
      message.id = ++this.messageId;
    }
    
    // Queue message if not connected
    if (this.state !== CONNECTION_STATES.CONNECTED) {
      if (options.queueIfDisconnected !== false) {
        this.pendingMessages.push(message);
      }
      
      if (expectResponse) {
        return Promise.reject(new Error('WebSocket not connected'));
      }
      
      return;
    }
    
    // Send message
    this.socket.send(JSON.stringify(message));
    
    // Return promise if expecting response
    if (expectResponse) {
      return new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
          this.messageCallbacks.delete(message.id);
          reject(new Error('WebSocket request timeout'));
        }, timeout);
        
        this.messageCallbacks.set(message.id, (error, data) => {
          clearTimeout(timeoutId);
          if (error) {
            reject(error);
          } else {
            resolve(data);
          }
        });
      });
    }
  }
  
  /**
   * Flushes pending messages
   */
  flushPendingMessages() {
    while (this.pendingMessages.length > 0) {
      const message = this.pendingMessages.shift();
      this.socket.send(JSON.stringify(message));
    }
  }
  
  // ===========================================================================
  // EVENT SYSTEM
  // ===========================================================================
  
  /**
   * Registers event listener
   * @param {string} event - Event name
   * @param {Function} callback - Callback function
   * @returns {Function} Unsubscribe function
   */
  on(event, callback) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set());
    }
    
    this.eventListeners.get(event).add(callback);
    
    return () => {
      this.off(event, callback);
    };
  }
  
  /**
   * Removes event listener
   * @param {string} event - Event name
   * @param {Function} callback - Callback function
   */
  off(event, callback) {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.delete(callback);
    }
  }
  
  /**
   * Emits event
   * @param {string} event - Event name
   * @param {*} data - Event data
   */
  emit(event, data) {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(data);
        } catch (e) {
          console.error('Event listener error:', e);
        }
      });
    }
  }
  
  /**
   * Registers message handler
   * @param {string} type - Message type
   * @param {Function} handler - Handler function
   * @returns {Function} Unregister function
   */
  onMessage(type, handler) {
    if (!this.messageHandlers.has(type)) {
      this.messageHandlers.set(type, new Set());
    }
    
    this.messageHandlers.get(type).add(handler);
    
    return () => {
      this.offMessage(type, handler);
    };
  }
  
  /**
   * Removes message handler
   * @param {string} type - Message type
   * @param {Function} handler - Handler function
   */
  offMessage(type, handler) {
    const handlers = this.messageHandlers.get(type);
    if (handlers) {
      handlers.delete(handler);
    }
  }
  
  // ===========================================================================
  // SUBSCRIPTIONS
  // ===========================================================================
  
  /**
   * Subscribes to channel
   * @param {string} channel - Channel name
   * @returns {Promise<void>}
   */
  subscribe(channel) {
    return this.send('subscribe', { channel }, { expectResponse: true });
  }
  
  /**
   * Unsubscribes from channel
   * @param {string} channel - Channel name
   * @returns {Promise<void>}
   */
  unsubscribe(channel) {
    return this.send('unsubscribe', { channel }, { expectResponse: true });
  }
  
  // ===========================================================================
  // GETTERS
  // ===========================================================================
  
  /**
   * Gets current connection state
   * @returns {string} Connection state
   */
  getState() {
    return this.state;
  }
  
  /**
   * Checks if connected
   * @returns {boolean} True if connected
   */
  isConnected() {
    return this.state === CONNECTION_STATES.CONNECTED;
  }
}

// =============================================================================
// SINGLETON INSTANCE
// =============================================================================

const websocketService = new WebSocketService();

// =============================================================================
// CONVENIENCE FUNCTIONS
// =============================================================================

/**
 * Connects to WebSocket
 * @returns {Promise<void>}
 */
export const connect = () => websocketService.connect();

/**
 * Disconnects from WebSocket
 */
export const disconnect = () => websocketService.disconnect();

/**
 * Sends message
 * @param {string} type - Message type
 * @param {Object} payload - Payload
 * @param {Object} options - Options
 * @returns {Promise<Object>}
 */
export const send = (type, payload, options) => websocketService.send(type, payload, options);

/**
 * Registers event listener
 * @param {string} event - Event name
 * @param {Function} callback - Callback
 * @returns {Function} Unsubscribe function
 */
export const on = (event, callback) => websocketService.on(event, callback);

/**
 * Removes event listener
 * @param {string} event - Event name
 * @param {Function} callback - Callback
 */
export const off = (event, callback) => websocketService.off(event, callback);

/**
 * Registers message handler
 * @param {string} type - Message type
 * @param {Function} handler - Handler
 * @returns {Function} Unregister function
 */
export const onMessage = (type, handler) => websocketService.onMessage(type, handler);

/**
 * Subscribes to channel
 * @param {string} channel - Channel
 * @returns {Promise<void>}
 */
export const subscribe = (channel) => websocketService.subscribe(channel);

/**
 * Unsubscribes from channel
 * @param {string} channel - Channel
 * @returns {Promise<void>}
 */
export const unsubscribe = (channel) => websocketService.unsubscribe(channel);

/**
 * Gets connection state
 * @returns {string}
 */
export const getState = () => websocketService.getState();

/**
 * Checks if connected
 * @returns {boolean}
 */
export const isConnected = () => websocketService.isConnected();

// =============================================================================
// EXPORTS
// =============================================================================

export {
  WebSocketService,
  websocketService as default
};