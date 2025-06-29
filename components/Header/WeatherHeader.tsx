/** @jsxImportSource @emotion/react */
import styled from '@emotion/native';
import { useTheme } from '@emotion/react';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AlarmDot from '../icons/AlarmDot';
import StarIcon from '../icons/starIcon';

const OuterContainer = styled.View`
  background-color: ${({ theme }) => theme.colors.gray[50]};
`;
const InnerContainer = styled.View`
  height: 54px;
  padding: 8px 14px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const WeatherText = styled.Text`
  font-family: ${({ theme }) => theme.fonts.pretendard.extrabold};
  font-weight: 800;
  font-size: 30px;
  line-height: 44px;
  color: ${({ theme }) => theme.colors.gray[300]};
`;

const BellWrapper = styled.View`
  position: relative;
`;

const IconButton = styled(TouchableOpacity)`
  width: 46px;
  height: 46px;
  justify-content: center;
  align-items: center;
`;

const IconRow = styled.View`
  flex-direction: row;
  align-items: center;
`;
const AlarmDotWrapper = styled.View`
  position: absolute;
  top: 5px;
  right: 5px;
`;

export default function WeatherHeader() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  return (
    <OuterContainer style={{ paddingTop: insets.top }}>
      <InnerContainer>
        <WeatherText>WEATHER</WeatherText>

        <IconRow>
          <IconButton
            onPress={() => {
              /* 즐겨찾기 로직 */
            }}
          >
            <StarIcon size={46} />
          </IconButton>

          <BellWrapper>
            <IconButton
              onPress={() => {
                /* 공지사항 로직 */
              }}
            >
              <Ionicons
                name="notifications"
                size={30} //
                color={theme.colors.gray[300]}
              />
            </IconButton>
            <AlarmDotWrapper>
              <AlarmDot />
            </AlarmDotWrapper>
          </BellWrapper>
        </IconRow>
      </InnerContainer>
    </OuterContainer>
  );
}
