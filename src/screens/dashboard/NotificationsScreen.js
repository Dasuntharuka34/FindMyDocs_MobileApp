import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, KeyboardAvoidingView, Platform, RefreshControl, Text, TouchableOpacity, View } from 'react-native';
import NotificationItem from '../../components/NotificationItem';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationsContext';
import { commonStyles, useTheme } from '../../context/ThemeContext';

const NotificationsScreen = () => {
  const { user } = useAuth();
  const { notifications, unreadCount, isLoading, fetchNotifications, markAllAsRead, deleteAllUserNotifications } = useNotifications();
  const { theme } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (user?._id) {
      fetchNotifications(user._id);
    }
  }, [user?._id]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchNotifications(user._id);
    setRefreshing(false);
  };

  const handleMarkAllRead = async () => {
    await markAllAsRead(user._id);
  };

  const handleDeleteAll = async () => {
    Alert.alert(
      'Delete All Notifications',
      'Are you sure you want to delete all notifications? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete All',
          style: 'destructive',
          onPress: async () => {
            await deleteAllUserNotifications(user._id);
          }
        }
      ]
    );
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.read;
    if (filter === 'read') return notification.read;
    return true;
  });

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
    actionContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.md,
    },
    actionButton: {
      ...commonStyles.button(theme, 'secondary'),
      padding: theme.spacing.sm,
      flex: 1,
      marginHorizontal: theme.spacing.xs,
    },
    actionButtonText: {
      ...commonStyles.buttonText(theme, 'secondary'),
      fontSize: theme.typography.sm.fontSize,
    },
    filterContainer: {
      flexDirection: 'row',
      marginBottom: theme.spacing.md,
      backgroundColor: theme.colors.backgroundSecondary,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.xs,
    },
    filter: {
      flex: 1,
      padding: theme.spacing.sm,
      alignItems: 'center',
      borderRadius: theme.borderRadius.sm,
    },
    activeFilter: {
      backgroundColor: theme.colors.primary,
    },
    filterText: {
      ...commonStyles.text(theme, 'secondary', 'sm'),
      fontWeight: '500',
    },
    activeFilterText: {
      color: theme.colors.textInverse,
    },
    countText: {
      ...commonStyles.text(theme, 'tertiary', 'sm'),
      marginBottom: theme.spacing.md,
      textAlign: 'center',
    },
    emptyContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: theme.spacing.xl,
    },
    emptyText: {
      ...commonStyles.text(theme, 'secondary', 'md'),
      textAlign: 'center',
    },
  };

  if (isLoading && !refreshing) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Text style={styles.header}>Notifications</Text>

      <View style={styles.actionContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleMarkAllRead}
          disabled={unreadCount === 0}
        >
          <Text style={styles.actionButtonText}>
            Mark All Read
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: theme.colors.error }]}
          onPress={handleDeleteAll}
          disabled={notifications.length === 0}
        >
          <Text style={[styles.actionButtonText, { color: theme.colors.textInverse }]}>
            Delete All
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.filterContainer}>
        {['all', 'unread', 'read'].map((filterType) => (
          <TouchableOpacity
            key={filterType}
            style={[
              styles.filter,
              filter === filterType && styles.activeFilter
            ]}
            onPress={() => setFilter(filterType)}
          >
            <Text style={[
              styles.filterText,
              filter === filterType && styles.activeFilterText
            ]}>
              {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.countText}>
        {filteredNotifications.length} notifications • {unreadCount} unread
      </Text>

      <FlatList
        data={filteredNotifications}
        renderItem={({ item }) => <NotificationItem notification={item} />}
        keyExtractor={(item) => item._id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No {filter === 'all' ? '' : filter + ' '}notifications
            </Text>
          </View>
        }
      />
    </KeyboardAvoidingView>
  );
};

export default NotificationsScreen;