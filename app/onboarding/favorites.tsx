import LargeButton from '@/components/Button/LargeButton';
import SmallThumbnail from '@/components/Favorites/SmallThumbnail';
import { useFavorite } from '@/context/FavoriteContext';
import { theme } from '@/styles/theme';
import { hp, wp } from '@/utils/scale';
import { router } from 'expo-router';
import { FlatList, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Favorites() {
  const insets = useSafeAreaInsets();

  const { stations, toggleFavorite } = useFavorite();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.flatListOuterContainer}>
        <FlatList
          data={stations}
          keyExtractor={(_, idx) => idx.toString()}
          renderItem={({ item, index }) => (
            <SmallThumbnail {...item} onToggleFavorite={() => toggleFavorite(index)} />
          )}
          numColumns={3}
          contentContainerStyle={styles.flatListContainer}
          columnWrapperStyle={styles.columnWrapper}
        />
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
  flatListOuterContainer: {
    display: 'flex',
    height: hp(721), // 829 - 108
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexShrink: 0,
    alignSelf: 'stretch',
  },
  flatListContainer: {
    paddingVertical: hp(36),
    paddingHorizontal: wp(24),
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flexGrow: 1,
  },
  columnWrapper: {
    justifyContent: 'flex-start',
    gap: wp(12), // 컬럼 간 간격 (column-gap)
    marginBottom: hp(20), // 행 간 간격 (row-gap)
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
