import { ReadUserResponse } from '@/types/user';
import { axiosInstance } from './axios';

export const readUser = async (): Promise<ReadUserResponse> => {
  const { data } = await axiosInstance.get('/api/users/me');
  return data;
};
