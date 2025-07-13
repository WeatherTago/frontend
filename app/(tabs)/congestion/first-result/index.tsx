import { fetchStationByIdAndTime, fetchStationDetailInfo } from '@/apis/station';
import subwayImage from '@/assets/images/subway/subway-all.png';
import Header from '@/components/Header/CommonHeader';
import StationHeader from '@/components/StationHeader';
import { useStationContext } from '@/context/StationContext';
import { StationDetail, StationResult } from '@/types/station';
import { hp, px, wp } from '@/utils/scale';
import { useTheme } from '@emotion/react';
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Dimensions, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
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
  const snapPoints = ['25%', '80%'];

  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

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

    const directionKeys = Object.keys(result.congestionByDirection || {});

    const lineKey = `line${result.line.replace('호선', '')}`;
    const lineColor = theme.colors.subway[lineKey as keyof typeof theme.colors.subway];

    return (
      <>
       <StationHeader
          stationName={result.name}
          lines={[result.line]}
          address={address}
          phoneNumber={phoneNumber}
        />   
        <Text>역: {result.name} ({result.line})</Text>
        <Text>시간: {date} {time}</Text>

        {directionKeys.length > 0 ? (
          directionKeys.map((dirKey) => {
            const directionData = result.congestionByDirection?.[dirKey];
            const congestion = directionData?.congestion;

            if (congestion) {
              return (
                <View key={dirKey} style={styles.directionBlock}>
                  <Text style={styles.directionTitle}>🚈 {dirKey} 방향</Text>
                  <Text>혼잡도: {congestion.congestionLevel} / {congestion.congestionScore}%</Text>
                </View>
              );
            } else {
              return <Text key={dirKey}>⚠️ {dirKey} 방향 정보 없음</Text>;
            }
          })
        ) : (
          <Text>❗ 방향별 혼잡도 데이터 없음</Text>
        )}

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
            </>
          ) : (
            <Text>날씨 데이터가 없습니다.</Text>
          )}
        </View>

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
        <View style={{ marginTop: 100 }}>
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
          <BottomSheetView style={styles.bottomSheetContent}>
            {renderBottomSheetContent()}
          </BottomSheetView>
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
  bottomSheetContent: {
    
  },
  
  directionBlock: {
    marginBottom: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  directionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  weatherBlock: {
    marginTop: 24,
    paddingTop: 8,
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  weatherTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 6,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    gap: 12,
  },
  setButton: {
    flex: 1,
    backgroundColor: '#F2F2F2',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  setButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  mapWrapper: {
    flex: 1,
  },
  mapZoomContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stationBox: {
      height: hp(98),
      paddingHorizontal: wp(24),
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'stretch',
    },
    centerStationBox: {
      width: wp(262),
      height: hp(60),
      paddingHorizontal: wp(24),
      justifyContent: 'center',
      alignItems: 'center',
      gap: px(10),
      borderRadius: 999,
      borderWidth: px(8),
      shadowColor: 'rgba(0, 0, 0, 0.05)',
      shadowOffset: { width: 4, height: 4 },
      shadowOpacity: 1,
      shadowRadius: 4,
      elevation: 4,
    },
    centerStationWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    TailBox: {
      position: 'absolute',
      top: '50%',
      transform: [{ translateY: -hp(20) }],
      width: '100%',
      height: hp(40),
      borderRadius: px(999),
      zIndex: 0,
    },
});
