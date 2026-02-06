import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import ApprovalTracker from './ApprovalTracker';


import { getStagesForRequestType } from '../constants/requestStages';
import Card from './ui/Card';

const RequestDetailsView = ({ request, type, theme }) => {
  const navigation = useNavigation();

  const DetailRow = ({ label, value }) => {
    if (!value) return null;
    return (
      <Text style={{ color: theme.colors.textSecondary, marginBottom: theme.spacing.xs, fontSize: theme.typography.sm.fontSize }}>
        <Text style={{ fontWeight: '600' }}>{label}: </Text>{value}
      </Text>
    );
  };

  if (!request) {


    return null;
  }

  const stages = getStagesForRequestType(type);

  return (
    <Card theme={theme}>
      <Text style={{ fontSize: theme.typography.xl.fontSize, fontWeight: 'bold', color: theme.colors.textPrimary, marginBottom: theme.spacing.md }}>
        {type.charAt(0).toUpperCase() + type.slice(1)} Request
      </Text>
      
      <Text style={{ color: theme.colors.textSecondary, marginBottom: theme.spacing.lg }}>
        Status: <Text style={{ color: theme.colors.primary, fontWeight: '600' }}>{request.status}</Text>
      </Text>

      {/* Request Details */}
      <View style={{ marginBottom: theme.spacing.xl }}>
        <Text style={{ fontWeight: '600', color: theme.colors.textPrimary, marginBottom: theme.spacing.sm }}>
          Details
        </Text>
        
        {request.studentName && (
            <Text style={{ color: theme.colors.textSecondary, marginBottom: theme.spacing.xs }}>
                Student: {request.studentName}
            </Text>
        )}

        {request.reason && (
          <Text style={{ color: theme.colors.textSecondary, marginBottom: theme.spacing.xs }}>
            Reason: {request.reason}
          </Text>
        )}

        {request.reasonDetails && (
          <Text style={{ color: theme.colors.textSecondary, marginBottom: theme.spacing.xs }}>
            Details: {request.reasonDetails}
          </Text>
        )}

        {request.startDate && request.endDate && (
          <Text style={{ color: theme.colors.textSecondary, marginBottom: theme.spacing.xs }}>
            Period: {new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}
          </Text>
        )}

        {request.submittedDate && (
          <Text style={{ color: theme.colors.textSecondary }}>
            Submitted: {new Date(request.submittedDate).toLocaleDateString()}
          </Text>
        )}
      </View>

      {/* Excuse Request Specific Details */}
      {type === 'excuse' && (
        <>
          {/* Student Information */}
          <View style={{ marginBottom: theme.spacing.xl }}>
            <Text style={{ fontWeight: '600', color: theme.colors.textPrimary, marginBottom: theme.spacing.sm }}>
              Student Information
            </Text>
            <DetailRow label="Reg No" value={request.regNo} />
            <DetailRow label="Email" value={request.email} />
            <DetailRow label="Mobile" value={request.mobile} />
            <DetailRow label="Address" value={request.address} />
            <DetailRow label="Level" value={request.levelOfStudy} />
            <DetailRow label="Subject Combination" value={request.subjectCombo} />
          </View>

          {/* Absence Details */}
          <View style={{ marginBottom: theme.spacing.xl }}>
            <Text style={{ fontWeight: '600', color: theme.colors.textPrimary, marginBottom: theme.spacing.sm }}>
              Absence Details
            </Text>
            <DetailRow label="Lectures Absent" value={request.lectureAbsents} />
            {request.absences && request.absences.length > 0 && (
              <View style={{ marginTop: theme.spacing.xs }}>
                <Text style={{ fontWeight: '600', color: theme.colors.textSecondary, marginBottom: theme.spacing.xs }}>
                  Specific Absences:
                </Text>
                {request.absences.map((absence, index) => (
                  <Text key={index} style={{ color: theme.colors.textSecondary, marginLeft: theme.spacing.md, marginBottom: theme.spacing.xs }}>
                    • {absence.courseCode} on {new Date(absence.date).toLocaleDateString()}
                  </Text>
                ))}
              </View>
            )}
          </View>
        </>
      )}

      {/* Attachments */}

      {request.attachments && (
        <View style={{ marginBottom: theme.spacing.xl }}>
          <Text style={{ fontWeight: '600', color: theme.colors.textPrimary, marginBottom: theme.spacing.sm }}>
            Attachment
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('AttachmentViewer', { uri: request.attachments })}

            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: theme.colors.backgroundSecondary,
              padding: theme.spacing.md,
              borderRadius: theme.borderRadius.md,
              borderWidth: 1,
              borderColor: theme.colors.border
            }}
          >
            <Ionicons name="attach" size={22} color={theme.colors.primary} />
            <Text style={{ color: theme.colors.primary, marginLeft: theme.spacing.sm, fontWeight: '600', fontSize: theme.typography.sm.fontSize }}>
              View Attached File
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Approval Progress */}

      <ApprovalTracker
        currentStage={request.currentStageIndex}
        status={request.status}
        theme={theme}
        stages={stages}
        approvalHistory={request.approvals || []}
      />
    </Card>
  );
};

export default RequestDetailsView;
