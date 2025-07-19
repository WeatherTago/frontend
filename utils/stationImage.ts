// utils/stationImage.ts 등 별도 파일로 분리 가능
export const getLineImage = (lineName: string) => {
  switch (lineName) {
    case '1호선':
      return require('@/assets/images/subway/subway-circle-line1.png');
    case '2호선':
      return require('@/assets/images/subway/subway-circle-line2.png');
    case '3호선':
      return require('@/assets/images/subway/subway-circle-line3.png');
    case '4호선':
      return require('@/assets/images/subway/subway-circle-line4.png');
    case '5호선':
      return require('@/assets/images/subway/subway-circle-line5.png');
    case '6호선':
      return require('@/assets/images/subway/subway-circle-line6.png');
    case '7호선':
      return require('@/assets/images/subway/subway-circle-line7.png');
    case '8호선':
      return require('@/assets/images/subway/subway-circle-line8.png');
    default:
      return require('@/assets/images/subway/subway-circle-line1.png'); // 기본 이미지
  }
};

export const getFavoriteLineImage = (lineName: string) => {
  switch (lineName) {
    case '1호선':
      return require('@/assets/images/subway/favorite-card-line1.png');
    case '2호선':
      return require('@/assets/images/subway/favorite-card-line2.png');
    case '3호선':
      return require('@/assets/images/subway/favorite-card-line3.png');
    case '4호선':
      return require('@/assets/images/subway/favorite-card-line4.png');
    case '5호선':
      return require('@/assets/images/subway/favorite-card-line5.png');
    case '6호선':
      return require('@/assets/images/subway/favorite-card-line6.png');
    case '7호선':
      return require('@/assets/images/subway/favorite-card-line7.png');
    case '8호선':
      return require('@/assets/images/subway/favorite-card-line8.png');
    default:
      return require('@/assets/images/subway/favorite-card-default.png'); // 기본 이미지
  }
};
