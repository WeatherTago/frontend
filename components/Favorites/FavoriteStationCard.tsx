import { theme } from '@/styles/theme';
import { StationResult } from '@/types/station';
import { formatKSTRoundedHour } from '@/utils/dateUtils';
import { hp, px, wp } from '@/utils/scale';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const CARD_WIDTH = wp(400);
const CARD_HEIGHT = hp(498);

export default function FavoriteStationCard({ station }: { station: StationResult }) {
  const kstTime = formatKSTRoundedHour();

  return (
    <View style={styles.card}>
      <View style={styles.upContainer}>
        <Text style={styles.stationName}>{station.name}</Text>
        <Text style={styles.stationLine}>{station.line}</Text>
        <Text style={styles.congestionRate}>78%</Text>
        <Text style={styles.dateText}>{kstTime}</Text>
      </View>
      <View style={styles.downContainer}>
        <View style={styles.weatherContainer}>
          <View style={styles.weatherBox}>
            <View style={styles.weatherIconContainer} />
            <Text style={styles.weatherText}>기온</Text>
            <Text style={styles.weatherValueText}>{station.weather?.tmp ?? '-'}</Text>
          </View>
          <View style={styles.weatherBox}>
            <View style={styles.weatherIconContainer} />
            <Text style={styles.weatherText}>강수량</Text>
            <Text style={styles.weatherValueText}>{station.weather?.pcp ?? '-'}</Text>
          </View>
          <View style={styles.weatherBox}>
            <View style={styles.weatherIconContainer} />
            <Text style={styles.weatherText}>습도</Text>
            <Text style={styles.weatherValueText}>{station.weather?.reh ?? '-'}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    padding: px(24),
    backgroundColor: '#cccccc', // 임시 배경색
    borderRadius: px(16),
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
  congestionRate: {
    color: theme.colors.gray[0],
    fontFamily: 'Pretendard-Bold',
    fontSize: px(86),
    fontWeight: '700',
    lineHeight: px(103),
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
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
    gap: wp(10),
    backgroundColor: theme.colors.gray[0],
    borderRadius: px(16),
    flexShrink: 0,
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
    alignSelf: 'stretch',
    flexGrow: 1,
  },
  weatherIconContainer: {
    width: px(50),
    height: px(50),
    borderRadius: px(14),
    backgroundColor: theme.colors.gray[300],
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
