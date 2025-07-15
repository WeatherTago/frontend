import { Theme } from '@emotion/react';

export function getWeatherStyle(level: string, theme: Theme) {
  switch (level) {
    case '맑음':
      return {
        textColor: theme.colors.primary[500],
        backgroundColor: theme.colors.primary[100],
        topText: '지하철 타고 나들이가기 딱 좋은 날씨',
      };
    case '구름많음':
      return {
        textColor: theme.colors.primary[800],
        backgroundColor: theme.colors.primary[100],
        topText: '승객들이 여유롭게 이동할 수 있어요',
      };
    case '흐림':
      return {
        textColor: theme.colors.secondary.blue,
        backgroundColor: '#D9F2FE',
        topText: '전반적으로 흐리고 어두운 날씨예요',
      };
    case '비':
      return {
        textColor: theme.colors.secondary.pink,
        backgroundColor: '#FDE7F2',
        topText: '비가 오는 날씨예요. 우산을 챙기세요',
      };
    case '눈비':
      return {
        textColor: theme.colors.secondary.purple,
        backgroundColor: '#ECEDFF',
        topText: '눈과 비가 섞여 내려 길이 미끄러울 수 있어요',
      };
    case '눈':
      return {
        textColor: theme.colors.secondary.pink,
        backgroundColor: '#FDE7F2',
        topText: '눈이 내리는 날씨예요. 보행 시 주의하세요',
      };
    default:
      return {
        textColor: theme.colors.gray[400],
        backgroundColor: theme.colors.gray[100],
        topText: '혼잡도 정보 없음',
      };
  }
}
