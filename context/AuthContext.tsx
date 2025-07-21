import { deleteAllAlarms } from '@/apis/alarm';
import { AuthContextType, FullUser } from '@/types/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { fetchUser, loginKakao, logout as logoutApi, withdraw as withdrawApi } from '../apis/auth';
import { KakaoLoginRequest, KakaoLoginResponse } from '../types/auth';

export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  logout: () => {},
  loadUser: async () => {},
  withdraw: async () => {},
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
        if (__DEV__) {
          console.error('로그인 실패:', err);
        }
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
      if(__DEV__){
        console.error('로그아웃 중 에러 발생:', error);
      }
       Alert.alert('로그아웃 실패', '다시 시도해주세요.');
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
      if (__DEV__){
        console.error('사용자 정보 로드 중 에러 발생:', err);
      }
      Alert.alert('사용자 정보 로드 실패', '다시 시도해 주세요.');
    } finally {
      setLoading(false);
      setIsAuthReady(true);
    }
  };

  const withdraw = async () => {
    try {
      // 1. 알림 삭제 먼저 시도
      await deleteAllAlarms();

      // 2. 탈퇴 시도 (실패하더라도 에러를 따로 처리)
      try {
        await withdrawApi();
      } catch (apiError: any) {
        console.warn('탈퇴 API 에러 발생:', apiError);
        // USER4041 에러는 무시 (이미 탈퇴된 상태로 간주)
        if (apiError?.response?.data?.code !== 'USER4041') {
          throw apiError; // 진짜 에러일 경우만 throw
        }
      }

      // 3. 로컬 데이터 정리
      setUser(null);
      await Promise.all([
        SecureStore.deleteItemAsync('accessToken'),
        SecureStore.deleteItemAsync('refreshToken'),
        AsyncStorage.removeItem('user'),
      ]);

      Alert.alert('탈퇴 완료', '정상적으로 탈퇴되었습니다.');
    } catch (error) {
      if(__DEV__){
        console.error('회원 탈퇴 중 에러 발생:', error);
      }
      Alert.alert('회원 탈퇴 실패', '다시 시도해 주세요.');
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, loadUser, withdraw, loading, isAuthReady }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
