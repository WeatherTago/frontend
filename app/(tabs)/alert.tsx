import { myFavorite } from '@/apis/favorite';
import LargeButton from '@/components/Button/LargeButton';
import WeatherHeader from '@/components/Header/WeatherHeader';
import { theme } from '@/styles/theme';
import { StationInfo } from '@/types/common';
import { hp, px, wp } from '@/utils/scale';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

// 앱 내부에서 사용할 역 데이터 타입 (StationApiData와 매핑)
interface SelectedStationInfo {
  id: string;
  name: string;
  line: string;
}

// BottomSheet의 현재 뷰를 관리할 타입 정의
type BottomSheetViewType =
  | 'mainAlarmSettings'
  | 'stationSelection'
  | 'lineSelection'
  | 'directionSelection'
  | 'daySelection'
  | 'dateOptionSelection'
  | 'timeSelectionForCongestion' // 혼잡도 기준 시간 선택 뷰
  | 'timeSelectionForNotification'; // 알림 수신 시간 선택 뷰

// 알림 설정 버튼 컴포넌트 (이미지에서 보이는 필터 버튼들과 유사한 형태)
interface AlarmSettingButtonProps {
  text: string;
  onPress: () => void;
  isSelected?: boolean;
}

const AlarmSettingButton: React.FC<AlarmSettingButtonProps> = ({
  text,
  onPress,
  isSelected = false,
}) => (
  <TouchableOpacity
    style={[styles.alarmSettingChip, isSelected && styles.alarmSettingChipSelected]}
    onPress={onPress}
  >
    <Text style={[styles.alarmSettingChipText, isSelected && styles.alarmSettingChipTextSelected]}>
      {text}
    </Text>
    <View style={styles.alarmSettingChipArrow}>
      <Image
        source={require('@/assets/images/right-arrow.png')}
        style={styles.alarmSettingChipArrowImage}
        resizeMode="contain"
      />
    </View>
  </TouchableOpacity>
);

// 역 칩 컴포넌트 (역 선택 BottomSheet용)
interface StationChipProps {
  station: SelectedStationInfo;
  onPress: (station: SelectedStationInfo) => void;
  isSelected: boolean;
}

const StationChip: React.FC<StationChipProps> = ({ station, onPress, isSelected }) => (
  <TouchableOpacity
    style={[styles.stationChip, isSelected && styles.stationChipSelected]}
    onPress={() => onPress(station)}
  >
    <Text style={[styles.stationChipText, isSelected && styles.stationChipTextSelected]}>
      {station.name}
    </Text>
  </TouchableOpacity>
);

// 호선 칩 컴포넌트 (호선 선택 BottomSheet용)
interface LineChipProps {
  line: string;
  onPress: (line: string) => void;
  isSelected: boolean;
}

const LineChip: React.FC<LineChipProps> = ({ line, onPress, isSelected }) => (
  <TouchableOpacity
    style={[styles.stationChip, isSelected && styles.stationChipSelected]}
    onPress={() => onPress(line)}
  >
    <Text style={[styles.stationChipText, isSelected && styles.stationChipTextSelected]}>
      {line}
    </Text>
  </TouchableOpacity>
);

// 방향 칩 컴포넌트 (방향 선택 BottomSheet용)
interface DirectionChipProps {
  direction: string;
  onPress: (direction: string) => void;
  isSelected: boolean;
}

const DirectionChip: React.FC<DirectionChipProps> = ({ direction, onPress, isSelected }) => (
  <TouchableOpacity
    style={[styles.stationChip, isSelected && styles.stationChipSelected]}
    onPress={() => onPress(direction)}
  >
    <Text style={[styles.stationChipText, isSelected && styles.stationChipTextSelected]}>
      {direction}
    </Text>
  </TouchableOpacity>
);

// 요일 칩 컴포넌트 (요일 선택 BottomSheet용)
interface DayChipProps {
  day: string;
  onPress: (day: string) => void;
  isSelected: boolean;
  isCircle?: boolean; // 요일 원형 버튼을 위한 prop
}

