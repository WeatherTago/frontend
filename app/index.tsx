import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

export default function Index() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const done = await AsyncStorage.getItem('onboardingDone');
        if (done) {
          //router.replace('/');
          //온보딩 테스트용 주석
          router.replace('/onboarding');
        } else {
          console.log('온보딩 체크 실패');
          router.replace('/onboarding');
        }
      } catch (e) {
        console.error('온보딩 체크 실패:', e);
        router.replace('/onboarding');
      } finally {
        setLoading(false);
      }
    };
    checkOnboarding();
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Text>메인화면</Text>
    </View>
  );
}
