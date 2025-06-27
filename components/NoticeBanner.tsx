/** @jsxImportSource @emotion/react */
import styled from '@emotion/native';
import { TouchableOpacity } from 'react-native';
import ArrowRightIcon from './icons/ArrowRight';

interface NoticeBannerProps {
  text: string;
  showArrowButton?: boolean;
  onPressArrow?: () => void; // 🔹 화살표 버튼 클릭 이벤트
  backgroundColor: string;
  textColor: string;
}

const Container = styled.View<{ backgroundColor: string }>`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 28px 12px 28px 30px;
  background-color: ${({ backgroundColor }) => backgroundColor};
`;

const NoticeText = styled.Text<{ textColor: string }>`
  font-size: 20px;
  font-family: Pretendard-Regular;
  color: ${({ textColor }) => textColor};
  flex-shrink: 1;
  flex: 1;
`;

export default function NoticeBanner({
  text,
  onPressArrow,
  backgroundColor,
  textColor,
}: NoticeBannerProps) {
  return (
    <Container backgroundColor={backgroundColor}>
      <NoticeText textColor={textColor} numberOfLines={1}>
        {text}
      </NoticeText>

      {onPressArrow && (
        <TouchableOpacity onPress={onPressArrow}>
          <ArrowRightIcon width={46} height={46} color={textColor} />
        </TouchableOpacity>
      )}
    </Container>
  );
}
