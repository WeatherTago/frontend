import { CommonResponse } from './common';

export type AuthUser = {
  userId: number;
  newUser: boolean;
};

export type UserProfile = {
  nickname: string;
  email: string;
};

export type FullUser = AuthUser & Partial<UserProfile>;

export type AuthContextType = {
  user: FullUser | null;
  login: (token: string) => Promise<void>;
  logout: () => void;
  loadUser: () => Promise<void>;
  loading: boolean;
  isAuthReady: boolean;
};

export type KakaoLoginRequest = {
  accessToken: string;
};

export type KakaoLoginResponse = CommonResponse<{
  userId: number;
  accessToken: string;
  refreshToken: string;
  newUser: boolean;
}>;

export type FetchUserResponse = CommonResponse<UserProfile>;
