import { fetchSubwayPath } from '@/apis/path';
import { PathResult } from '@/types/path';
import { useTheme } from '@emotion/react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function RouteResultScreen() {
  const { departureStation, departureLine, arrivalStation, arrivalLine, date, time } =
    useLocalSearchParams<{
      departureStation: string;
      departureLine: string;
      arrivalStation: string;
      arrivalLine: string;
      date: string;
      time: string;
    }>();

  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const router = useRouter();

  const [result, setResult] = useState<PathResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoute = async () => {
      try {
        const stationIdMap = await fetch('/api/station/info').then((res) => res.json());

        const startStation = stationIdMap.find(
          (s: any) => s.stationName === departureStation && s.stationLine === departureLine
        );
        const endStation = stationIdMap.find(
          (s: any) => s.stationName === arrivalStation && s.stationLine === arrivalLine
        );

        if (!startStation || !endStation) {
          console.warn('출발/도착역 ID를 찾을 수 없습니다.');
          return;
        }

        const iso = new Date(date);
        const [hour, minute] = time.split(':').map(Number);
        iso.setHours(hour);
        iso.setMinutes(minute);
        iso.setSeconds(59);
        iso.setMilliseconds(999);

        const pathData = await fetchSubwayPath({
          startStationId: startStation.stationId,
          endStationId: endStation.stationId,
          time: iso.toISOString(),
        });

        setResult(pathData);
      } catch (error) {
        console.error('경로 조회 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoute();
  }, [departureStation, departureLine, arrivalStation, arrivalLine, date, time]);

  if (loading) {
    return (
      <View style={{ paddingTop: insets.top, flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={theme.colors.primary[700]} />
        <Text style={{ marginTop: 10 }}>경로를 불러오는 중입니다...</Text>
      </View>
    );
  }

  if (!result) {
    return (
      <View style={{ paddingTop: insets.top, flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>경로를 찾을 수 없습니다.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ paddingTop: insets.top, paddingHorizontal: 16 }}>
      <Text style={styles.title}>🚇 경로 정보</Text>
      <Text>⏱ 총 소요 시간: {result.totalTime}</Text>
      <Text>📏 총 거리: {result.totalDistance}</Text>

      {result.steps.map((step, idx) => (
        <View key={idx} style={styles.stepBox}>
          <Text style={styles.stepTitle}>📍 {step.line}</Text>
          <Text>출발역: {step.startStation.stationName}</Text>
          <Text>도착역: {step.endStation.stationName}</Text>
          <Text>출발역 혼잡도: {step.startStation.congestion?.level ?? '정보 없음'} / {step.startStation.congestion?.rate ?? '-'}%</Text>
          <Text>도착역 혼잡도: {step.endStation.congestion?.level ?? '정보 없음'} / {step.endStation.congestion?.rate ?? '-'}%</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  stepBox: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
});
