import { theme } from '@/styles/theme';
import { StationResult } from '@/types/station';
import { formatKSTRoundedHour, getKSTCongestionDateTimeISOString } from '@/utils/dateUtils';
import { hp, px, wp } from '@/utils/scale';
import { getCongestionLineImage } from '@/utils/stationImage';
import { useRouter } from 'expo-router';
import React, { useCallback } from 'react';
import {
  Alert,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const CARD_WIDTH = wp(400);
const CARD_HEIGHT = hp(498);

export default function FavoriteStationCard({ station }: { station: StationResult }) {
  const kstTime = formatKSTRoundedHour();
  const router = useRouter();

  const handleSubmit = useCallback(() => {
    const stationName = station.name;
    const selectedLine = station.line;

    const now = new Date(); // 현재 시점을 기준으로 두 유틸 함수 호출
    const formattedDate = getKSTCongestionDateTimeISOString(now); // 현재 KST 날짜의 자정 ISO String
    const formattedTime = getKSTCongestionDateTimeISOString(now); // KST 혼잡도 기준 시간 ISO String

    // 필수 값 유효성 검사
    if (!stationName || !selectedLine || !formattedDate || !formattedTime) {
      Alert.alert('오류', '필수 정보가 누락되었습니다. 다시 시도해주세요.');
      return;
    }

    router.push({
      pathname: '../congestion/first-result',
      params: {
        station: stationName,
        line: selectedLine,
        date: formattedDate,
        time: formattedTime,
      },
    });
  }, [station.name, station.line, router]); // 의존성 배열 유지

  return (
    <TouchableOpacity onPress={handleSubmit} style={styles.cardTouchable}>
      <ImageBackground
        source={getCongestionLineImage(station.line)}
        style={styles.imageBackground}
        imageStyle={styles.imageStyle}
      >
        <View style={styles.card}>
          <View style={styles.upContainer}>
            <Text style={styles.stationName}>{station.name}</Text>
            <Text style={styles.stationLine}>{station.line}</Text>
            <Text style={styles.congestionLevel}>
              {station.congestionByDirection.내선?.congestion.congestionLevel}
              {station.congestionByDirection.상행?.congestion.congestionLevel}
            </Text>
            <Text style={styles.dateText}>{kstTime}</Text>
          </View>
          <View style={styles.downContainer}>
            <View style={styles.weatherContainer}>
              <View style={styles.weatherBox}>
                <View style={styles.weatherIconContainer}>
                  <Image
                    source={require('@/assets/images/weather/tempgray.png')}
                    style={styles.weatherIcon}
                  />
                </View>
                <Text style={styles.weatherText}>기온</Text>
                <Text style={styles.weatherValueText}>{station.weather?.tmp ?? '-'}°C</Text>
              </View>
              <View style={styles.weatherBox}>
                <View style={styles.weatherIconContainer}>
                  <Image
                    source={require('@/assets/images/weather/raingray.png')}
                    style={styles.weatherIcon}
                  />
                </View>
                <Text style={styles.weatherText}>강수량</Text>
                <Text style={styles.weatherValueText}>{station.weather?.pcp ?? '-'}mm</Text>
              </View>
              <View style={styles.weatherBox}>
                <View style={styles.weatherIconContainer}>
                  <Image
                    source={require('@/assets/images/weather/raindrop.png')}
                    style={styles.weatherIcon}
                  />
                </View>
                <Text style={styles.weatherText}>습도</Text>
                <Text style={styles.weatherValueText}>{station.weather?.reh ?? '-'}%</Text>
              </View>
              <View style={styles.weatherBox}>
                <View style={styles.weatherIconContainer}>
                  <Image
                    source={require('@/assets/images/weather/windgray.png')}
                    style={styles.weatherIcon}
                  />
                </View>
                <Text style={styles.weatherText}>풍속</Text>
                <Text style={styles.weatherValueText}>{station.weather?.wsd ?? '-'}m/s</Text>
              </View>
            </View>
          </View>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardTouchable: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: px(16),
    overflow: 'hidden',
  },
  imageBackground: {
    width: '100%',
    height: '100%',
  },
  imageStyle: {
    resizeMode: 'cover',
  },
  card: {
    width: '100%',
    height: '100%',
    padding: px(24),
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'column',
  },
  upContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    alignSelf: 'stretch',
  },
  stationName: {
    color: theme.colors.gray[0],
    fontFamily: theme.typography.header1.fontFamily,
    fontSize: theme.typography.header1.fontSize,
    fontWeight: theme.typography.header1.fontWeight,
    lineHeight: theme.typography.header1.lineHeight,
  },
  stationLine: {
    color: theme.colors.gray[0],
    fontFamily: theme.typography.subtitle1.fontFamily,
    fontSize: theme.typography.subtitle1.fontSize,
    fontWeight: theme.typography.subtitle1.fontWeight,
    lineHeight: theme.typography.subtitle1.lineHeight,
  },
  congestionLevel: {
    color: theme.colors.gray[0],
    fontFamily: 'Pretendard-Bold',
    fontSize: px(60),
    fontWeight: '700',
    lineHeight: px(72),
  },
  dateText: {
    color: theme.colors.gray[0],
    fontFamily: 'Pretendard-Medium',
    fontSize: px(24),
    fontWeight: '500',
    lineHeight: px(34),
  },
  downContainer: {
    height: hp(120),
    paddingVertical: hp(14),
    paddingHorizontal: wp(10),
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: theme.colors.gray[0],
    flexShrink: 0,
    borderRadius: px(16),
  },
  weatherContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    gap: wp(28),
  },
  weatherBox: {
    flexDirection: 'column',
    alignItems: 'center',
    flexGrow: 1,
  },
  weatherIconContainer: {
    width: px(50),
    height: px(50),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: px(14),
  },
  weatherIcon: {
    width: '100%',
    height: '100%',
  },
  weatherText: {
    color: theme.colors.gray[400],
    fontFamily: theme.typography.caption.fontFamily,
    fontSize: theme.typography.caption.fontSize,
    fontWeight: theme.typography.caption.fontWeight,
    lineHeight: theme.typography.caption.lineHeight,
  },
  weatherValueText: {
    color: theme.colors.gray[700],
    fontFamily: 'Pretendard-SemiBold',
    fontSize: px(20),
    fontWeight: '600',
    lineHeight: px(22),
  },
});
