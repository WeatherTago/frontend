import { fetchStationByIdAndTime } from '@/apis/station';
import Header from '@/components/Header/CommonHeader';
import { useStationContext } from '@/context/StationContext';
import { StationResult } from '@/types/station';
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function FirstResultScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
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
        const res = await fetchStationByIdAndTime({ stationId, time: time as string });
        setResult(res);
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

    return (
      <>
        <Text style={styles.title}>혼잡도 예측 결과</Text>
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

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.setButton}
            onPress={() =>
              router.push({
                pathname: '../congestion/second-search',
                params: { from: 'departure', station: result.name, line: result.line, date, time },
              })
            }
          >
            <Text style={styles.setButtonText}>출발역 설정</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.setButton}
            onPress={() =>
              router.push({
                pathname: '../congestion/second-search',
                params: { from: 'arrival', station: result.name, line: result.line, date, time },
              })
            }
          >
            <Text style={styles.setButtonText}>도착역 설정</Text>
          </TouchableOpacity>
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

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header
        title={station}
        showLeft={true}
        onPressLeft={() => router.back()}
      />

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
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
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
});
