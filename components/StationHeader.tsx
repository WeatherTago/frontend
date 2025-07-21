import LineCircle from '@/components/LineCircle';
import { hp, px, wp } from '@/utils/scale';
import { useTheme } from '@emotion/react';
import { StyleSheet, Text, View } from 'react-native';

interface StationHeaderProps {
  stationName: string;
  lines: string[];
  address: string;
  phoneNumber: string;
}

export default function StationHeader({ stationName, lines,address,phoneNumber }: StationHeaderProps) {
  const theme = useTheme();

  return (
    <>
      <View style={[styles.stationBox, { backgroundColor: theme.colors.gray[0] }]}>
        <View style={styles.centerStationWrapper}>
          <View style={[styles.TailBox, { backgroundColor: theme.colors.primary[800] }]} />
          <View style={[styles.centerStationBox, {
            backgroundColor: theme.colors.gray[0],
            borderColor: theme.colors.primary[800],
          }]}>
            <Text
              style={{
                color: theme.colors.gray[950],
                fontSize: theme.typography.subtitle1.fontSize,
                fontWeight: theme.typography.subtitle1.fontWeight,
                fontFamily: theme.typography.subtitle1.fontFamily,
                textAlign: 'center',
              }}
              numberOfLines={1}
              adjustsFontSizeToFit
              ellipsizeMode="tail"
            >
              {stationName}
            </Text>
          </View>
        </View>
      </View>

    <View style={styles.lineCircleWrapper}>

  <View style={styles.textBox}>
    <Text adjustsFontSizeToFit style={[styles.addressText, {color:theme.colors.gray[950]}]}>{address}</Text>
    <Text adjustsFontSizeToFit style={[styles.phoneText, {color:theme.colors.secondary['blue']}]}>{phoneNumber}</Text>
  </View>
  
    <View style={styles.lineItemWrapper}>
    {lines.map((lineName, index) => {
      const lineKey = `line${lineName.replace('호선', '')}`;
      const color = theme.colors.subway[lineKey as keyof typeof theme.colors.subway];
      return (
        <LineCircle
          key={index}
          lineNumber={lineName}
          backgroundColor={color}
          isSelected={false}
          showUnderline={false}
        />
      );
    })}
  </View>

  </View>

    </>
  );
}

const styles = StyleSheet.create({
  stationBox: {
    height: hp(98),
    paddingHorizontal: wp(24),
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  centerStationWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  TailBox: {
    position: 'absolute',
    top: '50%',
    transform: [{ translateY: -hp(20) }],
    width: '100%',
    height: hp(40),
    borderRadius: px(999),
    zIndex: 0,
  },
  centerStationBox: {
    width: wp(262),
    height: hp(60),
    paddingHorizontal: wp(24),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 999,
    borderWidth: px(8),
    shadowColor: 'rgba(0, 0, 0, 0.05)',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 4,
  },
  lineCircleWrapper: {
    minHeight: hp(72),
    paddingVertical: hp(10),
    paddingHorizontal: wp(24),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'space-between',
    alignSelf: 'stretch',
    gap: px(8),
    backgroundColor:'#FFF',
    flexWrap:'wrap'
  },
  lineItemWrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap:px(10),
  },
  textBox: {
    flexDirection: 'column',
  },
  addressText: {
    fontSize: px(20),
    fontFamily:'Pretendard-Regular',
    fontWeight:'400',
    lineHeight:px(26),
  },
  phoneText: {
    fontSize:px(16),
    fontFamily:'Pretendard-Regular',
    fontWeight:'500',
    lineHeight:px(24),
  },
});
