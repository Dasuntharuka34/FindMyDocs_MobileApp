import bcrypt from 'bcryptjs';
import * as SecureStore from 'expo-secure-store';
import 'react-native-get-random-values';
import { changePassword, clearAuthData, loginUser, registerUser } from './api';

// --- Start of Fix ---
import { Platform } from 'react-native';

// Use a conditional import/mapping for storage
const isWeb = Platform.OS === 'web';
const storage = isWeb
  ? {
      // Placeholder for web storage (e.g., AsyncStorage)
      // Note: You would need to install and import AsyncStorage to make this work
      setItemAsync: () => Promise.resolve(), 
      getItemAsync: () => Promise.resolve(null),
      deleteItemAsync: () => Promise.resolve(),
    }
  : {
      setItemAsync: SecureStore.setItemAsync,
      getItemAsync: SecureStore.getItemAsync,
      deleteItemAsync: SecureStore.deleteItemAsync,
    };
// --- End of Fix ---

// Set bcrypt random fallback for React Native
bcrypt.setRandomFallback((len) => {
  const array = new Uint8Array(len);
  crypto.getRandomValues(array);
  return array;
});

// Auth constants
const AUTH_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  REFRESH_TOKEN: 'refreshToken',
};

// Auth error messages
const AUTH_ERRORS = {
  NETWORK: 'Network error. Please check your connection.',
  INVALID_CREDENTIALS: 'Invalid email or password.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNKNOWN: 'An unexpected error occurred.',
};

// Store authentication data
export const storeAuthData = async (token, user) => {
  try {
    await storage.setItemAsync(AUTH_KEYS.TOKEN, token);
    await storage.setItemAsync(AUTH_KEYS.USER, JSON.stringify(user));
    return true;
  } catch (error) {
    console.error('Error storing auth data:', error);
    return false;
  }
};

// Get stored authentication data
export const getAuthData = async () => {
  try {
    const [token, userJson] = await Promise.all([
      storage.getItemAsync(AUTH_KEYS.TOKEN),
      storage.getItemAsync(AUTH_KEYS.USER),
    ]);

    if (!token || !userJson) {
      return null;
    }

    const user = JSON.parse(userJson);
    return { token, user };
  } catch (error) {
    console.error('Error getting auth data:', error);
    return null;
  }
};

// Check if user is authenticated
export const isAuthenticated = async () => {
  try {
    const token = await storage.getItemAsync(AUTH_KEYS.TOKEN);
    return !!token;
  } catch (error) {
    console.error('Error checking authentication:', error);
    return false;
  }
};

// Login function with enhanced error handling
export const login = async (email, password) => {
  try {
    const result = await loginUser(email, password);
    
    if (result && result.token && result.user) {
      const success = await storeAuthData(result.token, result.user);
      
      if (!success) {
        throw new Error('Failed to store authentication data');
      }
      
      return {
        success: true,
        user: result.user,
        token: result.token,
        message: 'Login successful'
      };
    }
    
    throw new Error('Invalid response from server');
    
  } catch (error) {
    console.error('Login error:', error);
    
    let errorMessage = AUTH_ERRORS.UNKNOWN;
    
    if (error.message.includes('Network')) {
      errorMessage = AUTH_ERRORS.NETWORK;
    } else if (error.message.includes('Invalid') || error.message.includes('credentials')) {
      errorMessage = AUTH_ERRORS.INVALID_CREDENTIALS;
    } else if (error.response?.status >= 500) {
      errorMessage = AUTH_ERRORS.SERVER_ERROR;
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    }
    
    return {
      success: false,
      error: errorMessage,
      originalError: error.message
    };
  }
};

// Registration function
export const register = async (userData) => {
  try {
    const result = await registerUser(userData);
    
    return {
      success: true,
      data: result,
      message: 'Registration submitted successfully. Please wait for admin approval.'
    };
    
  } catch (error) {
    console.error('Registration error:', error);
    
    let errorMessage = 'Registration failed. Please try again.';
    
    if (error.message.includes('Network')) {
      errorMessage = AUTH_ERRORS.NETWORK;
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.message.includes('already exists')) {
      errorMessage = 'User with this email or NIC already exists.';
    }
    
    return {
      success: false,
      error: errorMessage,
      originalError: error.message
    };
  }
};

// Logout function
export const logout = async () => {
  try {
    await clearAuthData();
    await storage.deleteItemAsync(AUTH_KEYS.TOKEN);
    await storage.deleteItemAsync(AUTH_KEYS.USER);
    await storage.deleteItemAsync(AUTH_KEYS.REFRESH_TOKEN);
    return { success: true, message: 'Logged out successfully' };
  } catch (error) {
    console.error('Logout error:', error);
    return { success: false, error: 'Failed to logout' };
  }
};

