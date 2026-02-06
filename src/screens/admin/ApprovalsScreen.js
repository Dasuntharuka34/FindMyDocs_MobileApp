import React, { useEffect, useMemo } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useRequests } from '../../context/RequestsContext';
import { useAuth } from '../../context/AuthContext';
import { useTheme, commonStyles } from '../../context/ThemeContext';
import RequestItem from '../../components/RequestItem';

const ApprovalsScreen = ({ navigation }) => {
  const { pendingApprovals, fetchPendingApprovals, isLoading, error, clearError } = useRequests();
  const { user } = useAuth();
  const { theme } = useTheme();

  useEffect(() => {
    fetchPendingApprovals();
  }, []);

  // Refresh data when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      fetchPendingApprovals();
      return () => {
        // Cleanup if needed
        clearError();
      };
    }, [])
  );

  const filteredApprovals = useMemo(() => {
    if (!user || !user.role || !pendingApprovals) {
      return [];
    }
    // The status message is like "Pending HOD Approval"
    // We check if the user's role is part of this status string.
    return pendingApprovals.filter(req => req.status && req.status.includes(user.role));
  }, [pendingApprovals, user]);

  const handleRequestPress = (request) => {
    // We need to determine the request type to navigate correctly
    // This assumes the API returns a 'type' or similar field.
    // If not, we might need to infer it.
    const requestType = request.type || (request.absences ? 'excuse' : (request.startDate ? 'leave' : 'letter'));

    navigation.navigate('RequestApproval', {
      request: request,
      requestType: requestType,
      requestId: request._id
    });
  };

  const styles = {
    container: {
      ...commonStyles.container(theme),
      padding: theme.spacing.md,
    },
    header: {
      ...commonStyles.text(theme, 'primary', 'xl'),
      fontWeight: 'bold',
      marginBottom: theme.spacing.md,
      marginTop: theme.spacing.lg,
      textAlign: 'center',
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing.xl,
    },
    emptyText: {
      ...commonStyles.text(theme, 'secondary', 'md'),
      textAlign: 'center',
    },
    errorContainer: {
      backgroundColor: theme.colors.errorBackground || '#ffebee',
      borderColor: theme.colors.error || '#f44336',
      borderWidth: 1,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.md,
    },
    errorText: {
      color: theme.colors.error || '#f44336',
      fontSize: theme.typography.md.fontSize,
      textAlign: 'center',
    },
    retryButton: {
      ...commonStyles.button(theme),
      backgroundColor: theme.colors.primary,
      marginTop: theme.spacing.sm,
      alignSelf: 'center',
      paddingHorizontal: theme.spacing.lg,
    },
    retryButtonText: {
      ...commonStyles.buttonText(theme),
      color: theme.colors.textInverse,
    },
  };

  if (isLoading && !pendingApprovals.length) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Pending Your Approval</Text>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => {
              clearError();
              fetchPendingApprovals();
            }}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={filteredApprovals}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <RequestItem
            request={item}
            type={item.type}
            onPress={() => handleRequestPress(item)}
          />
        )}

        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No requests are currently waiting for your approval.</Text>
          </View>
        }
        refreshing={isLoading}
        onRefresh={fetchPendingApprovals}
      />
    </View>
  );
};

export default ApprovalsScreen;
