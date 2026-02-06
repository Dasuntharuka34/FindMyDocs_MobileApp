// src/styles/GlobalStyles.js

import { StyleSheet } from 'react-native';
import { typography, textVariants } from './themes/typography';

// Global spacing scale
export const spacing = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

// Border radius scale
export const borderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 24,
  full: 9999,
};

// Border widths
export const borderWidth = {
  none: 0,
  hairline: 0.5,
  thin: 1,
  medium: 2,
  thick: 3,
};

// Opacity values
export const opacity = {
  transparent: 0,
  subtle: 0.1,
  light: 0.3,
  medium: 0.5,
  strong: 0.7,
  solid: 1,
};

// Elevation shadows (for Android and iOS)
export const elevation = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  xs: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sm: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  xl: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
  },
};

// Z-index scale
export const zIndex = {
  hide: -1,
  auto: 'auto',
  base: 0,
  docked: 10,
  dropdown: 1000,
  sticky: 1100,
  banner: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  skipLink: 1600,
  toast: 1700,
  tooltip: 1800,
};

// Global stylesheet
const GlobalStyles = StyleSheet.create({
  // Layout styles
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  containerPadding: {
    padding: spacing.md,
  },
  containerPaddingHorizontal: {
    paddingHorizontal: spacing.md,
  },
  containerPaddingVertical: {
    paddingVertical: spacing.md,
  },

  // Flexbox utilities
  flex: {
    flex: 1,
  },
  flexRow: {
    flexDirection: 'row',
  },
  flexColumn: {
    flexDirection: 'column',
  },
  flexWrap: {
    flexWrap: 'wrap',
  },
  flexNoWrap: {
    flexWrap: 'nowrap',
  },
  flexGrow: {
    flexGrow: 1,
  },
  flexShrink: {
    flexShrink: 1,
  },
  flexNone: {
    flex: 0,
  },

  // Alignment utilities
  itemsStart: {
    alignItems: 'flex-start',
  },
  itemsCenter: {
    alignItems: 'center',
  },
  itemsEnd: {
    alignItems: 'flex-end',
  },
  itemsStretch: {
    alignItems: 'stretch',
  },
  itemsBaseline: {
    alignItems: 'baseline',
  },

  justifyStart: {
    justifyContent: 'flex-start',
  },
  justifyCenter: {
    justifyContent: 'center',
  },
  justifyEnd: {
    justifyContent: 'flex-end',
  },
  justifyBetween: {
    justifyContent: 'space-between',
  },
  justifyAround: {
    justifyContent: 'space-around',
  },
  justifyEvenly: {
    justifyContent: 'space-evenly',
  },

  selfStart: {
    alignSelf: 'flex-start',
  },
  selfCenter: {
    alignSelf: 'center',
  },
  selfEnd: {
    alignSelf: 'flex-end',
  },
  selfStretch: {
    alignSelf: 'stretch',
  },
  selfAuto: {
    alignSelf: 'auto',
  },

  // Position utilities
  relative: {
    position: 'relative',
  },
  absolute: {
    position: 'absolute',
  },
  absoluteFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  // Sizing utilities
  wFull: {
    width: '100%',
  },
  hFull: {
    height: '100%',
  },
  minWFull: {
    minWidth: '100%',
  },
  minHFull: {
    minHeight: '100%',
  },
  maxWFull: {
    maxWidth: '100%',
  },
  maxHFull: {
    maxHeight: '100%',
  },

  // Spacing utilities
  pXs: { padding: spacing.xs },
  pSm: { padding: spacing.sm },
  pMd: { padding: spacing.md },
  pLg: { padding: spacing.lg },
  pXl: { padding: spacing.xl },

  pxXs: { paddingHorizontal: spacing.xs },
  pxSm: { paddingHorizontal: spacing.sm },
  pxMd: { paddingHorizontal: spacing.md },
  pxLg: { paddingHorizontal: spacing.lg },
  pxXl: { paddingHorizontal: spacing.xl },

  pyXs: { paddingVertical: spacing.xs },
  pySm: { paddingVertical: spacing.sm },
  pyMd: { paddingVertical: spacing.md },
  pyLg: { paddingVertical: spacing.lg },
  pyXl: { paddingVertical: spacing.xl },

  mXs: { margin: spacing.xs },
  mSm: { margin: spacing.sm },
  mMd: { margin: spacing.md },
  mLg: { margin: spacing.lg },
  mXl: { margin: spacing.xl },

  mxXs: { marginHorizontal: spacing.xs },
  mxSm: { marginHorizontal: spacing.sm },
  mxMd: { marginHorizontal: spacing.md },
  mxLg: { marginHorizontal: spacing.lg },
  mxXl: { marginHorizontal: spacing.xl },

  myXs: { marginVertical: spacing.xs },
  mySm: { marginVertical: spacing.sm },
  myMd: { marginVertical: spacing.md },
  myLg: { marginVertical: spacing.lg },
  myXl: { marginVertical: spacing.xl },

  // Border radius utilities
  roundedSm: { borderRadius: borderRadius.sm },
  roundedMd: { borderRadius: borderRadius.md },
  roundedLg: { borderRadius: borderRadius.lg },
  roundedXl: { borderRadius: borderRadius.xl },
  roundedFull: { borderRadius: borderRadius.full },

  // Border width utilities
  borderNone: { borderWidth: borderWidth.none },
  borderHairline: { borderWidth: borderWidth.hairline },
  borderThin: { borderWidth: borderWidth.thin },
  borderMedium: { borderWidth: borderWidth.medium },
  borderThick: { borderWidth: borderWidth.thick },

  // Overflow utilities
  overflowVisible: { overflow: 'visible' },
  overflowHidden: { overflow: 'hidden' },
  overflowScroll: { overflow: 'scroll' },

  // Text utilities
  textLeft: { textAlign: 'left' },
  textCenter: { textAlign: 'center' },
  textRight: { textAlign: 'right' },
  textJustify: { textAlign: 'justify' },

  textUppercase: { textTransform: 'uppercase' },
  textLowercase: { textTransform: 'lowercase' },
  textCapitalize: { textTransform: 'capitalize' },
  textNone: { textTransform: 'none' },

  textUnderline: { textDecorationLine: 'underline' },
  textLineThrough: { textDecorationLine: 'line-through' },
  textNoUnderline: { textDecorationLine: 'none' },

  // Opacity utilities
  opacitySubtle: { opacity: opacity.subtle },
  opacityLight: { opacity: opacity.light },
  opacityMedium: { opacity: opacity.medium },
  opacityStrong: { opacity: opacity.strong },
  opacitySolid: { opacity: opacity.solid },

  // Elevation utilities
  elevationNone: elevation.none,
  elevationXs: elevation.xs,
  elevationSm: elevation.sm,
  elevationMd: elevation.md,
  elevationLg: elevation.lg,
  elevationXl: elevation.xl,

  // Common component styles
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.md,
    padding: spacing.md,
    ...elevation.xs,
  },

  cardElevated: {
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.md,
    padding: spacing.md,
    ...elevation.md,
  },

  input: {
    borderWidth: borderWidth.thin,
    borderColor: '#E5E7EB',
    borderRadius: borderRadius.md,
    padding: spacing.md,
    backgroundColor: '#FFFFFF',
    ...typography.body.md,
  },

  button: {
    backgroundColor: '#4361EE',
    borderRadius: borderRadius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonText: {
    ...textVariants.buttonMedium,
    color: '#FFFFFF',
  },

  // Utility classes for quick prototyping
  hidden: {
    display: 'none',
  },
  visible: {
    display: 'flex',
  },
  absoluteTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  absoluteBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  absoluteLeft: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
  },
  absoluteRight: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
  },
});

// Export everything
export {
  typography,
  textVariants,
};

export default GlobalStyles;