const DayChip: React.FC<DayChipProps> = ({ day, onPress, isSelected, isCircle = false }) => (
  <TouchableOpacity
    style={[
      isCircle ? styles.dayOptionCircle : styles.dayOptionChip,
      isSelected && (isCircle ? styles.dayOptionCircleSelected : styles.dayOptionChipSelected),
    ]}
    onPress={() => onPress(day)}
  >
    <Text
      style={[
        isCircle ? styles.dayOptionText : styles.dayOptionText, // 텍스트 스타일은 동일하게 사용
        isSelected && styles.dayOptionTextSelected,
      ]}
    >
      {day}
    </Text>
  </TouchableOpacity>
);

// 시간 칩 컴포넌트 (시간 선택 BottomSheet용)
interface TimeChipProps {
  time: string;
  onPress: (time: string) => void;
  isSelected: boolean;
}

const TimeChip: React.FC<TimeChipProps> = ({ time, onPress, isSelected }) => (
  <TouchableOpacity
    style={[styles.timeOptionChip, isSelected && styles.timeOptionChipSelected]}
    onPress={() => onPress(time)}
  >
    <Text style={[styles.timeOptionText, isSelected && styles.timeOptionTextSelected]}>{time}</Text>
  </TouchableOpacity>
);

// 날짜 옵션 칩 컴포넌트 (날짜 옵션 선택 BottomSheet용) - TimeChip과 유사한 스타일 재활용
interface DateOptionChipProps {
  option: string;
  onPress: (option: string) => void;
  isSelected: boolean;
}

const DateOptionChip: React.FC<DateOptionChipProps> = ({ option, onPress, isSelected }) => (
  <TouchableOpacity
    style={[styles.timeOptionChip, isSelected && styles.timeOptionChipSelected]} // timeOptionChip 스타일 재활용
    onPress={() => onPress(option)}
  >
    <Text style={[styles.timeOptionText, isSelected && styles.timeOptionTextSelected]}>
      {option}
    </Text>
  </TouchableOpacity>
);

