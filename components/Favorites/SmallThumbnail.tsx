import { addFavorite, deleteFavorite } from '@/apis/favorite';
import { theme } from '@/styles/theme';
import { hp, px, wp } from '@/utils/scale';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import StarIcon from '../Icons/StarIcon';

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
    onToggleFavorite(stationId);

    if (newFavorite) {
      const res = await addFavorite({ stationId });
      if (__DEV__) console.log('즐겨찾기 등록:', res, '즐겨찾기 여부:', newFavorite);
    } else {
      const res = await deleteFavorite({ stationId });
      if (__DEV__) console.log('즐겨찾기 삭제:', res, '즐겨찾기 여부:', newFavorite);
    }
  };
  return (
    <TouchableOpacity style={styles.container} onPress={() => handleFavorites()}>
      <View style={styles.contentContainer}>
        <StarIcon
          size={px(42)}
          color={isFavorite(stationId) ? theme.colors.primary[700] : theme.colors.gray[300]}
        />
        <View style={styles.textContainer}>
          <View style={styles.stationNameContainer}>
            <Text style={styles.stationNameText}>{stationName}</Text>
          </View>
          <View style={styles.lineContainer}>
            <Text style={styles.lineText}>{stationLine}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default SmallThumbnail;

const styles = StyleSheet.create({
  container: {
    width: thumbnailWidth,
    padding: 8,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexShrink: 0,
    borderRadius: px(16),
    backgroundColor: theme.colors.gray[400],
  },
  contentContainer: {
    height: hp(168),
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    alignSelf: 'stretch',
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
    color: theme.colors.gray[0],
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
    color: '#fff',
    textAlign: 'center',
    fontSize: theme.typography.body2.fontSize,
    fontWeight: theme.typography.body2.fontWeight,
    lineHeight: theme.typography.body2.lineHeight,
  },
});
