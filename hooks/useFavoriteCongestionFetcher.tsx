import { myFavorite } from '@/apis/favorite';
import { fetchStationByIdAndTime } from '@/apis/station';
import { StationResult } from '@/types/station';
import dayjs from 'dayjs';

export const useFavoriteCongestionFetcher = () => {
  const fetch = async (): Promise<StationResult[]> => {
    const stations = (await myFavorite())?.result?.stations || [];

    const now = dayjs(); // 현재 시간
    let targetTime = dayjs(); // API에 전달할 시간을 담을 변수

    if (now.hour() >= 0 && now.hour() < 5) {
      // 새벽 시간대는 강제 05:00:00
      targetTime = now.set('hour', 5).startOf('hour');
    } else {
      // 정시일 경우 그대로, 아니라면 다음 정시
      targetTime =
        now.minute() === 0 && now.second() === 0 ? now : now.add(1, 'hour').startOf('hour');
    }

    const currentTime = targetTime.format('YYYY-MM-DDTHH:mm:ss'); // API 형식에 맞게 포맷팅

    const results: StationResult[] = [];

    for (const s of stations) {
      const r = await fetchStationByIdAndTime({
        stationId: s.stationId,
        time: currentTime,
      });

      if (r) {
        results.push({
          stationId: s.stationId,
          name: r.name,
          line: r.line,
          stationCode: r.stationCode,
          direction: r.direction,
          weather: r.weather,
          congestionByDirection: r.congestionByDirection,
          createdAt: r.createdAt,
        });
      }
    }

    return results;
  };

  return { fetch };
};
