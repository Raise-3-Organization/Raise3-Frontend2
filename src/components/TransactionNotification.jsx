"use client";

import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle } from 'lucide-react';

export const useTransactionNotification = () => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (message, type = 'success', duration = 5000) => {
    const id = Math.random().toString(36).substring(2, 9);
    setNotifications(prev => [...prev, { id, message, type, duration }]);
    return id;
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const updateNotification = (id, updates) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, ...updates } 
          : notification
      )
    );
  };

  return {
    notifications,
    addNotification,
    removeNotification,
    updateNotification
  };
};

// TransactionNotification component
const TransactionNotification = ({ notifications, removeNotification }) => {
  useEffect(() => {
    // Set up timers to automatically dismiss notifications
    const timers = notifications.map(notification => {
      if (notification.duration) {
        return setTimeout(() => {
          removeNotification(notification.id);
        }, notification.duration);
      }
      return null;
    }).filter(Boolean);
    
    // Clear all timers on unmount or when notifications change
    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, [notifications, removeNotification]);

  if (notifications.length === 0) return null;

  return (
    <div className="fixed bottom-0 right-0 p-4 space-y-2 z-50">
      {notifications.map(notification => (
        <div 
          key={notification.id}
          className={`max-w-sm p-4 rounded-lg shadow-lg flex items-start gap-3 ${
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
            onClick={() => removeNotification(notification.id)}
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