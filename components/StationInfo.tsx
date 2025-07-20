import stationInfoImage from '@/assets/images/subway/station-info.png';
import { theme } from '@/styles/theme';
import { hp, px, wp } from '@/utils/scale';
import { useTheme } from '@emotion/react';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

export default function StationInfo() {
  const theme=useTheme();
  const congestionIntroText = `웨더타고의 지하철 혼잡도는 단순히 사람이 많고 적은 걸로 정해지는 게 아니에요.
AI가 실시간 데이터를 분석해서, 지금 이 시간에 얼마나 붐빌지를 예측한 결과예요.`;
  const congestionDescription = [
  {
    key: '1',
    title: '① AI가 실시간으로 예측해요',
    content: `서울 지하철 데이터를 바탕으로 학습한 AI 모델(XGBoost)이
시간, 날씨, 노선, 방향 같은 다양한 정보를 종합해서
지금 이 순간의 예상 승객 수를 정밀하게 계산해요.
단순 수치가 아니라, 과거 패턴을 학습한 결과라 더 믿을 만해요.`,
  },
  {
    key: '2',
    title: '② 혼잡도는 이렇게 나눠요',
    content: `예측된 승객 수를 가지고 전체 데이터를 네 구간으로 나눠서,
비슷한 상황에서 사람들이 얼마나 타는지를 기준으로 정해요.

예를 들면 이런 식이에요.
여유: 전체 중 가장 한산한 구간 (예: 80명 이하)
보통: 살짝 붐비기 시작하는 구간 (예: 81~160명)
주의: 꽤 많은 사람들이 타는 구간 (예: 161~240명)
혼잡: 가장 붐비는 구간, 사람으로 가득 찬 상황 (예: 241명 이상)

※ 위 숫자는 예시예요. 실제 기준은 시간대나 노선, 요일에 따라 달라질 수 있어요.`,
  },
  {
    key: '3',
    title: '③ 왜 이렇게 나누냐고요?',
    content: `‘몇 명 이상이면 혼잡’처럼 고정된 기준으로 보면, 시간대나 장소별 상황을 놓칠 수 있어요.
예를 들어, 평일 아침 200명은 ‘보통’일 수 있지만, 한산한 역에서는 100명만 타도 ‘혼잡’일 수 있거든요.
그래서 웨더타고는 다른 사용자들과 비교한 상대적인 혼잡도를 알려드려요.`,
  },
  {
    key: '4',
    title: '④ 믿을 수 있는 기준인가요?',
    content: `물론이죠! 혼잡도 기준은 계속 쌓이는 데이터를 바탕으로 자동으로 조정돼요.
날씨, 요일, 이벤트 같은 변수들도 반영해서, 실제 상황에 더 가까운 예측이 가능해요.`,
  },
];

  return (
    <View style={{flexDirection:'column', backgroundColor:theme.colors.gray[0]}}>
      <View style={styles.titleBox}>
        <Text style={[styles.title,{color:theme.colors.gray[700]}]}>지하철 혼잡도 분석</Text>
      </View>
      <View style={styles.stationBox}>
        <Image source={stationInfoImage} style={styles.image} resizeMode="contain" />
      </View>
      <View style={styles.textBox}>
        <Text style={styles.text}>
          {congestionIntroText}
        </Text>
        {congestionDescription.map(({ key, title, content }) => (
        <View key={key} style={{ marginBottom: px(5), alignSelf: 'stretch' }}>
          <Text style={styles.boldText}>{title}</Text>
          <Text style={styles.text}>{content}</Text>
        </View>
      ))}
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
  stationBox:{
    paddingHorizontal:px(34),
    paddingVertical:px(10),
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent:'center',
    alignSelf: 'stretch',
    gap:px(10)
  },
  image:{
  height:px(150),
  resizeMode:'contain'
  },
  textBox:{
    paddingTop: hp(10),
    paddingBottom:hp(30),
    paddingHorizontal:wp(24),
    flexDirection: 'column',
    alignItems: 'center',
    alignSelf: 'stretch',
    gap:px(10)
  },
  text:{
    fontFamily: 'Pretendard-Medium',
    color:theme.colors.gray[500],
    fontSize: px(14),
    fontWeight: '500',
    lineHeight: px(22),
    alignSelf:'stretch'
  },
  boldText:{
    fontFamily: 'Pretendard-Medium',
    color:theme.colors.gray[500],
    fontSize: px(14),
    fontWeight: '700',
    lineHeight: px(34),
  }
});
