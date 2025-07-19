import subwayImage from '@/assets/images/subway.png';
import LineCircle from '@/components/LineCircle';
import SearchBar from '@/components/SearchBar';
import { hp, px } from '@/utils/scale';
import { useTheme } from '@emotion/react';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Dimensions, Image, StyleSheet, View } from 'react-native';
import ImageZoom from 'react-native-image-pan-zoom'; // ✅ 추가
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function InformationScreen() {
  const [searchText, setSearchText] = useState('');
  const [selectedLine, setSelectedLine] = useState('1');
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const theme = useTheme();

  const lineData = ['1', '2', '3', '4', '5', '6', '7', '8'].map((line) => ({
    line,
    color:
      selectedLine === line
        ? theme.colors.subway[`line${line}` as keyof typeof theme.colors.subway]
        : theme.colors.gray[300],
  }));

  const getLineMapImage = (line: string) => {
    switch (line) {
      case '1': return require('@/assets/images/subway/subway-map-line1.jpg');
      case '2': return require('@/assets/images/subway/subway-map-line2.jpg');
      case '3': return require('@/assets/images/subway/subway-map-line3.jpg');
      case '4': return require('@/assets/images/subway/subway-map-line4.jpg');
      case '5': return require('@/assets/images/subway/subway-map-line5.jpg');
      case '6': return require('@/assets/images/subway/subway-map-line6.jpg');
      case '7': return require('@/assets/images/subway/subway-map-line7.jpg');
      case '8': return require('@/assets/images/subway/subway-map-line8.jpg');
      default: return null;
    }
  };

  const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');
  const TOP_BAR_HEIGHT = hp(96) + px(74) + insets.top;
  const TAB_BAR_HEIGHT = hp(82) + insets.bottom;
  const Zoom = ImageZoom as any;

<Zoom
  cropWidth={SCREEN_WIDTH}
  cropHeight={SCREEN_HEIGHT - TOP_BAR_HEIGHT - TAB_BAR_HEIGHT}
  imageWidth={px(1000)}
  imageHeight={px(1000)}
>
  <Image
    source={getLineMapImage(selectedLine)!}
    style={styles.mapImage}
  />
</Zoom>


  return (
    <View style={{ flex: 1, paddingTop: insets.top, backgroundColor: theme.colors.gray[0] }}>
      <SearchBar
        placeholder="편의시설이 궁금한 역을 검색해보세요"
        value={searchText}
        onChangeText={setSearchText}
        onPressInput={() => router.push('../infosearch')}
        onPressButton={() => router.push('../infosearch')}
        ButtonIcon={subwayImage}
        buttonLabel="편의시설"
      />
    <View style={[styles.lineCircleBox, { backgroundColor: theme.colors.gray[0] }]}>
      {lineData.map((item) => (
        <LineCircle
          key={item.line}
          lineNumber={item.line}
          backgroundColor={item.color}
          isSelected={selectedLine === item.line}
          showUnderline
          onPress={() => setSelectedLine(item.line)}
        />
      ))}
    </View>


      {selectedLine && (
        <View
          style={[
            styles.mapWrapper,
            { height: SCREEN_HEIGHT - TOP_BAR_HEIGHT - TAB_BAR_HEIGHT },
          ]}
        >
          <Zoom
            cropWidth={SCREEN_WIDTH}
            cropHeight={SCREEN_HEIGHT - TOP_BAR_HEIGHT - TAB_BAR_HEIGHT}
            imageWidth={px(1000)}
            imageHeight={px(1000)} // 적절한 높이로 조절
          >
            <Image
              source={getLineMapImage(selectedLine)!}
              style={styles.mapImage}
            />
          </Zoom>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  lineCircleBox: {
    width: '100%',
    minWidth: px(540),
    height: hp(74),
    paddingVertical: px(8),
    paddingHorizontal: px(16),
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    alignSelf:'stretch',
    flexDirection: 'row',
    flexShrink: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  mapWrapper: {
    width: '100%',
    backgroundColor: '#FFF',
  },
  mapImage: {
    width: px(1000),
    height: px(1000), 
    resizeMode: 'contain',
  },
});