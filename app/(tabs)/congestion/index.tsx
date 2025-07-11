import mapImage from '@/assets/images/map.png';
import SearchBar from '@/components/SearchBar';
import { useRouter } from 'expo-router';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function CongestionMainScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={{ flex: 1, paddingTop: insets.top }}>
      <SearchBar
        placeholder="혼잡도가 궁금한 역을 검색해보세요"
        value=""
        onChangeText={() => {}}
        onPressInput={() => router.push('./congestion/first-search')} // ✅ 검색화면으로 이동
        ButtonIcon={mapImage}
        buttonLabel="혼잡예측"
      />
      {/* 추후 즐겨찾기 혼잡도나 최근 검색 등을 추가할 수 있음 */}
    </View>
  );
}
