// components/StationSearchBox.tsx
import Fuse from 'fuse.js';
import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SearchBar from './SearchBar';

interface Station {
  stationName: string;
  stationLine: string;
}

interface Props {
  stations: Station[];
  mapImage: any;
  onSelectStation: (stationName: string, lines: string[]) => void;
  onSearch: () => void;
  stationName: string;
  setStationName: (name: string) => void;
}

export default function StationSearchBox({
  stations,
  stationName,
  setStationName,
  onSelectStation,
  onSearch,
  mapImage,
}: Props) {
  const insets = useSafeAreaInsets();
  const [showSuggestions, setShowSuggestions] = useState(false);

  const uniqueStationNames = useMemo(() => {
    const nameSet = new Set<string>();
    return stations.filter(station => {
      if (nameSet.has(station.stationName)) return false;
      nameSet.add(station.stationName);
      return true;
    });
  }, [stations]);

  const fuse = useMemo(
    () =>
      new Fuse(uniqueStationNames, {
        keys: ['stationName'],
        threshold: 0.45,
      }),
    [uniqueStationNames],
  );

  const filteredStations = stationName ? fuse.search(stationName).map(res => res.item) : [];

  const handleSelect = (name: string) => {
    setStationName(name);
    setShowSuggestions(false);
    const matched = stations.filter(s => s.stationName === name);
    const lines = [...new Set(matched.map(s => s.stationLine))];
    onSelectStation(name, lines);
  };

  return (
    <View style={{ paddingTop: insets.top }}>
      <SearchBar
        placeholder="혼잡도가 궁금한 역을 검색해보세요"
        value={stationName}
        onChangeText={text => {
          setStationName(text);
          setShowSuggestions(true);
        }}
        onPressSearch={onSearch}
        ButtonIcon={mapImage}
        buttonLabel="혼잡예측"
      />

      {showSuggestions && filteredStations.length > 0 && (
        <View style={styles.suggestionList}>
          <ScrollView keyboardShouldPersistTaps="handled">
            {filteredStations.map(item => (
              <TouchableOpacity
                key={item.stationName}
                onPress={() => handleSelect(item.stationName)}
                style={styles.suggestionItem}
              >
                <Text>{item.stationName}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  suggestionList: {
    position: 'absolute',
    top: 96,
    left: 20,
    right: 20,
    maxHeight: 160,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    backgroundColor: '#FFF',
    zIndex: 100,
    elevation: 5,
  },
  suggestionItem: {
    padding: 8,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
});
