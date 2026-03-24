import { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../lib/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const queryClient = useQueryClient();

  // Fetch current user
  const { data: user, isLoading, error } = useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      console.log('🔍 Fetching user profile...');
      const response = await authApi.getMe();
      console.log('✅ User profile:', response.data);
      // Save to localStorage for persistence
      localStorage.setItem('user', JSON.stringify(response.data));
      return response.data;
    },
    enabled: !!token,
    retry: 1,
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (response) => {
      console.log('✅ Login response:', response.data);
      const { token } = response.data;
      setToken(token);
      localStorage.setItem('token', token);
      // Trigger user fetch
      queryClient.invalidateQueries(['me']);
    },
  });

  // Signup mutation
  const signupMutation = useMutation({
    mutationFn: authApi.signup,
    onSuccess: (response) => {
      console.log('✅ Signup response:', response.data);
      const { token } = response.data;
      setToken(token);
      localStorage.setItem('token', token);
      // Trigger user fetch
      queryClient.invalidateQueries(['me']);
    },
  });

  // Logout
  const logout = () => {
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    queryClient.clear();
  };

  const value = {
    user,
    token,
    isLoading,
    isAuthenticated: !!token && !!user,
    login: loginMutation.mutate,
    signup: signupMutation.mutate,
    logout,
    loginError: loginMutation.error,
    signupError: signupMutation.error,
    isLoginLoading: loginMutation.isPending,
    isSignupLoading: signupMutation.isPending,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
