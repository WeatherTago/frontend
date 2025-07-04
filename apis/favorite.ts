import { CommonResponse } from '@/types/common';
import { AddFavoriteRequest, MyFavoriteResponse } from '@/types/favorite';
import { axiosInstance } from './axios';

export const addFavorite = async ({
  stationName,
  stationLine,
}: AddFavoriteRequest): Promise<CommonResponse> => {
  const { data } = await axiosInstance.post('/api/users/me/favorite', { stationName, stationLine });
  return data;
};

export const deleteFavorite = async ({
  stationName,
  stationLine,
}: AddFavoriteRequest): Promise<CommonResponse> => {
  const { data } = await axiosInstance.delete('/api/users/me/favorite', {
    data: { stationName, stationLine },
  });
  return data;
};

export const myFavorite = async (): Promise<MyFavoriteResponse> => {
  const { data } = await axiosInstance.get('/api/users/me/favorite');
  return data;
};
