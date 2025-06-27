import { useAuth } from '@/context/AuthContext';
import styled from '@emotion/native';

const LoginButton = () => {
  const { login } = useAuth();
  const token = process.env.EXPO_PUBLIC_KAKAO_ACCESS_TOKEN;

  const handleLogin = () => {
    if (!token) {
      console.error('카카오 액세스 토큰이 설정되지 않았습니다.');
      return;
    }
    login(token);
  };

  return (
    <ButtonContainer onPress={handleLogin}>
      <ButtonText>카카오 계정으로 로그인하기</ButtonText>
    </ButtonContainer>
  );
};

export default LoginButton;

const ButtonContainer = styled.TouchableOpacity`
  background-color: ${({ theme }) => theme.colors.primary['700']};
  padding: ${({ theme }) => `${theme.spacing.md}px`};
  border-radius: ${({ theme }) => `${theme.spacing.md}px`};
  align-items: center;
`;

const ButtonText = styled.Text`
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => `${theme.typography.body1.fontSize}px`};
`;
