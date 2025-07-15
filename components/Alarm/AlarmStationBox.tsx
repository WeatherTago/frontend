import { theme } from '@/styles/theme';
import { AlarmData } from '@/types/alarm';
import { formatAlarmDisplay } from '@/utils/AlarmDisplayFormat';
import { hp, px, wp } from '@/utils/scale';
import { Image, StyleSheet, Text, TextStyle, TouchableOpacity, View } from 'react-native';

interface AlarmStationBoxProps {
  alarm: AlarmData;
  onEditPress: (alarm: AlarmData) => void;
}

type ThemeType = {
  colors: {
    subway: {
      [key: string]: string;
    };
  };
};

function getStationLineColor(lineName: string, theme: ThemeType): string {
  const lineNumber = extractLineNumber(lineName); // '2호선' -> 'line2'
  const colorKey = `line${lineNumber}`;

  return theme.colors.subway[colorKey] ?? theme.colors.subway.line1; // 기본값 fallback
}

function extractLineNumber(lineName: string): string {
  const match = lineName.match(/\d+/);
  return match ? match[0] : 'default';
}

const AlarmStationBox = ({ alarm, onEditPress }: AlarmStationBoxProps) => {
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
            <Text style={styles.stationName}>{alarm.stationName}</Text>
            <View
              style={[
                styles.stationLineContainer,
                { backgroundColor: getStationLineColor(alarm.stationLine, theme) },
              ]}
            >
              <Text style={styles.stationLine}>{alarm.stationLine}</Text>
            </View>
          </View>
          <Text style={styles.timeInfoText}>{formatAlarmDisplay(alarm)}</Text>
        </View>
      </View>
      <View style={styles.buttonImgContainer}>
        <TouchableOpacity style={styles.buttonImgBox} onPress={() => onEditPress(alarm)}>
          <Image
            source={require('@/assets/images/alarm-right-arrow.png')}
            style={styles.buttonImg}
            resizeMode="cover"
          />
        </TouchableOpacity>
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
    width: px(48),
    height: px(26),
    paddingHorizontal: wp(8),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: px(99),
  },
  stationLine: {
    color: theme.colors.gray[0],
    fontFamily: 'Pretendard-Medium',
    fontSize: px(12),
    fontWeight: '500',
    lineHeight: px(26),
    textAlign: 'center',
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
