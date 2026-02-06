import React from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

const ApprovalList = ({ 
  requests, 
  onApprove, 
  onReject, 
  isLoading, 
  emptyMessage = "No requests pending approval",
  type = 'excuse' 
}) => {
  const { theme } = useTheme();

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved': return theme.colors.success;
      case 'Rejected': return theme.colors.error;
      case 'Pending Lecturer Approval': return theme.colors.warning;
      case 'Pending HOD Approval': return theme.colors.warning;
      case 'Pending Dean Approval': return theme.colors.warning;
      case 'Pending VC Approval': return theme.colors.warning;
      default: return theme.colors.textSecondary;
    }
  };

  const renderRequestItem = ({ item }) => (
    <View style={[styles.requestCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
      <View style={styles.requestHeader}>
        <Text style={[styles.studentName, { color: theme.colors.textPrimary }]}>
          {item.studentName}
        </Text>
        <Text style={[styles.regNo, { color: theme.colors.textSecondary }]}>
          {item.regNo}
        </Text>
      </View>

      <Text style={[styles.reason, { color: theme.colors.textPrimary }]}>
        {item.reason}
      </Text>

      <View style={styles.statusContainer}>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {item.status}
          </Text>
        </View>
        
        <Text style={[styles.date, { color: theme.colors.textTertiary }]}>
          {new Date(item.submittedDate || item.createdAt).toLocaleDateString()}
        </Text>
      </View>

      {(onApprove || onReject) && item.status.includes('Pending') && (
        <View style={styles.actionButtons}>
          {onApprove && (
            <TouchableOpacity
              style={[styles.approveButton, { backgroundColor: theme.colors.success }]}
              onPress={() => onApprove(item)}
            >
              <Text style={[styles.buttonText, { color: theme.colors.textInverse }]}>
                Approve
              </Text>
            </TouchableOpacity>
          )}
          
          {onReject && (
            <TouchableOpacity
              style={[styles.rejectButton, { backgroundColor: theme.colors.error }]}
              onPress={() => onReject(item)}
            >
              <Text style={[styles.buttonText, { color: theme.colors.textInverse }]}>
                Reject
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>
          Loading requests...
        </Text>
      </View>
    );
  }

  if (requests.length === 0) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.emptyText, { color: theme.colors.textTertiary }]}>
          {emptyMessage}
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={requests}
      renderItem={renderRequestItem}
      keyExtractor={item => item._id}
      contentContainerStyle={[styles.listContainer, { backgroundColor: theme.colors.background }]}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  requestCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  studentName: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  regNo: {
    fontSize: 14,
    fontWeight: '500',
  },
  reason: {
    fontSize: 14,
    marginBottom: 12,
    lineHeight: 20,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  date: {
    fontSize: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  approveButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  rejectButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default ApprovalList;