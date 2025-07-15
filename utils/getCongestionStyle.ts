import { Theme } from '@emotion/react';

export function getCongestionStyle(level: string, theme: Theme) {
  switch (level) {
    case '여유':
      return {
        textColor: theme.colors.primary[500],
        backgroundColor: theme.colors.primary[100],
        topText: '승객 대부분이 착석해서 갈 수 있어요',
        image:require('@/assets/images/Multiply.png')
      };
    case '보통':
      return {
        textColor: theme.colors.primary[800],
        backgroundColor: theme.colors.primary[100],
        topText: '승객들이 여유롭게 이동할 수 있어요',
        image:require('@/assets/images/Multiply.png')
      };
    case '주의':
      return {
        textColor: theme.colors.secondary.blue,
        backgroundColor: '#D9F2FE',
        topText: '이동할 때 다른 승객들과 부딪힐 수 있어요',
        image:require('@/assets/images/Multiply.png')
      };
    case '혼잡':
      return {
        textColor: theme.colors.secondary.pink,
        backgroundColor: '#FDE7F2',
        topText: '승객이 많아 지하철에서 이동할 수 없어요',
        image:require('@/assets/images/user.png')
      };
    default:
      return {
        textColor: theme.colors.gray[400],
        backgroundColor: theme.colors.gray[100],
        topText: '혼잡도 정보 없음',
        image:require('@/assets/images/Multiply.png')
      };
  }
}
 