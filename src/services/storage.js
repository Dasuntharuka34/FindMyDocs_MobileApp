import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Conditionally import SecureStore only for native platforms
let SecureStore = null;
if (Platform.OS !== 'web') {
  try {
    SecureStore = require('expo-secure-store');
  } catch (error) {
    console.warn('SecureStore not available:', error);
  }
}

// Storage keys constants
export const STORAGE_KEYS = {
  // Auth related
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  REFRESH_TOKEN: 'refresh_token',
  
  // App settings
  THEME_PREFERENCE: 'theme_preference',
  LANGUAGE: 'language',
  NOTIFICATION_SETTINGS: 'notification_settings',
  
  // App state
  LAST_VISITED_SCREEN: 'last_visited_screen',
  APP_FIRST_LAUNCH: 'app_first_launch',
  ONBOARDING_COMPLETED: 'onboarding_completed',
  
  // Data cache
  REQUESTS_CACHE: 'requests_cache',
  NOTIFICATIONS_CACHE: 'notifications_cache',
  USER_PROFILE_CACHE: 'user_profile_cache',
  
  // Form data (draft saving)
  DRAFT_EXCUSE_REQUEST: 'draft_excuse_request',
  DRAFT_LEAVE_REQUEST: 'draft_leave_request',
  DRAFT_LETTER: 'draft_letter',
};

// Storage types
export const STORAGE_TYPES = {
  SECURE: 'secure', // For sensitive data
  ASYNC: 'async',   // For non-sensitive data
};

// Error messages
const STORAGE_ERRORS = {
  SECURE_STORE_UNAVAILABLE: 'SecureStore is not available on this device',
  ASYNC_STORAGE_ERROR: 'AsyncStorage operation failed',
  INVALID_DATA: 'Invalid data format',
  KEY_REQUIRED: 'Storage key is required',
};

/**
 * Secure Storage Functions (for sensitive data)
 */

// Store data securely
export const secureSet = async (key, value) => {
  try {
    if (typeof value === 'object') {
      value = JSON.stringify(value);
    }

    // Use AsyncStorage on web platform, SecureStore on native
    if (Platform.OS === 'web') {
      await AsyncStorage.setItem(`secure_${key}`, value);
    } else {
      await SecureStore.setItemAsync(key, value);
    }
    return { success: true };
  } catch (error) {
    console.error(`SecureStore set error for key ${key}:`, error);
    return {
      success: false,
      error: STORAGE_ERRORS.SECURE_STORE_UNAVAILABLE,
      details: error.message
    };
  }
};

// Get data from secure storage
export const secureGet = async (key) => {
  try {
    let value;
    if (Platform.OS === 'web') {
      value = await AsyncStorage.getItem(`secure_${key}`);
    } else {
      value = await SecureStore.getItemAsync(key);
    }

    if (value === null) {
      return { success: true, data: null };
    }

    // Try to parse as JSON, if it fails return as string
    try {
      const parsedValue = JSON.parse(value);
      return { success: true, data: parsedValue };
    } catch {
      return { success: true, data: value };
    }
  } catch (error) {
    console.error(`SecureStore get error for key ${key}:`, error);
    return {
      success: false,
      error: STORAGE_ERRORS.SECURE_STORE_UNAVAILABLE,
      details: error.message
    };
  }
};

// Delete data from secure storage
export const secureDelete = async (key) => {
  try {
    if (Platform.OS === 'web') {
      await AsyncStorage.removeItem(`secure_${key}`);
    } else {
      await SecureStore.deleteItemAsync(key);
    }
    return { success: true };
  } catch (error) {
    console.error(`SecureStore delete error for key ${key}:`, error);
    return {
      success: false,
      error: STORAGE_ERRORS.SECURE_STORE_UNAVAILABLE,
      details: error.message
    };
  }
};

// Check if key exists in secure storage
export const secureExists = async (key) => {
  try {
    let value;
    if (Platform.OS === 'web') {
      value = await AsyncStorage.getItem(`secure_${key}`);
    } else {
      value = await SecureStore.getItemAsync(key);
    }
    return { success: true, exists: value !== null };
  } catch (error) {
    console.error(`SecureStore exists error for key ${key}:`, error);
    return {
      success: false,
      error: STORAGE_ERRORS.SECURE_STORE_UNAVAILABLE,
      details: error.message
    };
  }
};

