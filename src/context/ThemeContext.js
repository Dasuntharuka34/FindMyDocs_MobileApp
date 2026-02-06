import { Platform } from 'react-native';
import { getItemAsync, setItemAsync, deleteItemAsync } from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// --- Storage helper to handle web vs. native platforms ---
const isWeb = Platform.OS === 'web';
const storage = isWeb
  ? {
      setItemAsync: AsyncStorage.setItem,
      getItemAsync: AsyncStorage.getItem,
      deleteItemAsync: AsyncStorage.removeItem,
    }
  : {
      setItemAsync,
      getItemAsync,
      deleteItemAsync,
    };

// Color palettes for light and dark themes
const lightColors = {
  // Primary colors
  primary: '#4361ee',
  primaryLight: '#4895ef',
  primaryDark: '#3a0ca3',
  
  // Secondary colors
  secondary: '#f72585',
  secondaryLight: '#f8a5d0',
  secondaryDark: '#b5179e',
  
  // Status colors
  success: '#4ade80',
  warning: '#fbbf24',
  error: '#ef4444',
  info: '#3b82f6',
  
  // Background colors
  background: '#ffffff',
  backgroundSecondary: '#f8fafc',
  backgroundTertiary: '#f1f5f9',
  
  // Text colors
  textPrimary: '#1f2937',
  textSecondary: '#6b7280',
  textTertiary: '#9ca3af',
  textInverse: '#ffffff',
  
  // Border colors
  border: '#e5e7eb',
  borderLight: '#f3f4f6',
  borderDark: '#d1d5db',
  
  // Card colors
  card: '#ffffff',
  cardSecondary: '#f9fafb',
  
  // Input colors
  inputBackground: '#ffffff',
  inputBorder: '#e5e7eb',
  inputPlaceholder: '#9ca3af',
  
  // Notification colors
  notificationInfo: '#dbeafe',
  notificationSuccess: '#dcfce7',
  notificationWarning: '#fef3c7',
  notificationError: '#fee2e2',
};

const darkColors = {
  // Primary colors
  primary: '#6366f1',
  primaryLight: '#818cf8',
  primaryDark: '#4f46e5',
  
  // Secondary colors
  secondary: '#ec4899',
  secondaryLight: '#f472b6',
  secondaryDark: '#db2777',
  
  // Status colors
  success: '#22c55e',
  warning: '#eab308',
  error: '#dc2626',
  info: '#2563eb',
  
  // Background colors
  background: '#0f172a',
  backgroundSecondary: '#1e293b',
  backgroundTertiary: '#334155',
  
  // Text colors
  textPrimary: '#f1f5f9',
  textSecondary: '#cbd5e1',
  textTertiary: '#94a3b8',
  textInverse: '#0f172a',
  
  // Border colors
  border: '#334155',
  borderLight: '#475569',
  borderDark: '#1e293b',
  
  // Card colors
  card: '#1e293b',
  cardSecondary: '#334155',
  
  // Input colors
  inputBackground: '#1e293b',
  inputBorder: '#334155',
  inputPlaceholder: '#64748b',
  
  // Notification colors
  notificationInfo: '#1e3a8a',
  notificationSuccess: '#166534',
  notificationWarning: '#854d0e',
  notificationError: '#7f1d1d',
};

// Import responsive utilities
import { responsiveHelpers } from '../utils/responsive';

// Spacing constants (responsive)
const spacing = {
  xs: responsiveHelpers.getSpacing(4),
  sm: responsiveHelpers.getSpacing(8),
  md: responsiveHelpers.getSpacing(16),
  lg: responsiveHelpers.getSpacing(24),
  xl: responsiveHelpers.getSpacing(32),
  xxl: responsiveHelpers.getSpacing(48),
};

// Typography scale (responsive)
const typography = {
  xs: {
    fontSize: responsiveHelpers.getFontSize(12),
    lineHeight: responsiveHelpers.getFontSize(16),
  },
  sm: {
    fontSize: responsiveHelpers.getFontSize(14),
    lineHeight: responsiveHelpers.getFontSize(20),
  },
  md: {
    fontSize: responsiveHelpers.getFontSize(16),
    lineHeight: responsiveHelpers.getFontSize(24),
  },
  lg: {
    fontSize: responsiveHelpers.getFontSize(18),
    lineHeight: responsiveHelpers.getFontSize(28),
  },
  xl: {
    fontSize: responsiveHelpers.getFontSize(20),
    lineHeight: responsiveHelpers.getFontSize(28),
  },
  xxl: {
    fontSize: responsiveHelpers.getFontSize(24),
    lineHeight: responsiveHelpers.getFontSize(32),
  },
  xxxl: {
    fontSize: responsiveHelpers.getFontSize(30),
    lineHeight: responsiveHelpers.getFontSize(36),
  },
};

// Border radius
const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 24,
  full: 9999,
};

