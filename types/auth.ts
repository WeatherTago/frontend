export interface User {
  userId: number;
  newUser: boolean;
}

export interface AuthContextType {
  user: User | null;
  login: (token: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

export interface KakaoLoginRequest {
  accessToken: string;
}

export interface KakaoLoginResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    userId: number;
    accessToken: string;
    refreshToken: string;
    newUser: boolean;
  };
}
