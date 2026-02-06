import { getNotifications, markNotificationAsRead, deleteNotification, deleteAllNotifications } from './api';
import * as Notifications from 'expo-notifications';
import isDevice from 'expo-device';
import { getItemAsync, setItemAsync, deleteItemAsync } from 'expo-secure-store';

// Notification constants
const NOTIFICATION_KEYS = {
  PUSH_TOKEN: 'expo_push_token',
  NOTIFICATION_PERMISSION: 'notification_permission',
  LAST_NOTIFICATION_CHECK: 'last_notification_check',
};

// Notification types matching your backend
const NOTIFICATION_TYPES = {
  INFO: 'info',
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
};

// Notification categories for push notifications
const NOTIFICATION_CATEGORIES = {
  REQUEST_APPROVAL: 'REQUEST_APPROVAL',
  STATUS_UPDATE: 'STATUS_UPDATE',
  SYSTEM: 'SYSTEM',
};

// Configure push notifications
export const configurePushNotifications = async () => {
  try {
    // Set notification handler
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });

    // Request permissions
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      throw new Error('Permission not granted for notifications');
    }

    // Get push token
    const token = await registerForPushNotifications();

    await setItemAsync(NOTIFICATION_KEYS.NOTIFICATION_PERMISSION, finalStatus);
    
    return {
      success: true,
      token,
      permission: finalStatus
    };

  } catch (error) {
    console.error('Error configuring push notifications:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Register for push notifications
export const registerForPushNotifications = async () => {
  try {
    if (!isDevice) {
      throw new Error('Must use physical device for push notifications');
    }

    const token = (await Notifications.getExpoPushTokenAsync()).data;
    await setItemAsync(NOTIFICATION_KEYS.PUSH_TOKEN, token);
    
    return token;
  } catch (error) {
    console.error('Error getting push token:', error);
    throw error;
  }
};

// Get stored push token
export const getPushToken = async () => {
  try {
    return await getItemAsync(NOTIFICATION_KEYS.PUSH_TOKEN);
  } catch (error) {
    console.error('Error getting push token:', error);
    return null;
  }
};

// Check notification permissions
export const checkNotificationPermissions = async () => {
  try {
    const { status } = await Notifications.getPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    console.error('Error checking notification permissions:', error);
    return false;
  }
};

// Schedule a local notification
export const scheduleLocalNotification = async (title, body, data = {}, options = {}) => {
  try {
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger: options.trigger || null, // null means show immediately
    });

    return {
      success: true,
      notificationId
    };
  } catch (error) {
    console.error('Error scheduling local notification:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Create a notification from backend data
export const createNotificationFromData = (notificationData) => {
  return {
    id: notificationData._id,
    title: getNotificationTitle(notificationData.type, notificationData.message),
    body: notificationData.message,
    type: notificationData.type || NOTIFICATION_TYPES.INFO,
    read: notificationData.read || false,
    timestamp: notificationData.createdAt || new Date(),
    data: notificationData.data || {}
  };
};

// Get appropriate title based on notification type
export const getNotificationTitle = (type, message) => {
  const firstLine = message.split('\n')[0];
  
  switch (type) {
    case NOTIFICATION_TYPES.SUCCESS:
      return 'Success: ' + firstLine;
    case NOTIFICATION_TYPES.ERROR:
      return 'Error: ' + firstLine;
    case NOTIFICATION_TYPES.WARNING:
      return 'Warning: ' + firstLine;
    default:
      return firstLine;
  }
};

// Get notification icon based on type
export const getNotificationIcon = (type) => {
  switch (type) {
    case NOTIFICATION_TYPES.SUCCESS:
      return '✅';
    case NOTIFICATION_TYPES.ERROR:
      return '❌';
    case NOTIFICATION_TYPES.WARNING:
      return '⚠️';
    default:
      return 'ℹ️';
  }
};

// Get notification color based on type (for UI)
export const getNotificationColor = (type) => {
  switch (type) {
    case NOTIFICATION_TYPES.SUCCESS:
      return '#4ade80';
    case NOTIFICATION_TYPES.ERROR:
      return '#ef4444';
    case NOTIFICATION_TYPES.WARNING:
      return '#fbbf24';
    default:
      return '#3b82f6';
  }
};

// Mark notification as read
export const markAsRead = async (notificationId) => {
  try {
    const result = await markNotificationAsRead(notificationId);
    
    return {
      success: true,
      data: result
    };
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Mark multiple notifications as read
export const markMultipleAsRead = async (notificationIds) => {
  try {
    const results = await Promise.all(
      notificationIds.map(id => markNotificationAsRead(id))
    );

    return {
      success: true,
      data: results
    };
  } catch (error) {
    console.error('Error marking multiple notifications as read:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Delete notification
export const deleteNotificationById = async (notificationId) => {
  try {
    const result = await deleteNotification(notificationId);
    
    return {
      success: true,
      data: result
    };
  } catch (error) {
    console.error('Error deleting notification:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Delete multiple notifications
export const deleteMultipleNotifications = async (notificationIds) => {
  try {
    const results = await Promise.all(
      notificationIds.map(id => deleteNotification(id))
    );

    return {
      success: true,
      data: results
    };
  } catch (error) {
    console.error('Error deleting multiple notifications:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Delete all notifications for user
export const deleteAllUserNotifications = async (userId) => {
  try {
    const result = await deleteAllNotifications(userId);
    
    return {
      success: true,
      data: result
    };
  } catch (error) {
    console.error('Error deleting all notifications:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Get unread count from notifications array
export const getUnreadCount = (notifications) => {
  return notifications.filter(notification => !notification.read).length;
};

// Filter notifications by type
export const filterNotificationsByType = (notifications, type) => {
  return notifications.filter(notification => notification.type === type);
};

// Filter unread notifications
export const getUnreadNotifications = (notifications) => {
  return notifications.filter(notification => !notification.read);
};

// Sort notifications by date (newest first)
export const sortNotificationsByDate = (notifications, ascending = false) => {
  return [...notifications].sort((a, b) => {
    const dateA = new Date(a.timestamp || a.createdAt);
    const dateB = new Date(b.timestamp || b.createdAt);
    return ascending ? dateA - dateB : dateB - dateA;
  });
};

// Group notifications by date
export const groupNotificationsByDate = (notifications) => {
  const groups = {
    today: [],
    yesterday: [],
    thisWeek: [],
    older: []
  };

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);

  notifications.forEach(notification => {
    const notificationDate = new Date(notification.timestamp || notification.createdAt);
    const notificationDay = new Date(notificationDate.getFullYear(), notificationDate.getMonth(), notificationDate.getDate());

    if (notificationDay.getTime() === today.getTime()) {
      groups.today.push(notification);
    } else if (notificationDay.getTime() === yesterday.getTime()) {
      groups.yesterday.push(notification);
    } else if (notificationDay.getTime() > weekAgo.getTime()) {
      groups.thisWeek.push(notification);
    } else {
      groups.older.push(notification);
    }
  });

  return groups;
};

// Format notification date for display
export const formatNotificationDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

  if (diffInHours < 1) {
    return 'Just now';
  } else if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  } else if (diffInHours < 48) {
    return 'Yesterday';
  } else {
    return date.toLocaleDateString();
  }
};

// Play notification sound
export const playNotificationSound = async () => {
  try {
    // Expo doesn't have a direct sound API, but you can use:
    // const { sound } = await Audio.Sound.createAsync(require('./notification.mp3'));
    // await sound.playAsync();
    
    // For now, we'll just vibrate
    if (isDevice) {
      // You can use expo-haptics for vibration feedback
      // await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  } catch (error) {
    console.error('Error playing notification sound:', error);
  }
};

// Badge management
export const setBadgeCount = async (count) => {
  try {
    await Notifications.setBadgeCountAsync(count);
  } catch (error) {
    console.error('Error setting badge count:', error);
  }
};

export const getBadgeCount = async () => {
  try {
    return await Notifications.getBadgeCountAsync();
  } catch (error) {
    console.error('Error getting badge count:', error);
    return 0;
  }
};

export const clearBadgeCount = async () => {
  try {
    await Notifications.setBadgeCountAsync(0);
  } catch (error) {
    console.error('Error clearing badge count:', error);
  }
};

// Notification listener setup
export const setupNotificationListeners = (handlers = {}) => {
  const subscriptionHandlers = [];

  // Notification received while app is foregrounded
  if (handlers.onReceived) {
    const subscription = Notifications.addNotificationReceivedListener(handlers.onReceived);
    subscriptionHandlers.push(subscription);
  }

  // User responded to notification
  if (handlers.onResponse) {
    const subscription = Notifications.addNotificationResponseReceivedListener(handlers.onResponse);
    subscriptionHandlers.push(subscription);
  }

  return () => {
    subscriptionHandlers.forEach(subscription => subscription.remove());
  };
};

// Check for new notifications (with rate limiting)
export const checkForNewNotifications = async (userId, lastCheckTime) => {
  try {
    const currentTime = Date.now();
    
    // Rate limiting - don't check more than once every 30 seconds
    if (lastCheckTime && currentTime - lastCheckTime < 30000) {
      return { success: true, data: [], rateLimited: true };
    }

    const notifications = await getNotifications(userId);
    await setItemAsync(NOTIFICATION_KEYS.LAST_NOTIFICATION_CHECK, currentTime.toString());
    
    return {
      success: true,
      data: notifications || [],
      rateLimited: false
    };
  } catch (error) {
    console.error('Error checking for new notifications:', error);
    return {
      success: false,
      error: error.message,
      rateLimited: false
    };
  }
};

// Export constants
export { NOTIFICATION_KEYS, NOTIFICATION_TYPES, NOTIFICATION_CATEGORIES };

export default {
  // Configuration
  configurePushNotifications,
  registerForPushNotifications,
  getPushToken,
  checkNotificationPermissions,
  
  // Notification management
  scheduleLocalNotification,
  createNotificationFromData,
  markAsRead,
  markMultipleAsRead,
  deleteNotificationById,
  deleteMultipleNotifications,
  deleteAllUserNotifications,
  
  // Utilities
  getNotificationTitle,
  getNotificationIcon,
  getNotificationColor,
  getUnreadCount,
  filterNotificationsByType,
  getUnreadNotifications,
  sortNotificationsByDate,
  groupNotificationsByDate,
  formatNotificationDate,
  
  // Badge management
  setBadgeCount,
  getBadgeCount,
  clearBadgeCount,
  
  // Event handling
  setupNotificationListeners,
  checkForNewNotifications,
  playNotificationSound,
  
  // Constants
  NOTIFICATION_KEYS,
  NOTIFICATION_TYPES,
  NOTIFICATION_CATEGORIES
};