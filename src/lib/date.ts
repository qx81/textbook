const pad = (n: number) => String(n).padStart(2, '0');

export const toDateKey = (date: Date): string => {
  const y = date.getFullYear();
  const m = pad(date.getMonth() + 1);
  const d = pad(date.getDate());
  return `${y}-${m}-${d}`;
};

export const todayKey = (): string => toDateKey(new Date());

export const tomorrowKey = (): string => {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return toDateKey(date);
};

export const dayAfter = (dateKey: string): string => {
  const date = new Date(`${dateKey}T00:00:00`);
  date.setDate(date.getDate() + 1);
  return toDateKey(date);
};

export const formatDateCN = (dateKey: string): string => {
  const date = new Date(`${dateKey}T00:00:00`);
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  }).format(date);
};
