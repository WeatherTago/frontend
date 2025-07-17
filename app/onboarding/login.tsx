import LargeButton from '@/components/Button/LargeButton';
import OnboardingHeader from '@/components/Onboarding/OnboardingHeader';
import StepIndicator from '@/components/Onboarding/StepIndicator';
import { useAuth } from '@/context/AuthContext';
import { theme } from '@/styles/theme';
import { hp, px, wp } from '@/utils/scale';
import { getKeyHashAndroid, initializeKakaoSDK } from '@react-native-kakao/core';
import { login as kakaoLogin } from '@react-native-kakao/user';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useEffect } from 'react';
import { Image, StyleSheet, Text, TextStyle, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function OnboardingLogin() {
  const insets = useSafeAreaInsets();
  const { login, user } = useAuth();

  useEffect(() => {
    initializeKakaoSDK(process.env.EXPO_PUBLIC_KAKAO_NATIVE_APP_KEY!);
  }, []);

  useEffect(() => {
    if (!!user) {
      const fetchTokens = async () => {
        // TODO: remove after token validation
        if (__DEV__) {
          console.log('user', user);

          try {
            const accessToken = await SecureStore.getItemAsync('accessToken');
            const refreshToken = await SecureStore.getItemAsync('refreshToken');
            console.log('accessToken:', accessToken);
            console.log('refreshToken:', refreshToken);
          } catch (error) {
            console.error('토큰 가져오기 실패:', error);
          }
        }

        router.replace('/onboarding/favorites');
      };

      fetchTokens();
    }
  }, [user]);

  const handleLogin = async () => {
    if (__DEV__) {
      console.log(await getKeyHashAndroid());
    }
    try {
      const result = await kakaoLogin();
      const kakaoAccessToken = result.accessToken;
      login(kakaoAccessToken);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <View style={styles.contentContainer}>
        <View style={[styles.imageContainer, { paddingTop: insets.top }]}>
          <Image source={require('@/assets/images/subway-people-big.png')} style={styles.image} />
        </View>
        <StepIndicator totalSteps={4} currentStep={4} />
        <OnboardingHeader
          title={
            <>
              <Text style={styles.titlePrimary}>웨더타고</Text>
              <Text
                style={styles.titleDefault}
              >{`로 날씨에 따른\n지하철 혼잡도 쉽게 알아봐요`}</Text>
            </>
          }
          subtitle={
            <Text style={styles.subtitle}>자주 가는 역의 혼잡도를 알림으로 받아보세요</Text>
          }
        />
      </View>
      <View style={styles.buttonContainer}>
        <LargeButton
          text="카카오로 3초만에 로그인"
          backgroundColor="#FAE100"
          fontColor="#3C1E1E"
          typography={theme.typography.subtitle1}
          onPress={handleLogin}
          icon={require('@/assets/images/kakao-logo.png')}
          iconStyle={{ width: px(47.194), height: px(26.783) }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    backgroundColor: theme.colors.gray[0],
    gap: hp(32),
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    alignSelf: 'stretch',
  },
  imageContainer: {
    height: hp(720),
    flexDirection: 'column',
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: '#2FC8CF',
    flexGrow: 1,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  buttonContainer: {
    height: hp(108),
    paddingHorizontal: wp(24),
    paddingVertical: hp(10),
    gap: hp(10),
    flexDirection: 'column',
    alignItems: 'flex-start',
    alignSelf: 'stretch',
  },
  titlePrimary: {
    color: theme.colors.primary[800],
    fontSize: theme.typography.header1.fontSize,
    fontWeight: theme.typography.header1.fontWeight,
    lineHeight: theme.typography.header1.lineHeight,
  } as TextStyle,
  titleDefault: {
    color: theme.colors.gray[800],
    fontSize: theme.typography.header1.fontSize,
    fontWeight: theme.typography.header1.fontWeight,
    lineHeight: theme.typography.header1.lineHeight,
  } as TextStyle,
  subtitle: {
    color: theme.colors.gray[300],
    fontSize: theme.typography.subtitle2.fontSize,
    fontWeight: theme.typography.subtitle2.fontWeight,
    lineHeight: theme.typography.subtitle2.lineHeight,
  } as TextStyle,
});
