import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, Alert } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useRequests } from '../../context/RequestsContext';
import Button from '../../components/ui/Button';
import { getStagesForRequestType } from '../../constants/requestStages';
import RequestDetailsView from '../../components/RequestDetailsView';


const RequestDetailScreen = ({ route, navigation }) => {
  const { requestId, type } = route.params;
  const { theme } = useTheme();
  const { user } = useAuth();
  const { getRequestById, approveRequest, rejectRequest } = useRequests();
  const [request, setRequest] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const stages = getStagesForRequestType(type);

  useEffect(() => {

    loadRequest();
  }, [requestId, type]);

  const loadRequest = () => {
    const foundRequest = getRequestById(type, requestId);
    setRequest(foundRequest);
  };

  const handleApprove = async () => {
    setIsLoading(true);
    const result = await approveRequest(type, requestId, {
      approverRole: user.role,
      approverId: user._id,
      approverName: user.name,
      comment: 'Approved via mobile app'
    });

    setIsLoading(false);
    
    if (result.success) {
      setRequest(result.data);
      Alert.alert('Success', 'Request approved successfully!');
    } else {
      Alert.alert('Error', result.error);
    }
  };

  const handleReject = async () => {
    Alert.prompt(
      'Reject Request',
      'Please provide a reason for rejection:',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reject',
          onPress: async (reason) => {
            setIsLoading(true);
            const result = await rejectRequest(type, requestId, {
              approverRole: user.role,
              approverId: user._id,
              approverName: user.name,
              comment: reason || 'Rejected via mobile app'
            });

            setIsLoading(false);
            
            if (result.success) {
              setRequest(result.data);
              Alert.alert('Request Rejected');
            } else {
              Alert.alert('Error', result.error);
            }
          }
        }
      ]
    );
  };

  if (!request) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
        <Text style={{ color: theme.colors.textSecondary }}>Request not found</Text>
      </View>
    );
  }

  const canApprove = request.status.includes('Pending') && 
                    request.status.includes(user.role) &&
                    request.currentStageIndex < 5;

  const isFinalState = request.status === 'Approved' || request.status === 'Rejected';

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={{ padding: theme.spacing.lg }}>
        <RequestDetailsView request={request} type={type} theme={theme} />



        {/* Approval Actions */}
        {canApprove && !isFinalState && (
          <View style={{ marginTop: theme.spacing.xl, gap: theme.spacing.md }}>
            <Button
              title="Approve Request"
              onPress={handleApprove}
              loading={isLoading}
              variant="success"
            />
            
            <Button
              title="Reject Request"
              onPress={handleReject}
              loading={isLoading}
              variant="error"
              outline
            />
          </View>
        )}

        {isFinalState && (
          <View style={{ marginTop: theme.spacing.xl }}>
            <Text style={{ 
              color: request.status === 'Approved' ? theme.colors.success : theme.colors.error,
              fontWeight: '600',
              textAlign: 'center'
            }}>
              {request.status.toUpperCase()}
            </Text>
            
            {request.rejectionReason && (
              <Text style={{ color: theme.colors.textSecondary, marginTop: theme.spacing.sm, textAlign: 'center' }}>
                Reason: {request.rejectionReason}
              </Text>
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default RequestDetailScreen;
