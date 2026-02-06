import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

const Card = ({
  children,
  onPress,
  style,
  containerStyle,
  elevated = true,
  ...props
}) => {
  const { theme } = useTheme();

  const CardComponent = onPress ? TouchableOpacity : View;

  return (
    <CardComponent
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.card,
          borderRadius: theme.borderRadius.lg,
          ...(elevated && {
            shadowColor: theme.colors.textPrimary,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: theme.isDark ? 0.3 : 0.1,
            shadowRadius: 3,
            elevation: 3,
          }),
        },
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
      {...props}
    >
      <View style={[styles.content, containerStyle]}>
        {children}
      </View>
    </CardComponent>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    overflow: 'hidden',
  },
  content: {
    padding: 16,
  },
});

export default Card;