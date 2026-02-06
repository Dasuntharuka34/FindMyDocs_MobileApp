import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, RefreshControl, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { commonStyles, useTheme } from '../../context/ThemeContext';
import {
  approveExcuseRequest,
  approveLeaveRequest,
  getPendingExcuseApprovals,
  getPendingLeaveApprovals,
  getPendingLetterApprovals,
  getAllPendingRequests,
  rejectExcuseRequest,
  rejectLeaveRequest,
  updateLetterStatus
} from '../../services/api';

const ApprovalQueueScreen = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [excuseRequests, setExcuseRequests] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [letters, setLetters] = useState([]);
  const [selectedTab, setSelectedTab] = useState('all');
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAllPendingApprovals = async () => {
    try {
      setIsLoading(true);

      if (user?.role === 'Admin') {
        const allPendingData = await getAllPendingRequests();
        setExcuseRequests(allPendingData.filter(req => req.type === 'excuse') || []);
        setLeaveRequests(allPendingData.filter(req => req.type === 'leave') || []);
        setLetters(allPendingData.filter(req => req.type === 'letter') || []);
      } else {
        // For other approvers, fetch all pending approvals by status names
        const pendingStatuses = [
          'Pending Lecturer Approval',
          'Pending HOD Approval',
          'Pending Dean Approval',
          'Pending VC Approval'
        ];

        const excusePromises = pendingStatuses.map(status =>
          getPendingExcuseApprovals(status).catch(() => [])
        );
        const leavePromises = pendingStatuses.map(status =>
          getPendingLeaveApprovals(status).catch(() => [])
        );
        const letterPromises = pendingStatuses.map(status =>
          getPendingLetterApprovals(status).catch(() => [])
        );

        const [excuseResults, leaveResults, letterResults] = await Promise.all([
          Promise.all(excusePromises),
          Promise.all(leavePromises),
          Promise.all(letterPromises)
        ]);

        // Flatten the results
        const excuseData = excuseResults.flat();
        const leaveData = leaveResults.flat();
        const letterData = letterResults.flat();

        setExcuseRequests(excuseData || []);
        setLeaveRequests(leaveData || []);
        setLetters(letterData || []);
      }
    } catch (error) {
      console.error('Error fetching pending approvals:', error);
      Alert.alert('Error', 'Failed to load pending approvals');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?._id) {
      fetchAllPendingApprovals();
    }
  }, [user?._id]);

  useEffect(() => {
    filterRequests();
  }, [selectedTab, excuseRequests, leaveRequests, letters]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAllPendingApprovals();
    setRefreshing(false);
  };

  const filterRequests = () => {
    let requests = [];

    if (selectedTab === 'all' || selectedTab === 'excuse') {
      requests = [...requests, ...excuseRequests.map(req => ({ ...req, type: 'excuse' }))];
    }

    if (selectedTab === 'all' || selectedTab === 'leave') {
      requests = [...requests, ...leaveRequests.map(req => ({ ...req, type: 'leave' }))];
    }

    if (selectedTab === 'all' || selectedTab === 'letter') {
      requests = [...requests, ...letters.map(req => ({ ...req, type: 'letter' }))];
    }

    // Filter pending approvals based on user role
    const pendingRequests = requests.filter(request => {
      const isPending = request.status !== 'Approved' && request.status !== 'Rejected';
      const canApprove = canUserApprove(request);
      return isPending && canApprove;
    });

    setFilteredRequests(pendingRequests);
  };

  const canUserApprove = (request) => {
    if (user?.role === 'Admin') return false;
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

  const handleApprove = async (request) => {
    try {
      const approvalData = {
        approverRole: user.role,
        approverId: user._id,
        approverName: user.name,
        comment: 'Approved'
      };

      let result;
      switch (request.type) {
        case 'excuse':
          result = await approveExcuseRequest(request._id, approvalData);
          break;
        case 'leave':
          result = await approveLeaveRequest(request._id, approvalData);
          break;
        case 'letter':
          result = await updateLetterStatus(request._id, {
            status: 'Approved',
            currentStageIndex: request.currentStageIndex + 1,
            approver: user.name,
            approverRole: user.role
          });
          break;
        default:
          throw new Error('Invalid request type');
      }

      Alert.alert('Success', 'Request approved successfully');
      fetchAllPendingApprovals();
    } catch (err) {
      console.error('Error approving request:', err);
      Alert.alert('Error', 'Failed to approve request');
    }
  };

  const handleReject = async (request) => {
    try {
      const rejectionData = {
        approverRole: user.role,
        approverId: user._id,
        approverName: user.name,
        comment: 'Rejected'
      };

      let result;
      switch (request.type) {
        case 'excuse':
          result = await rejectExcuseRequest(request._id, rejectionData);
          break;
        case 'leave':
          result = await rejectLeaveRequest(request._id, rejectionData);
          break;
        case 'letter':
          result = await updateLetterStatus(request._id, {
            status: 'Rejected',
            rejectionReason: 'Rejected by admin',
            approver: user.name,
            approverRole: user.role
          });
          break;
        default:
          throw new Error('Invalid request type');
      }

      Alert.alert('Success', 'Request rejected');
      fetchAllPendingApprovals();
    } catch (err) {
      console.error('Error rejecting request:', err);
      Alert.alert('Error', 'Failed to reject request');
    }
  };

  const goToRequestApproval = (request) => {
    navigation.navigate('RequestApprovalScreen', {
      requestId: request._id,
      requestType: request.type,
      request: request,
    });
  };

  const viewRequestDetails = (request) => {
    // Navigate to a detailed view screen or show modal with request details
    if (!request._id || !request.type) {
      Alert.alert('Error', 'Invalid request data for viewing details');
      return;
    }
    navigation.navigate('RequestDetailScreen', {
      requestId: request._id,
      requestType: request.type,
      request: request,
    });
  };

  const viewAuditLog = (request) => {
    // Navigate to the audit log screen for the given request
    navigation.navigate('AuditLogScreen', {
      requestId: request._id,
      requestType: request.type,
      request: request,
    });
  };

  const renderRequestItem = ({ item }) => (
    <View style={[commonStyles.card(theme), { marginBottom: theme.spacing.md }]}>
      <View style={{ flex: 1 }}>
        <Text style={commonStyles.text(theme, 'primary', 'md')}>{item.studentName || item.name}</Text>
        <Text style={commonStyles.text(theme, 'secondary', 'sm')}>
          {item.type === 'excuse' ? 'Excuse Request' :
            item.type === 'leave' ? 'Leave Request' : 'Letter Request'}
        </Text>
        <Text style={commonStyles.text(theme, 'secondary', 'sm')}>
          Submitted: {new Date(item.submittedAt).toLocaleDateString()}
        </Text>
        <Text style={commonStyles.text(theme, 'secondary', 'sm')}>
          Status: {item.status}
        </Text>
        {item.reason && (
          <Text style={commonStyles.text(theme, 'secondary', 'sm')}>
            Reason: {item.reason}
          </Text>
        )}
      </View>

      <View style={{ flexDirection: 'row', gap: 8, marginTop: theme.spacing.md }}>
        <TouchableOpacity
          onPress={() => viewRequestDetails(item)}
          style={[commonStyles.button(theme, 'secondary'), { padding: theme.spacing.sm, flex: 1 }]}
        >
          <Text style={commonStyles.buttonText(theme, 'secondary')}>View Details</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => viewAuditLog(item)}
          style={[commonStyles.button(theme, 'info'), { padding: theme.spacing.sm }]}
        >
          <Text style={commonStyles.buttonText(theme, 'info')}>Audit Log</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'excuse', label: 'Excuse' },
    { id: 'leave', label: 'Leave' },
    { id: 'letter', label: 'Letters' }
  ];

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
    countText: {
      ...commonStyles.text(theme, 'secondary', 'md'),
      textAlign: 'center',
      marginBottom: theme.spacing.md,
    },
    tabContainer: {
      flexDirection: 'row',
      marginBottom: theme.spacing.md,
      backgroundColor: theme.colors.backgroundSecondary,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.xs,
    },
    tabButton: {
      flex: 1,
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.sm,
      alignItems: 'center',
    },
    tabButtonActive: {
      backgroundColor: theme.colors.primary,
    },
    tabText: {
      ...commonStyles.text(theme, 'secondary', 'sm'),
      fontWeight: '500',
    },
    tabTextActive: {
      ...commonStyles.text(theme, 'textInverse', 'sm'),
      fontWeight: '600',
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

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Approval Queue</Text>

      <Text style={styles.countText}>
        {filteredRequests.length} pending approvals
      </Text>

      <View style={styles.tabContainer}>
        {tabs.map(tab => (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.tabButton,
              selectedTab === tab.id && styles.tabButtonActive
            ]}
            onPress={() => setSelectedTab(tab.id)}
          >
            <Text style={[
              styles.tabText,
              selectedTab === tab.id && styles.tabTextActive
            ]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredRequests}
        keyExtractor={item => `${item.type}-${item._id}`}
        renderItem={renderRequestItem}
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
              No pending approvals found
            </Text>
          </View>
        }
        contentContainerStyle={{ paddingBottom: theme.spacing.xl }}
      />
    </View>
  );
};

export default ApprovalQueueScreen;
