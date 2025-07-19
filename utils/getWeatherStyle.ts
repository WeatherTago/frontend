import { Theme } from '@emotion/react';

export function getWeatherStyle(level: string, theme: Theme) {
  switch (level) {
    case '맑음':
      return {
        textColor: theme.colors.secondary.pink,
        backgroundColor: '#FDE7F2',
        topText: '지하철 타고 나들이가기 딱 좋은 날씨예요',
        image:require('@/assets/images/weather/sun.png'),
        image2:require('@/assets/images/weather/bigSunny.png'),
        iconText: undefined,
      };
    case '구름많음':
      return {
        textColor: theme.colors.primary[500],
        backgroundColor: theme.colors.primary[100],
        topText: '하늘에 구름이 많이 낀 날씨예요',
        image:require('@/assets/images/weather/cloud.png'),
        image2:require('@/assets/images/weather/bigCloudy.png'),
        iconText: undefined,
      };
    case '흐림':
      return {
        textColor: theme.colors.primary[800],
        backgroundColor: theme.colors.primary[100],
        topText: '전반적으로 흐리고 어두운 날씨예요',
        image:require('@/assets/images/weather/cloudy.png'),
        image2:require('@/assets/images/weather/bigCloud.png'),
        iconText: undefined,
      };
    case '비':
      return {
        textColor: theme.colors.secondary.blue,
        backgroundColor: '#D9F2FE',
        topText: '비가 오는 날씨! 우산을 꼭 챙기세요',
        image:require('@/assets/images/weather/rain.png'),
        image2:require('@/assets/images/weather/bigRainy.png'),
        iconText: undefined,
      };
    case '눈비':
      return {
        textColor: theme.colors.secondary.purple,
        backgroundColor: '#ECEDFF',
        topText: '눈과 비가 섞여 내려 길이 미끄러울 수 있어요',
        image:require('@/assets/images/weather/snowrain.png'),
        image2:require('@/assets/images/weather/bigSnowrain.png'),
        iconText: undefined,
      };
    case '눈':
      return {
        textColor: theme.colors.secondary.blue,
        backgroundColor: '#D9F2FE',
        topText: '눈이 내리는 날씨! 보행 시 주의하세요',
        image:require('@/assets/images/weather/snow.png'),
        image2:require('@/assets/images/weather/bigSnowy.png'),
        iconText: undefined,
      };
    default:
      return {
        textColor: theme.colors.gray[400],
        backgroundColor: theme.colors.gray[100],
        topText: '혼잡도 정보 없음',
        image:require('@/assets/images/empty/subway-question-main.png'),
        image2:require('@/assets/images/empty/subway-question-main.png'),
        iconText: undefined,
      };
  }
}
