import dayjs from "dayjs";

export function getDateLabelFromDate(date: dayjs.Dayjs): '오늘' | '내일' | '모레' {
  const today = dayjs().startOf('day');
  if (date.isSame(today, 'day')) return '오늘';
  if (date.isSame(today.add(1, 'day'), 'day')) return '내일';
  if (date.isSame(today.add(2, 'day'), 'day')) return '모레';
  return '오늘'; // fallback
}

export function getDayjsFromDateLabel(label: '오늘' | '내일' | '모레'): dayjs.Dayjs {
  const base = dayjs().startOf('day');
  switch (label) {
    case '오늘':
      return base;
    case '내일':
      return base.add(1, 'day');
    case '모레':
      return base.add(2, 'day');
  }
}
