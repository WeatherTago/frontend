import { useTheme } from '@emotion/react';
import dayjs from 'dayjs';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Dimensions, FlatList, ScrollView, StyleSheet, Text, View } from 'react-native';

import DirectAccessCard from '@/components/DirectAccessCard';
import FavoriteStationCard from '@/components/FavoriteStationCard';
import WeatherHeader from '@/components/Header/WeatherHeader';
import NoticeBanner from '@/components/NoticeBanner';
import { useNoticeContext } from '@/context/NoticeContext';
import { useFavoriteCongestionFetcher } from '@/hooks/useFavoriteCongestionFetcher';
import { StationResult } from '@/types/station';
import { hp, px, wp } from '@/utils/scale';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = px(400);
const SIDE_SPACING = (SCREEN_WIDTH - CARD_WIDTH) / 2;

export default function HomeScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { fetch } = useFavoriteCongestionFetcher();
  const [favoriteStations, setFavoriteStations] = useState<StationResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { notices, isNewUnreadExists } = useNoticeContext();
  const latestNotice = notices.length > 0 ? notices[0] : null;

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const response = await fetch();
      setFavoriteStations(response);
      setIsLoading(false);
    };
    loadData();
  }, [favoriteStations]);


  return (
    <View style={{ flex: 1 }}>
      <WeatherHeader showAlarmDot={isNewUnreadExists} />

      <ScrollView style={[styles.container, { backgroundColor: theme.colors.gray[50] }]}>
        {latestNotice && (
          <NoticeBanner
            text={latestNotice.title}
            showArrowButton
            onPressArrow={() => router.push(`../notice/${latestNotice.noticeId}`)}
            backgroundColor={theme.colors.gray[700]}
            textColor={theme.colors.gray[0]}
            date={dayjs(latestNotice.createdAt).format('YYYY. MM. DD. A HH:mm')}
          />
        )}
        <Text
          style={[
            styles.sectionTitle,
            {
              color: theme.colors.gray[700],
              fontFamily: theme.fonts.pretendard.semibold,
              fontWeight: '600',
            },
          ]}
        >
          오늘 즐겨찾는 역의 혼잡도는?
        </Text>

        <FlatList
          data={favoriteStations}
          keyExtractor={item => item.stationId.toString()}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          decelerationRate="fast"
          snapToInterval={CARD_WIDTH + wp(32)} //스와이프 이동 거리
          contentContainerStyle={styles.cardListContainer}
          renderItem={({ item, index }) => (
            <View
              style={{
                marginRight: index === favoriteStations.length - 1 ? 0 : wp(32), // 카드 간 시각적 간격, 마지막 카드에는 간격 없음
              }}
            >
              <FavoriteStationCard station={item} />
            </View>
          )}
        />

        <Text
          style={[
            styles.sectionTitle,
            {
              color: theme.colors.gray[700],
              fontFamily: theme.fonts.pretendard.semibold,
              fontWeight: '600',
            },
          ]}
        >
          지하철 편의시설 정보
        </Text>

        <DirectAccessCard
          title={`신사역의 엘리베이터 위치가\n알고 싶다면?`}
          subText="편의시설 정보를 빠르게 확인해보세요"
          buttonText="편의시설 확인하기"
          onPress={() => console.log('바로가기 눌림')}
        />

        <Text
          style={[
            styles.sectionTitle,
            {
              color: theme.colors.gray[700],
              fontFamily: theme.fonts.pretendard.semibold,
              fontWeight: '600',
            },
          ]}
        >
          혼잡도 알림 설정
        </Text>

        <DirectAccessCard
          title={`신사역의 혼잡도 알림을\n받고 싶다면?`}
          subText="알림을 설정 해보세요"
          buttonText="알림 설정하기"
          onPress={() => console.log('바로가기 눌림')}
        />

        <Text
          style={[
            styles.sectionTitle,
            {
              color: theme.colors.gray[700],
              fontFamily: theme.fonts.pretendard.semibold,
              fontWeight: '600',
            },
          ]}
        >
          도착역까지 빠른 혼잡도 확인
        </Text>
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    flexDirection: 'column',
  },
  sectionTitle: {
    paddingVertical: hp(30),
    paddingHorizontal: wp(24),
    fontSize: px(26),
    lineHeight: px(34),
  },
  cardListContainer: {
    paddingHorizontal: SIDE_SPACING,
  },
});
