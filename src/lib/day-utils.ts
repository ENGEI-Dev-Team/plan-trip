export type DayTab = {
  index: number;    // 0始まりの番号
  dateStr: string;  // YYYY-MM-DD形式
  label: string;    // UI表示用ラベル（例: "1日目"）
};

export function buildDays(startDate: string, endDate: string): DayTab[] {
  if (!startDate || !endDate) return [];

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) return [];

  const days: DayTab[] = [];
  const current = new Date(start);
  let index = 0;

  while (current <= end) {
    const y = current.getFullYear();
    const m = String(current.getMonth() + 1).padStart(2, "0");
    const d = String(current.getDate()).padStart(2, "0");

    days.push({
      index,
      dateStr: `${y}-${m}-${d}`,
      label: `${index + 1}日目`,
    });

    current.setDate(current.getDate() + 1);
    index++;
  }

  return days;
}