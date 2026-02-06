import React, { useEffect, useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationsContext';
import { useRequests } from '../../context/RequestsContext';
import { commonStyles, useTheme } from '../../context/ThemeContext';
import { hasAnyRole } from '../../services/auth';

const DashboardScreen = ({ navigation }) => {
  const { user } = useAuth();
  const { excuseRequests, leaveRequests, letters, isLoading: requestsLoading, fetchAllRequests, getPendingCount } = useRequests();
  const { notifications, unreadCount, fetchNotifications } = useNotifications();
  const { theme } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [canApprove, setCanApprove] = useState(false);

  const styles = {
    container: {
      flex: 1,
      backgroundColor: theme.colors.backgroundSecondary,
    },
    content: {
      padding: theme.spacing.lg,
    },
    header: {
      marginBottom: theme.spacing.xl,
      marginTop: theme.spacing.lg,
    },
    welcome: {
      fontSize: theme.typography.xxl.fontSize,
      fontWeight: 'bold',
      color: theme.colors.textPrimary,
      marginBottom: theme.spacing.xs,
    },
    role: {
      fontSize: theme.typography.md.fontSize,
      color: theme.colors.textSecondary,
    },
    statsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.xl,
    },
    statCard: {
      backgroundColor: theme.colors.card,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
      flex: 1,
      minWidth: 80,
      maxWidth: 100,
      alignItems: 'center',
      shadowColor: theme.colors.textPrimary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: theme.isDark ? 0.3 : 0.1,
      shadowRadius: 3,
      elevation: 3,
    },
    statNumber: {
      fontSize: theme.typography.xxl.fontSize,
      fontWeight: 'bold',
      color: theme.colors.primary,
      marginBottom: theme.spacing.xs,
    },
    statLabel: {
      fontSize: theme.typography.sm.fontSize,
      color: theme.colors.textSecondary,
      textAlign: 'center',
    },
    actionButton: {
      backgroundColor: theme.colors.primary,
      padding: theme.spacing.lg,
      borderRadius: theme.borderRadius.lg,
      alignItems: 'center',
      marginBottom: theme.spacing.xl,
      shadowColor: theme.colors.textPrimary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: theme.isDark ? 0.3 : 0.1,
      shadowRadius: 3,
      elevation: 3,
    },
    actionButtonText: {
      color: theme.colors.textInverse,
      fontSize: theme.typography.lg.fontSize,
      fontWeight: '600',
    },
    section: {
      marginBottom: theme.spacing.xl,
    },
    sectionTitle: {
      fontSize: theme.typography.xl.fontSize,
      fontWeight: '600',
      color: theme.colors.textPrimary,
      marginBottom: theme.spacing.md,
    },
    quickAction: {
      backgroundColor: theme.colors.card,
      padding: theme.spacing.lg,
      borderRadius: theme.borderRadius.lg,
      marginBottom: theme.spacing.md,
      shadowColor: theme.colors.textPrimary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: theme.isDark ? 0.3 : 0.1,
      shadowRadius: 3,
      elevation: 3,
    },
    quickActionText: {
      fontSize: theme.typography.md.fontSize,
      color: theme.colors.textPrimary,
      fontWeight: '500',
    },
    quickActionSubtext: {
      fontSize: theme.typography.sm.fontSize,
      color: theme.colors.textSecondary,
      marginTop: theme.spacing.xs,
    },
    notificationBadge: {
      position: 'absolute',
      top: -5,
      right: -5,
      backgroundColor: theme.colors.error,
      borderRadius: 10,
      minWidth: 20,
      height: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
    notificationBadgeText: {
      color: theme.colors.textInverse,
      fontSize: theme.typography.xs.fontSize,
      fontWeight: 'bold',
    },
  };

  useEffect(() => {
    loadData();
    checkApprovalPermissions();
  }, [user]);

  const checkApprovalPermissions = async () => {
    const canApproveRequests = await hasAnyRole(['Lecturer', 'HOD', 'Dean', 'VC']);
    setCanApprove(canApproveRequests);
  };

  const loadData = async () => {
    if (user?._id) {
      await Promise.all([
        fetchAllRequests(user._id),
        fetchNotifications(user._id)
      ]);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const totalRequests = user?.role === 'Student'
    ? excuseRequests.length + letters.length
    : excuseRequests.length + leaveRequests.length + letters.length;
  const pendingCount = getPendingCount();

  if (requestsLoading) {
    return (
      <View style={[commonStyles.container(theme), { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={{ marginTop: theme.spacing.md, color: theme.colors.textSecondary }}>
          Loading dashboard...
        </Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
          />
        }
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.welcome}>Welcome, {user?.name}!</Text>
            <Text style={styles.role}>{user?.role}</Text>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{totalRequests}</Text>
              <Text style={styles.statLabel}>Total Requests</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{pendingCount}</Text>
              <Text style={styles.statLabel}>Pending</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{unreadCount}</Text>
              <Text style={styles.statLabel}>Unread</Text>
            </View>
          </View>

          {user?.role !== 'Admin' && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('NewRequest')}
            >
              <Text style={styles.actionButtonText}>+ New Request</Text>
            </TouchableOpacity>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>

            {user?.role !== 'Admin' && (
              <TouchableOpacity
                style={styles.quickAction}
                onPress={() => navigation.navigate('Requests')}
              >
                <Text style={styles.quickActionText}>View My Requests</Text>
                <Text style={styles.quickActionSubtext}>
                  {totalRequests} total requests • {pendingCount} pending
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.quickAction}
              onPress={() => navigation.navigate('Notifications')}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={styles.quickActionText}>Notifications</Text>
                {unreadCount > 0 && (
                  <View style={styles.notificationBadge}>
                    <Text style={styles.notificationBadgeText}>{unreadCount}</Text>
                  </View>
                )}
              </View>
              <Text style={styles.quickActionSubtext}>
                {notifications.length} notifications • {unreadCount} unread
              </Text>
            </TouchableOpacity>

            {canApprove && (
              <TouchableOpacity
                style={styles.quickAction}
                onPress={() => navigation.navigate('Approvals')}
              >
                <Text style={styles.quickActionText}>Pending Approvals</Text>
                <Text style={styles.quickActionSubtext}>
                  Review and approve pending requests
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.quickAction}
              onPress={() => navigation.navigate('Profile')}
            >
              <Text style={styles.quickActionText}>My Profile</Text>
              <Text style={styles.quickActionSubtext}>
                Update your account information
              </Text>
            </TouchableOpacity>


          </View>

          {user?.role !== 'Admin' && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Recent Activity</Text>

              {totalRequests === 0 ? (
                <View style={styles.quickAction}>
                  <Text style={styles.quickActionText}>No requests yet</Text>
                  <Text style={styles.quickActionSubtext}>
                    Create your first request to get started
                  </Text>
                </View>
              ) : (
                <>
                  {excuseRequests.slice(0, 2).map((request) => (
                    <TouchableOpacity
                      key={`excuse-${request._id}`}
                      style={styles.quickAction}
                      onPress={() => navigation.navigate('RequestDetail', {
                        id: request._id,
                        type: 'excuse'
                      })}
                    >
                      <Text style={styles.quickActionText}>Excuse: {request.reason}</Text>
                      <Text style={styles.quickActionSubtext}>
                        Status: {request.status} • {new Date(request.submittedDate).toLocaleDateString()}
                      </Text>
                    </TouchableOpacity>
                  ))}

                  {user?.role !== 'Student' && leaveRequests.slice(0, 2).map((request) => (
                    <TouchableOpacity
                      key={`leave-${request._id}`}
                      style={styles.quickAction}
                      onPress={() => navigation.navigate('RequestDetail', {
                        id: request._id,
                        type: 'leave'
                      })}
                    >
                      <Text style={styles.quickActionText}>Leave: {request.reason}</Text>
                      <Text style={styles.quickActionSubtext}>
                        Status: {request.status} • {new Date(request.submittedDate).toLocaleDateString()}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </>
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default DashboardScreen;
