import React, { useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const LoginScreen = ({ navigation }) => {
  const [nic, setNic] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { theme } = useTheme();

  const styles = {
    // ... (keep existing styles, no changes needed to styles object)
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      padding: theme.spacing.lg,
    },
    header: {
      alignItems: 'center',
      marginBottom: theme.spacing.xxl,
      marginTop: theme.spacing.xl,
    },
    title: {
      fontSize: theme.typography.xxxl.fontSize,
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
      marginBottom: theme.spacing.lg,
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
    button: {
      backgroundColor: theme.colors.primary,
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      alignItems: 'center',
      marginTop: theme.spacing.sm,
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
      marginTop: theme.spacing.xl,
      alignItems: 'center',
    },
    footerText: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.sm.fontSize,
    },
    registerLink: {
      color: theme.colors.primary,
      fontWeight: '600',
    },
    errorText: {
      color: theme.colors.error,
      fontSize: theme.typography.sm.fontSize,
      marginTop: theme.spacing.xs,
      textAlign: 'center',
    },
  };

  const handleLogin = async () => {
    if (!nic || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);

    const result = await login(nic, password);

    setIsLoading(false);

    if (result.success) {
      // Navigation will automatically switch to MainNavigator via AuthContext
      // No need to manually navigate
    } else {
      Alert.alert('Login Failed', result.error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.header}>
          <Text style={styles.title}>Find My Docs</Text>
          <Text style={styles.subtitle}>Sign in to your account</Text>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="NIC"
            placeholderTextColor={theme.colors.inputPlaceholder}
            value={nic}
            onChangeText={setNic}
            autoCapitalize="none"
            autoCorrect={false}
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor={theme.colors.inputPlaceholder}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
          />
        </View>

        <TouchableOpacity
          style={[styles.button, (!nic || !password || isLoading) && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={!nic || !password || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={theme.colors.textInverse} />
          ) : (
            <Text style={styles.buttonText}>Sign In</Text>
          )}
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Don&apos;t have an account?{' '}
            <Text
              style={styles.registerLink}
              onPress={() => navigation.navigate('Register')}
            >
              Sign up
            </Text>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;