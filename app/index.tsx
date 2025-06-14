import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

export default function Index() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const isLoggedIn = false;

  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        if (isLoggedIn === null) return;
        if (isLoggedIn) {
          router.replace('/');
        } else {
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
  }, [isLoggedIn]);

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
