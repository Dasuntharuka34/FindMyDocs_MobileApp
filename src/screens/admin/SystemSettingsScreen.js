import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { Alert, ScrollView, Switch, Text, TouchableOpacity, View } from 'react-native';
import { commonStyles, useTheme } from '../../context/ThemeContext';

const SystemSettingsScreen = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);

  // System settings state
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    autoApproval: false,
    maintenanceMode: false,
    debugMode: false,
    backupEnabled: true,
  });

  const handleSettingToggle = (settingKey) => {
    setSettings(prev => ({
      ...prev,
      [settingKey]: !prev[settingKey]
    }));
  };

  const handleSaveSettings = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert('Success', 'System settings have been updated successfully.');
    }, 1000);
  };

  const handleResetToDefaults = () => {
    Alert.alert(
      'Reset to Defaults',
      'This will reset all system settings to their default values. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            setSettings({
              emailNotifications: true,
              pushNotifications: false,
              autoApproval: false,
              maintenanceMode: false,
              debugMode: false,
              backupEnabled: true,
            });
            Alert.alert('Success', 'Settings have been reset to defaults.');
          }
        }
      ]
    );
  };

  const settingItems = [
    {
      title: 'Email Notifications',
      description: 'Send email notifications for system events',
      key: 'emailNotifications',
      type: 'toggle'
    },
    {
      title: 'Push Notifications',
      description: 'Enable push notifications for mobile devices',
      key: 'pushNotifications',
      type: 'toggle'
    },
    {
      title: 'Auto Approval',
      description: 'Automatically approve low-risk requests',
      key: 'autoApproval',
      type: 'toggle'
    },
    {
      title: 'Maintenance Mode',
      description: 'Put system in maintenance mode',
      key: 'maintenanceMode',
      type: 'toggle'
    },
    {
      title: 'Debug Mode',
      description: 'Enable debug logging and features',
      key: 'debugMode',
      type: 'toggle'
    },
    {
      title: 'Automatic Backup',
      description: 'Enable automatic database backups',
      key: 'backupEnabled',
      type: 'toggle'
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
    sectionTitle: {
      ...commonStyles.text(theme, 'primary', 'lg'),
      fontWeight: '600',
      marginBottom: theme.spacing.md,
      marginTop: theme.spacing.lg,
    },
    settingCard: {
      ...commonStyles.card(theme),
      marginBottom: theme.spacing.md,
      padding: theme.spacing.md,
    },
    settingContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    settingTextContainer: {
      flex: 1,
      marginRight: theme.spacing.md,
    },
    settingTitle: {
      ...commonStyles.text(theme, 'primary', 'md'),
      fontWeight: '600',
      marginBottom: theme.spacing.xs,
    },
    settingDescription: {
      ...commonStyles.text(theme, 'secondary', 'sm'),
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: theme.spacing.xl,
    },
    button: {
      flex: 1,
      marginHorizontal: theme.spacing.xs,
    },
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>System Settings</Text>

      <Text style={styles.sectionTitle}>General Settings</Text>

      {settingItems.map((item, index) => (
        <View key={index} style={styles.settingCard}>
          <View style={styles.settingContent}>
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingTitle}>{item.title}</Text>
              <Text style={styles.settingDescription}>{item.description}</Text>
            </View>
            <Switch
              value={settings[item.key]}
              onValueChange={() => handleSettingToggle(item.key)}
              trackColor={{ false: '#767577', true: theme.colors.primary }}
              thumbColor={settings[item.key] ? theme.colors.primary : '#f4f3f4'}
            />
          </View>
        </View>
      ))}

      <View style={styles.buttonContainer}>
        <View style={styles.button}>
          <TouchableOpacity
            style={[commonStyles.button(theme, 'secondary'), { width: '100%' }]}
            onPress={handleResetToDefaults}
            disabled={isLoading}
          >
            <Text style={commonStyles.buttonText(theme, 'secondary')}>Reset to Defaults</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.button}>
          <TouchableOpacity
            style={[commonStyles.button(theme, 'primary'), { width: '100%' }]}
            onPress={handleSaveSettings}
            disabled={isLoading}
          >
            <Text style={commonStyles.buttonText(theme, 'primary')}>
              {isLoading ? 'Saving...' : 'Save Settings'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default SystemSettingsScreen;
