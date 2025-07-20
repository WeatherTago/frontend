import { theme } from '@/styles/theme';

export const getLineColor = (line: string) => {
  switch (line) {
    case '1호선':
      return theme.colors.subway.line1;
    case '2호선':
      return theme.colors.subway.line2;
    case '3호선':
      return theme.colors.subway.line3;
    case '4호선':
      return theme.colors.subway.line4;
    case '5호선':
      return theme.colors.subway.line5;
    case '6호선':
      return theme.colors.subway.line6;
    case '7호선':
      return theme.colors.subway.line7;
    case '8호선':
      return theme.colors.subway.line8;
    default:
      return theme.colors.gray[400];
  }
};

export const getFavoriteBackgroundColor = (line: string) => {
  switch (line) {
    case '1호선':
      return '#EFF6FE';
    case '2호선':
      return '#F0FDF8';
    case '3호선':
      return '#FFF8F1';
    case '4호선':
      return '#F0FDFE';
    case '5호선':
      return '#F9F8FF';
    case '6호선':
      return '#FFF6F6';
    case '7호선':
      return '#F6FCEB';
    case '8호선':
      return '#FEF6FB';
    default:
      return theme.colors.gray[50];
  }
};
