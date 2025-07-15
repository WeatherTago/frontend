import { myFavorite } from '@/apis/favorite'; // 즐겨찾는 역 API
import { theme } from '@/styles/theme';
import { hp, px, wp } from '@/utils/scale';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

// StationContext 훅 임포트
import { StationInfo, useStationContext } from '@/context/StationContext';

// 제공된 API 타입 임포트
import {
  AlarmBase,
  AlarmDayType,
  AlarmPeriodType,
  AlarmData as ApiAlarmData, // API에서 오는 AlarmData와 충돌 방지
  CreateAlarmRequest,
  DeleteAlarmRequest,
  UpdateAlarmRequest,
} from '@/types/alarm';

// BottomSheet의 현재 뷰를 관리할 타입 정의
type BottomSheetViewType =
  | 'mainAlarmSettings'
  | 'stationSelection'
  | 'lineSelection' // 호선 선택 뷰 유지
  | 'directionSelection'
  | 'periodSelection' // 요일 -> 기간 (AlarmPeriodType)
  | 'dayOptionSelection' // 날짜 옵션 -> 요일 (AlarmDayType)
  | 'referenceTimeSelection' // 혼잡도 기준 시간
  | 'alarmTimeSelection'; // 알림 수신 시간

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
        source={
          isSelected
            ? require('@/assets/images/right-arrow-mint.png') // isSelected 시 민트색 화살표 사용
            : require('@/assets/images/right-arrow.png')
        }
        style={styles.alarmSettingChipArrowImage}
        resizeMode="contain"
      />
    </View>
  </TouchableOpacity>
);

// 역 칩 컴포넌트 (역 선택 BottomSheet용)
interface StationChipProps {
  station: StationInfo; // StationInfo 타입 사용
  onPress: (station: StationInfo) => void; // StationInfo 타입 사용
  isSelected: boolean;
}

