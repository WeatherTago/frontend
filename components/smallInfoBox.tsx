import { hp, px } from '@/utils/scale';
import { useTheme } from '@emotion/react';
import { Image, ImageSourcePropType, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface SmallInfoBoxProps {
  time: string;
  image: ImageSourcePropType;
  text1: string ;
  text2?: string | number; 
  textColor: string;
}

export default function SmallInfoBox({ time, image, text1, text2, textColor }: SmallInfoBoxProps) {
  const theme = useTheme();

  return (
    <TouchableOpacity style={styles.box}>
      <Text style={[styles.timeText, {color:theme.colors.gray[800]}]}>{time}</Text>
      <View style={[styles.outerBox, {backgroundColor:theme.colors.gray[50]}]}>
        <View style={styles.image}>
           <Image
            source={image}
            style={styles.imageStyle}
            resizeMode="contain"
          />
        </View>
        <View style={styles.innerBox}>
          <Text style={[styles.text, { color: textColor }]}>{text1}</Text>
          <Text style={[styles.text, { color: textColor }]}>{text2}</Text>
        </View>
      </View>
    </TouchableOpacity>
    
  );
}
const styles = StyleSheet.create({
  outerBox: {
    height: hp(167),
    paddingVertical: px(16),
    paddingHorizontal: px(14),
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'stretch',
    borderRadius: px(12),
  },
  timeText:{
    alignSelf:'stretch',
    textAlign:'center',
    fontFamily:'Pretendard-SemiBold',
    fontSize:px(18),
    fontWeight:'500',
    lineHeight:px(20)
  },
  image:{
    width:px(78),
    height:px(78),
    flexShrink:0
  },
  innerBox:{
    alignItems:'center',
    flexDirection:'column'
  },
  text:{
    textAlign:'center',
    fontFamily:'Pretendard-SemiBold',
    fontSize:px(18),
    fontWeight:'600',
    lineHeight:px(20)
  },
  box:{
    backgroundColor:'#FFF',
    width:px(106),
    flexDirection:'column',
    alignItems:'center',
    gap:px(12)
  },
  imageStyle: {
    width: '100%',
    height: px(78),
  },
});