/**
 * Async Storage Functions (for non-sensitive data)
 */

// Store data in async storage
export const asyncSet = async (key, value) => {
  try {
    if (typeof value === 'object') {
      value = JSON.stringify(value);
    }
    
    await AsyncStorage.setItem(key, value);
    return { success: true };
  } catch (error) {
    console.error(`AsyncStorage set error for key ${key}:`, error);
    return { 
      success: false, 
      error: STORAGE_ERRORS.ASYNC_STORAGE_ERROR,
      details: error.message 
    };
  }
};

// Get data from async storage
export const asyncGet = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    
    if (value === null) {
      return { success: true, data: null };
    }

    // Try to parse as JSON, if it fails return as string
    try {
      const parsedValue = JSON.parse(value);
      return { success: true, data: parsedValue };
    } catch {
      return { success: true, data: value };
    }
  } catch (error) {
    console.error(`AsyncStorage get error for key ${key}:`, error);
    return { 
      success: false, 
      error: STORAGE_ERRORS.ASYNC_STORAGE_ERROR,
      details: error.message 
    };
  }
};

// Delete data from async storage
export const asyncDelete = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
    return { success: true };
  } catch (error) {
    console.error(`AsyncStorage delete error for key ${key}:`, error);
    return { 
      success: false, 
      error: STORAGE_ERRORS.ASYNC_STORAGE_ERROR,
      details: error.message 
    };
  }
};

// Check if key exists in async storage
export const asyncExists = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    return { success: true, exists: value !== null };
  } catch (error) {
    console.error(`AsyncStorage exists error for key ${key}:`, error);
    return { 
      success: false, 
      error: STORAGE_ERRORS.ASYNC_STORAGE_ERROR,
      details: error.message 
    };
  }
};

// Multi-get from async storage
export const asyncMultiGet = async (keys) => {
  try {
    const values = await AsyncStorage.multiGet(keys);
    const result = {};
    
    values.forEach(([key, value]) => {
      if (value !== null) {
        try {
          result[key] = JSON.parse(value);
        } catch {
          result[key] = value;
        }
      } else {
        result[key] = null;
      }
    });
    
    return { success: true, data: result };
  } catch (error) {
    console.error('AsyncStorage multi-get error:', error);
    return { 
      success: false, 
      error: STORAGE_ERRORS.ASYNC_STORAGE_ERROR,
      details: error.message 
    };
  }
};

// Multi-set in async storage
export const asyncMultiSet = async (keyValuePairs) => {
  try {
    const pairs = keyValuePairs.map(([key, value]) => {
      if (typeof value === 'object') {
        value = JSON.stringify(value);
      }
      return [key, value];
    });
    
    await AsyncStorage.multiSet(pairs);
    return { success: true };
  } catch (error) {
    console.error('AsyncStorage multi-set error:', error);
    return { 
      success: false, 
      error: STORAGE_ERRORS.ASYNC_STORAGE_ERROR,
      details: error.message 
    };
  }
};

// Clear all async storage (use with caution!)
export const asyncClearAll = async () => {
  try {
    await AsyncStorage.clear();
    return { success: true };
  } catch (error) {
    console.error('AsyncStorage clear all error:', error);
    return { 
      success: false, 
      error: STORAGE_ERRORS.ASYNC_STORAGE_ERROR,
      details: error.message 
    };
  }
};

// Get all keys from async storage
export const asyncGetAllKeys = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    return { success: true, data: keys };
  } catch (error) {
    console.error('AsyncStorage get all keys error:', error);
    return { 
      success: false, 
      error: STORAGE_ERRORS.ASYNC_STORAGE_ERROR,
      details: error.message 
    };
  }
};

/**
 * Unified Storage Functions (auto-selects storage type based on data sensitivity)
 */

// Unified set function
export const storageSet = async (key, value, storageType = STORAGE_TYPES.ASYNC) => {
  if (storageType === STORAGE_TYPES.SECURE) {
    return secureSet(key, value);
  } else {
    return asyncSet(key, value);
  }
};

// Unified get function
export const storageGet = async (key, storageType = STORAGE_TYPES.ASYNC) => {
  if (storageType === STORAGE_TYPES.SECURE) {
    return secureGet(key);
  } else {
    return asyncGet(key);
  }
};

