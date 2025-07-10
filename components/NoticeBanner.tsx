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

const Container = styled.View<{ backgroundColor: string }>(({ backgroundColor, theme }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingVertical: 28,
  paddingHorizontal: 30,
  backgroundColor,
  borderBottomWidth: 1,
  borderBottomColor: theme.colors.gray[200],
}));


const NoticeText = styled.Text<{ textColor: string }>(({ theme, textColor }) => {
  return {
    fontSize: theme.typography.subtitle1.fontSize,
    lineHeight: theme.typography.subtitle1.lineHeight,
    fontFamily: theme.typography.subtitle1.fontFamily,
    color: textColor,
    flexShrink: 1,
  };
});
const DateText = styled.Text(({ theme }) => ({
  fontSize: px(20),
  fontFamily: 'Pretendard-Regular',
  fontWeight:600,
  lineHeight: px(28),
  color: theme.colors.gray[400],
}));
const NewText = styled.Text({
  color: 'red',
  fontSize: px(17),
  fontWeight: 'bold',
  marginRight: px(5)
});

export default function NoticeBanner({
  text,
  onPressArrow,
  backgroundColor,
  textColor,
  date,
}: NoticeBannerProps) {
  return (
    <Container backgroundColor={backgroundColor}>
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <NoticeText textColor={textColor}>
            {text}
          </NoticeText>
        </View>
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
