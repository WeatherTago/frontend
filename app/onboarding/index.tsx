import LargeButton from '@/components/Button/LargeButton';
import OnboardingHeader from '@/components/Onboarding/OnboardingHeader';
import StepIndicator from '@/components/Onboarding/StepIndicator';
import { theme } from '@/styles/theme';
import { hp, wp } from '@/utils/scale';
import { router } from 'expo-router';
import { StyleSheet, Text, TextStyle, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Index() {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom + hp(16) }]}
    >
      <View style={styles.contentContainer}>
        <View style={styles.imageContainer} />
        <StepIndicator totalSteps={4} currentStep={1} />
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
          text="다음"
          backgroundColor={theme.colors.gray[900]}
          fontColor={theme.colors.gray[0]}
          typography={theme.typography.subtitle1}
          onPress={() => router.replace('/onboarding/step2')}
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
    display: 'flex',
    height: hp(720),
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
