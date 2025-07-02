/** @jsxImportSource @emotion/react */
import styled from '@emotion/native';

import { px } from '@/utils/scale';
import { useTheme } from '@emotion/react';
import { Ionicons } from '@expo/vector-icons';
import { Text, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
<<<<<<< Updated upstream
import AlarmDot from '../Icons/AlarmDot';
import StarIcon from '../Icons/StarIcon';
=======
import AlarmDot from '../icons/AlarmDot';
import StarIcon from '../icons/starIcon';
>>>>>>> Stashed changes

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
  top: 9px;
  right: 9px;
`;

export default function WeatherHeader() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  return (
    <OuterContainer style={{ paddingTop: insets.top }}>
      <InnerContainer>
        <Text
          style={{
            fontSize: px(30),
            lineHeight: px(44),
            fontWeight: '800',
            fontFamily: theme.fonts.pretendard.extrabold,
            color: theme.colors.gray[300],
          }}
        >
          WEATHER
        </Text>

        <IconRow>
          <IconButton
            onPress={() => {
              /* 즐겨찾기 로직 */
            }}
          >
            <StarIcon/>
          </IconButton>

          <BellWrapper>
            <IconButton
              onPress={() => {
                /* 공지사항 로직 */
              }}
            >
              <Ionicons
                name="notifications"
                size={px(36)}
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
