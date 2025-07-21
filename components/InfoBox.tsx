import { hp, px, wp } from '@/utils/scale';
import { useTheme } from '@emotion/react';
import { Image, StyleSheet, Text, View } from 'react-native';

interface InfoBoxProps {
  specialColor: string;
  backgroundColor: string;
  topText: string;
  image?:any;
  iconText?: string | number;
  rate: string;
  time: string;
}

export default function InfoBox({
  specialColor,
  backgroundColor,
  topText,
  image,
  iconText,
  rate,
  time
}: InfoBoxProps) {
  const theme=useTheme();
  return (
    <View style={[styles.outerbox, {backgroundColor:theme.colors.gray[0]}]}>
      <View style={[styles.topBox, { borderColor: specialColor, backgroundColor }]}>
        <Text style={[styles.topText, { color: specialColor }]}>{topText}</Text>
      </View>
      <View style={styles.bottomBox}>
       {image ? (
        <Image source={image} style={styles.image} resizeMode="contain" />
      ) : iconText !== undefined ? (
      <Text style={[styles.iconText, { color: theme.colors.gray[800] }]}>
        {iconText}<Text style={styles.degreeUnit}>℃</Text>
        </Text>
      ) : null}
        <View style={styles.lastBox}>
          <Text style={[styles.rate, { color: specialColor }]}>{rate}</Text>
          <Text style={[styles.time, {color:theme.colors.gray[400]}]}>{time}</Text>
        </View>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  outerbox: {
    paddingTop: hp(20),
    paddingBottom:hp(28),
    flexDirection: 'column',
    alignItems: 'center',
    alignSelf:'stretch',
    gap:px(6)
  },
  topBox: {
    paddingVertical: hp(4),
    paddingHorizontal: wp(10),
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: px(10),
    borderRadius: px(99),
    borderWidth: 1,
  },
  topText:{
    fontFamily:'Pretendard-SemiBold',
    fontSize:px(14),
    fontWeight:'600',
    lineHeight:px(20)
  },
  bottomBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: px(16),
  },
  number:{
    textAlign:'center',
    fontFamily:'Pretendard-SemiBold',
    fontSize:px(80),
    fontWeight:'600',
    lineHeight:px(96)
  },
  lastBox:{
    flexDirection:'column',
    alignItems:'center'
  },
  rate:{
    textAlign:'center',
    fontFamily:'Pretendard-SemiBold',
    fontSize:px(32),
    fontWeight:'600',
    lineHeight:px(44)
  },
  time:{
    fontFamily:'Pretendard-Regular',
    fontSize:px(20),
    fontWeight:'400',
  },
  image:{
    width:px(154),
    height:px(90),
  },
  iconText: {
  fontSize: px(68),
  fontWeight: '600',
  textAlign: 'center',
  lineHeight: px(81),
  fontFamily: 'Pretendard-SemiBold',
},
degreeUnit:{
  fontFamily:'Pretendard-SemiBold',
  fontSize:px(35),
  fontWeight:'600'
}
});
