import { theme } from '@/styles/theme';
import React from 'react';
import {
  GestureResponderEvent,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';

type LargeButtonProps = {
  text: string;
  backgroundColor?: string;
  fontColor?: string;
  typography?: {
    fontSize: number;
    fontWeight: string;
    lineHeight: number;
  };
  onPress?: (event: GestureResponderEvent) => void;
  style?: ViewStyle; // 스타일 덮어쓰기 가능
};

const LargeButton: React.FC<LargeButtonProps> = ({
  text,
  backgroundColor = theme.colors.primary[700],
  fontColor = theme.colors.gray[0],
  typography = theme.typography.body1,
  onPress,
  style,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor },
        style, // 외부 스타일 덮어쓰기 허용
      ]}
      activeOpacity={0.8}
      onPress={onPress}
    >
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
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 72,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
  },
});

export default LargeButton;