const StationChip: React.FC<StationChipProps> = ({ station, onPress, isSelected }) => (
  <TouchableOpacity
    style={[styles.stationChip, isSelected && styles.stationChipSelected]}
    onPress={() => onPress(station)}
  >
    <Text style={[styles.stationChipText, isSelected && styles.stationChipTextSelected]}>
      {station.stationName}
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

// 기간(요일) 칩 컴포넌트 (기간 선택 BottomSheet용)
interface PeriodChipProps {
  period: AlarmPeriodType;
  onPress: (period: AlarmPeriodType) => void;
  isSelected: boolean;
  displayText: string; // UI에 표시될 텍스트 (예: '매일', '월')
  isCircle?: boolean; // 요일 원형 버튼을 위한 prop (DayChip에서 가져옴)
}

const PeriodChip: React.FC<PeriodChipProps> = ({
  period,
  onPress,
  isSelected,
  displayText,
  isCircle = false,
}) => (
  <TouchableOpacity
    style={[
      isCircle ? styles.dayOptionCircle : styles.dayOptionChip,
      isSelected && (isCircle ? styles.dayOptionCircleSelected : styles.dayOptionChipSelected),
    ]}
    onPress={() => onPress(period)}
  >
    <Text
      style={[
        // isCircle ? styles.dayOptionText : styles.dayOptionText, // 원본 스타일 유지
        styles.dayOptionText,
        isSelected && styles.dayOptionTextSelected,
      ]}
    >
      {displayText}
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
interface DayOptionChipProps {
  // DayOptionChipProps 이름 유지
  dayOption: AlarmDayType;
  onPress: (dayOption: AlarmDayType) => void;
  isSelected: boolean;
  displayText: string; // UI에 표시될 텍스트 (예: '전날', '오늘')
}

const DayOptionChip: React.FC<DayOptionChipProps> = ({
  dayOption,
  onPress,
  isSelected,
  displayText,
}) => (
  <TouchableOpacity
    style={[styles.timeOptionChip, isSelected && styles.timeOptionChipSelected]} // timeOptionChip 스타일 재활용
    onPress={() => onPress(dayOption)}
  >
    <Text style={[styles.timeOptionText, isSelected && styles.timeOptionTextSelected]}>
      {displayText}
    </Text>
  </TouchableOpacity>
);

// BottomSheet의 외부에서 접근할 수 있는 핸들러들을 정의합니다.
export interface AlarmEditBottomSheetRef {
  present: (initialAlarmData?: ApiAlarmData) => void; // 초기 데이터로 present
  close: () => void;
}

interface AlarmEditBottomSheetProps {
  onAlarmActionCompleted: () => void; // 알림 저장 (등록/수정) 또는 삭제 후 콜백
}

const AlarmEditBottomSheet = forwardRef<AlarmEditBottomSheetRef, AlarmEditBottomSheetProps>(
  ({ onAlarmActionCompleted }, ref) => {
    const bottomSheetRef = React.useRef<BottomSheet>(null);
    const {
      stations,
      loading: isLoadingStationContext,
      getStationIdByNameAndLine,
    } = useStationContext();

    // --- 1. 선택된 알림 설정 값들 상태 (API 타입과 용어 통일) ---
    const [alarmId, setAlarmId] = useState<number | undefined>(undefined); // 알림 ID (수정/삭제용)
    const [isEditMode, setIsEditMode] = useState(false); // 수정 모드 여부

    const [selectedStation, setSelectedStation] = useState<StationInfo | null>(null); // StationInfo 타입 사용
    const [selectedLine, setSelectedLine] = useState<string | null>(null); // 호선 상태 유지
    const [selectedDirection, setSelectedDirection] = useState<string | null>(null);
    const [selectedReferenceTime, setSelectedReferenceTime] = useState<string>('08:00'); // referenceTime
    const [selectedAlarmPeriod, setSelectedAlarmPeriod] = useState<AlarmPeriodType>('EVERYDAY'); // alarmPeriod
    const [selectedAlarmDay, setSelectedAlarmDay] = useState<AlarmDayType>('YESTERDAY'); // alarmDay
    const [selectedAlarmTime, setSelectedAlarmTime] = useState<string>('08:00'); // alarmTime

    // --- 2. 현재 BottomSheet에 보여줄 뷰 타입 상태 ---
    const [currentBottomSheetView, setCurrentBottomSheetView] =
      useState<BottomSheetViewType>('mainAlarmSettings');

    // --- 3. 즐겨찾는 역 API 데이터 및 로딩 상태 ---
    const [favoriteStationsApiData, setFavoriteStationsApiData] = useState<any[]>([]); // API 원본 데이터 (myFavorite 응답)
    const [isLoadingFavorites, setIsLoadingFavorites] = useState(false); // 즐겨찾기 역 로딩 상태

    // `AlarmScreen`에서 전달받은 `initialAlarmData`를 사용하여 상태 초기화
    const initializeAlarmData = useCallback(
      (initialData?: ApiAlarmData) => {
        if (initialData?.alarmId) {
          setIsEditMode(true);
          setAlarmId(initialData.alarmId);

          // ApiAlarmData에는 stationId가 없으므로, stationName과 stationLine으로 stationId 조회
          const foundStationId = getStationIdByNameAndLine(
            initialData.stationName,
            initialData.stationLine,
          );
          if (foundStationId !== null) {
            setSelectedStation({
              stationId: foundStationId,
              stationName: initialData.stationName,
              stationLine: initialData.stationLine,
            });
            setSelectedLine(initialData.stationLine); // 호선도 초기화
          } else {
            console.warn(
              `Station ID not found for ${initialData.stationName} (${initialData.stationLine})`,
            );
            setSelectedStation(null);
            setSelectedLine(null);
          }

          setSelectedDirection(initialData.direction);
          setSelectedReferenceTime(initialData.referenceTime);
          setSelectedAlarmPeriod(initialData.alarmPeriod);
          setSelectedAlarmDay(initialData.alarmDay);
          setSelectedAlarmTime(initialData.alarmTime);
        } else {
          setIsEditMode(false);
          setAlarmId(undefined);
          setSelectedStation(null); // 새 알림 시 초기화
          setSelectedLine(null); // 호선도 초기화
          setSelectedDirection(null);
          setSelectedReferenceTime('08:00');
          setSelectedAlarmPeriod('EVERYDAY');
          setSelectedAlarmDay('YESTERDAY');
          setSelectedAlarmTime('08:00');
        }
        setCurrentBottomSheetView('mainAlarmSettings'); // 항상 메인 뷰에서 시작
      },
      [getStationIdByNameAndLine],
    ); // getStationIdByNameAndLine 의존성 추가

    // `useImperativeHandle`을 사용하여 부모 컴포넌트에서 호출할 수 있는 함수 노출
    useImperativeHandle(ref, () => ({
      present: (initialAlarmData?: ApiAlarmData) => {
        initializeAlarmData(initialAlarmData);
        bottomSheetRef.current?.snapToIndex(2); // 최대 높이로 열기
      },
      close: () => {
        bottomSheetRef.current?.close();
      },
    }));

    // 즐겨찾는 역 API 호출
    const fetchFavoriteStations = useCallback(async () => {
      setIsLoadingFavorites(true);
      try {
        const response = await myFavorite();
        if (response.isSuccess && response.result && response.result.stations) {
          setFavoriteStationsApiData(response.result.stations);
        }
      } catch (error) {
        console.error('즐겨찾는 역 불러오기 실패:', error);
      } finally {
        setIsLoadingFavorites(false);
      }
    }, []);

    // 컴포넌트 마운트 시 즐겨찾는 역 데이터 로드
    useEffect(() => {
      fetchFavoriteStations();
    }, [fetchFavoriteStations]);

    // 전체 로딩 상태 (StationContext 로딩 + 즐겨찾기 로딩)
    const overallLoading = isLoadingStationContext || isLoadingFavorites;

    const snapPoints = useMemo(() => ['25%', '50%', '75%'], []);

    // --- 4. 필터링된 옵션 목록 계산 (useMemo 활용) ---

    // 1. 역 선택 BottomSheet에서 보여줄 즐겨찾는 역 목록
    const stationsForSelection: StationInfo[] = useMemo(() => {
      // favoriteStationsApiData는 StationInfo와 동일한 구조라고 가정
      return favoriteStationsApiData.map(station => ({
        stationId: station.stationId,
        stationName: station.stationName,
        stationLine: station.stationLine,
      }));
    }, [favoriteStationsApiData]);

    // 2. 호선 선택 BottomSheet에서 보여줄 호선 목록
    const availableLines = useMemo(() => {
      const lines = new Set<string>();
      if (selectedStation) {
        // 선택된 역이 있으면 해당 역의 호선만 표시 (단일 역의 여러 호선 가능성 배제)
        // 만약 한 역에 여러 호선이 등록될 수 있다면, favoriteStationsApiData에서 해당 역의 모든 호선을 찾아야 함
        // 예시: favoriteStationsApiData.filter(s => s.stationName === selectedStation.stationName).forEach(s => lines.add(s.stationLine));
        lines.add(selectedStation.stationLine);
      } else {
        // 역이 선택되지 않았다면 모든 즐겨찾기 역의 호선
        favoriteStationsApiData.forEach(station => {
          lines.add(station.stationLine);
        });
      }
      return Array.from(lines);
    }, [selectedStation, favoriteStationsApiData]);

    // 3. 방향 선택 BottomSheet에서 보여줄 방향 목록
    const availableDirections = useMemo(() => {
      if (!selectedLine) return []; // selectedLine이 없으면 방향도 선택 불가
      if (selectedLine === '2호선') {
        return ['내선', '외선'];
      }
      return ['상행', '하행'];
    }, [selectedLine]); // selectedLine에 의존

    // 기간(요일) 옵션 (고정값)
    const periodOptions: { type: AlarmPeriodType; displayText: string }[] = useMemo(
      () => [
        { type: 'EVERYDAY', displayText: '매일' },
        { type: 'MONDAY', displayText: '월' },
        { type: 'TUESDAY', displayText: '화' },
        { type: 'WEDNESDAY', displayText: '수' },
        { type: 'THURSDAY', displayText: '목' },
        { type: 'FRIDAY', displayText: '금' },
        { type: 'SATURDAY', displayText: '토' },
        { type: 'SUNDAY', displayText: '일' },
      ],
      [],
    );

    // 날짜 옵션(요일) (고정값)
    const dayOptions: { type: AlarmDayType; displayText: string }[] = useMemo(
      () => [
        { type: 'YESTERDAY', displayText: '전날' },
        { type: 'TODAY', displayText: '당일' },
      ],
      [],
    );

    // 시간 옵션 (고정값 - 1시~4시 제외)
    const timeOptions = useMemo(() => {
      const times: string[] = [];
      for (let h = 0; h < 24; h++) {
        if (h >= 1 && h <= 4) continue;
        const hour = h < 10 ? `0${h}` : `${h}`;
        times.push(`${hour}:00`);
      }
      return times;
    }, []);

    // --- 5. 각 설정 버튼 클릭 시 뷰 전환 핸들러 ---
    const handleOpenStationSelection = useCallback(() => {
      setCurrentBottomSheetView('stationSelection');
      bottomSheetRef.current?.snapToIndex(2);
    }, []);

    const handleOpenLineSelection = useCallback(() => {
      if (!selectedStation) {
        Alert.alert('알림', '역을 먼저 선택해주세요.');
        return;
      }
      // 이 부분은 특정 역에 여러 호선이 있을 때만 의미가 있습니다.
      // 현재 selectedStation은 이미 단일 호선을 가지고 있으므로,
      // 이 버튼은 선택된 역의 호선을 표시하는 용도로만 사용될 수 있습니다.
      // 하지만 요구사항에 따라 '호선 선택' 뷰를 유지해야 한다면 아래 로직을 따릅니다.
      setCurrentBottomSheetView('lineSelection');
      bottomSheetRef.current?.snapToIndex(2);
    }, [selectedStation]); // selectedStation이 변경되면 이 콜백도 재생성

    const handleOpenDirectionSelection = useCallback(() => {
      if (!selectedStation || !selectedLine) {
        // selectedLine도 확인
        Alert.alert('알림', '역과 호선을 먼저 선택해주세요.');
        return;
      }
      setCurrentBottomSheetView('directionSelection');
      bottomSheetRef.current?.snapToIndex(2);
    }, [selectedStation, selectedLine]);

    const handleOpenPeriodSelection = useCallback(() => {
      setCurrentBottomSheetView('periodSelection');
      bottomSheetRef.current?.snapToIndex(2);
    }, []);

    const handleOpenDayOptionSelection = useCallback(() => {
      setCurrentBottomSheetView('dayOptionSelection');
      bottomSheetRef.current?.snapToIndex(2);
    }, []);

    const handleOpenReferenceTimeSelection = useCallback(() => {
      setCurrentBottomSheetView('referenceTimeSelection');
      bottomSheetRef.current?.snapToIndex(2);
    }, []);

    const handleOpenAlarmTimeSelection = useCallback(() => {
      setCurrentBottomSheetView('alarmTimeSelection');
      bottomSheetRef.current?.snapToIndex(2);
    }, []);

    // --- 6. 각 항목 선택 핸들러 (선택 후 메인 뷰로 돌아감) ---

    const handleSelectStation = useCallback((station: StationInfo) => {
      // StationInfo 타입 사용
      setSelectedStation(station);
      setSelectedLine(station.stationLine); // 역 선택 시 해당 역의 호선 자동 설정
      setSelectedDirection(null); // 역 변경 시 방향 초기화
      setCurrentBottomSheetView('mainAlarmSettings');
    }, []);

    const handleSelectLine = useCallback(
      (line: string) => {
        // 호선 선택 시 selectedStation의 stationLine도 업데이트 (선택된 역의 호선 변경)
        // 만약 selectedStation이 있다면 해당 역의 stationLine을 업데이트합니다.
        // 이 로직은 한 역에 여러 호선이 있고, 사용자가 그 중 하나를 선택하는 시나리오에 적합합니다.
        if (selectedStation) {
          setSelectedStation(prev => (prev ? { ...prev, stationLine: line } : null));
        }
        setSelectedLine(line);
        setSelectedDirection(null); // 호선 변경 시 방향 초기화
        setCurrentBottomSheetView('mainAlarmSettings');
      },
      [selectedStation],
    );

    const handleSelectDirection = useCallback((direction: string) => {
      setSelectedDirection(direction);
      setCurrentBottomSheetView('mainAlarmSettings');
    }, []);

    const handleSelectPeriod = useCallback((period: AlarmPeriodType) => {
      setSelectedAlarmPeriod(period);
      setCurrentBottomSheetView('mainAlarmSettings');
    }, []);

    const handleSelectDayOption = useCallback((dayOption: AlarmDayType) => {
      setSelectedAlarmDay(dayOption);
      setCurrentBottomSheetView('mainAlarmSettings');
    }, []);

    const handleSelectReferenceTime = useCallback((time: string) => {
      setSelectedReferenceTime(time);
      setCurrentBottomSheetView('mainAlarmSettings');
    }, []);

    const handleSelectAlarmTime = useCallback((time: string) => {
      setSelectedAlarmTime(time);
      setCurrentBottomSheetView('mainAlarmSettings');
    }, []);

    // --- 7. 알림 등록/수정/삭제 핸들러 ---
    const handleSaveAlarm = useCallback(async () => {
      if (!selectedStation || !selectedLine || !selectedDirection) {
        // selectedLine도 필수값으로 확인
        Alert.alert('알림', '역, 호선, 방향을 모두 선택해주세요.');
        return;
      }

      // API 요청 페이로드 구성
      const payload: AlarmBase = {
        stationName: selectedStation.stationName,
        stationLine: selectedLine, // selectedLine 사용
        direction: selectedDirection,
        referenceTime: selectedReferenceTime,
        alarmPeriod: selectedAlarmPeriod,
        alarmDay: selectedAlarmDay,
        alarmTime: selectedAlarmTime,
      };

      try {
        if (isEditMode && alarmId !== undefined) {
          // 수정 모드: 알림 수정 API 호출
          const updatePayload: UpdateAlarmRequest = {
            alarmId: alarmId,
            ...payload,
          };
          // const response = await updateAlarm(updatePayload); // 실제 API 호출
          Alert.alert('알림', `알림이 수정되었습니다: ${JSON.stringify(updatePayload)}`); // 임시 메시지
        } else {
          // 등록 모드: 알림 등록 API 호출
          const createPayload: CreateAlarmRequest = payload;
          // const response = await createAlarm(createPayload); // 실제 API 호출
          Alert.alert('알림', `새 알림이 등록되었습니다: ${JSON.stringify(createPayload)}`); // 임시 메시지
        }
        bottomSheetRef.current?.close();
        onAlarmActionCompleted(); // 부모 컴포넌트에 알림 저장 완료 알림
      } catch (error) {
        Alert.alert('오류', '알림 저장에 실패했습니다.');
        console.error('알림 저장 오류:', error);
      }
    }, [
      selectedStation,
      selectedLine, // 의존성 추가
      selectedDirection,
      selectedReferenceTime,
      selectedAlarmPeriod,
      selectedAlarmDay,
      selectedAlarmTime,
      isEditMode,
      alarmId,
      onAlarmActionCompleted,
    ]);

    const handleDeleteAlarm = useCallback(async () => {
      if (alarmId === undefined) {
        Alert.alert('오류', '삭제할 알림 정보가 없습니다.');
        return;
      }

      Alert.alert(
        '알림 삭제',
        '정말로 이 알림을 삭제하시겠습니까?',
        [
          {
            text: '취소',
            style: 'cancel',
          },
          {
            text: '삭제',
            onPress: async () => {
              try {
                const deletePayload: DeleteAlarmRequest = { alarmId: alarmId };
                // const response = await deleteAlarm(deletePayload); // 실제 API 호출
                Alert.alert('알림', '알림이 성공적으로 삭제되었습니다.'); // 임시 메시지
                bottomSheetRef.current?.close();
                onAlarmActionCompleted(); // 부모 컴포넌트에 알림 삭제 완료 알림
              } catch (error) {
                Alert.alert('오류', '알림 삭제에 실패했습니다.');
                console.error('알림 삭제 오류:', error);
              }
            },
          },
        ],
        { cancelable: true },
      );
    }, [alarmId, onAlarmActionCompleted]);

    // UI 표시를 위한 텍스트 매핑
    const getPeriodDisplayText = useCallback(
      (periodType: AlarmPeriodType) => {
        const found = periodOptions.find(p => p.type === periodType);
        return found ? found.displayText : '선택해주세요';
      },
      [periodOptions],
    );

    const getDayOptionDisplayText = useCallback(
      (dayType: AlarmDayType) => {
        const found = dayOptions.find(d => d.type === dayType);
        return found ? found.displayText : '선택해주세요';
      },
      [dayOptions],
    );

    // 전체 로딩 상태 (역 정보 로딩 + 즐겨찾기 로딩)
    const overallLoadingState = overallLoading;

    // BottomSheet 내용 렌더링
    const renderContent = useCallback(() => {
      if (overallLoadingState) {
        // 전체 로딩 상태 사용
        return (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary[700]} />
            <Text>데이터 로딩 중...</Text>
          </View>
        );
      }

      switch (currentBottomSheetView) {
        case 'mainAlarmSettings':
          return (
            <View style={styles.alarmOptionsContainer}>
              <View style={styles.alarmRow}>
                <AlarmSettingButton
                  text={selectedStation ? selectedStation.stationName : '역'}
                  onPress={handleOpenStationSelection}
                  isSelected={!!selectedStation}
                />
                <AlarmSettingButton
                  text={selectedLine ? selectedLine : '호선'}
                  onPress={handleOpenLineSelection} // 호선 선택 뷰로 이동
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
                  text={getPeriodDisplayText(selectedAlarmPeriod)}
                  onPress={handleOpenPeriodSelection}
                  isSelected={true}
                />
                <AlarmSettingButton
                  text={selectedReferenceTime}
                  onPress={handleOpenReferenceTimeSelection}
                  isSelected={true}
                />
                <Text style={styles.alarmRowText}>시 혼잡도를</Text>
              </View>
              <View style={styles.alarmRow}>
                <AlarmSettingButton
                  text={getDayOptionDisplayText(selectedAlarmDay)}
                  onPress={handleOpenDayOptionSelection}
                  isSelected={true}
                />
                <AlarmSettingButton
                  text={selectedAlarmTime}
                  onPress={handleOpenAlarmTimeSelection}
                  isSelected={true}
                />
                <Text style={styles.alarmRowText}>시에 알고 싶어요</Text>
              </View>

              <View style={styles.actionButtonContainer}>
                {isEditMode && (
                  <TouchableOpacity
                    style={[styles.actionButton, styles.deleteButton]}
                    onPress={handleDeleteAlarm}
                  >
                    <Text style={styles.actionButtonText}>알림 삭제하기</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          );
        case 'stationSelection':
          return (
            <ScrollView style={styles.scrollableContent}>
              <View style={styles.stationChipContainer}>
                {stationsForSelection.map(station => (
                  <StationChip
                    key={station.stationId}
                    station={station}
                    onPress={handleSelectStation}
                    // 역 선택 시 selectedStation의 stationId와 비교
                    isSelected={selectedStation?.stationId === station.stationId}
                  />
                ))}
                {stationsForSelection.length === 0 && !overallLoadingState && (
                  <Text style={styles.noFavoriteStationText}>
                    즐겨찾는 역이 없습니다. 먼저 즐겨찾는 역을 추가해주세요.
                  </Text>
                )}
              </View>
            </ScrollView>
          );
        case 'lineSelection': // 호선 선택 뷰 유지
          return (
            <ScrollView style={styles.scrollableContent}>
              <View style={styles.stationChipContainer}>
                {availableLines.map(line => (
                  <LineChip
                    key={line}
                    line={line}
                    onPress={handleSelectLine}
                    isSelected={selectedLine === line}
                  />
                ))}
                {availableLines.length === 0 && !overallLoadingState && (
                  <Text style={styles.noFavoriteStationText}>선택 가능한 호선이 없습니다.</Text>
                )}
              </View>
            </ScrollView>
          );
        case 'directionSelection':
          return (
            <ScrollView style={styles.scrollableContent}>
              <View style={styles.stationChipContainer}>
                {availableDirections.map(direction => (
                  <DirectionChip
                    key={direction}
                    direction={direction}
                    onPress={handleSelectDirection}
                    isSelected={selectedDirection === direction}
                  />
                ))}
                {availableDirections.length === 0 && !overallLoadingState && (
                  <Text style={styles.noFavoriteStationText}>선택 가능한 방향이 없습니다.</Text>
                )}
              </View>
            </ScrollView>
          );
        case 'periodSelection':
          return (
            <ScrollView style={styles.scrollableContent}>
              <View style={styles.daySelectionContainer}>
                <PeriodChip
                  period="EVERYDAY"
                  displayText="매일"
                  onPress={handleSelectPeriod}
                  isSelected={selectedAlarmPeriod === 'EVERYDAY'}
                />
                <View style={styles.weekDaysContainer}>
                  {periodOptions
                    .filter(p => p.type !== 'EVERYDAY')
                    .map(option => (
                      <PeriodChip
                        key={option.type}
                        period={option.type}
                        displayText={option.displayText}
                        onPress={handleSelectPeriod}
                        isSelected={selectedAlarmPeriod === option.type}
                        isCircle={true}
                      />
                    ))}
                </View>
              </View>
            </ScrollView>
          );
        case 'dayOptionSelection':
          return (
            <ScrollView style={styles.scrollableContent}>
              <View style={styles.weekDaysContainer}>
                {dayOptions.map(option => (
                  <DayOptionChip
                    key={option.type}
                    dayOption={option.type}
                    displayText={option.displayText}
                    onPress={handleSelectDayOption}
                    isSelected={selectedAlarmDay === option.type}
                  />
                ))}
              </View>
            </ScrollView>
          );
        case 'referenceTimeSelection':
        case 'alarmTimeSelection':
          return (
            <ScrollView style={styles.scrollableTimeOptionsContainer}>
              <View style={styles.timeSelectionContainer}>
                {timeOptions.map(time => (
                  <TimeChip
                    key={time}
                    time={time}
                    onPress={
                      currentBottomSheetView === 'referenceTimeSelection'
                        ? handleSelectReferenceTime
                        : handleSelectAlarmTime
                    }
                    isSelected={
                      currentBottomSheetView === 'referenceTimeSelection'
                        ? selectedReferenceTime === time
                        : selectedAlarmTime === time
                    }
                  />
                ))}
              </View>
            </ScrollView>
          );
        default:
          return null;
      }
    }, [
      overallLoadingState,
      currentBottomSheetView,
      isEditMode,
      selectedStation,
      selectedLine, // 의존성 추가
      selectedDirection,
      selectedReferenceTime,
      selectedAlarmPeriod,
      selectedAlarmDay,
      selectedAlarmTime,
      stationsForSelection,
      availableLines, // 의존성 추가
      availableDirections,
      periodOptions,
      dayOptions,
      timeOptions,
      handleOpenStationSelection,
      handleOpenLineSelection, // 의존성 추가
      handleOpenDirectionSelection,
      handleOpenPeriodSelection,
      handleOpenDayOptionSelection,
      handleOpenReferenceTimeSelection,
      handleOpenAlarmTimeSelection,
      handleSaveAlarm,
      handleDeleteAlarm,
      handleSelectStation,
      handleSelectLine, // 의존성 추가
      handleSelectDirection,
      handleSelectPeriod,
      handleSelectDayOption,
      handleSelectReferenceTime,
      handleSelectAlarmTime,
      getPeriodDisplayText,
      getDayOptionDisplayText,
    ]);

    return (
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        enableContentPanningGesture={false}
        backgroundStyle={styles.bottomSheetBackground}
        handleIndicatorStyle={styles.bottomSheetHandleIndicator}
        onClose={() => setCurrentBottomSheetView('mainAlarmSettings')}
      >
        <BottomSheetView style={styles.bottomSheetContent}>
          <View style={styles.bottomSheetHeader}>
            <Text style={styles.bottomSheetTitle}>
              {currentBottomSheetView === 'mainAlarmSettings' && '알림 설정'}
              {currentBottomSheetView === 'stationSelection' && '역 선택'}
              {currentBottomSheetView === 'lineSelection' && '호선 선택'}
              {currentBottomSheetView === 'directionSelection' && '방향 선택'}
              {currentBottomSheetView === 'periodSelection' && '요일 선택'}
              {currentBottomSheetView === 'referenceTimeSelection' && '혼잡도 기준 시간 선택'}
              {currentBottomSheetView === 'alarmTimeSelection' && '알림 수신 시간 선택'}
              {currentBottomSheetView === 'dayOptionSelection' && '날짜 옵션 선택'}
            </Text>
            <TouchableOpacity style={styles.bottomSheetDoneButton} onPress={handleSaveAlarm}>
              <Text style={styles.bottomSheetDoneButtonText}>완료</Text>
            </TouchableOpacity>
          </View>
          {renderContent()}
        </BottomSheetView>
      </BottomSheet>
    );
  },
);

// Styles (이전과 동일하게 유지)
const styles = StyleSheet.create({
  bottomSheetBackground: {
    backgroundColor: theme.colors.gray[0],
    borderRadius: px(24),
  },
  bottomSheetHandleIndicator: {
    backgroundColor: theme.colors.gray[300],
    width: wp(40),
    height: hp(4),
  },
  bottomSheetContent: {
    flex: 1,
    paddingHorizontal: wp(24),
    paddingTop: hp(10),
  },
  bottomSheetHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp(48),
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
    gap: hp(20),
  },
  alarmRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  alarmSettingChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.gray[100],
    paddingVertical: hp(14),
    paddingHorizontal: wp(14),
    borderRadius: px(14),
    marginRight: wp(16),
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
    marginLeft: wp(4),
  },
  alarmSettingChipSelected: {
    backgroundColor: theme.colors.primary[100],
  },
  alarmSettingChipTextSelected: {
    color: theme.colors.primary[700],
  },
  stationChipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: px(10),
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
  daySelectionContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: hp(20),
  },
  dayOptionChip: {
    backgroundColor: theme.colors.gray[100],
    paddingVertical: hp(14),
    paddingHorizontal: wp(20),
    borderRadius: px(14),
  },
  dayOptionChipSelected: {
    backgroundColor: theme.colors.primary[100],
  },
  weekDaysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: px(10),
  },
  dayOptionCircle: {
    width: wp(60),
    height: hp(60),
    borderRadius: wp(30),
    backgroundColor: theme.colors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayOptionCircleSelected: {
    backgroundColor: theme.colors.primary[100],
  },
  dayOptionText: {
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
    maxHeight: hp(350),
  },
  timeSelectionContainer: {
    flexDirection: 'column',
    gap: hp(10),
  },
  timeOptionChip: {
    width: '100%',
    backgroundColor: theme.colors.gray[0],
    paddingVertical: hp(14),
    paddingHorizontal: wp(14),
    borderRadius: px(14),
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonContainer: {
    width: '100%',
    marginTop: hp(20),
  },
  actionButton: {
    backgroundColor: theme.colors.primary[700],
    paddingVertical: hp(15),
    paddingHorizontal: wp(30),
    borderRadius: px(10),
    marginBottom: hp(10),
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {
    color: theme.colors.gray[0],
    fontSize: px(18),
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: theme.colors.gray[300],
  },
  scrollableContent: {
    flex: 1,
  },
});

export default AlarmEditBottomSheet;
