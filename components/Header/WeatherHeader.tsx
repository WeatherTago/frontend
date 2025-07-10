/** @jsxImportSource @emotion/react */
import { px } from '@/utils/scale';
import styled from '@emotion/native';
import { useTheme } from '@emotion/react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Text, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AlarmDot from '../Icons/AlarmDot';
import StarIcon from '../Icons/StarIcon';

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

export default function WeatherHeader({ showAlarmDot }: { showAlarmDot?: boolean }) {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const router= useRouter();

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
          {/* ⭐ 별 아이콘 - 즐겨찾기 모달 */}
        <IconRow>
          <IconButton
            onPress={() => {
              router.push('/favorite-modal')
            }}
          >
            <StarIcon/>
          </IconButton>
            {/* 🔔 알림 아이콘 - 공지 모달 */}
          <BellWrapper>
            <IconButton
              onPress={() => {
                router.push('../notice')
              }}
            >
              <Ionicons
                name="notifications"
                size={px(36)}
                color={theme.colors.gray[300]}
              />
            </IconButton>
            <AlarmDotWrapper>
              {showAlarmDot && (
                <AlarmDot />
              )}
            </AlarmDotWrapper>
          </BellWrapper>
        </IconRow>
      </InnerContainer>
    </OuterContainer>
  );
}
