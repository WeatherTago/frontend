export type CommonResponse<T = any> = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
};

export type StationInfo = {
  stationId: number;
  stationName: string;
  stationLine: string;
};
