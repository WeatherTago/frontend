import { theme } from '@/styles/theme';
import { px } from '@/utils/scale';
import React from 'react';
import {
  GestureResponderEvent,
  Image,
  ImageSourcePropType,
  ImageStyle,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

type Typography = {
  fontSize: number;
  fontWeight: TextStyle['fontWeight'];
  lineHeight: number;
};

type LargeButtonProps = {
  text: string;
  icon?: ImageSourcePropType;
  iconStyle?: ImageStyle;
  backgroundColor?: string;
  fontColor?: string;
  typography?: Typography;
  onPress?: (event: GestureResponderEvent) => void;
  style?: ViewStyle | ViewStyle[];
};

const LargeButton: React.FC<LargeButtonProps> = ({
  text,
  icon,
  iconStyle,
  backgroundColor = theme.colors.primary[700],
  fontColor = theme.colors.gray[0],
  typography = theme.typography.body1,
  onPress,
  style,
}) => {
  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor }, style]}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <View style={styles.content}>
        {icon && (
          <View style={styles.iconContainer}>
            <Image source={icon} style={[styles.icon, iconStyle]} resizeMode="contain" />
          </View>
        )}
        <Text
          style={[
            {
              color: fontColor,
              fontSize: typography.fontSize,
              fontWeight: typography.fontWeight,
              lineHeight: typography.lineHeight,
            } as TextStyle,
          ]}
        >
          {text}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: px(72),
    borderRadius: px(16),
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  content: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: px(6),
  },
  iconContainer: {
    width: px(34),
    height: px(34),
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: px(24),
    height: px(24),
  },
});

export default LargeButton;
