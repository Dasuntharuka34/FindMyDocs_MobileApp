import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { useRequests } from '../../context/RequestsContext';
import { commonStyles, useTheme } from '../../context/ThemeContext';
import { getPendingRegistrations, getUsers } from '../../services/api';

const AdminDashboardScreen = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const navigation = useNavigation();
  const { excuseRequests, leaveRequests, letters, fetchAllRequests } = useRequests();

  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingRegistrations: 0,
    pendingApprovals: 0,
    totalRequests: 0
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Load users
      const usersData = await getUsers();
      const totalUsers = usersData.length;

      // Load pending registrations
      const pendingRegs = await getPendingRegistrations();
      const pendingRegistrations = pendingRegs.length;

      // Load requests for pending approvals
      if (user?._id) {
        await fetchAllRequests(user._id);
      }

      // Calculate pending approvals
      const allRequests = [
        ...excuseRequests.map(r => ({ ...r, type: 'excuse' })),
        ...leaveRequests.map(r => ({ ...r, type: 'leave' })),
        ...letters.map(r => ({ ...r, type: 'letter' }))
      ];

      const pendingApprovals = allRequests.filter(request => {
        const isPending = request.status !== 'Approved' && request.status !== 'Rejected';
        const canApprove = canUserApprove(request);
        return isPending && canApprove;
      }).length;

      const approvedRequests = allRequests.filter(request => request.status === 'Approved').length;
      const totalRequests = allRequests.length;

      setStats({
        totalUsers,
        pendingRegistrations,
        pendingApprovals,
        approvedRequests,
        totalRequests
      });

    } catch (error) {
      console.error('Error loading dashboard data:', error);
      Alert.alert('Error', 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const canUserApprove = (request) => {
    const currentStage = request.currentStageIndex;
    const requiredRole = getRequiredRoleForStage(currentStage);
    return user?.role === requiredRole;
  };

  const getRequiredRoleForStage = (stageIndex) => {
    const stages = [
      null, // Submitted
      'Lecturer',
      'HOD',
      'Dean',
      'VC'
    ];
    return stages[stageIndex];
  };

  const quickActions = [
    {
      id: 'users',
      title: 'Manage Users',
      subtitle: `${stats.totalUsers} total users`,
      icon: '👥',
      color: 'primary',
      screen: 'UserManagement'
    },
    {
      id: 'registrations',
      title: 'Registration Requests',
      subtitle: `${stats.pendingRegistrations} pending`,
      icon: '📋',
      color: 'warning',
      screen: 'RegistrationRequests'
    },
    {
      id: 'requests',
      title: 'All Requests',
      subtitle: `${stats.totalRequests} total requests`,
      icon: '📄',
      color: 'info',
      screen: 'AllRequests'
    }
  ];

  const renderQuickAction = ({ item }) => (
    <TouchableOpacity
      style={[commonStyles.card(theme), { marginBottom: theme.spacing.md }]}
      onPress={() => {
        if (item.screen === 'ApprovalQueue') {
          navigation.navigate('ApprovalQueue');
        } else if (item.screen === 'AllRequests') {
          navigation.navigate('AllRequests');
        } else {
          navigation.navigate(item.screen);
        }
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text style={{ fontSize: 24, marginRight: theme.spacing.md }}>{item.icon}</Text>
        <View style={{ flex: 1 }}>
          <Text style={commonStyles.text(theme, 'primary', 'md')}>{item.title}</Text>
          <Text style={commonStyles.text(theme, 'secondary', 'sm')}>{item.subtitle}</Text>
        </View>
        <TouchableOpacity
          style={[commonStyles.button(theme, item.color), { padding: theme.spacing.sm }]}
        >
          <Text style={commonStyles.buttonText(theme, item.color)}>View</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const styles = {
    container: {
      ...commonStyles.container(theme),
      paddingTop: theme.spacing.xl,
      paddingLeft: theme.spacing.md,
      paddingRight: theme.spacing.md,
      paddingBottom: theme.spacing.xxl,
    },
    header: {
      ...commonStyles.text(theme, 'primary', 'xl'),
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: theme.spacing.lg,
    },
    welcomeText: {
      ...commonStyles.text(theme, 'secondary', 'md'),
      textAlign: 'center',
      marginBottom: theme.spacing.xl,
    },
    statsContainer: {
      marginBottom: theme.spacing.xl,
    },
    statsTitle: {
      ...commonStyles.text(theme, 'primary', 'lg'),
      fontWeight: '600',
      marginBottom: theme.spacing.md,
    },
    statsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.md,
    },
    statCard: {
      flex: 1,
      minWidth: 120,
      maxWidth: 180,
      backgroundColor: theme.colors.backgroundSecondary,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      alignItems: 'center',
    },
    statNumber: {
      ...commonStyles.text(theme, 'primary', 'xl'),
      fontWeight: 'bold',
      marginBottom: theme.spacing.xs,
    },
    statLabel: {
      ...commonStyles.text(theme, 'secondary', 'sm'),
      textAlign: 'center',
    },
    actionsTitle: {
      ...commonStyles.text(theme, 'primary', 'lg'),
      fontWeight: '600',
      marginBottom: theme.spacing.md,
    },
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
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
      <Text style={styles.header}>Admin Dashboard</Text>

      <Text style={styles.welcomeText}>
        Welcome back, {user?.name}!
      </Text>

      <View style={styles.statsContainer}>
        <Text style={styles.statsTitle}>System Overview</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.totalUsers}</Text>
            <Text style={styles.statLabel}>Total Users</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.pendingRegistrations}</Text>
            <Text style={styles.statLabel}>Pending Registrations</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.approvedRequests}</Text>
            <Text style={styles.statLabel}>Approved Requests</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.totalRequests}</Text>
            <Text style={styles.statLabel}>Total Requests</Text>
          </View>
        </View>
      </View>

      <Text style={styles.actionsTitle}>Quick Actions</Text>
      <FlatList
        data={quickActions}
        renderItem={renderQuickAction}
        keyExtractor={item => item.id}
        scrollEnabled={false}
        contentContainerStyle={{ paddingBottom: theme.spacing.xl }}
      />
    </ScrollView>
  );
};

export default AdminDashboardScreen;
