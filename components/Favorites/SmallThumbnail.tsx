import { addFavorite, deleteFavorite } from '@/apis/favorite';
import { theme } from '@/styles/theme';
import { hp, px, wp } from '@/utils/scale';
import { getFavoriteBackgroundColor, getLineColor } from '@/utils/stationColor';
import { getFavoriteLineImage } from '@/utils/stationImage';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type SmallThumbnailProps = {
  stationId: number;
  stationName: string;
  stationLine: string;
  isFavorite: (stationId: number) => boolean;
  onToggleFavorite: (stationId: number) => void;
};

// 화면 너비 가져오기
const { width: screenWidth } = Dimensions.get('window');

// 가로 패딩과 컬럼 간격을 고려하여 썸네일 너비 계산
// wp(24)는 thumbnailOuterContainer의 좌우 패딩을 가정하며, wp(12)는 thumbnailInnerContainer의 컬럼 간격을 가정합니다.
const horizontalPadding = wp(24); // 좌우 패딩
const columnGap = wp(12); // 컬럼 간 간격

// 3열을 위한 각 썸네일의 너비 계산
// 전체 화면 너비에서 좌우 패딩을 빼고, 3열 사이의 2개 간격을 뺀 후 3으로 나눕니다.
const thumbnailWidth = Math.floor((screenWidth - horizontalPadding * 2 - columnGap * 2) / 3);

const SmallThumbnail = ({
  stationId,
  stationName,
  stationLine,
  isFavorite,
  onToggleFavorite,
}: SmallThumbnailProps) => {
    const handleFavorites = async () => {
      const newFavorite = !isFavorite(stationId);

      if (newFavorite) {
        await addFavorite({ stationId });
      } else {
        await deleteFavorite({ stationId });
      }
      onToggleFavorite(stationId);
    };


  const activeBackgroundColor = isFavorite(stationId)
    ? getFavoriteBackgroundColor(stationLine)
    : theme.colors.gray[50];
  const activeFontColor = isFavorite(stationId)
    ? getLineColor(stationLine)
    : theme.colors.gray[400];
  const activeImage = isFavorite(stationId)
    ? getFavoriteLineImage(stationLine)
    : getFavoriteLineImage('default');
  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: activeBackgroundColor }]}
      onPress={() => handleFavorites()}
    >
      <View style={styles.imageContainer}>
        <Image source={activeImage} style={styles.image} />
      </View>
      <View style={styles.textContainer}>
        <View style={styles.stationNameContainer}>
          <Text style={[styles.stationNameText, { color: activeFontColor }]}>{stationName}</Text>
        </View>
        <View style={styles.lineContainer}>
          <Text style={[styles.lineText, { color: activeFontColor }]}>{stationLine}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default SmallThumbnail;

const styles = StyleSheet.create({
  container: {
    width: thumbnailWidth,
    height: hp(184),
    padding: px(8),
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: px(16),
    overflow: 'hidden',
  },
  imageContainer: {
    height: hp(103),
    alignSelf: 'stretch',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  textContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: hp(-2),
    alignSelf: 'stretch',
  },
  stationNameContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  stationNameText: {
    textAlign: 'center',
    fontSize: theme.typography.subtitle2.fontSize,
    fontWeight: theme.typography.subtitle2.fontWeight,
    lineHeight: theme.typography.subtitle2.lineHeight,
  },
  lineContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  lineText: {
    textAlign: 'center',
    fontSize: theme.typography.body2.fontSize,
    fontWeight: theme.typography.body2.fontWeight,
    lineHeight: theme.typography.body2.lineHeight,
  },
});
