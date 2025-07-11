import { useStationContext } from '@/context/StationContext';
import { px } from '@/utils/scale';
import { useRouter } from 'expo-router';
import Fuse from 'fuse.js';
import { useMemo, useState } from 'react';
import {
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { PaperProvider } from 'react-native-paper';
import { DatePickerModal, TimePickerModal } from 'react-native-paper-dates';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function FirstSearchScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { stations } = useStationContext();

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
      <View style={{ flex: 1, paddingTop: insets.top, paddingHorizontal: px(20) }}>
        <View style={styles.inputRow}>
          <TextInput
            placeholder="역 이름을 입력하세요"
            value={stationName}
            onChangeText={(text) => {
              setStationName(text);
              setShowSuggestions(true);
            }}
            style={styles.input}
            placeholderTextColor="#aaa"
          />
        </View>

        {showSuggestions && filteredStations.length > 0 && (
          <View style={styles.suggestionList}>
            <ScrollView keyboardShouldPersistTaps="handled">
              {filteredStations.map((item) => (
                <TouchableOpacity
                  key={item.stationName}
                  onPress={() => handleStationSelect(item.stationName)}
                  style={styles.suggestionItem}
                >
                  <Text>{item.stationName}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
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

          <TouchableOpacity onPress={() => setDateOpen(true)} style={styles.dateButton}>
            <Text>📅 날짜 선택</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setTimeOpen(true)} style={styles.dateButton}>
            <Text>🕒 시간 선택</Text>
          </TouchableOpacity>

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
  inputRow: {
    marginTop: px(10),
    marginBottom: px(6),
    flexDirection: 'row',
    alignItems: 'center',
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
  suggestionList: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    maxHeight: 160,
    backgroundColor: '#FFF',
    zIndex: 100,
    elevation: 5,
  },
  suggestionItem: {
    padding: 8,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  dateButton: {
    marginTop: 12,
    padding: 10,
    backgroundColor: '#f2f2f2',
    borderRadius: 6,
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
});
