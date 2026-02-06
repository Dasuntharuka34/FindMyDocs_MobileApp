// src/styles/typography.js

import { responsiveHelpers } from '../../utils/responsive';

export const typography = {
  // Display styles
  display: {
    xxl: {
      fontSize: responsiveHelpers.getFontSize(36),
      fontWeight: '800',
      lineHeight: responsiveHelpers.getFontSize(44),
      letterSpacing: -0.5,
    },
    xl: {
      fontSize: responsiveHelpers.getFontSize(30),
      fontWeight: '800',
      lineHeight: responsiveHelpers.getFontSize(38),
      letterSpacing: -0.5,
    },
    lg: {
      fontSize: responsiveHelpers.getFontSize(24),
      fontWeight: '700',
      lineHeight: responsiveHelpers.getFontSize(32),
      letterSpacing: -0.3,
    },
  },

  // Heading styles
  heading: {
    xxl: {
      fontSize: responsiveHelpers.getFontSize(28),
      fontWeight: '700',
      lineHeight: responsiveHelpers.getFontSize(36),
      letterSpacing: -0.3,
    },
    xl: {
      fontSize: responsiveHelpers.getFontSize(24),
      fontWeight: '600',
      lineHeight: responsiveHelpers.getFontSize(32),
      letterSpacing: -0.3,
    },
    lg: {
      fontSize: responsiveHelpers.getFontSize(20),
      fontWeight: '600',
      lineHeight: responsiveHelpers.getFontSize(28),
      letterSpacing: -0.3,
    },
    md: {
      fontSize: responsiveHelpers.getFontSize(18),
      fontWeight: '600',
      lineHeight: responsiveHelpers.getFontSize(26),
      letterSpacing: -0.2,
    },
    sm: {
      fontSize: responsiveHelpers.getFontSize(16),
      fontWeight: '600',
      lineHeight: responsiveHelpers.getFontSize(24),
      letterSpacing: -0.1,
    },
    xs: {
      fontSize: responsiveHelpers.getFontSize(14),
      fontWeight: '600',
      lineHeight: responsiveHelpers.getFontSize(20),
      letterSpacing: -0.1,
    },
  },

  // Body text styles
  body: {
    xl: {
      fontSize: responsiveHelpers.getFontSize(18),
      fontWeight: '400',
      lineHeight: responsiveHelpers.getFontSize(28),
      letterSpacing: -0.2,
    },
    lg: {
      fontSize: responsiveHelpers.getFontSize(16),
      fontWeight: '400',
      lineHeight: responsiveHelpers.getFontSize(24),
      letterSpacing: -0.1,
    },
    md: {
      fontSize: responsiveHelpers.getFontSize(14),
      fontWeight: '400',
      lineHeight: responsiveHelpers.getFontSize(20),
      letterSpacing: -0.1,
    },
    sm: {
      fontSize: responsiveHelpers.getFontSize(12),
      fontWeight: '400',
      lineHeight: responsiveHelpers.getFontSize(18),
      letterSpacing: 0,
    },
    xs: {
      fontSize: responsiveHelpers.getFontSize(11),
      fontWeight: '400',
      lineHeight: responsiveHelpers.getFontSize(16),
      letterSpacing: 0,
    },
  },

  // Mono (monospace) styles
  mono: {
    lg: {
      fontSize: responsiveHelpers.getFontSize(16),
      fontWeight: '400',
      lineHeight: responsiveHelpers.getFontSize(24),
      fontFamily: 'monospace',
    },
    md: {
      fontSize: responsiveHelpers.getFontSize(14),
      fontWeight: '400',
      lineHeight: responsiveHelpers.getFontSize(20),
      fontFamily: 'monospace',
    },
    sm: {
      fontSize: responsiveHelpers.getFontSize(12),
      fontWeight: '400',
      lineHeight: responsiveHelpers.getFontSize(18),
      fontFamily: 'monospace',
    },
  },

  // Label styles (for form labels, buttons, etc.)
  label: {
    xl: {
      fontSize: responsiveHelpers.getFontSize(16),
      fontWeight: '500',
      lineHeight: responsiveHelpers.getFontSize(24),
      letterSpacing: 0.1,
    },
    lg: {
      fontSize: responsiveHelpers.getFontSize(14),
      fontWeight: '500',
      lineHeight: responsiveHelpers.getFontSize(20),
      letterSpacing: 0.1,
    },
    md: {
      fontSize: responsiveHelpers.getFontSize(12),
      fontWeight: '500',
      lineHeight: responsiveHelpers.getFontSize(16),
      letterSpacing: 0.1,
    },
    sm: {
      fontSize: responsiveHelpers.getFontSize(11),
      fontWeight: '500',
      lineHeight: responsiveHelpers.getFontSize(14),
      letterSpacing: 0.1,
    },
  },

  // Button text styles
  button: {
    xl: {
      fontSize: responsiveHelpers.getFontSize(16),
      fontWeight: '600',
      lineHeight: responsiveHelpers.getFontSize(24),
      letterSpacing: 0.1,
    },
    lg: {
      fontSize: responsiveHelpers.getFontSize(14),
      fontWeight: '600',
      lineHeight: responsiveHelpers.getFontSize(20),
      letterSpacing: 0.1,
    },
    md: {
      fontSize: responsiveHelpers.getFontSize(13),
      fontWeight: '600',
      lineHeight: responsiveHelpers.getFontSize(18),
      letterSpacing: 0.1,
    },
    sm: {
      fontSize: responsiveHelpers.getFontSize(12),
      fontWeight: '600',
      lineHeight: responsiveHelpers.getFontSize(16),
      letterSpacing: 0.1,
    },
  },

  // Utility styles
  utility: {
    uppercase: {
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    lowercase: {
      textTransform: 'lowercase',
    },
    capitalize: {
      textTransform: 'capitalize',
    },
    underline: {
      textDecorationLine: 'underline',
    },
    lineThrough: {
      textDecorationLine: 'line-through',
    },
    italic: {
      fontStyle: 'italic',
    },
  },

  // Weight variants
  weight: {
    light: {
      fontWeight: '300',
    },
    regular: {
      fontWeight: '400',
    },
    medium: {
      fontWeight: '500',
    },
    semibold: {
      fontWeight: '600',
    },
    bold: {
      fontWeight: '700',
    },
    heavy: {
      fontWeight: '800',
    },
    black: {
      fontWeight: '900',
    },
  },

  // Alignment
  alignment: {
    center: {
      textAlign: 'center',
    },
    left: {
      textAlign: 'left',
    },
    right: {
      textAlign: 'right',
    },
    justify: {
      textAlign: 'justify',
    },
  },
};

// Helper function to combine typography styles
export const composeTextStyles = (...styles) => {
  return Object.assign({}, ...styles);
};

// Pre-composed text variants for common use cases
export const textVariants = {
  // Display variants
  displayLarge: composeTextStyles(typography.display.lg, typography.weight.bold),
  displayMedium: composeTextStyles(typography.display.md, typography.weight.semibold),
  displaySmall: composeTextStyles(typography.display.sm, typography.weight.semibold),

  // Heading variants
  heading1: composeTextStyles(typography.heading.xxl, typography.weight.bold),
  heading2: composeTextStyles(typography.heading.xl, typography.weight.semibold),
  heading3: composeTextStyles(typography.heading.lg, typography.weight.semibold),
  heading4: composeTextStyles(typography.heading.md, typography.weight.semibold),
  heading5: composeTextStyles(typography.heading.sm, typography.weight.semibold),
  heading6: composeTextStyles(typography.heading.xs, typography.weight.semibold),

  // Body variants
  bodyLarge: composeTextStyles(typography.body.lg, typography.weight.regular),
  bodyMedium: composeTextStyles(typography.body.md, typography.weight.regular),
  bodySmall: composeTextStyles(typography.body.sm, typography.weight.regular),
  bodyXSmall: composeTextStyles(typography.body.xs, typography.weight.regular),

  // Label variants
  labelLarge: composeTextStyles(typography.label.lg, typography.weight.medium),
  labelMedium: composeTextStyles(typography.label.md, typography.weight.medium),
  labelSmall: composeTextStyles(typography.label.sm, typography.weight.medium),

  // Button variants
  buttonLarge: composeTextStyles(typography.button.lg, typography.weight.semibold),
  buttonMedium: composeTextStyles(typography.button.md, typography.weight.semibold),
  buttonSmall: composeTextStyles(typography.button.sm, typography.weight.semibold),

  // Mono variants
  monoMedium: composeTextStyles(typography.mono.md, typography.weight.regular),
  monoSmall: composeTextStyles(typography.mono.sm, typography.weight.regular),
};

export default typography;
