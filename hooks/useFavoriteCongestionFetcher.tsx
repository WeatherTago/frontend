import { myFavorite } from '@/apis/favorite';
import { fetchStationByIdAndTime } from '@/apis/station';
import { StationResult } from '@/types/station';
import dayjs from 'dayjs';

export const useFavoriteCongestionFetcher = () => {
  const fetch = async (): Promise<StationResult[]> => {
    const stations = (await myFavorite())?.result?.stations || [];

    const now = dayjs();
    const roundedTime =
      now.second() === 0 && now.minute() === 0 ? now : now.add(1, 'hour').startOf('hour');
    const currentTime = roundedTime.format('YYYY-MM-DDTHH:mm:ss');

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
