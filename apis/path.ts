import { axiosInstance } from './axios';

export const fetchSubwayPath = async ({
  startStationId,
  endStationId,
  time,
}: {
  startStationId: number;
  endStationId: number;
  time: string;
}) => {
  const response = await axiosInstance.get('/api/subway/path', {
    params: { startStationId, endStationId, time },
  });
  return response.data.result;
};
