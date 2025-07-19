import {
  FetchUserResponse,
  KakaoLoginRequest,
  KakaoLoginResponse,
  LogoutResponse,
} from '../types/auth';
import { CommonResponse } from '../types/common';
import { axiosInstance } from './axios';

export const loginKakao = async (body: KakaoLoginRequest): Promise<KakaoLoginResponse> => {
  const { data } = await axiosInstance.post('/api/auth/login', body);
  return data;
};

export const fetchUser = async (): Promise<FetchUserResponse> => {
  const { data } = await axiosInstance.get('/api/users/me');
  return data;
};

export const logout = async (): Promise<LogoutResponse> => {
  const { data } = await axiosInstance.post('/api/auth/logout');
  return data;
};

export const withdraw = async (): Promise<CommonResponse<{}>> => {
  const { data } = await axiosInstance.delete('/api/users/withdraw');
  return data;
};
