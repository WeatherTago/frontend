import { SearchStationResponse, StationDetailInfoResponse, StationInfoResponse, StationResult } from '@/types/station';
import { axiosInstance } from './axios';

export const getStationInfo = async (): Promise<StationInfoResponse> => {
  const { data } = await axiosInstance.get('/api/station/info');
  return data;
};

export const fetchStationByIdAndTime = async (params: {
  stationId: number;
  time: string; // ISO 8601 string
}): Promise<StationResult | null> => {
  try {
    const response = await axiosInstance.get<SearchStationResponse>('/api/station/search', {
      params: {
        stationId: params.stationId,
        time: params.time,
      },
      headers: {
        skipAuth: true,
      },
    });

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
export const fetchStationDetailInfo = async (): Promise<StationDetailInfoResponse> => {
  try {
    const { data } = await axiosInstance.get('/api/station/detailInfo', {
      headers: {
        skipAuth: true, // 인증 생략 필요 시 일관성 유지
      },
    });

    return data;
  } catch (error: any) {
    console.log('🔥 raw error object:', error);

    if (error.response?.data) {
      console.error('🚨 상세역 정보 API 응답 에러:', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('🚨 요청은 갔지만 응답 없음:', error.request);
    } else {
      console.error('🚨 Axios 기타 에러:', error.message);
    }
    throw error; // 호출한 쪽에서 catch할 수 있게 throw
  }
};