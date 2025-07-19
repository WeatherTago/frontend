import { readAlarmList } from '@/apis/alarm';
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
import * as Notifications from 'expo-notifications';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ImageBackground,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AlarmScreen() {
  const { isNewUnreadExists } = useNoticeContext();
  const insets = useSafeAreaInsets();
  const alarmBottomSheetRef = useRef<AlarmEditBottomSheetRef>(null);
  const [alarms, setAlarms] = useState<AlarmData[]>([]);
  const [isLoadingAlarms, setIsLoadingAlarms] = useState(false);

  // 알림 목록 불러오기 함수
  const fetchAlarms = async () => {
    setIsLoadingAlarms(true);
    try {
      const response: ReadAlarmResponse = await readAlarmList(); // 실제 API 호출
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
  const checkNotificationPermission = async () => {
    const { status } = await Notifications.getPermissionsAsync();

    if (status === Notifications.PermissionStatus.GRANTED) {
      // 권한 허용됨 → 알림 추가 시트 열기
      alarmBottomSheetRef.current?.present();
    } else {
      // 권한 없음 → 안내 후 설정 앱으로 유도
      Alert.alert(
        '알림 권한이 꺼져 있어요',
        '알림을 받기 위해서는 설정에서 권한을 허용해 주세요.',
        [
          { text: '취소', style: 'cancel' },
          { text: '설정으로 이동', onPress: () => Linking.openSettings() },
        ],
      );
    }
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
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <WeatherHeader showAlarmDot={isNewUnreadExists} />
      <ScrollView
        style={{ flex: 1, backgroundColor: theme.colors.gray[50] }}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View style={styles.mainContainer}>
          <View style={styles.textContainer}>
            <Text style={styles.text}>
              <Text style={styles.textFocus}>자주 가는 역</Text>의 혼잡도를
            </Text>
            <Text style={styles.text}>매일 알림으로 받아보세요</Text>
          </View>
          <ImageBackground
            source={require('@/assets/images/subway-people-small.png')}
            style={styles.imageContainer}
          >
            <View style={styles.buttonContainer}>
              <LargeButton
                text="+ 알림 추가"
                backgroundColor={theme.colors.primary[700]}
                fontColor={theme.colors.gray[0]}
                typography={theme.typography.subtitle1}
                onPress={checkNotificationPermission}
                activeOpacity={0.95}
              />
            </View>
          </ImageBackground>
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
          {isLoadingAlarms ? ( // 로딩 중일 때
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={theme.colors.primary[700]} />
              <Text style={styles.loadingText}>알림 목록 로딩 중...</Text>
            </View>
          ) : alarms.length === 0 ? ( // 알림이 없을 때
            <View style={styles.emptyContainer}>
              <View style={styles.emptyImageAndTextContainer}>
                <Image
                  source={require('@/assets/images/empty/subway-question-alarm.png')}
                  style={styles.emptyImageContainer}
                />
                <Text style={styles.emptyText}>알림을 설정한 역이 없어요</Text>
              </View>
            </View>
          ) : (
            // 알림이 있을 때
            <View style={styles.alarmListContentContainer}>
              {alarms.map((alarm, index) => (
                <AlarmStationBox
                  key={alarm.alarmId || index}
                  alarm={alarm}
                  onEditPress={handleEditAlarmPress}
                />
              ))}
            </View>
          )}
        </View>
      </ScrollView>
      <AlarmEditBottomSheet
        ref={alarmBottomSheetRef}
        onAlarmActionCompleted={handleAlarmActionCompleted}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: theme.colors.gray[50],
  },
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
  imageContainer: {
    width: '100%',
    aspectRatio: 27 / 20,
    justifyContent: 'flex-end',
    alignItems: 'center',
    resizeMode: 'cover',
  },
  buttonContainer: {
    height: hp(108),
    paddingHorizontal: wp(24),
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
  // ScrollView 내부 콘텐츠에 적용할 스타일 (padding, gap 등)
  alarmListContentContainer: {
    flex: 1,
    backgroundColor: theme.colors.gray[0],
    paddingHorizontal: wp(24),
    paddingBottom: hp(28),
    flexDirection: 'column',
    alignItems: 'flex-start',
    alignSelf: 'stretch',
    gap: hp(22), // ScrollView 내부에 items들의 간격
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: hp(40),
    alignSelf: 'stretch',
    backgroundColor: theme.colors.gray[0],
  },
  loadingText: {
    color: theme.colors.gray[500],
    fontFamily: 'Pretendard-Medium',
    fontSize: px(16),
    marginTop: hp(10),
  },
  emptyContainer: {
    flex: 1,
    paddingBottom: hp(30),
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: theme.colors.gray[0],
  },
  emptyImageAndTextContainer: {
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
  },
  emptyImageContainer: {
    width: wp(184),
    height: hp(126),
  },
  emptyImage: {
    width: '100%',
    height: '100%',
  },
  emptyText: {
    color: theme.colors.gray[300],
    fontFamily: 'Pretendard-SemiBold',
    textAlign: 'center',
    fontSize: px(20),
    fontWeight: '600',
    paddingHorizontal: wp(28),
  },
});
