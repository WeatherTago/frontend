import { axiosInstance } from '@/apis/axios';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { FavoriteProvider } from '@/context/FavoriteContext';
import { NoticeProvider } from '@/context/NoticeContext';
import { StationProvider } from '@/context/StationContext';
import { theme } from '@/styles/theme';
import { ThemeProvider } from '@emotion/react';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { Asset } from 'expo-asset';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Font from 'expo-font';
import { Image } from 'expo-image';
import * as Notifications from 'expo-notifications';
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Animated, Linking, StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ko, registerTranslation } from 'react-native-paper-dates';
import { SafeAreaProvider } from 'react-native-safe-area-context';

registerTranslation('ko', ko);

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
  handleSuccess(notificationId) {
    console.log('Notification sent successfully:', notificationId);
  },
  handleError(notificationId, error) {
    console.log('Notification failed to send:', notificationId, error);
  },
});

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

async function sendPushNotification(expoPushToken: string) {
  const message = {
    to: expoPushToken,
    sound: 'default',
    title: 'Original Title',
    body: 'And here is the body!',
    data: { someData: 'goes here' },
  };

  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });
}

function AnimatedSplashScreen({ children, image }: { children: React.ReactNode; image: number }) {
  const [isAppReady, setAppReady] = useState(false);
  const [isSplashAnimationComplete, setSplashAnimationComplete] = useState(false);
  const animation = useRef(new Animated.Value(1)).current;
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);

  useEffect(() => {
    if (isAppReady) {
      Animated.timing(animation, {
        toValue: 0,
        duration: 2000,
        useNativeDriver: true,
      }).start(() => setSplashAnimationComplete(true));
    }
  }, [isAppReady]);

  useEffect(() => {
    if (expoPushToken && Device.isDevice) {
      sendPushNotification(expoPushToken);
    }
  }, [expoPushToken]);

  const onImageLoaded = async () => {
    try {
      // 데이터 준비
      await Promise.all([]);
      await SplashScreen.hideAsync();
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== Notifications.PermissionStatus.GRANTED) {
        Alert.alert('알림 권한 필요', '알림을 받기 위해 권한을 허용해주세요.', [
          { text: '취소', style: 'cancel' },
          { text: '설정으로 이동', onPress: () => Linking.openSettings() },
        ]);
        return;
      }
      const token = await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId,
      });
      console.log('✅ 푸시 토큰:', token);
      // TODO: save token to server
      setExpoPushToken(token.data);
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
  const router = useRouter();
  const { logout } = useAuth();

  useEffect(() => {
    const interceptor = axiosInstance.interceptors.response.use(
      res => res,
      async err => {
        if (err.message === 'refresh token expired') {
          await logout();
          router.replace('/onboarding');
        }

        return Promise.reject(err);
      },
    );

    return () => {
      axiosInstance.interceptors.response.eject(interceptor);
    };
  }, []);
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <AnimatedAppLoader image={require('../assets/images/logo/weathertago-logo.png')}>
          <AuthProvider>
            <StationProvider>
              <FavoriteProvider>
                <NoticeProvider>
                  <ThemeProvider theme={theme}>
                    <BottomSheetModalProvider>
                      <Stack screenOptions={{ headerShown: false }} />
                    </BottomSheetModalProvider>
                  </ThemeProvider>
                </NoticeProvider>
              </FavoriteProvider>
            </StationProvider>
          </AuthProvider>
        </AnimatedAppLoader>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
