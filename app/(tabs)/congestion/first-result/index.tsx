import { fetchStationByIdAndTime, fetchStationDetailInfo } from '@/apis/station';
import { fetchStationStatus } from '@/apis/stationStatus';
import subwayImage from '@/assets/images/subway/subway-all.png';
import Header from '@/components/Header/CommonHeader';
import InfoBox from '@/components/InfoBox';
import SmallInfoBox from '@/components/smallInfoBox';
import StationHeader from '@/components/StationHeader';
import StationInfo from '@/components/StationInfo';
import ToggleBox from '@/components/ToggleBox';
import { useStationContext } from '@/context/StationContext';
import { theme } from '@/styles/theme';
import { StationDetail, StationResult, StationStatusCongestion, StationStatusWeather } from '@/types/station';
import { getDateLabelFromDate, getDayjsFromDateLabel } from '@/utils/dateLabel';
import { getCongestionStyle } from '@/utils/getCongestionStyle';
import { getWeatherStyle } from '@/utils/getWeatherStyle';
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
  const [selectedDate, setSelectedDate] = useState<'오늘' | '내일' | '모레'>('오늘');
  const [statusData, setStatusData] = useState<{
  [key in '상행' | '하행' | '외선' | '내선']?: {
    weathers: StationStatusWeather[];
    congestions: StationStatusCongestion[];
  }
} | null>(null);

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
      const [res, detailRes,statusRes] = await Promise.all([
        fetchStationByIdAndTime({ stationId, time: time as string }),
        fetchStationDetailInfo(),
        fetchStationStatus(stationId)
      ]);
      
      setResult(res);
      setStatusData(statusRes.result);
     
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

  const filterStatusByDate = (
  label: '오늘' | '내일' | '모레',
  direction: '상행' | '하행' | '외선' | '내선'
  ) => {
    if (!statusData || !statusData[direction]) return [];

    const { weathers, congestions } = statusData[direction];
    const targetDate = getDayjsFromDateLabel(label);

    return weathers
      .filter(w => dayjs(w.datetime).isSame(targetDate, 'day'))
      .map(w => {
        const match = congestions.find(c => dayjs(c.datetime).isSame(w.datetime));
        return {
          time: dayjs(w.datetime).format('HH시'),
          rate: match?.prediction.congestionScore ?? '정보 없음',
          level: match?.prediction.congestionLevel ?? '정보 없음',
        };
      });
  };

    const selectedDateObj = dayjs(time);
    const dateLabel = getDateLabelFromDate(selectedDateObj);
    const hourStr = selectedDateObj.format('HH');
    const formattedTime = `${dateLabel} ${hourStr}:00`;


    const filterWeatherByDate = (
    label: '오늘' | '내일' | '모레',
    direction: '상행' | '하행' | '외선' | '내선'
  ) => {
    if (!statusData || !statusData[direction]) return [];

    const targetDate = getDayjsFromDateLabel(label);

    return statusData[direction].weathers
      .filter(w => dayjs(w.datetime).isSame(targetDate, 'day'))
      .map(w => ({
        time: dayjs(w.datetime).format('HH시'),
        status: w.weather.status,
        tmp: w.weather.tmp,
      }));
  };

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

        const { textColor, backgroundColor, topText,image } = getCongestionStyle(congestion.congestionLevel, theme);
        return (
            <InfoBox
              key={selectedButton}
              specialColor={textColor}
              backgroundColor={backgroundColor}
              topText={topText}
              image={image}
              rate={congestion.congestionLevel}
              time={formattedTime}
            />
          );
        })()}
        
        <ToggleBox
        text="지하철 혼잡도 예측"
        defaultSelected="오늘"
        onSelect={(val) => setSelectedDate(val)}
      />

      {selectedButton && (
        <View style={{flex: 1, backgroundColor: theme.colors.gray[0], marginBottom: px(4)}}> 
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              backgroundColor: theme.colors.gray[0],
              flexDirection: 'row',
              gap: px(8),
              paddingHorizontal: wp(24),
              paddingTop: hp(12),
              paddingBottom: hp(34),
              alignItems: 'center'
            }}
          >
            {filterStatusByDate(selectedDate, selectedButton).map((item, idx) => {
              const { textColor,image} = getCongestionStyle(item.level, theme);

              return (
                <SmallInfoBox
                  key={idx}
                  time={item.time}
                  image={image}
                  text1={item.level}
                  text2={`${item.rate}%`}
                  textColor={textColor}
                />
              );
            })}
          </ScrollView>        
        </View>
      )}


        {(() => {
          if (!result || !result.weather) return null;

          const weather = result.weather;
          const { textColor, backgroundColor, topText,image } = getWeatherStyle(weather.status ?? '', theme);

          return (
            <InfoBox
              key="weather"
              specialColor={textColor}
              backgroundColor={backgroundColor}
              topText={topText}
              image={image}
              rate={weather.status ?? '--'}
              time={formattedTime}
            />
          );
        })()}

        <View style={styles.weatherContainer}>
          {result.weather ? (
            <>
          <View style={styles.weatherBox}>
            <Image
              style={styles.weatherIconContainer}
              source={require('@/assets/images/Multiply.png')}
            />
            <Text style={styles.weatherText}>기온</Text>
            <Text style={styles.weatherValueText}>{result.weather.tmp ?? '--'}℃</Text>
          </View>
          <View style={styles.weatherBox}>
            <Image
              style={styles.weatherIconContainer}
              source={require('@/assets/images/Multiply.png')}
            />
            <Text style={styles.weatherText}>강수량</Text>
            <Text style={styles.weatherValueText}>{result.weather.pcp ?? '--'}mm</Text>
          </View>
          <View style={styles.weatherBox}>
            <Image
              style={styles.weatherIconContainer}
              source={require('@/assets/images/Multiply.png')}
            />
            <Text style={styles.weatherText}>습도</Text>
            <Text style={styles.weatherValueText}>{result.weather.reh ?? '--'}%</Text>
          </View>
          <View style={styles.weatherBox}>
            <Image
              style={styles.weatherIconContainer}
              source={require('@/assets/images/Multiply.png')}
            />
            <Text style={styles.weatherText}>적설</Text>
            <Text style={styles.weatherValueText}>{result.weather.sno ?? '--'}mm</Text>
          </View>
          <View style={styles.weatherBox}>
            <Image
              style={styles.weatherIconContainer}
              source={require('@/assets/images/Multiply.png')}
            />
            <Text style={styles.weatherText}>풍향</Text>
            <Text style={styles.weatherValueText}>{result.weather.vec ?? '--'}°</Text>
          </View>
          <View style={styles.weatherBox}>
            <Image
              style={styles.weatherIconContainer}
              source={require('@/assets/images/Multiply.png')}
            />
            <Text style={styles.weatherText}>풍속</Text>
            <Text style={styles.weatherValueText}>{result.weather.wsd ?? '--'}m/s</Text>
          </View>
            </>
          ) : (
            <Text>날씨 데이터가 없습니다.</Text>
          )}
        </View>

         <ToggleBox
          text="날씨 예측 정보"
          defaultSelected="오늘"
          onSelect={(val) => setSelectedDate(val)}
        />

        {selectedButton && (
          <View style={{flex: 1, backgroundColor: theme.colors.gray[0], marginBottom: px(4)}}> 
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                backgroundColor: theme.colors.gray[0],
                flexDirection: 'row',
                gap: px(8),

                paddingHorizontal: wp(24),
                paddingTop: hp(12),
                paddingBottom: hp(34),
                alignItems: 'center'
              }}
            >
              {filterWeatherByDate(selectedDate, selectedButton).map((item, idx) => {
                const { textColor,image } = getWeatherStyle(item.status, theme);

                return (
                  <SmallInfoBox
                    key={idx}
                    time={item.time}
                    image={image} 
                    text1={item.status}
                    text2={`${item.tmp}℃`}
                    textColor={textColor}
                  />
                );
              })}
            </ScrollView>        
          </View>
        )}
        

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
    marginTop:20
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
  weatherContainer:{
    backgroundColor:theme.colors.gray[50],
    padding:px(24),
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
    gap:px(10),
    alignSelf:'stretch',
  },
  weatherBox: {
    flexDirection: 'column',
    alignItems: 'center',
    alignSelf: 'stretch',
    flexGrow: 1,
  },
  weatherIconContainer: {
    width: px(50),
    height: px(50),
    borderRadius: px(14),
    backgroundColor: theme.colors.gray[300],
  },
  weatherText: {
    color: theme.colors.gray[400],
    fontFamily: theme.typography.caption.fontFamily,
    fontSize: theme.typography.caption.fontSize,
    fontWeight: theme.typography.caption.fontWeight,
    lineHeight: theme.typography.caption.lineHeight,
  },
  weatherValueText: {
    color: theme.colors.gray[700],
    fontFamily: 'Pretendard-SemiBold',
    fontSize: px(20),
    fontWeight: '600',
    lineHeight: px(22),
  },
});
