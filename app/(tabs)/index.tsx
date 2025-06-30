import FavoriteStationCard from '@/components/FavoriteStationCard';
import WeatherHeader from '@/components/Header/WeatherHeader';
import NoticeBanner from '@/components/NoticeBanner';
import { hp, px, wp } from '@/utils/scale';
import { useTheme } from '@emotion/react';
import { Dimensions, FlatList, ScrollView, StyleSheet, Text, View } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = px(400);
const SIDE_SPACING = (SCREEN_WIDTH - CARD_WIDTH) / 2;

const mockCards = [{ id: '1' }, { id: '2' }, { id: '3' }]; //임시 카드

export default function HomeScreen() {
  const theme=useTheme();
  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.gray[50] }]}>
      <WeatherHeader/>
      <NoticeBanner
        text="지하철 1호선 파업 시위 관련 안내"
        showArrowButton
        onPressArrow={() => console.log('알림 자세히 보기')}
        backgroundColor={theme.colors.gray[700]}
        textColor={theme.colors.gray[0]}
      />
      <Text style={[styles.sectionTitle, { color: theme.colors.gray[700], fontFamily: theme.fonts.pretendard.extrabold }]}>
        오늘 즐겨찾는 역의 혼잡도는?
      </Text>

      <FlatList
        data={mockCards}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        snapToInterval={CARD_WIDTH + wp(32)} //스와이프 이동 거리
        contentContainerStyle={styles.cardListContainer}
        renderItem={({ item, index }) => (
          <View
            style={{
              marginRight: index === mockCards.length - 1 ? 0 : wp(32), // 카드 간 시각적 간격, 마지막 카드에는 간격 없음
            }}
          >
            <FavoriteStationCard />
          </View>
        )}
      />

      <Text style={[styles.sectionTitle, { color: theme.colors.gray[700], fontFamily: theme.fonts.pretendard.extrabold }]}>
        지하철 편의시설 정보
      </Text>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    flexDirection: 'column',       // 수직 정렬
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
