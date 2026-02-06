import React, { useEffect, useState, useMemo } from 'react';
import { ActivityIndicator, Alert, FlatList, RefreshControl, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { useAuth } from '../../context/AuthContext';
import { commonStyles, useTheme } from '../../context/ThemeContext';
import { deleteUser, getUsers, resetUserPassword, updateUser } from '../../services/api';

const UserManagement = () => {
  const { user: currentUser } = useAuth();
  const { theme } = useTheme();

  const roles = ['Student', 'Lecturer', 'HOD', 'Dean', 'VC', 'Admin'];

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const loadUsers = async () => {
    try {
      const userData = await getUsers();
      // Filter out admin users so admins don't see other admins
      const filteredUsers = userData.filter(user => user.role !== 'Admin');
      setUsers(filteredUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      Alert.alert('Error', 'Failed to load users');
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await loadUsers();
      setLoading(false);
    };
    loadData();
  }, []);

  const filteredAndSortedUsers = useMemo(() => {
    let filtered = users;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.role.toLowerCase().includes(query) ||
        (user.department && user.department.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [users, searchQuery]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadUsers();
    setRefreshing(false);
  };

  const handleEditUser = async (userToEdit) => {
    let newName = userToEdit.name;
    let newRole = userToEdit.role;
    let newDepartment = userToEdit.department || '';

    // First, edit name
    Alert.prompt(
      `Edit name for ${userToEdit.name}`,
      '',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Next',
          onPress: (value) => {
            if (value && value.trim() !== '') {
              newName = value.trim();
            }
            // Then, select role
            Alert.alert(
              'Select Role',
              '',
              roles.map(role => ({
                text: role,
                onPress: () => {
                  newRole = role;
                  // Then, edit department
                  Alert.prompt(
                    'Edit Department',
                    '',
                    [
                      { text: 'Cancel', style: 'cancel' },
                      {
                        text: 'Save',
                        onPress: async (deptValue) => {
                          newDepartment = deptValue ? deptValue.trim() : '';
                          // Now update
                          try {
                            const response = await updateUser(userToEdit._id, { name: newName, role: newRole, department: newDepartment });
                            if (response.message) {
                              await loadUsers();
                              Alert.alert('Success', 'User updated successfully.');
                            } else {
                              Alert.alert('Error', 'Failed to update user');
                            }
                          } catch (error) {
                            console.error("Error editing user:", error);
                            Alert.alert('Error', 'Network error during user update');
                          }
                        }
                      }
                    ],
                    'plain-text',
                    newDepartment
                  );
                }
              })).concat([{ text: 'Cancel', style: 'cancel' }])
            );
          }
        }
      ],
      'plain-text',
      newName
    );
  };

  const handleDeleteUser = async (userId, userName) => {
    Alert.alert(
      'Delete User',
      `Are you sure you want to delete ${userName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await deleteUser(userId);
              // Backend returns { message: "User removed successfully" } on success
              if (response.message) {
                await loadUsers();
                Alert.alert('Success', response.message);
              } else {
                Alert.alert('Error', 'Failed to delete user');
              }
            } catch (error) {
              console.error("Error deleting user:", error);
              Alert.alert('Error', 'Network error during user deletion');
            }
          }
        }
      ]
    );
  };

  const handleResetPassword = async (userId, userName) => {
    Alert.alert(
      'Reset Password',
      `Reset password for ${userName} to default?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          onPress: async () => {
            try {
              const response = await resetUserPassword(userId);
              // Backend returns { message: "Password reset message" } on success
              if (response.message) {
                Alert.alert('Success', response.message);
              } else {
                Alert.alert('Error', 'Failed to reset password.');
              }
            } catch (error) {
              console.error("Error resetting password:", error);
              Alert.alert('Error', 'Network error during password reset');
            }
          }
        }
      ]
    );
  };

  const renderUserItem = ({ item }) => (
    <View style={[commonStyles.card(theme), { marginBottom: theme.spacing.md }]}>
      <View style={{ flex: 1 }}>
        <Text style={commonStyles.text(theme, 'primary', 'md')}>{item.name}</Text>
        <Text style={commonStyles.text(theme, 'secondary', 'sm')}>{item.email}</Text>
        <Text style={commonStyles.text(theme, 'secondary', 'sm')}>Role: {item.role}</Text>
        {item.department && (
          <Text style={commonStyles.text(theme, 'secondary', 'sm')}>Dept: {item.department}</Text>
        )}
      </View>

      <View style={{ flexDirection: 'row', gap: 8, marginTop: theme.spacing.md }}>
        <TouchableOpacity
          onPress={() => handleEditUser(item)}
          style={[commonStyles.button(theme, 'primary'), { padding: theme.spacing.sm }]}
        >
          <Text style={commonStyles.buttonText(theme, 'primary')}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleDeleteUser(item._id, item.name)}
          style={[commonStyles.button(theme, 'error'), { padding: theme.spacing.sm }]}
        >
          <Text style={commonStyles.buttonText(theme, 'error')}>Delete</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleResetPassword(item._id, item.name)}
          style={[commonStyles.button(theme, 'warning'), { padding: theme.spacing.sm }]}
        >
          <Text style={commonStyles.buttonText(theme, 'warning')}>Reset PW</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

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
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.secondary,
      borderRadius: theme.borderRadius.md,
      backgroundColor: theme.colors.surface,
    },
    searchInput: {
      flex: 1,
      padding: theme.spacing.md,
      color: theme.colors.primary,
      fontSize: theme.typography.md.fontSize,
    },
    clearButton: {
      padding: theme.spacing.sm,
      marginRight: theme.spacing.sm,
    },
    clearButtonText: {
      color: theme.colors.secondary,
      fontSize: theme.typography.lg.fontSize,
    },
    countText: {
      ...commonStyles.text(theme, 'secondary', 'md'),
      textAlign: 'center',
      marginBottom: theme.spacing.md,
    },
    emptyContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: theme.spacing.xl,
    },
    emptyText: {
      ...commonStyles.text(theme, 'secondary', 'md'),
      textAlign: 'center',
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
    <View style={styles.container}>
      <Text style={styles.header}>User Management</Text>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search users by name, email, role, or department..."
          placeholderTextColor={theme.colors.secondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            onPress={() => setSearchQuery('')}
            style={styles.clearButton}
          >
            <Text style={styles.clearButtonText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.countText}>
        {filteredAndSortedUsers.length} users found
      </Text>

      <FlatList
        data={filteredAndSortedUsers}
        renderItem={renderUserItem}
        keyExtractor={item => item._id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {searchQuery ? 'No users match your search' : 'No approved users found'}
            </Text>
          </View>
        }
        contentContainerStyle={{ paddingBottom: theme.spacing.xl }}
      />
    </View>
  );
};

export default UserManagement;
