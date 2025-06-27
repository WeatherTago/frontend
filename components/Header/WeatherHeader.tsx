/** @jsxImportSource @emotion/react */
import styled from '@emotion/native';
import { useTheme } from '@emotion/react';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const OuterContainer = styled.View<{ insetsTop: number }>`
  heigth: 74px;
  padding-top: ${({ insetsTop }) => insetsTop}px;
  background-color:${({ theme }) => theme.colors.gray[50]};
`;

const InnerContainer = styled.View`
  height: 54px;
  padding: 0 14px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const WeatherText = styled.Text`
  font-family: 'Pretendard-ExtraBold';
  font-weight: 800;
  font-size: 30px;
  line-height: 44px;
  color: ${({ theme }) => theme.colors.gray[300]};
`;

const IconRow = styled.View`
  flex-direction: row;
  align-items: center;
`;

const BellWrapper = styled.View`
  margin-left: 12px;
  position: relative;
`;

const BadgeDot = styled.View`
  width: 6px;
  height: 6px;
  border-radius: 3px;
  background-color: ${({ theme }) => theme.colors.primary[700]};
  position: absolute;
  top: -2px;
  right: -2px;
`;


export default function WeatherHeader() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  return (
    <OuterContainer insetsTop={insets.top}>
      <InnerContainer>
        <WeatherText>WEATHER</WeatherText>

        <IconRow>
          <FontAwesome name="star-o" size={20} color={theme.colors.gray[300]} />

          <BellWrapper>
            <Ionicons name="notifications-outline" size={20} color={theme.colors.gray[300]} />
            <BadgeDot />
          </BellWrapper>
        </IconRow>
      </InnerContainer>
    </OuterContainer>
  );
}
