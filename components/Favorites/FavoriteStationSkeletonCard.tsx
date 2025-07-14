import { theme } from '@/styles/theme';
import { hp, px, wp } from '@/utils/scale';
import React from 'react';
import { StyleSheet, View } from 'react-native';

const CARD_WIDTH = wp(400);
const CARD_HEIGHT = hp(498);

export default function FavoriteStationSkeletonCard() {
  return (
    <View style={styles.card}>
      <View style={styles.upContainer}>
        <View style={styles.skeletonBoxLarge} />
        <View style={styles.skeletonBoxMedium} />
        <View style={styles.skeletonBoxHuge} />
        <View style={styles.skeletonBoxSmall} />
      </View>

      <View style={styles.downContainer}>
        {[0, 1, 2].map(index => (
          <View style={styles.weatherBox} key={index}>
            <View style={styles.weatherIcon} />
            <View style={styles.skeletonBoxTiny} />
            <View style={styles.skeletonBoxMini} />
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    padding: px(24),
    backgroundColor: theme.colors.gray[200],
    borderRadius: px(16),
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'column',
  },
  upContainer: {
    alignSelf: 'stretch',
    gap: px(12),
  },
  skeletonBoxLarge: {
    width: px(160),
    height: px(32),
    backgroundColor: theme.colors.gray[300],
    borderRadius: px(8),
  },
  skeletonBoxMedium: {
    width: px(80),
    height: px(22),
    backgroundColor: theme.colors.gray[300],
    borderRadius: px(6),
  },
  skeletonBoxHuge: {
    width: px(120),
    height: px(72),
    backgroundColor: theme.colors.gray[300],
    borderRadius: px(10),
  },
  skeletonBoxSmall: {
    width: px(80),
    height: px(20),
    backgroundColor: theme.colors.gray[300],
    borderRadius: px(6),
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
    backgroundColor: theme.colors.gray[100],
    borderRadius: px(16),
  },
  weatherBox: {
    flex: 1,
    alignItems: 'center',
    gap: px(8),
  },
  weatherIcon: {
    width: px(50),
    height: px(50),
    borderRadius: px(14),
    backgroundColor: theme.colors.gray[300],
  },
  skeletonBoxTiny: {
    width: px(40),
    height: px(12),
    backgroundColor: theme.colors.gray[300],
    borderRadius: px(4),
  },
  skeletonBoxMini: {
    width: px(30),
    height: px(16),
    backgroundColor: theme.colors.gray[300],
    borderRadius: px(4),
  },
});
