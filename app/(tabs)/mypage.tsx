import { useAuth } from '@/context/AuthContext';
import { router } from 'expo-router';
import { Button, StyleSheet, Text, View } from 'react-native';

export default function MyPageScreen() {
  const { logout } = useAuth();
  const handleLogout = () => {
    logout();
    router.replace('/onboarding');
  };
  return (
    <View style={styles.container}>
      <Text>마이페이지</Text>
      <Button title="로그아웃" onPress={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
