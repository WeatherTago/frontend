import { AuthContext } from '@/context/AuthContext';
import styled from '@emotion/native';
import { useContext } from 'react';

const LoginButton = () => {
  const { login } = useContext(AuthContext);

  return (
    <ButtonContainer onPress={login}>
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
