import subwayImage from '@/assets/images/subway.png';
import SearchBar from '@/components/SearchBar';
import { useState } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function InformationScreen() {
  const [searchText, setSearchText] = useState('');
   const handleSearch = (text: string) => {
    console.log('검색 실행:', text);
    // 검색 로직 처리
  };
  const insets = useSafeAreaInsets();

  return (
    <View style={{ paddingTop: insets.top }}>
      <SearchBar
        placeholder="편의시설이 궁금한 역을 검색해보세요"
        value={searchText}
        onChangeText={setSearchText}
        onPressSearch={() => handleSearch(searchText)}
        ButtonIcon={subwayImage}
        buttonLabel="편의시설"
      />
    </View>
  );
}
