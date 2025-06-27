import { AuthContextType, User } from '@/types/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import React, { createContext, useContext, useState } from 'react';
import { Alert } from 'react-native';
import { loginKakao } from '../apis/auth';
import { KakaoLoginRequest, KakaoLoginResponse } from '../types/auth';

export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  logout: () => {},
  loading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const login = async (accessToken: string) => {
    try {
      setLoading(true);
      const payload: KakaoLoginRequest = { accessToken };
      const res: KakaoLoginResponse = await loginKakao(payload);

      // TODO: remove after development
      if (__DEV__) {
        console.log('로그인 응답:', res);
      }

      const userData: User = {
        userId: res.result.userId,
        newUser: res.result.newUser,
      };

      setUser(userData);

      await Promise.all([
        SecureStore.setItemAsync('accessToken', res.result.accessToken),
        SecureStore.setItemAsync('refreshToken', res.result.refreshToken),
        AsyncStorage.setItem('user', JSON.stringify(userData)),
      ]);
    } catch (err) {
      console.error('로그인 실패:', err);
      Alert.alert('로그인 실패', '다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setUser(null);
    await Promise.all([
      SecureStore.deleteItemAsync('accessToken'),
      SecureStore.deleteItemAsync('refreshToken'),
      AsyncStorage.removeItem('user'),
    ]);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
