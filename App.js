import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';
import { NotificationsProvider } from './src/context/NotificationsContext';
import { RequestsProvider } from './src/context/RequestsContext';
import { ThemeProvider } from './src/context/ThemeContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <ThemeProvider>
          <AuthProvider>
            <RequestsProvider>
              <NotificationsProvider>
                <StatusBar style="auto" />
                <AppNavigator />
              </NotificationsProvider>
            </RequestsProvider>
          </AuthProvider>
        </ThemeProvider>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
