import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

// Import screens

import ChangePasswordScreen from '../screens/dashboard/ChangePasswordScreen';
import DashboardScreen from '../screens/dashboard/DashboardScreen';
import EditProfileScreen from '../screens/dashboard/EditProfileScreen';
import NewRequestScreen from '../screens/dashboard/NewRequestScreen';
import NotificationsScreen from '../screens/dashboard/NotificationsScreen';
import ProfileScreen from '../screens/dashboard/ProfileScreen';
import RequestsScreen from '../screens/dashboard/RequestsScreen';
import ExcuseRequestScreen from '../screens/forms/ExcuseRequestScreen';
import LeaveRequestScreen from '../screens/forms/LeaveRequestScreen';
import LetterRequestScreen from '../screens/forms/LetterRequestScreen';
import RequestDetailScreen from '../screens/requests/RequestDetailScreen';
import ApprovalsScreen from '../screens/admin/ApprovalsScreen';
import RequestApprovalScreen from '../screens/admin/RequestApprovalScreen';
import AttachmentViewerScreen from '../screens/common/AttachmentViewerScreen';
import ContactSupportScreen from '../screens/common/ContactSupportScreen';


const Stack = createStackNavigator();

const Tab = createBottomTabNavigator();

// Main Tab Navigator
const MainTabs = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const isApprover = user && (user.role === 'Lecturer' || user.role === 'HOD' || user.role === 'Dean' || user.role === 'VC');

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Dashboard') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Requests') {
            iconName = focused ? 'document' : 'document-outline';
          } else if (route.name === 'Approvals') {
            iconName = focused ? 'checkmark-done-circle' : 'checkmark-done-circle-outline';
          } else if (route.name === 'Notifications') {
            iconName = focused ? 'notifications' : 'notifications-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,

        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarStyle: {
          paddingBottom: insets.bottom + 5,
          paddingTop: 5,
          height: 50 + insets.bottom,
          backgroundColor: theme.colors.background,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ title: 'Dashboard' }}
      />
      <Tab.Screen
        name="Requests"
        component={RequestsScreen}
        options={{ title: 'My Requests' }}
      />
      {isApprover && (
        <Tab.Screen
          name="Approvals"
          component={ApprovalsScreen}
          options={{ title: 'Approvals' }}
        />
      )}
      <Tab.Screen
        name="Notifications"

        component={NotificationsScreen}
        options={{ title: 'Notifications' }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
};

// Main Stack Navigator
const MainNavigator = () => {
  const { theme } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.primary,
        },
        headerTintColor: theme.colors.textInverse,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        gestureEnabled: true,
        animationEnabled: true,
      }}
    >
      <Stack.Screen
        name="MainTabs"
        component={MainTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{ title: 'Edit Profile' }}
      />
      <Stack.Screen
        name="ChangePassword"
        component={ChangePasswordScreen}
        options={{ title: 'Change Password' }}
      />
      <Stack.Screen
        name="NewRequest"
        component={NewRequestScreen}
        options={{ title: 'New Request' }}
      />
      <Stack.Screen
        name="RequestDetail"
        component={RequestDetailScreen}
        options={{ title: 'Request Details' }}
      />
      <Stack.Screen
        name="ExcuseRequest"
        component={ExcuseRequestScreen}
        options={{ title: 'Excuse Request' }}
      />
      <Stack.Screen
        name="LeaveRequest"
        component={LeaveRequestScreen}
        options={{ title: 'Leave Request' }}
      />
      <Stack.Screen
        name="LetterRequest"
        component={LetterRequestScreen}
        options={{ title: 'General Letter' }}
      />
      <Stack.Screen
        name="Approvals"
        component={ApprovalsScreen}
        options={{ title: 'Pending Approvals' }}
      />
      <Stack.Screen
        name="RequestApproval"
        component={RequestApprovalScreen}
        options={{ title: 'Review Request' }}
      />
      <Stack.Screen
        name="AttachmentViewer"
        component={AttachmentViewerScreen}
        options={{ title: 'View Attachment' }}
      />
      <Stack.Screen
        name="ContactSupport"
        component={ContactSupportScreen}
        options={{ title: 'Contact Support' }}
      />
    </Stack.Navigator>


  );
};

export default MainNavigator;
