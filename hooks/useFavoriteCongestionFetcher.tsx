import { myFavorite } from '@/apis/favorite';
import { fetchStationByIdAndTime } from '@/apis/station';
import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';

export const useFavoriteCongestionFetcher = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      const fetchFavoriteAndCongestion = async () => {
        try {
          const res = await myFavorite();
          const stations = res?.result?.stations || [];

          if (__DEV__) {
            console.log('⭐ 즐겨찾기 역 목록:', stations);
          }

          const currentTime = new Date().toISOString();

          for (const station of stations) {
            const result = await fetchStationByIdAndTime({
              stationId: station.stationId,
              time: currentTime,
            });

            if (__DEV__ && result) {
              const { name, line, weather, congestion, createdAt } = result;

              console.log(`\n🚉 [${line}] ${name} (${station.stationId})`);
              console.log(`🕒 조회 시각: ${createdAt}`);

              if (weather) {
                console.log(
                  `🌡️ 날씨: ${weather.temperature ?? 'N/A'}℃ / ${weather.condition ?? 'N/A'}`,
                );
              } else {
                console.log('🌡️ 날씨 정보 없음');
              }

              if (congestion) {
                console.log(
                  `📊 혼잡도: ${congestion.level ?? 'N/A'} (rate: ${congestion.rate ?? 0})`,
                );
              } else {
                console.log('📊 혼잡도 정보 없음');
              }
            }
          }
        } catch (err) {
          console.error('💥 즐겨찾기 및 혼잡도 조회 중 에러 발생:', err);
        }
      };

      fetchFavoriteAndCongestion();
    });

    return unsubscribe;
  }, [navigation]);
};
