import ArrowIcon from '@/components/Icons/ArrowIcon';
import { useStationContext } from '@/context/StationContext';
import { hp, px, wp } from '@/utils/scale';
import { useTheme } from '@emotion/react';
import { useRouter } from 'expo-router';
import Fuse from 'fuse.js';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { PaperProvider } from 'react-native-paper';
import { DatePickerModal, TimePickerModal } from 'react-native-paper-dates';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


const screenHeight = Dimensions.get('window').height;
const listHeight = screenHeight * 0.5; // 화면의 절반 높이

export default function FirstSearchScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { stations } = useStationContext();
  const theme=useTheme();
  const inputRef = useRef<TextInput>(null);


  useEffect(() => {
  inputRef.current?.focus();
}, []);

  const [stationName, setStationName] = useState('');
  const [selectedLine, setSelectedLine] = useState('');
  const [filteredLines, setFilteredLines] = useState<string[]>([]);
  const [date, setDate] = useState<Date | undefined>();
  const [time, setTime] = useState<{ hours: number; minutes: number } | undefined>();
  const [dateOpen, setDateOpen] = useState(false);
  const [timeOpen, setTimeOpen] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const uniqueStationNames = useMemo(() => {
    const set = new Set<string>();
    return stations.filter((s) => {
      if (set.has(s.stationName)) return false;
      set.add(s.stationName);
      return true;
    });
  }, [stations]);

  const fuse = useMemo(
    () =>
      new Fuse(uniqueStationNames, {
        keys: ['stationName'],
        threshold: 0.4,
      }),
    [uniqueStationNames]
  );

  const filteredStations = stationName
    ? fuse.search(stationName).map((res) => res.item)
    : [];

  const handleStationSelect = (name: string) => {
    setStationName(name);
    setShowSuggestions(false);
    Keyboard.dismiss();

    const matched = stations.filter((s) => s.stationName === name);
    const lines = [...new Set(matched.map((s) => s.stationLine))];
    setFilteredLines(lines);
    setSelectedLine('');
  };

  const handleSubmit = () => {
    if (!stationName || !selectedLine || !date || !time) {
      alert('모든 항목을 입력해주세요.');
      return;
    }

    router.push({
      pathname: '../congestion/first-result',
      params: {
        station: stationName,
        line: selectedLine,
        date: date.toISOString(),
        time: `${time.hours}:${time.minutes}`,
      },
    });
  };

  return (
    <PaperProvider>
      <View style={{ flex: 1, paddingTop: insets.top, }}>
        <View style={[styles.headerContainer, { backgroundColor: theme.colors.gray[0]}]}>
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
            style={[styles.searchInput, { color: theme.colors.gray[950] }]}
            placeholderTextColor={theme.colors.gray[300]}
          />
        </View>

        <View style={styles.choiceContainer}>
          <TouchableOpacity onPress={() => setDateOpen(true)} style={styles.dateButton}>
            <Text style={{color:theme.colors.primary[700], fontFamily:'Pretendard-Medium', fontWeight:500, lineHeight:px(34)}}>
              날짜 선택
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setTimeOpen(true)} style={styles.dateButton}>
            <Text style={{color:theme.colors.primary[700], fontFamily:'Pretendard-Medium', fontWeight:500, lineHeight:px(34)}}>
              시간 선택
            </Text>
          </TouchableOpacity>
        </View>

       {showSuggestions && filteredStations.length > 0 && (
        <FlatList
          data={filteredStations}
          keyExtractor={(item) => item.stationName}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleStationSelect(item.stationName)}
              style={styles.suggestionItem}
            >
              <Text style={[styles.suggestionItemText, { color: theme.colors.gray[900] }]}>
                {item.stationName}
              </Text>
            </TouchableOpacity>
          )}
          ItemSeparatorComponent={() => (
            <View style={{ height: 1, backgroundColor: theme.colors.gray[100] }} />
          )}
          style={{
            backgroundColor: '#FFF',
            borderBottomWidth: px(1),
            borderBottomColor: '#F5F5F5',
            maxHeight: listHeight,
          }}
          keyboardShouldPersistTaps="handled"
        />
      )}

        <ScrollView contentContainerStyle={{ paddingVertical: 16 }}>
          {filteredLines.length > 0 && (
            <>
              <Text>호선 선택</Text>
              {filteredLines.map((line) => (
                <TouchableOpacity key={line} onPress={() => setSelectedLine(line)}>
                  <Text
                    style={{
                      padding: 8,
                      backgroundColor: selectedLine === line ? '#d0ebff' : '#eee',
                    }}
                  >
                    {line}
                  </Text>
                </TouchableOpacity>
              ))}
            </>
          )}

          {date && <Text>선택 날짜: {date.toLocaleDateString()}</Text>}
          {time && <Text>선택 시간: {time.hours}시 {time.minutes}분</Text>}

          <TouchableOpacity onPress={handleSubmit} style={styles.searchButton}>
            <Text style={styles.searchButtonText}>혼잡도 검색</Text>
          </TouchableOpacity>
        </ScrollView>

        <DatePickerModal
          locale="ko"
          mode="single"
          visible={dateOpen}
          onDismiss={() => setDateOpen(false)}
          date={date}
          onConfirm={({ date }) => {
            setDate(date);
            setDateOpen(false);
          }}
        />

        <TimePickerModal
          locale="ko"
          visible={timeOpen}
          onDismiss={() => setTimeOpen(false)}
          onConfirm={({ hours, minutes }) => {
            setTime({ hours, minutes });
            setTimeOpen(false);
          }}
        />
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
  width: wp(540),
  height: hp(90),
  paddingHorizontal: wp(14),
  flexDirection: 'row',
  alignItems: 'center',
  gap: px(8),
  flexShrink: 0,
  shadowColor: 'rgba(0, 0, 0, 0.05)',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 1,
  shadowRadius: 6,
  elevation: 3,
},
  searchInput: {
  flex: 1,
  fontSize: px(24),
  fontFamily: 'Pretendard-Medium',
  fontWeight: '500',
  lineHeight: px(34),
},
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  choiceContainer:{
    flexDirection:'row',
    height:hp(57),
    paddingHorizontal:wp(24),
    paddingVertical:hp(10),
    flexShrink:0,
    alignSelf:'stretch',
    alignItems:'center',
    gap:px(6),
    backgroundColor:'#FFF'
  },
  suggestionList: {
    borderBottomWidth: px(1),
    borderBottomColor: '#F5F5F5',
    maxHeight: 160,
    backgroundColor: '#FFF',
    zIndex: 100,
    elevation: 5,
  },
  suggestionItem: {
    padding: 8,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    maxHeight: listHeight
  },
  dateButton: {
    height:px(40),
    width:px(150),
    padding: 4,
    backgroundColor: '#f2f2f2',
    borderRadius: 6,
    alignItems:'center',
    justifyContent:'center'
  },
  searchButton: {
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
  suggestionItemText:{
    fontSize:px(22),
    fontFamily:'Pretendard-Regular',
    fontWeight:400,
    lineHeight:px(34)
  }
});
