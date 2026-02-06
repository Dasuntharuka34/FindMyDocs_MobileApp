import { createContext, useContext, useEffect, useState } from 'react';
import { loginUser, registerUser } from '../services/api';
import { secureDelete, secureGet, secureSet } from '../services/storage';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const result = await secureGet('user');
      if (result.success && result.data) {
        setUser(result.data);
      }
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (nic, password) => {
    try {
      const userData = await loginUser(nic, password);
      setUser(userData.user);
      await secureSet('user', userData.user);
      await secureSet('token', userData.token);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const register = async (userData) => {
    try {
      const result = await registerUser(userData);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    setUser(null);
    await secureDelete('user');
    await secureDelete('token');
  };

  const updateUser = async (updatedUserData) => {
    setUser(updatedUserData);
    await secureSet('user', updatedUserData);
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      updateUser,
      isLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
};