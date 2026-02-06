import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import LetterForm from '../../components/forms/LetterForm';
import Button from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { useRequests } from '../../context/RequestsContext';
import { useTheme } from '../../context/ThemeContext';

const LetterRequestScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const { submitRequest, isLoading } = useRequests();
  const [formData, setFormData] = useState({
    type: '',
    reason: '',
    date: new Date().toISOString().split('T')[0],
    details: ''
  });

  const handleFormChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    const result = await submitRequest('letter', {
      ...formData,
      studentId: user._id,
      studentName: user.name,
      studentRole: user.role
    });

    if (result.success) {
      Alert.alert('Success', 'Letter request submitted successfully!', [
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
          <LetterForm
            formData={formData}
            onChange={handleFormChange}
            theme={theme}
          />

          <Button
            title="Submit Letter Request"
            onPress={handleSubmit}
            loading={isLoading}
            disabled={isLoading}
            style={{ marginTop: theme?.spacing?.xl || 32 }}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LetterRequestScreen;
