import { StationStatusResponse } from '@/types/station';
import { axiosInstance } from './axios';

export const fetchStationStatus = async (
  stationId: number
): Promise<StationStatusResponse> => {
  const response = await axiosInstance.get<StationStatusResponse>(
    '/api/station/status',
    {
      params: { stationId },
    }
  );
  return response.data;
};
