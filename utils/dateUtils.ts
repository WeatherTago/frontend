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
