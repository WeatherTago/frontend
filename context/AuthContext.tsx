import React, { createContext, useState } from 'react';

interface User {
  id: number;
  name: string;
}

interface AuthContextType {
  user: User | null;
  login: () => void;
  logout: () => void;
}

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
      .then(res => res.json())
      .then(data => {
        setUser(data.user);
        console.log('로그인 성공:', data);
      })
      .catch(err => console.error('로그인 실패:', err));
  };

  const logout = () => {
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
};
