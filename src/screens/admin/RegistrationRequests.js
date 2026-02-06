import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Modal, RefreshControl, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { commonStyles, useTheme } from '../../context/ThemeContext';
import { approveRegistration, getPendingRegistrations, rejectRegistration } from '../../services/api';

const RegistrationRequests = () => {
  const { theme } = useTheme();

  const [registrations, setRegistrations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Modal states
  const [viewingRegistration, setViewingRegistration] = useState(null);
  const [confirmationRequest, setConfirmationRequest] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const loadPendingRegistrations = async () => {
    try {
      const data = await getPendingRegistrations();
      setRegistrations(data);
    } catch (err) {
      console.error("Error loading registrations:", err);
      Alert.alert('Error', 'Failed to load pending registrations');
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await loadPendingRegistrations();
      setIsLoading(false);
    };
    loadData();
  }, []);



  const onRefresh = async () => {
    setRefreshing(true);
    await loadPendingRegistrations();
    setRefreshing(false);
  };

  const handleRegistrationAction = async (registrationId, action, reason = '') => {
    try {
      let response;
      if (action === 'approve') {
        response = await approveRegistration(registrationId);
      } else if (action === 'reject') {
        if (reason.trim() === '') {
          Alert.alert('Input Required', 'Please provide a reason for rejection.');
          return;
        }
        response = await rejectRegistration(registrationId, { reason });
      } else {
        return;
      }

      if (response.message) {
        Alert.alert('Success', response.message);
        loadPendingRegistrations();
      } else {
        Alert.alert('Error', `Failed to ${action} registration.`);
      }

      setConfirmationRequest(null);
      setConfirmAction(null);
      setRejectionReason('');

    } catch (error) {
      console.error(`Error handling registration ${action}:`, error);
      Alert.alert('Error', `Network error during ${action} registration.`);
    }
  };

  const openViewingModal = (reg) => {
    setViewingRegistration(reg);
  };

  const openConfirmationModal = (req, action) => {
    setConfirmationRequest(req);
    setConfirmAction(action);
    setViewingRegistration(null);
  };

  const renderRegistrationItem = ({ item }) => (
    <View style={[commonStyles.card(theme), { marginBottom: theme.spacing.md }]}>
      <View style={{ flex: 1 }}>
        <Text style={commonStyles.text(theme, 'primary', 'md')}>{item.name}</Text>
        <Text style={commonStyles.text(theme, 'secondary', 'sm')}>{item.email}</Text>
        <Text style={commonStyles.text(theme, 'secondary', 'sm')}>Role: {item.role}</Text>
        <Text style={commonStyles.text(theme, 'secondary', 'sm')}>
          Submitted: {new Date(item.submittedAt).toLocaleDateString()}
        </Text>
        {item.department && (
          <Text style={commonStyles.text(theme, 'secondary', 'sm')}>Dept: {item.department}</Text>
        )}
      </View>

      <View style={{ flexDirection: 'row', gap: 8, marginTop: theme.spacing.md }}>
        <TouchableOpacity
          onPress={() => openViewingModal(item)}
          style={[commonStyles.button(theme, 'info'), { padding: theme.spacing.sm }]}
        >
          <Text style={commonStyles.buttonText(theme, 'info')}>View</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => openConfirmationModal(item, 'approve')}
          style={[commonStyles.button(theme, 'success'), { padding: theme.spacing.sm }]}
        >
          <Text style={commonStyles.buttonText(theme, 'success')}>Approve</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => openConfirmationModal(item, 'reject')}
          style={[commonStyles.button(theme, 'error'), { padding: theme.spacing.sm }]}
        >
          <Text style={commonStyles.buttonText(theme, 'error')}>Reject</Text>
        </TouchableOpacity>
      </View>
    </View>
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
    countText: {
      ...commonStyles.text(theme, 'secondary', 'md'),
      textAlign: 'center',
      marginBottom: theme.spacing.md,
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
    modalBackdrop: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing.md,
    },
    modal: {
      backgroundColor: theme.colors.background,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
      width: '90%',
      maxWidth: 400,
      maxHeight: '80%',
    },
    modalTitle: {
      ...commonStyles.text(theme, 'primary', 'lg'),
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: theme.spacing.md,
    },
    modalContent: {
      maxHeight: 300,
      marginBottom: theme.spacing.lg,
    },
    modalDetail: {
      ...commonStyles.text(theme, 'primary', 'sm'),
      marginBottom: theme.spacing.sm,
    },
    modalButtons: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      gap: theme.spacing.sm,
    },
    modalButton: {
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      minWidth: 80,
      alignItems: 'center',
      flex: 1,
    },
    modalButtonText: {
      ...commonStyles.text(theme, 'textInverse', 'sm'),
      fontWeight: '600',
    },
    rejectionContainer: {
      marginTop: theme.spacing.md,
    },
    rejectionMessageContainer: {
      backgroundColor: theme.colors.warning + '20', // 20% opacity warning color
      borderColor: theme.colors.warning,
      borderWidth: 1,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.md,
    },
    rejectionMessage: {
      ...commonStyles.text(theme, 'primary', 'sm'),
      color: theme.colors.warning,
      fontWeight: '500',
      textAlign: 'center',
    },
    rejectionLabel: {
      ...commonStyles.text(theme, 'primary', 'sm'),
      fontWeight: '600',
      marginBottom: theme.spacing.sm,
    },
    rejectionInput: {
      backgroundColor: theme.colors.inputBackground,
      borderColor: theme.colors.inputBorder,
      borderWidth: 1,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      fontSize: theme.typography.sm.fontSize,
      color: theme.colors.textPrimary,
      textAlignVertical: 'top',
      minHeight: 100,
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
      <Text style={styles.header}>Registration Requests</Text>

      <Text style={styles.countText}>
        {registrations.length} pending requests
      </Text>

      <FlatList
        data={registrations}
        renderItem={renderRegistrationItem}
        keyExtractor={item => item._id}
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
              No pending registration requests
            </Text>
          </View>
        }
        contentContainerStyle={{ paddingBottom: theme.spacing.xl }}
      />

      {/* Viewing Registration Details Modal */}
      {viewingRegistration && (
        <Modal
          visible={true}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setViewingRegistration(null)}
        >
          <View style={styles.modalBackdrop}>
            <View style={styles.modal}>
              <Text style={styles.modalTitle}>Registration Details</Text>
              <View style={styles.modalContent}>
                <Text style={styles.modalDetail}>
                  <Text style={{ fontWeight: 'bold' }}>Name:</Text> {viewingRegistration.name}
                </Text>
                <Text style={styles.modalDetail}>
                  <Text style={{ fontWeight: 'bold' }}>Email:</Text> {viewingRegistration.email}
                </Text>
                <Text style={styles.modalDetail}>
                  <Text style={{ fontWeight: 'bold' }}>NIC:</Text> {viewingRegistration.nic}
                </Text>
                <Text style={styles.modalDetail}>
                  <Text style={{ fontWeight: 'bold' }}>Role:</Text> {viewingRegistration.role}
                </Text>
                <Text style={styles.modalDetail}>
                  <Text style={{ fontWeight: 'bold' }}>Index Number:</Text> {viewingRegistration.indexNumber || 'N/A'}
                </Text>
                <Text style={styles.modalDetail}>
                  <Text style={{ fontWeight: 'bold' }}>Department:</Text> {viewingRegistration.department || 'N/A'}
                </Text>
                <Text style={styles.modalDetail}>
                  <Text style={{ fontWeight: 'bold' }}>Submitted:</Text> {new Date(viewingRegistration.submittedAt).toLocaleString()}
                </Text>
              </View>
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  onPress={() => openConfirmationModal(viewingRegistration, 'approve')}
                  style={[styles.modalButton, { backgroundColor: theme.colors.success }]}
                >
                  <Text style={styles.modalButtonText}>Approve</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => openConfirmationModal(viewingRegistration, 'reject')}
                  style={[styles.modalButton, { backgroundColor: theme.colors.error }]}
                >
                  <Text style={styles.modalButtonText}>Reject</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setViewingRegistration(null)}
                  style={[styles.modalButton, { backgroundColor: theme.colors.border }]}
                >
                  <Text style={[styles.modalButtonText, { color: theme.colors.textPrimary }]}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}

      {/* Confirmation Modal for Approve/Reject */}
      {confirmationRequest && (
        <Modal
          visible={true}
          transparent={true}
          animationType="slide"
          onRequestClose={() => {
            setConfirmationRequest(null);
            setConfirmAction(null);
            setRejectionReason('');
          }}
        >
          <View style={styles.modalBackdrop}>
            <View style={[styles.modal, { marginBottom: 150 }]}>
              <Text style={styles.modalTitle}>
                Confirm {confirmAction === 'approve' ? 'Approval' : 'Rejection'}
              </Text>
              <Text style={[styles.modalDetail, { textAlign: 'center', marginBottom: theme.spacing.md }]}>
                Are you sure you want to <Text style={{ fontWeight: 'bold', color: confirmAction === 'approve' ? theme.colors.success : theme.colors.error }}>{confirmAction}</Text> the registration request for{' '}
                <Text style={{ fontWeight: 'bold' }}>{confirmationRequest.name}</Text>?
              </Text>
              {confirmAction === 'reject' && (
                <View style={styles.rejectionContainer}>
                  <View style={styles.rejectionMessageContainer}>
                    <Text style={styles.rejectionMessage}>
                      ⚠️ Rejection requires a reason to help the user understand the decision.
                    </Text>
                  </View>
                  <Text style={styles.rejectionLabel}>
                    Please provide a detailed reason for rejection:
                  </Text>
                  <TextInput
                    value={rejectionReason}
                    onChangeText={setRejectionReason}
                    multiline
                    numberOfLines={4}
                    style={styles.rejectionInput}
                    placeholder="Enter the specific reason for rejecting this registration request..."
                    placeholderTextColor={theme.colors.inputPlaceholder}
                  />
                  <Text style={[styles.modalDetail, { fontSize: theme.typography.xs.fontSize, marginTop: theme.spacing.xs, color: theme.colors.secondary }]}>
                    This reason will be communicated to the user and should be clear and constructive.
                  </Text>
                </View>
              )}
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  onPress={() => handleRegistrationAction(confirmationRequest._id, confirmAction, rejectionReason)}
                  style={[styles.modalButton, {
                    backgroundColor: confirmAction === 'approve' ? theme.colors.success : theme.colors.error
                  }]}
                >
                  <Text style={styles.modalButtonText}>Confirm</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setConfirmationRequest(null);
                    setConfirmAction(null);
                    setRejectionReason('');
                  }}
                  style={[styles.modalButton, { backgroundColor: theme.colors.border }]}
                >
                  <Text style={[styles.modalButtonText, { color: theme.colors.textPrimary }]}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

export default RegistrationRequests;
