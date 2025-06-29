import WeatherHeader from '@/components/Header/WeatherHeader';
import NoticeBanner from '@/components/NoticeBanner';
import { useTheme } from '@emotion/react';
import { StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  const theme=useTheme();
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.gray[50] }]}>
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
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    flexDirection: 'column',       // 수직 정렬
  },
 sectionTitle: {
  paddingVertical: 30,
  paddingHorizontal: 24,
  fontSize: 20,
  lineHeight: 34,
},
});
