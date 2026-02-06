import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { useAuth } from '../../context/AuthContext';
import { commonStyles, useTheme } from '../../context/ThemeContext';
import { changePassword } from '../../services/api';

const ChangePasswordScreen = ({ navigation }) => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateForm = () => {
    const newErrors = {};
    const newTouched = {};

    // Current password validation
    if (!formData.currentPassword.trim()) {
      newErrors.currentPassword = 'Current password is required';
      newTouched.currentPassword = true;
    }

    // New password validation
    if (!formData.newPassword.trim()) {
      newErrors.newPassword = 'New password is required';
      newTouched.newPassword = true;
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters long';
      newTouched.newPassword = true;
    }

    // Confirm password validation
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your new password';
      newTouched.confirmPassword = true;
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      newTouched.confirmPassword = true;
    }

    setErrors(newErrors);
    setTouched({ ...touched, ...newTouched });

    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleInputBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handleChangePassword = async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fix the errors in the form');
      return;
    }

    setLoading(true);
    try {
      const passwordData = {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
        confirmNewPassword: formData.confirmPassword
      };

      const result = await changePassword(user._id, passwordData);

      if (result) {
        Alert.alert('Success', 'Password changed successfully', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);

        // Clear form
        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setErrors({});
        setTouched({});
      }
    } catch (error) {
      Alert.alert('Password Change Failed', error.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      ...commonStyles.container(theme),
      padding: theme.spacing.sm,
    },
    header: {
      ...commonStyles.text(theme, 'primary', 'xxl'),
      fontWeight: 'bold',
      textAlign: 'center',
      marginTop: theme.spacing.md,
      marginBottom: theme.spacing.lg,
    },
    formContainer: {
      backgroundColor: theme.colors.backgroundSecondary,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.xl,
    },
    sectionTitle: {
      ...commonStyles.text(theme, 'primary', 'lg'),
      fontWeight: '600',
      marginBottom: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      paddingBottom: theme.spacing.xs,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: theme.spacing.md,
      marginBottom: theme.spacing.xl
    },
    saveButton: {
      flex: 1,
    },
    cancelButton: {
      flex: 1,
    },
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.header}>Change Password</Text>

        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>Password Information</Text>

          <Input
            label="Current Password"
            value={formData.currentPassword}
            onChangeText={(value) => handleInputChange('currentPassword', value)}
            onBlur={() => handleInputBlur('currentPassword')}
            placeholder="Enter your current password"
            secureTextEntry={true}
            error={errors.currentPassword}
            touched={touched.currentPassword}
          />

          <Input
            label="New Password"
            value={formData.newPassword}
            onChangeText={(value) => handleInputChange('newPassword', value)}
            onBlur={() => handleInputBlur('newPassword')}
            placeholder="Enter your new password"
            secureTextEntry={true}
            error={errors.newPassword}
            touched={touched.newPassword}
          />

          <Input
            label="Confirm New Password"
            value={formData.confirmPassword}
            onChangeText={(value) => handleInputChange('confirmPassword', value)}
            onBlur={() => handleInputBlur('confirmPassword')}
            placeholder="Confirm your new password"
            secureTextEntry={true}
            error={errors.confirmPassword}
            touched={touched.confirmPassword}
          />
        </View>

        <View style={styles.buttonContainer}>
          <Button
            variant="secondary"
            onPress={() => navigation.goBack()}
            disabled={loading}
            style={styles.cancelButton}
          >
            Cancel
          </Button>

          <Button
            variant="primary"
            onPress={handleChangePassword}
            loading={loading}
            style={styles.saveButton}
          >
            Change Password
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ChangePasswordScreen;
