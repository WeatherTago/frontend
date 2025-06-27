import { useAuth } from '@/context/AuthContext';
import { router } from 'expo-router';
import { Button, Text, View } from 'react-native';

export default function MyPageScreen() {
  const { logout } = useAuth();
  const handleLogout = () => {
    logout();
    router.replace('/onboarding');
  };
  return (
    <View>
      <Text>마이페이지</Text>
      <Button title="로그아웃" onPress={handleLogout} />
    </View>
  );
}
