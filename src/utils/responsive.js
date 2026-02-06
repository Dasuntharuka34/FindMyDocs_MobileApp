import { Dimensions } from 'react-native';

// Get screen dimensions
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Base dimensions (iPhone 6/7/8)
const baseWidth = 375;
const baseHeight = 667;

// Scaling factors
const widthScale = screenWidth / baseWidth;
const heightScale = screenHeight / baseHeight;
const scale = Math.min(widthScale, heightScale);

// Responsive scaling functions
export const responsive = {
  // Scale font sizes
  fontSize: (size) => Math.round(size * scale),

  // Scale spacing (padding, margin, etc.)
  spacing: (size) => Math.round(size * scale),

  // Scale width
  width: (size) => Math.round(size * widthScale),

  // Scale height
  height: (size) => Math.round(size * heightScale),

  // Get percentage of screen width
  widthPercentage: (percentage) => (screenWidth * percentage) / 100,

  // Get percentage of screen height
  heightPercentage: (percentage) => (screenHeight * percentage) / 100,

  // Scale border radius
  borderRadius: (size) => Math.round(size * scale),
};

// Screen size breakpoints
export const breakpoints = {
  small: 320,
  medium: 375,
  large: 414,
  xlarge: 768,
  xxlarge: 1024,
};

// Device type detection
export const deviceType = {
  isSmall: screenWidth < breakpoints.medium,
  isMedium: screenWidth >= breakpoints.medium && screenWidth < breakpoints.large,
  isLarge: screenWidth >= breakpoints.large && screenWidth < breakpoints.xlarge,
  isXLarge: screenWidth >= breakpoints.xlarge,
  isTablet: screenWidth >= breakpoints.xlarge,
  isPhone: screenWidth < breakpoints.xlarge,
};

// Orientation detection
export const orientation = {
  isPortrait: screenHeight > screenWidth,
  isLandscape: screenWidth > screenHeight,
};

// Screen dimensions
export const screen = {
  width: screenWidth,
  height: screenHeight,
  scale: scale,
  widthScale: widthScale,
  heightScale: heightScale,
};

// Helper functions for responsive design
export const responsiveHelpers = {
  // Get responsive font size based on device type
  getFontSize: (baseSize) => {
    let multiplier = 1;
    if (deviceType.isSmall) multiplier = 0.9;
    else if (deviceType.isLarge) multiplier = 1.1;
    else if (deviceType.isXLarge) multiplier = 1.2;

    return responsive.fontSize(baseSize * multiplier);
  },

  // Get responsive spacing based on device type
  getSpacing: (baseSize) => {
    let multiplier = 1;
    if (deviceType.isSmall) multiplier = 0.9;
    else if (deviceType.isLarge) multiplier = 1.1;
    else if (deviceType.isXLarge) multiplier = 1.2;

    return responsive.spacing(baseSize * multiplier);
  },

  // Get responsive width for components
  getWidth: (percentage) => {
    return responsive.widthPercentage(percentage);
  },

  // Get minimum width for flex items
  getMinWidth: (baseWidth) => {
    return responsive.width(baseWidth);
  },
};

export default responsive;
