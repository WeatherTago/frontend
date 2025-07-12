import { axiosInstance } from './axios';

export interface Notice {
  noticeId: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

interface NoticeListResponse {
  isSuccess: boolean;
  result: Notice[];
}

// 전체 공지사항 조회
export const fetchNotices = async (): Promise<Notice[]> => {
  const response = await axiosInstance.get<NoticeListResponse>('/api/notice');
  return response.data.result;
};

// 특정 공지사항 조회
export const fetchNoticeById = async (id: number): Promise<Notice> => {
  const response = await axiosInstance.get(`/api/notice/${id}`);
  return response.data.result;
};
