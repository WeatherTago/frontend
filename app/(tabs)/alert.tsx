import LargeButton from '@/components/Button/LargeButton';
import WeatherHeader from '@/components/Header/WeatherHeader';
import { theme } from '@/styles/theme';
import { hp, px, wp } from '@/utils/scale';
import { StyleSheet, Text, View } from 'react-native';

export default function AlarmScreen() {
  return (
    <View style={{ flex: 1 }}>
      <WeatherHeader />
      <View style={styles.mainContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.text}>
            <Text style={styles.textFocus}>자주 가는 역</Text>의 혼잡도를
          </Text>
          <Text style={styles.text}>매일 알림으로 받아보세요</Text>
        </View>
        <View style={styles.buttonContainer}>
          <LargeButton
            text="+ 알림 추가"
            backgroundColor={theme.colors.primary[700]}
            fontColor={theme.colors.gray[0]}
            typography={theme.typography.subtitle1}
            onPress={() => {}}
          />
        </View>
        <View style={styles.alarmListHeader}>
          <Text style={styles.alarmListHeaderText}>알림 리스트</Text>
          <View style={styles.tipContainer}>
            <View style={styles.tipBox}>
              <Text style={styles.tipText}>Tip!</Text>
            </View>
            <Text style={styles.tipRightText}>
              {`즐겨찾는 역으로 등록한 역만\n알림을 설정할 수 있어요`}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: theme.colors.gray[50],
  },
  textContainer: {
    padding: px(24),
    alignItems: 'flex-start',
    alignSelf: 'stretch',
  },
  text: {
    color: theme.colors.gray[800],
    fontFamily: theme.typography.header1.fontFamily,
    fontSize: theme.typography.header1.fontSize,
    fontWeight: theme.typography.header1.fontWeight,
    lineHeight: theme.typography.header1.lineHeight,
  },
  textFocus: {
    color: theme.colors.primary[700],
    fontFamily: theme.typography.header1.fontFamily,
    fontSize: theme.typography.header1.fontSize,
    fontWeight: theme.typography.header1.fontWeight,
    lineHeight: theme.typography.header1.lineHeight,
  },
  buttonContainer: {
    height: hp(108),
    paddingHorizontal: wp(24),
    paddingVertical: hp(10),
    gap: hp(10),
    flexDirection: 'column',
    alignItems: 'flex-start',
    alignSelf: 'stretch',
  },
  alarmListHeader: {
    backgroundColor: theme.colors.gray[0],
    flexDirection: 'row',
    paddingHorizontal: wp(24),
    paddingVertical: px(30),
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  alarmListHeaderText: {
    color: theme.colors.gray[700],
    fontFamily: 'Pretendard-SemiBold',
    fontSize: px(26),
    fontWeight: '600',
    lineHeight: px(34),
  },
  tipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(8),
  },
  tipBox: {
    paddingVertical: hp(6),
    paddingHorizontal: wp(7.4),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: px(73.5),
    backgroundColor: theme.colors.primary[100],
  },
  tipText: {
    color: theme.colors.primary[700],
    fontFamily: 'Pretendard-Medium',
    fontSize: px(15),
    fontWeight: '500',
    lineHeight: px(21),
  },
  tipRightText: {
    color: theme.colors.gray[500],
    fontFamily: 'Pretendard-Medium',
    fontSize: px(14),
    fontWeight: '500',
    lineHeight: px(20),
  },
});
