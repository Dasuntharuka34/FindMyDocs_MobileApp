import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../context/ThemeContext';

const RequestSummary = ({ request, type, onPress, style }) => {
  const { theme } = useTheme();

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved':
        return theme.colors.success;
      case 'Rejected':
        return theme.colors.error;
      case 'Pending Lecturer Approval':
      case 'Pending HOD Approval':
      case 'Pending Dean Approval':
      case 'Pending VC Approval':
        return theme.colors.warning;
      default:
        return theme.colors.textSecondary;
    }
  };

  const getTypeIcon = () => {
    switch (type) {
      case 'excuse':
        return 'sick';
      case 'leave':
        return 'beach-access';
      case 'letter':
        return 'description';
      default:
        return 'assignment';
    }
  };

  const getTypeLabel = () => {
    switch (type) {
      case 'excuse':
        return 'Excuse Request';
      case 'leave':
        return 'Leave Request';
      case 'letter':
        return 'Letter';
      default:
        return 'Request';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getCurrentStage = () => {
    if (!request.currentStageIndex && request.currentStageIndex !== 0) {
      return request.status;
    }

    const stages = [
      'Submitted',
      'Pending Lecturer Approval',
      'Pending HOD Approval',
      'Pending Dean Approval',
      'Pending VC Approval',
      'Approved'
    ];

    return stages[request.currentStageIndex] || request.status;
  };

  return (
    <TouchableOpacity 
      onPress={onPress}
      style={[
        styles.container,
        { 
          backgroundColor: theme.colors.card,
          borderColor: theme.colors.border,
        },
        style
      ]}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.typeContainer}>
          <Icon 
            name={getTypeIcon()} 
            size={16} 
            color={theme.colors.primary} 
          />
          <Text style={[styles.typeText, { color: theme.colors.primary }]}>
            {getTypeLabel()}
          </Text>
        </View>
        
        <View style={[
          styles.statusBadge,
          { backgroundColor: getStatusColor(request.status) + '20' }
        ]}>
          <Text style={[
            styles.statusText,
            { color: getStatusColor(request.status) }
          ]}>
            {getCurrentStage()}
          </Text>
        </View>
      </View>

      <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
        {request.reason || request.type || 'No title'}
      </Text>

      <Text style={[styles.description, { color: theme.colors.textSecondary }]} numberOfLines={2}>
        {request.reasonDetails || request.remarks || 'No description provided'}
      </Text>

      <View style={styles.footer}>
        <View style={styles.dateContainer}>
          <Icon name="event" size={14} color={theme.colors.textTertiary} />
          <Text style={[styles.dateText, { color: theme.colors.textTertiary }]}>
            {formatDate(request.submittedDate || request.createdAt)}
          </Text>
        </View>

        <View style={styles.idContainer}>
          <Text style={[styles.idText, { color: theme.colors.textTertiary }]}>
            ID: {request._id?.substring(0, 8) || 'N/A'}
          </Text>
        </View>
      </View>

      {(request.startDate || request.date) && (
        <View style={styles.dateInfo}>
          <Icon name="calendar-today" size={12} color={theme.colors.textSecondary} />
          <Text style={[styles.dateInfoText, { color: theme.colors.textSecondary }]}>
            {request.startDate 
              ? `From: ${formatDate(request.startDate)} To: ${formatDate(request.endDate)}`
              : `Date: ${formatDate(request.date)}`
            }
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = {
  container: {
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typeText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    marginBottom: 12,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 12,
    marginLeft: 4,
  },
  idContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  idText: {
    fontSize: 11,
    fontFamily: 'monospace',
  },
  dateInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f1f3f5',
  },
  dateInfoText: {
    fontSize: 12,
    marginLeft: 4,
    flex: 1,
  },
};

export default RequestSummary;