// Change password function
export const changeUserPassword = async (userId, currentPassword, newPassword, confirmPassword) => {
  try {
    if (newPassword !== confirmPassword) {
      return {
        success: false,
        error: 'New password and confirmation do not match.'
      };
    }

    const result = await changePassword(userId, {
      currentPassword,
      newPassword,
      confirmNewPassword: confirmPassword
    });

    return {
      success: true,
      message: 'Password changed successfully.'
    };

  } catch (error) {
    console.error('Change password error:', error);
    
    let errorMessage = 'Failed to change password. Please try again.';
    
    if (error.message.includes('Network')) {
      errorMessage = AUTH_ERRORS.NETWORK;
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.message.includes('Invalid old password')) {
      errorMessage = 'Current password is incorrect.';
    }
    
    return {
      success: false,
      error: errorMessage,
      originalError: error.message
    };
  }
};

// Get current user
export const getCurrentUser = async () => {
  try {
    const authData = await getAuthData();
    return authData ? authData.user : null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

// Get auth token
export const getToken = async () => {
  try {
    return await storage.getItemAsync(AUTH_KEYS.TOKEN);
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

// Check if user has specific role
export const hasRole = async (role) => {
  try {
    const user = await getCurrentUser();
    return user?.role === role;
  } catch (error) {
    console.error('Error checking role:', error);
    return false;
  }
};

// Check if user has any of the specified roles
export const hasAnyRole = async (roles) => {
  try {
    const user = await getCurrentUser();
    return roles.includes(user?.role);
  } catch (error) {
    console.error('Error checking roles:', error);
    return false;
  }
};

// Validate token expiration (basic check)
export const isTokenValid = async () => {
  try {
    const token = await getToken();
    if (!token) return false;

    // Basic check - you might want to use a JWT library for proper validation
    // This just checks if the token exists and looks like a JWT
    const tokenParts = token.split('.');
    return tokenParts.length === 3;
  } catch (error) {
    console.error('Error validating token:', error);
    return false;
  }
};

// Refresh token function (placeholder - implement based on your backend)
export const refreshToken = async () => {
  try {
    // Implement token refresh logic based on your backend
    // This is a placeholder implementation
    const refreshToken = await storage.getItemAsync(AUTH_KEYS.REFRESH_TOKEN);
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    // Here you would call your refresh token endpoint
    // const response = await api.post('/auth/refresh', { refreshToken });
    // await storeAuthData(response.data.token, response.data.user);
    
    return { success: true };
  } catch (error) {
    console.error('Token refresh error:', error);
    await logout();
    return { success: false, error: 'Session expired. Please login again.' };
  }
};

// Auth status checker
export const checkAuthStatus = async () => {
  try {
    const [authenticated, tokenValid] = await Promise.all([
      isAuthenticated(),
      isTokenValid()
    ]);

    if (!authenticated || !tokenValid) {
      return { authenticated: false, valid: false };
    }

    // Optional: Add additional checks here
    const user = await getCurrentUser();
    
    return {
      authenticated: true,
      valid: true,
      user: user
    };
  } catch (error) {
    console.error('Auth status check error:', error);
    return { authenticated: false, valid: false };
  }
};

// Clear all auth data (for debugging or cleanup)
export const clearAllAuthData = async () => {
  try {
    await Promise.all([
      storage.deleteItemAsync(AUTH_KEYS.TOKEN),
      storage.deleteItemAsync(AUTH_KEYS.USER),
      storage.deleteItemAsync(AUTH_KEYS.REFRESH_TOKEN)
    ]);
    return true;
  } catch (error) {
    console.error('Error clearing auth data:', error);
    return false;
  }
};

// Update user profile in storage
export const updateStoredUser = async (updatedUser) => {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      throw new Error('No user found in storage');
    }

    const mergedUser = { ...currentUser, ...updatedUser };
    await storage.setItemAsync(AUTH_KEYS.USER, JSON.stringify(mergedUser));
    
    return true;
  } catch (error) {
    console.error('Error updating stored user:', error);
    return false;
  }
};

// Export constants for external use
export { AUTH_ERRORS, AUTH_KEYS };

export default {
  // Core functions
  login,
  register,
  logout,
  changePassword: changeUserPassword,
  
  // Getters
  getCurrentUser,
  getToken,
  isAuthenticated,
  hasRole,
  hasAnyRole,
  isTokenValid,
  checkAuthStatus,
  
  // Utilities
  refreshToken,
  updateStoredUser,
  clearAllAuthData,
  storeAuthData,
  getAuthData,
  
  // Constants
  AUTH_KEYS,
  AUTH_ERRORS
};