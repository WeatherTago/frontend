export type CommonResponse<T = any> = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
};
