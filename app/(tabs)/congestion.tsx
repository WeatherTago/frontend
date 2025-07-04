import { fetchStationByConditions, StationResult } from '@/apis/station';
import React, { useState } from 'react';
import { Button, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { DatePickerModal, TimePickerModal } from 'react-native-paper-dates';

export default function CongestionScreen() {
  const [station, setStation] = useState('');
  const [line, setLine] = useState('');
  const [date, setDate] = useState<Date | undefined>();
  const [time, setTime] = useState<{ hours: number; minutes: number } | undefined>();
  const [dateOpen, setDateOpen] = useState(false);
  const [timeOpen, setTimeOpen] = useState(false);

  const [result, setResult] = useState<StationResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!station || !line || !date || !time) {
      alert('모든 항목을 입력해주세요.');
      return;
    }

    // ISO 포맷으로 시간 생성
    const dateTime = new Date(date);
    dateTime.setHours(time.hours);
    dateTime.setMinutes(time.minutes);
    dateTime.setSeconds(0);
    dateTime.setMilliseconds(0);
    const isoTime = dateTime.toISOString();

    setLoading(true);
    const response = await fetchStationByConditions({
      name: station,
      line,
      date: date.toISOString().split('T')[0],
      time: isoTime,
    });

    setResult(response);
    setLoading(false);
  };

  return (
    <PaperProvider>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.label}>역 이름</Text>
        <TextInput
          placeholder="예: 서울대입구"
          value={station}
          onChangeText={setStation}
          style={styles.input}
        />

        <Text style={styles.label}>호선</Text>
        <TextInput
          placeholder="예: 2호선"
          value={line}
          onChangeText={setLine}
          style={styles.input}
        />

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

        {loading && <Text>불러오는 중...</Text>}

        {result && (
          <View style={{ marginTop: 20 }}>
            <Text style={styles.resultTitle}>🔍 검색 결과</Text>
            <Text>📍 {result.name} ({result.line})</Text>
            <Text>혼잡도: {result.congestion.level ?? '정보 없음'} / {result.congestion.rate ?? '--'}%</Text>
            <Text>날씨: {result.weather?.temperature} / {result.weather?.condition}</Text>
          </View>
        )}

        {/* 날짜 선택 모달 */}
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

        {/* 시간 선택 모달 */}
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
    padding: 20,
    gap: 12,
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
  resultTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 8,
  },
});
