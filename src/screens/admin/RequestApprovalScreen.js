import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import RequestDetailsView from '../../components/RequestDetailsView';
import { useAuth } from '../../context/AuthContext';
import { useRequests } from '../../context/RequestsContext';
import { commonStyles, useTheme } from '../../context/ThemeContext';

const RequestApprovalScreen = ({ route, navigation }) => {
  const { requestId, requestType } = route.params;
  const { approveRequest, rejectRequest } = useRequests();
  const { user } = useAuth();
  const { theme } = useTheme();

  const [comment, setComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const request = route.params.request;

  const handleApprove = async () => {
    if (!request) return;

    setIsLoading(true);
    try {
      const approvalData = {
        approverRole: user.role,
        approverId: user._id,
        approverName: user.name,
        comment: comment.trim() || 'Approved'
      };

      const result = await approveRequest(requestType, request._id, approvalData);
      
      if (result.success) {
        Alert.alert('Success', 'Request approved successfully');
        navigation.goBack();
      } else {
        Alert.alert('Error', result.error);
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to approve request');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async () => {
    if (!request) return;

    if (!comment.trim()) {
      Alert.alert('Validation', 'Please provide a reason for rejection');
      return;
    }

    setIsLoading(true);
    try {
      const rejectionData = {
        approverRole: user.role,
        approverId: user._id,
        approverName: user.name,
        comment: comment.trim()
      };

      const result = await rejectRequest(requestType, request._id, rejectionData);
      
      if (result.success) {
        Alert.alert('Success', 'Request rejected');
        navigation.goBack();
      } else {
        Alert.alert('Error', result.error);
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to reject request');
    } finally {
      setIsLoading(false);
    }
  };

  if (!request) {
    return (
      <View style={commonStyles.container}>
        <Text>Request not found</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ScrollView style={commonStyles.container(theme)}>
        <Text style={commonStyles.header(theme)}>Review Request</Text>

        <RequestDetailsView request={request} type={requestType} theme={theme} />

        <Text style={commonStyles.label(theme)}>Comments:</Text>

        <TextInput
          style={commonStyles.textInput(theme)}
          value={comment}
          onChangeText={setComment}

          placeholder="Enter your comments or reason for rejection"
          multiline
          numberOfLines={4}
        />

        <View style={commonStyles.buttonRow}>
          <TouchableOpacity
            style={commonStyles.successButton(theme)}
            onPress={handleApprove}
            disabled={isLoading}
          >
            <Text style={commonStyles.buttonText(theme)}>
              {isLoading ? 'Approving...' : 'Approve'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={commonStyles.dangerButton(theme)}
            onPress={handleReject}
            disabled={isLoading || !comment.trim()}
          >
            <Text style={commonStyles.buttonText(theme)}>
              {isLoading ? 'Rejecting...' : 'Reject'}
            </Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default RequestApprovalScreen;
