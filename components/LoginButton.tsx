import { AuthContext } from '@/context/AuthContext';
import { useContext } from 'react';
import { Button } from 'react-native';

const LoginButton = () => {
  const { login } = useContext(AuthContext);

  return <Button title="카카오 계정으로 로그인하기" onPress={login} />;
};

export default LoginButton;
