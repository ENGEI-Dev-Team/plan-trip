import type { TimelineItem } from "@/types/timeline";

export type TimelineDayItemInsert = {
  itinerary_id: string;
  day_index: number;
  start_time: string | null;
  end_time: string | null;
  category: string | null;
  title: string;
  memo: string | null;
  cost_jpy: number | null;
  sort_order: number;
};

const normalizeTime = (value: string) => {
  const hhmm = /^\d{2}:\d{2}$/;
  const hhmmss = /^\d{2}:\d{2}:\d{2}$/;
  if (hhmmss.test(value)) return value;
  if (hhmm.test(value)) return `${value}:00`;
  return null;
};

export const toTimelineDayItemInserts = (
  itineraryId: string,
  items: TimelineItem[],
): TimelineDayItemInsert[] => {
  return items.map((item, index) => ({
    itinerary_id: itineraryId,
    day_index: 1,
    start_time: normalizeTime(item.time),
    end_time: null,
    category: item.category ?? "other",
    title: item.title ?? "",
    memo: item.memo ?? null,
    cost_jpy: item.amount ?? 0,
    sort_order: item.orderIndex > 0 ? item.orderIndex : index + 1,
  }));
};
