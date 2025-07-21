import { px } from '@/utils/scale';
import { useTheme } from '@emotion/react';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface LineCircleProps {
  lineNumber: string;
  backgroundColor?: string;
  isSelected?: boolean;
  showUnderline?: boolean;
  onPress?: () => void; 
}

export default function LineCircle({
  lineNumber,
  backgroundColor,
  isSelected = false,
  showUnderline = false,
  onPress,
}: LineCircleProps) {
  const theme = useTheme();
  const finalBackgroundColor = backgroundColor ?? theme.colors.gray[300];

  return (
    <TouchableOpacity style={styles.wrapper} onPress={onPress} activeOpacity={0.8}>
        <View style={[styles.container, { backgroundColor: finalBackgroundColor }]}>
          <Text style={[theme.typography.subtitle2, { color: theme.colors.gray[0] }]}>
            {lineNumber.replace('호선', '')}
          </Text>
        </View>
      {showUnderline && (
        <View
          style={[
            styles.underline,
            {
              backgroundColor: isSelected
                ? theme.colors.primary[700]
                : theme.colors.gray[0], // 기본은 흰색
            },
          ]}
        />
      )}
    </TouchableOpacity>
  );
}


const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'column',
    alignItems:'flex-start',
    justifyContent:'center',      
    gap:px(14)
  },
  container: {
    width: px(48),
    height: px(48),
    borderRadius: px(99),
    padding:px(10),
    flexDirection:'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  underline: {
    height: px(4),
    width: px(48),  
    borderRadius: px(99),
  },
});
