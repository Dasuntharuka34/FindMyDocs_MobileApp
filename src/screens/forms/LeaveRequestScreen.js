import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import LeaveRequestForm from '../../components/forms/LeaveRequestForm';
import Button from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { useRequests } from '../../context/RequestsContext';
import { useTheme } from '../../context/ThemeContext';

const LeaveRequestScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const { submitRequest, isLoading } = useRequests();

  if (user?.role === 'Student') {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme?.colors?.background }}>
        <Text style={{ color: theme?.colors?.textPrimary, fontSize: 18, textAlign: 'center', padding: 20 }}>
          Leave requests are not available for students.
        </Text>
      </View>
    );
  }

  const [formData, setFormData] = useState({
    reason: '',
    reasonDetails: '',
    contactDuringLeave: '',
    remarks: '',
    startDate: new Date(),
    endDate: new Date(),
    supportingDocument: null,
  });

  const handleFormChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    const result = await submitRequest('leave', {
      ...formData,
      requesterId: user._id,
      requesterName: user.name,
      requesterRole: user.role
    });

    if (result.success) {
      Alert.alert('Success', 'Leave request submitted successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } else {
      Alert.alert('Error', result.error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme?.colors?.background || '#ffffff' }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={{ flex: 1 }}>
        <View style={{ padding: theme?.spacing?.lg || 24 }}>
          <LeaveRequestForm
            formData={formData}
            onChange={handleFormChange}
            theme={theme}
          />

          <Button
            onPress={handleSubmit}
            loading={isLoading}
            disabled={isLoading}
            style={{ marginTop: theme?.spacing?.xl || 32 }}
          >
            Submit Leave Request
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LeaveRequestScreen;
