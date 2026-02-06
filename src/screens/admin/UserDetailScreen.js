import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { getUsers, resetUserPassword } from '../../services/api';
import { commonStyles } from '../../context/ThemeContext';

const UserDetailScreen = ({ route }) => {
  const { userId } = route.params;
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    loadUserDetails();
  }, [userId]);

  const loadUserDetails = async () => {
    try {
      setIsLoading(true);
      const users = await getUsers();
      const foundUser = users.find(u => u._id === userId);
      setUser(foundUser);
    } catch (err) {
      Alert.alert('Error', 'Failed to load user details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    Alert.alert(
      'Reset Password',
      'Reset password to default? User will need to change it on next login.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsResetting(true);
              await resetUserPassword(userId);
              Alert.alert('Success', 'Password reset successfully');
            } catch (err) {
              Alert.alert('Error', err.message);
            } finally {
              setIsResetting(false);
            }
          }
        }
      ]
    );
  };

  const handleEditUser = () => {
    // Navigate to edit user screen
  };

  const handleViewRequests = () => {
    // Navigate to user's requests
  };

  if (isLoading) {
    return (
      <View style={commonStyles.container}>
        <ActivityIndicator size="large" />
        <Text>Loading user details...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={commonStyles.container}>
        <Text>User not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={commonStyles.container}>
      <Text style={commonStyles.header}>User Details</Text>
      
      <View style={commonStyles.card}>
        <Text style={commonStyles.title}>{user.name}</Text>
        <Text style={commonStyles.text}>Email: {user.email}</Text>
        <Text style={commonStyles.text}>NIC: {user.nic}</Text>
        <Text style={commonStyles.text}>Mobile: {user.mobile}</Text>
        <Text style={commonStyles.text}>Role: {user.role}</Text>
        {user.department && <Text style={commonStyles.text}>Department: {user.department}</Text>}
        {user.indexNumber && <Text style={commonStyles.text}>Index Number: {user.indexNumber}</Text>}
        <Text style={commonStyles.text}>User ID: {user._id}</Text>
      </View>

      <View style={commonStyles.buttonGroup}>
        <TouchableOpacity
          style={[commonStyles.button, commonStyles.primaryButton]}
          onPress={handleEditUser}
        >
          <Text style={commonStyles.buttonText}>Edit User</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[commonStyles.button, commonStyles.warningButton]}
          onPress={handleResetPassword}
          disabled={isResetting}
        >
          <Text style={commonStyles.buttonText}>
            {isResetting ? 'Resetting...' : 'Reset Password'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[commonStyles.button, commonStyles.infoButton]}
          onPress={handleViewRequests}
        >
          <Text style={commonStyles.buttonText}>View Requests</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default UserDetailScreen;