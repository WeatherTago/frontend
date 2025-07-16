import mapImage from '@/assets/images/map.png';
import subwayImage from '@/assets/images/subway/subway-all.png';
import SearchBar from '@/components/SearchBar';
import { px } from '@/utils/scale';
import { useTheme } from '@emotion/react';
import { useRouter } from 'expo-router';
import { Dimensions, Image, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function CongestionMainScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');
  const safeHeight = SCREEN_HEIGHT - insets.top - insets.bottom;
  const imageHeight = safeHeight;
  const imageWidth = (4635 / 3685) * imageHeight;
  const theme=useTheme();

  return (
    <View style={{ flex: 1, paddingTop: insets.top, backgroundColor:theme.colors.gray[0]}}>
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
      <ScrollView
        style={styles.mapWrapper}
        contentContainerStyle={styles.mapZoomContainer}
        minimumZoomScale={1}
        maximumZoomScale={3}
        pinchGestureEnabled={true}
        showsHorizontalScrollIndicator={true}
        showsVerticalScrollIndicator={true}
        bounces={false}
        horizontal={true}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >
          <Image
            source={subwayImage}
            style={{
              width: imageWidth,
              height: imageHeight,
            }}
            resizeMode="contain"
          />
        </ScrollView>
      </ScrollView>
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
