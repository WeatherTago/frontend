import LoginButton from '@/components/LoginButton';
import { AuthContext } from '@/context/AuthContext';
import { router } from 'expo-router';
import { useContext } from 'react';
import { StyleSheet, View } from 'react-native';

export default function Login() {
  const { user } = useContext(AuthContext);

  if (!!user) {
    router.replace('/');
    return;
  }

  return (
    <View style={styles.container}>
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
