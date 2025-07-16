import { AuthContextType, FullUser } from '@/types/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { fetchUser, loginKakao, logout as logoutApi } from '../apis/auth';
import { KakaoLoginRequest, KakaoLoginResponse } from '../types/auth';

export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  logout: () => {},
  loadUser: async () => {},
  loading: true,
  isAuthReady: false,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<FullUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthReady, setIsAuthReady] = useState(false);

  const login = async (accessToken: string) => {
    try {
      setLoading(true);
      const body: KakaoLoginRequest = { accessToken };
      const res: KakaoLoginResponse = await loginKakao(body);

      // TODO: remove after development
      if (__DEV__) {
        console.log('로그인 응답:', res);
      }

      const userData: FullUser = {
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
      setIsAuthReady(true);
    }
  };

  const logout = async () => {
    try {
      await logoutApi();
      setUser(null);
      await Promise.all([
        SecureStore.deleteItemAsync('accessToken'),
        SecureStore.deleteItemAsync('refreshToken'),
        AsyncStorage.removeItem('user'),
      ]);
    } catch (error) {
      console.error('로그아웃 중 에러 발생:', error);
      Alert.alert('로그아웃 실패', '다시 시도해 주세요.');
    }
  };

  const loadUser = async () => {
    try {
      const user = await AsyncStorage.getItem('user');
      const parsed = user ? JSON.parse(user) : null;

      if (parsed) {
        const profile = await fetchUser();
        setUser({ ...parsed, ...profile });
      }
    } catch (err) {
      console.error('사용자 정보 로드 중 에러 발생:', err);
      Alert.alert('사용자 정보 로드 실패', '다시 시도해 주세요.');
    } finally {
      setLoading(false);
      setIsAuthReady(true);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, loadUser, loading, isAuthReady }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
