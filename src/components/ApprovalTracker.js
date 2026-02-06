import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ApprovalTracker = ({ currentStage, stages, approvalHistory = [] }) => {
  const getStageStatus = (stageIndex) => {
    if (stageIndex < currentStage) {
      return 'completed';
    } else if (stageIndex === currentStage) {
      return 'current';
    } else {
      return 'pending';
    }
  };

  const getStageIcon = (status) => {
    switch (status) {
      case 'completed':
        return 'check-circle';
      case 'current':
        return 'radio-button-checked';
      case 'pending':
        return 'radio-button-unchecked';
      default:
        return 'circle';
    }
  };

  const getStageColor = (status) => {
    switch (status) {
      case 'completed':
        return '#4ade80';
      case 'current':
        return '#3b82f6';
      case 'pending':
        return '#d1d5db';
      default:
        return '#6b7280';
    }
  };

  const getApproverInfo = (stageIndex) => {
    return approvalHistory.find(approval => 
      approval.approverRole === stages[stageIndex]?.approverRole
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Approval Progress</Text>
      
      {stages.map((stage, index) => {
        const status = getStageStatus(index);
        const approverInfo = getApproverInfo(index);
        
        return (
          <View key={index} style={styles.stageContainer}>
            <View style={styles.stageIconContainer}>
              <Icon
                name={getStageIcon(status)}
                size={20}
                color={getStageColor(status)}
              />
            </View>

            <View style={styles.stageContent}>
              <Text style={[
                styles.stageName,
                status === 'completed' && styles.completedText,
                status === 'current' && styles.currentText
              ]}>
                {stage.name}
              </Text>

              {approverInfo && (
                <View style={styles.approverInfo}>
                  <Text style={styles.approverName}>
                    {approverInfo.approverName || approverInfo.approverRole}
                  </Text>
                  {approverInfo.approvedAt && (
                    <Text style={styles.approvalTime}>
                      {new Date(approverInfo.approvedAt).toLocaleDateString()}
                    </Text>
                  )}
                  {approverInfo.comment && (
                    <Text style={styles.approverComment} numberOfLines={2}>
                      &quot;{approverInfo.comment}&quot;
                    </Text>
                  )}
                </View>
              )}

              {stage.approverRole && !approverInfo && (
                <Text style={styles.pendingText}>
                  Waiting for {stage.approverRole} approval
                </Text>
              )}
            </View>

            {index < stages.length - 1 && (
              <View
                style={[
                  styles.connectorLine,
                  { backgroundColor: getStageColor(status === 'completed' ? 'completed' : 'pending') }
                ]}
              />
            )}
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginVertical: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 20,
    textAlign: 'center',
  },
  stageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    position: 'relative',
  },
  stageIconContainer: {
    marginRight: 12,
    zIndex: 2,
    backgroundColor: '#ffffff',
  },
  stageContent: {
    flex: 1,
    paddingBottom: 16,
  },
  stageName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
    marginBottom: 4,
  },
  completedText: {
    color: '#4ade80',
    fontWeight: '600',
  },
  currentText: {
    color: '#3b82f6',
    fontWeight: '600',
  },
  approverInfo: {
    backgroundColor: '#f8fafc',
    padding: 8,
    borderRadius: 6,
    marginTop: 4,
  },
  approverName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 2,
  },
  approvalTime: {
    fontSize: 11,
    color: '#6b7280',
    marginBottom: 4,
  },
  approverComment: {
    fontSize: 11,
    color: '#4b5563',
    fontStyle: 'italic',
  },
  pendingText: {
    fontSize: 12,
    color: '#6b7280',
    fontStyle: 'italic',
    marginTop: 2,
  },
  connectorLine: {
    position: 'absolute',
    left: 9,
    top: 20,
    bottom: 0,
    width: 2,
    zIndex: 1,
  },
});

export default ApprovalTracker;