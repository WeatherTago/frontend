import LoginButton from '@/components/LoginButton';
import { AuthContext } from '@/context/AuthContext';
import { useRouter } from 'expo-router';
import { useContext, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function OnboardingStep3() {
  const insets = useSafeAreaInsets();
  const { user } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!!user) {
      router.replace('/');
    }
  }, [user]);

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <Text>웨더타고 날씨에 따른</Text>
      <Text>지하철 혼잡도 쉽게 알아봐요</Text>
      <Text>자주 가는 역의 혼잡도를 알림으로 받아보세요</Text>
      <LoginButton />
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
