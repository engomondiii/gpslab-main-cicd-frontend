/**
 * GPS Lab Platform - WebSocket Context
 * 
 * Provides WebSocket connection management for real-time features.
 * 
 * @module contexts/WebSocketContext
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';

const WebSocketContext = createContext(null);

export const WS_STATUS = {
  CONNECTING: 'connecting',
  CONNECTED: 'connected',
  DISCONNECTED: 'disconnected',
  ERROR: 'error'
};

export const WebSocketProvider = ({ 
  children, 
  url = process.env.REACT_APP_WS_URL,
  autoConnect = true 
}) => {
  const [status, setStatus] = useState(WS_STATUS.DISCONNECTED);
  const [lastMessage, setLastMessage] = useState(null);
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const messageListenersRef = useRef(new Map());
  
  const connect = useCallback(() => {
    if (!url || wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }
    
    try {
      setStatus(WS_STATUS.CONNECTING);
      wsRef.current = new WebSocket(url);
      
      wsRef.current.onopen = () => {
        setStatus(WS_STATUS.CONNECTED);
        console.log('WebSocket connected');
      };
      
      wsRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setLastMessage(data);
          
          // Notify listeners for this message type
          const listeners = messageListenersRef.current.get(data.type) || [];
          listeners.forEach(listener => listener(data));
        } catch (error) {
          console.error('WebSocket message parse error:', error);
        }
      };
      
      wsRef.current.onclose = () => {
        setStatus(WS_STATUS.DISCONNECTED);
        console.log('WebSocket disconnected');
        
        // Attempt reconnection after delay
        if (autoConnect) {
          reconnectTimeoutRef.current = setTimeout(connect, 5000);
        }
      };
      
      wsRef.current.onerror = (error) => {
        setStatus(WS_STATUS.ERROR);
        console.error('WebSocket error:', error);
      };
    } catch (error) {
      setStatus(WS_STATUS.ERROR);
      console.error('WebSocket connection error:', error);
    }
  }, [url, autoConnect]);
  
  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    
    setStatus(WS_STATUS.DISCONNECTED);
  }, []);
  
  const send = useCallback((data) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data));
      return true;
    }
    console.warn('WebSocket not connected');
    return false;
  }, []);
  
  const subscribe = useCallback((type, callback) => {
    if (!messageListenersRef.current.has(type)) {
      messageListenersRef.current.set(type, []);
    }
    messageListenersRef.current.get(type).push(callback);
    
    // Return unsubscribe function
    return () => {
      const listeners = messageListenersRef.current.get(type) || [];
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, []);
  
  // Auto-connect on mount
  useEffect(() => {
    if (autoConnect && url) {
      connect();
    }
    
    return () => {
      disconnect();
    };
  }, [autoConnect, url, connect, disconnect]);
  
  const value = useMemo(() => ({
    status,
    isConnected: status === WS_STATUS.CONNECTED,
    lastMessage,
    connect,
    disconnect,
    send,
    subscribe
  }), [status, lastMessage, connect, disconnect, send, subscribe]);
  
  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};

export default WebSocketContext;