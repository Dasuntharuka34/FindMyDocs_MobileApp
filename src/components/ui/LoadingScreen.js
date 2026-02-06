import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

const LoadingScreen = ({ message = 'Loading...' }) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
      <Text style={[styles.message, { color: theme.colors.text }]}>
        {message}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '500',
  },
});

export default LoadingScreen;
