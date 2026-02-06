import React, { createContext, useState, useContext, useEffect } from 'react';
import {
  getNotifications,
  markNotificationAsRead,
  deleteNotification,
  deleteAllNotifications
} from '../services/api';

const NotificationsContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  return context;
};

export const NotificationsProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  // Calculate unread count whenever notifications change
  useEffect(() => {
    const count = notifications.filter(notification => !notification.read).length;
    setUnreadCount(count);
  }, [notifications]);

  // Fetch notifications for a user
  const fetchNotifications = async (userId) => {
    if (!userId) {
      setError('User ID is required');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await getNotifications(userId);
      setNotifications(data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch notifications');
      console.error('Error fetching notifications:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Mark a notification as read
  const markAsRead = async (notificationId) => {
    setIsLoading(true);
    setError(null);

    try {
      const updatedNotification = await markNotificationAsRead(notificationId);
      
      // Update local state
      setNotifications(prev => 
        prev.map(notification => 
          notification._id === notificationId 
            ? { ...notification, read: true }
            : notification
        )
      );

      return { success: true, data: updatedNotification };
    } catch (err) {
      const errorMsg = err.message || 'Failed to mark notification as read';
      setError(errorMsg);
      console.error('Error marking notification as read:', err);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async (userId) => {
    setIsLoading(true);
    setError(null);

    try {
      // Get all unread notifications
      const unreadNotifications = notifications.filter(notification => !notification.read);
      
      // Mark each unread notification as read
      const markPromises = unreadNotifications.map(notification =>
        markNotificationAsRead(notification._id)
      );

      await Promise.all(markPromises);

      // Update local state
      setNotifications(prev =>
        prev.map(notification => ({ ...notification, read: true }))
      );

      return { success: true };
    } catch (err) {
      const errorMsg = err.message || 'Failed to mark all notifications as read';
      setError(errorMsg);
      console.error('Error marking all notifications as read:', err);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  };

  // Delete a single notification
  const deleteSingleNotification = async (notificationId) => {
    setIsLoading(true);
    setError(null);

    try {
      await deleteNotification(notificationId);
      
      // Update local state
      setNotifications(prev =>
        prev.filter(notification => notification._id !== notificationId)
      );

      return { success: true };
    } catch (err) {
      const errorMsg = err.message || 'Failed to delete notification';
      setError(errorMsg);
      console.error('Error deleting notification:', err);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  };

  // Delete all notifications for a user
  const deleteAllUserNotifications = async (userId) => {
    if (!userId) {
      setError('User ID is required');
      return { success: false, error: 'User ID is required' };
    }

    setIsLoading(true);
    setError(null);

    try {
      await deleteAllNotifications(userId);
      
      // Clear local state
      setNotifications([]);

      return { success: true };
    } catch (err) {
      const errorMsg = err.message || 'Failed to delete all notifications';
      setError(errorMsg);
      console.error('Error deleting all notifications:', err);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  };

  // Add a notification to local state (for real-time updates)
  const addNotification = (notification) => {
    setNotifications(prev => [notification, ...prev]);
  };

  // Get notifications by type
  const getNotificationsByType = (type) => {
    return notifications.filter(notification => notification.type === type);
  };

  // Get unread notifications
  const getUnreadNotifications = () => {
    return notifications.filter(notification => !notification.read);
  };

  // Get read notifications
  const getReadNotifications = () => {
    return notifications.filter(notification => notification.read);
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  // Refresh notifications
  const refreshNotifications = (userId) => {
    return fetchNotifications(userId);
  };

  const value = {
    // State
    notifications,
    isLoading,
    error,
    unreadCount,
    
    // Methods
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteSingleNotification,
    deleteAllUserNotifications,
    addNotification,
    getNotificationsByType,
    getUnreadNotifications,
    getReadNotifications,
    clearError,
    refreshNotifications
  };

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
};