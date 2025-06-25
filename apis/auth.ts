import { KakaoLoginRequest, KakaoLoginResponse } from '../types/auth';

export async function loginKakao(payload: KakaoLoginRequest): Promise<KakaoLoginResponse> {
  const API_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

  try {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('서버 응답 에러:', errorText);
      throw new Error(`카카오 로그인 실패: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.error('네트워크 또는 파싱 오류:', err);
    throw new Error('카카오 로그인 중 문제가 발생했습니다. 다시 시도해 주세요.');
  }
}
