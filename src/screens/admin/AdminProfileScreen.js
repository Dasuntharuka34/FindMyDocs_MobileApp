import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { commonStyles, useTheme } from '../../context/ThemeContext';

const AdminProfileScreen = () => {
  const navigation = useNavigation();
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);



  const handleManageUsers = () => {
    Alert.alert('Navigate', 'Navigate to User Management');
  };

  const handleSystemSettings = () => {
    navigation.navigate('SystemSettings');
  };

  const handleViewAuditLog = () => {
    Alert.alert('Navigate', 'Navigate to Audit Log');
  };

  const adminActions = [
    {
      title: 'User Management',
      description: 'Manage all system users',
      icon: '👥',
      color: 'primary',
      onPress: handleManageUsers
    },
    {
      title: 'Registration Approvals',
      description: 'Review pending registrations',
      icon: '📋',
      color: 'warning',
      onPress: () => Alert.alert('Navigate', 'Navigate to Registration Requests')
    },
    {
      title: 'System Settings',
      description: 'Configure system preferences',
      icon: '⚙️',
      color: 'info',
      onPress: handleSystemSettings
    },
    {
      title: 'View Audit Log',
      description: 'Review system activity',
      icon: '📊',
      color: 'success',
      onPress: handleViewAuditLog
    }
  ];

  const styles = {
    container: {
      ...commonStyles.container(theme),
      paddingTop: theme.spacing.xl,
      paddingLeft: theme.spacing.md,
      paddingRight: theme.spacing.md,
      paddingBottom: theme.spacing.xxl,
    },
    header: {
      ...commonStyles.text(theme, 'primary', 'xl'),
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: theme.spacing.lg,
    },
    profileCard: {
      ...commonStyles.card(theme),
      marginBottom: theme.spacing.xl,
      alignItems: 'center',
    },
    profileIcon: {
      fontSize: 48,
      marginBottom: theme.spacing.md,
    },
    profileName: {
      ...commonStyles.text(theme, 'primary', 'lg'),
      fontWeight: 'bold',
      marginBottom: theme.spacing.xs,
    },
    profileDetail: {
      ...commonStyles.text(theme, 'secondary', 'sm'),
      marginBottom: theme.spacing.xs,
    },
    sectionTitle: {
      ...commonStyles.text(theme, 'primary', 'lg'),
      fontWeight: '600',
      marginBottom: theme.spacing.md,
    },
    actionCard: {
      ...commonStyles.card(theme),
      marginBottom: theme.spacing.md,
    },
    actionContent: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    actionIcon: {
      fontSize: 24,
      marginRight: theme.spacing.md,
    },
    actionTextContainer: {
      flex: 1,
    },
    actionTitle: {
      ...commonStyles.text(theme, 'primary', 'md'),
      fontWeight: '600',
      marginBottom: theme.spacing.xs,
    },
    actionDescription: {
      ...commonStyles.text(theme, 'secondary', 'sm'),
    },
      logoutButton: {
        marginTop: theme.spacing.xl,
        marginBottom: theme.spacing.xxl,
      },
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Admin Profile</Text>

      <View style={styles.profileCard}>
        <Text style={styles.profileIcon}>👨‍💼</Text>
        <Text style={styles.profileName}>{user?.name}</Text>
        <Text style={styles.profileDetail}>Email: {user?.email}</Text>
        <Text style={styles.profileDetail}>Role: {user?.role}</Text>
        <Text style={styles.profileDetail}>User ID: {user?._id}</Text>
      </View>

      <Text style={styles.sectionTitle}>Admin Actions</Text>

      {adminActions.map((action, index) => (
        <TouchableOpacity
          key={index}
          style={styles.actionCard}
          onPress={action.onPress}
          disabled={isLoading}
        >
          <View style={styles.actionContent}>
            <Text style={styles.actionIcon}>{action.icon}</Text>
            <View style={styles.actionTextContainer}>
              <Text style={styles.actionTitle}>{action.title}</Text>
              <Text style={styles.actionDescription}>{action.description}</Text>
            </View>
            <TouchableOpacity
              style={[commonStyles.button(theme, action.color), { padding: theme.spacing.sm }]}
            >
              <Text style={commonStyles.buttonText(theme, action.color)}>Go</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      ))}

      <View style={styles.logoutButton}>
        <TouchableOpacity
          style={[commonStyles.button(theme, 'error'), { width: '100%' }]}
          onPress={logout}
        >
          <Text style={commonStyles.buttonText(theme, 'error')}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default AdminProfileScreen;
