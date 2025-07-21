import { CommonResponse } from './common';

export type UserInfo = {
  nickname: string;
  email: string;
};

export type ReadUserResponse = CommonResponse<UserInfo>;
