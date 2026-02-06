import React, { useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Picker from '../../components/ui/Picker';
import { useTheme } from '../../context/ThemeContext';
import { register } from '../../services/auth';
import { USER_ROLES } from '../../utils/constants';

const RegisterScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    nic: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    role: 'Student',
    department: '',
    indexNumber: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const { theme } = useTheme();

  // Role options for the dropdown (excluding Admin and Staff)
  const roleOptions = [
    { label: USER_ROLES.STUDENT, value: USER_ROLES.STUDENT },
    { label: USER_ROLES.LECTURER, value: USER_ROLES.LECTURER },
    { label: USER_ROLES.HOD, value: USER_ROLES.HOD },
    { label: USER_ROLES.DEAN, value: USER_ROLES.DEAN },
    { label: USER_ROLES.VC, value: USER_ROLES.VC },
  ];

  // Department options for the dropdown
  const departmentOptions = [
    { label: 'Computer Science', value: 'Computer Science' },
    { label: 'Information Technology', value: 'Information Technology' },
    { label: 'Software Engineering', value: 'Software Engineering' },
    { label: 'Mathematics', value: 'Mathematics' },
    { label: 'Physics', value: 'Physics' },
    { label: 'Chemistry', value: 'Chemistry' },
    { label: 'Biology', value: 'Biology' },
    { label: 'Engineering', value: 'Engineering' },
    { label: 'Business Administration', value: 'Business Administration' },
    { label: 'Law', value: 'Law' },
    { label: 'Medicine', value: 'Medicine' },
    { label: 'Other', value: 'Other' },
  ];

  const styles = {
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      padding: theme.spacing.lg,
    },
    header: {
      alignItems: 'center',
      marginBottom: theme.spacing.xl,
      marginTop: theme.spacing.lg,
    },
    title: {
      fontSize: theme.typography.xxl.fontSize,
      fontWeight: 'bold',
      color: theme.colors.primary,
      marginBottom: theme.spacing.xs,
    },
    subtitle: {
      fontSize: theme.typography.md.fontSize,
      color: theme.colors.textSecondary,
      textAlign: 'center',
    },
    inputContainer: {
      marginBottom: theme.spacing.md,
    },
    input: {
      backgroundColor: theme.colors.inputBackground,
      borderWidth: 1,
      borderColor: theme.colors.inputBorder,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      color: theme.colors.textPrimary,
      fontSize: theme.typography.md.fontSize,
      marginBottom: theme.spacing.sm,
    },
    picker: {
      backgroundColor: theme.colors.inputBackground,
      borderWidth: 1,
      borderColor: theme.colors.inputBorder,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      color: theme.colors.textPrimary,
      marginBottom: theme.spacing.sm,
    },
    button: {
      backgroundColor: theme.colors.primary,
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      alignItems: 'center',
      marginTop: theme.spacing.md,
    },
    buttonText: {
      color: theme.colors.textInverse,
      fontSize: theme.typography.md.fontSize,
      fontWeight: '600',
    },
    buttonDisabled: {
      backgroundColor: theme.colors.border,
    },
    footer: {
      marginTop: theme.spacing.lg,
      alignItems: 'center',
    },
    footerText: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.sm.fontSize,
    },
    loginLink: {
      color: theme.colors.primary,
      fontWeight: '600',
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    halfInput: {
      flex: 1,
      marginHorizontal: theme.spacing.xs,
    },
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRegister = async () => {
    if (!formData.name || !formData.email || !formData.nic || !formData.mobile || !formData.password) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (formData.role === 'Student' && !formData.indexNumber) {
      Alert.alert('Error', 'Index number is required for students');
      return;
    }

    setIsLoading(true);

    const result = await register(formData);
    
    setIsLoading(false);

    if (result.success) {
      Alert.alert(
        'Registration Submitted',
        result.message,
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Login')}
        ]
      );
    } else {
      Alert.alert('Registration Failed', result.error);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={{ paddingBottom: theme.spacing.xl }}>
        <View style={styles.header}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join Find My Docs system</Text>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Full Name *"
            placeholderTextColor={theme.colors.inputPlaceholder}
            value={formData.name}
            onChangeText={(text) => handleInputChange('name', text)}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Email Address *"
            placeholderTextColor={theme.colors.inputPlaceholder}
            value={formData.email}
            onChangeText={(text) => handleInputChange('email', text)}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          
          <View style={styles.row}>
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="NIC *"
              placeholderTextColor={theme.colors.inputPlaceholder}
              value={formData.nic}
              onChangeText={(text) => handleInputChange('nic', text)}
            />
            
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="Mobile *"
              placeholderTextColor={theme.colors.inputPlaceholder}
              value={formData.mobile}
              onChangeText={(text) => handleInputChange('mobile', text)}
              keyboardType="phone-pad"
            />
          </View>

          <Picker
            label="Department"
            placeholder="Department"
            items={departmentOptions}
            value={formData.department}
            onValueChange={(itemValue) => handleInputChange('department', itemValue)}
            style={styles.picker}
          />

          <Picker
            label="Role *"
            placeholder="Role"
            items={roleOptions}
            value={formData.role}
            onValueChange={(itemValue) => handleInputChange('role', itemValue)}
            style={styles.picker}
          />

          {formData.role === USER_ROLES.STUDENT && (
            <TextInput
              style={styles.input}
              placeholder="Index Number (for students)"
              placeholderTextColor={theme.colors.inputPlaceholder}
              value={formData.indexNumber}
              onChangeText={(text) => handleInputChange('indexNumber', text)}
            />
          )}

          <TextInput
            style={styles.input}
            placeholder="Password *"
            placeholderTextColor={theme.colors.inputPlaceholder}
            value={formData.password}
            onChangeText={(text) => handleInputChange('password', text)}
            secureTextEntry
          />

          <TextInput
            style={styles.input}
            placeholder="Confirm Password *"
            placeholderTextColor={theme.colors.inputPlaceholder}
            value={formData.confirmPassword}
            onChangeText={(text) => handleInputChange('confirmPassword', text)}
            secureTextEntry
          />
        </View>

        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleRegister}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={theme.colors.textInverse} />
          ) : (
            <Text style={styles.buttonText}>Create Account</Text>
          )}
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Already have an account?{' '}
            <Text 
              style={styles.loginLink}
              onPress={() => navigation.navigate('Login')}
            >
              Sign in
            </Text>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;
