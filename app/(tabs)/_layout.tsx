import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false, // ✅ 모든 탭에서 기본 header 제거
      }}
    >
      <Tabs.Screen name="index" options={{ title: '홈' }} />
      <Tabs.Screen name="alert" options={{ title: '알림설정' }} />
      <Tabs.Screen name="information" options={{ title: '편의시설' }} />
      <Tabs.Screen name="congestion" options={{ title: '혼잡예측' }} />
      <Tabs.Screen name="mypage" options={{ title: 'MY' }} />
    </Tabs>
  );
}
