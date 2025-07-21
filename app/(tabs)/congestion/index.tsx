import mapImage from '@/assets/images/map.png';
import subwayImage from '@/assets/images/subway/subway-all.png';
import SearchBar from '@/components/SearchBar';
import { px } from '@/utils/scale';
import { useTheme } from '@emotion/react';
import { useRouter } from 'expo-router';
import { Dimensions, Image, StyleSheet, View } from 'react-native';
import ImageZoom from 'react-native-image-pan-zoom'; // ✅ 추가
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function CongestionMainScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');
  const safeHeight = SCREEN_HEIGHT - insets.top - insets.bottom;
  const imageHeight = safeHeight;
  const imageWidth = (4635 / 3685) * imageHeight;
  const theme = useTheme();
  const Zoom = ImageZoom as any;

  return (
    <View style={{ flex: 1, paddingTop: insets.top, backgroundColor: theme.colors.gray[0] }}>
      <SearchBar
        placeholder="혼잡도가 궁금한 역을 검색해보세요"
        value=""
        onChangeText={() => {}}
        onPressInput={() => router.push('../congestion/first-search')}
        onPressButton={() => router.push('../congestion/first-search')}
        ButtonIcon={mapImage}
        buttonLabel="혼잡예측"
      />
      <View style={{ height: px(2), backgroundColor: theme.colors.gray[100] }} />

      <Zoom
        cropWidth={SCREEN_WIDTH}
        cropHeight={safeHeight}
        imageWidth={imageWidth}
        imageHeight={imageHeight}
        minScale={1}
        maxScale={3}
        enableCenterFocus={false}
      >
        <Image
          source={subwayImage}
          style={{
            width: imageWidth,
            height: imageHeight,
          }}
          resizeMode="contain"
        />
      </Zoom>
    </View>
  );
}

const styles = StyleSheet.create({
  mapWrapper: {
    flex: 1,
  },
  mapZoomContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
