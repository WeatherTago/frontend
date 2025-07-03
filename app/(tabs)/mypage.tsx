import Header from '@/components/Header/CommonHeader';
import { useAuth } from '@/context/AuthContext';
import { router } from 'expo-router';
import { Button, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MyPageScreen() {
  const { logout } = useAuth();
  const handleLogout = () => {
    logout();
    router.replace('/onboarding');
  };
  return (
    <SafeAreaView style={styles.container}>
      <Header title="마이페이지" />
      <Button title="로그아웃" onPress={handleLogout} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    
  },
});
