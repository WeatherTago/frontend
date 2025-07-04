import axios from 'axios';
import { axiosInstance } from './axios';

interface CongestionInfo {
  level: string | null;
  rate: number | null;
}

interface WeatherInfo {
  temperature: string;
  condition: string;
}

export interface StationResult {
  stationId: number;
  name: string;
  line: string;
  stationCode: string;
  weather?: WeatherInfo;
  congestion: CongestionInfo;
  createdAt: number[]; // 예: [2025, 7, 4, 4, 40, 42, 447429005]
}

interface SearchStationResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: StationResult;
}

export const fetchStationByConditions = async (params: {
  name: string;
  line: string;
  date: string;
  time: string;
}): Promise<StationResult | null> => {
  try {
  const response = await axiosInstance.get<SearchStationResponse>(
    '/api/station/search',
    {
      params: {
        name: params.name,
        line: params.line,
        time: params.time,
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

  if (axios.isAxiosError(error)) {
    if (error.response?.data) {
      console.error('🚨 API 응답 에러:', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('🚨 요청은 갔지만 응답 없음:', error.request);
    } else {
      console.error('🚨 Axios 기타 에러:', error.message);
    }
  } else {
    console.error('🚨 Axios 외 예외 발생:', error?.message || String(error));
  }
  return null;
}
}
