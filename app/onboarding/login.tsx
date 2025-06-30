import LargeButton from '@/components/Button/LargeButton';
import OnboardingHeader from '@/components/Onboarding/OnboardingHeader';
import StepIndicator from '@/components/Onboarding/StepIndicator';
import { useAuth } from '@/context/AuthContext';
import { theme } from '@/styles/theme';
import { hp, wp } from '@/utils/scale';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useEffect } from 'react';
import { StyleSheet, Text, TextStyle, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Index() {
  const insets = useSafeAreaInsets();
  const { login, user } = useAuth();
  const token = process.env.EXPO_PUBLIC_KAKAO_ACCESS_TOKEN;

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

        router.replace('/(tabs)');
      };

      fetchTokens();
    }
  }, [user]);

  const handleLogin = () => {
    if (!token) {
      console.error('카카오 액세스 토큰이 설정되지 않았습니다.');
      return;
    }
    login(token);
  };

  return (
    <View
      style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom + hp(16) }]}
    >
      <View style={styles.imageContainer} />
      <StepIndicator totalSteps={4} currentStep={4} />
      <OnboardingHeader
        title={
          <>
            <Text style={styles.titlePrimary}>웨더타고</Text>
            <Text style={styles.titleDefault}>{`로 날씨에 따른\n지하철 혼잡도 쉽게 알아봐요`}</Text>
          </>
        }
        subtitle={<Text style={styles.subtitle}>자주 가는 역의 혼잡도를 알림으로 받아보세요</Text>}
      />
      <View style={styles.buttonContainer}>
        <LargeButton
          text="카카오로 3초만에 로그인"
          backgroundColor="#FAE100"
          fontColor="#3C1E1E"
          typography={theme.typography.subtitle1}
          onPress={handleLogin}
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
  imageContainer: {
    display: 'flex',
    // height: hp(720),
    flexDirection: 'column',
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: theme.colors.gray[100],
    flexGrow: 1,
  },
  buttonContainer: {
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
