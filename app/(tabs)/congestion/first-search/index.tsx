import ArrowIcon from '@/components/Icons/ArrowIcon';
import { useStationContext } from '@/context/StationContext';
import { theme } from '@/styles/theme';
import { hp, px, wp } from '@/utils/scale';
import { useTheme } from '@emotion/react';
import { useRouter } from 'expo-router';
import Fuse from 'fuse.js';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert, Dimensions,
  FlatList,
  Image,
  Keyboard,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const screenHeight = Dimensions.get('window').height;
const listHeight = screenHeight * 0.5;

export default function FirstSearchScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { stations } = useStationContext();
  const theme = useTheme();
  const inputRef = useRef<TextInput>(null);
  const downArrow = require('@/assets/images/underarrow.png');

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const [stationName, setStationName] = useState('');
  const [selectedLine, setSelectedLine] = useState('');
  const [date, setDate] = useState<Date | undefined>();
  const [time, setTime] = useState<{ hours: number; minutes: number } | undefined>();
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

  const uniqueStationNames = useMemo(() => {
    const set = new Set<string>();
    return stations.filter((s) => {
      if (set.has(s.stationName)) return false;
      set.add(s.stationName);
      return true;
    });
  }, [stations]);

  const fuse = useMemo(
    () => new Fuse(uniqueStationNames, { keys: ['stationName'], threshold: 0.4 }),
    [uniqueStationNames]
  );

  const filteredStations = stationName
    ? fuse
        .search(stationName)
        .flatMap((res) =>
          stations.filter((s) => s.stationName === res.item.stationName)
        )
    : [];

  const handleSubmit = () => {
  if (!stationName || !selectedLine || !date || !time) {
    Alert.alert(
      '알림', 
      '모든 항목을 입력해주세요.', 
      [
        {
          text: '확인',
        },
      ],
      { cancelable: false } 
    );
    return;
  }

    const combinedDate = new Date(date);
    combinedDate.setHours(time.hours);
    combinedDate.setMinutes(time.minutes);
    combinedDate.setSeconds(0);
    combinedDate.setMilliseconds(0);

    const formatLocalISOString = (d: Date) => {
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const h = String(d.getHours()).padStart(2, '0');
      const min = String(d.getMinutes()).padStart(2, '0');
      return `${y}-${m}-${day}T${h}:${min}:00`;
    };

    const formattedDate = formatLocalISOString(date);
    const formattedTime = formatLocalISOString(combinedDate);

    router.push({
      pathname: '../congestion/first-result',
      params: {
        station: stationName,
        line: selectedLine,
        date: formattedDate,
        time: formattedTime,
      },
    });
  };

  const getLineColor = (line: string) => {
    const num = line.replace('호선', '');
    return theme.colors.subway[`line${num}` as keyof typeof theme.colors.subway] || theme.colors.gray[300];
  };

  const today = new Date();
  const tomorrow = new Date(today);
  const dayAfter = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  dayAfter.setDate(today.getDate() + 2);

  const dateOptions = [
    { label: '오늘', value: today },
    { label: '내일', value: tomorrow },
    { label: '모레', value: dayAfter },
  ];

  const hourOptions = useMemo(() => {
    const now = new Date();
    const currentHour = now.getHours();
    const isToday = date?.toDateString() === today.toDateString();

    return Array.from({ length: 24 }, (_, i) => i).filter((hour) => {
      if (hour >= 1 && hour <= 4) return false;
      if (isToday) return hour >= currentHour;
      return true;
    });
  }, [date]);

    const getSelectedTimeLabel = () => {
      if (!date || !time) return '검색할 시간을 선택해주세요';
      const dateLabel =
        dateOptions.find((opt) => opt.value.toDateString() === date.toDateString())?.label ??
        date.toLocaleDateString();
      return `${dateLabel} ${time.hours}:00`;
    };

  return (
    <View style={{ flex: 1, paddingTop: insets.top, backgroundColor: theme.colors.gray[0] }}>
      <View style={styles.headerContainer}>
        <View style={{flexDirection:'row', alignItems:'center',gap:px(8)}}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowIcon direction="left" color={theme.colors.gray[500]} width={px(46)} height={px(46)} />
        </TouchableOpacity>

          <TextInput
            ref={inputRef}
            placeholder="혼잡도가 궁금한 역을 검색해보세요"
            value={stationName}
            onChangeText={(text) => {
              setStationName(text);
              setShowSuggestions(true);
            }}
            onSubmitEditing={handleSubmit}
            returnKeyType="search"
            style={[styles.searchInput, {color: theme.colors.gray[950] }]}
            placeholderTextColor={theme.colors.gray[300]}
          />
        </View>
        
          <TouchableOpacity onPress={handleSubmit} style={styles.inlineSearchButton}>
            <Image source={require('@/assets/images/searchButton.png')} style={{height:px(46),width:px(46),resizeMode: 'contain'}}/>
          </TouchableOpacity>
      </View>


      <View style={styles.choiceContainer}>
        <TouchableOpacity
          onPress={() => {
            if (!stationName) {
              Alert.alert('알림', '역을 선택해주세요.');
            } else {
              setSheetOpen(true);
            }
          }}
          style={styles.dateButton}
        >
          <View style={styles.dateRow}>
            <Text style={[styles.dateButtonText, { color: theme.colors.gray[400] }]}>
              {getSelectedTimeLabel()}
            </Text>
            <Text style={[styles.dateButtonText, { color: theme.colors.gray[950] }]}></Text>
            <Image source={downArrow} style={styles.arrowIcon} resizeMode="contain" />
          </View>
        </TouchableOpacity>
      </View>

      {showSuggestions && filteredStations.length > 0 && (
        <FlatList
          data={filteredStations}
          keyExtractor={(item, index) => item.stationName + item.stationLine + index}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                setStationName(item.stationName);
                setSelectedLine(item.stationLine);
                setShowSuggestions(false);
                Keyboard.dismiss();
              }}
              style={[styles.suggestionItem, { borderColor: theme.colors.gray[100] }]}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center'}}>
                <Text style={[styles.suggestionItemText, { color: theme.colors.gray[900] }]}>
                  {item.stationName}
                </Text>
                <View
                  style={[styles.lineBox,{backgroundColor: getLineColor(item.stationLine)}]}
                >
                  <Text style={styles.lineBoxText}>
                    {item.stationLine}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
          style={{ backgroundColor: theme.colors.gray[0], maxHeight: listHeight }}
          keyboardShouldPersistTaps="handled"
        />
      )}

      <Modal visible={sheetOpen} transparent animationType="fade" onRequestClose={() => setSheetOpen(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.wheelModalContainer}>
            <Text style={[styles.modalTitle, { fontFamily: 'Pretendard-SemiBold' }]}>날짜/시간 설정</Text>
            <View style={styles.modalBox}>
              <FlatList
                data={dateOptions}
                keyExtractor={(item) => item.label}
                style={styles.wheelList}
                showsVerticalScrollIndicator={false}
                snapToInterval={40}
                decelerationRate="fast"
                renderItem={({ item }) => {
                  const isSelected = date?.toDateString() === item.value.toDateString();
                  return (
                    <TouchableOpacity onPress={() => setDate(item.value)}>
                      <Text
                        style={[
                          styles.wheelItemText,
                          { color: isSelected ? theme.colors.primary[700] : theme.colors.gray[900] },
                        ]}
                      >
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  );
                }}
              />
              <FlatList
                data={hourOptions}
                keyExtractor={(item) => item.toString()}
                style={styles.wheelList}
                showsVerticalScrollIndicator={false}
                snapToInterval={40}
                decelerationRate="fast"
                renderItem={({ item }) => {
                  const isSelected = time?.hours === item;
                  return (
                    <TouchableOpacity onPress={() => setTime({ hours: item, minutes: 0 })}>
                      <Text
                        style={[
                          styles.wheelItemText,
                          { color: isSelected ? theme.colors.primary[700] : theme.colors.gray[900] },
                        ]}
                      >
                        {item}:00
                      </Text>
                    </TouchableOpacity>
                  );
                }}
              />
            </View>
            <TouchableOpacity
              onPress={() => {
                setSheetOpen(false);
                handleSubmit(); // 바로 검색
              }}
              style={styles.modalCloseButton}
            >
              <Text style={styles.modalCloseButtonText}>검색</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor:theme.colors.gray[0],
    width: '100%',
    height: hp(90),
    paddingHorizontal: wp(14),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'space-between',
    flexShrink: 0,
    shadowColor: 'rgba(0, 0, 0, 0.05)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 3,
  },
  searchInput: {
    fontSize: px(24),
    fontFamily: 'Pretendard-Medium',
    fontWeight: '500',
  },
  choiceContainer: {
    height: hp(57),
    paddingHorizontal: wp(24),
    paddingVertical: hp(10),
    flexShrink: 0,
    alignSelf: 'stretch',
    alignItems: 'flex-start',
    gap: px(6),
    backgroundColor: '#FFF',
  },
  dateButton: {
    height: px(40),
    padding: 4,
    backgroundColor: '#fff',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateButtonText: {
    fontFamily: 'Pretendard-Medium',
    fontWeight: '500',
    lineHeight: px(23),
    fontSize: px(22),
  },
  searchButton: {
    width: 100,
    marginTop: 24,
    backgroundColor: '#00C4B8',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  searchButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  suggestionItem: {
    padding: px(24),
    borderBottomWidth: 1,
    maxHeight: listHeight,
    gap: px(34),
    alignSelf: 'stretch',
  },
  suggestionItemText: {
    fontSize: px(22),
    fontFamily: 'Pretendard-Regular',
    fontWeight: '400',
    lineHeight: px(34),
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  wheelModalContainer: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 12,
    width: '80%',
    alignItems: 'center',
  },
  modalBox: {
    flexDirection: 'row',
  },
  modalTitle: {
    fontSize: 18,
  },
  wheelList: {
    height: 120,
    marginVertical: 10,
  },
  wheelItemText: {
    fontSize: 18,
    textAlign: 'center',
    paddingVertical: 10,
  },
  modalCloseButton: {
    marginTop: 16,
    backgroundColor: '#00C4B8',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  modalCloseButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize:px(16)
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  arrowIcon: {
    width: px(24),
    height: px(24),
    marginLeft: px(4),
    marginTop: px(4),
  },
  lineBox:{
    borderRadius: px(99),
    paddingHorizontal: px(8),
    justifyContent:'center',
    alignItems:'center',
    marginLeft:px(8)
  },
  lineBoxText:{
    color:theme.colors.gray[0],
    fontFamily:'Pretendard-Medium',
    fontSize:px(12),
    fontWeight:'500',
    lineHeight:px(26)
  },
  searchRow: {
  flex: 1,
  flexDirection: 'row',
  alignItems: 'center',
  alignContent:'space-between'
},

inlineSearchButton: {
  width:px(46),
  height:px(46)
},
});
