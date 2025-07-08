export function formatKSTRoundedHour(date = new Date()) {
  // UTC 기준 시간값 추출
  const utc = date.getTime() + date.getTimezoneOffset() * 60 * 1000;

  // KST는 UTC+9
  const kstDate = new Date(utc + 9 * 60 * 60 * 1000);

  let month = kstDate.getMonth() + 1;
  let day = kstDate.getDate();
  let hour = kstDate.getHours();
  const minutes = kstDate.getMinutes();

  if (minutes > 0) {
    hour += 1;
  }

  if (hour === 24) {
    hour = 0;
    kstDate.setDate(kstDate.getDate() + 1);
    month = kstDate.getMonth() + 1;
    day = kstDate.getDate();
  }

  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${pad(month)}/${pad(day)} ${pad(hour)}:00 기준`;
}
