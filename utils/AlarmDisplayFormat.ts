import { Alarm, AlarmPeriodType } from '@/types/alarm';

export function formatAlarmDisplay(alarm: Alarm): string {
  const periodLabel = getPeriodLabel(alarm.alarmPeriod);
  const alarmTimeLabel = formatTimeToKorean(alarm.alarmTime);
  const dayLabel = alarm.alarmDay === 'TODAY' ? '당일' : '전날';
  const referenceTimeLabel = formatTimeToKorean(alarm.referenceTime);

  return `${periodLabel} ${referenceTimeLabel} | ${dayLabel} ${alarmTimeLabel} 알림`;
}

// 요일/주기 한글 변환
function getPeriodLabel(period: AlarmPeriodType): string {
  switch (period) {
    case 'EVERYDAY':
      return '매일';
    case 'MONDAY':
      return '월요일';
    case 'TUESDAY':
      return '화요일';
    case 'WEDNESDAY':
      return '수요일';
    case 'THURSDAY':
      return '목요일';
    case 'FRIDAY':
      return '금요일';
    case 'SATURDAY':
      return '토요일';
    case 'SUNDAY':
      return '일요일';
    default:
      return '';
  }
}

// 24시간 -> 오전/오후 12시간제 변환
function formatTimeToKorean(time: string): string {
  const [hourStr, minuteStr] = time.split(':');
  const hour = parseInt(hourStr, 10);
  const minute = parseInt(minuteStr, 10);

  const period = hour < 12 ? '오전' : '오후';
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;

  return `${period} ${displayHour}:${minuteStr}`;
}
