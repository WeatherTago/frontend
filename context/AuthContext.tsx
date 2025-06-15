import { AuthContextType, User } from '@/types/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import React, { createContext, useState } from 'react';
import { Alert } from 'react-native';

export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const fakeKakaoUser = {
    kakaoToken: 'kakaoToken',
    kakaoId: 1,
    nickname: '박진주',
  };

  const login = () => {
    fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify(fakeKakaoUser),
    })
      .then(res => {
        if (res.status >= 400) {
          return Alert.alert('Error', 'Invalid credentials');
        }
        return res.json();
      })
      .then(data => {
        setUser(data.user);
        return Promise.all([
          SecureStore.setItemAsync('accessToken', data.accessToken),
          SecureStore.setItemAsync('refreshToken', data.refreshToken),
          AsyncStorage.setItem('user', JSON.stringify(data.user)),
        ]);
      })
      .catch(err => console.error('로그인 실패:', err));
  };

  const logout = () => {
    setUser(null);
    SecureStore.deleteItemAsync('accessToken');
    SecureStore.deleteItemAsync('refreshToken');
    AsyncStorage.removeItem('user');
  };

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
};
