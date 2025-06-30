// utils/scale.ts
import { Dimensions } from 'react-native';

const guidelineWidth = 540;
const guidelineHeight = 1200;

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// 가로 기준 스케일
export const wp = (size: number, factor = 1) =>
  (screenWidth / guidelineWidth) * size * factor;

// 세로 기준 스케일
export const hp = (size: number, factor = 1) =>
  (screenHeight / guidelineHeight) * size * factor;

// 평균 스케일 (가로+세로 평균)
export const px = (size: number, factor = 1) => {
  const scaleWidth = screenWidth / guidelineWidth;
  const scaleHeight = screenHeight / guidelineHeight;
  const averageScale = (scaleWidth + scaleHeight) / 2;
  return size * averageScale * factor;
};
