export function formatKSTRoundedHour(date = new Date()) {
  // UTC 기준 시간값 추출
  const utc = date.getTime() + date.getTimezoneOffset() * 60 * 1000;

  // KST는 UTC+9
  const kstDate = new Date(utc + 9 * 60 * 60 * 1000);

  const pad = (n: number) => n.toString().padStart(2, '0');

  let year = kstDate.getFullYear();
  let month = kstDate.getMonth() + 1;
  let day = kstDate.getDate();
  let hour = kstDate.getHours();
  const minutes = kstDate.getMinutes();
  const seconds = kstDate.getSeconds();

  // ✅ 새벽 1시 ~ 4시 or 00:00:01 이상이면 → 05:00 고정
  if ((hour >= 1 && hour <= 4) || (hour === 0 && (minutes > 0 || seconds > 0))) {
    hour = 5;
  } else {
    // 일반적인 시간 반올림 처리
    if (minutes > 0) {
      hour += 1;
    }

    if (hour === 24) {
      hour = 0;
      kstDate.setDate(kstDate.getDate() + 1);
      year = kstDate.getFullYear();
      month = kstDate.getMonth() + 1;
      day = kstDate.getDate();
    }
  }

  return `${pad(month)}/${pad(day)} ${pad(hour)}:00 기준`;
}

// 혼잡도 API 파라미터용 KST 날짜/시간 ISO String 포맷 함수 (단일 함수)
export function getKSTCongestionDateTimeISOString(baseDate = new Date()): string {
  // 1. 현재 Date 객체를 KST 기준으로 변환 (정보 추출용)
  // getTime()은 UTC 경과 밀리초를 반환. getTimezoneOffset()은 로컬 시간과 UTC의 차이 (분)
  // KST는 UTC+9. 따라서 로컬 시간 + 로컬 오프셋 + 9시간 = KST 밀리초
  const kstTimeMs =
    baseDate.getTime() + baseDate.getTimezoneOffset() * 60 * 1000 + 9 * 60 * 60 * 1000;
  const kstDateTime = new Date(kstTimeMs); // KST 시간으로 설정된 Date 객체 (정보 추출용)

  let year = kstDateTime.getFullYear();
  let month = kstDateTime.getMonth(); // getMonth()는 0-기반 (0:1월, 11:12월)
  let day = kstDateTime.getDate();
  let hour = kstDateTime.getHours(); // KST 기준 현재 시
  const minutes = kstDateTime.getMinutes();
  const seconds = kstDateTime.getSeconds();

  // console.log(`[1. KST 추출]: ${year}년 ${month + 1}월 ${day}일 ${hour}시 ${minutes}분 ${seconds}초 (KST)`);

  // 2. 시간 반올림/고정 로직 적용
  if ((hour >= 1 && hour <= 4) || (hour === 0 && (minutes > 0 || seconds > 0))) {
    hour = 5;
    // console.log('[2. 로직 적용]: 시간 5시로 고정');
  } else {
    if (minutes > 0 || seconds > 0) {
      hour += 1;
      // console.log(`[2. 로직 적용]: 시간 1시간 증가 -> ${hour}시`);
    }
  }

  // 3. 24시 초과 시 날짜 조정 (새로운 Date 객체 생성 없이 변수만 조정)
  if (hour >= 24) {
    hour -= 24; // 시간을 0-23 범위로 리셋

    // 날짜를 하루 증가시키기 위해 임시 Date 객체를 사용하고,
    // 그 객체에서 변경된 년, 월, 일을 다시 가져옵니다.
    // 이는 윤년, 월말 처리 등을 Date 객체가 알아서 처리하도록 하기 위함입니다.
    const tempDateForDayChange = new Date(year, month, day); // month는 0-기반 그대로
    tempDateForDayChange.setDate(tempDateForDayChange.getDate() + 1); // 하루 증가

    year = tempDateForDayChange.getFullYear();
    month = tempDateForDayChange.getMonth(); // 0-기반 월
    day = tempDateForDayChange.getDate();
    // console.log(`[3. 날짜 조정]: 다음 날로 변경 -> ${year}년 ${month + 1}월 ${day}일`);
  }

  // console.log(`[4. 최종 KST 값]: ${year}년 ${month + 1}월 ${day}일 ${hour}시 00분 00초 (KST)`);

  // 5. 수동으로 ISO String 형식 생성
  const pad = (num: number) => num.toString().padStart(2, '0');

  const formattedYear = year;
  const formattedMonth = pad(month + 1); // 월은 다시 1 더해서 01-12 형식으로
  const formattedDay = pad(day);
  const formattedHour = pad(hour);
  const formattedMinute = pad(0); // 분, 초는 00으로 고정
  const formattedSecond = pad(0);

  // YYYY-MM-DDTHH:MM:SS 형식의 문자열 조합
  const isoString = `${formattedYear}-${formattedMonth}-${formattedDay}T${formattedHour}:${formattedMinute}:${formattedSecond}`;

  // console.log('[5. 최종 ISO String]:', isoString);
  return isoString;
}
