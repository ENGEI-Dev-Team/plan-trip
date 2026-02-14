import type { ItineraryDraft } from "@/types/itinerory";

export type DayItemInsertRow = {
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

type DraftEventLike = {
  time?: string;
  startTime?: string;
  endTime?: string;
  category?: string;
  activity?: string;
  memo?: string;
  notes?: string;
  costJpy?: number | null;
  sortOrder?: number;
};

const normalizeTime = (value?: string) => {
  if (!value) return null;
  const hhmm = /^\d{2}:\d{2}$/;
  const hhmmss = /^\d{2}:\d{2}:\d{2}$/;
  if (hhmmss.test(value)) return value;
  if (hhmm.test(value)) return `${value}:00`;
  return null;
};

export const buildDayItemInsertRows = (
  itineraryId: string,
  draft: ItineraryDraft,
): DayItemInsertRow[] => {
  return draft.dailySchedules.flatMap((schedule, dayIdx) =>
    schedule.events.map((rawEvent, eventIdx) => {
      const event = rawEvent as DraftEventLike;
      return {
        itinerary_id: itineraryId,
        day_index: dayIdx + 1,
        start_time: normalizeTime(event.startTime ?? event.time),
        end_time: normalizeTime(event.endTime),
        category: event.category ?? "other",
        title: event.activity ?? "",
        memo: event.memo ?? event.notes ?? null,
        cost_jpy: event.costJpy ?? null,
        sort_order: event.sortOrder ?? eventIdx + 1,
      };
    }),
  );
};