// Unified delete function
export const storageDelete = async (key, storageType = STORAGE_TYPES.ASYNC) => {
  if (storageType === STORAGE_TYPES.SECURE) {
    return secureDelete(key);
  } else {
    return asyncDelete(key);
  }
};

// Unified exists function
export const storageExists = async (key, storageType = STORAGE_TYPES.ASYNC) => {
  if (storageType === STORAGE_TYPES.SECURE) {
    return secureExists(key);
  } else {
    return asyncExists(key);
  }
};

/**
 * Application-specific storage helpers
 */

// Auth data management
export const authStorage = {
  // Store auth data
  setAuthData: async (token, userData) => {
    const results = await Promise.all([
      secureSet(STORAGE_KEYS.AUTH_TOKEN, token),
      secureSet(STORAGE_KEYS.USER_DATA, userData)
    ]);
    
    return results.every(result => result.success);
  },
  
  // Get auth data
  getAuthData: async () => {
    const [tokenResult, userDataResult] = await Promise.all([
      secureGet(STORAGE_KEYS.AUTH_TOKEN),
      secureGet(STORAGE_KEYS.USER_DATA)
    ]);
    
    if (tokenResult.success && userDataResult.success) {
      return {
        token: tokenResult.data,
        user: userDataResult.data
      };
    }
    
    return null;
  },
  
  // Clear auth data
  clearAuthData: async () => {
    await Promise.all([
      secureDelete(STORAGE_KEYS.AUTH_TOKEN),
      secureDelete(STORAGE_KEYS.USER_DATA),
      secureDelete(STORAGE_KEYS.REFRESH_TOKEN)
    ]);
  },
  
  // Check if user is authenticated
  isAuthenticated: async () => {
    const tokenResult = await secureGet(STORAGE_KEYS.AUTH_TOKEN);
    return tokenResult.success && tokenResult.data !== null;
  }
};

// App settings management
export const settingsStorage = {
  // Theme settings
  setTheme: async (theme) => asyncSet(STORAGE_KEYS.THEME_PREFERENCE, theme),
  getTheme: async () => asyncGet(STORAGE_KEYS.THEME_PREFERENCE),
  
  // Language settings
  setLanguage: async (language) => asyncSet(STORAGE_KEYS.LANGUAGE, language),
  getLanguage: async () => asyncGet(STORAGE_KEYS.LANGUAGE),
  
  // Notification settings
  setNotificationSettings: async (settings) => asyncSet(STORAGE_KEYS.NOTIFICATION_SETTINGS, settings),
  getNotificationSettings: async () => asyncGet(STORAGE_KEYS.NOTIFICATION_SETTINGS),
};

// Data caching
export const cacheStorage = {
  // Requests cache
  setRequestsCache: async (requests) => asyncSet(STORAGE_KEYS.REQUESTS_CACHE, {
    data: requests,
    timestamp: Date.now()
  }),
  
  getRequestsCache: async () => asyncGet(STORAGE_KEYS.REQUESTS_CACHE),
  
  // Notifications cache
  setNotificationsCache: async (notifications) => asyncSet(STORAGE_KEYS.NOTIFICATIONS_CACHE, {
    data: notifications,
    timestamp: Date.now()
  }),
  
  getNotificationsCache: async () => asyncGet(STORAGE_KEYS.NOTIFICATIONS_CACHE),
  
  // Check if cache is valid (less than 5 minutes old)
  isCacheValid: (cacheData, maxAge = 5 * 60 * 1000) => {
    if (!cacheData || !cacheData.timestamp) return false;
    return Date.now() - cacheData.timestamp < maxAge;
  },
  
  // Clear all cache
  clearAll: async () => {
    await Promise.all([
      asyncDelete(STORAGE_KEYS.REQUESTS_CACHE),
      asyncDelete(STORAGE_KEYS.NOTIFICATIONS_CACHE),
      asyncDelete(STORAGE_KEYS.USER_PROFILE_CACHE)
    ]);
  }
};

