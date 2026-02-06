// spacing.js - Consistent spacing scale for the app

import { responsiveHelpers } from '../../utils/responsive';

export const spacing = {
  // Pixel-based spacing (responsive)
  px: '1px',
  '0': '0px',
  '0.5': responsiveHelpers.getSpacing(2),
  '1': responsiveHelpers.getSpacing(4),
  '1.5': responsiveHelpers.getSpacing(6),
  '2': responsiveHelpers.getSpacing(8),
  '2.5': responsiveHelpers.getSpacing(10),
  '3': responsiveHelpers.getSpacing(12),
  '3.5': responsiveHelpers.getSpacing(14),
  '4': responsiveHelpers.getSpacing(16),
  '5': responsiveHelpers.getSpacing(20),
  '6': responsiveHelpers.getSpacing(24),
  '7': responsiveHelpers.getSpacing(28),
  '8': responsiveHelpers.getSpacing(32),
  '9': responsiveHelpers.getSpacing(36),
  '10': responsiveHelpers.getSpacing(40),
  '11': responsiveHelpers.getSpacing(44),
  '12': responsiveHelpers.getSpacing(48),
  '14': responsiveHelpers.getSpacing(56),
  '16': responsiveHelpers.getSpacing(64),
  '20': responsiveHelpers.getSpacing(80),
  '24': responsiveHelpers.getSpacing(96),
  '28': responsiveHelpers.getSpacing(112),
  '32': responsiveHelpers.getSpacing(128),
  '36': responsiveHelpers.getSpacing(144),
  '40': responsiveHelpers.getSpacing(160),
  '44': responsiveHelpers.getSpacing(176),
  '48': responsiveHelpers.getSpacing(192),
  '52': responsiveHelpers.getSpacing(208),
  '56': responsiveHelpers.getSpacing(224),
  '60': responsiveHelpers.getSpacing(240),
  '64': responsiveHelpers.getSpacing(256),
  '72': responsiveHelpers.getSpacing(288),
  '80': responsiveHelpers.getSpacing(320),
  '96': responsiveHelpers.getSpacing(384),

  // Percentage-based spacing (keep as strings for percentages)
  '1/2': '50%',
  '1/3': '33.333333%',
  '2/3': '66.666667%',
  '1/4': '25%',
  '2/4': '50%',
  '3/4': '75%',
  '1/5': '20%',
  '2/5': '40%',
  '3/5': '60%',
  '4/5': '80%',
  '1/6': '16.666667%',
  '2/6': '33.333333%',
  '3/6': '50%',
  '4/6': '66.666667%',
  '5/6': '83.333333%',
  '1/12': '8.333333%',
  '2/12': '16.666667%',
  '3/12': '25%',
  '4/12': '33.333333%',
  '5/12': '41.666667%',
  '6/12': '50%',
  '7/12': '58.333333%',
  '8/12': '66.666667%',
  '9/12': '75%',
  '10/12': '83.333333%',
  '11/12': '91.666667%',
  full: '100%',

  // Viewport-based spacing
  'vw-50': '50vw',
  'vw-100': '100vw',
  'vh-50': '50vh',
  'vh-100': '100vh',
};

