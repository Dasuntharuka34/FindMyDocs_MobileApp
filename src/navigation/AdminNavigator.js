import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';

// Import admin screens
import AdminDashboardScreen from '../screens/admin/AdminDashboardScreen';
import AdminProfileScreen from '../screens/admin/AdminProfileScreen';
import ApprovalQueueScreen from '../screens/admin/ApprovalQueueScreen';
import RegistrationRequestsScreen from '../screens/admin/RegistrationRequests';
import SystemSettingsScreen from '../screens/admin/SystemSettingsScreen';
import UserDetailScreen from '../screens/admin/UserDetailScreen';
import UserManagementScreen from '../screens/admin/UserManagement';
import AllRequestsScreen from '../screens/admin/AllRequestsScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Admin Tab Navigator
const AdminTabs = () => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'AdminDashboard') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'UserManagement') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'RegistrationRequests') {
            iconName = focused ? 'person-add' : 'person-add-outline';
          } else if (route.name === 'AllRequests') {
            iconName = focused ? 'document-text' : 'document-text-outline';
          } else if (route.name === 'AdminProfile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarStyle: {
          paddingBottom: insets.bottom + 5,
          paddingTop: 5,
          height: 60 + insets.bottom,
          backgroundColor: theme.colors.background,
        },
        headerShown: false,
      })}
    >

      <Tab.Screen
        name="AdminDashboard"
        component={AdminDashboardScreen}
        options={{ title: 'Dashboard' }}
      />
      <Tab.Screen
        name="UserManagement"
        component={UserManagementScreen}
        options={{ title: 'Users' }}
      />
      <Tab.Screen
        name="RegistrationRequests"
        component={RegistrationRequestsScreen}
        options={{ title: 'Registrations' }}
      />
      <Tab.Screen
        name="AllRequests"
        component={AllRequestsScreen}
        options={{ title: 'All Requests' }}
      />
      <Tab.Screen
        name="AdminProfile"
        component={AdminProfileScreen}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
};

// Admin Stack Navigator
const AdminNavigator = () => {
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
        name="AdminTabs"
        component={AdminTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="UserDetail"
        component={UserDetailScreen}
        options={{ title: 'User Details' }}
      />
      <Stack.Screen
        name="SystemSettings"
        component={SystemSettingsScreen}
        options={{ title: 'System Settings' }}
      />
      <Stack.Screen
        name="AllRequests"
        component={AllRequestsScreen}
        options={{ title: 'All Student Requests' }}
      />
    </Stack.Navigator>
  );
};

export default AdminNavigator;