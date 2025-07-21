import { px } from '@/utils/scale';
import Svg, { Path } from 'react-native-svg';

export default function ArrowIcon({
  width = px(46),
  height = px(46),
  color = 'white',
  direction = 'right',
}: {
  width?: number;
  height?: number;
  color?: string;
  direction?: 'right' | 'left';
}) {

  const rotation = direction === 'left' ? '180deg' : '0deg';

  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 46 47"
      fill="none"
      style={{ transform: [{ rotate: rotation }] }}
    >
      <Path
        d="M18 33.5L27.5105 23.9895C27.7808 23.7192 27.7808 23.2808 27.5105 23.0105L18 13.5"
        stroke={color}
        strokeWidth={2.07692}
        strokeLinecap="round"
      />
    </Svg>
  );
}