export default function AlarmScreen() {
  const bottomSheetRef = useRef<BottomSheet>(null);

  // --- 1. 선택된 알림 설정 값들 상태 ---
  const [selectedStation, setSelectedStation] = useState<SelectedStationInfo | null>(null);
  const [selectedLine, setSelectedLine] = useState<string | null>(null);
  const [selectedDirection, setSelectedDirection] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<string>('매일'); // 기본값 '매일'
  const [selectedDateOption, setSelectedDateOption] = useState<string>('전날');
  const [selectedCongestionTime, setSelectedCongestionTime] = useState<string>('08:00'); // 혼잡도 기준 시간
  const [selectedNotificationTime, setSelectedNotificationTime] = useState<string>('08:00'); // 알림 수신 시간

  // --- 2. 현재 BottomSheet에 보여줄 뷰 타입 상태 ---
  const [currentBottomSheetView, setCurrentBottomSheetView] =
    useState<BottomSheetViewType>('mainAlarmSettings');

  // --- 3. 즐겨찾는 역 API 데이터 및 로딩 상태 ---
  const [favoriteStationsApiData, setFavoriteStationsApiData] = useState<StationInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // useFavoriteCongestionFetcher 훅을 직접 구현 (API 호출 포함)
  const fetchFavoriteStations = useCallback(async (): Promise<SelectedStationInfo[]> => {
    try {
      const response = await myFavorite();
      if (response.isSuccess && response.result && response.result.stations) {
        // API에서 받은 원본 데이터를 저장
        setFavoriteStationsApiData(response.result.stations);
        // 앱 내부에서 사용할 형식으로 변환하여 반환
        return response.result.stations.map(station => ({
          id: String(station.stationId),
          name: station.stationName,
          line: station.stationLine,
        }));
      }
      return [];
    } catch (error) {
      console.error('즐겨찾는 역 불러오기 실패:', error);
      return [];
    }
  }, []);

  // 컴포넌트 마운트 시 즐겨찾는 역 데이터 로드
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const convertedStations = await fetchFavoriteStations();
      // 초기 선택 역 설정 (예: 즐겨찾기 목록의 첫 번째 역으로 설정)
      const initialStation = convertedStations[0] || null;
      setSelectedStation(initialStation);
      setIsLoading(false);
    };
    loadData();
  }, [fetchFavoriteStations]); // fetchFavoriteStations가 의존성 배열에 포함되도록 주의

  // BottomSheet의 스냅 포인트 정의 (높이, % 등)
  const snapPoints = useMemo(() => ['25%', '50%', '75%'], []); // 예시: 뷰포트 높이의 25%, 50%, 75%

  // --- 4. 필터링된 옵션 목록 계산 (useMemo 활용) ---

  // 1. 역 선택 BottomSheet에서 보여줄 즐겨찾는 역 목록
  // favoriteStationsApiData는 이미 필터링된 즐겨찾기 목록이므로 그대로 사용하며 SelectedStationInfo 타입으로 변환
  const stationsForSelection = useMemo(() => {
    return favoriteStationsApiData.map(station => ({
      id: String(station.stationId),
      name: station.stationName,
      line: station.stationLine,
    }));
  }, [favoriteStationsApiData]);

  // 2. 호선 선택 BottomSheet에서 보여줄 호선 목록
  // - 역이 선택되었다면 해당 역의 호선만
  // - 역이 선택되지 않았다면 모든 즐겨찾기 역의 호선
  const availableLines = useMemo(() => {
    const lines = new Set<string>();
    if (selectedStation) {
      lines.add(selectedStation.line);
    } else {
      favoriteStationsApiData.forEach(station => {
        lines.add(station.stationLine);
      });
    }
    return Array.from(lines);
  }, [selectedStation, favoriteStationsApiData]);

  // 3. 방향 선택 BottomSheet에서 보여줄 방향 목록
  const availableDirections = useMemo(() => {
    if (!selectedLine) return [];
    if (selectedLine === '2호선') {
      return ['내선', '외선'];
    } else {
      return ['상행', '하행'];
    }
  }, [selectedLine]);

  // 요일 옵션 (고정값)
  const dayOptions = ['매일', '월', '화', '수', '목', '금', '토', '일'];

  // 시간 옵션 (고정값 - 실제로는 Picker 등 더 복잡한 UI)
  const timeOptions = useMemo(() => {
    const times: string[] = [];
    for (let h = 0; h < 24; h++) {
      const hour = h < 10 ? `0${h}` : `${h}`;
      times.push(`${hour}:00`);
    }
    return times;
  }, []);

  // --- 5. BottomSheet 열고 닫는 핸들러 및 뷰 전환 핸들러 ---

  // BottomSheet 열기 (메인 알림 설정 뷰로 시작)
  const handlePresentModalPress = useCallback(() => {
    bottomSheetRef.current?.snapToIndex(2);
    setCurrentBottomSheetView('mainAlarmSettings');
  }, []);

  // BottomSheet 닫기 (항상 닫음)
  const handleCloseModalPress = useCallback(() => {
    bottomSheetRef.current?.close();
    // 닫을 때 현재 뷰를 초기화하고 싶다면
    setCurrentBottomSheetView('mainAlarmSettings');
  }, []);

  // 각 설정 버튼 클릭 시 뷰 전환 핸들러
  const handleOpenStationSelection = useCallback(() => {
    setCurrentBottomSheetView('stationSelection');
    bottomSheetRef.current?.snapToIndex(2);
  }, []);

  const handleOpenLineSelection = useCallback(() => {
    if (!selectedStation) {
      alert('역을 먼저 선택해주세요.'); // 사용자에게 안내
      return;
    }
    setCurrentBottomSheetView('lineSelection');
    bottomSheetRef.current?.snapToIndex(2);
  }, [selectedStation]); // selectedStation이 변경되면 이 콜백도 재생성

  const handleOpenDirectionSelection = useCallback(() => {
    if (!selectedStation || !selectedLine) {
      alert('역과 호선을 먼저 선택해주세요.');
      return;
    }
    setCurrentBottomSheetView('directionSelection');
    bottomSheetRef.current?.snapToIndex(2);
  }, [selectedStation, selectedLine]);

  const handleOpenDaySelection = useCallback(() => {
    setCurrentBottomSheetView('daySelection');
    bottomSheetRef.current?.snapToIndex(2);
  }, []);

  const handleOpenDateOptionSelection = useCallback(() => {
    setCurrentBottomSheetView('dateOptionSelection');
    bottomSheetRef.current?.snapToIndex(2);
  }, []);

  // 혼잡도 기준 시간 선택 뷰 전환 핸들러
  const handleOpenTimeSelectionForCongestion = useCallback(() => {
    setCurrentBottomSheetView('timeSelectionForCongestion');
    bottomSheetRef.current?.snapToIndex(2);
  }, []);

  // 알림 수신 시간 선택 뷰 전환 핸들러
  const handleOpenTimeSelectionForNotification = useCallback(() => {
    setCurrentBottomSheetView('timeSelectionForNotification');
    bottomSheetRef.current?.snapToIndex(2);
  }, []);

  // --- 6. 각 항목 선택 핸들러 (선택 후 메인 뷰로 돌아감) ---

  const handleSelectStation = useCallback((station: SelectedStationInfo) => {
    setSelectedStation(station);
    // 역 변경 시 호선, 방향 초기화 (데이터 정합성을 위해 중요)
    setSelectedLine(null);
    setSelectedDirection(null);
    setCurrentBottomSheetView('mainAlarmSettings');
  }, []);

  const handleSelectLine = useCallback((line: string) => {
    setSelectedLine(line);
    // 호선 변경 시 방향 초기화
    setSelectedDirection(null);
    setCurrentBottomSheetView('mainAlarmSettings');
  }, []);

  const handleSelectDirection = useCallback((direction: string) => {
    setSelectedDirection(direction);
    setCurrentBottomSheetView('mainAlarmSettings');
  }, []);

  const handleSelectDay = useCallback((day: string) => {
    setSelectedDay(day);
    setCurrentBottomSheetView('mainAlarmSettings');
  }, []);

  const handleSelectDateOption = useCallback((option: string) => {
    setSelectedDateOption(option);
    setCurrentBottomSheetView('mainAlarmSettings');
  }, []);

  const handleSelectCongestionTime = useCallback((time: string) => {
    setSelectedCongestionTime(time);
    setCurrentBottomSheetView('mainAlarmSettings');
  }, []);

  // 알림 수신 시간 선택 핸들러
  const handleSelectNotificationTime = useCallback((time: string) => {
    setSelectedNotificationTime(time);
    setCurrentBottomSheetView('mainAlarmSettings');
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
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        enableContentPanningGesture={false}
        backgroundStyle={styles.bottomSheetBackground}
        handleIndicatorStyle={styles.bottomSheetHandleIndicator}
      >
        <BottomSheetView style={styles.bottomSheetContent}>
          <View style={styles.bottomSheetHeader}>
            <Text style={styles.bottomSheetTitle}>
              {currentBottomSheetView === 'mainAlarmSettings' && '알림 설정'}
              {currentBottomSheetView === 'stationSelection' && '역 선택'}
              {currentBottomSheetView === 'lineSelection' && '호선 선택'}
              {currentBottomSheetView === 'directionSelection' && '방향 선택'}
              {currentBottomSheetView === 'daySelection' && '요일 선택'}
              {currentBottomSheetView === 'timeSelectionForCongestion' && '혼잡도 기준 시간 선택'}
              {currentBottomSheetView === 'timeSelectionForNotification' && '알림 수신 시간 선택'}
              {currentBottomSheetView === 'dateOptionSelection' && '날짜 옵션 선택'}
            </Text>
            <TouchableOpacity style={styles.bottomSheetDoneButton} onPress={handleCloseModalPress}>
              <Text style={styles.bottomSheetDoneButtonText}>완료</Text>
            </TouchableOpacity>
          </View>

          {currentBottomSheetView === 'mainAlarmSettings' && (
            <View style={styles.alarmOptionsContainer}>
              <View style={styles.alarmRow}>
                <AlarmSettingButton
                  text={selectedStation ? selectedStation.name : '역'}
                  onPress={handleOpenStationSelection}
                  isSelected={!!selectedStation} // 역이 선택되었는지 여부로 강조
                />
                <AlarmSettingButton
                  text={selectedLine ? `${selectedLine}` : '호선'} // '1호선' 형태로 표시
                  onPress={handleOpenLineSelection}
                  isSelected={!!selectedLine}
                />
                <AlarmSettingButton
                  text={selectedDirection ? selectedDirection : '방향'}
                  onPress={handleOpenDirectionSelection}
                  isSelected={!!selectedDirection}
                />
              </View>
              <View style={styles.alarmRow}>
                <AlarmSettingButton
                  text={selectedDay}
                  onPress={handleOpenDaySelection}
                  isSelected={true}
                />
                <AlarmSettingButton
                  text={selectedCongestionTime}
                  onPress={handleOpenTimeSelectionForCongestion}
                  isSelected={true}
                />
                <Text style={styles.alarmRowText}>시 혼잡도를</Text>
              </View>
              <View style={styles.alarmRow}>
                <AlarmSettingButton
                  text={selectedDateOption}
                  onPress={handleOpenDateOptionSelection}
                  isSelected={true}
                />
                <AlarmSettingButton
                  text={selectedNotificationTime}
                  onPress={handleOpenTimeSelectionForNotification}
                  isSelected={true}
                />
                <Text style={styles.alarmRowText}>시에 알고 싶어요</Text>
              </View>
            </View>
          )}

          {currentBottomSheetView === 'stationSelection' &&
            (isLoading ? (
              <ActivityIndicator size="large" color={theme.colors.primary[700]} />
            ) : (
              <View style={styles.stationChipContainer}>
                {stationsForSelection.map(station => (
                  <StationChip
                    key={station.id}
                    station={station}
                    onPress={handleSelectStation}
                    isSelected={selectedStation?.id === station.id}
                  />
                ))}
                {stationsForSelection.length === 0 && !isLoading && (
                  <Text style={styles.noFavoriteStationText}>
                    즐겨찾는 역이 없습니다. 먼저 즐겨찾는 역을 추가해주세요.
                  </Text>
                )}
              </View>
            ))}

          {currentBottomSheetView === 'lineSelection' && (
            <View style={styles.stationChipContainer}>
              {availableLines.map(line => (
                <LineChip
                  key={line}
                  line={line}
                  onPress={handleSelectLine}
                  isSelected={selectedLine === line}
                />
              ))}
              {availableLines.length === 0 && !isLoading && (
                <Text style={styles.noFavoriteStationText}>선택 가능한 호선이 없습니다.</Text>
              )}
            </View>
          )}

          {currentBottomSheetView === 'directionSelection' && (
            <View style={styles.stationChipContainer}>
              {availableDirections.map(direction => (
                <DirectionChip
                  key={direction}
                  direction={direction}
                  onPress={handleSelectDirection}
                  isSelected={selectedDirection === direction}
                />
              ))}
              {availableDirections.length === 0 && !isLoading && (
                <Text style={styles.noFavoriteStationText}>선택 가능한 방향이 없습니다.</Text>
              )}
            </View>
          )}

          {currentBottomSheetView === 'daySelection' && (
            <View style={styles.daySelectionContainer}>
              <DayChip day="매일" onPress={handleSelectDay} isSelected={selectedDay === '매일'} />
              <View style={styles.weekDaysContainer}>
                {['월', '화', '수', '목', '금', '토', '일'].map(day => (
                  <DayChip
                    key={day}
                    day={day}
                    onPress={handleSelectDay}
                    isSelected={selectedDay === day}
                    isCircle={true} // 원형 버튼으로 표시
                  />
                ))}
              </View>
            </View>
          )}

          {currentBottomSheetView === 'dateOptionSelection' && (
            <View style={styles.weekDaysContainer}>
              {['전날', '당일'].map(option => (
                <DateOptionChip
                  key={option}
                  option={option}
                  onPress={handleSelectDateOption}
                  isSelected={selectedDateOption === option}
                />
              ))}
            </View>
          )}

          {currentBottomSheetView === 'timeSelectionForCongestion' && (
            <ScrollView style={styles.scrollableTimeOptionsContainer}>
              <View style={styles.timeSelectionContainer}>
                {timeOptions.map(time => (
                  <TimeChip
                    key={time}
                    time={time}
                    onPress={handleSelectCongestionTime}
                    isSelected={selectedCongestionTime === time}
                  />
                ))}
              </View>
            </ScrollView>
          )}

          {currentBottomSheetView === 'timeSelectionForNotification' && (
            <ScrollView style={styles.scrollableTimeOptionsContainer}>
              <View style={styles.timeSelectionContainer}>
                {timeOptions.map(time => (
                  <TimeChip
                    key={time}
                    time={time}
                    onPress={handleSelectNotificationTime}
                    isSelected={selectedNotificationTime === time}
                  />
                ))}
              </View>
            </ScrollView>
          )}
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
    position: 'absolute',
    right: wp(9),
  },
  bottomSheetDoneButtonText: {
    color: theme.colors.gray[950],
    fontFamily: 'Pretendard-Regular',
    fontSize: px(24),
    fontWeight: '400',
    lineHeight: px(28),
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
  // AlarmSettingButton의 선택된 상태 스타일
  alarmSettingChipSelected: {
    backgroundColor: theme.colors.primary[100], // 선택된 버튼의 배경색
  },
  alarmSettingChipTextSelected: {
    color: theme.colors.primary[700], // 선택된 버튼의 텍스트색
  },

  // 역/호선/방향 칩 컨테이너 및 기본 스타일
  stationChipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: px(10), // 칩 간 간격
  },
  stationChip: {
    backgroundColor: theme.colors.gray[100],
    paddingVertical: hp(14),
    paddingHorizontal: wp(14),
    borderRadius: px(14),
    justifyContent: 'center',
    alignItems: 'center',
  },
  stationChipSelected: {
    backgroundColor: theme.colors.primary[100],
  },
  stationChipText: {
    color: theme.colors.gray[600],
    fontFamily: 'Pretendard-Medium',
    fontSize: px(28),
    fontWeight: '500',
    lineHeight: px(38),
  },
  stationChipTextSelected: {
    color: theme.colors.primary[700],
  },
  noFavoriteStationText: {
    color: theme.colors.gray[500],
    fontFamily: 'Pretendard-Medium',
    fontSize: px(16),
    lineHeight: px(24),
    marginTop: hp(20),
    textAlign: 'center',
    width: '100%',
  },

  // 요일 선택 스타일
  daySelectionContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start', // '매일' 버튼 정렬
    gap: hp(20), // '매일' 버튼과 요일 버튼 사이 간격
  },
  dayOptionChip: {
    // '매일' 버튼 스타일
    backgroundColor: theme.colors.gray[100],
    paddingVertical: hp(14),
    paddingHorizontal: wp(20),
    borderRadius: px(14),
  },
  dayOptionChipSelected: {
    backgroundColor: theme.colors.primary[100],
  },
  weekDaysContainer: {
    // 요일 원형 버튼 컨테이너
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: px(10), // 요일 버튼 간 간격
  },
  dayOptionCircle: {
    // 요일 원형 버튼 스타일
    width: wp(60), // 원형 버튼 크기
    height: hp(60),
    borderRadius: wp(30), // 원형으로 만들기
    backgroundColor: theme.colors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayOptionCircleSelected: {
    backgroundColor: theme.colors.primary[100],
  },
  dayOptionText: {
    // 요일 텍스트 스타일 (공통)
    color: theme.colors.gray[600],
    fontFamily: 'Pretendard-Medium',
    fontSize: px(28),
    fontWeight: '500',
    lineHeight: px(38),
  },
  dayOptionTextSelected: {
    color: theme.colors.primary[700],
  },
  scrollableTimeOptionsContainer: {
    flex: 1,
    maxHeight: hp(400),
  },

  // 시간 선택 스타일
  timeSelectionContainer: {
    flexDirection: 'column', // 시간 옵션은 세로로 나열
    gap: hp(10),
  },
  timeOptionChip: {
    width: '100%',
    backgroundColor: theme.colors.gray[100],
    paddingVertical: hp(14),
    paddingHorizontal: wp(14),
    borderRadius: px(14),
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start', // 내용물 크기에 맞게 왼쪽 정렬
  },
  timeOptionChipSelected: {
    backgroundColor: theme.colors.primary[100],
  },
  timeOptionText: {
    color: theme.colors.gray[600],
    fontFamily: 'Pretendard-Medium',
    fontSize: px(28),
    fontWeight: '500',
    lineHeight: px(38),
  },
  timeOptionTextSelected: {
    color: theme.colors.primary[700],
  },
});
