import axios, { AxiosRequestConfig } from 'axios';
import * as SecureStore from 'expo-secure-store';

export const axiosInstance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_BASE_URL,
});

axiosInstance.interceptors.request.use(
  async config => {
    const accessToken = await SecureStore.getItemAsync('accessToken');

    if (accessToken && !config.headers?.skipAuth) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    if (config.headers?.skipAuth) {
      delete config.headers.skipAuth;
    }

    return config;
  },
  async error => {
    return Promise.reject(error);
  },
);

interface CustomInternalAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

let refreshPromise: Promise<string> | null = null;

axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest: CustomInternalAxiosRequestConfig = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      if (originalRequest.url === '/api/auth/reissue') {
        await SecureStore.deleteItemAsync('accessToken');
        await SecureStore.deleteItemAsync('refreshToken');
        return Promise.reject(error); // ✅ 그대로 두기
      }

      originalRequest._retry = true;

      if (!refreshPromise) {
        refreshPromise = (async () => {
          const refreshToken = await SecureStore.getItemAsync('refreshToken');

          const { data } = await axiosInstance.post('/api/auth/reissue', {
            refreshToken,
          });

          await SecureStore.setItemAsync('accessToken', data.result.accessToken);
          await SecureStore.setItemAsync('refreshToken', data.result.refreshToken);

          if (__DEV__) {
            console.log('✅ 액세스 토큰 재발급 성공:', data.result.accessToken);
          }

          return data.result.accessToken;
        })()
          .catch((err: any) => {
            if (__DEV__) {
              if (err.response) {
                console.error('Refresh token expired:', {
                  status: err.response.status,
                  data: err.response.data,
                  headers: err.response.headers,
                });
              } else {
                console.error('Refresh token error (no response):', err.message || err);
              }
            }
            SecureStore.deleteItemAsync('accessToken');
            SecureStore.deleteItemAsync('refreshToken');
            throw new Error('refresh token expired'); // ✅ 명시적으로 예외 던지기
          })
          .finally(() => {
            refreshPromise = null;
          });
      }

      return refreshPromise
        .then(newAccessToken => {
          originalRequest.headers = {
            ...originalRequest.headers,
            Authorization: `Bearer ${newAccessToken}`,
          };
          return axiosInstance.request(originalRequest); // ✅ 반드시 리턴해야 함
        })
        .catch(err => {
          return Promise.reject(err); // ✅ 빠지면 undefined로 떨어짐
        });
    }

    return Promise.reject(error); // ✅ 마지막 fallback 필수
  },
);
