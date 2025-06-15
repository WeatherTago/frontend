import { Server } from 'miragejs';

export function routes(this: Server) {
  this.namespace = 'api'; // 경로에 /api 접두사 붙임

  this.post('/login', (schema, request) => {
    const { kakaoId, nickname } = JSON.parse(request.requestBody);
    return {
      accessToken: 'accessToken',
      refreshToken: 'refreshToken',
      user: {
        id: 123,
        name: '박진주',
      },
    };
  });
}
