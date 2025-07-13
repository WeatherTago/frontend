import MediumButton from '@/components/Button/MediumButton';
import { hp, px, wp } from '@/utils/scale';
import { useTheme } from '@emotion/react';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface DirectAccessCardProps {
  title: React.ReactNode;
  subText: string;
  buttonText: string;
  onPress: () => void;
}

export default function DirectAccessCard({
  title,
  subText,
  buttonText,
  onPress,
}: DirectAccessCardProps) {
  const theme = useTheme();

  return (
    <View style={styles.card}>
      <Text
        style={{
          fontSize: theme.typography.subtitle1.fontSize,
          lineHeight: theme.typography.subtitle1.lineHeight,
          fontWeight: theme.typography.subtitle1.fontWeight as any,
          fontFamily: theme.typography.subtitle1.fontFamily,
          marginBottom: hp(8),
          color: theme.colors.gray[900],
        }}
      >
        {title}
      </Text>

      <Text
        style={{
          fontSize: theme.typography.body1.fontSize,
          lineHeight: theme.typography.body1.lineHeight,
          fontWeight: theme.typography.body1.fontWeight as any,
          fontFamily: theme.typography.body1.fontFamily,
          color: theme.colors.gray[400],
          marginBottom: hp(16),
        }}
      >
        {subText}
      </Text>

      <MediumButton
        label={buttonText}
        onPress={onPress}
        backgroundColor={theme.colors.primary[700]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: wp(26),
    backgroundColor: '#fff',
    borderRadius: px(16),
    marginHorizontal:px(24),
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
});
