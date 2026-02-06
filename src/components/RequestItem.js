import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const RequestItem = ({ request, type, onPress }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved':
        return '#4ade80';
      case 'Rejected':
        return '#ef4444';
      case 'Submitted':
        return '#3b82f6';
      default:
        return '#f59e0b';
    }
  };

  const getTypeIcon = () => {
    switch (type) {
      case 'excuse':
        return 'school';
      case 'leave':
        return 'beach-access';
      case 'letter':
        return 'description';
      default:
        return 'assignment';
    }
  };

  const getTypeColor = () => {
    switch (type) {
      case 'excuse':
        return '#4361ee';
      case 'leave':
        return '#f72585';
      case 'letter':
        return '#4cc9f0';
      default:
        return '#6b7280';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: `${getTypeColor()}20` }]}>
          <Icon name={getTypeIcon()} size={20} color={getTypeColor()} />
        </View>
        <View style={styles.headerContent}>
          <Text style={styles.title} numberOfLines={1}>
            {request.reason || request.type}
          </Text>
          <Text style={styles.date}>
            {formatDate(request.submittedDate || request.createdAt)}
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(request.status)}20` }]}>
          <Text style={[styles.statusText, { color: getStatusColor(request.status) }]}>
            {request.status}
          </Text>
        </View>
      </View>

      <View style={styles.details}>
        <Text style={styles.detailText} numberOfLines={2}>
          {request.reasonDetails || request.additionalDetails}
        </Text>
      </View>

      {request.currentStageIndex !== undefined && (
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            {[0, 1, 2, 3, 4, 5].map((stage) => (
              <View
                key={`progress-dot-${stage}`}
                style={[
                  styles.progressDot,
                  stage <= request.currentStageIndex && styles.progressDotActive,
                  { backgroundColor: stage <= request.currentStageIndex ? getTypeColor() : '#e5e7eb' }
                ]}
              />
            ))}
          </View>
          <Text style={styles.progressText}>
            Stage {request.currentStageIndex + 1} of 6
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
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
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 2,
  },
  date: {
    fontSize: 12,
    color: '#6b7280',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  details: {
    marginBottom: 12,
  },
  detailText: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  progressContainer: {
    alignItems: 'center',
  },
  progressBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 8,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  progressDotActive: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  progressText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
});

export default RequestItem;