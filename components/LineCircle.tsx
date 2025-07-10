import { px } from '@/utils/scale';
import { useTheme } from '@emotion/react';
import React from 'react';
import { StyleSheet, Text, View, } from 'react-native';

interface LineCircleProps {
  lineNumber: string;        
  backgroundColor?: string;   
  isSelected?: boolean;     // 선택 여부
  showUnderline?: boolean;  // 밑줄 표시 여부 
}


export default function LineCircle({
  lineNumber,
  backgroundColor,
  isSelected = false,
  showUnderline = false,
}: LineCircleProps) {
  const theme=useTheme();
  const finalBackgroundColor = backgroundColor ?? theme.colors.gray[300];
  return (
    <View style={styles.wrapper}>
      <View style={[styles.container, { backgroundColor: finalBackgroundColor }]}>
        <Text style={[theme.typography.subtitle2, { color: theme.colors.gray[0] }]}>
          {lineNumber.replace('호선', '')}
        </Text>
      </View>
      {showUnderline && isSelected && (
        <View style={[styles.underline, { backgroundColor: theme.colors.primary[700] }]} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
  },
  container: {
    width: px(48),
    height: px(48),
    borderRadius: px(99),
    justifyContent: 'center',
    alignItems: 'center',
  },
  underline: {
    width: px(48),
    height: px(4),
    borderRadius: px(99),
    marginTop: px(14), //74-8(paddingTop)-48-4(밑줄)= 14
  },
});
