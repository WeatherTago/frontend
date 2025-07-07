import { hp, px, wp } from '@/utils/scale';
import { useTheme } from '@emotion/react';
import React from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface SearchBarProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  onPressSearch: () => void;
  ButtonIcon?: any;
  buttonLabel: string;
}

export default function SearchBar({
  placeholder,
  value,
  onChangeText,
  onPressSearch,
  ButtonIcon,
  buttonLabel,
}: SearchBarProps) {
  const theme = useTheme();
  return (
    <View style={styles.container}>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          placeholderTextColor="#CFCFCF"
        />
      </View>
      <TouchableOpacity style={[styles.button, { backgroundColor: theme.colors.primary[800] }]} onPress={onPressSearch}>
        {ButtonIcon && <Image source={ButtonIcon} style={styles.buttonImage} resizeMode="contain" />}
        <Text style={styles.buttonText}>{buttonLabel}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: wp(540),
    height: hp(96),
    paddingVertical: hp(30),
    paddingHorizontal:wp(10),
    backgroundColor: '#FFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: px(10),
    shadowColor: 'rgba(0, 0, 0, 0.05)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 3,
    elevation: 2,
    flexShrink:0
  },
  inputWrapper: {
    flex: 1,
    height: hp(66),
    backgroundColor: '#FAFAFA',
    borderRadius: px(8),
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingHorizontal: px(22),
    paddingVertical:px(6)
  },
  input: {
    fontFamily: 'Pretendard-Medium',
    fontWeight: 500,
    fontSize: px(22),
    lineHeight: px(34),
    color: '#000',
  },
  button: {
    width: px(66),
    height: px(66),
    borderRadius: px(8),
    justifyContent: 'center',
    alignItems: 'center',
    padding: px(10),
  },
  buttonImage: {
    width: px(36),
    height: px(36),
  },
  buttonText: {
    fontFamily: 'Pretendard-SemiBold',
    fontWeight: 600,
    fontSize: px(12),
    lineHeight: px(18),
    color: '#FFF',
  },
});
