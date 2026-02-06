import React, { useState } from 'react';
import { ActivityIndicator, Alert, Image, KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { commonStyles, useTheme } from '../../context/ThemeContext';
import { updateUserProfile } from '../../services/api';
import { pickImage } from '../../utils/fileUpload';
import Modal from '../../components/ui/Modal';

const ProfileScreen = ({ navigation }) => {
  const { user, logout, updateUser } = useAuth();
  const { theme, toggleTheme, getThemeName } = useTheme();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageKey, setImageKey] = useState(Date.now()); // Force image refresh
  const [imageError, setImageError] = useState(false);
  const [imageModalVisible, setImageModalVisible] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    await logout();
    setLoading(false);
    // Navigation will automatically switch to AuthNavigator via AuthContext
  };

  const confirmLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: handleLogout }
      ]
    );
  };

  const handlePickImage = async () => {
    try {
      const result = await pickImage();
      if (!result.success) {
        Alert.alert('Image Picker Error', result.error);
        return;
      }
      setUploading(true);
      const formData = new FormData();
      formData.append('profilePicture', {
        uri: result.data.uri,
        name: result.data.name,
        type: result.data.type || 'image/jpeg',
      });
      // Optionally add other user data if needed
      const updatedUser = await updateUserProfile(user._id, formData);
      if (updatedUser) {
        console.log('Updated user data:', updatedUser);
        console.log('Profile picture path:', updatedUser.profilePicture);
        Alert.alert('Success', 'Profile picture updated successfully');
        updateUser(updatedUser); // Update user context
        setImageKey(Date.now()); // Force image refresh
        setImageError(false); // Reset error state
      }
    } catch (error) {
      Alert.alert('Upload Error', error.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const profileSections = [
    {
      title: 'Personal Information',
      items: [
        { label: 'Name', value: user?.name },
        { label: 'Email', value: user?.email },
        { label: 'Role', value: user?.role },
        { label: 'NIC', value: user?.nic },
        { label: 'Mobile', value: user?.mobile },
      ]
    },
    {
      title: 'Academic Information',
      items: [
        { label: 'Department', value: user?.department },
        { label: 'Index Number', value: user?.indexNumber || 'N/A' },
      ]
    }
  ];

  const actions = [
    {
      label: 'Edit Profile',
      onPress: () => navigation.navigate('EditProfile'),
      color: theme.colors.primary,
    },
    {
      label: 'Change Password',
      onPress: () => navigation.navigate('ChangePassword'),
      color: theme.colors.info,
    },
    {
      label: 'Switch Theme',
      onPress: toggleTheme,
      color: theme.colors.secondary,
    },
    {
      label: 'Logout',
      onPress: confirmLogout,
      color: theme.colors.error,
    },
    {
      label: 'Contact Support',
      onPress: () => navigation.navigate('ContactSupport'),
      color: theme.colors.info,
    }
  ];

  const styles = {
    container: {
      ...commonStyles.container(theme),
      padding: theme.spacing.md,
    },
    header: {
      ...commonStyles.text(theme, 'primary', 'xxl'),
      fontWeight: 'bold',
      textAlign: 'center',
      marginTop: theme.spacing.lg,
      marginBottom: theme.spacing.xl,
    },
    profilePictureSection: {
      alignItems: 'center',
      marginBottom: theme.spacing.md,
    },
    profilePictureContainer: {
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: theme.colors.backgroundSecondary,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
      borderWidth: 2,
      borderColor: theme.colors.border,
    },
    profilePicture: {
      width: 120,
      height: 120,
      borderRadius: 60,
    },
    profilePicturePlaceholder: {
      ...commonStyles.text(theme, 'secondary', 'xl'),
      fontSize: 48,
    },
    uploadButton: {
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.lg,
      backgroundColor: theme.colors.primary,
      alignItems: 'center',
      minWidth: 150,
    },
    uploadButtonText: {
      ...commonStyles.text(theme, 'textInverse', 'md'),
      fontWeight: '600',
    },
    section: {
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
    infoItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: theme.spacing.md,
      backgroundColor: theme.colors.backgroundSecondary,
      borderRadius: theme.borderRadius.md,
      marginBottom: theme.spacing.sm,
    },
    infoLabel: {
      ...commonStyles.text(theme, 'secondary', 'sm'),
      fontWeight: '500',
    },
    infoValue: {
      ...commonStyles.text(theme, 'primary', 'sm'),
    },
    actionButton: {
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.md,
      marginBottom: theme.spacing.sm,
      alignItems: 'center',
    },
    actionText: {
      ...commonStyles.text(theme, 'textInverse', 'md'),
      fontWeight: '600',
    },
    themeInfo: {
      ...commonStyles.text(theme, 'tertiary', 'sm'),
      textAlign: 'center',
      marginTop: theme.spacing.md,
    },
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView>
        <Text style={styles.header}>Profile</Text>

        {/* Profile Picture Section */}
        <View style={styles.profilePictureSection}>
          <View style={styles.profilePictureContainer}>
            {user?.profilePicture && !imageError ? (
              <TouchableOpacity onPress={() => setImageModalVisible(true)}>
                <Image
                  key={`profile-image-${imageKey}`}
                  source={{
                    uri: (() => {
                      const profilePath = user.profilePicture || '';
                      // Check if profilePicture is already a full URL (starts with http/https)
                      if (profilePath.startsWith('http://') || profilePath.startsWith('https://')) {
                        return profilePath;
                      }
                      // Otherwise, construct URL with base URL
                      const baseUrl = process.env.EXPO_PUBLIC_API_URL || 'https://find-my-docs-backend.vercel.app';
                      return `${baseUrl}${profilePath}`.replace('/api', '');
                    })(),
                    headers: {
                      'Cache-Control': 'no-cache',
                      'Pragma': 'no-cache'
                    }
                  }}
                  style={styles.profilePicture}
                  resizeMode="cover"
                  onLoad={() => {
                    setImageError(false);
                  }}
                  onError={(error) => {
                    console.log('Profile image load error:', error.nativeEvent);
                    console.log('Failed URI:', (() => {
                      const profilePath = user.profilePicture || '';
                      // Check if profilePicture is already a full URL (starts with http/https)
                      if (profilePath.startsWith('http://') || profilePath.startsWith('https://')) {
                        return profilePath;
                      }
                      // Otherwise, construct URL with base URL
                      const baseUrl = process.env.EXPO_PUBLIC_API_URL || 'https://find-my-docs-backend.vercel.app';
                      return `${baseUrl}${profilePath}`.replace('/api', '');
                    })());
                    setImageError(true);
                  }}
                />
              </TouchableOpacity>
            ) : (
              <Text style={styles.profilePicturePlaceholder}>
                {user?.name?.charAt(0)?.toUpperCase() || '?'}
              </Text>
            )}
          </View>
          <TouchableOpacity
            style={styles.uploadButton}
            onPress={handlePickImage}
            disabled={uploading}
          >
            {uploading ? (
              <ActivityIndicator size="small" color={theme.colors.textInverse} />
            ) : (
              <Text style={styles.uploadButtonText}>
                {user?.profilePicture ? 'Change Picture' : 'Add Picture'}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {profileSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            {section.items.map((item, itemIndex) => (
              <View key={itemIndex} style={styles.infoItem}>
                <Text style={styles.infoLabel}>{item.label}:</Text>
                <Text style={styles.infoValue}>{item.value || 'Not provided'}</Text>
              </View>
            ))}
          </View>
        ))}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Actions</Text>
          {actions.map((action, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.actionButton, { backgroundColor: action.color }]}
              onPress={action.onPress}
            >
              <Text style={styles.actionText}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Image Modal */}
      <Modal
        visible={imageModalVisible}
        onClose={() => setImageModalVisible(false)}
        title="Profile Picture"
        transparent={true}
        animationType="fade"
      >
        <Image
          source={{
            uri: (() => {
              const profilePath = user.profilePicture || '';
              if (profilePath.startsWith('http://') || profilePath.startsWith('https://')) {
                return profilePath;
              }
              const baseUrl = process.env.EXPO_PUBLIC_API_URL || 'https://find-my-docs-backend.vercel.app';
              return `${baseUrl}${profilePath}`.replace('/api', '');
            })(),
          }}
          style={{ width: '100%', height: 300, borderRadius: 10 }}
          resizeMode="contain"
        />
      </Modal>
    </KeyboardAvoidingView>
  );
};

export default ProfileScreen;
