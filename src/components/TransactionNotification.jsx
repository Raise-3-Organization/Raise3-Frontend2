"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { X, CheckCircle, AlertCircle } from 'lucide-react';

export const useTransactionNotification = () => {
  const [notifications, setNotifications] = useState([]);

  // Clear all notifications
  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Add a notification with deduplication based on message content
  const addNotification = useCallback((message, type = 'success', duration = 5000) => {
    const id = Math.random().toString(36).substring(2, 9);
    
    // Check if this exact message already exists and remove it first
    setNotifications(prev => {
      // Filter out any existing notifications with the same message
      const filteredNotifications = prev.filter(n => n.message !== message);
      
      // Add the new notification
      return [...filteredNotifications, { id, message, type, duration, timestamp: Date.now() }];
    });
    
    return id;
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const updateNotification = useCallback((id, updates) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, ...updates } 
          : notification
      )
    );
  }, []);

  // Clean up stale notifications (older than 10 seconds) that should have been dismissed
  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = Date.now();
      setNotifications(prev => 
        prev.filter(notification => {
          // Keep notifications with no duration (permanent)
          if (!notification.duration) return true;
          
          // Remove notifications that have exceeded their display time plus a grace period
          const expiryTime = notification.timestamp + notification.duration + 1000; // 1 second grace period
          return now < expiryTime;
        })
      );
    }, 1000); // Check every second
    
    return () => clearInterval(intervalId);
  }, []);

  return {
    notifications,
    addNotification,
    removeNotification,
    updateNotification,
    clearAllNotifications
  };
};

// TransactionNotification component
const TransactionNotification = ({ notifications, removeNotification }) => {
  useEffect(() => {
    // Set up timers to automatically dismiss notifications
    const timers = notifications.map(notification => {
      if (notification.duration) {
        return setTimeout(() => {
          removeNotification?.(notification.id);
        }, notification.duration);
      }
      return null;
    }).filter(Boolean);
    
    // Clear all timers on unmount or when notifications change
    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, [notifications, removeNotification]);

  // Don't render anything if there are no notifications
  if (!notifications || notifications.length === 0) return null;

  // Limit to showing maximum 3 notifications at once to prevent overwhelming the UI
  const displayedNotifications = notifications.slice(-3);

  return (
    <div className="fixed bottom-0 right-0 p-4 space-y-2 z-50">
      {displayedNotifications.map(notification => (
        <div 
          key={notification.id}
          className={`max-w-sm p-4 rounded-lg shadow-lg flex items-start gap-3 animate-fadeIn ${
            notification.type === 'success' 
              ? 'bg-green-900/90 border border-green-700' 
              : notification.type === 'info'
                ? 'bg-blue-900/90 border border-blue-700'
                : 'bg-red-900/90 border border-red-700'
          }`}
        >
          <div className="shrink-0">
            {notification.type === 'success' ? (
              <CheckCircle className="text-green-500" size={20} />
            ) : notification.type === 'info' ? (
              <AlertCircle className="text-blue-500" size={20} />
            ) : (
              <AlertCircle className="text-red-500" size={20} />
            )}
          </div>
          <div className="flex-1">
            <p className="text-white text-sm">{notification.message}</p>
          </div>
          <button 
            onClick={() => removeNotification?.(notification.id)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default TransactionNotification;