import ArrowIcon from '@/components/Icons/ArrowIcon';
import { theme } from '@/styles/theme';
import { hp, px } from '@/utils/scale';
import * as Font from 'expo-font';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface HeaderProps {
  title?: string;
  showLeft?: boolean;
  onPressLeft?: () => void;
  rightType?: 'text' | 'close';
  rightText?: string;
  onPressRight?: () => void;
}

export default function Header({
  title, //가운데 제목
  showLeft = true, //왼쪽 버튼 showLeft가 false이면 숨김
  onPressLeft,
  rightType, //rightType이 없으면 버튼 자체를 렌더링하지 않음
  rightText,
  onPressRight,
}: HeaderProps) {
  const [fontsLoaded] = Font.useFonts({
    'Pretendard-Medium': require('@/assets/fonts/Pretendard-Medium.otf'),
  });
  if (!fontsLoaded) return null;

  return (
    <View style={styles.container}>
      {showLeft && onPressLeft && (
        <TouchableOpacity onPress={onPressLeft} style={styles.leftButton}>
          <ArrowIcon color="#000" direction="left" />
        </TouchableOpacity>
      )}

      {title && <Text style={styles.title}>{title}</Text>}

      {rightType && (
        <TouchableOpacity onPress={onPressRight} style={styles.rightButton}>
          {rightType === 'close' ? (
            <Image
              source={require('@/assets/images/Multiply.png')}
              style={styles.rightImage}
              resizeMode="contain"
            />
          ) : rightType === 'text' && rightText ? (
            <Text style={styles.rightText}>{rightText}</Text>
          ) : null}
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: hp(74),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    backgroundColor: '#fff',
    paddingHorizontal: px(14),
    alignSelf: 'stretch',
    shadowColor: 'rgba(0, 0, 0, 0.05)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 3,
  },
  leftButton: {
    position: 'absolute',
    left: px(14),
    justifyContent: 'center',
    alignItems: 'center',
    width: px(36),
    height: px(36),
  },
  title: {
    fontSize: px(28),
    fontFamily: 'Pretendard-Medium',
    fontWeight: '500',
    lineHeight: px(34),
    textAlign: 'center',
  },
  rightButton: {
    position: 'absolute',
    right: px(25),
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightImage: {
    width: px(36),
    height: px(36),
  },
  rightText: {
    fontFamily: 'Pretendard-Regular',
    fontSize: px(24),
    fontWeight: '400',
    lineHeight: px(28),
    color: theme.colors.gray[950],
    paddingRight: px(3),
  },
});
