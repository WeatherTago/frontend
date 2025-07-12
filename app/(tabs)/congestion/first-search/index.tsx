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
  Image,
  Keyboard,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
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
  const [filteredLines, setFilteredLines] = useState<string[]>([]);
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

  const hourOptions = Array.from({ length: 24 }, (_, i) => i);

  const getSelectedTimeLabel = () => {
  if (!date || !time) return '출발 시각 선택';
  const dateLabel = dateOptions.find((opt) => opt.value.toDateString() === date.toDateString())?.label ?? date.toLocaleDateString();
  return `${dateLabel} ${time.hours}시 `;
};
  useEffect(() => {
    setDate(today); 
    setTime({ hours: 9, minutes: 0 }); // 0시
  }, []);


  return (
    <View style={{ flex: 1, paddingTop: insets.top, backgroundColor: theme.colors.gray[0] }}>
      <View style={styles.headerContainer}>
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
        <TouchableOpacity onPress={() => setSheetOpen(true)} style={styles.dateButton}>
          <View style={styles.dateRow}>
            <Text style={[styles.dateButtonText, { color: theme.colors.primary[700] }]}>
              {getSelectedTimeLabel().replace('기준', '')}
            </Text>
            <Text style={[styles.dateButtonText, { color: theme.colors.gray[950] }]}> 기준</Text>
            <Image source={downArrow} style={styles.arrowIcon} resizeMode="contain" />
          </View>
        </TouchableOpacity>
      </View>

      {showSuggestions && filteredStations.length > 0 && (
        <FlatList
          data={filteredStations}
          keyExtractor={(item) => item.stationName}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleStationSelect(item.stationName)} style={styles.suggestionItem}>
              <Text style={[styles.suggestionItemText, { color: theme.colors.gray[900] }]}>{item.stationName}</Text>
            </TouchableOpacity>
          )}
          ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: theme.colors.gray[100] }} />}
          style={{ backgroundColor: '#FFF', borderBottomWidth: px(1), borderBottomColor: '#F5F5F5', maxHeight: listHeight }}
          keyboardShouldPersistTaps="handled"
        />
      )}

      <ScrollView contentContainerStyle={{ paddingVertical: 16 }}>
        {filteredLines.length > 0 && (
          <>
            <Text>호선 선택</Text>
            {filteredLines.map((line) => (
              <TouchableOpacity key={line} onPress={() => setSelectedLine(line)}>
                <Text style={{ padding: 8, backgroundColor: selectedLine === line ? '#d0ebff' : '#eee' }}>{line}</Text>
              </TouchableOpacity>
            ))}
          </>
        )}

        <TouchableOpacity onPress={handleSubmit} style={styles.searchButton}>
          <Text style={styles.searchButtonText}>혼잡도 검색</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal visible={sheetOpen} transparent animationType="fade" onRequestClose={() => setSheetOpen(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.wheelModalContainer}>
            <Text style={styles.modalTitle}>날짜/시간 설정</Text>
          <View style={styles.modalBox}>
            <FlatList
              data={dateOptions}
              keyExtractor={(item) => item.label}
              style={styles.wheelList}
              showsVerticalScrollIndicator={false}
              snapToInterval={40}
              decelerationRate="fast"
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => setDate(item.value)}>
                  <Text style={styles.wheelItemText}>{item.label}</Text>
                </TouchableOpacity>
              )}
            />

            <FlatList
              data={hourOptions}
              keyExtractor={(item) => item.toString()}
              style={styles.wheelList}
              showsVerticalScrollIndicator={false}
              snapToInterval={40}
              decelerationRate="fast"
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => setTime({ hours: item, minutes: 0 })}>
                  <Text style={styles.wheelItemText}>{item}:00</Text>
                </TouchableOpacity>
              )}
            />
            </View>
            <TouchableOpacity onPress={() => setSheetOpen(false)} style={styles.modalCloseButton}>
              <Text style={styles.modalCloseButtonText}>완료</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    width: wp(540), height: hp(90), paddingHorizontal: wp(14),
    flexDirection: 'row', alignItems: 'center', gap: px(8), flexShrink: 0,
    shadowColor: 'rgba(0, 0, 0, 0.05)', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1, shadowRadius: 6, elevation: 3,
  },
  searchInput: {
    flex: 1, fontSize: px(24), fontFamily: 'Pretendard-Medium', fontWeight: '500', lineHeight: px(34),
  },
  choiceContainer: {
    height: hp(57), paddingHorizontal: wp(24), paddingVertical: hp(10),
    flexShrink: 0, alignSelf: 'stretch', alignItems: 'flex-start', gap: px(6), backgroundColor: '#FFF'
  },
  dateButton: {
    height: px(40), width: px(150), padding: 4, backgroundColor: '#fff', borderRadius: 6,
    alignItems: 'center', justifyContent: 'center'
  },
  dateButtonText: {
   fontFamily: 'Pretendard-Medium', fontWeight: '500', lineHeight: px(34), fontSize: px(22)
  },
  searchButton: {
    marginTop: 24, backgroundColor: '#00C4B8', borderRadius: 8, paddingVertical: 14, alignItems: 'center',
  },
  searchButtonText: {
    color: 'white', fontWeight: 'bold', fontSize: 16,
  },
  suggestionItem: {
    padding: 8, borderBottomWidth: 1, borderColor: '#ccc', maxHeight: listHeight,
  },
  suggestionItemText: {
    fontSize: px(22), fontFamily: 'Pretendard-Regular', fontWeight: '400', lineHeight: px(34)
  },
  modalOverlay: {
    flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)',
  },
  wheelModalContainer: {
    backgroundColor: '#FFF', padding: 20, borderRadius: 12, width: '80%', alignItems: 'center',
  },
  modalBox:{
    flexDirection:'row'
  },
  modalTitle: {
    fontSize: 18, fontWeight: 'bold',
  },
  wheelList: {
    height: 120, marginVertical: 10,
  },
  wheelItemText: {
    fontSize: 20, textAlign: 'center', paddingVertical: 10,
  },
  modalCloseButton: {
    marginTop: 16, backgroundColor: '#00C4B8', paddingVertical: 10, paddingHorizontal: 30, borderRadius: 8,
  },
  modalCloseButtonText: {
    color: '#FFF', fontWeight: 'bold',
  },
  dateRow: {
  flexDirection: 'row',
  alignItems: 'center',
},
arrowIcon: {
  width: px(24), 
  height: px(24),
  marginLeft: px(4),
  marginTop: px(4)
},

});
