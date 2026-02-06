import React, { useState, useEffect } from 'react';
import { View, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useRequests } from '../../context/RequestsContext';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Picker } from '../../components/ui/Picker';
import { commonStyles } from '../../styles/GlobalStyles';

const LetterScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const { submitRequest, isLoading } = useRequests();
  
  const [formData, setFormData] = useState({
    type: '',
    reason: '',
    date: new Date(),
    additionalDetails: '',
  });

  const [errors, setErrors] = useState({});

  const letterTypes = [
    { label: 'Select Letter Type', value: '' },
    { label: 'Recommendation Letter', value: 'recommendation' },
    { label: 'Certificate Request', value: 'certificate' },
    { label: 'Official Letter', value: 'official' },
    { label: 'Other', value: 'other' },
  ];

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.type) {
      newErrors.type = 'Letter type is required';
    }
    
    if (!formData.reason.trim()) {
      newErrors.reason = 'Reason is required';
    }
    
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const result = await submitRequest('letter', {
        ...formData,
        studentId: user._id,
        student: user.name,
        submitterRole: user.role,
        date: formData.date.toISOString(),
      });

      if (result.success) {
        Alert.alert('Success', 'Letter request submitted successfully!');
        navigation.goBack();
      } else {
        Alert.alert('Error', result.error);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to submit letter request');
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
    <ScrollView style={commonStyles.container}>
      <Card title="Letter Request Form">
        <Picker
          label="Letter Type"
          items={letterTypes}
          selectedValue={formData.type}
          onValueChange={(value) => updateFormData('type', value)}
          error={errors.type}
        />

        <Input
          label="Reason for Letter"
          value={formData.reason}
          onChangeText={(text) => updateFormData('reason', text)}
          error={errors.reason}
          placeholder="Explain the purpose of this letter"
          multiline
          numberOfLines={3}
        />

        <Input
          label="Additional Details"
          value={formData.additionalDetails}
          onChangeText={(text) => updateFormData('additionalDetails', text)}
          placeholder="Any specific requirements or details"
          multiline
          numberOfLines={4}
        />

        <Button
          title="Submit Letter Request"
          onPress={handleSubmit}
          loading={isLoading}
          style={{ marginTop: theme.spacing.lg }}
        />
      </Card>
    </ScrollView>
  );
};

export default LetterScreen;