import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { commonStyles } from '../../context/ThemeContext';

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { theme } = useTheme();

  const handleResetPassword = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call - replace with your actual password reset endpoint
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      Alert.alert(
        'Reset Link Sent',
        'If an account exists with this email, you will receive a password reset link shortly.',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack()
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to send reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const styles = {
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      flex: 1,
      padding: theme.spacing.lg,
      justifyContent: 'center',
    },
    title: {
      fontSize: theme.typography.xxl.fontSize,
      fontWeight: 'bold',
      color: theme.colors.textPrimary,
      textAlign: 'center',
      marginBottom: theme.spacing.sm,
    },
    subtitle: {
      fontSize: theme.typography.md.fontSize,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginBottom: theme.spacing.xl,
      lineHeight: theme.typography.md.lineHeight,
    },
    input: {
      ...commonStyles.input(theme),
      marginBottom: theme.spacing.lg,
    },
    button: {
      ...commonStyles.button(theme, 'primary'),
      opacity: isLoading ? 0.7 : 1,
    },
    buttonText: {
      ...commonStyles.buttonText(theme, 'primary'),
    },
    backButton: {
      ...commonStyles.button(theme, 'secondary'),
      marginTop: theme.spacing.md,
    },
    backButtonText: {
      ...commonStyles.buttonText(theme, 'secondary'),
    },
    loadingText: {
      color: theme.colors.textInverse,
      marginLeft: theme.spacing.sm,
    },
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <View>
          <Text style={styles.title}>Reset Password</Text>
          <Text style={styles.subtitle}>
            Enter your email address and we&apos;ll send you a link to reset your password.
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Email address"
            placeholderTextColor={theme.colors.inputPlaceholder}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!isLoading}
          />

          <TouchableOpacity
            style={styles.button}
            onPress={handleResetPassword}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            disabled={isLoading}
          >
            <Text style={styles.backButtonText}>Back to Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ForgotPasswordScreen;