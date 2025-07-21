import LargeButton from '@/components/Button/LargeButton';
import OnboardingHeader from '@/components/Onboarding/OnboardingHeader';
import StepIndicator from '@/components/Onboarding/StepIndicator';
import { theme } from '@/styles/theme';
import { hp, wp } from '@/utils/scale';
import { router } from 'expo-router';
import { Image, StyleSheet, Text, TextStyle, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function OnboardingStep3() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={styles.contentContainer}>
        <View style={styles.imageContainer}>
          <Image
            source={require('@/assets/images/onboarding/onboarding-step3.png')}
            style={styles.image}
          />
        </View>
        <StepIndicator totalSteps={4} currentStep={3} />
        <OnboardingHeader
          title={
            <Text style={styles.titleDefault}>
              승강기, 휠체어 리프트 위치까지{`\n`}미리미리
              <Text style={styles.titlePrimary}> 한눈에 확인해요</Text>
            </Text>
          }
          subtitle={
            <Text style={styles.subtitle}>역 내 편의시설 정보를 미리 확인하고 준비해요</Text>
          }
        />
      </View>
      <View style={styles.buttonContainer}>
        <LargeButton
          text="다음"
          backgroundColor={theme.colors.gray[900]}
          fontColor={theme.colors.gray[0]}
          typography={theme.typography.subtitle1}
          onPress={() => router.replace('/onboarding/login')}
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
