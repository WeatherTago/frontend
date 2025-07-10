import LargeButton from '@/components/Button/LargeButton';
import WeatherHeader from '@/components/Header/WeatherHeader';
import { theme } from '@/styles/theme';
import { hp, px, wp } from '@/utils/scale';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { useCallback, useMemo, useRef } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// 알림 설정 버튼 컴포넌트 (이미지에서 보이는 필터 버튼들과 유사한 형태)
interface AlarmSettingButtonProps {
  text: string;
  onPress: () => void;
}

const AlarmSettingButton: React.FC<AlarmSettingButtonProps> = ({ text, onPress }) => (
  <TouchableOpacity style={styles.alarmSettingChip} onPress={onPress}>
    <Text style={styles.alarmSettingChipText}>{text}</Text>
    <View style={styles.alarmSettingChipArrow}>
      <Image
        source={require('@/assets/images/right-arrow.png')}
        style={styles.alarmSettingChipArrowImage}
        resizeMode="contain"
      />
    </View>
  </TouchableOpacity>
);

export default function AlarmScreen() {
  const bottomSheetRef = useRef<BottomSheet>(null);

  // BottomSheet의 스냅 포인트 정의 (높이, % 등)
  const snapPoints = useMemo(() => ['25%', '50%', '75%'], []); // 예시: 뷰포트 높이의 25%, 50%, 75%

  // BottomSheet 열기 함수
  const handlePresentModalPress = useCallback(() => {
    bottomSheetRef.current?.snapToIndex(2);
  }, []);

  // BottomSheet 닫기 함수
  const handleCloseModalPress = useCallback(() => {
    bottomSheetRef.current?.close();
  }, []);

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
            onPress={handlePresentModalPress}
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
      {/* BottomSheet 컴포넌트 */}
      <BottomSheet
        ref={bottomSheetRef}
        index={-1} // 초기에는 닫힌 상태 (-1은 완전 닫힘을 의미)
        snapPoints={snapPoints}
        enablePanDownToClose={true} // 아래로 스와이프하여 닫기 활성화
        backgroundStyle={styles.bottomSheetBackground} // 백그라운드 스타일
        handleIndicatorStyle={styles.bottomSheetHandleIndicator} // 상단 핸들바 스타일
      >
        {/* BottomSheet 내부에 표시될 콘텐츠 */}
        <BottomSheetView style={styles.bottomSheetContent}>
          <View style={styles.bottomSheetHeader}>
            <Text style={styles.bottomSheetTitle}>알림 설정</Text>
            <TouchableOpacity style={styles.bottomSheetDoneButton} onPress={handleCloseModalPress}>
              <Text>완료</Text>
            </TouchableOpacity>
          </View>

          {/* 알림 설정 옵션들 */}
          <View style={styles.alarmOptionsContainer}>
            <View style={styles.alarmRow}>
              <AlarmSettingButton text="삼각지역" onPress={() => {}} />
              <AlarmSettingButton text="6호선" onPress={() => {}} />
              <AlarmSettingButton text="상행" onPress={() => {}} />
            </View>
            <View style={styles.alarmRow}>
              <AlarmSettingButton text="매일" onPress={() => {}} />
              <AlarmSettingButton text="오전 8:00" onPress={() => {}} />
              <Text style={styles.alarmRowText}>의 혼잡도를</Text>
            </View>
            <View style={styles.alarmRow}>
              <AlarmSettingButton text="전날" onPress={() => {}} />
              <AlarmSettingButton text="오전 8:00" onPress={() => {}} />
              <Text style={styles.alarmRowText}>에 알고 싶어요</Text>
            </View>
          </View>

          {/* 추가적인 알림 설정 UI */}
        </BottomSheetView>
      </BottomSheet>
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
  // BottomSheet 스타일
  bottomSheetBackground: {
    backgroundColor: theme.colors.gray[0], // 배경 색상
    borderRadius: px(24), // 상단 둥근 모서리
  },
  bottomSheetHandleIndicator: {
    backgroundColor: theme.colors.gray[300], // 핸들바 색상
    width: wp(40), // 핸들바 너비
    height: hp(4), // 핸들바 높이
  },
  bottomSheetContent: {
    flex: 1,
    paddingHorizontal: wp(24),
    paddingTop: hp(10), // 핸들바 아래 여백
    gap: hp(48),
  },
  bottomSheetHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp(20),
    position: 'relative',
  },
  bottomSheetTitle: {
    color: theme.colors.gray[950],
    fontFamily: 'Pretendard-Medium',
    fontSize: px(28),
    fontWeight: '500',
    lineHeight: px(34),
  },
  bottomSheetDoneButton: {
    color: theme.colors.gray[950],
    fontFamily: 'Pretendard-Regular',
    fontSize: px(24),
    fontWeight: '400',
    lineHeight: px(28),
    position: 'absolute',
    right: wp(9),
  },
  alarmOptionsContainer: {
    // 옵션 컨테이너 스타일 (필요에 따라 flexWrap 등)
  },
  alarmRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(20), // 각 행 간격
    flexWrap: 'wrap', // 버튼들이 한 줄에 안 들어갈 경우 자동으로 다음 줄로 넘어가게
  },
  alarmSettingChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.gray[100],
    paddingVertical: hp(14),
    paddingHorizontal: wp(14),
    borderRadius: px(14),
    marginRight: wp(16), // 버튼 간 간격
    gap: px(14),
  },
  alarmSettingChipText: {
    color: theme.colors.gray[600],
    fontFamily: 'Pretendard-Medium',
    fontSize: px(28),
    fontWeight: '500',
    lineHeight: px(38),
  },
  alarmSettingChipArrow: {
    color: theme.colors.gray[600],
    width: wp(8),
    height: wp(14),
    justifyContent: 'center',
    alignItems: 'center',
  },
  alarmSettingChipArrowImage: {
    width: '100%',
    height: '100%',
  },
  alarmRowText: {
    color: theme.colors.gray[700],
    fontFamily: 'Pretendard-Medium',
    fontSize: px(28),
    fontWeight: '500',
    lineHeight: px(38),
    marginLeft: wp(4), // 텍스트 앞 여백
  },
});
