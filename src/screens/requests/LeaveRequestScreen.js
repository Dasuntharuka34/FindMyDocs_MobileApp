import { useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { DatePicker } from '../../components/ui/DatePicker';
import { Input } from '../../components/ui/Input';
import { useAuth } from '../../context/AuthContext';
import { useRequests } from '../../context/RequestsContext';
import { useTheme } from '../../context/ThemeContext';
import { commonStyles } from '../../styles/GlobalStyles';

const LeaveRequestScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const { submitRequest, isLoading } = useRequests();
  
  const [formData, setFormData] = useState({
    reason: '',
    reasonDetails: '',
    contactDuringLeave: '',
    remarks: '',
    startDate: null,
    endDate: null,
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.reason.trim()) {
      newErrors.reason = 'Reason is required';
    }
    
    if (!formData.reasonDetails.trim()) {
      newErrors.reasonDetails = 'Reason details are required';
    }
    
    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }
    
    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }
    
    if (formData.startDate && formData.endDate && formData.startDate > formData.endDate) {
      newErrors.endDate = 'End date must be after start date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const result = await submitRequest('leave', {
        ...formData,
        requesterId: user._id,
        requesterName: user.name,
        requesterRole: user.role,
        startDate: formData.startDate.toISOString(),
        endDate: formData.endDate.toISOString(),
      });

      if (result.success) {
        Alert.alert('Success', 'Leave request submitted successfully!');
        navigation.goBack();
      } else {
        Alert.alert('Error', result.error);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to submit leave request');
    }
  };

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (isLoading) {
    return (
      <View style={commonStyles.centeredContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={{ flex: 1 }}>
        <Card title="Leave Request Form">
          <Input
            label="Reason for Leave"
            value={formData.reason}
            onChangeText={(text) => updateFormData('reason', text)}
            error={errors.reason}
            placeholder="Enter reason for leave"
          />

          <Input
            label="Reason Details"
            value={formData.reasonDetails}
            onChangeText={(text) => updateFormData('reasonDetails', text)}
            error={errors.reasonDetails}
            placeholder="Provide detailed explanation"
            multiline
            numberOfLines={4}
          />

          <DatePicker
            label="Start Date"
            date={formData.startDate}
            onDateChange={(date) => updateFormData('startDate', date)}
            error={errors.startDate}
            minimumDate={new Date()}
          />

          <DatePicker
            label="End Date"
            date={formData.endDate}
            onDateChange={(date) => updateFormData('endDate', date)}
            error={errors.endDate}
            minimumDate={formData.startDate || new Date()}
          />

          <Input
            label="Contact During Leave"
            value={formData.contactDuringLeave}
            onChangeText={(text) => updateFormData('contactDuringLeave', text)}
            placeholder="Phone number or email"
          />

          <Input
            label="Remarks"
            value={formData.remarks}
            onChangeText={(text) => updateFormData('remarks', text)}
            placeholder="Additional comments"
            multiline
            numberOfLines={3}
          />

          <Button
            title="Submit Leave Request"
            onPress={handleSubmit}
            loading={isLoading}
            style={{ marginTop: theme.spacing.lg }}
          />
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LeaveRequestScreen;