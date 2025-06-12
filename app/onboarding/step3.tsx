import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Button, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function OnboardingStep3() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem('onboardingDone', 'true');
      router.replace('/login');
    } catch (e) {
      console.error('온보딩 완료 저장 실패:', e);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <Text>웨더타고 날씨에 따른</Text>
      <Text>지하철 혼잡도 쉽게 알아봐요</Text>
      <Text>자주 가는 역의 혼잡도를 알림으로 받아보세요</Text>
      <Button title="카카오 계정으로 시작하기" onPress={completeOnboarding} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
});
