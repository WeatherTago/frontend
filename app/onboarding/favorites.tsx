import LargeButton from '@/components/Button/LargeButton';
import SmallThumbnail from '@/components/Favorites/SmallThumbnail';
import { useFavorite } from '@/context/FavoriteContext';
import { theme } from '@/styles/theme';
import { hp, wp } from '@/utils/scale';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Favorites() {
  const insets = useSafeAreaInsets();

  const { stations, toggleFavorite } = useFavorite();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.thumbnailOuterContainer}>
        <View style={styles.thumbnailInnerContainer}>
          {stations.map((station, idx) => (
            <SmallThumbnail key={idx} {...station} onToggleFavorite={() => toggleFavorite(idx)} />
          ))}
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <LargeButton
          text="웨더타고 시작하기"
          backgroundColor={theme.colors.primary[700]}
          fontColor={theme.colors.gray[0]}
          typography={theme.typography.subtitle1}
          onPress={() => router.replace('/(tabs)')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbnailOuterContainer: {
    display: 'flex',
    height: hp(829),
    paddingVertical: hp(36),
    paddingHorizontal: wp(24),
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexShrink: 0,
    alignSelf: 'stretch',
  },
  thumbnailInnerContainer: {
    height: hp(771),
    flexDirection: 'row',
    flexWrap: 'wrap',
    flexGrow: 1,
    flexShrink: 0,
    flexBasis: 0,
    rowGap: hp(20),
    columnGap: wp(12),
  },
  buttonContainer: {
    paddingHorizontal: wp(24),
    paddingVertical: hp(10),
    gap: hp(10),
    flexDirection: 'column',
    alignItems: 'flex-start',
    alignSelf: 'stretch',
  },
});
