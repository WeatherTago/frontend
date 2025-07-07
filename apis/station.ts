import { StationResult } from '@/types/station';
import { axiosInstance } from './axios';

interface SearchStationResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: StationResult;
}

export const fetchStationByIdAndTime = async (params: {
  stationId: number;
  time: string; // ISO 8601 string
}): Promise<StationResult | null> => {
  try {
    const response = await axiosInstance.get<SearchStationResponse>(
      '/api/station/search',
      {
        params: {
          stationId: params.stationId,
          time: params.time,
        },
        headers: {
          skipAuth: true,
        },
      }
    );

    if (response?.data?.result) {
      return response.data.result;
    } else {
      console.error('❗ 응답은 왔지만 result 없음:', response?.data);
      return null;
    }
  } catch (error: any) {
    console.log('🔥 raw error object:', error);

    if (error.response?.data) {
      console.error('🚨 API 응답 에러:', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('🚨 요청은 갔지만 응답 없음:', error.request);
    } else {
      console.error('🚨 Axios 기타 에러:', error.message);
    }
    return null;
  }
};
