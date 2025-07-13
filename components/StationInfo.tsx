import stationInfoImage from '@/assets/images/stationInfo.png';
import { hp, px, wp } from '@/utils/scale';
import { useTheme } from '@emotion/react';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

export default function StationInfo() {
  const theme=useTheme();
  const congestionDescription = 
`• 웨더타고의 혼잡도는 서울 지하철 교통 이용 데이터를 기반으로 측정된 값이에요.\n\
• 웨더타고의 지하철 혼잡도 기준은 과거의 열차 승하차 인원 데이터를 기반으로 시간별, 노선별 평균 혼잡 패턴을 학습한 뒤 어쩌고 어쩌고 해서 계산된 값이에요.\n\
• 웨더타고는 기상청의 실시간 날씨 정보와 요일·시간·달력 정보를 결합하여, 특정 조건에서 승객 수가 얼마나 증가하거나 감소할지를 통계적으로 분석했어요.\n\
• 머신러닝 알고리즘을 활용해 다양한 변수 간의 상관관계를 학습했으며, 이를 통해 실시간으로 혼잡도를 예측했어요.\n\
• 머신러닝 알고리즘을 활용해 다양한 변수 간의 상관관계를 학습했으며, 이를 통해 실시간으로 혼잡도를 예측했어요.\n\
• 머신러닝 알고리즘을 활용해 다양한 변수 간의 상관관계를 학습했으며, 이를 통해 실시간으로 혼잡도를 예측했어요.\n\
• 웨더타고의 혼잡도는 서울 지하철 교통 이용 데이터를 기반으로 측정된 값이에요.`;

  return (
    <View style={{flexDirection:'column', backgroundColor:theme.colors.gray[0]}}>
      <View style={styles.titleBox}>
        <Text style={[styles.title,{color:theme.colors.gray[700]}]}>지하철 혼잡도 분석</Text>
        <View style={[styles.tooltip, {borderColor:theme.colors.gray[400]}]}>
          <Text style={[styles.tooltipText, {color:theme.colors.gray[400]}]}>i</Text>
        </View>
      </View>
      <View style={styles.stationBox}>
        <Image source={stationInfoImage} style={styles.image} resizeMode="contain" />
      </View>
      <View style={styles.textBox}>
        <Text style={[styles.text,{color:theme.colors.gray[500]}]}>
          {congestionDescription}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  titleBox: {
    flexDirection: 'row', 
    paddingVertical: hp(30),
    paddingHorizontal: wp(24),
    alignItems: 'center',
    gap: px(8), 
    alignSelf: 'stretch',
  },
  title: {
    fontFamily:'Pretendard-SemiBold',
    fontSize: px(18),
    fontWeight:'600',
    lineHeight:px(34)
  },
  tooltip:{
    width: px(16),
    height: px(16),
    paddingHorizontal: px(5.333),
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    gap: px(6.667), 
    borderRadius: px(66),
    borderWidth: px(1),
  },
  tooltipText:{
    fontFamily: 'Pretendard-SemiBold',
    fontSize: px(12),
    fontWeight: '600', 
    lineHeight: px(14), 
    },
  stationBox:{
    paddingHorizontal:px(34),
    paddingVertical:px(4),
    flexDirection: 'column',
    alignItems: 'flex-start',
    alignSelf: 'stretch',
  },
  image:{
    height:px(88),
    width:px(472),
    flexShrink:0,
    alignSelf:'stretch'
  },
  textBox:{
    paddingTop: hp(10),
    paddingBottom:hp(30),
    paddingHorizontal:wp(24),
    flexDirection: 'column',
    alignItems: 'flex-start',
    flexShrink: 0,
    alignSelf: 'stretch',
  },
  text:{
    flexGrow: 1,     
    flexShrink: 0,
    flexBasis: 0,
    fontFamily: 'Pretendard-Medium',
    fontSize: px(13),
    fontStyle: 'normal',
    fontWeight: '500',
    lineHeight: px(22),
  }
});
