import { hp, px, wp } from '@/utils/scale';
import { useTheme } from '@emotion/react';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native';

interface MediumButtonProps {
  label: string;
  backgroundColor?: string;
  onPress: () => void;
  style?: ViewStyle;
}

export default function MediumButton({
  label,
  backgroundColor,
  onPress,
  style,
}: MediumButtonProps) {
  const theme = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: backgroundColor ?? theme.colors.primary[700] },
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text
        style={{
          fontSize: theme.typography.subtitle1.fontSize,
          fontWeight: theme.typography.subtitle1.fontWeight as any,
          fontFamily: theme.fonts.pretendard.regular,
          lineHeight: theme.typography.subtitle1.lineHeight,
          color: '#fff',
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: wp(440),
    height: hp(72),
    borderRadius: px(16),
    justifyContent: 'center',
    alignItems: 'center',
  },
});
