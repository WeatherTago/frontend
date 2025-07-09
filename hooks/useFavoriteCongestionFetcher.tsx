import { myFavorite } from '@/apis/favorite';
import { fetchStationByIdAndTime } from '@/apis/station';
import { StationResult } from '@/types/station';

export const useFavoriteCongestionFetcher = () => {
  const fetch = async (): Promise<StationResult[]> => {
    const res = await myFavorite();
    const stations = res?.result?.stations || [];
    const currentTime = new Date().toISOString();

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
          weather: r.weather,
          congestion: r.congestion,
          createdAt: r.createdAt,
        });
      }
    }

    return results;
  };

  return { fetch };
};
