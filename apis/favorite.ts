import { CommonResponse } from '@/types/common';
import { AddFavoriteRequest, MyFavoriteResponse } from '@/types/favorite';
import { axiosInstance } from './axios';

export const addFavorite = async ({ stationId }: AddFavoriteRequest): Promise<CommonResponse> => {
  const { data } = await axiosInstance.post('/api/users/me/favorite', { stationId });
  return data;
};

export const deleteFavorite = async ({
  stationId,
}: AddFavoriteRequest): Promise<CommonResponse> => {
  const { data } = await axiosInstance.delete('/api/users/me/favorite', {
    data: { stationId },
  });
  return data;
};

export const myFavorite = async (): Promise<MyFavoriteResponse> => {
  const { data } = await axiosInstance.get('/api/users/me/favorite');
  return data;
};
