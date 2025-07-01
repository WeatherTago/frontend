import { theme } from '@/styles/theme';
import { hp, px, wp } from '@/utils/scale';
import { StyleSheet, Text, View } from 'react-native';
import StarIcon from '../Icons/StarIcon';

type SmallThumbnailProps = {
  isFavorite?: boolean;
  stationName: string;
  lineName: string;
};

const SmallThumbnail = ({
  isFavorite = false,
  stationName = '한강진역',
  lineName = '6호선',
}: SmallThumbnailProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <StarIcon
          size={px(42)}
          color={isFavorite ? theme.colors.primary[700] : theme.colors.gray[300]}
        />
        <View style={styles.textContainer}>
          <View style={styles.stationNameContainer}>
            <Text style={styles.stationNameText}>{stationName}</Text>
          </View>
          <View style={styles.lineContainer}>
            <Text style={styles.lineText}>{lineName}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default SmallThumbnail;

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    width: wp(156),
    height: hp(180),
    padding: px(8),
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexShrink: 0,
    borderRadius: px(16),
    backgroundColor: theme.colors.gray[400],
  },
  contentContainer: {
    display: 'flex',
    height: hp(168),
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: hp(70),
    flexShrink: 0,
    alignSelf: 'stretch',
  },
  textContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: px(-2),
    alignSelf: 'stretch',
  },
  stationNameContainer: {
    display: 'flex',
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
    display: 'flex',
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
