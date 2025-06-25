import { AuthProvider } from '@/context/AuthContext';
import { theme } from '@/styles/theme';
import { ThemeProvider } from '@emotion/react';
import { Asset } from 'expo-asset';
import Constants from 'expo-constants';
import { Image } from 'expo-image';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { Server } from 'miragejs';
import { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

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

  // TODO : 로그인, 로그아웃 컨텍스트 API 로직 넣기?

  if (!isSplashReady) {
    return null;
  }

  // TODO : AuthContext로 감싸기
  return <AnimatedSplashScreen image={image}>{children}</AnimatedSplashScreen>;
}

function AnimatedSplashScreen({ children, image }: { children: React.ReactNode; image: number }) {
  const [isAppReady, setAppReady] = useState(false);
  // ㄴ App이 준비되고, SplashAnimation이 끝나면 보여줌
  const [isSplashAnimationComplete, setSplashAnimationComplete] = useState(false);
  const animation = useRef(new Animated.Value(1)).current;
  // const {updateUser} = useContext(AuthContext);

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
      await Promise.all([
        // AsyncStorage.getItem('user').then((user)=>{updateUser?.(user?JSON.parse(user):null)}),
        // TODO: validating access token
      ]);
      await SplashScreen.hideAsync();
    } catch (error) {
      console.error(error);
    } finally {
      setAppReady(true);
    }
  };

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
    <AnimatedAppLoader image={require('../assets/images/react-logo.png')}>
      <AuthProvider>
        <ThemeProvider theme={theme}>
          <Stack screenOptions={{ headerShown: false }} />
        </ThemeProvider>
      </AuthProvider>
    </AnimatedAppLoader>
  );
}
