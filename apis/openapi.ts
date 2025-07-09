const DATA_GOKR_BASE = process.env.EXPO_PUBLIC_DATA_GOKR_BASE!;
const DATA_GOKR_API_KEY = process.env.EXPO_PUBLIC_DATA_GOKR_API_KEY!;

/**
 * 공통 API 호출 함수
 */
  const fetchFromDataGokr = async (endpoint: string, stationName: string) => {
  const url = `${DATA_GOKR_BASE}/${endpoint}?serviceKey=${encodeURIComponent(
    DATA_GOKR_API_KEY
  )}&dataType=JSON&pageNo=1&numOfRows=1000&stnNm=${encodeURIComponent(stationName.trim())}`;

  try {
    const res = await fetch(url);
    const text = await res.text();

    // XML 응답 처리
    if (text.startsWith('<')) {
      console.error('❌ XML 응답 오류 발생. 내용 ↓\n', text);
      throw new Error('Non-JSON response');
    }

    const parsed = JSON.parse(text);
    const items = parsed?.response?.body?.items?.item ?? [];
    return Array.isArray(items) ? items : [items];
  } catch (err) {
    console.error('❌ API 요청 실패:', err);
    return [];
  }
};


/**
 * 시설별 API 래퍼 함수들
 */
export const fetchElevators = async (stationName: string) =>
  fetchFromDataGokr('getWksnElvtr', stationName);

export const fetchEscalators = async (stationName: string) =>
  fetchFromDataGokr('getWksnEsctr', stationName);

export const fetchWheelchairLifts = async (stationName: string) =>
  fetchFromDataGokr('getWksnWhcllift', stationName);

export const fetchMovingWalkways = async (stationName: string) =>
  fetchFromDataGokr('getWksnMvnwlk', stationName);
