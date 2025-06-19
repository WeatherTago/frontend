import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Index() {
  const insets = useSafeAreaInsets();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 100); // 약간의 시간차로 안정성 확보
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <Text>웨더타고 날씨에 따른</Text>
      <Text>지하철 혼잡도 쉽게 알아봐요</Text>
      <Text>자주 가는 역의 혼잡도를 알림으로 받아보세요</Text>
      {isReady && (
        <Button
          title="다음"
          onPress={() => {
            router.replace('/onboarding/step2');
          }}
        />
      )}
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
