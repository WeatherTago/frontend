// theme.ts
import { px } from '@/utils/scale'; // 반응형 px 함수 불러오기
import { TextStyle } from 'react-native';

export const theme = {
  colors: {
    primary: {
      100: '#D8FAF6',
      200: '#BEF6EF',
      300: '#A5EEE6',
      400: '#8AE3D9',
      500: '#64D3C8',
      700: '#00C4B8', // main
      800: '#00B8AD',
      900: '#007A71',
      950: '#004440',
    },
    gray: {
      0: '#FFFFFF',
      50: '#FAFAFA',
      100: '#F5F5F5',
      200: '#E5E5E5',
      300: '#D4D4D4',
      400: '#A3A3A3',
      500: '#737373',
      600: '#525252',
      700: '#404040',
      800: '#262626',
      900: '#171717',
      950: '#0A0A0A',
    },
    subway: {
      line1: '#60A5FA',
      line2: '#6EE7B7',
      line3: '#FDBA74',
      line4: '#67E8F9',
      line5: '#C4B5FD',
      line6: '#FCA5A5',
      line7: '#A3E635',
      line8: '#F9A8D4',
      line9: '#FDE047',
    },
    secondary: {
      blue: '#02AAF8',
      purple: '#8089FF',
    },
    text: '#0A0A0A',
  },

  spacing: {
    sm: 8,
    md: 16,
    lg: 24,
  },

  fonts: {
    pretendard: {
      extrabold: 'Pretendard-ExtraBold',
      bold: 'Pretendard-Bold',
      semibold: 'Pretendard-SemiBold',
      medium: 'Pretendard-Medium',
      regular: 'Pretendard-Regular',
    },
    spaceMono: {
      regular: 'SpaceMono-Regular',
    },
  },

  typography: {
    header1: {
      fontSize: px(32),
      lineHeight: px(44),
      fontWeight: '600' as TextStyle['fontWeight'],
      fontFamily: 'Pretendard-SemiBold',
    },
    subtitle1: {
      fontSize: px(24),
      lineHeight: px(34),
      fontWeight: '600' as TextStyle['fontWeight'],
      fontFamily: 'Pretendard-SemiBold',
    },
    subtitle2: {
      fontSize: px(20),
      lineHeight: px(28),
      fontWeight: '600' as TextStyle['fontWeight'],
      fontFamily: 'Pretendard-SemiBold',
    },
    body1: {
      fontSize: px(18),
      lineHeight: px(26),
      fontWeight: '500' as TextStyle['fontWeight'],
      fontFamily: 'Pretendard-Medium',
    },
    body2: {
      fontSize: px(16),
      lineHeight: px(24),
      fontWeight: '500' as TextStyle['fontWeight'],
      fontFamily: 'Pretendard-Medium',
    },
    caption: {
      fontSize: px(14),
      lineHeight: px(20),
      fontWeight: '400' as TextStyle['fontWeight'],
      fontFamily: 'Pretendard-Regular',
    },
    footnote: {
      fontSize: px(12),
      lineHeight: px(18),
      fontWeight: '400' as TextStyle['fontWeight'],
      fontFamily: 'Pretendard-Regular',
    },
  },
};
