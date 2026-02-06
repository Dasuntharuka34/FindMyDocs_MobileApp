import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

const Button = ({
  children,
  onPress,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  style,
  textStyle,
  ...props
}) => {
  const { theme } = useTheme();

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: disabled ? theme.colors.border : theme.colors.primary,
          borderColor: 'transparent'
        };
      case 'secondary':
        return {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: disabled ? theme.colors.border : theme.colors.primary
        };
      case 'success':
        return {
          backgroundColor: disabled ? theme.colors.border : theme.colors.success,
          borderColor: 'transparent'
        };
      case 'warning':
        return {
          backgroundColor: disabled ? theme.colors.border : theme.colors.warning,
          borderColor: 'transparent'
        };
      case 'error':
        return {
          backgroundColor: disabled ? theme.colors.border : theme.colors.error,
          borderColor: 'transparent'
        };
      default:
        return {
          backgroundColor: disabled ? theme.colors.border : theme.colors.primary,
          borderColor: 'transparent'
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          paddingVertical: theme.spacing.xs,
          paddingHorizontal: theme.spacing.md,
          borderRadius: theme.borderRadius.md
        };
      case 'large':
        return {
          paddingVertical: theme.spacing.md,
          paddingHorizontal: theme.spacing.xl,
          borderRadius: theme.borderRadius.lg
        };
      case 'medium':
      default:
        return {
          paddingVertical: theme.spacing.sm,
          paddingHorizontal: theme.spacing.lg,
          borderRadius: theme.borderRadius.md
        };
    }
  };

  const getTextColor = () => {
    if (disabled) return theme.colors.textTertiary;
    
    switch (variant) {
      case 'secondary':
        return theme.colors.primary;
      case 'primary':
      case 'success':
      case 'warning':
      case 'error':
      default:
        return theme.colors.textInverse;
    }
  };

  const getTextSize = () => {
    switch (size) {
      case 'small':
        return theme.typography.sm.fontSize;
      case 'large':
        return theme.typography.lg.fontSize;
      case 'medium':
      default:
        return theme.typography.md.fontSize;
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: theme.spacing.sm,
          opacity: disabled ? 0.6 : 1,
          ...getVariantStyles(),
          ...getSizeStyles()
        },
        style
      ]}
      {...props}
    >
      {loading && (
        <ActivityIndicator
          size="small"
          color={getTextColor()}
          style={{ marginRight: theme.spacing.xs }}
        />
      )}
      
      <Text
        style={[
          {
            color: getTextColor(),
            fontSize: getTextSize(),
            fontWeight: '600',
            textAlign: 'center'
          },
          textStyle
        ]}
        numberOfLines={1}
      >
        {children}
      </Text>
    </TouchableOpacity>
  );
};

export default Button;