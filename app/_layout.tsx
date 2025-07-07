import { AuthProvider } from '@/context/AuthContext';
import { StationProvider } from '@/context/StationContext';
import { theme } from '@/styles/theme';
import { ThemeProvider } from '@emotion/react';
import { Asset } from 'expo-asset';
import Constants from 'expo-constants';
import * as Font from 'expo-font';
import { Image } from 'expo-image';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { Server } from 'miragejs';
import { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { ko, registerTranslation } from 'react-native-paper-dates';
import { SafeAreaProvider } from 'react-native-safe-area-context';

registerTranslation('ko', ko);

declare global {
  interface Window {
    server: Server;
  }
}

SplashScreen.preventAutoHideAsync().catch(e => console.error(e));

function AnimatedAppLoader({ children, image }: { children: React.ReactNode; image: number }) {
  const [isSplashReady, setIsSplashReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      await Asset.loadAsync(image);
      // await Asset.fromURI(image).downloadAsync(); 원격 이미지 로드
      setIsSplashReady(true);
    }
    prepare();
  }, [image]);

  if (!isSplashReady) {
    return null;
  }

  return <AnimatedSplashScreen image={image}>{children}</AnimatedSplashScreen>;
}

function AnimatedSplashScreen({ children, image }: { children: React.ReactNode; image: number }) {
  const [isAppReady, setAppReady] = useState(false);
  const [isSplashAnimationComplete, setSplashAnimationComplete] = useState(false);
  const animation = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isAppReady) {
      Animated.timing(animation, {
        toValue: 0,
        duration: 2000,
        useNativeDriver: true,
      }).start(() => setSplashAnimationComplete(true));
    }
  }, [isAppReady]);

  const onImageLoaded = async () => {
    try {
      // 데이터 준비
      await Promise.all([]);
      await SplashScreen.hideAsync();
    } catch (error) {
      console.error(error);
    } finally {
      setAppReady(true);
    }
  };
  const [fontsLoaded] = Font.useFonts({
    'Pretendard-Regular': require('@/assets/fonts/Pretendard-Regular.otf'),
    'Pretendard-Medium': require('@/assets/fonts/Pretendard-Medium.otf'),
    'Pretendard-Bold': require('@/assets/fonts/Pretendard-Bold.otf'),
    'Pretendard-SemiBold': require('@/assets/fonts/Pretendard-SemiBold.otf'),
    'Pretendard-ExtraBold': require('@/assets/fonts/Pretendard-ExtraBold.otf'),
  });

  if (!fontsLoaded) return null;


  return (
    <View style={{ flex: 1 }}>
      {isAppReady && children}
      {!isSplashAnimationComplete && (
        <Animated.View
          pointerEvents="none"
          style={[
            {
              ...StyleSheet.absoluteFillObject,
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: Constants.expoConfig?.splash?.backgroundColor || '#fff',
              opacity: animation,
            },
          ]}
        >
          <Image
            source={image}
            contentFit={Constants.expoConfig?.splash?.resizeMode || 'contain'}
            style={{
              width: Constants.expoConfig?.splash?.imageWidth || 200,
              height: Constants.expoConfig?.splash?.imageHeight || 200,
            }}
            onLoadEnd={onImageLoaded}
            transition={0}
          />
        </Animated.View>
      )}
    </View>
  );
}

export default function RootLayout() {
  return (
    
      <SafeAreaProvider>
        <StationProvider>
            <AnimatedAppLoader image={require('../assets/images/react-logo.png')}>
              <AuthProvider>
                <ThemeProvider theme={theme}>
                  <Stack screenOptions={{ headerShown: false }} />
                </ThemeProvider>
            </AuthProvider>
          </AnimatedAppLoader>
          </StationProvider>
      </SafeAreaProvider>
    
    
  );
}
