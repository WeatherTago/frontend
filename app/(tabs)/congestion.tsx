import Fuse from 'fuse.js';
import React, { useMemo, useState } from 'react';
import {
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { PaperProvider } from 'react-native-paper';
import { DatePickerModal, TimePickerModal } from 'react-native-paper-dates';

import { fetchStationByIdAndTime, StationResult } from '@/apis/station';
import mapImage from '@/assets/images/map.png';
import SearchBar from '@/components/SearchBar';
import { useStationContext } from '@/context/StationContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function CongestionScreen() {
  const { stations, loading, getStationIdByNameAndLine } = useStationContext();

  const [stationName, setStationName] = useState('');
  const [selectedLine, setSelectedLine] = useState('');
  const [filteredLines, setFilteredLines] = useState<string[]>([]);
  const [date, setDate] = useState<Date | undefined>();
  const [time, setTime] = useState<{ hours: number; minutes: number } | undefined>();
  const [dateOpen, setDateOpen] = useState(false);
  const [timeOpen, setTimeOpen] = useState(false);
  const [result, setResult] = useState<StationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // 1. 중복 제거된 역 이름만 뽑기
  const uniqueStationNames = useMemo(() => {
    const nameSet = new Set<string>();
    return stations.filter((station) => {
      if (nameSet.has(station.stationName)) return false;
      nameSet.add(station.stationName);
      return true;
    });
  }, [stations]);

  // 2. Fuse.js 인스턴스는 중복 제거된 리스트로 생성
  const fuse = useMemo(() => new Fuse(uniqueStationNames, {
    keys: ['stationName'],
    threshold: 0.45,
  }), [uniqueStationNames]);

  const filteredStations = stationName
    ? fuse.search(stationName).map((res) => res.item)
    : [];

  const handleStationSelect = (name: string) => {
    setStationName(name);
    setShowSuggestions(false);
    const matched = stations.filter((s) => s.stationName === name);
    const lines = [...new Set(matched.map((s) => s.stationLine))];
    setFilteredLines(lines);
    setSelectedLine('');
  };

  const handleSearch = async () => {
    if (!stationName || !selectedLine || !date || !time) {
      alert('모든 항목을 입력해주세요.');
      return;
    }

    const stationId = getStationIdByNameAndLine(stationName, selectedLine);
    if (!stationId) {
      alert('해당 역 정보가 존재하지 않습니다.');
      return;
    }

    const searchTime = new Date(date);
    searchTime.setHours(time.hours);
    searchTime.setMinutes(time.minutes);
    searchTime.setSeconds(0);
    searchTime.setMilliseconds(0);
    const isoTime = searchTime.toISOString();

    setIsLoading(true);
    const res = await fetchStationByIdAndTime({ stationId, time: isoTime });
    setResult(res);
    setIsLoading(false);
  };
  const insets=useSafeAreaInsets();

  return (
    <PaperProvider>
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { paddingTop: insets.top },
        ]}
      >
        <SearchBar
          placeholder="혼잡도가 궁금한 역을 검색해보세요"
          value={stationName}
          onChangeText={(text) => {
            setStationName(text);
            setShowSuggestions(true);
          }}
          onPressSearch={() => handleSearch()}
          ButtonIcon={mapImage}
          buttonLabel="혼잡예측"
        />

        {/* 3. 중복 제거된 자동완성 렌더링 */}
        {showSuggestions && filteredStations.length > 0 && (
          <View style={styles.suggestionList}>
            <ScrollView>
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

        {filteredLines.length > 0 && (
          <>
            <Text style={styles.label}>호선 선택</Text>
            <View style={styles.lineList}>
              {filteredLines.map((line) => (
                <TouchableOpacity
                  key={line}
                  onPress={() => setSelectedLine(line)}
                  style={[
                    styles.lineItem,
                    selectedLine === line && styles.lineItemSelected,
                  ]}
                >
                  <Text>{line}</Text>
                </TouchableOpacity>
              ))}
            </View>
            {selectedLine && (
              <Text style={styles.selectedLine}>
                선택한 호선: {selectedLine}
              </Text>
            )}
          </>
        )}

        <Button title="날짜 선택" onPress={() => setDateOpen(true)} />
        <Button title="시간 선택" onPress={() => setTimeOpen(true)} />

        {date && (
          <Text>
            선택한 날짜:{' '}
            {date.toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Text>
        )}
        {time && <Text>선택한 시간: {time.hours}시 {time.minutes}분</Text>}

        <Button title="혼잡도 검색" onPress={handleSearch} />

        {isLoading && <Text>불러오는 중...</Text>}

        {result && (
          <View style={{ marginTop: 20 }}>
            <Text style={styles.resultTitle}>🔍 검색 결과</Text>
            <Text>📍 {result.name} ({result.line})</Text>
            <Text>혼잡도: {result.congestion.level ?? '정보 없음'} / {result.congestion.rate ?? '--'}%</Text>
            <Text>날씨: {result.weather?.temperature} / {result.weather?.condition}</Text>
          </View>
        )}

        {/* 날짜 모달 */}
        <DatePickerModal
          locale="ko"
          mode="single"
          visible={dateOpen}
          onDismiss={() => setDateOpen(false)}
          date={date}
          onConfirm={({ date }) => {
            setDateOpen(false);
            setDate(date);
          }}
        />

        {/* 시간 모달 */}
        <TimePickerModal
          locale="ko"
          visible={timeOpen}
          onDismiss={() => setTimeOpen(false)}
          onConfirm={({ hours, minutes }) => {
            setTimeOpen(false);
            setTime({ hours, minutes });
          }}
        />
      </ScrollView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
   
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    padding: 8,
    borderRadius: 6,
    marginBottom: 12,
  },
  suggestionList: {
    maxHeight: 160,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    marginBottom: 12,
  },
  suggestionItem: {
    padding: 8,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  lineList: {
    flexDirection: 'column',
    gap: 8,
  },
  lineItem: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    marginVertical: 4,
  },
  lineItemSelected: {
    backgroundColor: '#d0ebff',
  },
  selectedLine: {
    marginBottom: 8,
    fontStyle: 'italic',
  },
  resultTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 8,
  },
});