export const ThemeProvider = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [theme, setTheme] = useState('system'); // 'light', 'dark', 'system'
  const [isLoading, setIsLoading] = useState(true);

  // Get actual colors based on theme preference
  const colors = theme === 'light' 
    ? lightColors 
    : theme === 'dark' 
    ? darkColors 
    : systemColorScheme === 'dark' 
    ? darkColors 
    : lightColors;

  // Complete theme object
  const themeObject = {
    colors,
    spacing,
    typography,
    borderRadius,
    current: theme,
    isDark: colors === darkColors,
  };

  // Load saved theme preference
  useEffect(() => {
    loadThemePreference();
  }, []);

  const loadThemePreference = async () => {
    try {
      const savedTheme = await storage.getItemAsync('theme'); // Fixed line
      if (savedTheme) {
        setTheme(savedTheme);
      }
    } catch (error) {
      console.error('Error loading theme preference:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Set theme preference
  const setThemePreference = async (newTheme) => {
    try {
      setTheme(newTheme);
      await storage.setItemAsync('theme', newTheme); // Fixed line
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };

  // Toggle between light and dark
  const toggleTheme = async () => {
    const newTheme = themeObject.isDark ? 'light' : 'dark';
    await setThemePreference(newTheme);
  };

  // Get theme name for display
  const getThemeName = () => {
    if (theme === 'system') {
      return `System (${systemColorScheme})`;
    }
    return theme.charAt(0).toUpperCase() + theme.slice(1);
  };

  const value = {
    // Theme object
    theme: themeObject,
    
    // State
    isLoading,
    themePreference: theme,
    
    // Methods
    setTheme: setThemePreference,
    toggleTheme,
    getThemeName,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook for using theme in styles
export const useThemeStyles = () => {
  const { theme } = useTheme();
  
  const createStyles = (styleCreator) => {
    return styleCreator(theme);
  };

  return { createStyles, theme };
};

// Pre-defined style patterns
export const commonStyles = {
  container: (theme) => ({
    flex: 1,
    backgroundColor: theme?.colors?.background || '#ffffff',
    padding: theme?.spacing?.md || 16,
  }),
  card: (theme) => ({
    backgroundColor: theme?.colors?.card || '#ffffff',
    borderRadius: theme?.borderRadius?.lg || 12,
    padding: theme?.spacing?.lg || 24,
    marginBottom: theme?.spacing?.md || 16,
    shadowColor: theme?.colors?.textPrimary || '#1f2937',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: theme?.isDark ? 0.3 : 0.1,
    shadowRadius: 3,
    elevation: 3,
  }),
  button: (theme, variant = 'primary') => ({
    backgroundColor: theme?.colors?.[variant] || '#4361ee',
    paddingVertical: theme?.spacing?.sm || 8,
    paddingHorizontal: theme?.spacing?.lg || 24,
    borderRadius: theme?.borderRadius?.md || 8,
    alignItems: 'center',
    justifyContent: 'center',
  }),
  buttonText: (theme, variant = 'primary') => ({
    color: variant === 'primary' ? (theme?.colors?.textInverse || '#ffffff') : (theme?.colors?.textPrimary || '#1f2937'),
    fontSize: theme?.typography?.md?.fontSize || 16,
    fontWeight: '600',
  }),
  input: (theme) => ({
    backgroundColor: theme?.colors?.inputBackground || '#ffffff',
    borderWidth: 1,
    borderColor: theme?.colors?.inputBorder || '#e5e7eb',
    borderRadius: theme?.borderRadius?.md || 8,
    padding: theme?.spacing?.md || 16,
    color: theme?.colors?.textPrimary || '#1f2937',
    fontSize: theme?.typography?.md?.fontSize || 16,
  }),
  text: (theme, variant = 'primary', size = 'md') => ({
    color: theme?.colors?.[`text${variant.charAt(0).toUpperCase() + variant.slice(1)}`] || theme?.colors?.textPrimary || '#1f2937',
    fontSize: theme?.typography?.[size]?.fontSize || 16,
    lineHeight: theme?.typography?.[size]?.lineHeight || 24,
  }),
  header: (theme) => ({
    ...typography.xxl,
    color: theme.colors.textPrimary,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: spacing.lg,
  }),
  title: (theme) => ({
    ...typography.lg,
    color: theme.colors.textPrimary,
    fontWeight: 'bold',
    marginBottom: spacing.md,
  }),
  label: (theme) => ({
    ...typography.sm,
    color: theme.colors.textSecondary,
    fontWeight: '600',
    marginBottom: spacing.sm,
  }),
  textInput: (theme) => ({
    ...commonStyles.input(theme),
    height: 100,
    textAlignVertical: 'top',
    paddingTop: spacing.md,
    marginBottom: spacing.md,
  }),
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.md,
  },
  successButton: (theme) => ({
    ...commonStyles.button(theme),
    backgroundColor: theme.colors.success,
    flex: 1,
    marginRight: spacing.sm,
  }),
  dangerButton: (theme) => ({
    ...commonStyles.button(theme),
    backgroundColor: theme.colors.error,
    flex: 1,
    marginLeft: spacing.sm,
  }),
};
