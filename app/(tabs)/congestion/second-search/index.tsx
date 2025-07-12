import ArrowIcon from '@/components/Icons/ArrowIcon';
import { useStationContext } from '@/context/StationContext';
import { hp, px, wp } from '@/utils/scale';
import { useTheme } from '@emotion/react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Fuse from 'fuse.js';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  FlatList,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SecondSearchScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const inputRef = useRef<TextInput>(null);
  const router = useRouter();

  const { stations } = useStationContext();
  const { from, station, line, date, time } = useLocalSearchParams<{
    from: 'departure' | 'arrival';
    station: string;
    line: string;
    date: string;
    time: string;
  }>();

  const [stationName, setStationName] = useState('');
  const [selectedLine, setSelectedLine] = useState('');
  const [filteredLines, setFilteredLines] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const uniqueStationNames = useMemo(() => {
    const set = new Set<string>();
    return stations.filter((s) => {
      if (set.has(s.stationName)) return false;
      set.add(s.stationName);
      return true;
    });
  }, [stations]);

  const fuse = useMemo(() => new Fuse(uniqueStationNames, {
    keys: ['stationName'],
    threshold: 0.4,
  }), [uniqueStationNames]);

  const filteredStations = stationName
    ? fuse.search(stationName).map((res) => res.item)
    : [];

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

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
    if (!stationName || !selectedLine) {
      Alert.alert('입력 필요', '역 이름과 호선을 선택해주세요.');
      return;
    }

    if (from === 'departure') {
      router.push({
        pathname: '../congestion/route-result',
        params: {
          departureStation: stationName,
          departureLine: selectedLine,
          arrivalStation: station,
          arrivalLine: line,
          date,
          time,
        },
      });
    } else {
      router.push({
        pathname: '../congestion/route-result',
        params: {
          departureStation: station,
          departureLine: line,
          arrivalStation: stationName,
          arrivalLine: selectedLine,
          date,
          time,
        },
      });
    }
  };

  return (
    <View style={{ flex: 1, paddingTop: insets.top, backgroundColor: '#FFF' }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowIcon direction="left" width={px(46)} height={px(46)} color={theme.colors.gray[500]} />
        </TouchableOpacity>
        <TextInput
          ref={inputRef}
          placeholder={from === 'departure' ? '도착역을 입력하세요' : '출발역을 입력하세요'}
          placeholderTextColor={theme.colors.gray[300]}
          style={styles.input}
          value={stationName}
          onChangeText={(text) => {
            setStationName(text);
            setShowSuggestions(true);
          }}
        />
      </View>

      {showSuggestions && filteredStations.length > 0 && (
        <FlatList
          data={filteredStations}
          keyExtractor={(item) => item.stationName}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleStationSelect(item.stationName)}
              style={styles.item}
            >
              <Text style={{ color: theme.colors.gray[900], fontSize: px(20) }}>
                {item.stationName}
              </Text>
            </TouchableOpacity>
          )}
          keyboardShouldPersistTaps="handled"
          ItemSeparatorComponent={() => (
            <View style={{ height: 1, backgroundColor: theme.colors.gray[100] }} />
          )}
          style={{ marginTop: px(8) }}
        />
      )}

      {filteredLines.length > 0 && (
        <View style={{ paddingHorizontal: px(16), marginTop: px(16) }}>
          <Text style={{ fontSize: px(18), fontWeight: '600', marginBottom: px(8) }}>
            {stationName}의 호선을 선택하세요:
          </Text>
          {filteredLines.map((line) => (
            <TouchableOpacity
              key={line}
              onPress={() => setSelectedLine(line)}
              style={{
                padding: px(12),
                marginBottom: px(8),
                backgroundColor: selectedLine === line ? theme.colors.primary[100] : '#eee',
                borderRadius: px(6),
              }}
            >
              <Text style={{ fontSize: px(16), color: theme.colors.primary[700] }}>
                {line}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {selectedLine && (
        <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
          <Text style={styles.submitButtonText}>선택 완료</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    width: wp(540),
    height: hp(90),
    paddingHorizontal: wp(14),
    flexDirection: 'row',
    alignItems: 'center',
    gap: px(8),
    backgroundColor: '#FFF',
    shadowColor: 'rgba(0, 0, 0, 0.05)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 3,
  },
  input: {
    flex: 1,
    fontSize: px(24),
    fontFamily: 'Pretendard-Medium',
    fontWeight: '500',
    lineHeight: px(34),
    color: '#000',
  },
  item: {
    padding: px(14),
    backgroundColor: '#FFF',
  },
  submitButton: {
    marginTop: px(24),
    marginHorizontal: px(16),
    backgroundColor: '#00C4B8',
    borderRadius: px(8),
    paddingVertical: px(14),
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: px(16),
    fontWeight: '600',
  },
});
