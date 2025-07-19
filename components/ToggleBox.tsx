import { hp, px, wp } from '@/utils/scale';
import { useTheme } from '@emotion/react';
import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Option = '오늘' | '내일' | '모레';

interface Props {
  text: string;
  defaultSelected?: Option;
  selected?: Option;
  onSelect?: (value: Option) => void;
}

export default function ToggleBox({
  text,
  defaultSelected = '오늘',
  selected: controlledSelected,
  onSelect,
}: Props) {
  const options: Option[] = ['오늘', '내일', '모레'];
  const theme = useTheme();

  // 내부 상태는 only uncontrolled일 때만 사용
  const [uncontrolledSelected, setUncontrolledSelected] = useState<Option>(defaultSelected);

  const selected = controlledSelected ?? uncontrolledSelected;

  const handlePress = (option: Option) => {
    if (!controlledSelected) {
      setUncontrolledSelected(option); // only if not controlled
    }
    onSelect?.(option);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.gray[0] }]}>
      <Text style={styles.title}>{text}</Text>
      <View style={styles.buttonRow}>
        {options.map((option) => {
          const isSelected = selected === option;
          return (
            <TouchableOpacity
              key={option}
              style={[
                styles.button,
                {
                  backgroundColor: isSelected
                    ? theme.colors.primary[700]
                    : theme.colors.gray[100],
                },
              ]}
              onPress={() => handlePress(option)}
            >
              <View style={styles.contentRow}>
                {isSelected && (
                  <MaterialIcons
                    name="check"
                    size={px(20)}
                    color={theme.colors.gray[0]}
                    style={{ marginRight: px(8) }}
                  />
                )}
                <Text
                  style={{
                    color: isSelected ? theme.colors.gray[0] : theme.colors.gray[700],
                    fontSize: px(18),
                    fontFamily: 'Pretendard-SemiBold',
                    fontWeight: '600',
                    lineHeight: px(18),
                  }}
                >
                  {option}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: wp(24),
    paddingVertical: hp(30),
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'stretch',
    marginTop: px(4),
    flexDirection:'row'
  },
  title: {
    fontFamily: 'Pretendard-Semibold',
    fontWeight: '600',
    fontSize: px(22),
    lineHeight: px(34),
    marginBottom: hp(12),
  },
  buttonRow: {
    flexDirection: 'row',
    gap:px(8)
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: px(8),
    padding: px(8),
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
