import { fetchElevators, fetchEscalators, fetchMovingWalkways, fetchWheelchairLifts } from '@/apis/openapi';
import Header from '@/components/Header/CommonHeader';
import StationHeader from '@/components/StationHeader';
import { useStationContext } from '@/context/StationContext';
import { ElevatorItem, EscalatorItem, LiftItem, WalkwayItem } from '@/types/accessibility';
import { hp, px, wp } from '@/utils/scale';
import { useTheme } from '@emotion/react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function InfoSearchResultScreen() {
  const { station } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const { stations } = useStationContext();

  const parsedStation = Array.isArray(station) ? station[0] : station;
  const matchedLines = Array.from(
  new Set(
    stations
      .filter(s => s.stationName === parsedStation)
      .map(s => s.stationLine)
  )
);

  const [elevators, setElevators] = useState<ElevatorItem[]>([]);
  const [escalators, setEscalators] = useState<EscalatorItem[]>([]);
  const [lifts, setLifts] = useState<LiftItem[]>([]);
  const [walkways, setWalkways] = useState<WalkwayItem[]>([]);

  useEffect(() => {
  const fetchAll = async () => {
    try {
      const [e, s, l, w] = await Promise.all([
        fetchElevators(parsedStation),
        fetchEscalators(parsedStation),
        fetchWheelchairLifts(parsedStation),
        fetchMovingWalkways(parsedStation),
      ]);

      setElevators(e);
      setEscalators(s);
      setLifts(l);
      setWalkways(w);
    } catch (error) {
      console.error('❌ API 호출 오류:', error);
    }
  };

    if (parsedStation) {
      fetchAll();
    }
  }, []);



  return (
  <View style={{ flex: 1, paddingTop: insets.top }}>
    <Header
      title="편의시설"
      showLeft
      onPressLeft={() => router.back()}
      rightType="close"
      onPressRight={() => router.replace('/information')}
    />

    <StationHeader stationName={parsedStation} lines={matchedLines} />

    <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={[styles.textField, theme.typography.body1, { color: theme.colors.gray[400] }]}>
        엘리베이터
      </Text>
      {elevators.map((item, idx) => (
        <View key={`el-${idx}`} style={[styles.card, { backgroundColor: theme.colors.gray[0] }]}>
          <Text style={styles.cardTitle}>{item.fcltNm}</Text>
          <Text style={[styles.cardContent, {color:theme.colors.gray[500]}]}>
            {item.dtlPstn}, 가동현황: {item.oprtngSitu === 'M' ? '정상 운영 중' : '점검/운행 중지'}
          </Text>
        </View>
      ))}

      <Text style={[styles.textField, theme.typography.body1, { color: theme.colors.gray[400] }]}>
        에스컬레이터
      </Text>
      {escalators.map((item, idx) => (
        <View key={`es-${idx}`} style={[styles.card, { backgroundColor: theme.colors.gray[0] }]}>
          <Text style={styles.cardTitle}>{item.fcltNm}</Text>
          <Text style={[styles.cardContent, {color:theme.colors.gray[500]}]}>
            {item.bgngFlrDtlPstn}, 가동현황: {item.oprtngSitu === 'M' ? '정상 운영 중' : '점검/운행 중지'}
          </Text>
        </View>
        
      ))}

      <Text style={[styles.textField, theme.typography.body1, { color: theme.colors.gray[400] }]}>
        휠체어 리프트
      </Text>
      {lifts.map((item, idx) => (
      <View key={`lift-${idx}`} style={[styles.card, { backgroundColor: theme.colors.gray[0] }]}>
        <Text style={styles.cardTitle}>{item.fcltNm}</Text>
        <Text style={[styles.cardContent, {color:theme.colors.gray[500]}]}>
          {item.bgngFlrDtlPstn}, 가동현황: {item.oprtngSitu === 'M' ? '정상 운영 중' : '점검/운행 중지'}
        </Text>
      </View>
    ))}

    <Text style={[styles.textField, theme.typography.body1, { color: theme.colors.gray[400] }]}>
        무빙워크
      </Text>
      {walkways.map((item, idx) => (
      <View key={`wk-${idx}`} style={[styles.card, { backgroundColor: theme.colors.gray[0] }]}>
        <Text style={styles.cardTitle}>{item.fcltNm}</Text>
        <Text style={[styles.cardContent, {color:theme.colors.gray[500]}]}>
          {item.bgngFlrDtlPstn}~{item.endFlrDtlPstn}, 가동현황: {item.oprtngSitu === 'M' ? '정상 운영 중' : '점검/운행 중지'}
        </Text>
      </View>
    ))}

    </ScrollView>
  </View>
);
}

const styles = StyleSheet.create({
  textField: {
    flexDirection: 'row',        
    paddingVertical: hp(14),
    paddingHorizontal: wp(24),
    alignItems: 'center',
    gap: px(10),                
    alignSelf: 'stretch',
  },
  card: {
  flexDirection: 'column',
  paddingVertical: hp(20),
  paddingHorizontal: wp(24),
  alignItems: 'flex-start',
  gap: px(10),
  alignSelf: 'stretch',
  marginBottom:px(1)
},
cardTitle:{
  color: '#0A0A0A',
  fontFamily: 'Pretendard-Medium',
  fontSize: px(20),
  fontWeight: '500',
  lineHeight: px(28),
},
cardContent: {
  fontFamily: 'Pretendard-Medium',
  fontSize: px(18),
  fontWeight: '400',
  lineHeight: px(26),
},
});
