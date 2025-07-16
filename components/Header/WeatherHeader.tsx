import { theme } from '@/styles/theme';
import { hp, px } from '@/utils/scale';
import { useTheme } from '@emotion/react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AlarmDot from '../Icons/AlarmDot';
import StarIcon from '../Icons/StarIcon';

export default function WeatherHeader({ showAlarmDot }: { showAlarmDot?: boolean }) {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const router = useRouter();

  return (
    <View style={styles.outerContainer}>
      <View style={styles.innerContainer}>
        <Text
          style={{
            fontSize: px(30),
            lineHeight: px(44),
            fontWeight: '800',
            fontFamily: theme.fonts.pretendard.extrabold,
            color: theme.colors.gray[300],
          }}
        >
          WEATHER
        </Text>
        <View style={styles.iconRow}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => {
              router.push('/favorite-modal');
            }}
          >
            <StarIcon />
          </TouchableOpacity>
          <View style={styles.bellWrapper}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => {
                router.push('../notice');
              }}
            >
              <Ionicons name="notifications" size={px(36)} color={theme.colors.gray[300]} />
            </TouchableOpacity>
            {showAlarmDot && (
              <View style={styles.alarmDotWrapper}>
                <AlarmDot />
              </View>
            )}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    backgroundColor: theme.colors.gray[50], 
    height: hp(74),
    flexDirection:'row',
    paddingHorizontal: px(14),
    justifyContent:'flex-end',
    alignItems:'center',
    alignSelf:'stretch'
  },
  innerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex:1
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    width: px(54),
    height: px(54),
    justifyContent: 'center',
    alignItems: 'center',
  },
  bellWrapper: {
    position: 'relative',
  },
  alarmDotWrapper: {
    position: 'absolute',
    top: px(9),
    right: px(9),
  },
});
