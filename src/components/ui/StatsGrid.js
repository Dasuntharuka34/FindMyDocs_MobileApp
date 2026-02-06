import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

const StatsGrid = ({ excuseRequests, leaveRequests, letters, isLoading }) => {
  const { theme } = useTheme();

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.card }]}>
        <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>
          Loading statistics...
        </Text>
      </View>
    );
  }

  const totalRequests = excuseRequests.length + leaveRequests.length + letters.length;
  
  const pendingRequests = [
    ...excuseRequests.filter(req => req.status !== 'Approved' && req.status !== 'Rejected'),
    ...leaveRequests.filter(req => req.status !== 'Approved' && req.status !== 'Rejected'),
    ...letters.filter(req => req.status !== 'Approved' && req.status !== 'Rejected')
  ].length;

  const approvedRequests = [
    ...excuseRequests.filter(req => req.status === 'Approved'),
    ...leaveRequests.filter(req => req.status === 'Approved'),
    ...letters.filter(req => req.status === 'Approved')
  ].length;

  const rejectedRequests = [
    ...excuseRequests.filter(req => req.status === 'Rejected'),
    ...leaveRequests.filter(req => req.status === 'Rejected'),
    ...letters.filter(req => req.status === 'Rejected')
  ].length;

  const stats = [
    { label: 'Total Requests', value: totalRequests, color: theme.colors.primary },
    { label: 'Pending', value: pendingRequests, color: theme.colors.warning },
    { label: 'Approved', value: approvedRequests, color: theme.colors.success },
    { label: 'Rejected', value: rejectedRequests, color: theme.colors.error }
  ];

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {stats.map((stat, index) => (
          <View 
            key={index} 
            style={[
              styles.statCard, 
              { 
                backgroundColor: theme.colors.card,
                borderColor: theme.colors.border,
                marginRight: index % 2 === 0 ? theme.spacing.sm : 0
              }
            ]}
          >
            <Text style={[styles.statValue, { color: stat.color }]}>
              {stat.value}
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
              {stat.label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    minWidth: 120,
    maxWidth: 180,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
    marginHorizontal: 4,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    textAlign: 'center',
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 16,
    padding: 20,
  },
});

export default StatsGrid;