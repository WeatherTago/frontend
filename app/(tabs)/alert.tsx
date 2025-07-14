import AlarmEditBottomSheet, {
  AlarmEditBottomSheetRef,
} from '@/components/Alarm/AlarmEditBottomSheet';
import AlarmStationBox from '@/components/Alarm/AlarmStationBox';
import LargeButton from '@/components/Button/LargeButton';
import WeatherHeader from '@/components/Header/WeatherHeader';
import { useNoticeContext } from '@/context/NoticeContext';
import { theme } from '@/styles/theme';
import { AlarmData, ReadAlarmResponse } from '@/types/alarm';
import { hp, px, wp } from '@/utils/scale';
import { useEffect, useRef, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';

export default function AlarmScreen() {
  const { isNewUnreadExists } = useNoticeContext();

  const alarmBottomSheetRef = useRef<AlarmEditBottomSheetRef>(null);
  const [alarms, setAlarms] = useState<AlarmData[]>([]);
  const [isLoadingAlarms, setIsLoadingAlarms] = useState(false);

  // 알림 목록 불러오기 함수
  const fetchAlarms = async () => {
    setIsLoadingAlarms(true);
    try {
      // const response: ReadAlarmResponse = await readAlarms(); // 실제 API 호출
      // 임시 데이터 (API 호출 대신 사용)
      const response: ReadAlarmResponse = {
        isSuccess: true,
        code: '1000',
        message: 'Success',
        result: [
          {
            alarmId: 1,
            stationName: '서울역',
            stationLine: '1호선',
            direction: '상행',
            referenceTime: '08:00',
            alarmPeriod: 'EVERYDAY',
            alarmDay: 'YESTERDAY',
            alarmTime: '07:30',
          },
          {
            alarmId: 3,
            stationName: '시청',
            stationLine: '1호선',
            direction: '상행',
            referenceTime: '09:00',
            alarmPeriod: 'MONDAY',
            alarmDay: 'TODAY',
            alarmTime: '08:00',
          },
        ],
      };
      if (response.isSuccess && response.result) {
        setAlarms(response.result);
      } else {
        Alert.alert('오류', '알림 목록을 불러오는데 실패했습니다.');
      }
    } catch (error) {
      console.error('알림 목록 불러오기 실패:', error);
      Alert.alert('오류', '알림 목록을 불러오는 중 문제가 발생했습니다.');
    } finally {
      setIsLoadingAlarms(false);
    }
  };

  useEffect(() => {
    fetchAlarms();
  }, []);

  // 새 알림 등록 버튼 클릭 핸들러
  const handleAddAlarmPress = () => {
    alarmBottomSheetRef.current?.present(); // 초기 데이터 없이 호출 (등록 모드)
  };

  // 기존 알림 수정 버튼 클릭 핸들러
  const handleEditAlarmPress = (alarm: AlarmData) => {
    alarmBottomSheetRef.current?.present(alarm); // API의 Alarm 타입을 그대로 전달 (수정 모드)
  };

  // 알림 저장/삭제 후 실행될 콜백 (목록 갱신)
  const handleAlarmActionCompleted = () => {
    console.log('알림 저장 또는 삭제 완료! 알림 목록을 새로고침합니다.');
    fetchAlarms(); // 알림 목록 다시 불러오기
  };

  return (
    <View style={{ flex: 1 }}>
      <WeatherHeader showAlarmDot={isNewUnreadExists} />
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
            onPress={() => {
              handleAddAlarmPress();
            }}
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
        <View style={styles.alarmListContainer}>
          {alarms.map((alarm, index) => (
            <AlarmStationBox key={index} alarm={alarm} onEditPress={handleEditAlarmPress} />
          ))}
        </View>
      </View>
      <AlarmEditBottomSheet
        ref={alarmBottomSheetRef}
        onAlarmActionCompleted={handleAlarmActionCompleted}
      />
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
  alarmListContainer: {
    backgroundColor: theme.colors.gray[0],
    paddingHorizontal: wp(24),
    paddingBottom: hp(28),
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: hp(22),
    alignSelf: 'stretch',
  },
});
