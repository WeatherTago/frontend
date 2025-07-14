import { theme } from '@/styles/theme';
import { hp, px, wp } from '@/utils/scale';
import { Image, StyleSheet, Text, TextStyle, View } from 'react-native';

const AlarmStationBox = () => {
  return (
    <View style={styles.alarmStationBox}>
      <View style={styles.imgAndStationContainer}>
        <View style={styles.imgContainer}>
          <Image
            source={require('@/assets/images/subway.png')}
            style={styles.img}
            resizeMode="cover"
          />
        </View>
        <View style={styles.stationAndTimeInfoContainer}>
          <View style={styles.stationInfoContainer}>
            <Text style={styles.stationName}>서울역</Text>
            <View style={styles.stationLineContainer}>
              <Text style={styles.stationLine}>7호선</Text>
            </View>
          </View>
          <Text style={styles.timeInfoText}>매일 오후 7:00 | 전날 오후 10:00 알림</Text>
        </View>
      </View>
      <View style={styles.buttonImgContainer}>
        <View style={styles.buttonImgBox}>
          <Image
            source={require('@/assets/images/alarm-right-arrow.png')}
            style={styles.buttonImg}
            resizeMode="cover"
          />
        </View>
      </View>
    </View>
  );
};

export default AlarmStationBox;

const styles = StyleSheet.create({
  alarmStationBox: {
    flexDirection: 'row',
    paddingVertical: hp(20),
    paddingHorizontal: wp(22),
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: theme.colors.gray[50],
    borderRadius: px(16),
  },
  imgAndStationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(16),
  },
  imgContainer: {
    width: wp(60),
    height: wp(60),
    borderRadius: px(16),
  },
  img: {
    width: '100%',
    height: '100%',
  },
  stationAndTimeInfoContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  stationInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(6),
  },
  stationName: {
    color: theme.colors.gray[900],
    fontFamily: 'Pretendard-Medium',
    fontSize: px(24),
    fontWeight: '500',
    lineHeight: px(34),
  } as TextStyle,
  stationLineContainer: {
    width: px(44),
    height: px(26),
    paddingHorizontal: wp(8),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: px(99),
    backgroundColor: theme.colors.subway.line7,
  },
  stationLine: {
    color: theme.colors.gray[0],
    fontFamily: 'Pretendard-Medium',
    fontSize: px(12),
    fontWeight: '500',
    lineHeight: px(26),
  } as TextStyle,
  timeInfoText: {
    color: theme.colors.gray[500],
    fontFamily: theme.typography.body1.fontFamily,
    fontSize: theme.typography.body1.fontSize,
    fontWeight: theme.typography.body1.fontWeight,
    lineHeight: theme.typography.body1.lineHeight,
  } as TextStyle,
  buttonImgContainer: {
    paddingVertical: hp(13),
    paddingHorizontal: wp(18),
    alignItems: 'center',
  },
  buttonImgBox: {
    width: px(20),
    height: px(40),
  },
  buttonImg: {
    width: '100%',
    height: '100%',
  },
});
