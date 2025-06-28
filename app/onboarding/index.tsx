import LargeButton from '@/components/Button/LargeButton';
import StepIndicator from '@/components/StepIndicator';
import { theme } from '@/styles/theme';
import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Index() {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <StepIndicator totalSteps={4} currentStep={1} />
      <Text>웨더타고 날씨에 따른</Text>
      <Text>지하철 혼잡도 쉽게 알아봐요</Text>
      <Text>자주 가는 역의 혼잡도를 알림으로 받아보세요</Text>
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
    alignItems: 'center',
    paddingBottom: 16,
    backgroundColor: theme.colors.gray[0],
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    gap: 10,
    flexDirection: 'column',
    alignItems: 'flex-start',
    alignSelf: 'stretch',
  },
});
