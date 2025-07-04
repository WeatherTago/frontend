import { StationInfoResponse } from '@/types/station';
import { axiosInstance } from './axios';

export const getStationInfo = async (): Promise<StationInfoResponse> => {
  const { data } = await axiosInstance.get('/api/station/info');
  return data;
};
