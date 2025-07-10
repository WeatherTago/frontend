/** @jsxImportSource @emotion/react */
import { px } from '@/utils/scale';
import styled from '@emotion/native';
import { TouchableOpacity, View } from 'react-native';
import ArrowIcon from './Icons/ArrowIcon';

interface NoticeBannerProps {
  text: string;
  showArrowButton?: boolean;
  onPressArrow?: () => void; // 🔹 화살표 버튼 클릭 이벤트
  backgroundColor: string;
  textColor: string;
  date?: string;
}

const Container = styled.View<{ backgroundColor: string }>`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 28px 12px 28px 30px;
  background-color: ${({ backgroundColor }) => backgroundColor};
`;

const NoticeText = styled.Text<{ textColor: string }>(({ theme, textColor }) => {
  return {
    fontSize: theme.typography.subtitle1.fontSize,
    lineHeight: theme.typography.subtitle1.lineHeight,
    fontFamily: theme.typography.subtitle1.fontFamily,
    color: textColor,
    flexShrink: 0,
  };
});
const DateText = styled.Text(({ theme }) => ({
  fontSize: px(20),
  fontFamily: 'Pretendard-Regular',
  fontWeight:600,
  lineHeight: px(28),
  color: theme.colors.gray[400],
}));

export default function NoticeBanner({
  text,
  onPressArrow,
  backgroundColor,
  textColor,
  date
}: NoticeBannerProps) {
  return (
    <Container backgroundColor={backgroundColor}>
      <View>
        <NoticeText textColor={textColor} numberOfLines={1}>
          {text}
        </NoticeText>
        {date && <DateText>{date}</DateText>}
     </View>

      {onPressArrow && (
        <TouchableOpacity onPress={onPressArrow}>
          <ArrowIcon width={px(46)} height={px(46)} color={textColor} />
        </TouchableOpacity>
      )}
    </Container>
  );
}
