import { myFavorite } from '@/apis/favorite';
import SmallThumbnail from '@/components/Favorites/SmallThumbnail';
import Header from '@/components/Header/CommonHeader';
import StarIcon from '@/components/Icons/StarIcon';
import { useFavorite } from '@/context/FavoriteContext';
import { useStationContext } from '@/context/StationContext';
import { theme } from '@/styles/theme';
import { StationInfo } from '@/types/common';
import { hp, px, wp } from '@/utils/scale';
import { useRouter } from 'expo-router';
import Fuse from 'fuse.js';
import debounce from 'lodash.debounce';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function FavoriteModal() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { stations, loading: stationsLoading } = useStationContext();
  const { toggleFavorite, isFavorite, isLoading: favoriteLoading } = useFavorite();
  const [favoriteStationList, setFavoriteStationList] = useState<StationInfo[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [debouncedValue, setDebouncedValue] = useState('');
  // 디바운스 함수: 입력 후 150ms 지연
  const debounceInput = useMemo(
    () =>
      debounce((val: string) => {
        setDebouncedValue(val);
      }, 150),
    [],
  );

  // inputValue가 변경될 때마다 debounceInput 실행
  useEffect(() => {
    debounceInput(inputValue);
  }, [inputValue]);

  // Fuse 인스턴스 생성
  const fuse = useMemo(() => {
    return new Fuse(stations, {
      keys: ['stationName'],
      threshold: 0.45, // 오차 허용도 설정 (낮을수록 엄격)
    });
  }, [stations]);

  // 검색어 기반 필터링된 리스트 (실시간 반응)
  const filteredStations = useMemo(() => {
    if (!debouncedValue.trim()) return stations.slice(0, 12); // 기본 12개
    return fuse.search(debouncedValue.trim()).map(res => res.item);
  }, [debouncedValue, fuse]);

  const isSearching = debouncedValue.trim().length > 0;
  const dataToRender = isSearching ? filteredStations : favoriteStationList;

  useEffect(() => {
    const fetchStationInfo = async () => {
      const res = await myFavorite();
      setFavoriteStationList(res.result.stations);
    };
    fetchStationInfo();
  }, [favoriteStationList, favoriteLoading]);

  const toggleHandler = (stationId: number) => {
    toggleFavorite(stationId);
    setInputValue('');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="즐겨찾는 역" onPressLeft={() => router.back()} />

      <View style={styles.searchStationContainer}>
        <View style={styles.searchStationBox}>
          <View style={styles.iconAndTextContainer}>
            <StarIcon size={30} color={theme.colors.gray[400]} />
            <TextInput
              style={styles.searchStationText}
              placeholder="자주 가는 역을 검색해보세요"
              placeholderTextColor={theme.colors.gray[400]}
              value={inputValue}
              onChangeText={setInputValue}
            />
          </View>
        </View>
      </View>
      {/* 로딩 상태에 따라 다른 컨테이너를 렌더링 */}
      {favoriteLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary[700]} />
        </View>
      ) : (
        <View style={styles.flatListOuterContainer}>
          <FlatList
            data={dataToRender}
            keyExtractor={(_, idx) => idx.toString()}
            renderItem={({ item }) => (
              <SmallThumbnail
                key={item.stationId}
                stationId={item.stationId}
                stationName={item.stationName}
                stationLine={item.stationLine}
                isFavorite={isFavorite}
                onToggleFavorite={() => toggleHandler(item.stationId)}
              />
            )}
            numColumns={3}
            contentContainerStyle={styles.flatListContainer}
            columnWrapperStyle={styles.columnWrapper}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#aaa',
  },
  textContainer: {
    padding: px(24),
    alignItems: 'flex-start',
    alignSelf: 'stretch',
  },
  text: {
    color: theme.colors.gray[800],
    fontFamily: theme.typography.header1.fontFamily,
    fontSize: theme.typography.header1.fontSize,
    fontWeight: theme.typography.header1.fontWeight,
    lineHeight: theme.typography.header1.lineHeight,
  },
  textFocus: {
    color: theme.colors.primary[700],
    fontFamily: theme.typography.header1.fontFamily,
    fontSize: theme.typography.header1.fontSize,
    fontWeight: theme.typography.header1.fontWeight,
    lineHeight: theme.typography.header1.lineHeight,
  },
  searchStationContainer: {
    padding: px(24),
    flexDirection: 'column',
    alignItems: 'flex-start',
    alignSelf: 'stretch',
  },
  searchStationBox: {
    height: hp(66),
    paddingHorizontal: wp(22),
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    gap: px(14),
    alignSelf: 'stretch',
    borderRadius: px(16),
    backgroundColor: theme.colors.gray[50],
  },
  iconAndTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: px(6),
  },
  searchStationText: {
    color: theme.colors.gray[400],
    fontFamily: 'Pretendard-Medium',
    fontSize: px(20),
    fontWeight: '500',
    lineHeight: px(28),
  },
  flatListOuterContainer: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    alignSelf: 'stretch',
  },
  flatListContainer: {
    paddingTop: hp(36),
    paddingHorizontal: wp(24),
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flexGrow: 1,
  },
  columnWrapper: {
    justifyContent: 'flex-start',
    gap: wp(12), // 컬럼 간 간격 (column-gap)
    marginBottom: hp(20), // 행 간 간격 (row-gap)
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: theme.colors.gray[0],
  },
});
