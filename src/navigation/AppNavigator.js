import { View } from 'react-native';
import LoadingScreen from '../components/ui/LoadingScreen';
import { useAuth } from '../context/AuthContext';
import AdminNavigator from './AdminNavigator';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';

const AppNavigator = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <View style={{ flex: 1 }}>
      {!user ? (
        <AuthNavigator />
      ) : user.role === 'Admin' ? (
        <AdminNavigator />
      ) : (
        <MainNavigator />
      )}
    </View>
  );
};

export default AppNavigator;
