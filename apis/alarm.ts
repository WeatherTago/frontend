import {
  CreateAlarmRequest,
  CreateAlarmResponse,
  DeleteAlarmRequest,
  DeleteAlarmResponse,
  ReadAlarmResponse,
  UpdateAlarmRequest,
  UpdateAlarmResponse,
} from '@/types/alarm';
import { CommonResponse } from '@/types/common';
import { axiosInstance } from './axios';

export const sendPushToken = async (pushToken: string): Promise<CommonResponse<{}>> => {
  const { data } = await axiosInstance.post('/api/users/me/pushtokens', null, {
    params: { pushToken },
  });
  return data;
};

export const readAlarmList = async (): Promise<ReadAlarmResponse> => {
  const { data } = await axiosInstance.get('/api/users/me/alarms');
  return data;
};

export const createAlarm = async (body: CreateAlarmRequest): Promise<CreateAlarmResponse> => {
  const { data } = await axiosInstance.post('/api/users/me/alarms', body);
  return data;
};

export const deleteAlarm = async ({
  alarmId,
}: DeleteAlarmRequest): Promise<DeleteAlarmResponse> => {
  const { data } = await axiosInstance.delete(`/api/users/me/alarms/${alarmId}`);
  return data;
};

export const updateAlarm = async ({
  alarmId,
  body,
}: {
  alarmId: number;
  body: UpdateAlarmRequest;
}): Promise<UpdateAlarmResponse> => {
  const { data } = await axiosInstance.patch(`/api/users/me/alarms/${alarmId}`, body);
  return data;
};
