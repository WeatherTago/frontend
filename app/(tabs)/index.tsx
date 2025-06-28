import WeatherHeader from '@/components/Header/WeatherHeader';
import NoticeBanner from '@/components/NoticeBanner';
import { useTheme } from '@emotion/react';
import { View } from 'react-native';

export default function HomeScreen() {
  const theme=useTheme();
  return (
    <View>
      <WeatherHeader/>
      <NoticeBanner
        text="지하철 1호선 파업 시위 관련 안내"
        showArrowButton
        onPressArrow={() => console.log('알림 자세히 보기')}
        backgroundColor={theme.colors.gray[700]}
        textColor={theme.colors.gray[0]}
      />


    </View>
  );
}
