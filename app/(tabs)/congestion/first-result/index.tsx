import { fetchStationByIdAndTime, fetchStationDetailInfo } from '@/apis/station';
import subwayImage from '@/assets/images/subway/subway-all.png';
import Header from '@/components/Header/CommonHeader';
import InfoBox from '@/components/InfoBox';
import StationHeader from '@/components/StationHeader';
import StationInfo from '@/components/StationInfo';
import { useStationContext } from '@/context/StationContext';
import { StationDetail, StationResult } from '@/types/station';
import { hp, px, wp } from '@/utils/scale';
import { useTheme } from '@emotion/react';
import { BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import dayjs from 'dayjs';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function FirstResultScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const theme=useTheme();
  const { station, line, date, time } = useLocalSearchParams<{
    station: string;
    line: string;
    date: string;
    time: string;
  }>();
  const { getStationIdByNameAndLine } = useStationContext();
  const [result, setResult] = useState<StationResult | null>(null);
  const [loading, setLoading] = useState(true);

  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = ['20%', '90%'];

  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedButton, setSelectedButton] = useState<'상행' | '하행' | '외선' | '내선' | null>(null);
  const [directionKeys, setDirectionKeys] = useState<('상행' | '하행' | '외선' | '내선')[]>([]);

  useEffect(() => {
    if (result) {
      const keys = Object.keys(result.congestionByDirection || {}) as (
        '상행' | '하행' | '외선' | '내선'
      )[];
      setDirectionKeys(keys);
      if (keys.length > 0) {
        setSelectedButton(keys[0]);
      }
    }
  }, [result]);

  useEffect(() => {
  const fetchData = async () => {
    if (!station || !line || !date || !time) {
      setLoading(false);
      return;
    }

    const stationId = getStationIdByNameAndLine(station, line);
    if (!stationId) {
      setLoading(false);
      return;
    }

    try {
      const [res, detailRes] = await Promise.all([
        fetchStationByIdAndTime({ stationId, time: time as string }),
        fetchStationDetailInfo(),
      ]);

      setResult(res);

      const matchedDetails = detailRes.result.filter(
        (item: StationDetail) => item.stationName === station
      );
      const base = matchedDetails.reduce<StationDetail | null>(
        (min, curr) => !min || curr.stationId < min.stationId ? curr : min,
        null
      );

      setAddress(base?.address ?? '아직 주소를 업데이트하고 있어요');
      setPhoneNumber(base?.phoneNumber ?? '02-0000-0000');
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [station, line, date, time]);

  useEffect(() => {
    if (!loading && bottomSheetRef.current) {
      bottomSheetRef.current.present();
    }
  }, [loading]);

  const renderBottomSheetContent = () => {
    if (!result) {
      return (
        <>
          <Text>❌ 결과를 불러오지 못했습니다.</Text>
          <Text>{station} / {line}</Text>
        </>
      );
    }


    return (
      <>
      <StationHeader
          stationName={result.name}
          lines={[result.line]}
          address={address}
          phoneNumber={phoneNumber}
        /> 
        <View style={[styles.clickBox, { backgroundColor: theme.colors.gray[0] }]}>
          {directionKeys.map((dirKey) => (
            <TouchableOpacity
              key={dirKey}
              style={[
                styles.button,
                selectedButton === dirKey ? styles.selected : styles.unselected,
              ]}
              onPress={() => setSelectedButton(dirKey)}
            >
              <Text
                style={[
                  styles.buttonText,
                  {
                    color:
                      selectedButton === dirKey
                        ? theme.colors.gray[800]
                        : theme.colors.gray[400],
                  },
                ]}
              >
                {dirKey} 노선
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 선택된 방향의 혼잡도 InfoBox 하나만 보여주기 */}
        {(() => {
          if (!selectedButton) return null;

          const directionData = result.congestionByDirection?.[selectedButton];
          const congestion = directionData?.congestion;

          if (!congestion) {
            return <Text>⚠️ {selectedButton} 방향 정보 없음</Text>;
          }

          let specialColor = '';
          let backgroundColor = '';
          let topText = '';

          switch (congestion.congestionLevel) {
            case '여유':
              specialColor = theme.colors.primary[500];
              backgroundColor = theme.colors.primary[100];
              topText = '승객 대부분이 착석해서 갈 수 있어요';
              break;
            case '보통':
              specialColor = theme.colors.primary[800];
              backgroundColor = theme.colors.primary[100];
              topText = '승객들이 여유롭게 이동할 수 있어요';
              break;
            case '주의':
              specialColor = theme.colors.secondary.blue;
              backgroundColor = '#D9F2FE';
              topText = '이동할 때 다른 승객들과 부딪힐 수 있어요';
              break;
            case '혼잡':
              specialColor = theme.colors.secondary.pink;
              backgroundColor = '#FDE7F2';
              topText = '승객이 많아 지하철에서 이동할 수 없어요';
              break;
            default:
              specialColor = theme.colors.gray[400];
              backgroundColor = theme.colors.gray[100];
              topText = '혼잡도 정보 없음';
          }

        const selectedDate = dayjs(time);

        // 오늘/내일/모레 판단
        const today = dayjs().startOf('day');
        let dateLabel = '오늘';

        if (selectedDate.isSame(today.add(1, 'day'), 'day')) {
          dateLabel = '내일';
        } else if (selectedDate.isSame(today.add(2, 'day'), 'day')) {
          dateLabel = '모레';
        }

        const hourStr = selectedDate.format('HH');
        const formattedTime = `${dateLabel} ${hourStr}:00`;

          return (
            <InfoBox
              key={selectedButton}
              specialColor={specialColor}
              backgroundColor={backgroundColor}
              topText={topText}
              number={`${congestion.congestionScore}%`}
              rate={congestion.congestionLevel}
              time={formattedTime}
            />
          );
        })()}



        <View style={styles.weatherBlock}>
          <Text style={styles.weatherTitle}>날씨 정보</Text>
          {result.weather ? (
            <>
              <Text>🌡️ 기온: {result.weather.tmp ?? '--'}℃</Text>
              <Text>🌧️ 강수량: {result.weather.pcp ?? '--'}mm</Text>
              <Text>💧 습도: {result.weather.reh ?? '--'}%</Text>
              <Text>❄️ 적설: {result.weather.sno ?? '--'}mm</Text>
              <Text>🌬️ 풍향: {result.weather.vec ?? '--'}°</Text>
              <Text>💨 풍속: {result.weather.wsd ?? '--'}m/s</Text>
              <Text>상태: {result.weather.status ?? '--'}</Text>
            </>
          ) : (
            <Text>날씨 데이터가 없습니다.</Text>
          )}
        </View>

        <StationInfo/>

      </>
    );
  };
      const [isDismissed, setIsDismissed] = useState(false);

    useEffect(() => {
  if (!loading && bottomSheetRef.current && isDismissed) {
    // dismiss되었다가 다시 띄워야 할 때
    setIsDismissed(false); // 먼저 false로 바꿔주고
    bottomSheetRef.current.present(); // 다시 열기
  } else if (!loading && bottomSheetRef.current && !isDismissed) {
    bottomSheetRef.current.present(); // 최초 진입
  }
}, [loading, isDismissed]);

    const handleDismiss = () => {
      setIsDismissed(true);
    };

    const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');
    const safeHeight = SCREEN_HEIGHT - insets.top - insets.bottom;
    const imageHeight = safeHeight;
    const imageWidth = (4635 / 3685) * imageHeight;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header
        title='상세정보'
        showLeft={true}
        onPressLeft={() => router.back()}
        rightType="close"
        onPressRight={() => router.replace('/congestion')}
      />

      <ScrollView
        style={styles.mapWrapper}
        contentContainerStyle={styles.mapZoomContainer}
        minimumZoomScale={1}
        maximumZoomScale={3}
        pinchGestureEnabled={true}
        showsHorizontalScrollIndicator={true}
        showsVerticalScrollIndicator={true}
        bounces={false}
        horizontal={true}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >
          <Image
            source={subwayImage}
            style={{
              width: imageWidth,
              height: imageHeight,
            }}
            resizeMode="contain"
          />
        </ScrollView>
      </ScrollView>

      {loading ? (
        <View style={{ marginTop: 100 , alignItems:'center'}}>
          <ActivityIndicator size="large" />
          <Text>결과를 불러오는 중입니다...</Text>
        </View>
      ) : (
        <BottomSheetModal
          ref={bottomSheetRef}
          index={0}
          snapPoints={snapPoints}
          onDismiss={handleDismiss}
        >
            <BottomSheetScrollView style={{backgroundColor:theme.colors.gray[100]}}>
              {renderBottomSheetContent()}
            </BottomSheetScrollView>
        </BottomSheetModal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },

  directionBlock: { marginBottom: 16, paddingVertical: 8},

  directionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 4 },

  weatherBlock: { marginTop: 24, paddingTop: 8, borderTopWidth: 1, borderColor: '#ddd' },

  weatherTitle: { fontSize: 18, fontWeight: '600', marginBottom: 6 },
  
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 24, gap: 12 },

  setButton: { flex: 1, backgroundColor: '#F2F2F2', paddingVertical: 12, borderRadius: 8, alignItems: 'center' },

  setButtonText: { fontSize: 16, fontWeight: '600', color: '#333' },

  mapWrapper: { flex: 1 },

  mapZoomContainer: { flexGrow: 1, alignItems: 'center', justifyContent: 'center' },

  stationBox: { height: hp(98), paddingHorizontal: wp(24), flexDirection: 'column', justifyContent: 'center', alignItems: 'center', alignSelf: 'stretch' },

  centerStationBox: { width: wp(262), height: hp(60), paddingHorizontal: wp(24), justifyContent: 'center', alignItems: 'center', gap: px(10), borderRadius: 999, borderWidth: px(8), shadowColor: 'rgba(0, 0, 0, 0.05)', shadowOffset: { width: 4, height: 4 }, shadowOpacity: 1, shadowRadius: 4, elevation: 4 },
  
  centerStationWrapper: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },

  TailBox: { position: 'absolute', top: '50%', transform: [{ translateY: -hp(20) }], width: '100%', height: hp(40), borderRadius: px(999), zIndex: 0 },
  
  clickBox:{
  flexDirection: 'row',
  paddingTop: hp(30),
  paddingRight: wp(24),
  paddingBottom: hp(24),
  paddingLeft: wp(24),
  alignItems: 'flex-start',
  alignSelf: 'stretch',
},
  button: {
    height: px(60),
    paddingVertical: px(12),
    paddingHorizontal: px(15),
    justifyContent: 'center',
    alignItems: 'center',
    gap: px(15),
    flex: 1, 
    borderRadius:px(9),
    borderWidth: px(3),
  },
  selected: {
    borderColor: '#E5E5E5',
    backgroundColor: '#FFF',
  },
  unselected: {
    borderColor: 'transparent',
    backgroundColor: '#F5F5F5',
  },
  buttonText: {
    fontSize: px(22),
    fontWeight: '600',
    fontFamily:'Pretendard-SemiBold',
    lineHeight:px(30)
  },
});
