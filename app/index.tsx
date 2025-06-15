import { useContext } from 'react';
import { View } from 'react-native';
import LoginButton from '../components/LoginButton';
import { AuthContext } from '../context/AuthContext';

export default function Index() {
  const { login } = useContext(AuthContext);
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <LoginButton />
    </View>
  );
}
