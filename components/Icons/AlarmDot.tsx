import { px } from '@/utils/scale';
import Svg, { Circle } from 'react-native-svg';

export default function AlarmDot({ size = px(8), color = '#00C4B8' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 8 8" fill="none">
      <Circle cx="4" cy="4" r="4" fill={color} />
    </Svg>
  );
}