// Form draft management
export const draftStorage = {
  // Save draft request
  saveDraft: async (type, formData) => {
    let key;
    switch (type) {
      case 'excuse':
        key = STORAGE_KEYS.DRAFT_EXCUSE_REQUEST;
        break;
      case 'leave':
        key = STORAGE_KEYS.DRAFT_LEAVE_REQUEST;
        break;
      case 'letter':
        key = STORAGE_KEYS.DRAFT_LETTER;
        break;
      default:
        throw new Error('Invalid draft type');
    }
    
    return asyncSet(key, {
      ...formData,
      savedAt: Date.now()
    });
  },
  
  // Get draft request
  getDraft: async (type) => {
    let key;
    switch (type) {
      case 'excuse':
        key = STORAGE_KEYS.DRAFT_EXCUSE_REQUEST;
        break;
      case 'leave':
        key = STORAGE_KEYS.DRAFT_LEAVE_REQUEST;
        break;
      case 'letter':
        key = STORAGE_KEYS.DRAFT_LETTER;
        break;
      default:
        throw new Error('Invalid draft type');
    }
    
    return asyncGet(key);
  },
  
  // Clear draft
  clearDraft: async (type) => {
    let key;
    switch (type) {
      case 'excuse':
        key = STORAGE_KEYS.DRAFT_EXCUSE_REQUEST;
        break;
      case 'leave':
        key = STORAGE_KEYS.DRAFT_LEAVE_REQUEST;
        break;
      case 'letter':
        key = STORAGE_KEYS.DRAFT_LETTER;
        break;
      default:
        throw new Error('Invalid draft type');
    }
    
    return asyncDelete(key);
  },
  
  // Clear all drafts
  clearAllDrafts: async () => {
    await Promise.all([
      asyncDelete(STORAGE_KEYS.DRAFT_EXCUSE_REQUEST),
      asyncDelete(STORAGE_KEYS.DRAFT_LEAVE_REQUEST),
      asyncDelete(STORAGE_KEYS.DRAFT_LETTER)
    ]);
  }
};

// App state management
export const appStateStorage = {
  setLastVisitedScreen: async (screenName) => asyncSet(STORAGE_KEYS.LAST_VISITED_SCREEN, screenName),
  getLastVisitedScreen: async () => asyncGet(STORAGE_KEYS.LAST_VISITED_SCREEN),
  
  setAppFirstLaunch: async (isFirstLaunch) => asyncSet(STORAGE_KEYS.APP_FIRST_LAUNCH, isFirstLaunch),
  getAppFirstLaunch: async () => asyncGet(STORAGE_KEYS.APP_FIRST_LAUNCH),
  
  setOnboardingCompleted: async (completed) => asyncSet(STORAGE_KEYS.ONBOARDING_COMPLETED, completed),
  getOnboardingCompleted: async () => asyncGet(STORAGE_KEYS.ONBOARDING_COMPLETED),
};

/**
 * Utility functions
 */

// Migrate data from old keys to new keys
export const migrateStorage = async (keyMappings) => {
  for (const [oldKey, newKey] of Object.entries(keyMappings)) {
    const oldData = await asyncGet(oldKey);
    if (oldData.success && oldData.data !== null) {
      await asyncSet(newKey, oldData.data);
      await asyncDelete(oldKey);
    }
  }
};

// Get storage statistics
export const getStorageStats = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const stats = {
      totalKeys: keys.length,
      totalSize: 0,
      keysByPrefix: {}
    };
    
    for (const key of keys) {
      const value = await AsyncStorage.getItem(key);
      stats.totalSize += value ? value.length : 0;
      
      const prefix = key.split('_')[0];
      stats.keysByPrefix[prefix] = (stats.keysByPrefix[prefix] || 0) + 1;
    }
    
    return { success: true, data: stats };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Export everything
export default {
  // Basic storage functions
  secureSet,
  secureGet,
  secureDelete,
  secureExists,
  
  asyncSet,
  asyncGet,
  asyncDelete,
  asyncExists,
  asyncMultiGet,
  asyncMultiSet,
  asyncClearAll,
  asyncGetAllKeys,
  
  storageSet,
  storageGet,
  storageDelete,
  storageExists,
  
  // Application-specific helpers
  authStorage,
  settingsStorage,
  cacheStorage,
  draftStorage,
  appStateStorage,
  
  // Constants
  STORAGE_KEYS,
  STORAGE_TYPES,
  STORAGE_ERRORS,
  
  // Utilities
  migrateStorage,
  getStorageStats,
};