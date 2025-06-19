import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

export default function Index() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const isLoggedIn = false;

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isLoggedIn === null) return;

      try {
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
    }, 300); // 300ms 지연

    return () => clearTimeout(timeout); // cleanup
  }, [isLoggedIn]);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text>로딩 중...</Text>
      </View>
    );
  }

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
