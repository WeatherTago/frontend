// utils/scale.ts
import { Dimensions } from 'react-native';

// 피그마 기준 해상도 (540 x 1200 기준)
const guidelineHeight = 1200;
const guidelineWidth = 540;

// 실제 디바이스 크기
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// 세로 기준 스케일
export const px = (size: number, factor = 1) =>
  (screenHeight / guidelineHeight) * size * factor;
