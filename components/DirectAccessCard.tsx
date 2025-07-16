import MediumButton from '@/components/Button/MediumButton';
import { theme } from '@/styles/theme';
import { px, wp } from '@/utils/scale';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

interface DirectAccessCardProps {
  title: React.ReactNode;
  subText: string;
  buttonText: string;
  onPress: () => void;
  image:any;
}

export default function DirectAccessCard({
  title,
  subText,
  buttonText,
  onPress,
  image
}: DirectAccessCardProps) {

  return (
    <View style={styles.card}>
      <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'flex-start',alignSelf:'stretch',gap:px(10)}}>
      <View style={{flexDirection:'column',alignItems:'flex-start',gap:px(4)}}>
        <Text
        style={{
          fontSize: theme.typography.subtitle1.fontSize,
          lineHeight: theme.typography.subtitle1.lineHeight,
          fontWeight: theme.typography.subtitle1.fontWeight as any,
          fontFamily: theme.typography.subtitle1.fontFamily,
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
        }}
      >
        {subText}
      </Text>
      </View>
      
      <Image source={image} style={{ width: px(98), height: px(98) }} />
      </View>
      

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
    backgroundColor: theme.colors.gray[0],
    borderRadius: px(16),
    marginHorizontal:px(24),
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignSelf:'stretch',
    flexGrow: 1,
    flexShrink: 0,
    flexBasis: 0,
    gap:px(16)
  },
});
