import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import { useTheme } from '../../context/ThemeContext';

const AttachmentViewerScreen = ({ route }) => {
  const { uri } = route.params;
  const { theme } = useTheme();

  const renderLoading = () => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
      <Text style={{ marginTop: theme.spacing.md, color: theme.colors.textSecondary }}>Loading Attachment...</Text>
    </View>
  );

  const renderError = (errorDomain, errorCode, errorDesc) => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
      <Text style={{ color: theme.colors.error, marginBottom: theme.spacing.md, fontWeight: 'bold' }}>
        Failed to load attachment
      </Text>
      <Text style={{ color: theme.colors.textSecondary, textAlign: 'center', paddingHorizontal: theme.spacing.lg }}>
        {errorDesc || 'An unknown error occurred.'}
      </Text>
    </View>
  );

  return (
    <WebView
      source={{ uri }}
      style={{ flex: 1 }}
      startInLoadingState={true}
      renderLoading={renderLoading}
      renderError={renderError}
      onError={(syntheticEvent) => {
        const { nativeEvent } = syntheticEvent;
        console.warn('WebView error: ', nativeEvent);
      }}
    />
  );
};

export default AttachmentViewerScreen;