// Semantic spacing names
export const semanticSpacing = {
  // Container spacing
  container: {
    xs: spacing['4'],
    sm: spacing['6'],
    md: spacing['8'],
    lg: spacing['12'],
    xl: spacing['16'],
  },

  // Content spacing
  content: {
    tight: spacing['2'],
    compact: spacing['4'],
    comfortable: spacing['6'],
    relaxed: spacing['8'],
    loose: spacing['12'],
  },

  // Section spacing
  section: {
    xs: spacing['8'],
    sm: spacing['12'],
    md: spacing['16'],
    lg: spacing['24'],
    xl: spacing['32'],
    xxl: spacing['48'],
  },

  // Screen padding
  screen: {
    mobile: spacing['4'],
    tablet: spacing['6'],
    desktop: spacing['8'],
  },

  // Component spacing
  component: {
    // Buttons
    button: {
      padding: {
        sm: `${spacing['2']} ${spacing['3']}`,
        md: `${spacing['3']} ${spacing['4']}`,
        lg: `${spacing['4']} ${spacing['6']}`,
      },
      margin: spacing['2'],
    },

    // Inputs
    input: {
      padding: {
        sm: `${spacing['2']} ${spacing['3']}`,
        md: `${spacing['3']} ${spacing['4']}`,
        lg: `${spacing['4']} ${spacing['5']}`,
      },
      margin: spacing['2'],
    },

    // Cards
    card: {
      padding: {
        sm: spacing['4'],
        md: spacing['6'],
        lg: spacing['8'],
      },
      margin: spacing['4'],
    },

    // Lists
    list: {
      item: {
        padding: spacing['4'],
        margin: spacing['2'],
      },
      separator: {
        margin: spacing['4'],
      },
    },
  },

  // Layout spacing
  layout: {
    gutter: spacing['4'],
    column: spacing['4'],
    row: spacing['4'],
    grid: spacing['4'],
  },

  // Icon spacing
  icon: {
    xs: spacing['2'],
    sm: spacing['3'],
    md: spacing['4'],
    lg: spacing['5'],
    xl: spacing['6'],
  },

  // Avatar spacing
  avatar: {
    xs: spacing['6'],
    sm: spacing['8'],
    md: spacing['12'],
    lg: spacing['16'],
    xl: spacing['20'],
  },

  // Badge spacing
  badge: {
    padding: {
      horizontal: spacing['2'],
      vertical: spacing['1'],
    },
    margin: spacing['1'],
  },

  // Navigation spacing
  navigation: {
    header: {
      padding: spacing['4'],
      height: '56px',
    },
    tab: {
      padding: spacing['3'],
      height: '48px',
    },
    drawer: {
      padding: spacing['4'],
      width: '280px',
    },
  },

  // Modal spacing
  modal: {
    padding: spacing['6'],
    margin: spacing['4'],
  },
};

// Responsive spacing breakpoints
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

// Spacing utilities
export const spacingUtils = {
  // Margin shortcuts
  m: (value) => ({ margin: value }),
  mx: (value) => ({ marginLeft: value, marginRight: value }),
  my: (value) => ({ marginTop: value, marginBottom: value }),
  mt: (value) => ({ marginTop: value }),
  mr: (value) => ({ marginRight: value }),
  mb: (value) => ({ marginBottom: value }),
  ml: (value) => ({ marginLeft: value }),

  // Padding shortcuts
  p: (value) => ({ padding: value }),
  px: (value) => ({ paddingLeft: value, paddingRight: value }),
  py: (value) => ({ paddingTop: value, paddingBottom: value }),
  pt: (value) => ({ paddingTop: value }),
  pr: (value) => ({ paddingRight: value }),
  pb: (value) => ({ paddingBottom: value }),
  pl: (value) => ({ paddingLeft: value }),

  // Gap shortcuts
  gap: (value) => ({ gap: value }),
  gapX: (value) => ({ columnGap: value }),
  gapY: (value) => ({ rowGap: value }),

  // Size shortcuts
  w: (value) => ({ width: value }),
  h: (value) => ({ height: value }),
  minW: (value) => ({ minWidth: value }),
  minH: (value) => ({ minHeight: value }),
  maxW: (value) => ({ maxWidth: value }),
  maxH: (value) => ({ maxHeight: value }),

  // Position shortcuts
  top: (value) => ({ top: value }),
  right: (value) => ({ right: value }),
  bottom: (value) => ({ bottom: value }),
  left: (value) => ({ left: value }),
};

export default {
  spacing,
  semantic: semanticSpacing,
  breakpoints,
  utils: spacingUtils,
};